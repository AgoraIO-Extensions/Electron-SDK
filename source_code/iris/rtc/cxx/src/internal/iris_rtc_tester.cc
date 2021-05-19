//
// Created by LXH on 2021/2/24.
//

#include "internal/iris_rtc_tester.h"
#include "internal/iris_rtc_json_encoder.h"
#include "istreamwrapper.h"
#include "ostreamwrapper.h"
#include "prettywriter.h"
#include <fstream>

#define ADD_PAIR(name)                                                         \
  { #name, name }

#define SET_VALUE$(doc, val, key) SET_VALUE(doc, val, key, key)

#define SET_VALUE_CHAR$(doc, val, key) SET_VALUE_CHAR(doc, val, key, key)

#define SET_VALUE_OBJ$(doc, val, key) SET_VALUE_OBJ(doc, val, key, key)

#define SET_VALUE_PTR$(doc, val, key) SET_VALUE_PTR(doc, val, key, key)

namespace agora {
using namespace rtc;

namespace iris {
namespace rtc {
namespace test {
using namespace rapidjson;

IrisRtcTester::IrisRtcTester(const char *dump_file_path)
    : dump_file_path_(dump_file_path) {
  map_api_type_ = {
      ADD_PAIR(kEngineInitialize),
      ADD_PAIR(kEngineRelease),
      ADD_PAIR(kEngineSetChannelProfile),
      ADD_PAIR(kEngineSetClientRole),
      ADD_PAIR(kEngineJoinChannel),
      ADD_PAIR(kEngineSwitchChannel),
      ADD_PAIR(kEngineLeaveChannel),
      ADD_PAIR(kEngineRenewToken),
      ADD_PAIR(kEngineRegisterLocalUserAccount),
      ADD_PAIR(kEngineJoinChannelWithUserAccount),
      ADD_PAIR(kEngineGetUserInfoByUserAccount),
      ADD_PAIR(kEngineGetUserInfoByUid),
      ADD_PAIR(kEngineStartEchoTest),
      ADD_PAIR(kEngineStopEchoTest),
      ADD_PAIR(kEngineSetCloudProxy),
      ADD_PAIR(kEngineEnableVideo),
      ADD_PAIR(kEngineDisableVideo),
      ADD_PAIR(kEngineSetVideoProfile),
      ADD_PAIR(kEngineSetVideoEncoderConfiguration),
      ADD_PAIR(kEngineSetCameraCapturerConfiguration),
      ADD_PAIR(kEngineSetupLocalVideo),
      ADD_PAIR(kEngineSetupRemoteVideo),
      ADD_PAIR(kEngineStartPreview),
      ADD_PAIR(kEngineSetRemoteUserPriority),
      ADD_PAIR(kEngineStopPreview),
      ADD_PAIR(kEngineEnableAudio),
      ADD_PAIR(kEngineEnableLocalAudio),
      ADD_PAIR(kEngineDisableAudio),
      ADD_PAIR(kEngineSetAudioProfile),
      ADD_PAIR(kEngineMuteLocalAudioStream),
      ADD_PAIR(kEngineMuteAllRemoteAudioStreams),
      ADD_PAIR(kEngineSetDefaultMuteAllRemoteAudioStreams),
      ADD_PAIR(kEngineAdjustUserPlaybackSignalVolume),
      ADD_PAIR(kEngineMuteRemoteAudioStream),
      ADD_PAIR(kEngineMuteLocalVideoStream),
      ADD_PAIR(kEngineEnableLocalVideo),
      ADD_PAIR(kEngineMuteAllRemoteVideoStreams),
      ADD_PAIR(kEngineSetDefaultMuteAllRemoteVideoStreams),
      ADD_PAIR(kEngineMuteRemoteVideoStream),
      ADD_PAIR(kEngineSetRemoteVideoStreamType),
      ADD_PAIR(kEngineSetRemoteDefaultVideoStreamType),
      ADD_PAIR(kEngineEnableAudioVolumeIndication),
      ADD_PAIR(kEngineStartAudioRecording),
      ADD_PAIR(kEngineStopAudioRecording),
      ADD_PAIR(kEngineStartAudioMixing),
      ADD_PAIR(kEngineStopAudioMixing),
      ADD_PAIR(kEnginePauseAudioMixing),
      ADD_PAIR(kEngineResumeAudioMixing),
      ADD_PAIR(kEngineSetHighQualityAudioParameters),
      ADD_PAIR(kEngineAdjustAudioMixingVolume),
      ADD_PAIR(kEngineAdjustAudioMixingPlayoutVolume),
      ADD_PAIR(kEngineGetAudioMixingPlayoutVolume),
      ADD_PAIR(kEngineAdjustAudioMixingPublishVolume),
      ADD_PAIR(kEngineGetAudioMixingPublishVolume),
      ADD_PAIR(kEngineGetAudioMixingDuration),
      ADD_PAIR(kEngineGetAudioMixingCurrentPosition),
      ADD_PAIR(kEngineSetAudioMixingPosition),
      ADD_PAIR(kEngineSetAudioMixingPitch),
      ADD_PAIR(kEngineGetEffectsVolume),
      ADD_PAIR(kEngineSetEffectsVolume),
      ADD_PAIR(kEngineSetVolumeOfEffect),
      ADD_PAIR(kEngineEnableFaceDetection),
      ADD_PAIR(kEnginePlayEffect),
      ADD_PAIR(kEngineStopEffect),
      ADD_PAIR(kEngineStopAllEffects),
      ADD_PAIR(kEnginePreloadEffect),
      ADD_PAIR(kEngineUnloadEffect),
      ADD_PAIR(kEnginePauseEffect),
      ADD_PAIR(kEnginePauseAllEffects),
      ADD_PAIR(kEngineResumeEffect),
      ADD_PAIR(kEngineResumeAllEffects),
      ADD_PAIR(kEngineEnableDeepLearningDenoise),
      ADD_PAIR(kEngineEnableSoundPositionIndication),
      ADD_PAIR(kEngineSetRemoteVoicePosition),
      ADD_PAIR(kEngineSetLocalVoicePitch),
      ADD_PAIR(kEngineSetLocalVoiceEqualization),
      ADD_PAIR(kEngineSetLocalVoiceReverb),
      ADD_PAIR(kEngineSetLocalVoiceChanger),
      ADD_PAIR(kEngineSetLocalVoiceReverbPreset),
      ADD_PAIR(kEngineSetVoiceBeautifierPreset),
      ADD_PAIR(kEngineSetAudioEffectPreset),
      ADD_PAIR(kEngineSetVoiceConversionPreset),
      ADD_PAIR(kEngineSetAudioEffectParameters),
      ADD_PAIR(kEngineSetVoiceBeautifierParameters),
      ADD_PAIR(kEngineSetLogFile),
      ADD_PAIR(kEngineSetLogFilter),
      ADD_PAIR(kEngineSetLogFileSize),
      ADD_PAIR(kEngineUploadLogFile),
      ADD_PAIR(kEngineSetLocalRenderMode),
      ADD_PAIR(kEngineSetRemoteRenderMode),
      ADD_PAIR(kEngineSetLocalVideoMirrorMode),
      ADD_PAIR(kEngineEnableDualStreamMode),
      ADD_PAIR(kEngineSetExternalAudioSource),
      ADD_PAIR(kEngineSetExternalAudioSink),
      ADD_PAIR(kEngineSetRecordingAudioFrameParameters),
      ADD_PAIR(kEngineSetPlaybackAudioFrameParameters),
      ADD_PAIR(kEngineSetMixedAudioFrameParameters),
      ADD_PAIR(kEngineAdjustRecordingSignalVolume),
      ADD_PAIR(kEngineAdjustPlaybackSignalVolume),
      ADD_PAIR(kEngineEnableWebSdkInteroperability),
      ADD_PAIR(kEngineSetVideoQualityParameters),
      ADD_PAIR(kEngineSetLocalPublishFallbackOption),
      ADD_PAIR(kEngineSetRemoteSubscribeFallbackOption),
      ADD_PAIR(kEngineSwitchCamera),
      ADD_PAIR(kEngineSetDefaultAudioRouteToSpeakerPhone),
      ADD_PAIR(kEngineSetEnableSpeakerPhone),
      ADD_PAIR(kEngineEnableInEarMonitoring),
      ADD_PAIR(kEngineSetInEarMonitoringVolume),
      ADD_PAIR(kEngineIsSpeakerPhoneEnabled),
      ADD_PAIR(kEngineSetAudioSessionOperationRestriction),
      ADD_PAIR(kEngineEnableLoopBackRecording),
      ADD_PAIR(kEngineStartScreenCaptureByDisplayId),
      ADD_PAIR(kEngineStartScreenCaptureByScreenRect),
      ADD_PAIR(kEngineStartScreenCaptureByWindowId),
      ADD_PAIR(kEngineSetScreenCaptureContentHint),
      ADD_PAIR(kEngineUpdateScreenCaptureParameters),
      ADD_PAIR(kEngineUpdateScreenCaptureRegion),
      ADD_PAIR(kEngineStopScreenCapture),
      ADD_PAIR(kEngineStartScreenCapture),
      ADD_PAIR(kEngineSetVideoSource),
      ADD_PAIR(kEngineGetCallId),
      ADD_PAIR(kEngineRate),
      ADD_PAIR(kEngineComplain),
      ADD_PAIR(kEngineGetVersion),
      ADD_PAIR(kEngineEnableLastMileTest),
      ADD_PAIR(kEngineDisableLastMileTest),
      ADD_PAIR(kEngineStartLastMileProbeTest),
      ADD_PAIR(kEngineStopLastMileProbeTest),
      ADD_PAIR(kEngineGetErrorDescription),
      ADD_PAIR(kEngineSetEncryptionSecret),
      ADD_PAIR(kEngineSetEncryptionMode),
      ADD_PAIR(kEngineEnableEncryption),
      ADD_PAIR(kEngineRegisterPacketObserver),
      ADD_PAIR(kEngineCreateDataStream),
      ADD_PAIR(kEngineSendStreamMessage),
      ADD_PAIR(kEngineAddPublishStreamUrl),
      ADD_PAIR(kEngineRemovePublishStreamUrl),
      ADD_PAIR(kEngineSetLiveTranscoding),
      ADD_PAIR(kEngineAddVideoWaterMark),
      ADD_PAIR(kEngineClearVideoWaterMarks),
      ADD_PAIR(kEngineSetBeautyEffectOptions),
      ADD_PAIR(kEngineAddInjectStreamUrl),
      ADD_PAIR(kEngineStartChannelMediaRelay),
      ADD_PAIR(kEngineUpdateChannelMediaRelay),
      ADD_PAIR(kEngineStopChannelMediaRelay),
      ADD_PAIR(kEngineRemoveInjectStreamUrl),
      ADD_PAIR(kEngineSendCustomReportMessage),
      ADD_PAIR(kEngineGetConnectionState),
      ADD_PAIR(kEngineEnableRemoteSuperResolution),
      ADD_PAIR(kEngineRegisterMediaMetadataObserver),
      ADD_PAIR(kEngineSetParameters),

      ADD_PAIR(kEngineUnRegisterMediaMetadataObserver),
      ADD_PAIR(kEngineSetMaxMetadataSize),
      ADD_PAIR(kEngineSendMetadata),
      ADD_PAIR(kEngineSetAppType),

      ADD_PAIR(kMediaPushAudioFrame),
      ADD_PAIR(kMediaPullAudioFrame),
      ADD_PAIR(kMediaSetExternalVideoSource),
      ADD_PAIR(kMediaPushVideoFrame),

      ADD_PAIR(kChannelCreateChannel),
      ADD_PAIR(kChannelRelease),
      ADD_PAIR(kChannelJoinChannel),
      ADD_PAIR(kChannelJoinChannelWithUserAccount),
      ADD_PAIR(kChannelLeaveChannel),
      ADD_PAIR(kChannelPublish),
      ADD_PAIR(kChannelUnPublish),
      ADD_PAIR(kChannelChannelId),
      ADD_PAIR(kChannelGetCallId),
      ADD_PAIR(kChannelRenewToken),
      ADD_PAIR(kChannelSetEncryptionSecret),
      ADD_PAIR(kChannelSetEncryptionMode),
      ADD_PAIR(kChannelEnableEncryption),
      ADD_PAIR(kChannelRegisterPacketObserver),
      ADD_PAIR(kChannelRegisterMediaMetadataObserver),
      ADD_PAIR(kChannelUnRegisterMediaMetadataObserver),
      ADD_PAIR(kChannelSetMaxMetadataSize),
      ADD_PAIR(kChannelSendMetadata),
      ADD_PAIR(kChannelSetClientRole),
      ADD_PAIR(kChannelSetRemoteUserPriority),
      ADD_PAIR(kChannelSetRemoteVoicePosition),
      ADD_PAIR(kChannelSetRemoteRenderMode),
      ADD_PAIR(kChannelSetDefaultMuteAllRemoteAudioStreams),
      ADD_PAIR(kChannelSetDefaultMuteAllRemoteVideoStreams),
      ADD_PAIR(kChannelMuteAllRemoteAudioStreams),
      ADD_PAIR(kChannelAdjustUserPlaybackSignalVolume),
      ADD_PAIR(kChannelMuteRemoteAudioStream),
      ADD_PAIR(kChannelMuteAllRemoteVideoStreams),
      ADD_PAIR(kChannelMuteRemoteVideoStream),
      ADD_PAIR(kChannelSetRemoteVideoStreamType),
      ADD_PAIR(kChannelSetRemoteDefaultVideoStreamType),
      ADD_PAIR(kChannelCreateDataStream),
      ADD_PAIR(kChannelSendStreamMessage),
      ADD_PAIR(kChannelAddPublishStreamUrl),
      ADD_PAIR(kChannelRemovePublishStreamUrl),
      ADD_PAIR(kChannelSetLiveTranscoding),
      ADD_PAIR(kChannelAddInjectStreamUrl),
      ADD_PAIR(kChannelRemoveInjectStreamUrl),
      ADD_PAIR(kChannelStartChannelMediaRelay),
      ADD_PAIR(kChannelUpdateChannelMediaRelay),
      ADD_PAIR(kChannelStopChannelMediaRelay),
      ADD_PAIR(kChannelGetConnectionState),
      ADD_PAIR(kChannelEnableRemoteSuperResolution),

      ADD_PAIR(kGetAudioPlaybackDeviceCount),
      ADD_PAIR(kGetAudioPlaybackDeviceInfoByIndex),
      ADD_PAIR(kSetCurrentAudioPlaybackDeviceId),
      ADD_PAIR(kGetCurrentAudioPlaybackDeviceId),
      ADD_PAIR(kGetCurrentAudioPlaybackDeviceInfo),
      ADD_PAIR(kSetAudioPlaybackDeviceVolume),
      ADD_PAIR(kGetAudioPlaybackDeviceVolume),
      ADD_PAIR(kSetAudioPlaybackDeviceMute),
      ADD_PAIR(kGetAudioPlaybackDeviceMute),
      ADD_PAIR(kStartAudioPlaybackDeviceTest),
      ADD_PAIR(kStopAudioPlaybackDeviceTest),

      ADD_PAIR(kGetAudioRecordingDeviceCount),
      ADD_PAIR(kGetAudioRecordingDeviceInfoByIndex),
      ADD_PAIR(kSetCurrentAudioRecordingDeviceId),
      ADD_PAIR(kGetCurrentAudioRecordingDeviceId),
      ADD_PAIR(kGetCurrentAudioRecordingDeviceInfo),
      ADD_PAIR(kSetAudioRecordingDeviceVolume),
      ADD_PAIR(kGetAudioRecordingDeviceVolume),
      ADD_PAIR(kSetAudioRecordingDeviceMute),
      ADD_PAIR(kGetAudioRecordingDeviceMute),
      ADD_PAIR(kStartAudioRecordingDeviceTest),
      ADD_PAIR(kStopAudioRecordingDeviceTest),

      ADD_PAIR(kStartAudioDeviceLoopbackTest),
      ADD_PAIR(kStopAudioDeviceLoopbackTest),

      ADD_PAIR(kGetVideoDeviceCount),
      ADD_PAIR(kGetVideoDeviceInfoByIndex),
      ADD_PAIR(kSetCurrentVideoDeviceId),
      ADD_PAIR(kGetCurrentVideoDeviceId),
      ADD_PAIR(kStartVideoDeviceTest),
      ADD_PAIR(kStopVideoDeviceTest),
  };
}

void IrisRtcTester::BeginApiTestByFile(const char *case_file_path,
                                       IrisEventHandler *event_handler) {
  std::ifstream ifs(case_file_path);
  IStreamWrapper isw(ifs);

  Document document;
  document.ParseStream(isw);
  BeginApiTest(ToJsonString(document).c_str(), event_handler);
}

void IrisRtcTester::BeginApiTest(const char *case_content,
                                 IrisEventHandler *event_handler) {
  Reset();
  document_case_.Parse(case_content);

  for (auto &it : document_case_.GetArray()) {
    printf("%s\n", ToJsonString(it).c_str());
    Value temp(it, document_case_.GetAllocator());
    auto apiType = temp["apiType"].GetString();
    temp["apiType"] = map_api_type_[apiType];
    event_handler->OnEvent("onApiTest", ToJsonString(temp).c_str());
  }

  Dump();
}

void IrisRtcTester::BeginEventTestByFile(const char *case_file_path,
                                         IrisEventHandler *event_handler) {
  std::ifstream ifs(case_file_path);
  IStreamWrapper isw(ifs);

  Document document;
  document.ParseStream(isw);
  BeginEventTest(ToJsonString(document).c_str(), event_handler);
}

void IrisRtcTester::BeginEventTest(const char *case_content,
                                   IrisEventHandler *event_handler) {
  Reset();
  document_case_.Parse(case_content);

  for (auto &it : document_case_.GetArray()) {
    auto event = it["event"].GetString();
    auto data = it["data"].GetObject();
    if (event == std::string("onStreamMessage")) {
      event_handler->OnEvent(event, ToJsonString(data).c_str(), nullptr, 0);
    } else {
      event_handler->OnEvent(event, ToJsonString(data).c_str());
    }
  }

  Dump();
}

void IrisRtcTester::OnEventReceived(const char *event, const char *data) {
  Value value(kObjectType);

  auto result = false;

  Document document;
  document.Parse(data);
  Value but(document, document_result_.GetAllocator());

  for (auto &it : document_case_.GetArray()) {
    auto event_case = it["event"].GetString();
    if (event_case == std::string(event)) {
      Value expect(it["data"], document_result_.GetAllocator());

      result = expect == but;
      SET_VALUE$(document_result_, value, result)
      SET_VALUE_CHAR$(document_result_, value, event)
      SET_VALUE$(document_result_, value, expect)

      if (result) { break; }
    }
  }

  if (!result) { SET_VALUE$(document_result_, value, but) }

  printf("%s\n", ToJsonString(value).c_str());
  document_result_.PushBack(value, document_result_.GetAllocator());
}

void IrisRtcTester::OnApiCalled(unsigned int api_type, const char *params) {
  Value value(kObjectType);
  for (auto &it : document_case_.GetArray()) {
    auto apiType = it["apiType"].GetString();
    if (api_type == map_api_type_[apiType]) {
      Value expect(it["params"], document_result_.GetAllocator());

      Document document;
      document.Parse(params);
      Value but(document, document_result_.GetAllocator());

      auto result = expect == but;
      SET_VALUE$(document_result_, value, result)
      SET_VALUE_CHAR$(document_result_, value, apiType)
      SET_VALUE$(document_result_, value, expect)
      if (!result) { SET_VALUE$(document_result_, value, but) }
      break;
    }
  }
  printf("%s\n", ToJsonString(value).c_str());
  document_result_.PushBack(value, document_result_.GetAllocator());
}

void IrisRtcTester::Dump() {
  std::ofstream ofs(dump_file_path_);
  OStreamWrapper osw(ofs);

  PrettyWriter<OStreamWrapper> writer(osw);
  document_result_.Accept(writer);
  osw.Flush();
}

void IrisRtcTester::Reset() {
  document_case_.SetArray();
  document_result_.SetArray();
}

int IrisRtcEngineTester::initialize(const RtcEngineContext &context) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, context)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineInitialize,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setChannelProfile(CHANNEL_PROFILE_TYPE profile) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, profile)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetChannelProfile,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setClientRole(CLIENT_ROLE_TYPE role) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, role)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetClientRole,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setClientRole(CLIENT_ROLE_TYPE role,
                                       const ClientRoleOptions &options) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, role)
  SET_VALUE_OBJ$(document, v, options)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetClientRole,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::joinChannel(const char *token, const char *channelId,
                                     const char *info, uid_t uid) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, token)
  SET_VALUE_CHAR$(document, v, channelId)
  SET_VALUE_CHAR$(document, v, info)
  SET_VALUE$(document, v, uid)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineJoinChannel,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::joinChannel(const char *token, const char *channelId,
                                     const char *info, uid_t uid,
                                     const ChannelMediaOptions &options) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, token)
  SET_VALUE_CHAR$(document, v, channelId)
  SET_VALUE_CHAR$(document, v, info)
  SET_VALUE$(document, v, uid)
  SET_VALUE_OBJ$(document, v, options)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineJoinChannel,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::switchChannel(const char *token,
                                       const char *channelId) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, token)
  SET_VALUE_CHAR$(document, v, channelId)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSwitchChannel,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::switchChannel(const char *token, const char *channelId,
                                       const ChannelMediaOptions &options) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, token)
  SET_VALUE_CHAR$(document, v, channelId)
  SET_VALUE_OBJ$(document, v, options)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSwitchChannel,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::leaveChannel() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineLeaveChannel,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::renewToken(const char *token) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, token)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineRenewToken,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::queryInterface(INTERFACE_ID_TYPE iid, void **inter) {
  return 0;
}
int IrisRtcEngineTester::registerLocalUserAccount(const char *appId,
                                                  const char *userAccount) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, appId)
  SET_VALUE_CHAR$(document, v, userAccount)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineRegisterLocalUserAccount, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::joinChannelWithUserAccount(const char *token,
                                                    const char *channelId,
                                                    const char *userAccount) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, token)
  SET_VALUE_CHAR$(document, v, channelId)
  SET_VALUE_CHAR$(document, v, userAccount)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineJoinChannelWithUserAccount, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::joinChannelWithUserAccount(
    const char *token, const char *channelId, const char *userAccount,
    const ChannelMediaOptions &options) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, token)
  SET_VALUE_CHAR$(document, v, channelId)
  SET_VALUE_CHAR$(document, v, userAccount)
  SET_VALUE_OBJ$(document, v, options)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineJoinChannelWithUserAccount, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::getUserInfoByUserAccount(const char *userAccount,
                                                  UserInfo *userInfo) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, userAccount)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineGetUserInfoByUserAccount, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::getUserInfoByUid(uid_t uid, UserInfo *userInfo) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, uid)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineGetUserInfoByUid,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startEchoTest() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStartEchoTest,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startEchoTest(int intervalInSeconds) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, intervalInSeconds)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStartEchoTest,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopEchoTest() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopEchoTest,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setCloudProxy(CLOUD_PROXY_TYPE proxyType) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, proxyType)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetCloudProxy,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableVideo() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableVideo,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::disableVideo() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineDisableVideo,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setVideoProfile(VIDEO_PROFILE_TYPE profile,
                                         bool swapWidthAndHeight) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, profile)
  SET_VALUE$(document, v, swapWidthAndHeight)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetVideoProfile,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setVideoEncoderConfiguration(
    const VideoEncoderConfiguration &config) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, config)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetVideoEncoderConfiguration, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setCameraCapturerConfiguration(
    const CameraCapturerConfiguration &config) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, config)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetCameraCapturerConfiguration, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setupLocalVideo(const VideoCanvas &canvas) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, canvas)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetupLocalVideo,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setupRemoteVideo(const VideoCanvas &canvas) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, canvas)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetupRemoteVideo,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startPreview() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStartPreview,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRemoteUserPriority(uid_t uid,
                                               PRIORITY_TYPE userPriority) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, uid)
  SET_VALUE$(document, v, userPriority)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetRemoteUserPriority,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopPreview() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopPreview,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableAudio() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableAudio,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableLocalAudio(bool enabled) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableLocalAudio,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::disableAudio() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineDisableAudio,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setAudioProfile(AUDIO_PROFILE_TYPE profile,
                                         AUDIO_SCENARIO_TYPE scenario) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, profile)
  SET_VALUE$(document, v, scenario)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetAudioProfile,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::muteLocalAudioStream(bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineMuteLocalAudioStream,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::muteAllRemoteAudioStreams(bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineMuteAllRemoteAudioStreams, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setDefaultMuteAllRemoteAudioStreams(bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetDefaultMuteAllRemoteAudioStreams, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::adjustUserPlaybackSignalVolume(unsigned int uid,
                                                        int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, uid)
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineAdjustUserPlaybackSignalVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::muteRemoteAudioStream(uid_t userId, bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, userId)
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineMuteRemoteAudioStream,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::muteLocalVideoStream(bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineMuteLocalVideoStream,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableLocalVideo(bool enabled) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableLocalVideo,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::muteAllRemoteVideoStreams(bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineMuteAllRemoteVideoStreams, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setDefaultMuteAllRemoteVideoStreams(bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetDefaultMuteAllRemoteVideoStreams, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::muteRemoteVideoStream(uid_t userId, bool mute) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, userId)
  SET_VALUE$(document, v, mute)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineMuteRemoteVideoStream,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRemoteVideoStreamType(
    uid_t userId, REMOTE_VIDEO_STREAM_TYPE streamType) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, userId)
  SET_VALUE$(document, v, streamType)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetRemoteVideoStreamType, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRemoteDefaultVideoStreamType(
    REMOTE_VIDEO_STREAM_TYPE streamType) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, streamType)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetRemoteDefaultVideoStreamType, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableAudioVolumeIndication(int interval, int smooth,
                                                     bool report_vad) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, interval)
  SET_VALUE$(document, v, smooth)
  SET_VALUE$(document, v, report_vad)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineEnableAudioVolumeIndication, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startAudioRecording(
    const char *filePath, AUDIO_RECORDING_QUALITY_TYPE quality) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, filePath)
  SET_VALUE$(document, v, quality)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStartAudioRecording,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startAudioRecording(
    const char *filePath, int sampleRate,
    AUDIO_RECORDING_QUALITY_TYPE quality) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, filePath)
  SET_VALUE$(document, v, sampleRate)
  SET_VALUE$(document, v, quality)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStartAudioRecording,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopAudioRecording() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopAudioRecording,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startAudioMixing(const char *filePath, bool loopback,
                                          bool replace, int cycle) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, filePath)
  SET_VALUE$(document, v, loopback)
  SET_VALUE$(document, v, replace)
  SET_VALUE$(document, v, cycle)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStartAudioMixing,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopAudioMixing() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopAudioMixing,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::pauseAudioMixing() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEnginePauseAudioMixing,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::resumeAudioMixing() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineResumeAudioMixing,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setHighQualityAudioParameters(bool fullband,
                                                       bool stereo,
                                                       bool fullBitrate) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, fullband)
  SET_VALUE$(document, v, stereo)
  SET_VALUE$(document, v, fullBitrate)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetHighQualityAudioParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::adjustAudioMixingVolume(int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineAdjustAudioMixingVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::adjustAudioMixingPlayoutVolume(int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineAdjustAudioMixingPlayoutVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::getAudioMixingPlayoutVolume() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineGetAudioMixingPlayoutVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::adjustAudioMixingPublishVolume(int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineAdjustAudioMixingPublishVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::getAudioMixingPublishVolume() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineGetAudioMixingPublishVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::getAudioMixingDuration() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineGetAudioMixingDuration, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::getAudioMixingCurrentPosition() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineGetAudioMixingCurrentPosition, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setAudioMixingPosition(int pos) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, pos)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetAudioMixingPosition, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setAudioMixingPitch(int pitch) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, pitch)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetAudioMixingPitch,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::getEffectsVolume() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineGetEffectsVolume,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setEffectsVolume(int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetEffectsVolume,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setVolumeOfEffect(int soundId, int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, soundId)
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetVolumeOfEffect,
                                                   ToJsonString(v).c_str());
  return 0;
}
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
int IrisRtcEngineTester::enableFaceDetection(bool enable) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enable)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableFaceDetection,
                                                   ToJsonString(v).c_str());
  return 0;
}
#endif
int IrisRtcEngineTester::playEffect(int soundId, const char *filePath,
                                    int loopCount, double pitch, double pan,
                                    int gain, bool publish) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, soundId)
  SET_VALUE_CHAR$(document, v, filePath)
  SET_VALUE$(document, v, loopCount)
  SET_VALUE$(document, v, pitch)
  SET_VALUE$(document, v, pan)
  SET_VALUE$(document, v, gain)
  SET_VALUE$(document, v, publish)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEnginePlayEffect,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopEffect(int soundId) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, soundId)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopEffect,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopAllEffects() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopAllEffects,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::preloadEffect(int soundId, const char *filePath) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, soundId)
  SET_VALUE_CHAR$(document, v, filePath)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEnginePreloadEffect,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::unloadEffect(int soundId) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, soundId)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineUnloadEffect,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::pauseEffect(int soundId) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, soundId)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEnginePauseEffect,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::pauseAllEffects() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEnginePauseAllEffects,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::resumeEffect(int soundId) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, soundId)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineResumeEffect,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::resumeAllEffects() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineResumeAllEffects,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableDeepLearningDenoise(bool enable) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enable)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineEnableDeepLearningDenoise, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableSoundPositionIndication(bool enabled) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineEnableSoundPositionIndication, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRemoteVoicePosition(uid_t uid, double pan,
                                                double gain) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, uid)
  SET_VALUE$(document, v, pan)
  SET_VALUE$(document, v, gain)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetRemoteVoicePosition, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalVoicePitch(double pitch) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, pitch)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLocalVoicePitch,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalVoiceEqualization(
    AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency, int bandGain) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, bandFrequency)
  SET_VALUE$(document, v, bandGain)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetLocalVoiceEqualization, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalVoiceReverb(AUDIO_REVERB_TYPE reverbKey,
                                             int value) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, reverbKey)
  SET_VALUE$(document, v, value)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLocalVoiceReverb,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalVoiceChanger(
    VOICE_CHANGER_PRESET voiceChanger) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, voiceChanger)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLocalVoiceChanger,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalVoiceReverbPreset(
    AUDIO_REVERB_PRESET reverbPreset) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, reverbPreset)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetLocalVoiceReverbPreset, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setVoiceBeautifierPreset(
    VOICE_BEAUTIFIER_PRESET preset) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, preset)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetVoiceBeautifierPreset, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setAudioEffectPreset(AUDIO_EFFECT_PRESET preset) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, preset)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetAudioEffectPreset,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setVoiceConversionPreset(
    VOICE_CONVERSION_PRESET preset) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, preset)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetVoiceConversionPreset, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setAudioEffectParameters(AUDIO_EFFECT_PRESET preset,
                                                  int param1, int param2) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, preset)
  SET_VALUE$(document, v, param1)
  SET_VALUE$(document, v, param2)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetAudioEffectParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setVoiceBeautifierParameters(
    VOICE_BEAUTIFIER_PRESET preset, int param1, int param2) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, preset)
  SET_VALUE$(document, v, param1)
  SET_VALUE$(document, v, param2)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetVoiceBeautifierParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLogFile(const char *filePath) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, filePath)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLogFile,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLogFilter(unsigned int filter) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, filter)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLogFilter,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLogFileSize(unsigned int fileSizeInKBytes) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, fileSizeInKBytes)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLogFileSize,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::uploadLogFile(util::AString &requestId) {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineUploadLogFile,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalRenderMode(RENDER_MODE_TYPE renderMode) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, renderMode)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLocalRenderMode,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalRenderMode(RENDER_MODE_TYPE renderMode,
                                            VIDEO_MIRROR_MODE_TYPE mirrorMode) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, renderMode)
  SET_VALUE$(document, v, mirrorMode)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLocalRenderMode,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRemoteRenderMode(uid_t userId,
                                             RENDER_MODE_TYPE renderMode) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, userId)
  SET_VALUE$(document, v, renderMode)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetRemoteRenderMode,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRemoteRenderMode(
    uid_t userId, RENDER_MODE_TYPE renderMode,
    VIDEO_MIRROR_MODE_TYPE mirrorMode) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, userId)
  SET_VALUE$(document, v, renderMode)
  SET_VALUE$(document, v, mirrorMode)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetRemoteRenderMode,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalVideoMirrorMode(
    VIDEO_MIRROR_MODE_TYPE mirrorMode) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, mirrorMode)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetLocalVideoMirrorMode, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableDualStreamMode(bool enabled) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableDualStreamMode,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setExternalAudioSource(bool enabled, int sampleRate,
                                                int channels) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  SET_VALUE$(document, v, sampleRate)
  SET_VALUE$(document, v, channels)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetExternalAudioSource, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setExternalAudioSink(bool enabled, int sampleRate,
                                              int channels) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  SET_VALUE$(document, v, sampleRate)
  SET_VALUE$(document, v, channels)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetExternalAudioSink,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRecordingAudioFrameParameters(
    int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
    int samplesPerCall) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, sampleRate)
  SET_VALUE$(document, v, channel)
  SET_VALUE$(document, v, mode)
  SET_VALUE$(document, v, samplesPerCall)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetRecordingAudioFrameParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setPlaybackAudioFrameParameters(
    int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
    int samplesPerCall) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, sampleRate)
  SET_VALUE$(document, v, channel)
  SET_VALUE$(document, v, mode)
  SET_VALUE$(document, v, samplesPerCall)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetPlaybackAudioFrameParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setMixedAudioFrameParameters(int sampleRate,
                                                      int samplesPerCall) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, sampleRate)
  SET_VALUE$(document, v, samplesPerCall)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetMixedAudioFrameParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::adjustRecordingSignalVolume(int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineAdjustRecordingSignalVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::adjustPlaybackSignalVolume(int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineAdjustPlaybackSignalVolume, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableWebSdkInteroperability(bool enabled) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineEnableWebSdkInteroperability, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setVideoQualityParameters(
    bool preferFrameRateOverImageQuality) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, preferFrameRateOverImageQuality)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetVideoQualityParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLocalPublishFallbackOption(
    STREAM_FALLBACK_OPTIONS option) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, option)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetLocalPublishFallbackOption, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setRemoteSubscribeFallbackOption(
    STREAM_FALLBACK_OPTIONS option) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, option)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetRemoteSubscribeFallbackOption, ToJsonString(v).c_str());
  return 0;
}
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
int IrisRtcEngineTester::switchCamera() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSwitchCamera,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::switchCamera(CAMERA_DIRECTION direction) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, direction)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSwitchCamera,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setDefaultAudioRouteToSpeakerphone(
    bool defaultToSpeaker) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, defaultToSpeaker)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetDefaultAudioRouteToSpeakerPhone, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setEnableSpeakerphone(bool speakerOn) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, speakerOn)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetEnableSpeakerPhone,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableInEarMonitoring(bool enabled) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableInEarMonitoring,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setInEarMonitoringVolume(int volume) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, volume)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetInEarMonitoringVolume, ToJsonString(v).c_str());
  return 0;
}
bool IrisRtcEngineTester::isSpeakerphoneEnabled() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineIsSpeakerPhoneEnabled,
                                                   ToJsonString(v).c_str());
  return false;
}
#endif
#if (defined(__APPLE__) && TARGET_OS_IOS)
int IrisRtcEngineTester::setAudioSessionOperationRestriction(
    AUDIO_SESSION_OPERATION_RESTRICTION restriction) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, restriction)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetAudioSessionOperationRestriction, ToJsonString(v).c_str());
  return 0;
}
#endif
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
int IrisRtcEngineTester::enableLoopbackRecording(bool enabled,
                                                 const char *deviceName) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  SET_VALUE_CHAR$(document, v, deviceName)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineEnableLoopBackRecording, ToJsonString(v).c_str());
  return 0;
}
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)
int IrisRtcEngineTester::startScreenCaptureByDisplayId(
    unsigned int displayId, const Rectangle &regionRect,
    const ScreenCaptureParameters &captureParams) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, displayId)
  SET_VALUE_OBJ$(document, v, regionRect)
  SET_VALUE_OBJ$(document, v, captureParams)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineStartScreenCaptureByDisplayId, ToJsonString(v).c_str());
  return 0;
}
#endif
#if defined(_WIN32)
int IrisRtcEngineTester::startScreenCaptureByScreenRect(
    const Rectangle &screenRect, const Rectangle &regionRect,
    const ScreenCaptureParameters &captureParams) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, screenRect)
  SET_VALUE_OBJ$(document, v, regionRect)
  SET_VALUE_OBJ$(document, v, captureParams)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineStartScreenCaptureByScreenRect, ToJsonString(v).c_str());
  return 0;
}
#endif
int IrisRtcEngineTester::startScreenCaptureByWindowId(
    view_t windowId, const Rectangle &regionRect,
    const ScreenCaptureParameters &captureParams) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE(document, v, windowId, reinterpret_cast<int64_t>(windowId))
  SET_VALUE_OBJ$(document, v, regionRect)
  SET_VALUE_OBJ$(document, v, captureParams)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineStartScreenCaptureByWindowId, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setScreenCaptureContentHint(
    VideoContentHint contentHint) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, contentHint)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetScreenCaptureContentHint, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::updateScreenCaptureParameters(
    const ScreenCaptureParameters &captureParams) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, captureParams)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineUpdateScreenCaptureParameters, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::updateScreenCaptureRegion(
    const Rectangle &regionRect) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, regionRect)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineUpdateScreenCaptureRegion, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopScreenCapture() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopScreenCapture,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startScreenCapture(IRtcEngine::WindowIDType windowId,
                                            int captureFreq, const Rect *rect,
                                            int bitrate) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE(document, v, windowId, (int64_t) windowId)
  SET_VALUE$(document, v, captureFreq)
  SET_VALUE_PTR$(document, v, rect)
  SET_VALUE$(document, v, bitrate)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStartScreenCapture,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::updateScreenCaptureRegion(const Rect *rect) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_PTR$(document, v, rect)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineUpdateScreenCaptureRegion, ToJsonString(v).c_str());
  return 0;
}
#endif
#if defined(_WIN32)
bool IrisRtcEngineTester::setVideoSource(IVideoSource *source) {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetVideoSource,
                                                   ToJsonString(v).c_str());
  return false;
}
#endif
int IrisRtcEngineTester::getCallId(util::AString &callId) {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineGetCallId,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::rate(const char *callId, int rating,
                              const char *description) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, callId)
  SET_VALUE$(document, v, rating)
  SET_VALUE_CHAR$(document, v, description)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineRate,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::complain(const char *callId, const char *description) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, callId)
  SET_VALUE_CHAR$(document, v, description)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineComplain,
                                                   ToJsonString(v).c_str());
  return 0;
}
const char *IrisRtcEngineTester::getVersion(int *build) {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineGetVersion,
                                                   ToJsonString(v).c_str());
  return "";
}
int IrisRtcEngineTester::enableLastmileTest() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableLastMileTest,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::disableLastmileTest() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineDisableLastMileTest,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startLastmileProbeTest(
    const LastmileProbeConfig &config) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, config)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineStartLastMileProbeTest, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopLastmileProbeTest() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopLastMileProbeTest,
                                                   ToJsonString(v).c_str());
  return 0;
}
const char *IrisRtcEngineTester::getErrorDescription(int code) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, code)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineGetErrorDescription,
                                                   ToJsonString(v).c_str());
  return nullptr;
}
int IrisRtcEngineTester::setEncryptionSecret(const char *secret) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, secret)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetEncryptionSecret,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setEncryptionMode(const char *encryptionMode) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, encryptionMode)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetEncryptionMode,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::enableEncryption(bool enabled,
                                          const EncryptionConfig &config) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  SET_VALUE_OBJ$(document, v, config)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineEnableEncryption,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::registerPacketObserver(IPacketObserver *observer) {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineRegisterPacketObserver, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::createDataStream(int *streamId, bool reliable,
                                          bool ordered) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, reliable)
  SET_VALUE$(document, v, ordered)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineCreateDataStream,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::createDataStream(int *streamId,
                                          DataStreamConfig &config) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, config)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineCreateDataStream,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::sendStreamMessage(int streamId, const char *data,
                                           size_t length) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, streamId)
  SET_VALUE_CHAR$(document, v, data)
  SET_VALUE(document, v, length, (unsigned int) length)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSendStreamMessage,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::addPublishStreamUrl(const char *url,
                                             bool transcodingEnabled) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, url)
  SET_VALUE$(document, v, transcodingEnabled)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineAddPublishStreamUrl,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::removePublishStreamUrl(const char *url) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, url)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineRemovePublishStreamUrl, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setLiveTranscoding(
    const LiveTranscoding &transcoding) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, transcoding)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetLiveTranscoding,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::addVideoWatermark(const RtcImage &watermark) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, watermark)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineAddVideoWaterMark,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::addVideoWatermark(const char *watermarkUrl,
                                           const WatermarkOptions &options) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, watermarkUrl)
  SET_VALUE_OBJ$(document, v, options)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineAddVideoWaterMark,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::clearVideoWatermarks() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineClearVideoWaterMarks,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setBeautyEffectOptions(bool enabled,
                                                BeautyOptions options) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, enabled)
  SET_VALUE_OBJ$(document, v, options)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSetBeautyEffectOptions, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::addInjectStreamUrl(const char *url,
                                            const InjectStreamConfig &config) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, url)
  SET_VALUE_OBJ$(document, v, config)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineAddInjectStreamUrl,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::startChannelMediaRelay(
    const ChannelMediaRelayConfiguration &configuration) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, configuration)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineStartChannelMediaRelay, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::updateChannelMediaRelay(
    const ChannelMediaRelayConfiguration &configuration) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, v, configuration)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineUpdateChannelMediaRelay, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::stopChannelMediaRelay() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineStopChannelMediaRelay,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::removeInjectStreamUrl(const char *url) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, url)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineRemoveInjectStreamUrl,
                                                   ToJsonString(v).c_str());
  return 0;
}
bool IrisRtcEngineTester::registerEventHandler(
    IRtcEngineEventHandler *eventHandler) {
  return false;
}
bool IrisRtcEngineTester::unregisterEventHandler(
    IRtcEngineEventHandler *eventHandler) {
  return false;
}
int IrisRtcEngineTester::sendCustomReportMessage(const char *id,
                                                 const char *category,
                                                 const char *event,
                                                 const char *label, int value) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, id)
  SET_VALUE_CHAR$(document, v, category)
  SET_VALUE_CHAR$(document, v, event)
  SET_VALUE_CHAR$(document, v, label)
  SET_VALUE$(document, v, value)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineSendCustomReportMessage, ToJsonString(v).c_str());
  return 0;
}
CONNECTION_STATE_TYPE IrisRtcEngineTester::getConnectionState() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineGetConnectionState,
                                                   ToJsonString(v).c_str());
  return CONNECTION_STATE_RECONNECTING;
}
int IrisRtcEngineTester::enableRemoteSuperResolution(uid_t userId,
                                                     bool enable) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, userId)
  SET_VALUE$(document, v, enable)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineEnableRemoteSuperResolution, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::registerMediaMetadataObserver(
    IMetadataObserver *observer, IMetadataObserver::METADATA_TYPE type) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE$(document, v, type)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(
      kEngineRegisterMediaMetadataObserver, ToJsonString(v).c_str());
  return 0;
}
int IrisRtcEngineTester::setParameters(const char *parameters) {
  Document document;
  Value v(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, v, parameters)
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineSetParameters,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcChannelTester::release() {
  Document document;
  Value v(rapidjson::kObjectType);
  dynamic_cast<IrisRtcTester *>(this)->OnApiCalled(kEngineRelease,
                                                   ToJsonString(v).c_str());
  return 0;
}
int IrisRtcChannelTester::setChannelEventHandler(
    IChannelEventHandler *channelEh) {
  return 0;
}
int IrisRtcChannelTester::joinChannel(const char *token, const char *info,
                                      uid_t uid,
                                      const ChannelMediaOptions &options) {
  return 0;
}
int IrisRtcChannelTester::joinChannelWithUserAccount(
    const char *token, const char *userAccount,
    const ChannelMediaOptions &options) {
  return 0;
}
int IrisRtcChannelTester::leaveChannel() { return 0; }
int IrisRtcChannelTester::publish() { return 0; }
int IrisRtcChannelTester::unpublish() { return 0; }
const char *IrisRtcChannelTester::channelId() { return nullptr; }
int IrisRtcChannelTester::getCallId(util::AString &callId) { return 0; }
int IrisRtcChannelTester::renewToken(const char *token) { return 0; }
int IrisRtcChannelTester::setEncryptionSecret(const char *secret) { return 0; }
int IrisRtcChannelTester::setEncryptionMode(const char *encryptionMode) {
  return 0;
}
int IrisRtcChannelTester::enableEncryption(bool enabled,
                                           const EncryptionConfig &config) {
  return 0;
}
int IrisRtcChannelTester::registerPacketObserver(IPacketObserver *observer) {
  return 0;
}
int IrisRtcChannelTester::registerMediaMetadataObserver(
    IMetadataObserver *observer, IMetadataObserver::METADATA_TYPE type) {
  return 0;
}
int IrisRtcChannelTester::setClientRole(CLIENT_ROLE_TYPE role) { return 0; }
int IrisRtcChannelTester::setClientRole(CLIENT_ROLE_TYPE role,
                                        const ClientRoleOptions &options) {
  return 0;
}
int IrisRtcChannelTester::setRemoteUserPriority(uid_t uid,
                                                PRIORITY_TYPE userPriority) {
  return 0;
}
int IrisRtcChannelTester::setRemoteVoicePosition(uid_t uid, double pan,
                                                 double gain) {
  return 0;
}
int IrisRtcChannelTester::setRemoteRenderMode(
    uid_t userId, RENDER_MODE_TYPE renderMode,
    VIDEO_MIRROR_MODE_TYPE mirrorMode) {
  return 0;
}
int IrisRtcChannelTester::setDefaultMuteAllRemoteAudioStreams(bool mute) {
  return 0;
}
int IrisRtcChannelTester::setDefaultMuteAllRemoteVideoStreams(bool mute) {
  return 0;
}
int IrisRtcChannelTester::muteAllRemoteAudioStreams(bool mute) { return 0; }
int IrisRtcChannelTester::adjustUserPlaybackSignalVolume(uid_t userId,
                                                         int volume) {
  return 0;
}
int IrisRtcChannelTester::muteRemoteAudioStream(uid_t userId, bool mute) {
  return 0;
}
int IrisRtcChannelTester::muteAllRemoteVideoStreams(bool mute) { return 0; }
int IrisRtcChannelTester::muteRemoteVideoStream(uid_t userId, bool mute) {
  return 0;
}
int IrisRtcChannelTester::setRemoteVideoStreamType(
    uid_t userId, REMOTE_VIDEO_STREAM_TYPE streamType) {
  return 0;
}
int IrisRtcChannelTester::setRemoteDefaultVideoStreamType(
    REMOTE_VIDEO_STREAM_TYPE streamType) {
  return 0;
}
int IrisRtcChannelTester::createDataStream(int *streamId, bool reliable,
                                           bool ordered) {
  return 0;
}
int IrisRtcChannelTester::createDataStream(int *streamId,
                                           DataStreamConfig &config) {
  return 0;
}
int IrisRtcChannelTester::sendStreamMessage(int streamId, const char *data,
                                            size_t length) {
  return 0;
}
int IrisRtcChannelTester::addPublishStreamUrl(const char *url,
                                              bool transcodingEnabled) {
  return 0;
}
int IrisRtcChannelTester::removePublishStreamUrl(const char *url) { return 0; }
int IrisRtcChannelTester::setLiveTranscoding(
    const LiveTranscoding &transcoding) {
  return 0;
}
int IrisRtcChannelTester::addInjectStreamUrl(const char *url,
                                             const InjectStreamConfig &config) {
  return 0;
}
int IrisRtcChannelTester::removeInjectStreamUrl(const char *url) { return 0; }
int IrisRtcChannelTester::startChannelMediaRelay(
    const ChannelMediaRelayConfiguration &configuration) {
  return 0;
}
int IrisRtcChannelTester::updateChannelMediaRelay(
    const ChannelMediaRelayConfiguration &configuration) {
  return 0;
}
int IrisRtcChannelTester::stopChannelMediaRelay() { return 0; }
CONNECTION_STATE_TYPE IrisRtcChannelTester::getConnectionState() {
  return CONNECTION_STATE_RECONNECTING;
}
int IrisRtcChannelTester::enableRemoteSuperResolution(uid_t userId,
                                                      bool enable) {
  return 0;
}
IAudioDeviceCollection *
IrisRtcAudioDeviceManagerTester::enumeratePlaybackDevices() {
  return nullptr;
}
IAudioDeviceCollection *
IrisRtcAudioDeviceManagerTester::enumerateRecordingDevices() {
  return nullptr;
}
int IrisRtcAudioDeviceManagerTester::setPlaybackDevice(const char *deviceId) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::setRecordingDevice(const char *deviceId) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::startPlaybackDeviceTest(
    const char *testAudioFilePath) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::stopPlaybackDeviceTest() { return 0; }
int IrisRtcAudioDeviceManagerTester::setPlaybackDeviceVolume(int volume) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::getPlaybackDeviceVolume(int *volume) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::setRecordingDeviceVolume(int volume) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::getRecordingDeviceVolume(int *volume) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::setPlaybackDeviceMute(bool mute) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::getPlaybackDeviceMute(bool *mute) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::setRecordingDeviceMute(bool mute) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::getRecordingDeviceMute(bool *mute) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::startRecordingDeviceTest(
    int indicationInterval) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::stopRecordingDeviceTest() { return 0; }
int IrisRtcAudioDeviceManagerTester::getPlaybackDevice(char *deviceId) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::getPlaybackDeviceInfo(char *deviceId,
                                                           char *deviceName) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::getRecordingDevice(char *deviceId) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::getRecordingDeviceInfo(char *deviceId,
                                                            char *deviceName) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::startAudioDeviceLoopbackTest(
    int indicationInterval) {
  return 0;
}
int IrisRtcAudioDeviceManagerTester::stopAudioDeviceLoopbackTest() { return 0; }
void IrisRtcAudioDeviceManagerTester::release() {}
IVideoDeviceCollection *
IrisRtcVideoDeviceManagerTester::enumerateVideoDevices() {
  return nullptr;
}
int IrisRtcVideoDeviceManagerTester::startDeviceTest(view_t hwnd) { return 0; }
int IrisRtcVideoDeviceManagerTester::stopDeviceTest() { return 0; }
int IrisRtcVideoDeviceManagerTester::setDevice(const char *deviceId) {
  return 0;
}
int IrisRtcVideoDeviceManagerTester::getDevice(char *deviceId) { return 0; }
void IrisRtcVideoDeviceManagerTester::release() {}
int IrisRtcAudioDeviceCollectionTester::getCount() { return 0; }
int IrisRtcAudioDeviceCollectionTester::getDevice(int index, char *deviceName,
                                                  char *deviceId) {
  return 0;
}
int IrisRtcAudioDeviceCollectionTester::setDevice(const char *deviceId) {
  return 0;
}
int IrisRtcAudioDeviceCollectionTester::setApplicationVolume(int volume) {
  return 0;
}
int IrisRtcAudioDeviceCollectionTester::getApplicationVolume(int &volume) {
  return 0;
}
int IrisRtcAudioDeviceCollectionTester::setApplicationMute(bool mute) {
  return 0;
}
int IrisRtcAudioDeviceCollectionTester::isApplicationMute(bool &mute) {
  return 0;
}
void IrisRtcAudioDeviceCollectionTester::release() {}
int IrisRtcVideoDeviceCollectionTester::getCount() { return 0; }
int IrisRtcVideoDeviceCollectionTester::getDevice(int index, char *deviceName,
                                                  char *deviceId) {
  return 0;
}
int IrisRtcVideoDeviceCollectionTester::setDevice(const char *deviceId) {
  return 0;
}
void IrisRtcVideoDeviceCollectionTester::release() {}
}// namespace test
}// namespace rtc
}// namespace iris
}// namespace agora
