#include "../shared_texture_request.h"
#include "../d3d11_shared_texture_importer.h"
#include "../iosurface_shared_texture_importer.h"

#ifdef NDEBUG
#undef NDEBUG
#endif
#include <cassert>
#include <cstdint>
#include <cstring>
#include <iostream>

#if defined(__APPLE__)
#include "iris_engine_base.h"
#include <CoreFoundation/CoreFoundation.h>
#include <IOSurface/IOSurface.h>
#endif

using agora::rtc::electron::SharedTexturePixelFormat;
using agora::rtc::electron::SharedTextureRequest;
using agora::rtc::electron::SharedTextureSubmissionResult;
using agora::rtc::electron::ValidateSharedTextureRequest;
using agora::rtc::electron::BuildSharedTexturePushJson;
using agora::rtc::electron::BuildSharedTextureCallBuffers;
using agora::rtc::electron::SubmitSharedTextureCall;
#if defined(__APPLE__)
using agora::rtc::electron::BuildIOSurfaceTexturePushJson;
#endif

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

#if defined(__APPLE__)
class FakeIrisEngine : public IApiEngineBase {
 public:
  int CallIrisApi(ApiParam *api_param) override {
    event = api_param->event;
    json.assign(api_param->data, api_param->data_size);
    assert(api_param->buffer_count == 5);
    for (unsigned int index = 0; index < api_param->buffer_count; ++index) {
      assert(api_param->buffer[index] == nullptr);
      assert(api_param->length[index] == 0);
    }
    api_param->result = const_cast<char *>(response.c_str());
    return 0;
  }

  std::string event;
  std::string json;
  std::string response = "{\"result\":0}";
};

IOSurfaceRef CreateTestIOSurface(uint32_t width, uint32_t height) {
  const int32_t width_value = static_cast<int32_t>(width);
  const int32_t height_value = static_cast<int32_t>(height);
  const int32_t bytes_per_element = 4;
  CFNumberRef values[] = {
      CFNumberCreate(nullptr, kCFNumberSInt32Type, &width_value),
      CFNumberCreate(nullptr, kCFNumberSInt32Type, &height_value),
      CFNumberCreate(nullptr, kCFNumberSInt32Type, &bytes_per_element)};
  const void *keys[] = {kIOSurfaceWidth, kIOSurfaceHeight,
                        kIOSurfaceBytesPerElement};
  const void *dictionary_values[] = {values[0], values[1], values[2]};
  CFDictionaryRef properties = CFDictionaryCreate(
      nullptr, keys, dictionary_values, 3, &kCFTypeDictionaryKeyCallBacks,
      &kCFTypeDictionaryValueCallBacks);
  IOSurfaceRef surface = IOSurfaceCreate(properties);
  CFRelease(properties);
  for (CFNumberRef value : values) { CFRelease(value); }
  return surface;
}
#endif

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

#if defined(__APPLE__)
  assert(BuildIOSurfaceTexturePushJson(request, 77, 672) ==
         "{\"frame\":{\"type\":3,\"format\":14,\"stride\":672,"
         "\"height\":1080,\"rotation\":0,\"timestamp\":4242,"
         "\"iosurfaceId\":77},\"videoTrackId\":0}");
  request.pixel_format = SharedTexturePixelFormat::kRgba;
  assert(BuildIOSurfaceTexturePushJson(request, 88, 1920).find(
             "\"format\":4") != std::string::npos);
  request.pixel_format = SharedTexturePixelFormat::kBgra;

  IOSurfaceRef surface = CreateTestIOSurface(request.width, request.height);
  assert(surface != nullptr);
  const uintptr_t surface_pointer = reinterpret_cast<uintptr_t>(surface);
  std::memcpy(request.native_handle, &surface_pointer, sizeof(surface_pointer));
  FakeIrisEngine iris_engine;
  SharedTextureSubmissionResult iosurface_submission{};
  assert(agora::rtc::electron::SubmitSharedIOSurfaceTexture(
      request, &iris_engine, iosurface_submission, error));
  assert(iris_engine.event == "MediaEngine_pushVideoFrame_4e544e2");
  assert(iris_engine.json.find("\"iosurfaceId\":" +
                               std::to_string(IOSurfaceGetID(surface))) !=
         std::string::npos);
  assert(iris_engine.json.find("\"stride\":" + std::to_string(
                               IOSurfaceGetBytesPerRow(surface) / 4)) !=
         std::string::npos);
  assert(iosurface_submission.rtc_response == "{\"result\":0}");
  CFRelease(surface);
#endif

  static_assert(sizeof(uintptr_t) == 8,
                "The PoC supports only 64-bit native handles");
  const uintptr_t handle_bits = UINT64_C(0xfedcba9876543210);
  std::memcpy(request.native_handle, &handle_bits, sizeof(handle_bits));
  const auto call_buffers = BuildSharedTextureCallBuffers(request);
  assert(call_buffers.buffers.size() == 5);
  assert(call_buffers.lengths.size() == 5);
  for (std::size_t index = 0; index < 4; ++index) {
    assert(call_buffers.buffers[index] == nullptr);
  }
  assert(reinterpret_cast<uintptr_t>(call_buffers.buffers[4]) == handle_bits);
  assert(call_buffers.buffers[4] !=
         static_cast<void *>(request.native_handle));
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
