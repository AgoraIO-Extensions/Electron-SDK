#include "video_source_proxy.h"
#include "ipc_video_frame_listener.h"
#include <functional>

namespace agora {
namespace rtc {
namespace electron {
VideoSourceProxy::VideoSourceProxy(
    std::shared_ptr<IpcVideoFrameListener> listener)
    : _status_event(false), _ipc_video_frame_listener(listener) {}

VideoSourceProxy::~VideoSourceProxy() {
  Clear();
  _ipc_video_frame_listener.reset();
}

bool VideoSourceProxy::Initialize(
    std::shared_ptr<IVideoSourceEventHandler> videoSourceEventHandler) {
  if (_initialized) {
    LOG_F(INFO, "VideoSourceProxy Initialize already ");
    return true;
  }

  Clear();
  _video_source_event_handler = videoSourceEventHandler;

#ifdef _WIN32
  UUID uuid = {0};
  RPC_CSTR struuid;

  if (UuidCreate(&uuid) != RPC_S_OK)
    return false;
  if (UuidToStringA(&uuid, &struuid) != RPC_S_OK)
    return false;
  _peer_id = (LPSTR)struuid;
  RpcStringFreeA(&struuid);
#else
  uuid_t uuid;
  uuid_generate(uuid);
  uuid_string_t uid = {0};
  uuid_unparse(uuid, uid);
  _peer_id = "/";
  _peer_id += uid;
  _peer_id = _peer_id.substr(0, 20);
#endif
  _agora_ipc.reset(createAgoraIpc(this));
  _agora_ipc->initialize(_peer_id);
  _agora_ipc->listen();

  _message_thread = std::thread(&VideoSourceProxy::LoopMessage, this);
  std::string targetPath;
  if (!INodeProcess::getCurrentModuleFileName(targetPath)) {
    LOG_F(INFO, "VideoSourceProxy getCurrentModuleFileName fail ");
    return false;
  }

  size_t pos = targetPath.find_last_of("\\/");
  if (pos == targetPath.npos) {
    return false;
  }

  std::stringstream ss;
  ss << INodeProcess::GetCurrentNodeProcessId();
  std::string path = targetPath.substr(0, pos + 1);
  std::string cmdname = "VideoSource";
  std::string idparam = "id:" + _peer_id;
  std::string pidparam = "pid:" + ss.str();
  const char *params[] = {cmdname.c_str(), idparam.c_str(), pidparam.c_str()};
  _node_process.reset(INodeProcess::CreateNodeProcess(path.c_str(), params));
  if (!_node_process.get()) {
    LOG_F(INFO, "VideoSourceProxy CreateNodeProcess fail ");
    return false;
  }

  NodeEvent::WaitResult result = _status_event.WaitFor(5000);
  if (result != NodeEvent::WAIT_RESULT_SET) {
    LOG_F(INFO, "VideoSourceProxy CreateNodeProcess result : %d ", result);
    return false;
  }
  _node_process->Monitor([videoSourceEventHandler](INodeProcess *pProcess) {
    videoSourceEventHandler->OnVideoSourceExit();
  });

  _ipc_data_receiver.reset(new AgoraIpcDataReceiver());
  if (!_ipc_data_receiver->initialize(
          _peer_id + DATA_IPC_NAME,
          std::bind(&VideoSourceProxy::OnVideoFrameReceive, this,
                    std::placeholders::_1, std::placeholders::_2))) {
    _ipc_data_receiver.reset();
    LOG_F(INFO, "VideoSourceProxy _ipc_data_receiver initialize fail");
    return false;
  }

  _ipc_data_receiver->run(true);

  _initialized = true;
  return true;
}

void VideoSourceProxy::LoopMessage() { _agora_ipc->run(); }

void VideoSourceProxy::OnMessage(unsigned int msg, char *payload,
                                 unsigned int len) {
  if (msg == AGORA_IPC_SOURCE_READY) {
    LOG_F(INFO, "VideoSourceProxy::OnMessage  AGORA_IPC_SOURCE_READY");
    _status_event.notifyAll();
  }

  if (!_initialized)
    return;

  switch (msg) {
  case AGORA_IPC_ON_EVENT: {
    auto _parameter = reinterpret_cast<CallbackParameter *>(payload);
    if (_video_source_event_handler.get())
      _video_source_event_handler.get()->OnVideoSourceEvent(
          _parameter->_eventName, _parameter->_eventData);
  } break;

  case AGORA_IPC_ON_EVENT_WITH_BUFFER: {
    auto _parameter = reinterpret_cast<CallbackParameter *>(payload);
    if (_video_source_event_handler.get())
      _video_source_event_handler.get()->OnVideoSourceEvent(
          _parameter->_eventName, _parameter->_eventData, _parameter->_buffer,
          _parameter->_length);
  } break;

  default:
    break;
  }
}

int VideoSourceProxy::CallApi(ApiTypeEngine apiType, const char *parameter,
                              char *result) {
  if (_initialized) {
    ApiParameter apiParameter;
    apiParameter._apiType = apiType;
    strncpy(apiParameter._parameters, parameter, MAX_CHAR_LENGTH);
    return _agora_ipc->sendMessage(AGORA_IPC_CALL_API, (char *)&apiParameter,
                                   sizeof(apiParameter))
               ? 0
               : -1;
  }
  return -1;
}

int VideoSourceProxy::CallApi(ApiTypeEngine apiType, const char *parameter,
                              const char *buffer, int length, char *result) {
  if (_initialized) {
    ApiParameter apiParameter;
    apiParameter._apiType = apiType;
    strncpy(apiParameter._parameters, parameter, MAX_CHAR_LENGTH);
    strncpy(apiParameter._buffer, buffer, MAX_CHAR_LENGTH);
    apiParameter.length = length;
    return _agora_ipc->sendMessage(AGORA_IPC_CALL_API_WITH_BUFFER,
                                   (char *)&apiParameter, sizeof(apiParameter))
               ? 0
               : -1;
  }
  return -1;
}

int VideoSourceProxy::PluginCallApi(ApiTypeRawDataPlugin apiType,
                                    const char *parameter, char *result) {
  if (_initialized) {
    ApiParameter apiParameter;
    apiParameter._apiType = apiType;
    strncpy(apiParameter._parameters, parameter, MAX_CHAR_LENGTH);
    return _agora_ipc->sendMessage(AGORA_IPC_PLUGIN_CALL_API,
                                   (char *)&apiParameter, sizeof(apiParameter))
               ? 0
               : -1;
  }
  return -1;
}

int VideoSourceProxy::EnableVideoFrameCache(const char *channelId,
                                            unsigned int uid, int width,
                                            int height) {
  if (_initialized) {
    VideoFrameCacheConfigParameter parameter;
    strncpy(parameter._channelId, channelId, MAX_CHAR_LENGTH);
    parameter._uid = uid;
    parameter._width = width;
    parameter._height = height;
    return _agora_ipc->sendMessage(AGORA_IPC_ENABLE_VIDEO_FRAME_CACHE,
                                   (char *)&parameter, sizeof(parameter))
               ? 0
               : -1;
  }
  return -1;
}

int VideoSourceProxy::DisableVideoFrameCache(const char *channelId,
                                             unsigned int uid) {
  if (_initialized) {
    VideoFrameCacheConfigParameter parameter;
    strncpy(parameter._channelId, channelId, MAX_CHAR_LENGTH);
    parameter._uid = uid;
    return _agora_ipc->sendMessage(AGORA_IPC_DISABLE_VIDEO_FRAME_CACHE,
                                   (char *)&parameter, sizeof(parameter))
               ? 0
               : -1;
  }
  return -1;
}

int VideoSourceProxy::SetAddonLogFile(const char *filePath) {
  if (_initialized) {
    ApiParameter _parameter;
    strcpy(_parameter._parameters, filePath);
    return _agora_ipc->sendMessage(AGORA_IPC_SET_ADDON_LOG_FILE,
                                   (char *)&_parameter, sizeof(_parameter))
               ? 0
               : -1;
  }
  return -1;
}

int VideoSourceProxy::Release() {
  if (_initialized)
    Clear();

  return 0;
}

void VideoSourceProxy::Clear() {
  LOG_F(INFO, "VideoSourceProxy::Clear() ");
  _initialized = false;
  _video_source_event_handler = nullptr;

  _ipc_data_receiver.reset();
  if (_agora_ipc.get()) {
    _agora_ipc->sendMessage(AGORA_IPC_DISCONNECT, nullptr, 0);
    _agora_ipc->disconnect();
  }
  if (_message_thread.joinable())
    _message_thread.join();
}

void VideoSourceProxy::OnVideoFrameReceive(const char *data, int len) {
  _ipc_video_frame_listener->OnVideoFrameReceived(data, len);
}
} // namespace electron
} // namespace rtc
} // namespace agora