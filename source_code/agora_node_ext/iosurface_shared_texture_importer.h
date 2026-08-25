#pragma once

#include "d3d11_shared_texture_importer.h"

#if defined(__APPLE__)

#include <cstdint>
#include <string>

namespace agora {
namespace rtc {
namespace electron {

std::string BuildIOSurfaceTexturePushJson(const SharedTextureRequest &request,
                                          uint32_t iosurface_id,
                                          uint32_t stride_in_pixels);
bool SubmitSharedIOSurfaceTexture(const SharedTextureRequest &request,
                                  IApiEngineBase *iris_api_engine,
                                  SharedTextureSubmissionResult &result,
                                  std::string &error);

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
