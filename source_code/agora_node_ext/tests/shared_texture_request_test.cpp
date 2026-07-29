#include "../shared_texture_request.h"

#include <cassert>
#include <iostream>

using agora::rtc::electron::SharedTexturePixelFormat;
using agora::rtc::electron::SharedTextureRequest;
using agora::rtc::electron::ValidateSharedTextureRequest;

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

  std::cout << "shared texture request validation passed\n";
  return 0;
}
