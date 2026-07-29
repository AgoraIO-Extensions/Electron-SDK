#include "d3d11_shared_texture_importer.h"

#include <sstream>

namespace agora {
namespace rtc {
namespace electron {

std::string BuildSharedTexturePushJson(const SharedTextureRequest &request) {
  const int pixel_format =
      request.pixel_format == SharedTexturePixelFormat::kBgra ? 2 : 4;
  std::ostringstream json;
  json << "{\"frame\":{\"type\":3,\"format\":" << pixel_format
       << ",\"stride\":" << request.width << ",\"height\":"
       << request.height << ",\"timestamp\":"
       << request.timestamp_us / 1000
       << ",\"textureSliceIndex\":0},\"videoTrackId\":0}";
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

  const std::string json = BuildSharedTexturePushJson(request);
  std::array<void *, 5> buffers = {
      nullptr, nullptr, nullptr, nullptr, matches[0].texture.Get()};
  std::array<unsigned int, 5> lengths = {0, 0, 0, 0, 0};
  ApiParam api_param = {"MediaEngine_pushVideoFrame_4e544e2",
                        json.c_str(),
                        static_cast<unsigned int>(json.size()),
                        nullptr,
                        buffers.data(),
                        lengths.data(),
                        static_cast<unsigned int>(buffers.size())};
  result.result = iris_api_engine->CallIrisApi(&api_param);
  result.adapter_luid = FormatLuid(matches[0].adapter_desc.AdapterLuid);
  if (result.result != 0) {
    error = "Iris pushVideoFrame failed with result " +
            std::to_string(result.result);
    return false;
  }
  return true;
}

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
