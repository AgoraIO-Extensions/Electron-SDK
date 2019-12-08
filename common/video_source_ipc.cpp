/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#include "video_source_ipc.h"
#include "ipc_shm.h"
#include "node_log.h"

#define VIDEO_SOURCE_BLOCK_NUM 10
#define VIDEO_SOURCE_BLOCK_SIZE 1536

struct VideoSourceIpcMsgHeader
{
    AgoraIpcMsg msg;
    uint32_t len;
};

class AgoraVideoSourceIpcImpl : public IAgoraIpc
{
public:
    AgoraVideoSourceIpcImpl(AgoraIpcListener* listener);
    ~AgoraVideoSourceIpcImpl();

    virtual bool initialize(const std::string& id) override;
    virtual bool connect() override;
    virtual bool disconnect() override;
    virtual bool listen() override;
    virtual void run() override;
    virtual bool sendMessage(AgoraIpcMsg msg, char* payload, unsigned int len) override;
private:
    shm_ipc<VIDEO_SOURCE_BLOCK_NUM, VIDEO_SOURCE_BLOCK_SIZE> m_ipc;
    std::string m_id;
    bool m_ipcOwner;
    const static uint32_t s_ipcChannelNum;
    const static uint32_t s_ipcSourceWriteChannelId;
    const static uint32_t s_ipcSourceReadChannelId;
};

const uint32_t AgoraVideoSourceIpcImpl::s_ipcChannelNum = 2;
const uint32_t AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId = 0;
const uint32_t AgoraVideoSourceIpcImpl::s_ipcSourceReadChannelId = 1;

AgoraVideoSourceIpcImpl::AgoraVideoSourceIpcImpl(AgoraIpcListener* listener)
    : IAgoraIpc(listener)
    , m_id()
    , m_ipcOwner(false)
{}

AgoraVideoSourceIpcImpl::~AgoraVideoSourceIpcImpl()
{
    disconnect();
    if (m_ipcOwner){
        m_ipc.close();
        m_ipc.remove(m_id);
    }
}

bool AgoraVideoSourceIpcImpl::initialize(const std::string& id)
{
    m_id = id;
    return true;
}

bool AgoraVideoSourceIpcImpl::connect()
{
    if (m_ipc.open(m_id) != 0){
        return false;
    }

    if (m_ipc.open_channel(AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId, CHANNEL_READ) != 0){
        m_ipc.close();
        return false;
    }

    if (m_ipc.open_channel(AgoraVideoSourceIpcImpl::s_ipcSourceReadChannelId, CHANNEL_WRITE) != 0){
        m_ipc.close_channel(AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId, CHANNEL_READ);
        m_ipc.close();
        return false;
    }
    return true;
}

bool AgoraVideoSourceIpcImpl::disconnect()
{
    m_ipc.close_channel(AgoraVideoSourceIpcImpl::s_ipcSourceReadChannelId, m_ipcOwner ? CHANNEL_READ : CHANNEL_WRITE);
    m_ipc.close_channel(AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId, m_ipcOwner ? CHANNEL_WRITE : CHANNEL_READ);
    return true;
}

bool AgoraVideoSourceIpcImpl::listen()
{
    if (m_ipc.create(m_id, AgoraVideoSourceIpcImpl::s_ipcChannelNum) != 0){
        return false;
    }
    if (m_ipc.open(m_id) != 0){
        m_ipc.remove(m_id);
        return false;
    }
    if (m_ipc.open_channel(AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId, CHANNEL_WRITE) != 0){
        m_ipc.close();
        m_ipc.remove(m_id);
        return false;
    }

    if (m_ipc.open_channel(AgoraVideoSourceIpcImpl::s_ipcSourceReadChannelId, CHANNEL_READ) != 0){
        m_ipc.close_channel(AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId, CHANNEL_WRITE);
        m_ipc.close();
        m_ipc.remove(m_id);
        return false;
    }

    m_ipcOwner = true;
    return true;
}

void AgoraVideoSourceIpcImpl::run()
{
    char *readBuf = new char[VIDEO_SOURCE_BLOCK_SIZE];
    VideoSourceIpcMsgHeader *header;
    uint32_t fd = m_ipcOwner ? AgoraVideoSourceIpcImpl::s_ipcSourceReadChannelId : AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId;
    while (true){
        int ret = m_ipc.read(fd, readBuf, VIDEO_SOURCE_BLOCK_SIZE);
        if (ret < 0)
            break;
        if (m_listener) {
            header = (VideoSourceIpcMsgHeader *)readBuf;
            m_listener->onMessage(header->msg, readBuf + sizeof(VideoSourceIpcMsgHeader), header->len);
        }
    }
    delete[] readBuf;
}

