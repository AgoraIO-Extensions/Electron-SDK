/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

/**
 * the file define classes used to deliver command and event between node ADDON and video source process.
 */

#ifndef AGORA_VIDEO_SOURCE_IPC_H
#define AGORA_VIDEO_SOURCE_IPC_H
#include <string>
#include <vector>
#include "ipc_shm.h"
#include <functional>
#include "IAgoraRtcEngine.h"
#include <thread>
#include <memory>


#if defined(__APPLE__)
        struct DisplayID
        {
            unsigned int idVal;
            
            DisplayID()
            : idVal(0)
            {}
        };
        typedef DisplayID ScreenIDType;
#elif defined(_WIN32)
        typedef agora::rtc::Rectangle ScreenIDType;
#endif

typedef struct DisplayInfo {
    DisplayInfo(): idVal(0){}
    unsigned int idVal;
} DisplayInfo;

/**
 * AgoraIpcMsg define the message type transferred between node ADDON and vidoe source process
 */
enum AgoraIpcMsg
{
    /**  obsolete*/
    AGORA_IPC_CONNECT = 1,
    /** obsolete  */
    AGORA_IPC_CONNECT_CONFIRM,
    /** obsolete  */
    AGORA_IPC_DISCONNECT,
    /** To notify video source to join channel */
    AGORA_IPC_JOIN,
    /** To notify Video Sink that Video Source is ready*/
    AGORA_IPC_SOURCE_READY,
    /** Video source ==> node ADDON join success event */
    AGORA_IPC_JOIN_SUCCESS,
    /** Node ADDON ==> video source to begin capture screen */
    AGORA_IPC_CAPTURE_SCREEN,
    /** Node ADDON ==> video source to update screen sharing area*/
    AGORA_IPC_UPDATE_CAPTURE_SCREEN,
    /** Node ADDON ==> video source to stop capture screen */
    AGORA_IPC_STOP_CAPTURE_SCREEN,
    /** Node ADDON ==> video source to start video */
    AGORA_IPC_START_CAMERA,
    /** Node ADDON ==> video source to update channelKey */
    AGORA_IPC_RENEW_TOKEN,
    /** Node ADDON ==> video source to set channel profile */
    AGORA_IPC_SET_CHANNEL_PROFILE,
    /** Node ADDON ==> video source to set video profile */
    AGORA_IPC_SET_VIDEO_RPOFILE,
    /** Node ADDON ==> video source to leave channel */
    AGORA_IPC_LEAVE_CHANNEL,
    /** video source render is ready */
    AGORA_IPC_RENDER_READY,
    /**  Node ADDON ==> video source, To start transfer local video of video source.*/
    AGORA_IPC_START_VS_PREVIEW,
    /** video source ==> Node ADDON, local video preview complete.*/
    AGORA_IPC_START_VS_PREVIEW_COMPLETE,
    /** Node ADDON ==> video source, to stop transfer local video of video source. */
    AGORA_IPC_STOP_VS_PREVIEW,
    /** video source ==> Node ADDON, local video preview stopped.*/
    AGORA_IPC_STOP_VS_PREVIEW_COMPLETE,
    /** Node ADDON ==> video source, to enable interoperability with the Agora Web SDK*/
    AGORA_IPC_ENABLE_WEB_SDK_INTEROPERABILITY,
    /** Node ADDON ==> video source, to enable dual stream with the Agora Web SDK*/
    AGORA_IPC_ENABLE_DUAL_STREAM_MODE,
    AGORA_IPC_SET_LOGFILE,
    AGORA_IPC_START_CAPTURE_BY_DISPLAY,
    AGORA_IPC_START_CAPTURE_BY_WINDOW_ID,
    AGORA_IPC_START_SCREEN_CAPTURE_BY_DISPLAY_ID,
    AGORA_IPC_SET_SCREEN_CAPTURE_CONTENT_HINT,
    AGORA_IPC_UPDATE_SCREEN_CAPTURE_PARAMS,
    /** Node ADDON ==> video source, to set rtc parameters*/
    AGORA_IPC_SET_PARAMETER,
    AGORA_IPC_ENABLE_LOOPBACK_RECORDING,
    /** Node ADDON ==> video source, to enable audio*/
    AGORA_IPC_ENABLE_AUDIO,
    AGORA_IPC_SET_ENCRYPTION_MODE,
    AGORA_IPC_ENABLE_ENCRYPTION,
    AGORA_IPC_SET_ENCRYPTION_SECRET,
    AGORA_IPC_ON_LOCAL_AUDIO_STATS,
    AGORA_IPC_ON_LOCAL_VIDEO_STATS,
    AGORA_IPC_ON_VIDEO_SIZECHANGED,
    AGORA_IPC_ON_LOCAL_VIDEO_STATE_CHANGED,
    AGORA_IPC_ON_LOCAL_AUDIO_STATE_CHANGED,
    AGORA_IPC_SET_PROCESS_DPI_AWARE_NESS,
    AGORA_IPC_MUTE_REMOTE_AUDIO_STREAM,
    AGORA_IPC_MUTE_ALL_REMOTE_AUDIO_STREAMS,
    AGORA_IPC_MUTE_REMOTE_VIDEO_STREAM,
    AGORA_IPC_MUTE_ALL_REMOTE_VIDEO_STREAMS,
    AGORA_IPC_SET_ADDON_LOGFILE
};

