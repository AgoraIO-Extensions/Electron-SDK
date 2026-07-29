#include "shared_texture_request.h"

namespace agora {
namespace rtc {
namespace electron {

namespace {
constexpr uint32_t kMaxTextureDimension = 16384;
}

bool ValidateSharedTextureRequest(const SharedTextureRequest &request,
                                  uint64_t last_frame_id,
                                  std::string &error) {
  if (request.handle_size != sizeof(request.nt_handle)) {
    error = "ntHandle must contain exactly 8 bytes";
    return false;
  }
  if (request.width == 0 || request.width > kMaxTextureDimension ||
      request.height == 0 || request.height > kMaxTextureDimension) {
    error = "texture dimensions must be between 1 and 16384";
    return false;
  }
  if (request.timestamp_us < 0) {
    error = "timestampUs must be nonnegative";
    return false;
  }
  if (request.frame_id <= last_frame_id) {
    error = "frameId must increase monotonically";
    return false;
  }
  if (request.pixel_format != SharedTexturePixelFormat::kBgra &&
      request.pixel_format != SharedTexturePixelFormat::kRgba) {
    error = "pixelFormat must be bgra or rgba";
    return false;
  }
  error.clear();
  return true;
}

}// namespace electron
}// namespace rtc
}// namespace agora
