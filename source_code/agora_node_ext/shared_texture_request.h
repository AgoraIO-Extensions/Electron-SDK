#pragma once

#include <cstddef>
#include <cstdint>
#include <string>

namespace agora {
namespace rtc {
namespace electron {

enum class SharedTexturePixelFormat { kUnknown, kBgra, kRgba };

struct SharedTextureRequest {
  uint64_t frame_id;
  uint8_t nt_handle[8];
  std::size_t handle_size;
  uint32_t width;
  uint32_t height;
  int64_t timestamp_us;
  int64_t rtc_timestamp_ms;
  SharedTexturePixelFormat pixel_format;
  bool direct_handle_preview;
};

bool ValidateSharedTextureRequest(const SharedTextureRequest &request,
                                  uint64_t last_frame_id,
                                  std::string &error);

}// namespace electron
}// namespace rtc
}// namespace agora
