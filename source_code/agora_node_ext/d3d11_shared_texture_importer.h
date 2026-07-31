#pragma once

#include "shared_texture_request.h"

#include <array>
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

std::string BuildSharedTexturePushJson(const SharedTextureRequest &request);
SharedTextureCallBuffers BuildSharedTextureCallBuffers(void *texture);

#if defined(_WIN32)
bool SubmitSharedD3D11Texture(const SharedTextureRequest &request,
                              IApiEngineBase *iris_api_engine,
                              SharedTextureSubmissionResult &result,
                              std::string &error);
#endif

}// namespace electron
}// namespace rtc
}// namespace agora
