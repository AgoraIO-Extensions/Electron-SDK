#include "video_source_iris_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {
VideoSourceIrisEventhandler::VideoSourceIrisEventhandler(
    std::shared_ptr<IAgoraIpc> &ipcController) {
  _ipcController = ipcController;
}

VideoSourceIrisEventhandler::~VideoSourceIrisEventhandler() {
  _ipcController.reset();
}

void VideoSourceIrisEventhandler::OnEvent(const char *event, const char *data) {
  LOG_F(INFO, "VideoSourceIrisEventhandler::OnEvent event: %s, data: %s", event,
        data);
  if (_ipcController.lock()) {
    CallbackParameter _parameter;
    strncpy(_parameter._eventName, event, MAX_CHAR_LENGTH);
    strncpy(_parameter._eventData, data, MAX_CHAR_LENGTH);
    _ipcController.lock()->sendMessage(AGORA_IPC_ON_EVENT, (char *)&_parameter,
                                       sizeof(_parameter));
  }
}

void VideoSourceIrisEventhandler::OnEvent(const char *event, const char *data,
                                          const void *buffer,
                                          unsigned int length) {
  if (_ipcController.lock()) {
    CallbackParameter _parameter;
    strncpy(_parameter._eventName, event, MAX_CHAR_LENGTH);
    strncpy(_parameter._eventData, data, MAX_CHAR_LENGTH);
    strncpy(_parameter._buffer, (const char *)buffer, MAX_CHAR_LENGTH);
    _parameter._length = length;
    _ipcController.lock()->sendMessage(AGORA_IPC_ON_EVENT_WITH_BUFFER,
                                       (char *)&_parameter, sizeof(_parameter));
  }
}
} // namespace electron
} // namespace rtc
} // namespace agora