/**
 * Screen capture parameters when ADDON ask video source to start screen sharing.
 */
struct CaptureScreenCmd
{
#if defined(__APPLE__)
	unsigned int windowid;
#elif defined(_WIN32)
	HWND windowid;
#endif
//   agora::rtc::IRtcEngine::WindowIDType windowid;
    int captureFreq;
    agora::rtc::Rect rect;
    int bitrate;
    CaptureScreenCmd()
        : windowid(0)
        , captureFreq(0)
        , rect()
        , bitrate()
    {}
};

#define MAX_WINDOW_ID_COUNT 128

struct ScreenCaptureParametersCmd
{
    agora::rtc::ScreenCaptureParameters captureParams;
    agora::rtc::IRtcEngine::WindowIDType excludeWindowList[MAX_WINDOW_ID_COUNT];
    int excludeWindowCount;
};

struct CaptureScreenByDisplayCmd
{
    DisplayInfo displayInfo;
    ScreenIDType screenId;
    agora::rtc::Rectangle regionRect;
    agora::rtc::ScreenCaptureParameters captureParams;
    agora::rtc::IRtcEngine::WindowIDType excludeWindowList[MAX_WINDOW_ID_COUNT];
    int excludeWindowCount;
};

struct CaptureScreenByWinCmd
{
    agora::rtc::IRtcEngine::WindowIDType windowId;
    agora::rtc::Rectangle regionRect;
    agora::rtc::ScreenCaptureParameters captureParams;
};

#define MAX_TOKEN_LEN 512
#define MAX_CNAME_LEN 256
#define MAX_CHAN_INFO 512
#define MAX_PERMISSION_KEY 128
/**
 * Join channel parameters when ADDON ask video source to join channel
 */
struct JoinChannelCmd
{
    char token[MAX_TOKEN_LEN];
    char cname[MAX_CNAME_LEN];
    char chan_info[MAX_CHAN_INFO];
    agora::rtc::uid_t uid;
    JoinChannelCmd()
        : token{ 0 }
        , cname{ 0 }
        , chan_info{ 0 }
        , uid{ 0 }
    {}
};

/**
 * video profile parameters when ADDON ask video source to set video profile
 */
struct VideoProfileCmd
{
    agora::rtc::VIDEO_PROFILE_TYPE profile;
    bool swapWidthAndHeight;
    VideoProfileCmd()
        : profile(agora::rtc::VIDEO_PROFILE_DEFAULT)
        , swapWidthAndHeight(false)
    {}
    VideoProfileCmd(agora::rtc::VIDEO_PROFILE_TYPE type, bool swap)
        : profile(type)
        , swapWidthAndHeight(swap)
    {}
};

/**
 * channel profile parameters whne ADDON ask video source to set channel profile
 */
struct ChannelProfileCmd
{
	agora::rtc::CHANNEL_PROFILE_TYPE profile;
	char permissionKey[MAX_PERMISSION_KEY];
	ChannelProfileCmd()
		: profile(agora::rtc::CHANNEL_PROFILE_LIVE_BROADCASTING)
        , permissionKey{ 0 }
    {}
};

/**
 * loopback recording cmd
 */
struct LoopbackRecordingCmd
{
    bool enabled;
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH];
    LoopbackRecordingCmd()
        : enabled(false)
        , deviceName{ NULL }
    {}
};

#define MAX_PARAMETER_LEN 512
struct SetParameterCmd
{
    char parameters[MAX_PARAMETER_LEN];
public:
    SetParameterCmd()
        :parameters{ 0 }
    {}
};

struct EncryptionConfigCmd
{
public:
    bool enable;
    agora::rtc::ENCRYPTION_MODE encryptionMode;
    char encryptionKey[agora::rtc::MAX_DEVICE_ID_LENGTH];

    EncryptionConfigCmd():encryptionMode(agora::rtc::ENCRYPTION_MODE::AES_128_XTS),encryptionKey{'\0'}{
    }

    /* data */
};

struct LocalAudioStatsCmd 
{
public:
    int numChannels;
    /** The sample rate (Hz).
     */
    int sentSampleRate;
    /** The average sending bitrate (Kbps).
     */
    int sentBitrate;
    /** The audio packet loss rate (%) from the local client to the Agora edge server before applying the anti-packet loss strategies.
     */
    unsigned short txPacketLossRate;
};

