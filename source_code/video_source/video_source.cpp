#include "video_source.h"

int main(int argc, char *argv[]) {
  std::string _parameter;
  for (int i = 1; i < argc; i++) {
    _parameter.append(argv[i]);
    _parameter.append(" ");
  }
  LOG_F(INFO, "VideoSource Enter");
  auto _videoSource = new agora::rtc::electron::VideoSource();
  _videoSource->Initialize(_parameter);
  _videoSource->Run();
  _videoSource->Release();
  LOG_F(INFO, "VideoSource  Exit");
  return 0;
}

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;

VideoSource::VideoSource() {}

VideoSource::~VideoSource() {
  Clear();
  LOG_F(INFO, "VideoSource::~VideoSource()");
}

void VideoSource::Clear() {
  _iris_engine.reset();
  _iris_event_handler.reset();
  LOG_F(INFO, "VideoSource::Clear() 33");
  _ipc_sender.reset();
  LOG_F(INFO, "VideoSource::Clear() 44");
  _ipc_controller.reset();
  LOG_F(INFO, "VideoSource::Clear() 55");
  _parameter_parser.reset();
  LOG_F(INFO, "VideoSource::Clear() 66");
  _video_processer.reset();
  LOG_F(INFO, "VideoSource::Clear() 77");
}

bool VideoSource::Initialize(std::string &parameter) {
  _parameter_parser.reset(new VideoSourceParamParser());
  _parameter_parser->initialize(parameter);

  auto _apiParameter = _parameter_parser->getParameter("apiParameter");
  auto _peerId = _parameter_parser->getParameter("id");

  LOG_F(INFO, "VideoSource::Initialize");
  _ipc_controller.reset(createAgoraIpc(this));
  if (!_ipc_controller->initialize(_peerId)) {
    LOG_F(INFO, "VideoSource _ipc_controller initialize fail");
    return false;
  }

  if (!_ipc_controller->connect()) {
    LOG_F(INFO, "VideoSource _ipc_controller connect fail");
    return false;
  }

  _iris_engine.reset(new IrisRtcEngine());
  _iris_raw_data = _iris_engine->raw_data();
  _iris_raw_data_plugin_manager = _iris_raw_data->plugin_manager();
  _iris_event_handler.reset(new VideoSourceIrisEventhandler(_ipc_controller));
  _iris_engine->SetEventHandler(_iris_event_handler.get());
  _video_processer.reset(new VideoProcesser(_iris_engine));
  char result[512];
  auto ret = _iris_engine->CallApi(ApiTypeEngine::kEngineInitialize,
                                   _apiParameter.c_str(), result);
  if (ret != 0) {
    LOG_F(INFO, "VideoSource  _iris_engine initialize fail");
    return false;
  }

  _ipc_sender.reset(new AgoraIpcDataSender());
  if (!_ipc_sender->initialize(_peerId + DATA_IPC_NAME)) {
    LOG_F(INFO, "VideoSource  _ipc_sender initialize fail");
    return false;
  }
  LOG_F(INFO, "VideoSource initialize success");
  _ipc_controller->sendMessage(AGORA_IPC_SOURCE_READY, nullptr, 0);
  _initialize = true;
  return true;
}

void VideoSource::Run() {
#ifdef _WIN32
  std::string idstr = _parameter_parser->getParameter("pid");
#else
  std::string idstr = _parameter_parser->getParameter("fd");
#endif
  _process.reset(INodeProcess::OpenNodeProcess(std::atoi(idstr.c_str())));

  if (!_process.get()) {
    LOG_F(INFO, "VideoSource process open fail");
    return;
  }
  _process->Monitor([this](INodeProcess *) { this->Exit(false); });

  _ipc_controller->run();
}

void VideoSource::Release() {
  LOG_F(INFO, "VideoSource::Release");
  delete this;
}

void VideoSource::OnMessage(unsigned int msg, char *data, unsigned int len) {
  if (!_initialize)
    return;

  switch (msg) {
  case AGORA_IPC_CALL_API: {
    ApiParameter *parameter = (ApiParameter *)data;
    char result[512];
    try {

      int ret = _iris_engine->CallApi(ApiTypeEngine(parameter->_apiType),
                                      parameter->_parameters, result);
      LOG_F(INFO, "AGORA_IPC_CALL_API type: %d, parameter %s, ret: %d",
            parameter->_apiType, parameter->_parameters, ret);
    } catch (std::exception &e) {
      LOG_F(INFO, "AGORA_IPC_CALL_API catch exception: %s", e.what());
      this->OnApiError("videoSourceApiError", e.what());
    }
  } break;

  case AGORA_IPC_CALL_API_WITH_BUFFER: {
    ApiParameter *parameter = (ApiParameter *)data;
    char result[512];
    try {
      _iris_engine->CallApi(ApiTypeEngine(parameter->_apiType),
                            parameter->_parameters,
                            const_cast<char *>(parameter->_buffer), result);
    } catch (std::exception &e) {
      LOG_F(INFO, "AGORA_IPC_CALL_API_WITH_BUFFER catch exception: %s",
            e.what());
      this->OnApiError("videoSourceApiError", e.what());
    }
  } break;

  case AGORA_IPC_PLUGIN_CALL_API: {
    ApiParameter *parameter = (ApiParameter *)data;
    char result[512];
    try {
      _iris_raw_data_plugin_manager->CallApi(
          ApiTypeRawDataPlugin(parameter->_apiType), parameter->_parameters,
          result);
    } catch (std::exception &e) {
      LOG_F(INFO, "VideoSourcePluginCallApi catch exception: %s", e.what());
      this->OnApiError("videoSourceApiError", e.what());
    }
  } break;

  case AGORA_IPC_ENABLE_VIDEO_FRAME_CACHE: {
    VideoFrameCacheConfigParameter *_parameter =
        (VideoFrameCacheConfigParameter *)data;
    IrisRtcRendererCacheConfig _cacheConfig(
        iris::rtc::IrisRtcVideoFrameObserver::VideoFrameType::kFrameTypeYUV420,
        new VideoSourceIrisVideoFrameObserver(_ipc_sender), _parameter->_width,
        _parameter->_height);
    _video_processer->EnableVideoFrameCache(_cacheConfig, _parameter->_uid,
                                            _parameter->_channelId);
  } break;

  case AGORA_IPC_DISABLE_VIDEO_FRAME_CACHE: {
    VideoFrameCacheConfigParameter *_parameter =
        (VideoFrameCacheConfigParameter *)data;
    _video_processer->DisableVideoFrameCache(_parameter->_channelId,
                                             _parameter->_uid);
  } break;

  case AGORA_IPC_DISCONNECT: {
    LOG_F(INFO, "VideoSource OnMessage AGORA_IPC_DISCONNECT");
    this->Exit(false);
    this->Clear();
  } break;

  default:
    break;
  }
}

void VideoSource::Exit(bool flag) {
  LOG_F(INFO, "VideoSource::Exit");
  _ipc_sender.reset();
  _ipc_controller->disconnect();
}

void VideoSource::OnApiError(const char *event, const char *data) {
  _iris_event_handler->OnEvent(event, data);
}
} // namespace electron
} // namespace rtc
} // namespace agora