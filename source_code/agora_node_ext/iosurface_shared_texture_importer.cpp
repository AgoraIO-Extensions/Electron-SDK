#include "iosurface_shared_texture_importer.h"

#if defined(__APPLE__)

#include "iris_engine_base.h"

#include <IOSurface/IOSurface.h>

#include <cstring>
#include <limits>

namespace agora {
namespace rtc {
namespace electron {

namespace {

bool ReadIOSurfaceInfo(const SharedTextureRequest &request,
                       uint32_t &iosurface_id, std::string &error) {
  uintptr_t value = 0;
  static_assert(sizeof(value) == sizeof(request.native_handle),
                "The PoC supports only 64-bit native handles");
  std::memcpy(&value, request.native_handle, sizeof(value));
  const bool looked_up = request.iosurface_id != 0;
  auto surface = looked_up ? IOSurfaceLookup(request.iosurface_id)
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
  return true;
}

}// namespace

bool SubmitSharedIOSurfaceTexture(const SharedTextureRequest &request,
                                  IApiEngineBase *iris_api_engine,
                                  SharedTextureSubmissionResult &result,
                                  std::string &error) {
  if (iris_api_engine == nullptr) {
    error = "Iris API engine is not initialized";
    return false;
  }

  uint32_t iosurface_id = 0;
  if (!ReadIOSurfaceInfo(request, iosurface_id, error)) { return false; }
  SharedTextureRequest iris_request = request;
  const uintptr_t handle_value = iosurface_id;
  std::memcpy(iris_request.native_handle, &handle_value, sizeof(handle_value));
  return SubmitSharedTextureToIris(iris_request, iris_api_engine, result,
                                   error);
}

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
