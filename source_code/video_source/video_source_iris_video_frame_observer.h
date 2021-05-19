#pragma once
#include "ipc_video_frame_listener.h"
#include "iris_rtc_renderer.h"
#include "video_source_ipc.h"
#include <vector>

namespace agora {
namespace rtc {
namespace electron {
class VideoSourceIrisVideoFrameObserver
    : public iris::rtc::IrisRtcRendererDelegate {
public:
  typedef std::vector<char> frame_buffer;

  VideoSourceIrisVideoFrameObserver(
      std::shared_ptr<AgoraIpcDataSender> ipcSender);

  virtual ~VideoSourceIrisVideoFrameObserver();

  virtual void OnVideoFrameReceived(
      const iris::rtc::IrisRtcVideoFrameObserver::VideoFrame &video_frame,
      bool resize) override;

private:
  std::shared_ptr<AgoraIpcDataSender> _ipc_data_sender;
  frame_buffer _buffer;
  unsigned int _MAX_BUFFER_LENG;
  int _current_frame;
  int _frame_rate;
};
} // namespace electron
} // namespace rtc
} // namespace agora