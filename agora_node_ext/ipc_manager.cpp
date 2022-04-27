//
//  ipc_manager.cpp
//  binding
//
//  Created by Jerry-Luo on 2022/4/23.
//

#include "ipc_manager.hpp"
#include <iostream>
#include "node_log.h"
IpcManager::~IpcManager() { std::cout << "destructor called!" << std::endl; }

IpcManager::IpcManager(token) {
  std::cout << "constructor called!" << std::endl;
}

IAgoraIpcDataSender *IpcManager::createIpc(std::string channelId,
                                           unsigned int uid) {
  return ensureIpcMap(channelId, uid);
}

void IpcManager::releaseIpc(std::string channelId, unsigned int uid) {
  auto ipc = eraseIpcMap(channelId, uid);

  if (!ipc || ipc == nullptr) {
    return;
  }

  ipc->Disconnect();
  delete ipc;
}
void IpcManager::releaseAllIpc() {
  auto cit = m_ipcMap.begin();
  while (cit != m_ipcMap.end()) {
    std::string channelId = cit->first;
    std::unordered_map<unsigned int, IAgoraIpcDataSender *> uidMap =
        cit->second;

    auto uit = uidMap.begin();
    while (uit != uidMap.end()) {
      unsigned int uid = uit->first;
      IAgoraIpcDataSender *ipc = uit->second;
      if (!ipc || ipc == nullptr) {
        return;
      }
      ipc->Disconnect();
      delete ipc;
      uidMap.erase(uid);
      uit++;
    }
    m_ipcMap.erase(channelId);
    cit++;
  }
}

bool IpcManager::sendData(std::string channelId, unsigned int uid,
                          char *payload, unsigned int len) {
  auto ipc = getIpc(channelId, uid);
  if (!ipc || ipc == nullptr) {
    return false;
  }

  ipc->sendData(payload, len);
  return true;
}

IAgoraIpcDataSender *IpcManager::getIpc(std::string channelId,
                                        unsigned int uid) {
  std::lock_guard<std::mutex> lock(m_lock);

  auto cit = m_ipcMap.find(channelId);
  if (cit == m_ipcMap.end()) {
    return nullptr;
  }

  auto uit = m_ipcMap[channelId].find(uid);
  if (uit == m_ipcMap[channelId].end()) {
    return nullptr;
  }

  return m_ipcMap[channelId][uid];
}

IAgoraIpcDataSender *IpcManager::ensureIpcMap(std::string channelId,
                                              unsigned int uid) {
  std::lock_guard<std::mutex> lock(m_lock);

  auto cit = m_ipcMap.find(channelId);
  if (cit == m_ipcMap.end()) {
    m_ipcMap[channelId] =
        std::unordered_map<unsigned int, IAgoraIpcDataSender *>();
  }

  auto uit = m_ipcMap[channelId].find(uid);
  if (uit == m_ipcMap[channelId].end()) {
    m_ipcMap[channelId][uid] = createIpcSender();
    std::string id = std::string("agoravideosource_") + channelId +
                     std::string("_") + std::to_string(uid);
    bool b = m_ipcMap[channelId][uid]->initialize(id);
    LOG_INFO("ipc Manager initialize id:%s, ret: %d", id.c_str(), b);
  }

  return m_ipcMap[channelId][uid];
}

IAgoraIpcDataSender *IpcManager::eraseIpcMap(std::string channelId,
                                             unsigned int uid) {
  std::lock_guard<std::mutex> lock(m_lock);

  auto cit = m_ipcMap.find(channelId);
  if (cit == m_ipcMap.end()) {
    return nullptr;
  }

  auto uit = m_ipcMap[channelId].find(uid);
  if (uit == m_ipcMap[channelId].end()) {
    return nullptr;
  }

  auto ipc = m_ipcMap[channelId][uid];
  m_ipcMap[channelId].erase(uid);

  return ipc;
}
