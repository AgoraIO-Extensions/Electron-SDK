#include "video_processer.h"
#include "loguru.hpp"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;

VideoProcesser::VideoProcesser(
    std::shared_ptr<iris::rtc::IrisRtcEngine> &irisRtcEngine)
    : _iris_rtc_renderer_delegate(nullptr) {
  _iris_rtc_engine = irisRtcEngine;
  _iris_rtc_raw_data = _iris_rtc_engine.lock()->raw_data();
  _iris_rtc_renderer = _iris_rtc_raw_data->renderer();
  _cached_video_source_video_frame.reset(new VideoFrame());
}

VideoProcesser::~VideoProcesser() {
  _iris_rtc_engine.reset();
  _iris_rtc_raw_data = nullptr;
  _iris_rtc_renderer = nullptr;
  if (_iris_rtc_renderer_delegate) {
    delete _iris_rtc_renderer_delegate;
    _iris_rtc_renderer_delegate = nullptr;
  }
  _cached_video_source_video_frame.reset();
}

int VideoProcesser::EnableVideoFrameCache(
    const IrisRtcRendererCacheConfig &cache_config, unsigned int uid,
    const char *channel_id) {
  LOG_F(INFO, "EnableVideoFrameCache uid: %u", uid);
  _iris_rtc_renderer_delegate = cache_config.delegate;
  _iris_rtc_renderer->EnableVideoFrameCache(cache_config, uid, channel_id);
  return ERROR_OK;
}

int VideoProcesser::DisableVideoFrameCache(const char *channel_id,
                                           unsigned int uid) {
  _iris_rtc_renderer->DisableVideoFrameCache(uid, channel_id);
  if (_iris_rtc_renderer_delegate) {
    delete _iris_rtc_renderer_delegate;
    _iris_rtc_renderer_delegate = nullptr;
  }
  return ERROR_OK;
}

bool VideoProcesser::GetVideoFrame(
    IrisRtcVideoFrameObserver::VideoFrame &video_frame, bool &is_new_frame,
    unsigned int uid, const char *channel_id) {
  return _iris_rtc_renderer->GetVideoFrame(video_frame, is_new_frame, uid,
                                           channel_id);
}

bool VideoProcesser::VideoSourceGetVideoFrame(
    iris::rtc::IrisRtcVideoFrameObserver::VideoFrame &video_frame,
    bool &is_new_frame, unsigned int uid, const char *channel_id) {
  std::lock_guard<std::mutex> lock(_video_frame_mutex);
  auto ret =
      _cached_video_source_video_frame->CopyFrame(is_new_frame, video_frame);
  return ret;
}

void VideoProcesser::OnVideoFrameReceived(const char *data, int len) {
  std::lock_guard<std::mutex> lock(_video_frame_mutex);
  _cached_video_source_video_frame->UpdateBuffer(data);
}
} // namespace electron
} // namespace rtc
} // namespace agora