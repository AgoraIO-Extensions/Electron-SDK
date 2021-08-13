/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#include "video_source.h"
#include "video_source_event_handler.h"
#include "video_source_render.h"
#include "video_source_param_parser.h"
#include "video_source_ipc.h"
#include "node_log.h"

#define PROCESS_RUN_EVENT_NAME "agora_video_source_process_ready_event_name"
#define DATA_IPC_NAME "avsipc"

using agora::rtc::RtcEngineContext;
using agora::rtc::uid_t;
using agora::rtc::AVideoDeviceManager;
using agora::rtc::AAudioDeviceManager;

AgoraVideoSource::AgoraVideoSource(const std::string& param)
	: m_initialized(false)
	, m_params(param)
	, m_videoProfile(agora::rtc::VIDEO_PROFILE_DEFAULT)
{
    LOG_ENTER;
    LOG_LEAVE;
}

AgoraVideoSource::~AgoraVideoSource()
{
    LOG_ENTER;
    m_rtcEngine.reset();
    m_eventHandler.reset();
    m_renderFactory.reset();
    m_ipc.reset();
    m_paramParser.reset();
    if (m_videoVdm)
    {
        delete m_videoVdm;
    }
    if (m_audioVdm)
    {
        delete m_audioVdm;
    }
    LOG_LEAVE;
}

std::string AgoraVideoSource::getId()
{
    return m_paramParser->getParameter("id");
}

bool AgoraVideoSource::initialize()
{
    LOG_ENTER;
    m_paramParser.reset(new VideoSourceParamParser());
    m_paramParser->initialize(m_params);

    std::string appid = m_paramParser->getParameter("appid");
    if (appid.empty()) {
        LOG_ERROR("%s, appid is null\n", __FUNCTION__);
        LOG_LEAVE;
        return false;
    }

    std::string id = m_paramParser->getParameter("id");
    if (id.empty()) {
        LOG_ERROR("%s, id is null\n", __FUNCTION__);
        LOG_LEAVE;
        return false;
    }

    m_ipc.reset(createAgoraIpc(this));
    if (!m_ipc->initialize(id)){
        LOG_ERROR("%s, ipc init fail\n", __FUNCTION__);
        LOG_LEAVE;
        return false;
    }
    if (!m_ipc->connect()){
        LOG_ERROR("%s, ipc connect fail.\n", __FUNCTION__);
        LOG_LEAVE;
        return false;
    }

    m_rtcEngine.reset(createAgoraRtcEngine());
    if (!m_rtcEngine.get()){
        LOG_ERROR("%s, rtcengine create fail.\n", __FUNCTION__);
        LOG_LEAVE;
        return false;
    }


    m_eventHandler.reset(new AgoraVideoSourceEventHandler(*this));
    m_renderFactory.reset(new AgoraVideoSourceRenderFactory(*this));
    RtcEngineContext context;
    context.eventHandler = m_eventHandler.get();
    context.appId = appid.c_str();
    LOG_ERROR("initialized: %s, appid\n", __FUNCTION__);
    if (m_rtcEngine->initialize(context) != 0){
        LOG_ERROR("%s, AgoraVideoSource initialize failed.\n", __FUNCTION__);
        LOG_LEAVE;
        return false;
    }

    agora::util::AutoPtr<agora::media::IMediaEngine> pMediaEngine;
    pMediaEngine.queryInterface(m_rtcEngine.get(), agora::AGORA_IID_MEDIA_ENGINE);

    if (pMediaEngine.get()){
        pMediaEngine->registerVideoRenderFactory(m_renderFactory.get());
    }
    else{
        LOG_ERROR("%s, Get media engine failed.\n", __FUNCTION__);
        LOG_LEAVE;
        return false;
    }
    
    m_rtcEngine->disableAudio();
    m_rtcEngine->enableVideo();

    agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
    rep.enableLocalVideo(false);
    rep.muteAllRemoteVideoStreams(true);
    rep.muteAllRemoteAudioStreams(true);

    //prevent videosource from getting camera causing problems in windows
    agora::rtc::AParameter ap(m_rtcEngine.get());
    ap->setParameters("{\"che.video.local.camera_index\":1024}");

    m_ipc->sendMessage(AGORA_IPC_SOURCE_READY, nullptr, 0);
    m_initialized = true;
    LOG_LEAVE;
    return true;
}

