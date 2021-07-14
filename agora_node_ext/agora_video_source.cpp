/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#include "agora_video_source.h"
#include "node_log.h"
#include "node_async_queue.h"
#include "node_video_stream_channel.h"
#include "node_process.h"
#include "node_event.h"
#include "node_video_render.h"
#include "node_napi_api.h"
#ifdef _WIN32
#include <Rpc.h>
#include <RpcDce.h>
#else
#include <uuid/uuid.h>
#endif
#include <thread>
#include <functional>
#include <string>
#include <sstream>
#include <fstream>
#include <memory>
#include <vector>
#include <sstream>

#define DATA_IPC_NAME "avsipc"
#define PROCESS_RUN_EVENT_NAME "agora_video_source_process_ready_event_name"
namespace agora{
    namespace rtc{
        /**
         * AgoraVideoSource implementation
         * agoraVideoSource starts two thread, one for message transform, and one for video data transform.
         */

        class AgoraVideoSourceSink : public AgoraVideoSource, public AgoraIpcListener
        {
        public:
            AgoraVideoSourceSink();
            ~AgoraVideoSourceSink();


            virtual bool initialize(IAgoraVideoSourceEventHandler *eventHandler, const char* appid, unsigned int areaCode) override;
            virtual node_error join(const char* token, const char* cname,
                const char* chan_info, uid_t uid) override;
            virtual node_error leave() override;
            virtual node_error release() override;
            virtual node_error renewVideoSourceToken(const char* token) override;
            virtual node_error setVideoSourceChannelProfile(agora::rtc::CHANNEL_PROFILE_TYPE profile, const char* permissionKey) override;
            virtual node_error setVideoSourceVideoProfile(agora::rtc::VIDEO_PROFILE_TYPE profile, bool swapWidthAndHeight) override;
            virtual void onMessage(unsigned int msg, char* payload, unsigned int len) override;
            virtual node_error captureScreen(agora::rtc::IRtcEngine::WindowIDType id, int captureFreq, agora::rtc::Rect* rect, int bitrate) override;
            virtual node_error updateScreenCapture(agora::rtc::Rect* rect) override;
            virtual node_error stopCaptureScreen() override;
            virtual node_error startPreview() override;
            virtual node_error stopPreview() override;
            virtual node_error enableWebSdkInteroperability(bool enabled) override;
            virtual node_error enableDualStreamMode(bool enabled) override;
            virtual node_error setLogFile(const char* file) override;
            virtual node_error setScreenCaptureContentHint(VideoContentHint contentHint) override;
            virtual node_error startScreenCaptureByScreen(ScreenIDType screenId, const Rectangle & regionRect, const agora::rtc::ScreenCaptureParameters & captureParams, const std::vector<agora::rtc::IRtcEngine::WindowIDType>& excludeWindows) override;
            virtual node_error startScreenCaptureByWindow(agora::rtc::IRtcEngine::WindowIDType windowId, const Rectangle & regionRect, const agora::rtc::ScreenCaptureParameters & captureParams) override;
            virtual node_error updateScreenCaptureParameters(const agora::rtc::ScreenCaptureParameters & captureParams, const std::vector<agora::rtc::IRtcEngine::WindowIDType>& excludeWindows) override;
            virtual void setParameters(const char* parameters) override;
            virtual node_error enableLoopbackRecording(bool enabled, const char* deviceName) override;
            virtual node_error enableAudio() override;
            virtual node_error setEncryptionMode(const char *encryptionMode) override;
            virtual node_error enableEncryption(bool enable, EncryptionConfig encryptionConfig) override;
            virtual node_error setEncryptionSecret(const char* secret) override;
            virtual node_error setProcessDpiAwareness() override;
            virtual node_error setAddonLogFile(const char *file) override;

        private:
            void msgThread();
            void deliverFrame(const char* payload, int len);
            void clear();

            void onStartPreviewComplete();

