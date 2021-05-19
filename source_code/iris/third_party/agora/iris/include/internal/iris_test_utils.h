//
// Created by LXH on 2021/1/22.
//

#ifndef IRIS_TEST_UTILS_H_
#define IRIS_TEST_UTILS_H_

#include <mutex>
#include <string>

namespace agora {
namespace iris {
static const char *kTestAppId = "aab8b8f5a8cd4469a63042fcfafe7063";

class AutoResetEvent {
 public:
  explicit AutoResetEvent(bool init = false) : signal_(init) {}
  ~AutoResetEvent() = default;

  void Set() {
    std::lock_guard<std::mutex> _(lock_);
    signal_ = true;

    cv_.notify_one();
  }

  int Wait(int wait_ms) {
    int ret;

    std::unique_lock<std::mutex> l(lock_);

    if (signal_) {
      signal_ = false;
      return 0;
    }

    if (wait_ms == 0) { return -1; }

    if (wait_ms < 0) {
      cv_.wait(l, [this] { return signal_; });
      ret = 0;
    } else {
      auto wait_succeeded = cv_.wait_for(l, std::chrono::milliseconds(wait_ms),
                                         [this] { return signal_; });
      ret = (wait_succeeded ? 0 : -1);
    }

    // here is the auto reset
    signal_ = false;
    return ret;
  }

 private:
  std::condition_variable cv_;
  std::mutex lock_;
  bool signal_;
};
}// namespace iris
}// namespace agora

#endif//IRIS_TEST_UTILS_H_