struct LocalVideoStatsCmd
{
public:
    /** Bitrate (Kbps) sent in the reported interval, which does not include
     * the bitrate of the retransmission video after packet loss.
     */
    int sentBitrate;
    /** Frame rate (fps) sent in the reported interval, which does not include
     * the frame rate of the retransmission video after packet loss.
     */
    int sentFrameRate;
    /** The encoder output frame rate (fps) of the local video.
     */
    int encoderOutputFrameRate;
    /** The render output frame rate (fps) of the local video.
     */
    int rendererOutputFrameRate;
    /** The target bitrate (Kbps) of the current encoder. This value is estimated by the SDK based on the current network conditions.
    */
    int targetBitrate;
    /** The target frame rate (fps) of the current encoder.
    */
    int targetFrameRate;
    /** Quality change of the local video in terms of target frame rate and
     * target bit rate in this reported interval. See #QUALITY_ADAPT_INDICATION.
     */
    agora::rtc::QUALITY_ADAPT_INDICATION qualityAdaptIndication;
    /** The encoding bitrate (Kbps), which does not include the bitrate of the
     * re-transmission video after packet loss.
     */
    int encodedBitrate;
    /** The width of the encoding frame (px).
     */
    int encodedFrameWidth;
    /** The height of the encoding frame (px).
     */
    int encodedFrameHeight;
    /** The value of the sent frames, represented by an aggregate value.
     */
    int encodedFrameCount;
    /** The codec type of the local video:
     * - VIDEO_CODEC_VP8 = 1: VP8.
     * - VIDEO_CODEC_H264 = 2: (Default) H.264.
     */
    agora::rtc::VIDEO_CODEC_TYPE codecType;
    /** The video packet loss rate (%) from the local client to the Agora edge server before applying the anti-packet loss strategies.
     */
    unsigned short txPacketLossRate;
    /** The capture frame rate (fps) of the local video.
     */
    int captureFrameRate;

    agora::rtc::CAPTURE_BRIGHTNESS_LEVEL_TYPE captureBrightnessLevel;
};

struct VideoSizeChangedCmd 
{
public:
    agora::rtc::uid_t uid;
    int width;
    int height;
    int rotation;
};

struct LocalVideoStateChangedCmd
{
public:
    int localVideoState;
    int error;
};

struct LocalAudioStateChangedCmd
{
public:
    int localAudioState;
    int error;
};

struct MuteRemoteStreamsCmd
{
public:
    agora::rtc::uid_t uid;
    bool mute;
};

/**
 * AgoraIpcListener is used to monitor IPC message
 */
class AgoraIpcListener
{
public:
    virtual ~AgoraIpcListener(){}
    virtual void onMessage(unsigned int msg, char* payload, unsigned int len)
    {
        (void)payload;
        (void)len;
    }
};

/**
 * IAgoraIpc is used to facilitate communications between processes. This is one virtual class, may have different implementation on different platforms.
 */
class IAgoraIpc
{
public:
    IAgoraIpc(AgoraIpcListener* listener)
        : m_listener(listener)
    {}
    virtual ~IAgoraIpc(){}
    virtual const std::string& getId(){ return m_id; }
    /**
     * To initialize IPC.
     * @param id : the id used to identify the IPC endpoint.
     */
    virtual bool initialize(const std::string& id) = 0;
    /**
     * To put IPC endpoint in listen state, then other endpoint can connect the endpoint.
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
    virtual bool sendMessage(AgoraIpcMsg msg, char* payload, unsigned int len) = 0;
protected:
    std::string m_id;
    AgoraIpcListener *m_listener;
};

/**
 * The class is used for IPC with large throughput. 
 * AgoraIpcDataSender provide send-only facilities.
 */
#define DATA_DELIVER_BLOCK_SIZE 6145000
//3110450
class AgoraIpcDataSender
{
public:
    AgoraIpcDataSender();
    ~AgoraIpcDataSender();

    /**
     * To initialize the AgoraIpcDataSender.
     * @param id : sender identifier.
     */
    bool initialize(const std::string& id);
    /**
     * To send data.
     * @param payload : the pointer to data to be sent.
     * @param len : the length of the data.
     */
    void sendData(char* payload, unsigned int len);
    /**
     * To send multiple data in one time.
     * @payloads : vector of data to be sent.
     */
    void sendMultiData(const std::vector<std::pair<char*, int32_t>>& payloads);

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
class AgoraIpcDataReceiver
{
public:
    AgoraIpcDataReceiver();
    ~AgoraIpcDataReceiver();

    /**
     * To initialize AgoraIpcDataReciever
     * @param id : IPC identifier
     * @param handler : the receiver event handler.
     */
    bool initialize(const std::string& id, const std::function<void(const char*, int)>& handler);
    /**
     * To start the IPC.
     */
    void run(bool async = false);

    /**
    * To stop the IPC
    */
    void stop();
private:
    std::function<void(const char*, int)> m_handler;
    std::string m_id;
    bool m_initialized;
    shm_ipc<1, DATA_DELIVER_BLOCK_SIZE> m_ipcData;
    std::unique_ptr<std::thread> m_thread;
};

/**
 * To create IAgroaIpc instance.
 */
IAgoraIpc* createAgoraIpc(AgoraIpcListener *listner);

#endif
