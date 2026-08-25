#include "d3d11_shared_texture_preview.h"

#if defined(_WIN32)

#include <d3d11_1.h>
#include <dxgi1_2.h>
#include <windows.h>
#include <wrl/client.h>

#include <cstdint>
#include <cstring>
#include <iomanip>
#include <sstream>

namespace agora {
namespace rtc {
namespace electron {

namespace {

using Microsoft::WRL::ComPtr;

constexpr wchar_t kPreviewWindowClass[] =
    L"AgoraElectronSharedTexturePreviewWindow";
constexpr wchar_t kPreviewWindowTitle[] =
    L"Raw Electron NT Handle Preview";
constexpr ULONGLONG kCopyTimeoutMs = 250;

std::string HResultError(const char *operation, HRESULT result) {
  std::ostringstream message;
  message << operation << " failed (HRESULT 0x" << std::hex << std::setw(8)
          << std::setfill('0') << static_cast<uint32_t>(result) << ')';
  return message.str();
}

HANDLE DecodeHandle(const SharedTextureRequest &request) {
  uintptr_t value = 0;
  static_assert(sizeof(value) == sizeof(request.native_handle),
                "The preview supports only 64-bit native handles");
  std::memcpy(&value, request.native_handle, sizeof(value));
  return reinterpret_cast<HANDLE>(value);
}

DXGI_FORMAT ExpectedFormat(const SharedTextureRequest &request) {
  return request.pixel_format == SharedTexturePixelFormat::kBgra
             ? DXGI_FORMAT_B8G8R8A8_UNORM
             : DXGI_FORMAT_R8G8B8A8_UNORM;
}

bool ValidateDescriptor(const SharedTextureRequest &request,
                        const D3D11_TEXTURE2D_DESC &descriptor,
                        std::string &error) {
  if (descriptor.Width != request.width ||
      descriptor.Height != request.height) {
    error = "preview texture dimensions do not match paint metadata";
    return false;
  }
  if (descriptor.Format != ExpectedFormat(request)) {
    error = "preview texture DXGI format does not match paint metadata";
    return false;
  }
  if (descriptor.ArraySize == 0 || descriptor.SampleDesc.Count != 1) {
    error = "preview supports only non-multisampled D3D11 textures";
    return false;
  }
  if ((descriptor.MiscFlags & D3D11_RESOURCE_MISC_SHARED_NTHANDLE) == 0) {
    error = "preview texture is not backed by an NT shared handle";
    return false;
  }
  return true;
}

LRESULT CALLBACK PreviewWindowProc(HWND window, UINT message, WPARAM wparam,
                                   LPARAM lparam) {
  if (message == WM_CLOSE) {
    ShowWindow(window, SW_HIDE);
    return 0;
  }
  if (message == WM_ERASEBKGND) { return 1; }
  return DefWindowProcW(window, message, wparam, lparam);
}

class SharedTexturePreview {
 public:
  ~SharedTexturePreview() { Close(); }

  bool Render(const SharedTextureRequest &request, std::string &error) {
    ComPtr<ID3D11Texture2D> texture;
    D3D11_TEXTURE2D_DESC descriptor{};
    if (!OpenTexture(request, texture, descriptor, error)) { return false; }
    if (!EnsureWindow(descriptor.Width, descriptor.Height, error) ||
        !EnsureSwapChain(descriptor, error)) {
      return false;
    }

    ComPtr<ID3D11Texture2D> back_buffer;
    HRESULT result = swap_chain_->GetBuffer(0, IID_PPV_ARGS(&back_buffer));
    if (FAILED(result)) {
      error = HResultError("IDXGISwapChain1::GetBuffer", result);
      return false;
    }

    context_->CopySubresourceRegion(back_buffer.Get(), 0, 0, 0, 0,
                                    texture.Get(), 0, nullptr);
    if (!WaitForCopy(error)) { return false; }

    result = swap_chain_->Present(0, 0);
    if (FAILED(result)) {
      error = HResultError("IDXGISwapChain1::Present", result);
      return false;
    }
    return true;
  }

  void Close() {
    ResetDevice();
    if (window_ != nullptr && IsWindow(window_)) { DestroyWindow(window_); }
    window_ = nullptr;
    width_ = 0;
    height_ = 0;
  }

