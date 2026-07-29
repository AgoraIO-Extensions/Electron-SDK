#include "d3d11_shared_texture_importer.h"

#include <sstream>

namespace agora {
namespace rtc {
namespace electron {

std::string BuildSharedTexturePushJson(const SharedTextureRequest &request) {
  const int pixel_format =
      request.pixel_format == SharedTexturePixelFormat::kBgra ? 2 : 4;
  std::ostringstream json;
  json << "{\"frame\":{\"type\":1,\"format\":" << pixel_format
       << ",\"stride\":" << request.width << ",\"height\":"
       << request.height
       // Electron timestamps are process-relative; zero lets the RTC SDK assign
       // an NTP-aligned capture timestamp instead of treating them as old frames.
       << ",\"timestamp\":0},\"videoTrackId\":0}";
  return json.str();
}

}// namespace electron
}// namespace rtc
}// namespace agora

#if defined(_WIN32)

#include "iris_engine_base.h"

#include <d3d11_1.h>
#include <dxgi1_2.h>
#include <wrl/client.h>

#include <array>
#include <cstring>
#include <cstdint>
#include <iomanip>
#include <vector>

namespace agora {
namespace rtc {
namespace electron {

namespace {

using Microsoft::WRL::ComPtr;

struct OpenedTexture {
  ComPtr<ID3D11Device> device;
  ComPtr<ID3D11Texture2D> texture;
  DXGI_ADAPTER_DESC1 adapter_desc{};
};

bool ReadTexturePixels(const OpenedTexture &opened,
                       const D3D11_TEXTURE2D_DESC &source_desc,
                       std::vector<uint8_t> &pixels, std::string &error) {
  D3D11_TEXTURE2D_DESC staging_desc = source_desc;
  staging_desc.Usage = D3D11_USAGE_STAGING;
  staging_desc.BindFlags = 0;
  staging_desc.CPUAccessFlags = D3D11_CPU_ACCESS_READ;
  staging_desc.MiscFlags = 0;

  ComPtr<ID3D11Texture2D> staging_texture;
  HRESULT hr = opened.device->CreateTexture2D(&staging_desc, nullptr,
                                               &staging_texture);
  if (FAILED(hr)) {
    error = "failed to create a D3D11 staging texture";
    return false;
  }

  ComPtr<ID3D11DeviceContext> context;
  opened.device->GetImmediateContext(&context);
  if (!context) {
    error = "failed to get the D3D11 immediate context";
    return false;
  }
  context->CopyResource(staging_texture.Get(), opened.texture.Get());

  D3D11_MAPPED_SUBRESOURCE mapped{};
  hr = context->Map(staging_texture.Get(), 0, D3D11_MAP_READ, 0, &mapped);
  if (FAILED(hr)) {
    error = "failed to map the D3D11 staging texture";
    return false;
  }

  const std::size_t row_size = static_cast<std::size_t>(source_desc.Width) * 4;
  pixels.resize(row_size * source_desc.Height);
  const auto *source = static_cast<const uint8_t *>(mapped.pData);
  for (UINT row = 0; row < source_desc.Height; ++row) {
    std::memcpy(pixels.data() + row * row_size,
                source + row * mapped.RowPitch, row_size);
  }
  context->Unmap(staging_texture.Get(), 0);
  return true;
}

std::string FormatLuid(const LUID &luid) {
  std::ostringstream stream;
  stream << std::hex << std::setfill('0') << std::setw(8)
         << static_cast<uint32_t>(luid.HighPart) << ':' << std::setw(8)
         << luid.LowPart;
  return stream.str();
}

HANDLE DecodeHandle(const SharedTextureRequest &request) {
  uintptr_t value = 0;
  static_assert(sizeof(value) == sizeof(request.nt_handle),
                "The PoC supports only Windows x64 handles");
  std::memcpy(&value, request.nt_handle, sizeof(value));
  return reinterpret_cast<HANDLE>(value);
}

bool ValidateDescriptor(const SharedTextureRequest &request,
                        const D3D11_TEXTURE2D_DESC &desc,
                        std::string &error) {
  if (desc.Width != request.width || desc.Height != request.height) {
    error = "opened texture dimensions do not match the paint metadata";
    return false;
  }

  const DXGI_FORMAT expected =
      request.pixel_format == SharedTexturePixelFormat::kBgra
          ? DXGI_FORMAT_B8G8R8A8_UNORM
          : DXGI_FORMAT_R8G8B8A8_UNORM;
  if (desc.Format != expected) {
    error = "opened texture DXGI format does not match pixelFormat";
    return false;
  }
  if ((desc.MiscFlags & D3D11_RESOURCE_MISC_SHARED_NTHANDLE) == 0) {
    error = "opened texture is not an NT-handle shared resource";
    return false;
  }
  return true;
}

}// namespace

bool SubmitSharedD3D11Texture(const SharedTextureRequest &request,
                              IApiEngineBase *iris_api_engine,
                              SharedTextureSubmissionResult &result,
                              std::string &error) {
  if (iris_api_engine == nullptr) {
    error = "Iris API engine is not initialized";
    return false;
  }

  ComPtr<IDXGIFactory1> factory;
  HRESULT hr = CreateDXGIFactory1(IID_PPV_ARGS(&factory));
  if (FAILED(hr)) {
    error = "CreateDXGIFactory1 failed";
    return false;
  }

  const HANDLE handle = DecodeHandle(request);
  std::vector<OpenedTexture> matches;
  for (UINT index = 0;; ++index) {
    ComPtr<IDXGIAdapter1> adapter;
    hr = factory->EnumAdapters1(index, &adapter);
    if (hr == DXGI_ERROR_NOT_FOUND) { break; }
    if (FAILED(hr)) {
      error = "DXGI adapter enumeration failed";
      return false;
    }

    DXGI_ADAPTER_DESC1 adapter_desc{};
    if (FAILED(adapter->GetDesc1(&adapter_desc)) ||
        (adapter_desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE) != 0) {
      continue;
    }

    ComPtr<ID3D11Device> device;
    D3D_FEATURE_LEVEL feature_level;
    hr = D3D11CreateDevice(adapter.Get(), D3D_DRIVER_TYPE_UNKNOWN, nullptr,
                           D3D11_CREATE_DEVICE_BGRA_SUPPORT, nullptr, 0,
                           D3D11_SDK_VERSION, &device, &feature_level, nullptr);
    if (FAILED(hr)) { continue; }

    ComPtr<ID3D11Device1> device1;
    if (FAILED(device.As(&device1))) { continue; }

    ComPtr<ID3D11Texture2D> texture;
    hr = device1->OpenSharedResource1(handle, IID_PPV_ARGS(&texture));
    if (SUCCEEDED(hr)) {
      matches.push_back({device, texture, adapter_desc});
    }
  }

  if (matches.empty()) {
    error = "no D3D11 adapter could open the shared texture";
    return false;
  }
  if (matches.size() != 1) {
    error = "more than one D3D11 adapter opened the shared texture";
    return false;
  }

  D3D11_TEXTURE2D_DESC texture_desc{};
  matches[0].texture->GetDesc(&texture_desc);
  if (!ValidateDescriptor(request, texture_desc, error)) { return false; }

  std::vector<uint8_t> pixels;
  if (!ReadTexturePixels(matches[0], texture_desc, pixels, error)) {
    return false;
  }

  const std::string json = BuildSharedTexturePushJson(request);
  std::array<void *, 5> buffers = {pixels.data(), nullptr, nullptr, nullptr,
                                    nullptr};
  std::array<unsigned int, 5> lengths = {
      static_cast<unsigned int>(pixels.size()), 0, 0, 0, 0};
  ApiParam api_param = {"MediaEngine_pushVideoFrame_4e544e2",
                        json.c_str(),
                        static_cast<unsigned int>(json.size()),
                        nullptr,
                        buffers.data(),
                        lengths.data(),
                        static_cast<unsigned int>(buffers.size())};
  result.transport_result = iris_api_engine->CallIrisApi(&api_param);
  result.rtc_response = api_param.result == nullptr ? "" : api_param.result;
  result.adapter_luid = FormatLuid(matches[0].adapter_desc.AdapterLuid);
  if (result.transport_result != 0) {
    error = "Iris pushVideoFrame transport failed with result " +
            std::to_string(result.transport_result);
    return false;
  }
  return true;
}

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