node_error AgoraVideoSource::startPreview()
{
    int status = 0;
    do {
        std::string id = m_paramParser->getParameter("id");
        m_ipcSender.reset(new AgoraIpcDataSender());
        if (!m_ipcSender->initialize(id + DATA_IPC_NAME)) {
            LOG_ERROR("%s, ipc sender init fail.", __FUNCTION__);
            status = -1;
            break;
        }
        agora::rtc::VideoCanvas canvas;
        canvas.uid = 0;
        canvas.renderMode = agora::rtc::RENDER_MODE_HIDDEN;
        canvas.view = m_renderFactory.get();
        m_rtcEngine->setupLocalVideo(canvas);
    }
    while (false);
    m_ipc->sendMessage(AGORA_IPC_START_VS_PREVIEW_COMPLETE, (char*)&status, sizeof(status));
    return status == 0 ? node_ok : node_generic_error;
}

node_error AgoraVideoSource::stopPreview()
{
    agora::rtc::VideoCanvas canvas;
    m_rtcEngine->setupLocalVideo(canvas);

    {
        std::lock_guard<std::mutex> lock(m_ipcSenderMutex);
        m_ipcSender.reset();
    }

    return m_ipc->sendMessage(AGORA_IPC_STOP_VS_PREVIEW_COMPLETE, nullptr, 0) ? node_ok : node_generic_error;
}

void AgoraVideoSource::notifyJoinedChannel(uid_t uid)
{
    m_ipc->sendMessage(AGORA_IPC_JOIN_SUCCESS, (char*)&uid, sizeof(uid));
}

void AgoraVideoSource::notifyRenderReady()
{
    m_ipc->sendMessage(AGORA_IPC_RENDER_READY, nullptr, 0);
}

void AgoraVideoSource::notifyLeaveChannel()
{
    m_ipc->sendMessage(AGORA_IPC_LEAVE_CHANNEL, nullptr, 0);
}

void AgoraVideoSource::notifyRequestNewToken()
{
    m_ipc->sendMessage(AGORA_IPC_RENEW_TOKEN, nullptr, 0);
}

void AgoraVideoSource::release()
{
    delete this;
}

