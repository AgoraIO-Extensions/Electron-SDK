#pragma once

#include "d3d11_shared_texture_importer.h"

#if defined(__APPLE__)

#include <cstdint>
#include <string>

namespace agora {
namespace rtc {
namespace electron {

bool SubmitSharedIOSurfaceTexture(const SharedTextureRequest &request,
                                  IApiEngineBase *iris_api_engine,
                                  SharedTextureSubmissionResult &result,
                                  std::string &error);

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
