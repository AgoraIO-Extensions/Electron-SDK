#pragma once

#include "shared_texture_request.h"

#include <array>
#include <functional>
#include <string>

class IApiEngineBase;

namespace agora {
namespace rtc {
namespace electron {

struct SharedTextureSubmissionResult {
  int transport_result;
  std::string rtc_response;
  std::string adapter_luid;
};

struct SharedTextureCallBuffers {
  std::array<void *, 5> buffers;
  std::array<unsigned int, 5> lengths;
};

using SharedTextureCaller =
    std::function<int(const std::string &, SharedTextureCallBuffers &,
                      std::string &)>;

std::string BuildSharedTexturePushJson(const SharedTextureRequest &request);
SharedTextureCallBuffers BuildSharedTextureCallBuffers(
    const SharedTextureRequest &request);
bool SubmitSharedTextureCall(const SharedTextureRequest &request,
                             const SharedTextureCaller &caller,
                             SharedTextureSubmissionResult &result,
                             std::string &error);

#if defined(_WIN32)
bool SubmitSharedD3D11Texture(const SharedTextureRequest &request,
                              IApiEngineBase *iris_api_engine,
                              SharedTextureSubmissionResult &result,
                              std::string &error);
#endif

}// namespace electron
}// namespace rtc
}// namespace agora
