#pragma once

#include "shared_texture_request.h"

#include <string>

namespace agora {
namespace rtc {
namespace electron {

bool RenderSharedD3D11TexturePreview(const SharedTextureRequest &request,
                                     std::string &error);
void CloseSharedD3D11TexturePreview();

}// namespace electron
}// namespace rtc
}// namespace agora