void AgoraVideoSource::onMessage(unsigned int msg, char* payload, unsigned int len)
{
    LOG_ENTER;
    if (!m_initialized){
        LOG_ERROR("%s, no init.\n", __FUNCTION__);
        LOG_LEAVE;
        return;
    }
    LOG_INFO("%s, msg : %d\n", __FUNCTION__, msg);
    if (msg == AGORA_IPC_JOIN){
        if (payload){
            JoinChannelCmd *cmd = (JoinChannelCmd*)payload;
            joinChannel(cmd->token, cmd->cname, cmd->chan_info, cmd->uid);
        }
    }
    else if (msg == AGORA_IPC_CAPTURE_SCREEN){
        if (len != sizeof(CaptureScreenCmd)){
            LOG_ERROR("%s, Size not equal with capture screen cmd.\n", __FUNCTION__);
            LOG_LEAVE;
            return;
        }
        agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
        CaptureScreenCmd *cmd = (CaptureScreenCmd*)payload;
        LOG_INFO("Start screen share, top : %d, left : %d, bottom :%d, right :%d\n", cmd->rect.top, cmd->rect.left, cmd->rect.bottom, cmd->rect.right);
        if (m_rtcEngine->startScreenCapture(cmd->windowid, cmd->captureFreq, &cmd->rect, cmd->bitrate) != 0) {
            LOG_ERROR("start screen capture failed.");
            rep.enableLocalVideo(false);
        } else {
            rep.enableLocalVideo(true);
        }
    }
    else if (msg == AGORA_IPC_STOP_CAPTURE_SCREEN){
        agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
        rep.enableLocalVideo(false);
        m_rtcEngine->stopScreenCapture();
    }
    else if (msg == AGORA_IPC_START_VS_PREVIEW) {
        this->startPreview();
    }
    else if (msg == AGORA_IPC_STOP_VS_PREVIEW) {
        this->stopPreview();
    }
    else if (msg == AGORA_IPC_RENEW_TOKEN){
        m_rtcEngine->renewToken(payload);
    }
    else if (msg == AGORA_IPC_SET_CHANNEL_PROFILE){
        if (payload) {
            ChannelProfileCmd *cmd = (ChannelProfileCmd*)payload;
            m_rtcEngine->setChannelProfile(cmd->profile);
            if (cmd->profile == agora::rtc::CHANNEL_PROFILE_LIVE_BROADCASTING){
                m_rtcEngine->setClientRole(agora::rtc::CLIENT_ROLE_BROADCASTER);
            }
        }
    }
    else if (msg == AGORA_IPC_SET_VIDEO_RPOFILE){
        if (len != sizeof(VideoProfileCmd)) {
            LOG_ERROR("%s, size not equal with video profile size.\n", __FUNCTION__);
            LOG_LEAVE;
            return;
        }
        VideoProfileCmd *cmd = (VideoProfileCmd*)payload;
		if (cmd->profile > agora::rtc::VIDEO_PROFILE_LANDSCAPE_4K_3) {
			LOG_ERROR("%s, set video profile with invalid value : %d", __FUNCTION__, cmd->profile);
		}
		else {
			this->m_videoProfile = (agora::rtc::VIDEO_PROFILE_TYPE)cmd->profile;
			m_rtcEngine->setVideoProfile(cmd->profile, cmd->swapWidthAndHeight);
		}
    }
    else if (msg == AGORA_IPC_LEAVE_CHANNEL) {
        m_rtcEngine->leaveChannel();
    }
    else if (msg == AGORA_IPC_DISCONNECT){
        this->exit(false);
    }
    else if (msg == AGORA_IPC_ENABLE_WEB_SDK_INTEROPERABILITY) {
        agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
        rep.enableWebSdkInteroperability((bool)*payload);
    }
    else if (msg == AGORA_IPC_ENABLE_DUAL_STREAM_MODE) {
        agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
        rep.enableDualStreamMode((bool)*payload);
    }
    else if (msg == AGORA_IPC_SET_LOGFILE) {
        agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
        rep.setLogFile((char*)payload);
    }
    else if (msg == AGORA_IPC_SET_PARAMETER) {
        if (len != sizeof(SetParameterCmd))
            return;
        SetParameterCmd *cmd = (SetParameterCmd*)payload;
        agora::rtc::AParameter rep(m_rtcEngine.get());
        rep->setParameters(cmd->parameters);
    }
    else if(msg == AGORA_IPC_UPDATE_CAPTURE_SCREEN) {
        if(payload) {
            m_rtcEngine->updateScreenCaptureRegion((const agora::rtc::Rect *)payload);
        }
    }
    else if(msg == AGORA_IPC_START_CAPTURE_BY_DISPLAY) {
        if (payload) {
            CaptureScreenByDisplayCmd *cmd = (CaptureScreenByDisplayCmd*)payload;
            agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
            int result = 0;
#if defined(_WIN32)
            result = m_rtcEngine->startScreenCaptureByScreenRect(cmd->screenId, cmd->regionRect, cmd->captureParams);
#elif defined(__APPLE__)
            result = m_rtcEngine->startScreenCaptureByDisplayId(cmd->screenId.idVal, cmd->regionRect, cmd->captureParams);
#endif
            if(result != 0) {
                LOG_ERROR("start screen capture by display failed.");
                rep.enableLocalVideo(false);
            } else {
                rep.enableLocalVideo(true);
            }
        }
    }
    else if(msg == AGORA_IPC_START_CAPTURE_BY_WINDOW_ID) {
        if (payload) {
            CaptureScreenByWinCmd *cmd = (CaptureScreenByWinCmd*)payload;
            agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
            int result = m_rtcEngine->startScreenCaptureByWindowId(reinterpret_cast<agora::rtc::view_t>(cmd->windowId), cmd->regionRect, cmd->captureParams);

            if(result != 0) {
                LOG_ERROR("start screen capture by display failed.");
                rep.enableLocalVideo(false);
            } else {
                rep.enableLocalVideo(true);
            }
        }
    }
    else if(msg == AGORA_IPC_UPDATE_SCREEN_CAPTURE_PARAMS) {
        if (payload) {
            agora::rtc::ScreenCaptureParameters* params = (agora::rtc::ScreenCaptureParameters*)payload;
            m_rtcEngine->updateScreenCaptureParameters(*params);
        }
    }
    else if(msg == AGORA_IPC_SET_SCREEN_CAPTURE_CONTENT_HINT) {
        m_rtcEngine->setScreenCaptureContentHint((agora::rtc::VideoContentHint)*payload);
    }
    else if(msg == AGORA_IPC_ENABLE_LOOPBACK_RECORDING) {
        if (len != sizeof(LoopbackRecordingCmd))
            return;
        LoopbackRecordingCmd *cmd = (LoopbackRecordingCmd*)payload;
        agora::rtc::RtcEngineParameters rep(m_rtcEngine.get());
        rep.enableLoopbackRecording(cmd->enabled, cmd->deviceName);
    }
    else if(msg == AGORA_IPC_ENABLE_AUDIO) {
        m_rtcEngine->enableAudio();
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_SET_VIDEO_DEVICE) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_SET_VIDEO_DEVICE");
        if (!m_videoVdm && m_rtcEngine.get()) {
            LOG_INFO("AGORA_IPC_VIDEO_SOURCE_SET_VIDEO_DEVICE create m_videoVdm");
            m_videoVdm = new AVideoDeviceManager(m_rtcEngine.get());
        }
        agora::rtc::IVideoDeviceManager* vdm = nullptr;
        if (m_videoVdm) {
            vdm = m_videoVdm->get();
        }
        if (vdm) {
            LOG_INFO("AGORA_IPC_VIDEO_SOURCE_SET_VIDEO_DEVICE setDevice %s",payload);
            vdm->setDevice((char *)payload);
        }
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_ENABLE_VIDEO) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_ENABLE_VIDEO enableVideo");
        m_rtcEngine->enableVideo();
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_DISABLE_VIDEO) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_DISABLE_VIDEO disableVideo");
        m_rtcEngine->disableVideo();
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_DISABLE_AUDIO) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_DISABLE_AUDIO disableAudio");
        m_rtcEngine->disableAudio();
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_ENABLE_LOCAL_VIDEO) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_ENABLE_LOCAL_VIDEO enableLocalAudio %d",*payload);
        m_rtcEngine->enableLocalVideo((bool)*payload);
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_ENABLE_LOCAL_AUDIO) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_ENABLE_LOCAL_AUDIO enableVideo %d",*payload);
        m_rtcEngine->enableLocalAudio((bool)*payload);
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_SET_VIDEO_ENCODER_CONFIGURATION) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_SET_VIDEO_ENCODER_CONFIGURATION setVideoEncoderConfiguration");
        agora::rtc::VideoEncoderConfiguration *config = (agora::rtc::VideoEncoderConfiguration *)payload;
        m_rtcEngine->setVideoEncoderConfiguration(*config);
    }
    else if(msg == AGORA_IPC_VIDEO_SOURCE_SET_CLIENT_ROLE) {
        LOG_INFO("AGORA_IPC_VIDEO_SOURCE_SET_CLIENT_ROLE role:%d",*payload);
        m_rtcEngine->setClientRole((agora::rtc::CLIENT_ROLE_TYPE)*payload);
    }
    else if (msg == AGORA_IPC_SET_ADDON_LOGFILE) {
        stopLogService();
        startLogService((char*)payload);
        LOG_INFO("set addon log file\n");
    }
    LOG_LEAVE;
}