        private:
            std::thread m_msgThread;
            std::mutex m_lock;
            std::unique_ptr<IAgoraIpc> m_ipcMsg;
            std::unique_ptr<AgoraIpcDataReceiver> m_ipcReceiver;
            std::unique_ptr<INodeProcess> m_sourceNodeProcess;
            std::unique_ptr<NodeVideoRender> m_videoRender;
            std::string m_peerId;
            bool m_peerJoined;
            bool m_initialized;
            IAgoraVideoSourceEventHandler *m_eventHandler;
            uid_t m_peerUid;
            NodeEvent m_event;
            buffer_list m_buffers;
            std::vector<char> m_backBuf;
        private:
            static const unsigned int s_bufLen;
        };
        const unsigned int AgoraVideoSourceSink::s_bufLen = (const unsigned int)(2560 * 1600 * 1.5 + 1000);

        AgoraVideoSource* createVideoSource()
        {
            LOG_ENTER;
            return new AgoraVideoSourceSink();
        }

        AgoraVideoSourceSink::AgoraVideoSourceSink()
            : m_msgThread()
            , m_initialized(false)
            , m_event(false)
        {
            LOG_ENTER;
            m_backBuf.resize(AgoraVideoSourceSink::s_bufLen);
        }

        AgoraVideoSourceSink::~AgoraVideoSourceSink()
        {
            LOG_ENTER;
            clear();
            LOG_LEAVE;
        }

        void AgoraVideoSourceSink::clear()
        {
            LOG_ENTER;
            m_initialized = false;
            m_eventHandler = nullptr;
            m_ipcReceiver.reset();
            m_videoRender.reset();
            if (m_ipcMsg.get()) {
                m_ipcMsg->sendMessage(AGORA_IPC_DISCONNECT, nullptr, 0);
                m_ipcMsg->disconnect();
            }
            if(m_msgThread.joinable())
                m_msgThread.join();

            LOG_LEAVE;
        }

        node_error AgoraVideoSourceSink::release()
        {
            LOG_ENTER;
            if (m_initialized){
                LOG_INFO("AgoraVideoSourceSink:%s release m_initialized %d", __FUNCTION__, m_initialized);
                clear();
            }
            LOG_LEAVE;
            return node_ok;
        }