 private:
  bool OpenTexture(const SharedTextureRequest &request,
                   ComPtr<ID3D11Texture2D> &texture,
                   D3D11_TEXTURE2D_DESC &descriptor, std::string &error) {
    const HANDLE handle = DecodeHandle(request);
    if (device1_) {
      HRESULT result = device1_->OpenSharedResource1(
          handle, IID_PPV_ARGS(&texture));
      if (SUCCEEDED(result)) {
        texture->GetDesc(&descriptor);
        return ValidateDescriptor(request, descriptor, error);
      }
      ResetDevice();
    }

    ComPtr<IDXGIFactory1> factory;
    HRESULT result = CreateDXGIFactory1(IID_PPV_ARGS(&factory));
    if (FAILED(result)) {
      error = HResultError("CreateDXGIFactory1", result);
      return false;
    }

    for (UINT index = 0;; ++index) {
      ComPtr<IDXGIAdapter1> adapter;
      result = factory->EnumAdapters1(index, &adapter);
      if (result == DXGI_ERROR_NOT_FOUND) { break; }
      if (FAILED(result)) {
        error = HResultError("IDXGIFactory1::EnumAdapters1", result);
        return false;
      }

      DXGI_ADAPTER_DESC1 adapter_descriptor{};
      if (FAILED(adapter->GetDesc1(&adapter_descriptor)) ||
          (adapter_descriptor.Flags & DXGI_ADAPTER_FLAG_SOFTWARE) != 0) {
        continue;
      }

      ComPtr<ID3D11Device> device;
      ComPtr<ID3D11DeviceContext> context;
      result = D3D11CreateDevice(
          adapter.Get(), D3D_DRIVER_TYPE_UNKNOWN, nullptr,
          D3D11_CREATE_DEVICE_BGRA_SUPPORT, nullptr, 0, D3D11_SDK_VERSION,
          &device, nullptr, &context);
      if (FAILED(result)) { continue; }

      ComPtr<ID3D11Device1> device1;
      if (FAILED(device.As(&device1))) { continue; }

      ComPtr<ID3D11Texture2D> candidate;
      result = device1->OpenSharedResource1(handle,
                                            IID_PPV_ARGS(&candidate));
      if (FAILED(result)) { continue; }

      candidate->GetDesc(&descriptor);
      if (!ValidateDescriptor(request, descriptor, error)) { return false; }

      device_ = device;
      device1_ = device1;
      context_ = context;
      adapter_ = adapter;
      texture = candidate;
      return true;
    }

    error = "no D3D11 adapter could open the preview texture";
    return false;
  }

  bool EnsureWindow(UINT width, UINT height, std::string &error) {
    if (window_ != nullptr && !IsWindow(window_)) { window_ = nullptr; }

    const HINSTANCE instance = GetModuleHandleW(nullptr);
    if (window_ == nullptr) {
      WNDCLASSEXW window_class{};
      window_class.cbSize = sizeof(window_class);
      window_class.lpfnWndProc = PreviewWindowProc;
      window_class.hInstance = instance;
      window_class.hCursor = LoadCursor(nullptr, IDC_ARROW);
      window_class.hbrBackground =
          reinterpret_cast<HBRUSH>(COLOR_WINDOW + 1);
      window_class.lpszClassName = kPreviewWindowClass;
      if (RegisterClassExW(&window_class) == 0 &&
          GetLastError() != ERROR_CLASS_ALREADY_EXISTS) {
        error = "RegisterClassExW failed for shared texture preview";
        return false;
      }

      RECT window_rect{0, 0, static_cast<LONG>(width),
                       static_cast<LONG>(height)};
      const DWORD style = WS_OVERLAPPEDWINDOW;
      const DWORD extended_style = WS_EX_APPWINDOW;
      AdjustWindowRectEx(&window_rect, style, FALSE, extended_style);
      window_ = CreateWindowExW(
          extended_style, kPreviewWindowClass, kPreviewWindowTitle, style,
          CW_USEDEFAULT, CW_USEDEFAULT, window_rect.right - window_rect.left,
          window_rect.bottom - window_rect.top, nullptr, nullptr, instance,
          nullptr);
      if (window_ == nullptr) {
        error = "CreateWindowExW failed for shared texture preview";
        return false;
      }
      ShowWindow(window_, SW_SHOWNOACTIVATE);
      UpdateWindow(window_);
    } else if (width_ != width || height_ != height) {
      RECT window_rect{0, 0, static_cast<LONG>(width),
                       static_cast<LONG>(height)};
      const DWORD style = static_cast<DWORD>(GetWindowLongPtrW(
          window_, GWL_STYLE));
      const DWORD extended_style = static_cast<DWORD>(GetWindowLongPtrW(
          window_, GWL_EXSTYLE));
      AdjustWindowRectEx(&window_rect, style, FALSE, extended_style);
      SetWindowPos(window_, nullptr, 0, 0,
                   window_rect.right - window_rect.left,
                   window_rect.bottom - window_rect.top,
                   SWP_NOMOVE | SWP_NOZORDER | SWP_NOACTIVATE);
    }
    return true;
  }