bool AgoraVideoSource::joinChannel(const char* key, const char* name, const char* chanInfo, agora::rtc::uid_t uid)
{
    return m_rtcEngine->joinChannel(key ? key : "", name ? name : "", chanInfo ? chanInfo : "", uid);
}

void AgoraVideoSource::exit(bool notifySink)
{
    // {
        // fix CSD-8509
        //std::lock_guard<std::mutex> lock(m_ipcSenderMutex);
        m_ipcSender->Disconnect();
    // }
    m_ipc->disconnect();
}

void AgoraVideoSource::run()
{
    LOG_ENTER;
#ifdef _WIN32
    std::string idstr = m_paramParser->getParameter("pid");
#else
    std::string idstr = m_paramParser->getParameter("fd");
#endif
    if (idstr.empty()){
        LOG_ERROR("%s, pid is null\n", __FUNCTION__);
        LOG_LEAVE;
        return;
    }
    m_process.reset(INodeProcess::OpenNodeProcess(std::atoi(idstr.c_str())));
    if (!m_process.get()){
        LOG_ERROR("Process open fail.\n");
        LOG_LEAVE;
        return;
    }
    m_process->Monitor([this](INodeProcess*) {
        LOG_WARNING("%s, remote process ext.\n", __FUNCTION__);
        this->exit(false);
    });
    m_ipc->run();
    LOG_LEAVE;
}

bool AgoraVideoSource::sendData(char* payload, int len)
{
    if (!payload || len == 0)
        return false;

    std::lock_guard<std::mutex> lock(m_ipcSenderMutex);

    if (m_ipcSender) {
        m_ipcSender->sendData(payload, len);
        LOG_INFO("Send data success\n");
        return true;
    }
    else {
        LOG_WARNING("IPC Sender not initialized before send data.");
        return false;
    }
}

agora::rtc::VIDEO_PROFILE_TYPE AgoraVideoSource::getVideoProfile()
{
	return m_videoProfile;
}

void initLogService()
{
    std::string currentPath;
    INodeProcess::getCurrentModuleFileName(currentPath);
    std::string logFile = currentPath + ".txt";
    startLogService(logFile.c_str());
}

int main(int argc, char* argv[])
{
    initLogService();
    if (argc < 3){
        LOG_ERROR("Need at least 3 parameter. Current parameter num : %d\n", argc);
        return 0;
    }
    std::string param;
    for (int i = 1; i < argc; i++) {
        param.append(argv[i]);
        param.append(" ");
    }
    LOG_INFO("Args : %s\n", param.c_str());
    auto videoSource = new AgoraVideoSource(param);
    videoSource->initialize();
    videoSource->run();
    videoSource->release();
    stopLogService();
}
