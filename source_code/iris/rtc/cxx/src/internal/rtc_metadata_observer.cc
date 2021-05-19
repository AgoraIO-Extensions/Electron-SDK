#include "internal/rtc_metadata_observer.h"
#include "internal/iris_json_utils.h"
#include "internal/iris_rtc_json_encoder.h"

#define SET_VALUE_OBJ$(doc, val, key) SET_VALUE_OBJ(doc, val, key, key)

namespace agora {
using namespace rtc;

namespace iris {
namespace rtc {
using namespace std;
using rapidjson::Document;
using rapidjson::Value;

RtcMetadataObserver::RtcMetadataObserver() : event_handler_(nullptr) {}

RtcMetadataObserver::~RtcMetadataObserver() { ClearQueue(); }

int RtcMetadataObserver::SendMetadata(const Metadata &metadata) {
  lock_guard<mutex> lock(queue_mutex_);
  if (message_queue_.size() > kQueueMaxCacheLength) { Pop(); }
  Metadata p_metadata{};
  try {
    p_metadata.buffer = new unsigned char[metadata.size];
    Copy(p_metadata, metadata);
    message_queue_.push(p_metadata);
  } catch (bad_alloc &) { return -ERROR_CODE_TYPE::ERR_BUFFER_TOO_SMALL; }
  return ERROR_CODE_TYPE::ERR_OK;
}

int RtcMetadataObserver::SetMaxMetadataSize(int size) {
  max_metadata_size_ = size;
  return ERROR_CODE_TYPE::ERR_OK;
}

void RtcMetadataObserver::ClearQueue() {
  lock_guard<mutex> lock(queue_mutex_);
  while (!message_queue_.empty()) { Pop(); }
}

void RtcMetadataObserver::Pop() {
  auto p_metadata = message_queue_.front();
  delete[] p_metadata.buffer;
  message_queue_.pop();
}

void RtcMetadataObserver::Copy(Metadata &dst, const Metadata &src) {
  dst.uid = src.uid;
  dst.size = src.size;
  if (src.buffer) { memcpy(dst.buffer, src.buffer, src.size); }
  dst.timeStampMs = src.timeStampMs;
}

int RtcMetadataObserver::getMaxMetadataSize() { return max_metadata_size_; }

bool RtcMetadataObserver::onReadyToSendMetadata(Metadata &metadata) {
  lock_guard<mutex> lock(queue_mutex_);
  if (message_queue_.empty()) return false;
  auto p_metadata = message_queue_.front();
  Copy(metadata, p_metadata);
  message_queue_.pop();
  return true;
}

void RtcMetadataObserver::onMetadataReceived(const Metadata &metadata) {
  lock_guard<mutex> lock(queue_mutex_);
  if (!event_handler_) return;
  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, metadata)
  event_handler_->OnEvent("onMetadataReceived", ToJsonString(value).c_str(),
                          reinterpret_cast<void *>(metadata.buffer),
                          metadata.size);
}
}// namespace rtc
}// namespace iris
}// namespace agora