        bool AgoraVideoSourceSink::initialize(IAgoraVideoSourceEventHandler *eventHandler, const char* appid, unsigned int areaCode)
        {
            LOG_ENTER;

            LOG_INFO("VideoSource: AgoraVideoSourceSink %s m_initialized %d", __FUNCTION__, m_initialized);
            if (m_initialized){
                LOG_INFO("VideoSource: AgoraVideoSourceSink %s already initialized", __FUNCTION__);
                return true;
            }
            
            LOG_INFO("VideoSource: AgoraVideoSourceSink %s appid %s", __FUNCTION__, appid);

            if (!appid){
                LOG_ERROR("VideoSource: AgoraVideoSourceSink %s appid not get", __FUNCTION__);
                return false;
            }
            clear();
            m_eventHandler = eventHandler;
#ifdef _WIN32
            UUID uuid = { 0 };
            RPC_CSTR struuid;

            if (UuidCreate(&uuid) != RPC_S_OK){
                LOG_ERROR("VideoSource: AgoraVideoSourceSink %s UuidCreate", __FUNCTION__);
                return false;
            }
            if (UuidToStringA(&uuid, &struuid) != RPC_S_OK){
                LOG_ERROR("VideoSource: AgoraVideoSourceSink %s UuidToStringA", __FUNCTION__);
                return false;
            }
            m_peerId = (LPSTR)struuid;
            RpcStringFreeA(&struuid);
#else
            uuid_t uuid;
            uuid_generate(uuid);
            uuid_string_t uid = {0};
            uuid_unparse(uuid, uid);
            m_peerId = "/";
            m_peerId += uid;
            m_peerId = m_peerId.substr(0, 20);
#endif
            do {
                m_ipcMsg.reset(createAgoraIpc(this));
                if (!m_ipcMsg.get()) {
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s m_ipcMsg not get", __FUNCTION__);
                    break;
                }

                if (!m_ipcMsg->initialize(m_peerId)){
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s m_ipcMsg initialize m_peerId %s fail", __FUNCTION__, m_peerId.c_str());
                    break;
                }

                if (!m_ipcMsg->listen()){
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s m_ipcMsg initialize not listen", __FUNCTION__);
                    break;
                }

                m_msgThread = std::thread(&AgoraVideoSourceSink::msgThread, this);
                std::string targetPath;
                if (!INodeProcess::getCurrentModuleFileName(targetPath)) {
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s getCurrentModuleFileName targetPath %s", __FUNCTION__, targetPath.c_str());
                    break;
                }

                size_t pos = targetPath.find_last_of("\\/");
                if (pos == targetPath.npos) {
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s targetPath.pos not equal", __FUNCTION__);
                    break;
                }

                std::stringstream ss;
                ss << INodeProcess::GetCurrentNodeProcessId();
                std::string path = targetPath.substr(0, pos + 1);
                std::string cmdname = "VideoSource";
                std::string idparam = "id:" + m_peerId;
                std::string pidparam = "pid:" + ss.str();
                std::string appidparam = "appid:" + std::string(appid);
                std::ostringstream os;
                os<<areaCode;
                std::string acparam = "areaCode:" + os.str();

                LOG_INFO("VideoSource: %s areaCodeStr: %s", __FUNCTION__, acparam.c_str());
                const char* params[] = { cmdname.c_str(), idparam.c_str(), pidparam.c_str(), appidparam.c_str(), acparam.c_str(), nullptr };
                m_sourceNodeProcess.reset(INodeProcess::CreateNodeProcess(path.c_str(), params));
                if (!m_sourceNodeProcess.get()) {
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s m_sourceNodeProcess not get", __FUNCTION__);
                    break;
                }

                NodeEvent::WaitResult result = m_event.WaitFor(5000);
                if (result != NodeEvent::WAIT_RESULT_SET) {
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s WAIT_RESULT_SET", __FUNCTION__);
                    break;
                }

                m_sourceNodeProcess->Monitor([eventHandler](INodeProcess* pProcess) {
                    LOG_ERROR("VideoSource: AgoraVideoSourceSink %s onVideoSourceExit", __FUNCTION__);
                    eventHandler->onVideoSourceExit();
                });
                auto nrc = new NodeRenderContext(NODE_RENDER_TYPE_VIDEO_SOURCE);
                ExternalVideoRenerContext context;
                m_videoRender.reset(new NodeVideoRender(nrc, context));
                m_initialized = true;
                return true;
            } while (false);
            LOG_ERROR("VideoSource: AgoraVideoSourceSink %s error", __FUNCTION__);
            clear();
            return false;
        }

        node_error AgoraVideoSourceSink::startPreview()
        {
            LOG_ENTER;
            return m_ipcMsg->sendMessage(AGORA_IPC_START_VS_PREVIEW, nullptr, 0) ? node_ok : node_generic_error;
        }

        void AgoraVideoSourceSink::onStartPreviewComplete()
        {
            LOG_ENTER;
            if (!m_initialized)
                return;
            m_ipcReceiver.reset(new AgoraIpcDataReceiver());
            if (!m_ipcReceiver->initialize(m_peerId + DATA_IPC_NAME, std::bind(&AgoraVideoSourceSink::deliverFrame, this, std::placeholders::_1, std::placeholders::_2))) {
                m_ipcReceiver.reset();
                return;
            }
            m_ipcReceiver->run(true);
        }

        node_error AgoraVideoSourceSink::stopPreview()
        {
            LOG_ENTER;
            if (!m_ipcReceiver)
                return node_status_error;

            return m_ipcMsg->sendMessage(AGORA_IPC_STOP_VS_PREVIEW, nullptr, 0) ? node_ok : node_generic_error;
        }
        
