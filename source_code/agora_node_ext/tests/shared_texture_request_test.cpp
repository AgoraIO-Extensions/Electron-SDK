#include "../shared_texture_request.h"
#include "../d3d11_shared_texture_importer.h"

#ifdef NDEBUG
#undef NDEBUG
#endif
#include <cassert>
#include <cstdint>
#include <cstring>
#include <iostream>

using agora::rtc::electron::SharedTexturePixelFormat;
using agora::rtc::electron::SharedTextureRequest;
using agora::rtc::electron::SharedTextureSubmissionResult;
using agora::rtc::electron::ValidateSharedTextureRequest;
using agora::rtc::electron::BuildSharedTexturePushJson;
using agora::rtc::electron::BuildSharedTextureCallBuffers;
using agora::rtc::electron::SubmitSharedTextureCall;

namespace {

SharedTextureRequest ValidRequest() {
  SharedTextureRequest request{};
  request.frame_id = 1;
  request.handle_size = 8;
  request.width = 1920;
  request.height = 1080;
  request.timestamp_us = 123456;
  request.rtc_timestamp_ms = 4242;
  request.pixel_format = SharedTexturePixelFormat::kBgra;
  return request;
}

void ExpectInvalid(const SharedTextureRequest &request) {
  std::string error;
  assert(!ValidateSharedTextureRequest(request, 0, error));
  assert(!error.empty());
}

}// namespace

int main() {
  std::string error;
  auto request = ValidRequest();
  assert(ValidateSharedTextureRequest(request, 0, error));

  request = ValidRequest();
  request.handle_size = 4;
  ExpectInvalid(request);

  request = ValidRequest();
  request.width = 0;
  ExpectInvalid(request);

  request = ValidRequest();
  request.height = 16385;
  ExpectInvalid(request);

  request = ValidRequest();
  request.timestamp_us = -1;
  ExpectInvalid(request);

  request = ValidRequest();
  request.rtc_timestamp_ms = -1;
  ExpectInvalid(request);

  request = ValidRequest();
  request.frame_id = 7;
  assert(!ValidateSharedTextureRequest(request, 7, error));

  request = ValidRequest();
  request.pixel_format = SharedTexturePixelFormat::kUnknown;
  ExpectInvalid(request);

  request = ValidRequest();
  request.pixel_format = SharedTexturePixelFormat::kRgba;
  assert(ValidateSharedTextureRequest(request, 0, error));
  assert(BuildSharedTexturePushJson(request) ==
         "{\"frame\":{\"type\":3,\"format\":17,\"stride\":1920,"
         "\"height\":1080,\"timestamp\":4242,\"textureSliceIndex\":0},"
         "\"videoTrackId\":0}");

  request.pixel_format = SharedTexturePixelFormat::kBgra;
  request.timestamp_us = 999;
  assert(BuildSharedTexturePushJson(request).find("\"format\":17") !=
         std::string::npos);
  assert(BuildSharedTexturePushJson(request).find("\"timestamp\":4242") !=
         std::string::npos);

  static_assert(sizeof(uintptr_t) == 8,
                "The PoC supports only 64-bit native handles");
  const uintptr_t handle_bits = UINT64_C(0xfedcba9876543210);
  std::memcpy(request.nt_handle, &handle_bits, sizeof(handle_bits));
  const auto call_buffers = BuildSharedTextureCallBuffers(request);
  assert(call_buffers.buffers.size() == 5);
  assert(call_buffers.lengths.size() == 5);
  for (std::size_t index = 0; index < 4; ++index) {
    assert(call_buffers.buffers[index] == nullptr);
  }
  assert(reinterpret_cast<uintptr_t>(call_buffers.buffers[4]) == handle_bits);
  assert(call_buffers.buffers[4] !=
         static_cast<void *>(request.nt_handle));
  for (const auto length : call_buffers.lengths) {
    assert(length == 0);
  }

  SharedTextureSubmissionResult submission{};
  bool called = false;
  const bool submitted = SubmitSharedTextureCall(
      request,
      [&](const std::string &json, const decltype(call_buffers) &buffers,
          std::string &rtc_response) {
        called = true;
        assert(json == BuildSharedTexturePushJson(request));
        assert(reinterpret_cast<uintptr_t>(buffers.buffers[4]) == handle_bits);
        for (const auto length : buffers.lengths) { assert(length == 0); }
        rtc_response = "{\"result\":-7}";
        return 123;
      },
      submission, error);
  assert(called);
  assert(!submitted);
  assert(submission.transport_result == 123);
  assert(submission.rtc_response == "{\"result\":-7}");
  assert(error == "Iris pushVideoFrame transport failed with result 123");

  std::cout << "shared texture request validation passed\n";
  return 0;
}
