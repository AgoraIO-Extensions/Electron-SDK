#pragma once

namespace agora {
namespace plugin {
enum AVFramePluginError {
  kOk = 0,
  kFailed = 1,
  kInvalidParams = 2,
  kNotInitialized = 3
};
}
} // namespace agora