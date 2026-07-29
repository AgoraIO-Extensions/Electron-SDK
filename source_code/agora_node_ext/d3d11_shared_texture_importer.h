#pragma once

#include "shared_texture_request.h"

#include <string>

class IApiEngineBase;

namespace agora {
namespace rtc {
namespace electron {

struct SharedTextureSubmissionResult {
  int result;
  std::string adapter_luid;
};

std::string BuildSharedTexturePushJson(const SharedTextureRequest &request);

#if defined(_WIN32)
bool SubmitSharedD3D11Texture(const SharedTextureRequest &request,
                              IApiEngineBase *iris_api_engine,
                              SharedTextureSubmissionResult &result,
                              std::string &error);
#endif

}// namespace electron
}// namespace rtc
}// namespace agora
