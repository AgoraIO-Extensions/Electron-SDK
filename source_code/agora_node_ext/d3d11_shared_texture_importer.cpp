#include "d3d11_shared_texture_importer.h"
#include "iris_engine_base.h"

#include <cstdint>
#include <cstring>
#include <sstream>

namespace agora {
namespace rtc {
namespace electron {

std::string BuildSharedTexturePushJson(const SharedTextureRequest &request) {
  const int format =
      request.pixel_format == SharedTexturePixelFormat::kBgra ? 2 : 4;
  std::ostringstream json;
  json << "{\"frame\":{\"format\":" << format << ",\"width\":" << request.width
       << ",\"height\":" << request.height
       << ",\"timestamp\":" << request.rtc_timestamp_ms << "},"
       << "\"videoTrackId\":0}";
  return json.str();
}

SharedTextureCallBuffers
BuildSharedTextureCallBuffers(const SharedTextureRequest &request) {
  uintptr_t handle_value = 0;
  static_assert(sizeof(handle_value) == sizeof(request.native_handle),
                "The PoC supports only 64-bit native handles");
  std::memcpy(&handle_value, request.native_handle, sizeof(handle_value));
  return {{{reinterpret_cast<void *>(handle_value), nullptr, nullptr, nullptr,
            nullptr}},
          {{0, 0, 0, 0, 0}}};
}

bool SubmitSharedTextureCall(const SharedTextureRequest &request,
                             const SharedTextureCaller &caller,
                             SharedTextureSubmissionResult &result,
                             std::string &error) {
  const std::string json = BuildSharedTexturePushJson(request);
  auto call_buffers = BuildSharedTextureCallBuffers(request);
  result.transport_result = caller(json, call_buffers, result.rtc_response);
  if (result.transport_result != 0) {
    error = "Iris pushSharedTexture transport failed with result "
        + std::to_string(result.transport_result);
    return false;
  }
  return true;
}

bool SubmitSharedTextureToIris(const SharedTextureRequest &request,
                               IApiEngineBase *iris_api_engine,
                               SharedTextureSubmissionResult &result,
                               std::string &error) {
  if (iris_api_engine == nullptr) {
    error = "Iris API engine is not initialized";
    return false;
  }
  result.adapter_luid.clear();
  return SubmitSharedTextureCall(
      request,
      [iris_api_engine](const std::string &json,
                        SharedTextureCallBuffers &call_buffers,
                        std::string &rtc_response) {
        ApiParam api_param = {
            "MediaEngine_pushSharedTexture",
            json.c_str(),
            static_cast<unsigned int>(json.size()),
            nullptr,
            call_buffers.buffers.data(),
            call_buffers.lengths.data(),
            static_cast<unsigned int>(call_buffers.buffers.size())};
        const int transport_result = iris_api_engine->CallIrisApi(&api_param);
        rtc_response = api_param.result == nullptr ? "" : api_param.result;
        return transport_result;
      },
      result, error);
}

}// namespace electron
}// namespace rtc
}// namespace agora

#if defined(_WIN32)

namespace agora {
namespace rtc {
namespace electron {

bool SubmitSharedD3D11Texture(const SharedTextureRequest &request,
                              IApiEngineBase *iris_api_engine,
                              SharedTextureSubmissionResult &result,
                              std::string &error) {
  return SubmitSharedTextureToIris(request, iris_api_engine, result, error);
}

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
