#pragma once
#include "iris_event_handler.h"
#include "video_source_ipc.h"
#include <memory>

namespace agora {
namespace rtc {
namespace electron {
class VideoSourceIrisEventhandler : public iris::IrisEventHandler {
public:
  VideoSourceIrisEventhandler(std::shared_ptr<IAgoraIpc> &ipcController);
  virtual ~VideoSourceIrisEventhandler();

  virtual void OnEvent(const char *event, const char *data) override;

  virtual void OnEvent(const char *event, const char *data, const void *buffer,
                       unsigned int length) override;

private:
  std::weak_ptr<IAgoraIpc> _ipcController;
};
} // namespace electron
} // namespace rtc
} // namespace agora