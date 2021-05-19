//
// Created by LXH on 2021/1/21.
//

#ifndef RTC_METADATA_OBSERVER_H_
#define RTC_METADATA_OBSERVER_H_

#include "IAgoraRtcEngine.h"
#include "iris_event_handler.h"
#include <mutex>
#include <queue>

namespace agora {
namespace iris {
namespace rtc {
const int kMaxMetadataSize = 1024;
const int kQueueMaxCacheLength = 50;

class RtcMetadataObserver : public agora::rtc::IMetadataObserver {
 public:
  RtcMetadataObserver();

  ~RtcMetadataObserver() override;

  int getMaxMetadataSize() override;

  bool onReadyToSendMetadata(Metadata &metadata) override;

  void onMetadataReceived(const Metadata &metadata) override;

 public:
  int SendMetadata(const Metadata &metadata);

  int SetMaxMetadataSize(int size);

  void ClearQueue();

 private:
  void Pop();

  static void Copy(Metadata &dst, const Metadata &src);

 public:
  IrisEventHandler *event_handler_;

 private:
  std::queue<Metadata> message_queue_;
  std::mutex queue_mutex_;
  int max_metadata_size_ = kMaxMetadataSize;
};
}// namespace rtc
}// namespace iris
}// namespace agora

#endif//RTC_METADATA_OBSERVER_H_
