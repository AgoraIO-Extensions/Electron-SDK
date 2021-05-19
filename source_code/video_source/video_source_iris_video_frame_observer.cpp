#include "video_source_iris_video_frame_observer.h"

namespace agora {
namespace rtc {
namespace electron {
#define MAX_VIDEO_WIDTH 2560
#define MAX_VIDEO_HEIGHT 1600
#define DEFAULT_FRAME_RATE 15

using VideoFrameHeader = IpcVideoFrameListener::VideoFrameHeader;

VideoSourceIrisVideoFrameObserver::VideoSourceIrisVideoFrameObserver(
    std::shared_ptr<AgoraIpcDataSender> ipcSender) {
  _ipc_data_sender = ipcSender;
  _MAX_BUFFER_LENG = MAX_VIDEO_WIDTH * MAX_VIDEO_HEIGHT * 1.5 + 12;
  _buffer.reserve(_MAX_BUFFER_LENG);
}

VideoSourceIrisVideoFrameObserver::~VideoSourceIrisVideoFrameObserver() {
  _buffer.clear();
  _ipc_data_sender.reset();
}

void VideoSourceIrisVideoFrameObserver::OnVideoFrameReceived(
    const iris::rtc::IrisRtcVideoFrameObserver::VideoFrame &video_frame,
    bool resize) {
  char *_data = _buffer.data();
  VideoFrameHeader *_header = (VideoFrameHeader *)_data;
  _header->_width = video_frame.width;
  _header->_height = video_frame.height;
  _header->_yStride = video_frame.y_stride;

  char *yBuffer = _data + sizeof(VideoFrameHeader);
  char *uBuffer = yBuffer + _header->_yStride * _header->_height;
  char *vBuffer = uBuffer + _header->_yStride * _header->_height / 4;

  memcpy(yBuffer, video_frame.y_buffer, video_frame.y_buffer_length);
  memcpy(uBuffer, video_frame.u_buffer, video_frame.u_buffer_length);
  memcpy(vBuffer, video_frame.v_buffer, video_frame.v_buffer_length);
  LOG_F(INFO, "VideoSourceIrisVideoFrameObserver::OnVideoFrameReceived");
  if (_ipc_data_sender) {
    _ipc_data_sender->sendData(_data, _MAX_BUFFER_LENG);
  }
}
} // namespace electron
} // namespace rtc
} // namespace agora