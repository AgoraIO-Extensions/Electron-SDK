#include "tools.h"

namespace agora {
namespace rtc {
namespace electron {
int startLogService(const char *filePath) {
  loguru::add_file(filePath, loguru::Append, loguru::Verbosity_MAX);
  return 0;
}
} // namespace electron
} // namespace rtc
} // namespace agora