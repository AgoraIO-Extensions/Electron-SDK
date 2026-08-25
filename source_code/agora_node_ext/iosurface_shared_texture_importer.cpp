#include "iosurface_shared_texture_importer.h"

#if defined(__APPLE__)

#include "iris_engine_base.h"

#include <IOSurface/IOSurface.h>

#include <array>
#include <cstring>
#include <limits>
#include <sstream>

namespace agora {
namespace rtc {
namespace electron {

namespace {

bool ReadIOSurfaceInfo(const SharedTextureRequest &request,
                       uint32_t &iosurface_id, uint32_t &stride_in_pixels,
                       std::string &error) {
  uintptr_t value = 0;
  static_assert(sizeof(value) == sizeof(request.native_handle),
                "The PoC supports only 64-bit native handles");
  std::memcpy(&value, request.native_handle, sizeof(value));
  const bool looked_up = request.iosurface_id != 0;
  auto surface = looked_up
                     ? IOSurfaceLookup(request.iosurface_id)
                     : reinterpret_cast<IOSurfaceRef>(value);
  if (surface == nullptr) {
    error = looked_up ? "IOSurfaceLookup failed"
                      : "ioSurface contains a null IOSurfaceRef";
    return false;
  }

  const size_t width = IOSurfaceGetWidth(surface);
  const size_t height = IOSurfaceGetHeight(surface);
  const size_t bytes_per_row = IOSurfaceGetBytesPerRow(surface);
  if (width != request.width || height != request.height) {
    if (looked_up) { CFRelease(surface); }
    error = "IOSurface dimensions do not match Electron textureInfo";
    return false;
  }
  if (bytes_per_row == 0 || bytes_per_row % 4 != 0
      || bytes_per_row / 4 > std::numeric_limits<uint32_t>::max()) {
    if (looked_up) { CFRelease(surface); }
    error = "IOSurface BGRA/RGBA stride is invalid";
    return false;
  }

  iosurface_id = IOSurfaceGetID(surface);
  if (looked_up) { CFRelease(surface); }
  if (iosurface_id == 0) {
    error = "IOSurfaceGetID returned 0";
    return false;
  }
  stride_in_pixels = static_cast<uint32_t>(bytes_per_row / 4);
  return true;
}

}// namespace

std::string BuildIOSurfaceTexturePushJson(const SharedTextureRequest &request,
                                          uint32_t iosurface_id,
                                          uint32_t stride_in_pixels) {
  const int format =
      request.pixel_format == SharedTexturePixelFormat::kBgra ? 14 : 4;
  std::ostringstream json;
  json << "{\"frame\":{\"type\":3,\"format\":" << format
       << ",\"stride\":" << stride_in_pixels << ",\"height\":" << request.height
       << ",\"rotation\":0,\"timestamp\":" << request.rtc_timestamp_ms
       << ",\"iosurfaceId\":" << iosurface_id << "},\"videoTrackId\":0}";
  return json.str();
}

bool SubmitSharedIOSurfaceTexture(const SharedTextureRequest &request,
                                  IApiEngineBase *iris_api_engine,
                                  SharedTextureSubmissionResult &result,
                                  std::string &error) {
  if (iris_api_engine == nullptr) {
    error = "Iris API engine is not initialized";
    return false;
  }

  uint32_t iosurface_id = 0;
  uint32_t stride_in_pixels = 0;
  if (!ReadIOSurfaceInfo(request, iosurface_id, stride_in_pixels, error)) {
    return false;
  }

  const std::string json =
      BuildIOSurfaceTexturePushJson(request, iosurface_id, stride_in_pixels);
  std::array<void *, 5> buffers{{nullptr, nullptr, nullptr, nullptr, nullptr}};
  std::array<unsigned int, 5> lengths{{0, 0, 0, 0, 0}};
  ApiParam api_param = {"MediaEngine_pushVideoFrame_4e544e2",
                        json.c_str(),
                        static_cast<unsigned int>(json.size()),
                        nullptr,
                        buffers.data(),
                        lengths.data(),
                        static_cast<unsigned int>(buffers.size())};
  result.transport_result = iris_api_engine->CallIrisApi(&api_param);
  result.rtc_response = api_param.result == nullptr ? "" : api_param.result;
  result.adapter_luid.clear();
  if (result.transport_result != 0) {
    error = "Iris pushVideoFrame transport failed with result "
        + std::to_string(result.transport_result);
    return false;
  }
  error.clear();
  return true;
}

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
