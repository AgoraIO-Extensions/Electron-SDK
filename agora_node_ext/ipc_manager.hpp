//
//  ipc_manager.hpp
//  binding
//
//  Created by Jerry-Luo on 2022/4/23.
//

#ifndef ipc_manager_hpp
#define ipc_manager_hpp

#include "ipc_base.h"
#include <iostream>
#include <mutex>
#include <stdio.h>
#include <unordered_map>

template <typename T> class Singleton {
public:
  static T &get_instance() noexcept(std::is_nothrow_constructible<T>::value) {
    static T instance{token()};
    return instance;
  }
  virtual ~Singleton() = default;
  Singleton(const Singleton &) = delete;
  Singleton &operator=(const Singleton &) = delete;

protected:
  struct token {}; // helper class
  Singleton() noexcept = default;
};

class IpcManager : public Singleton<IpcManager> {
public:
  IpcManager(token);
  ~IpcManager();
  IpcManager(const IpcManager &) = delete;
  IpcManager &operator=(const IpcManager &) = delete;

  IAgoraIpcDataSender *createIpc(std::string channelId, unsigned int uid);
  void releaseIpc(std::string channelId, unsigned int uid);
  void releaseAllIpc();

  bool sendData(std::string channelId, unsigned int uid, char *payload,
                unsigned int len);

private:
  std::mutex m_lock;

  IAgoraIpcDataSender *getIpc(std::string channelId, unsigned int uid);
  IAgoraIpcDataSender *ensureIpcMap(std::string channelId, unsigned int uid);
  IAgoraIpcDataSender *eraseIpcMap(std::string channelId, unsigned int uid);

  std::unordered_map<std::string,
                     std::unordered_map<unsigned int, IAgoraIpcDataSender *>>
      m_ipcMap;
};

#endif /* ipc_manager_hpp */
