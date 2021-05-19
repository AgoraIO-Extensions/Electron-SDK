#pragma once
#include "ipc_video_frame_listener.h"
#include "iris_rtc_engine.h"
#include "iris_rtc_raw_data.h"
#include "iris_rtc_raw_data_plugin.h"
#include "iris_rtc_renderer.h"
#include "node_base.h"
#include "video_source_ipc.h"
#include <memory>
#include <mutex>
#include <thread>

namespace agora {
namespace rtc {
namespace electron {
class VideoProcesser : public IpcVideoFrameListener {
private:
  std::mutex _video_frame_mutex;
  std::weak_ptr<iris::rtc::IrisRtcEngine> _iris_rtc_engine;
  std::unique_ptr<VideoFrame> _cached_video_source_video_frame;
  iris::rtc::IrisRtcRawData *_iris_rtc_raw_data;
  iris::rtc::IrisRtcRenderer *_iris_rtc_renderer;
  iris::rtc::IrisRtcRendererDelegate *_iris_rtc_renderer_delegate;

public:
  explicit VideoProcesser(
      std::shared_ptr<iris::rtc::IrisRtcEngine> &irisRtcEngine);
  virtual ~VideoProcesser();

  int EnableVideoFrameCache(
      const iris::rtc::IrisRtcRendererCacheConfig &cache_config,
      unsigned int uid, const char *channel_id = "");

  int DisableVideoFrameCache(const char *channel_id = "",
                             unsigned int uid = -1);

  bool
  GetVideoFrame(iris::rtc::IrisRtcVideoFrameObserver::VideoFrame &video_frame,
                bool &is_new_frame, unsigned int uid,
                const char *channel_id = "");

  bool VideoSourceGetVideoFrame(
      iris::rtc::IrisRtcVideoFrameObserver::VideoFrame &video_frame,
      bool &is_new_frame, unsigned int uid, const char *channel_id = "");

  void OnVideoFrameReceived(const char *data, int len) override;
};
} // namespace electron
} // namespace rtc
} // namespace agora