/*
 * Copyright (c) 2018 Agora.io
 * All rights reserved.
 * Proprietary and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2018
 */

/**
 * the file define classes used to deliver command and event between node ADDON
 * and video source process.
 */

#ifndef AGORA_VIDEO_SOURCE_IPC_H
#define AGORA_VIDEO_SOURCE_IPC_H
#include "ipc_shm.h"
#include "iris_rtc_engine.h"
#include "node_base.h"
#include <atomic>
#include <functional>
#include <memory>
#include <string>
#include <thread>
#include <vector>

#define DATA_IPC_NAME "avsipc"

/**
 * AgoraIpcMsg define the message type transferred between node ADDON and vidoe
 * source process
 */
enum AgoraIpcMsg {
  /**  obsolete*/
  AGORA_IPC_CONNECT = 1,
  /** obsolete  */
  AGORA_IPC_CONNECT_CONFIRM,
  /** obsolete  */
  AGORA_IPC_DISCONNECT,
  /** To notify Video Sink that Video Source is ready*/
  AGORA_IPC_SOURCE_READY,
  AGORA_IPC_CALL_API,
  AGORA_IPC_CALL_API_WITH_BUFFER,
  AGORA_IPC_ON_EVENT,
  AGORA_IPC_ON_EVENT_WITH_BUFFER,
  AGORA_IPC_PLUGIN_CALL_API,
  AGORA_IPC_ENABLE_VIDEO_FRAME_CACHE,
  AGORA_IPC_DISABLE_VIDEO_FRAME_CACHE,
};

/**
 * Screen capture parameters when ADDON ask video source to start screen
 * sharing.
 */
// struct CaptureScreenCmd
// {
// #if defined(__APPLE__)
// 	unsigned int windowid;
// #elif defined(_WIN32)
// 	HWND windowid;
// #endif
// //   agora::rtc::IRtcEngine::WindowIDType windowid;
//     int captureFreq;
//     agora::rtc::Rect rect;
//     int bitrate;
//     CaptureScreenCmd()
//         : windowid(0)
//         , captureFreq(0)
//         , rect()
//         , bitrate()
//     {}
// };

#define MAX_WINDOW_ID_COUNT 128
#define MAX_CHAR_LENGTH 1024

struct ApiParameter {
  int _apiType;
  char _parameters[MAX_CHAR_LENGTH];
  char _buffer[MAX_CHAR_LENGTH];
  int length;
};

struct CallbackParameter {
  char _eventName[MAX_CHAR_LENGTH];
  char _eventData[MAX_CHAR_LENGTH];
  char _buffer[MAX_CHAR_LENGTH];
  int _length;
};

struct VideoFrameCacheConfigParameter {
  int _width;
  int _height;
  char _channelId[MAX_CHAR_LENGTH];
  unsigned int _uid;
};

#define MAX_TOKEN_LEN 512
#define MAX_CNAME_LEN 256
#define MAX_CHAN_INFO 512
#define MAX_PERMISSION_KEY 128
/**
 * AgoraIpcListener is used to monitor IPC message
 */
class AgoraIpcListener {
public:
  virtual void OnMessage(unsigned int msg, char *payload, unsigned int len) {
    LOG_F(INFO, "AgoraIpcListener  OnMessage msg = %d", msg);
  }
};

/**
 * IAgoraIpc is used to facilitate communications between processes. This is one
 * virtual class, may have different implementation on different platforms.
 */
class IAgoraIpc {
public:
  IAgoraIpc(AgoraIpcListener *listener) : m_listener(listener) {}
  virtual ~IAgoraIpc() {}
  virtual const std::string &getId() { return m_id; }
  /**
   * To initialize IPC.
   * @param id : the id used to identify the IPC endpoint.
   */
  virtual bool initialize(const std::string &id) = 0;
  /**
   * To put IPC endpoint in listen state, then other endpoint can connect the
   * endpoint.
   */
  virtual bool listen() = 0;
  /**
   * To connect to other IPC endpoint.
   */
  virtual bool connect() = 0;
  /**
   * To disconnect the IPC
   */
  virtual bool disconnect() = 0;
  /**
   * To start IPC.
   */
  virtual void run() = 0;
  /**
   * To send message.
   * @param msg : the message id.
   * @param payload : the pointer to the transferred data.
   * @param len : the length of the data payload.
   */
  virtual bool sendMessage(AgoraIpcMsg msg, char *payload,
                           unsigned int len) = 0;

protected:
  std::string m_id;
  AgoraIpcListener *m_listener;
};

/**
 * The class is used for IPC with large throughput.
 * AgoraIpcDataSender provide send-only facilities.
 */
#define DATA_DELIVER_BLOCK_SIZE 6145000
// 3110450
class AgoraIpcDataSender {
public:
  AgoraIpcDataSender();
  ~AgoraIpcDataSender();

  /**
   * To initialize the AgoraIpcDataSender.
   * @param id : sender identifier.
   */
  bool initialize(const std::string &id);
  /**
   * To send data.
   * @param payload : the pointer to data to be sent.
   * @param len : the length of the data.
   */
  void sendData(char *payload, unsigned int len);
  /**
   * To send multiple data in one time.
   * @payloads : vector of data to be sent.
   */
  void sendMultiData(const std::vector<std::pair<char *, int32_t>> &payloads);

  /** Disconnect the sender and IPC */
  void Disconnect();

private:
  shm_ipc<1, DATA_DELIVER_BLOCK_SIZE> m_ipcData;
  bool m_initialized;
  std::string m_id;
};

/**
 * The class is used to IPC with large throughput.
 * The AgoraIpcDataReceiver provide receive-only facilities.
 */
class AgoraIpcDataReceiver {
public:
  AgoraIpcDataReceiver();
  ~AgoraIpcDataReceiver();

  /**
   * To initialize AgoraIpcDataReciever
   * @param id : IPC identifier
   * @param handler : the receiver event handler.
   */
  bool initialize(const std::string &id,
                  const std::function<void(const char *, int)> &handler);
  /**
   * To start the IPC.
   */
  void run(bool async = false);

  /**
   * To stop the IPC
   */
  void stop();

private:
  std::unique_ptr<std::thread> m_thread;
  std::function<void(const char *, int)> m_handler;
  std::string m_id;
  bool m_initialized;
  shm_ipc<1, DATA_DELIVER_BLOCK_SIZE> m_ipcData;
};

/**
 * To create IAgroaIpc instance.
 */
IAgoraIpc *createAgoraIpc(AgoraIpcListener *listner);

#endif
