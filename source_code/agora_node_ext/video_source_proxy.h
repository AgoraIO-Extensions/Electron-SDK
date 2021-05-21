#pragma once
#include <memory>
#include <string>
#include <thread>
#ifdef _WIN32
#include <Rpc.h>
#include <RpcDce.h>
#else
#include <uuid/uuid.h>
#endif
#include "ipc_video_frame_listener.h"
#include "iris_rtc_engine.h"
#include "loguru.hpp"
#include "node_event.h"
#include "node_process.h"
#include "video_source_event_handler.h"
#include "video_source_ipc.h"
#include <fstream>
#include <iosfwd>
#include <sstream>

namespace agora {
namespace rtc {
namespace electron {
class VideoSourceProxy : public AgoraIpcListener {
private:
  std::atomic_bool _initialized{false};
  std::shared_ptr<IVideoSourceEventHandler> _video_source_event_handler;
  std::shared_ptr<IpcVideoFrameListener> _ipc_video_frame_listener;
  std::string _peer_id;
  std::unique_ptr<IAgoraIpc> _agora_ipc;
  std::unique_ptr<AgoraIpcDataReceiver> _ipc_data_receiver;
  std::unique_ptr<INodeProcess> _node_process;
  std::thread _message_thread;
  NodeEvent _status_event;

public:
  VideoSourceProxy(std::shared_ptr<IpcVideoFrameListener> listener);
  ~VideoSourceProxy();

  virtual void OnMessage(unsigned int msg, char *payload,
                         unsigned int len) override;
  bool
  Initialize(std::shared_ptr<IVideoSourceEventHandler> videoSourceEventHandler);
  void LoopMessage();
  int CallApi(ApiTypeEngine apiType, const char *parameter, char *result);
  int CallApi(ApiTypeEngine apiType, const char *parameter, const char *buffer,
              int length, char *result);
  int PluginCallApi(ApiTypeRawDataPlugin apiType, const char *parameter,
                    char *result);
  int Release();
  int EnableVideoFrameCache(const char *channelId, unsigned int uid, int width,
                            int height);
  int DisableVideoFrameCache(const char *channelId, unsigned int uid);
  int SetAddonLogFile(const char *filePath);
  void Clear();
  void OnApiError(const char *event, const char *data);
  void OnVideoFrameReceive(const char *data, int len);
};
} // namespace electron
} // namespace rtc
} // namespace agora