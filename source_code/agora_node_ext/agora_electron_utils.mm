#include "agora_electron_utils.h"

#import <Cocoa/Cocoa.h>
#import <CoreFoundation/CoreFoundation.h>

namespace agora {
namespace rtc {
namespace electron {
// request screen capture permission
bool requestScreenCapturePermission() {
  return CGRequestScreenCaptureAccess();
}
}// namespace electron
}// namespace rtc
}// namespace agora