bool AgoraVideoSourceIpcImpl::sendMessage( AgoraIpcMsg msg, char* payload, unsigned int len)
{
    uint32_t fd = m_ipcOwner ? AgoraVideoSourceIpcImpl::s_ipcSourceWriteChannelId : AgoraVideoSourceIpcImpl::s_ipcSourceReadChannelId;
    VideoSourceIpcMsgHeader hdr = { msg, len };
    std::vector<std::pair<char*, int32_t>> data;
    data.push_back(std::make_pair<char*, unsigned int>((char*)&hdr, sizeof(hdr)));
    data.push_back(std::make_pair<char*, unsigned int>(std::move(payload), std::move(len)));

    m_ipc.write(fd, data);
    return true;
}

IAgoraIpc* createAgoraIpc(AgoraIpcListener *listner)
{
    return new AgoraVideoSourceIpcImpl(listner);
}

/*****************************************************************
       AgoraIpcDataSender
******************************************************************/

AgoraIpcDataSender::AgoraIpcDataSender()
    : m_ipcData()
    , m_initialized(false)
{}

AgoraIpcDataSender::~AgoraIpcDataSender()
{
    if (m_initialized){
        m_ipcData.close_channel(0, CHANNEL_WRITE);
        m_ipcData.close();
        m_ipcData.remove(m_id);
    }
}

bool AgoraIpcDataSender::initialize(const std::string& id)
{
    LOG_ENTER;
    if (m_ipcData.create(id, 1) != 0){
        LOG_ERROR("%s, ipc data create fail, errno :%d\n", __FUNCTION__, errno);
        LOG_LEAVE;
        return false;
    }
    if (m_ipcData.open(id) != 0){
        LOG_ERROR("%s, ipc data open fail, errno :%d\n", __FUNCTION__, errno);
        m_ipcData.remove(id);
        LOG_LEAVE;
        return false;
    }
    if (m_ipcData.open_channel(0, CHANNEL_WRITE) != 0){
        m_ipcData.close();
        m_ipcData.remove(id);
        LOG_ERROR("%s, ipc data open channel fail, errno :%d\n", __FUNCTION__, errno);
        LOG_LEAVE;
        return false;
    }
    m_id = id;
    m_initialized = true;
    LOG_LEAVE;
    return true;
}

void AgoraIpcDataSender::sendData(char* payload, unsigned int len)
{
    m_ipcData.write(0, payload, len);
}

void AgoraIpcDataSender::sendMultiData(const std::vector<std::pair<char *, int32_t>>& payloads)
{
    m_ipcData.write(0, payloads);
}

void AgoraIpcDataSender::Disconnect()
{
    m_ipcData.close_channel(0, CHANNEL_WRITE);
}

/****************************************************************
       AgoraIpcDataReceiver
****************************************************************/

AgoraIpcDataReceiver::AgoraIpcDataReceiver()
    : m_handler(nullptr)
    , m_initialized(false)
    , m_ipcData()
{
}

AgoraIpcDataReceiver::~AgoraIpcDataReceiver()
{
    stop();
}

bool AgoraIpcDataReceiver::initialize(const std::string& id, const std::function<void(const char*, int)>& handler)
{
    if (m_ipcData.open(id) != 0){
        return false;
    }
    if (m_ipcData.open_channel(0, CHANNEL_READ) != 0){
        m_ipcData.close();
        return false;
    }
    m_id = id;
    m_handler = handler;
    m_initialized = true;
    return true;
}

void AgoraIpcDataReceiver::run(bool async)
{
    auto callback = [this]() {
        char* buffer = new char[DATA_DELIVER_BLOCK_SIZE];

        if (!buffer)
            return;

        while (true) {
            if (m_ipcData.read(0, buffer, DATA_DELIVER_BLOCK_SIZE) >= 0) {
                if (m_handler) {
                    m_handler(buffer, DATA_DELIVER_BLOCK_SIZE);
                }
            }
            else {
                break;
            }
        }
        delete[] buffer;
    };
    if (async) {
        m_thread.reset(new std::thread(callback));
    }
    else {
        callback();
    }
}

void AgoraIpcDataReceiver::stop()
{
    if (m_initialized) {
        m_ipcData.close_channel(0, CHANNEL_READ);

        if (m_thread && m_thread->joinable())
            m_thread->join();
        m_ipcData.close();
    }
}
