#include "../shared_texture_request.h"
#include "../d3d11_shared_texture_importer.h"

#include <cassert>
#include <iostream>

using agora::rtc::electron::SharedTexturePixelFormat;
using agora::rtc::electron::SharedTextureRequest;
using agora::rtc::electron::ValidateSharedTextureRequest;
using agora::rtc::electron::BuildSharedTexturePushJson;

namespace {

SharedTextureRequest ValidRequest() {
  SharedTextureRequest request{};
  request.frame_id = 1;
  request.handle_size = 8;
  request.width = 1920;
  request.height = 1080;
  request.timestamp_us = 123456;
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
  request.frame_id = 7;
  assert(!ValidateSharedTextureRequest(request, 7, error));

  request = ValidRequest();
  request.pixel_format = SharedTexturePixelFormat::kUnknown;
  ExpectInvalid(request);

  request = ValidRequest();
  request.pixel_format = SharedTexturePixelFormat::kRgba;
  assert(ValidateSharedTextureRequest(request, 0, error));
  assert(BuildSharedTexturePushJson(request) ==
         "{\"frame\":{\"type\":3,\"format\":4,\"stride\":1920,"
         "\"height\":1080,\"timestamp\":123,\"textureSliceIndex\":0},"
         "\"videoTrackId\":0}");

  request.pixel_format = SharedTexturePixelFormat::kBgra;
  request.timestamp_us = 999;
  assert(BuildSharedTexturePushJson(request).find("\"format\":2") !=
         std::string::npos);
  assert(BuildSharedTexturePushJson(request).find("\"timestamp\":0") !=
         std::string::npos);

  std::cout << "shared texture request validation passed\n";
  return 0;
}
