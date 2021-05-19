//
// Created by LXH on 2021/2/24.
//

#ifndef IRIS_RTC_TEST_H_
#define IRIS_RTC_TEST_H_

#include "IAgoraRtcChannel.h"
#include "internal/iris_json_utils.h"
#include "iris_event_handler.h"
#include "iris_rtc_base.h"
#include <map>

namespace agora {
namespace iris {
namespace rtc {
namespace test {
class IRIS_DEBUG_CPP_API IrisRtcEngineTester : public agora::rtc::IRtcEngine {
 public:
  int initialize(const agora::rtc::RtcEngineContext &context) override;
  int setChannelProfile(agora::rtc::CHANNEL_PROFILE_TYPE profile) override;
  int setClientRole(agora::rtc::CLIENT_ROLE_TYPE role) override;
  int setClientRole(agora::rtc::CLIENT_ROLE_TYPE role,
                    const agora::rtc::ClientRoleOptions &options) override;
  int joinChannel(const char *token, const char *channelId, const char *info,
                  agora::rtc::uid_t uid) override;
  int joinChannel(const char *token, const char *channelId, const char *info,
                  agora::rtc::uid_t uid,
                  const agora::rtc::ChannelMediaOptions &options) override;
  int switchChannel(const char *token, const char *channelId) override;
  int switchChannel(const char *token, const char *channelId,
                    const agora::rtc::ChannelMediaOptions &options) override;
  int leaveChannel() override;
  int renewToken(const char *token) override;
  int queryInterface(INTERFACE_ID_TYPE iid, void **inter) override;
  int registerLocalUserAccount(const char *appId,
                               const char *userAccount) override;
  int joinChannelWithUserAccount(const char *token, const char *channelId,
                                 const char *userAccount) override;
  int joinChannelWithUserAccount(
      const char *token, const char *channelId, const char *userAccount,
      const agora::rtc::ChannelMediaOptions &options) override;
  int getUserInfoByUserAccount(const char *userAccount,
                               agora::rtc::UserInfo *userInfo) override;
  int getUserInfoByUid(agora::rtc::uid_t uid,
                       agora::rtc::UserInfo *userInfo) override;
  int startEchoTest() override;
  int startEchoTest(int intervalInSeconds) override;
  int stopEchoTest() override;
  int setCloudProxy(agora::rtc::CLOUD_PROXY_TYPE proxyType) override;
  int enableVideo() override;
  int disableVideo() override;
  int setVideoProfile(agora::rtc::VIDEO_PROFILE_TYPE profile,
                      bool swapWidthAndHeight) override;
  int setVideoEncoderConfiguration(
      const agora::rtc::VideoEncoderConfiguration &config) override;
  int setCameraCapturerConfiguration(
      const agora::rtc::CameraCapturerConfiguration &config) override;
  int setupLocalVideo(const agora::rtc::VideoCanvas &canvas) override;
  int setupRemoteVideo(const agora::rtc::VideoCanvas &canvas) override;
  int startPreview() override;
  int setRemoteUserPriority(agora::rtc::uid_t uid,
                            agora::rtc::PRIORITY_TYPE userPriority) override;
  int stopPreview() override;
  int enableAudio() override;
  int enableLocalAudio(bool enabled) override;
  int disableAudio() override;
  int setAudioProfile(agora::rtc::AUDIO_PROFILE_TYPE profile,
                      agora::rtc::AUDIO_SCENARIO_TYPE scenario) override;
  int muteLocalAudioStream(bool mute) override;
  int muteAllRemoteAudioStreams(bool mute) override;
  int setDefaultMuteAllRemoteAudioStreams(bool mute) override;
  int adjustUserPlaybackSignalVolume(unsigned int uid, int volume) override;
  int muteRemoteAudioStream(agora::rtc::uid_t userId, bool mute) override;
  int muteLocalVideoStream(bool mute) override;
  int enableLocalVideo(bool enabled) override;
  int muteAllRemoteVideoStreams(bool mute) override;
  int setDefaultMuteAllRemoteVideoStreams(bool mute) override;
  int muteRemoteVideoStream(agora::rtc::uid_t userId, bool mute) override;
  int setRemoteVideoStreamType(
      agora::rtc::uid_t userId,
      agora::rtc::REMOTE_VIDEO_STREAM_TYPE streamType) override;
  int setRemoteDefaultVideoStreamType(
      agora::rtc::REMOTE_VIDEO_STREAM_TYPE streamType) override;
  int enableAudioVolumeIndication(int interval, int smooth,
                                  bool report_vad) override;
  int startAudioRecording(
      const char *filePath,
      agora::rtc::AUDIO_RECORDING_QUALITY_TYPE quality) override;
  int startAudioRecording(
      const char *filePath, int sampleRate,
      agora::rtc::AUDIO_RECORDING_QUALITY_TYPE quality) override;
  int stopAudioRecording() override;
  int startAudioMixing(const char *filePath, bool loopback, bool replace,
                       int cycle) override;
  int stopAudioMixing() override;
  int pauseAudioMixing() override;
  int resumeAudioMixing() override;
  int setHighQualityAudioParameters(bool fullband, bool stereo,
                                    bool fullBitrate) override;
  int adjustAudioMixingVolume(int volume) override;
  int adjustAudioMixingPlayoutVolume(int volume) override;
  int getAudioMixingPlayoutVolume() override;
  int adjustAudioMixingPublishVolume(int volume) override;
  int getAudioMixingPublishVolume() override;
  int getAudioMixingDuration() override;
  int getAudioMixingCurrentPosition() override;
  int setAudioMixingPosition(int pos) override;
  int setAudioMixingPitch(int pitch) override;
  int getEffectsVolume() override;
  int setEffectsVolume(int volume) override;
  int setVolumeOfEffect(int soundId, int volume) override;
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
  int enableFaceDetection(bool enable) override;
#endif
  int playEffect(int soundId, const char *filePath, int loopCount, double pitch,
                 double pan, int gain, bool publish) override;
  int stopEffect(int soundId) override;
  int stopAllEffects() override;
  int preloadEffect(int soundId, const char *filePath) override;
  int unloadEffect(int soundId) override;
  int pauseEffect(int soundId) override;
  int pauseAllEffects() override;
  int resumeEffect(int soundId) override;
  int resumeAllEffects() override;
  int enableDeepLearningDenoise(bool enable) override;
  int enableSoundPositionIndication(bool enabled) override;
  int setRemoteVoicePosition(agora::rtc::uid_t uid, double pan,
                             double gain) override;
  int setLocalVoicePitch(double pitch) override;
  int setLocalVoiceEqualization(
      agora::rtc::AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency,
      int bandGain) override;
  int setLocalVoiceReverb(agora::rtc::AUDIO_REVERB_TYPE reverbKey,
                          int value) override;
  int setLocalVoiceChanger(
      agora::rtc::VOICE_CHANGER_PRESET voiceChanger) override;
  int setLocalVoiceReverbPreset(
      agora::rtc::AUDIO_REVERB_PRESET reverbPreset) override;
  int setVoiceBeautifierPreset(
      agora::rtc::VOICE_BEAUTIFIER_PRESET preset) override;
  int setAudioEffectPreset(agora::rtc::AUDIO_EFFECT_PRESET preset) override;
  int setVoiceConversionPreset(
      agora::rtc::VOICE_CONVERSION_PRESET preset) override;
  int setAudioEffectParameters(agora::rtc::AUDIO_EFFECT_PRESET preset,
                               int param1, int param2) override;
  int setVoiceBeautifierParameters(agora::rtc::VOICE_BEAUTIFIER_PRESET preset,
                                   int param1, int param2) override;
  int setLogFile(const char *filePath) override;
  int setLogFilter(unsigned int filter) override;
  int setLogFileSize(unsigned int fileSizeInKBytes) override;
  int uploadLogFile(util::AString &requestId) override;
  int setLocalRenderMode(agora::rtc::RENDER_MODE_TYPE renderMode) override;
  int setLocalRenderMode(
      agora::rtc::RENDER_MODE_TYPE renderMode,
      agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode) override;
  int setRemoteRenderMode(agora::rtc::uid_t userId,
                          agora::rtc::RENDER_MODE_TYPE renderMode) override;
  int setRemoteRenderMode(
      agora::rtc::uid_t userId, agora::rtc::RENDER_MODE_TYPE renderMode,
      agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode) override;
  int setLocalVideoMirrorMode(
      agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode) override;
  int enableDualStreamMode(bool enabled) override;
  int setExternalAudioSource(bool enabled, int sampleRate,
                             int channels) override;
  int setExternalAudioSink(bool enabled, int sampleRate, int channels) override;
  int setRecordingAudioFrameParameters(
      int sampleRate, int channel,
      agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
      int samplesPerCall) override;
  int setPlaybackAudioFrameParameters(
      int sampleRate, int channel,
      agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
      int samplesPerCall) override;
  int setMixedAudioFrameParameters(int sampleRate, int samplesPerCall) override;
  int adjustRecordingSignalVolume(int volume) override;
  int adjustPlaybackSignalVolume(int volume) override;
  int enableWebSdkInteroperability(bool enabled) override;
  int setVideoQualityParameters(bool preferFrameRateOverImageQuality) override;
  int setLocalPublishFallbackOption(
      agora::rtc::STREAM_FALLBACK_OPTIONS option) override;
  int setRemoteSubscribeFallbackOption(
      agora::rtc::STREAM_FALLBACK_OPTIONS option) override;
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
  int switchCamera() override;
  int switchCamera(agora::rtc::CAMERA_DIRECTION direction) override;
  int setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker) override;
  int setEnableSpeakerphone(bool speakerOn) override;
  int enableInEarMonitoring(bool enabled) override;
  int setInEarMonitoringVolume(int volume) override;
  bool isSpeakerphoneEnabled() override;
#endif
#if (defined(__APPLE__) && TARGET_OS_IOS)
  int setAudioSessionOperationRestriction(
      agora::rtc::AUDIO_SESSION_OPERATION_RESTRICTION restriction) override;
#endif
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
  int enableLoopbackRecording(bool enabled, const char *deviceName) override;
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)
  int startScreenCaptureByDisplayId(
      unsigned int displayId, const agora::rtc::Rectangle &regionRect,
      const agora::rtc::ScreenCaptureParameters &captureParams) override;
#endif
#if defined(_WIN32)
  int startScreenCaptureByScreenRect(
      const agora::rtc::Rectangle &screenRect,
      const agora::rtc::Rectangle &regionRect,
      const agora::rtc::ScreenCaptureParameters &captureParams) override;
#endif
  int startScreenCaptureByWindowId(
      agora::rtc::view_t windowId, const agora::rtc::Rectangle &regionRect,
      const agora::rtc::ScreenCaptureParameters &captureParams) override;
  int setScreenCaptureContentHint(
      agora::rtc::VideoContentHint contentHint) override;
  int updateScreenCaptureParameters(
      const agora::rtc::ScreenCaptureParameters &captureParams) override;
  int updateScreenCaptureRegion(
      const agora::rtc::Rectangle &regionRect) override;
  int stopScreenCapture() override;
  int startScreenCapture(WindowIDType windowId, int captureFreq,
                         const agora::rtc::Rect *rect, int bitrate) override;
  int updateScreenCaptureRegion(const agora::rtc::Rect *rect) override;
#endif
#if defined(_WIN32)
  bool setVideoSource(agora::rtc::IVideoSource *source) override;
#endif
  int getCallId(util::AString &callId) override;
  int rate(const char *callId, int rating, const char *description) override;
  int complain(const char *callId, const char *description) override;
  const char *getVersion(int *build) override;
  int enableLastmileTest() override;
  int disableLastmileTest() override;
  int startLastmileProbeTest(
      const agora::rtc::LastmileProbeConfig &config) override;
  int stopLastmileProbeTest() override;
  const char *getErrorDescription(int code) override;
  int setEncryptionSecret(const char *secret) override;
  int setEncryptionMode(const char *encryptionMode) override;
  int enableEncryption(bool enabled,
                       const agora::rtc::EncryptionConfig &config) override;
  int registerPacketObserver(agora::rtc::IPacketObserver *observer) override;
  int createDataStream(int *streamId, bool reliable, bool ordered) override;
  int createDataStream(int *streamId,
                       agora::rtc::DataStreamConfig &config) override;
  int sendStreamMessage(int streamId, const char *data, size_t length) override;
  int addPublishStreamUrl(const char *url, bool transcodingEnabled) override;
  int removePublishStreamUrl(const char *url) override;
  int setLiveTranscoding(
      const agora::rtc::LiveTranscoding &transcoding) override;
  int addVideoWatermark(const agora::rtc::RtcImage &watermark) override;
  int addVideoWatermark(const char *watermarkUrl,
                        const agora::rtc::WatermarkOptions &options) override;
  int clearVideoWatermarks() override;
  int setBeautyEffectOptions(bool enabled,
                             agora::rtc::BeautyOptions options) override;
  int addInjectStreamUrl(const char *url,
                         const agora::rtc::InjectStreamConfig &config) override;
  int startChannelMediaRelay(
      const agora::rtc::ChannelMediaRelayConfiguration &configuration) override;
  int updateChannelMediaRelay(
      const agora::rtc::ChannelMediaRelayConfiguration &configuration) override;
  int stopChannelMediaRelay() override;
  int removeInjectStreamUrl(const char *url) override;
  bool registerEventHandler(
      agora::rtc::IRtcEngineEventHandler *eventHandler) override;
  bool unregisterEventHandler(
      agora::rtc::IRtcEngineEventHandler *eventHandler) override;
  int sendCustomReportMessage(const char *id, const char *category,
                              const char *event, const char *label,
                              int value) override;
  agora::rtc::CONNECTION_STATE_TYPE getConnectionState() override;
  int enableRemoteSuperResolution(agora::rtc::uid_t userId,
                                  bool enable) override;
  int registerMediaMetadataObserver(
      agora::rtc::IMetadataObserver *observer,
      agora::rtc::IMetadataObserver::METADATA_TYPE type) override;
  int setParameters(const char *parameters) override;
};

class IRIS_DEBUG_CPP_API IrisRtcChannelTester : public agora::rtc::IChannel {
 public:
  int release() override;
  int setChannelEventHandler(
      agora::rtc::IChannelEventHandler *channelEh) override;
  int joinChannel(const char *token, const char *info, agora::rtc::uid_t uid,
                  const agora::rtc::ChannelMediaOptions &options) override;
  int joinChannelWithUserAccount(
      const char *token, const char *userAccount,
      const agora::rtc::ChannelMediaOptions &options) override;
  int leaveChannel() override;
  int publish() override;
  int unpublish() override;
  const char *channelId() override;
  int getCallId(util::AString &callId) override;
  int renewToken(const char *token) override;
  int setEncryptionSecret(const char *secret) override;
  int setEncryptionMode(const char *encryptionMode) override;
  int enableEncryption(bool enabled,
                       const agora::rtc::EncryptionConfig &config) override;
  int registerPacketObserver(agora::rtc::IPacketObserver *observer) override;
  int registerMediaMetadataObserver(
      agora::rtc::IMetadataObserver *observer,
      agora::rtc::IMetadataObserver::METADATA_TYPE type) override;
  int setClientRole(agora::rtc::CLIENT_ROLE_TYPE role) override;
  int setClientRole(agora::rtc::CLIENT_ROLE_TYPE role,
                    const agora::rtc::ClientRoleOptions &options) override;
  int setRemoteUserPriority(agora::rtc::uid_t uid,
                            agora::rtc::PRIORITY_TYPE userPriority) override;
  int setRemoteVoicePosition(agora::rtc::uid_t uid, double pan,
                             double gain) override;
  int setRemoteRenderMode(
      agora::rtc::uid_t userId, agora::rtc::RENDER_MODE_TYPE renderMode,
      agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode) override;
  int setDefaultMuteAllRemoteAudioStreams(bool mute) override;
  int setDefaultMuteAllRemoteVideoStreams(bool mute) override;
  int muteAllRemoteAudioStreams(bool mute) override;
  int adjustUserPlaybackSignalVolume(agora::rtc::uid_t userId,
                                     int volume) override;
  int muteRemoteAudioStream(agora::rtc::uid_t userId, bool mute) override;
  int muteAllRemoteVideoStreams(bool mute) override;
  int muteRemoteVideoStream(agora::rtc::uid_t userId, bool mute) override;
  int setRemoteVideoStreamType(
      agora::rtc::uid_t userId,
      agora::rtc::REMOTE_VIDEO_STREAM_TYPE streamType) override;
  int setRemoteDefaultVideoStreamType(
      agora::rtc::REMOTE_VIDEO_STREAM_TYPE streamType) override;
  int createDataStream(int *streamId, bool reliable, bool ordered) override;
  int createDataStream(int *streamId,
                       agora::rtc::DataStreamConfig &config) override;
  int sendStreamMessage(int streamId, const char *data, size_t length) override;
  int addPublishStreamUrl(const char *url, bool transcodingEnabled) override;
  int removePublishStreamUrl(const char *url) override;
  int setLiveTranscoding(
      const agora::rtc::LiveTranscoding &transcoding) override;
  int addInjectStreamUrl(const char *url,
                         const agora::rtc::InjectStreamConfig &config) override;
  int removeInjectStreamUrl(const char *url) override;
  int startChannelMediaRelay(
      const agora::rtc::ChannelMediaRelayConfiguration &configuration) override;
  int updateChannelMediaRelay(
      const agora::rtc::ChannelMediaRelayConfiguration &configuration) override;
  int stopChannelMediaRelay() override;
  agora::rtc::CONNECTION_STATE_TYPE getConnectionState() override;
  int enableRemoteSuperResolution(agora::rtc::uid_t userId,
                                  bool enable) override;
};

class IRIS_DEBUG_CPP_API IrisRtcAudioDeviceManagerTester
    : public agora::rtc::IAudioDeviceManager {
 public:
  agora::rtc::IAudioDeviceCollection *enumeratePlaybackDevices() override;
  agora::rtc::IAudioDeviceCollection *enumerateRecordingDevices() override;
  int setPlaybackDevice(const char *deviceId) override;
  int setRecordingDevice(const char *deviceId) override;
  int startPlaybackDeviceTest(const char *testAudioFilePath) override;
  int stopPlaybackDeviceTest() override;
  int setPlaybackDeviceVolume(int volume) override;
  int getPlaybackDeviceVolume(int *volume) override;
  int setRecordingDeviceVolume(int volume) override;
  int getRecordingDeviceVolume(int *volume) override;
  int setPlaybackDeviceMute(bool mute) override;
  int getPlaybackDeviceMute(bool *mute) override;
  int setRecordingDeviceMute(bool mute) override;
  int getRecordingDeviceMute(bool *mute) override;
  int startRecordingDeviceTest(int indicationInterval) override;
  int stopRecordingDeviceTest() override;
  int getPlaybackDevice(char *deviceId) override;
  int getPlaybackDeviceInfo(char *deviceId, char *deviceName) override;
  int getRecordingDevice(char *deviceId) override;
  int getRecordingDeviceInfo(char *deviceId, char *deviceName) override;
  int startAudioDeviceLoopbackTest(int indicationInterval) override;
  int stopAudioDeviceLoopbackTest() override;
  void release() override;
};

class IRIS_DEBUG_CPP_API IrisRtcVideoDeviceManagerTester
    : public agora::rtc::IVideoDeviceManager {
 public:
  agora::rtc::IVideoDeviceCollection *enumerateVideoDevices() override;
  int startDeviceTest(agora::rtc::view_t hwnd) override;
  int stopDeviceTest() override;
  int setDevice(const char *deviceId) override;
  int getDevice(char *deviceId) override;
  void release() override;
};

class IRIS_DEBUG_CPP_API IrisRtcAudioDeviceCollectionTester
    : public agora::rtc::IAudioDeviceCollection {
 public:
  int getCount() override;
  int getDevice(int index, char *deviceName, char *deviceId) override;
  int setDevice(const char *deviceId) override;
  int setApplicationVolume(int volume) override;
  int getApplicationVolume(int &volume) override;
  int setApplicationMute(bool mute) override;
  int isApplicationMute(bool &mute) override;
  void release() override;
};

class IRIS_DEBUG_CPP_API IrisRtcVideoDeviceCollectionTester
    : public agora::rtc::IVideoDeviceCollection {
 public:
  int getCount() override;
  int getDevice(int index, char *deviceName, char *deviceId) override;
  int setDevice(const char *deviceId) override;
  void release() override;
};

class IRIS_DEBUG_CPP_API IrisRtcTester
    : public IrisRtcEngineTester,
      public IrisRtcChannelTester,
      public IrisRtcAudioDeviceManagerTester,
      public IrisRtcVideoDeviceManagerTester {
 public:
  explicit IrisRtcTester(const char *dump_file_path);

 public:
  void BeginApiTestByFile(const char *case_file_path,
                          IrisEventHandler *event_handler);
  void BeginApiTest(const char *case_content, IrisEventHandler *event_handler);

  void BeginEventTestByFile(const char *case_file_path,
                            IrisEventHandler *event_handler);
  void BeginEventTest(const char *case_content,
                      IrisEventHandler *event_handler);
  void OnEventReceived(const char *event, const char *data);

 public:
  void OnApiCalled(unsigned int api_type, const char *params);

 private:
  void Dump();
  void Reset();

 private:
  std::string dump_file_path_;
  rapidjson::Document document_case_;
  rapidjson::Document document_result_;
  std::map<std::string, int> map_api_type_;
};
}// namespace test
}// namespace rtc
}// namespace iris
}// namespace agora

#endif//IRIS_RTC_TEST_H_