  bool EnsureSwapChain(const D3D11_TEXTURE2D_DESC &descriptor,
                       std::string &error) {
    if (swap_chain_ && width_ == descriptor.Width &&
        height_ == descriptor.Height && format_ == descriptor.Format) {
      return true;
    }

    swap_chain_.Reset();
    copy_query_.Reset();

    ComPtr<IDXGIFactory2> factory;
    HRESULT result = adapter_->GetParent(IID_PPV_ARGS(&factory));
    if (FAILED(result)) {
      error = HResultError("IDXGIAdapter1::GetParent", result);
      return false;
    }

    DXGI_SWAP_CHAIN_DESC1 swap_descriptor{};
    swap_descriptor.Width = descriptor.Width;
    swap_descriptor.Height = descriptor.Height;
    swap_descriptor.Format = descriptor.Format;
    swap_descriptor.SampleDesc.Count = 1;
    swap_descriptor.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
    swap_descriptor.BufferCount = 2;
    swap_descriptor.Scaling = DXGI_SCALING_STRETCH;
    swap_descriptor.SwapEffect = DXGI_SWAP_EFFECT_FLIP_SEQUENTIAL;
    swap_descriptor.AlphaMode = DXGI_ALPHA_MODE_IGNORE;
    result = factory->CreateSwapChainForHwnd(
        device_.Get(), window_, &swap_descriptor, nullptr, nullptr,
        &swap_chain_);
    if (FAILED(result)) {
      error = HResultError("IDXGIFactory2::CreateSwapChainForHwnd", result);
      return false;
    }
    factory->MakeWindowAssociation(window_, DXGI_MWA_NO_ALT_ENTER);

    D3D11_QUERY_DESC query_descriptor{};
    query_descriptor.Query = D3D11_QUERY_EVENT;
    result = device_->CreateQuery(&query_descriptor, &copy_query_);
    if (FAILED(result)) {
      error = HResultError("ID3D11Device::CreateQuery", result);
      return false;
    }

    width_ = descriptor.Width;
    height_ = descriptor.Height;
    format_ = descriptor.Format;
    return true;
  }

  bool WaitForCopy(std::string &error) {
    context_->End(copy_query_.Get());
    context_->Flush();
    const ULONGLONG started = GetTickCount64();
    for (;;) {
      BOOL complete = FALSE;
      const HRESULT result = context_->GetData(
          copy_query_.Get(), &complete, sizeof(complete), 0);
      if (result == S_OK && complete) { return true; }
      if (FAILED(result)) {
        error = HResultError("ID3D11DeviceContext::GetData", result);
        return false;
      }
      if (GetTickCount64() - started > kCopyTimeoutMs) {
        error = "shared texture preview GPU copy timed out";
        return false;
      }
      Sleep(0);
    }
  }

  void ResetDevice() {
    copy_query_.Reset();
    swap_chain_.Reset();
    context_.Reset();
    device1_.Reset();
    device_.Reset();
    adapter_.Reset();
    width_ = 0;
    height_ = 0;
    format_ = DXGI_FORMAT_UNKNOWN;
  }

  HWND window_ = nullptr;
  UINT width_ = 0;
  UINT height_ = 0;
  DXGI_FORMAT format_ = DXGI_FORMAT_UNKNOWN;
  ComPtr<IDXGIAdapter1> adapter_;
  ComPtr<ID3D11Device> device_;
  ComPtr<ID3D11Device1> device1_;
  ComPtr<ID3D11DeviceContext> context_;
  ComPtr<IDXGISwapChain1> swap_chain_;
  ComPtr<ID3D11Query> copy_query_;
};

SharedTexturePreview &Preview() {
  static SharedTexturePreview preview;
  return preview;
}

}// namespace

bool RenderSharedD3D11TexturePreview(const SharedTextureRequest &request,
                                     std::string &error) {
  return Preview().Render(request, error);
}

void CloseSharedD3D11TexturePreview() { Preview().Close(); }

}// namespace electron
}// namespace rtc
}// namespace agora

#else

namespace agora {
namespace rtc {
namespace electron {

bool RenderSharedD3D11TexturePreview(const SharedTextureRequest &,
                                     std::string &error) {
  error = "D3D11 shared texture preview is supported only on Windows";
  return false;
}

void CloseSharedD3D11TexturePreview() {}

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
