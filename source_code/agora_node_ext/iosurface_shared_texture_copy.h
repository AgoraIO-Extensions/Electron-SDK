#pragma once

#include "shared_texture_request.h"

#include <cstddef>
#include <cstdint>
#include <string>

namespace agora {
namespace rtc {
namespace electron {

bool CreateGlobalIOSurfaceGpuCopy(const uint8_t *native_handle,
                                  std::size_t handle_size,
                                  SharedTexturePixelFormat pixel_format,
                                  uint32_t &iosurface_id,
                                  void *&retained_surface, std::string &error);

#if defined(__APPLE__)
void ReleaseGlobalIOSurface(void *retained_surface);
#else
inline void ReleaseGlobalIOSurface(void *) {}
#endif

}// namespace electron
}// namespace rtc
}// namespace agora
