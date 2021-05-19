#pragma once
#include "iris_rtc_base.h"
#include "iris_rtc_engine.h"
#include "iris_rtc_raw_data.h"
#include "iris_rtc_raw_data_plugin_manager.h"
#include "iris_rtc_renderer.h"
#include "node_process.h"
#include "video_processer.h"
#include "video_source_ipc.h"
#include "video_source_iris_event_handler.h"
#include "video_source_iris_video_frame_observer.h"
#include "video_source_param_parser.h"
#include <memory>
#include <string>

namespace agora {
namespace rtc {
namespace electron {
class VideoSource : public AgoraIpcListener {
public:
  VideoSource();
  virtual ~VideoSource();

  virtual void OnMessage(unsigned int msg, char *data,
                         unsigned int len) override;

  bool Initialize(std::string &parameter);
  void Run();
  void Release();
  void Exit(bool flag);
  void OnApiError(const char *event, const char *data);
  void Clear();

private:
  std::unique_ptr<VideoSourceIrisEventhandler> _iris_event_handler;
  std::unique_ptr<VideoSourceParamParser> _parameter_parser;
  std::unique_ptr<INodeProcess> _process;
  std::unique_ptr<VideoProcesser> _video_processer;
  std::shared_ptr<IAgoraIpc> _ipc_controller;
  std::shared_ptr<AgoraIpcDataSender> _ipc_sender;
  std::shared_ptr<iris::rtc::IrisRtcEngine> _iris_engine;
  iris::rtc::IrisRtcRawData *_iris_raw_data;
  iris::rtc::IrisRtcRawDataPluginManager *_iris_raw_data_plugin_manager;
  std::atomic_bool _initialize{false};
};
} // namespace electron
} // namespace rtc
} // namespace agora