        node_error AgoraVideoSourceSink::enableWebSdkInteroperability(bool enabled)
        {
            LOG_ENTER;
            if (m_initialized){
                return m_ipcMsg->sendMessage(AGORA_IPC_ENABLE_WEB_SDK_INTEROPERABILITY, (char*)&enabled, sizeof(enabled)) ? node_ok : node_generic_error;
            }
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::enableDualStreamMode(bool enabled)
        {
            LOG_ENTER;
            if (m_initialized){
                return m_ipcMsg->sendMessage(AGORA_IPC_ENABLE_DUAL_STREAM_MODE, (char*)&enabled, sizeof(enabled)) ? node_ok : node_generic_error;
            }
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::setLogFile(const char* file)
        {
            LOG_ENTER;
            if (m_initialized){
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_LOGFILE, (char*)file, strlen(file)) ? node_ok : node_generic_error;
            }
            return node_status_error;
        }

        void AgoraVideoSourceSink::setParameters(const char* parameters)
        {
            LOG_ENTER;
            if (!m_initialized)
                return;
            SetParameterCmd cmd;
            strncpy(cmd.parameters, parameters, MAX_PARAMETER_LEN);
            m_ipcMsg->sendMessage(AGORA_IPC_SET_PARAMETER, (char*)&cmd, sizeof(cmd));
        }

        void AgoraVideoSourceSink::msgThread()
        {
            LOG_ENTER;
            m_ipcMsg->run();
        }

        node_error AgoraVideoSourceSink::join(const char* token, const char* cname, const char* chan_info, uid_t uid)
        {
            LOG_ENTER;
            if (m_initialized){
                m_peerUid = uid;
                std::unique_ptr<JoinChannelCmd> cmd(new JoinChannelCmd());
                if (token)
                    strncpy(cmd->token, token, MAX_TOKEN_LEN);
                if (cname) {
                    strncpy(cmd->cname, cname, MAX_CNAME_LEN);
                }
                if (chan_info)
                    strncpy(cmd->chan_info, chan_info, MAX_CHAN_INFO);
                cmd->uid = uid;
                LOG_INFO("%s, sendMessage  join 2 token:%s cname:%s", __FUNCTION__,cmd->token,cmd->cname);
                return m_ipcMsg->sendMessage(AGORA_IPC_JOIN, (char*)cmd.get(), sizeof(JoinChannelCmd)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("%s, AgoraVideoSourceSink not m_initialized", __FUNCTION__);
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::leave()
        {
            LOG_ENTER;
            if (m_initialized) {
                return m_ipcMsg->sendMessage(AGORA_IPC_LEAVE_CHANNEL, nullptr, 0) ? node_ok : node_generic_error;
            }
            LOG_ERROR("%s, AgoraVideoSourceSink  leave error", __FUNCTION__);
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::renewVideoSourceToken(const char* token)
        {
            LOG_ENTER;
            if (!token)
                return node_invalid_args;
            if (m_initialized) {
                return m_ipcMsg->sendMessage(AGORA_IPC_RENEW_TOKEN, (char*)token, strlen(token)) ? node_ok : node_generic_error;
            }
            return node_status_error;
        }
        
        node_error AgoraVideoSourceSink::setVideoSourceChannelProfile(agora::rtc::CHANNEL_PROFILE_TYPE profile, const char* permissionKey)
        {
            LOG_ENTER;
            if (m_initialized){
                std::unique_ptr<ChannelProfileCmd> cmd(new ChannelProfileCmd());
				cmd->profile = profile;
#if defined(_WIN32)
                if (permissionKey)
                    strncpy(cmd->permissionKey, permissionKey, MAX_PERMISSION_KEY);
#endif
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_CHANNEL_PROFILE, (char*)&profile, sizeof(profile)) ? node_ok : node_generic_error;
            }
            return node_status_error;
        }
        
        node_error AgoraVideoSourceSink::setVideoSourceVideoProfile(agora::rtc::VIDEO_PROFILE_TYPE profile, bool swapWidthAndHeight)
        {
            LOG_ENTER;
            if (m_initialized){
                VideoProfileCmd cmd(profile, swapWidthAndHeight);
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_VIDEO_RPOFILE, (char*)&cmd, sizeof(cmd)) ? node_ok : node_generic_error;
            }
            return node_status_error;
        }

        void AgoraVideoSourceSink::onMessage(unsigned int msg, char* payload, unsigned int len)
        {
            LOG_ENTER;
            if (msg == AGORA_IPC_SOURCE_READY) {
                LOG_INFO("AgoraVideoSourceSink:%s       msg: %s", __FUNCTION__,"AGORA_IPC_SOURCE_READY");
                m_event.notifyAll();
            }
            if (!m_initialized)
                return;
           if (msg == AGORA_IPC_JOIN_SUCCESS){
               LOG_INFO("AgoraVideoSourceSink:%s       msg: %s", __FUNCTION__,"AGORA_IPC_JOIN_SUCCESS");
                m_peerJoined = true;
                if (m_eventHandler){
                    m_eventHandler->onVideoSourceJoinedChannel(*((agora::rtc::uid_t*)payload));
                }
            }
            else if (msg == AGORA_IPC_LEAVE_CHANNEL){
                LOG_INFO("AgoraVideoSourceSink:%s       msg: %s", __FUNCTION__,"AGORA_IPC_LEAVE_CHANNEL");
                if (m_eventHandler){
                    m_eventHandler->onVideoSourceLeaveChannel();
                }
            }
            else if (msg == AGORA_IPC_RENEW_TOKEN){
                if (m_eventHandler){
                    m_eventHandler->onVideoSourceRequestNewToken();
                }
            }
            else if (msg == AGORA_IPC_RENDER_READY){
                LOG_INFO("AgoraVideoSourceSink:%s       msg: %s", __FUNCTION__,"AGORA_IPC_RENDER_READY");
                /* TBD */
            }
            else if (msg == AGORA_IPC_START_VS_PREVIEW_COMPLETE) {
                LOG_INFO("AgoraVideoSourceSink:%s       msg: %s", __FUNCTION__,"AGORA_IPC_START_VS_PREVIEW_COMPLETE");
                onStartPreviewComplete();
            }
            else if (msg == AGORA_IPC_ON_LOCAL_AUDIO_STATS) {
                LocalAudioStatsCmd* cmd = (LocalAudioStatsCmd *)payload;
                agora::rtc::LocalAudioStats stats;
                stats.numChannels = cmd->numChannels;
                stats.sentSampleRate = cmd->sentSampleRate;
                stats.sentBitrate = cmd->sentBitrate;
                stats.txPacketLossRate = cmd->txPacketLossRate;
                m_eventHandler->onVideoSourceLocalAudioStats(stats);
            }
            else if (msg == AGORA_IPC_ON_LOCAL_VIDEO_STATS) {
                LocalVideoStatsCmd* cmd = (LocalVideoStatsCmd *)payload;
                agora::rtc::LocalVideoStats stats;
                stats.sentBitrate = cmd->sentBitrate;
                stats.sentFrameRate = cmd->sentFrameRate;
                stats.encoderOutputFrameRate = cmd->encoderOutputFrameRate;
                stats.rendererOutputFrameRate = cmd->rendererOutputFrameRate;
                stats.targetBitrate = cmd->targetBitrate;
                stats.targetFrameRate = cmd->targetFrameRate;
                stats.qualityAdaptIndication = cmd->qualityAdaptIndication;
                stats.encodedBitrate = cmd->encodedBitrate;
                stats.encodedFrameWidth = cmd->encodedFrameWidth;
                stats.encodedFrameHeight = cmd->encodedFrameHeight;
                stats.encodedFrameCount = cmd->encodedFrameCount;
                stats.codecType = cmd->codecType;
                stats.txPacketLossRate = cmd->txPacketLossRate;
                stats.captureFrameRate = cmd->captureFrameRate;
                stats.captureBrightnessLevel = cmd->captureBrightnessLevel;
                m_eventHandler->onVideoSourceLocalVideoStats(stats);
            }
            else if (msg == AGORA_IPC_ON_VIDEO_SIZECHANGED) {
                VideoSizeChangedCmd* cmd = (VideoSizeChangedCmd*)payload;
                m_eventHandler->onVideoSourceVideoSizeChanged(cmd->uid, cmd->width, cmd->height, cmd->rotation);
            }
            else if (msg == AGORA_IPC_ON_LOCAL_AUDIO_STATE_CHANGED) {
                LocalAudioStateChangedCmd* cmd = (LocalAudioStateChangedCmd*)payload;
                m_eventHandler->onVideoSourceLocalAudioStateChanged(cmd->localAudioState, cmd->error);
            }
            else if (msg == AGORA_IPC_ON_LOCAL_VIDEO_STATE_CHANGED) {
                LocalVideoStateChangedCmd* cmd = (LocalVideoStateChangedCmd*)payload;
                m_eventHandler->onVideoSourceLocalVideoStateChanged(cmd->localVideoState, cmd->error);
            }
            else if (msg == AGORA_IPC_STOP_VS_PREVIEW_COMPLETE) {
                LOG_INFO("AgoraVideoSourceSink:%s       msg: %s", __FUNCTION__,"AGORA_IPC_STOP_VS_PREVIEW_COMPLETE");
                m_ipcReceiver.reset();
            }
        }

        node_error AgoraVideoSourceSink::captureScreen(agora::rtc::IRtcEngine::WindowIDType id, int captureFreq, agora::rtc::Rect* rect, int bitrate)
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                CaptureScreenCmd cmd;
                cmd.windowid = id;
                cmd.captureFreq = captureFreq;
                if (rect){
                    cmd.rect = *rect;
                }
                cmd.bitrate = bitrate;
                return m_ipcMsg->sendMessage(AGORA_IPC_CAPTURE_SCREEN, (char*)&cmd, sizeof(cmd)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("AgoraVideoSourceSink: captureScreen error WindowIDType: %d captureFreq:%d  bitrate:%d", __FUNCTION__,id,captureFreq,bitrate);
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::updateScreenCapture(agora::rtc::Rect* rect)
        {
            LOG_ENTER;
            if (!rect){
                LOG_ERROR("updateScreenCapture fail: not exist rect");
                return node_invalid_args;
            }
            if (m_initialized && m_peerJoined){
                return m_ipcMsg->sendMessage(AGORA_IPC_UPDATE_CAPTURE_SCREEN, (char*)rect, sizeof(*rect)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("updateScreenCapture fail");
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::stopCaptureScreen()
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                return m_ipcMsg->sendMessage(AGORA_IPC_STOP_CAPTURE_SCREEN, nullptr, 0) ? node_ok : node_generic_error;
            }
            LOG_ERROR("stopCaptureScreen fail");
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::setScreenCaptureContentHint(VideoContentHint contentHint)
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_SCREEN_CAPTURE_CONTENT_HINT, (char*)&contentHint, sizeof(contentHint)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("setScreenCaptureContentHint fail");
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::startScreenCaptureByScreen(ScreenIDType screenId, const agora::rtc::Rectangle & regionRect, const agora::rtc::ScreenCaptureParameters & captureParams,  const std::vector<agora::rtc::IRtcEngine::WindowIDType>& excludeWindows)
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                CaptureScreenByDisplayCmd cmd;

                int count = MAX_WINDOW_ID_COUNT < excludeWindows.size() ? MAX_WINDOW_ID_COUNT : excludeWindows.size();

                cmd.screenId = screenId;
                cmd.regionRect = regionRect;
                cmd.captureParams = captureParams;
                cmd.excludeWindowCount = count;
                for (int i = 0; i < count; i++) {
                    cmd.excludeWindowList[i] = excludeWindows[i];
                }
                
                return m_ipcMsg->sendMessage(AGORA_IPC_START_CAPTURE_BY_DISPLAY, (char*)&cmd, sizeof(cmd)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("startScreenCaptureByScreen fail  screenId:%d",screenId);
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::startScreenCaptureByWindow(agora::rtc::IRtcEngine::WindowIDType windowId, const Rectangle & regionRect, const agora::rtc::ScreenCaptureParameters & captureParams)
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                CaptureScreenByWinCmd cmd;
                cmd.windowId = windowId;
                cmd.regionRect = regionRect;
                cmd.captureParams = captureParams;
                return m_ipcMsg->sendMessage(AGORA_IPC_START_CAPTURE_BY_WINDOW_ID, (char*)&cmd, sizeof(cmd)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("startScreenCaptureByWindow fail screenId:%d",windowId);
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::updateScreenCaptureParameters(const agora::rtc::ScreenCaptureParameters & captureParams, const std::vector<agora::rtc::IRtcEngine::WindowIDType>& excludeWindows)
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                ScreenCaptureParametersCmd cmd;

                int count = MAX_WINDOW_ID_COUNT < excludeWindows.size() ? MAX_WINDOW_ID_COUNT : excludeWindows.size();

                cmd.captureParams = captureParams;
                cmd.excludeWindowCount = count;
                for (int i = 0; i < count; i++) {
                    cmd.excludeWindowList[i] = excludeWindows[i];
                }
                
                return m_ipcMsg->sendMessage(AGORA_IPC_UPDATE_SCREEN_CAPTURE_PARAMS, (char*)&cmd, sizeof(cmd)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("startScreenCaptureByWindow fail");
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::enableLoopbackRecording(bool enabled, const char* deviceName)
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                LoopbackRecordingCmd cmd;
                cmd.enabled = enabled;
                if(deviceName != NULL) {
                    strncpy(cmd.deviceName, deviceName, MAX_DEVICE_ID_LENGTH);
                }
                return m_ipcMsg->sendMessage(AGORA_IPC_ENABLE_LOOPBACK_RECORDING, (char*)&cmd, sizeof(cmd)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("enableLoopbackRecording fail %d", enabled);
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::enableAudio()
        {
            LOG_ENTER;
            if (m_initialized && m_peerJoined){
                return m_ipcMsg->sendMessage(AGORA_IPC_ENABLE_AUDIO, nullptr, 0) ? node_ok : node_generic_error;
            }
            LOG_ERROR("enableAudio fail");
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::setEncryptionMode(const char *encryptionMode)
        {
            LOG_ENTER;
            if (m_initialized){
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_ENCRYPTION_MODE, (char *)encryptionMode, sizeof(const char *)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("setEncryptionMode fail");
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::setEncryptionSecret(const char* secret)
        {
            LOG_ENTER;
            if (m_initialized){
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_ENCRYPTION_SECRET, (char *)secret, sizeof(const char *)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("setEncryptionSecret fail %s",secret);
            return node_status_error;      
        }

        node_error AgoraVideoSourceSink::enableEncryption(bool enable, EncryptionConfig encryptionConfig)
        {
            LOG_ENTER;
            if (m_initialized){
                EncryptionConfigCmd cmd;
                cmd.enable = enable;
                cmd.encryptionMode = encryptionConfig.encryptionMode;
                if(encryptionConfig.encryptionKey) {
                    strncpy(cmd.encryptionKey, encryptionConfig.encryptionKey, MAX_DEVICE_ID_LENGTH);
                }
                return m_ipcMsg->sendMessage(AGORA_IPC_ENABLE_ENCRYPTION, (char*)&cmd, sizeof(cmd)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("enableEncryption fail %d",enable);
            return node_status_error;
        }

        node_error AgoraVideoSourceSink::setProcessDpiAwareness()
        {
            LOG_ENTER;
            if (m_initialized) {
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_PROCESS_DPI_AWARE_NESS, nullptr, 0) ? node_ok : node_generic_error;
            }
            LOG_ERROR("setProcessDpiAwareness fail");
            return node_status_error;
        }

        void AgoraVideoSourceSink::deliverFrame(const char* payload , int len)
        {
            if (len > (int)m_backBuf.size())
                return;
            char* pBack = m_backBuf.data();
            memcpy(pBack, payload, len);
            auto *p = getNodeVideoFrameTransporter();
            p->deliverVideoSourceFrame(pBack, len);
        }
        node_error AgoraVideoSourceSink::setAddonLogFile(const char* file)
        {
            LOG_ENTER;
            if (m_initialized){
                return m_ipcMsg->sendMessage(AGORA_IPC_SET_ADDON_LOGFILE, (char*)file, strlen(file)) ? node_ok : node_generic_error;
            }
            LOG_ERROR("setAddonLogFile fail %s",file);
            return node_status_error;
        }
    }
}
