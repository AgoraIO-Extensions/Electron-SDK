//
// Created by LXH on 2021/1/14.
//

#include "iris_rtc_engine.h"
#include "IAgoraRtcEngine2.h"
#include "internal/iris_json_utils.h"
#include "internal/iris_rtc_json_decoder.h"
#include "internal/iris_rtc_json_encoder.h"
#include "internal/rtc_engine_event_handler.h"
#include "internal/rtc_metadata_observer.h"
#include "iris_proxy.h"
#include "iris_rtc_renderer.h"
#include "loguru.hpp"

#define GET_VALUE_DEF$(val, key) GET_VALUE_DEF(val, key, key)

#define GET_VALUE_DEF_CHAR$(val, key) GET_VALUE_DEF_CHAR(val, key, key)

#define GET_VALUE_DEF_OBJ$(val, key) GET_VALUE_DEF_OBJ(val, key, key)

#define GET_VALUE_DEF_PTR$(val, obj, key, type)                                \
  GET_VALUE_DEF_PTR(val, key, (obj).key, type)

#define GET_VALUE_DEF_ARR$(val, obj, key, count, type)                         \
  GET_VALUE_DEF_ARR(val, key, (obj).key, (obj).count, type)

#define GET_VALUE$(val, key, type) GET_VALUE(val, key, key, type)

#define GET_VALUE_UINT$(val, key, type) GET_VALUE_UINT(val, key, key, type)

#define GET_VALUE_OBJ$(val, key) GET_VALUE_OBJ(val, key, key)

#define GET_VALUE_PTR$(val, obj, key, type)                                    \
  GET_VALUE_PTR(val, key, (obj).key, type)

#define GET_VALUE_ARR$(val, obj, key, count, type)                             \
  GET_VALUE_ARR(val, key, (obj).key, (obj).count, type)

namespace agora {
using namespace rtc;
using namespace media;

namespace iris {
namespace rtc {
using rapidjson::Document;
using rapidjson::Value;

class IrisRtcEngine::IrisRtcEngineImpl {
 public:
  IrisRtcEngineImpl()
      : rtc_engine_(createAgoraRtcEngine()), rtc_engine_proxy_(nullptr),
        rtc_engine_event_handler_(new RtcEngineEventHandler),
        metadata_observer_(new RtcMetadataObserver),
        device_manager_(new IrisRtcDeviceManager), channel_(new IrisRtcChannel),
        raw_data_(new IrisRtcRawData) {}

  ~IrisRtcEngineImpl() {
    if (rtc_engine_) {
      IRtcEngine::release(true);
      rtc_engine_ = nullptr;
    }
    if (rtc_engine_event_handler_) {
      delete rtc_engine_event_handler_;
      rtc_engine_event_handler_ = nullptr;
    }
    if (metadata_observer_) {
      delete metadata_observer_;
      metadata_observer_ = nullptr;
    }
    if (device_manager_) {
      delete device_manager_;
      device_manager_ = nullptr;
    }
    if (channel_) {
      delete channel_;
      channel_ = nullptr;
    }
    if (raw_data_) {
      delete raw_data_;
      raw_data_ = nullptr;
    }
  }

  void SetEventHandler(IrisEventHandler *event_handler) {
    rtc_engine_event_handler_->event_handler_ = event_handler;
    metadata_observer_->event_handler_ = event_handler;
    raw_data_->renderer()->SetEventHandler(event_handler);
  }

  int CallApi(ApiTypeEngine api_type, const char *params,
              char result[kBasicResultLength]) {
    int error_code = -ERROR_CODE_TYPE::ERR_FAILED;
    Document document;
    document.Parse(params);

    switch (api_type) {
      case kEngineInitialize: {
        RtcEngineContext context;
        GET_VALUE_OBJ$(document, context)
        context.eventHandler = rtc_engine_event_handler_;
        error_code = rtc_engine()->initialize(context);
        device_manager_->Initialize(rtc_engine_);
        channel_->Initialize(rtc_engine_);
        raw_data_->Initialize(rtc_engine_);
        break;
      }
      case kEngineRelease: {
        bool sync = false;
        GET_VALUE_DEF$(document, sync)
        device_manager_->Release();
        channel_->Release();
        raw_data_->Release();
        IRtcEngine::release(sync);
        rtc_engine_ = nullptr;
        error_code = ERROR_CODE_TYPE::ERR_OK;
        break;
      }
      case kEngineSetChannelProfile: {
        CHANNEL_PROFILE_TYPE profile;
        GET_VALUE_UINT$(document, profile, CHANNEL_PROFILE_TYPE)
        error_code = rtc_engine()->setChannelProfile(profile);
        break;
      }
      case kEngineSetClientRole: {
        CLIENT_ROLE_TYPE role;
        GET_VALUE_UINT$(document, role, CLIENT_ROLE_TYPE)
        try {
          ClientRoleOptions options;
          GET_VALUE_OBJ$(document, options)
          error_code = rtc_engine()->setClientRole(role, options);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->setClientRole(role);
        }
        break;
      }
      case kEngineJoinChannel: {
        const char *token;
        GET_VALUE_DEF_CHAR$(document, token)
        const char *channelId;
        GET_VALUE$(document, channelId, const char *)
        const char *info;
        GET_VALUE_DEF_CHAR$(document, info)
        unsigned int uid;
        GET_VALUE$(document, uid, unsigned int)
        try {
          ChannelMediaOptions options;
          GET_VALUE_OBJ$(document, options)
          error_code =
              rtc_engine()->joinChannel(token, channelId, info, uid, options);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->joinChannel(token, channelId, info, uid);
        }
        break;
      }
      case kEngineSwitchChannel: {
        const char *token;
        GET_VALUE_DEF_CHAR$(document, token)
        const char *channelId;
        GET_VALUE$(document, channelId, const char *)
        try {
          ChannelMediaOptions options;
          GET_VALUE_OBJ$(document, options)
          error_code = rtc_engine()->switchChannel(token, channelId, options);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->switchChannel(token, channelId);
        }
        break;
      }
      case kEngineLeaveChannel: {
        error_code = rtc_engine()->leaveChannel();
        break;
      }
      case kEngineRenewToken: {
        const char *token;
        GET_VALUE$(document, token, const char *)
        error_code = rtc_engine()->renewToken(token);
        break;
      }
      case kEngineRegisterLocalUserAccount: {
        const char *appId;
        GET_VALUE$(document, appId, const char *)
        const char *userAccount;
        GET_VALUE$(document, userAccount, const char *)
        error_code = rtc_engine()->registerLocalUserAccount(appId, userAccount);
        break;
      }
      case kEngineJoinChannelWithUserAccount: {
        const char *token;
        GET_VALUE_DEF_CHAR$(document, token)
        const char *channelId;
        GET_VALUE$(document, channelId, const char *)
        const char *userAccount;
        GET_VALUE$(document, userAccount, const char *)
        try {
          ChannelMediaOptions options;
          GET_VALUE_OBJ$(document, options)
          error_code = rtc_engine()->joinChannelWithUserAccount(
              token, channelId, userAccount, options);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->joinChannelWithUserAccount(
              token, channelId, userAccount);
        }
        break;
      }
      case kEngineGetUserInfoByUserAccount: {
        const char *userAccount;
        GET_VALUE$(document, userAccount, const char *)
        UserInfo userInfo;
        error_code =
            rtc_engine()->getUserInfoByUserAccount(userAccount, &userInfo);

        Value value(rapidjson::kObjectType);
        JsonEncode(document, value, userInfo);
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kEngineGetUserInfoByUid: {
        unsigned int uid;
        GET_VALUE$(document, uid, unsigned int)
        UserInfo userInfo;
        error_code = rtc_engine()->getUserInfoByUid(uid, &userInfo);

        Value value(rapidjson::kObjectType);
        JsonEncode(document, value, userInfo);
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kEngineStartEchoTest: {
        try {
          int intervalInSeconds;
          GET_VALUE$(document, intervalInSeconds, int)
          error_code = rtc_engine()->startEchoTest(intervalInSeconds);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->startEchoTest();
        }
        break;
      }
      case kEngineStopEchoTest: {
        error_code = rtc_engine()->stopEchoTest();
        break;
      }
      case kEngineSetCloudProxy: {
        CLOUD_PROXY_TYPE proxyType;
        GET_VALUE_UINT$(document, proxyType, CLOUD_PROXY_TYPE)
        error_code = rtc_engine()->setCloudProxy(proxyType);
        break;
      }
      case kEngineEnableVideo: {
        error_code = rtc_engine()->enableVideo();
        break;
      }
      case kEngineDisableVideo: {
        error_code = rtc_engine()->disableVideo();
        break;
      }
      case kEngineSetVideoProfile: {
        VIDEO_PROFILE_TYPE profile;
        GET_VALUE_UINT$(document, profile, VIDEO_PROFILE_TYPE)
        bool swapWidthAndHeight;
        GET_VALUE$(document, swapWidthAndHeight, bool)
        error_code = rtc_engine()->setVideoProfile(profile, swapWidthAndHeight);
        break;
      }
      case kEngineSetVideoEncoderConfiguration: {
        VideoEncoderConfiguration config;
        GET_VALUE_OBJ$(document, config)
        error_code = rtc_engine()->setVideoEncoderConfiguration(config);
        break;
      }
      case kEngineSetCameraCapturerConfiguration: {
        CameraCapturerConfiguration config{};
        GET_VALUE_OBJ$(document, config)
        error_code = rtc_engine()->setCameraCapturerConfiguration(config);
        break;
      }
      case kEngineSetupLocalVideo: {
        VideoCanvas canvas;
        GET_VALUE_OBJ$(document, canvas)
        error_code = rtc_engine()->setupLocalVideo(canvas);
        break;
      }
      case kEngineSetupRemoteVideo: {
        VideoCanvas canvas;
        GET_VALUE_OBJ$(document, canvas)
        error_code = rtc_engine()->setupRemoteVideo(canvas);
        break;
      }
      case kEngineStartPreview: {
        error_code = rtc_engine()->startPreview();
        break;
      }
      case kEngineSetRemoteUserPriority: {
        unsigned int uid;
        GET_VALUE$(document, uid, unsigned int)
        PRIORITY_TYPE userPriority;
        GET_VALUE_UINT$(document, userPriority, PRIORITY_TYPE)
        error_code = rtc_engine()->setRemoteUserPriority(uid, userPriority);
        break;
      }
      case kEngineStopPreview: {
        error_code = rtc_engine()->stopPreview();
        break;
      }
      case kEngineEnableAudio: {
        error_code = rtc_engine()->enableAudio();
        break;
      }
      case kEngineEnableLocalAudio: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        error_code = rtc_engine()->enableLocalAudio(enabled);
        break;
      }
      case kEngineDisableAudio: {
        error_code = rtc_engine()->disableAudio();
        break;
      }
      case kEngineSetAudioProfile: {
        AUDIO_PROFILE_TYPE profile;
        GET_VALUE_UINT$(document, profile, AUDIO_PROFILE_TYPE)
        AUDIO_SCENARIO_TYPE scenario;
        GET_VALUE_UINT$(document, scenario, AUDIO_SCENARIO_TYPE)
        error_code = rtc_engine()->setAudioProfile(profile, scenario);
        break;
      }
      case kEngineMuteLocalAudioStream: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->muteLocalAudioStream(mute);
        break;
      }
      case kEngineMuteAllRemoteAudioStreams: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->muteAllRemoteAudioStreams(mute);
        break;
      }
      case kEngineSetDefaultMuteAllRemoteAudioStreams: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->setDefaultMuteAllRemoteAudioStreams(mute);
        break;
      }
      case kEngineAdjustUserPlaybackSignalVolume: {
        unsigned int uid;
        GET_VALUE$(document, uid, unsigned int)
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->adjustUserPlaybackSignalVolume(uid, volume);
        break;
      }
      case kEngineMuteRemoteAudioStream: {
        unsigned int userId;
        GET_VALUE$(document, userId, unsigned int)
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->muteRemoteAudioStream(userId, mute);
        break;
      }
      case kEngineMuteLocalVideoStream: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->muteLocalVideoStream(mute);
        break;
      }
      case kEngineEnableLocalVideo: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        error_code = rtc_engine()->enableLocalVideo(enabled);
        break;
      }
      case kEngineMuteAllRemoteVideoStreams: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->muteAllRemoteVideoStreams(mute);
        break;
      }
      case kEngineSetDefaultMuteAllRemoteVideoStreams: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->setDefaultMuteAllRemoteVideoStreams(mute);
        break;
      }
      case kEngineMuteRemoteVideoStream: {
        unsigned int userId;
        GET_VALUE$(document, userId, unsigned int)
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = rtc_engine()->muteRemoteVideoStream(userId, mute);
        break;
      }
      case kEngineSetRemoteVideoStreamType: {
        unsigned int userId;
        GET_VALUE$(document, userId, unsigned int)
        REMOTE_VIDEO_STREAM_TYPE streamType;
        GET_VALUE_UINT$(document, streamType, REMOTE_VIDEO_STREAM_TYPE)
        error_code = rtc_engine()->setRemoteVideoStreamType(userId, streamType);
        break;
      }
      case kEngineSetRemoteDefaultVideoStreamType: {
        REMOTE_VIDEO_STREAM_TYPE streamType;
        GET_VALUE_UINT$(document, streamType, REMOTE_VIDEO_STREAM_TYPE)
        error_code = rtc_engine()->setRemoteDefaultVideoStreamType(streamType);
        break;
      }
      case kEngineEnableAudioVolumeIndication: {
        int interval;
        GET_VALUE$(document, interval, int)
        int smooth;
        GET_VALUE$(document, smooth, int)
        bool report_vad;
        GET_VALUE$(document, report_vad, bool)
        error_code = rtc_engine()->enableAudioVolumeIndication(interval, smooth,
                                                               report_vad);
        break;
      }
      case kEngineStartAudioRecording: {
        const char *filePath;
        GET_VALUE$(document, filePath, const char *)
        AUDIO_RECORDING_QUALITY_TYPE quality;
        GET_VALUE_UINT$(document, quality, AUDIO_RECORDING_QUALITY_TYPE)
        try {
          AUDIO_RECORDING_QUALITY_TYPE sampleRate;
          GET_VALUE_UINT$(document, sampleRate, AUDIO_RECORDING_QUALITY_TYPE)
          error_code =
              rtc_engine()->startAudioRecording(filePath, sampleRate, quality);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->startAudioRecording(filePath, quality);
        }
        break;
      }
      case kEngineStopAudioRecording: {
        error_code = rtc_engine()->stopAudioRecording();
        break;
      }
      case kEngineStartAudioMixing: {
        const char *filePath;
        GET_VALUE$(document, filePath, const char *)
        bool loopback;
        GET_VALUE$(document, loopback, bool)
        bool replace;
        GET_VALUE$(document, replace, bool)
        int cycle;
        GET_VALUE$(document, cycle, int)
        error_code =
            rtc_engine()->startAudioMixing(filePath, loopback, replace, cycle);
        break;
      }
      case kEngineStopAudioMixing: {
        error_code = rtc_engine()->stopAudioMixing();
        break;
      }
      case kEnginePauseAudioMixing: {
        error_code = rtc_engine()->pauseAudioMixing();
        break;
      }
      case kEngineResumeAudioMixing: {
        error_code = rtc_engine()->resumeAudioMixing();
        break;
      }
      case kEngineSetHighQualityAudioParameters: {
        bool fullband;
        GET_VALUE$(document, fullband, bool)
        bool stereo;
        GET_VALUE$(document, stereo, bool)
        bool fullBitrate;
        GET_VALUE$(document, fullBitrate, bool)
        error_code = rtc_engine()->setHighQualityAudioParameters(
            fullband, stereo, fullBitrate);
        break;
      }
      case kEngineAdjustAudioMixingVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->adjustAudioMixingVolume(volume);
        break;
      }
      case kEngineAdjustAudioMixingPlayoutVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->adjustAudioMixingPlayoutVolume(volume);
        break;
      }
      case kEngineGetAudioMixingPlayoutVolume: {
        error_code = rtc_engine()->getAudioMixingPlayoutVolume();
        break;
      }
      case kEngineAdjustAudioMixingPublishVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->adjustAudioMixingPublishVolume(volume);
        break;
      }
      case kEngineGetAudioMixingPublishVolume: {
        error_code = rtc_engine()->getAudioMixingPublishVolume();
        break;
      }
      case kEngineGetAudioMixingDuration: {
        error_code = rtc_engine()->getAudioMixingDuration();
        break;
      }
      case kEngineGetAudioMixingCurrentPosition: {
        error_code = rtc_engine()->getAudioMixingCurrentPosition();
        break;
      }
      case kEngineSetAudioMixingPosition: {
        int pos;
        GET_VALUE$(document, pos, int)
        error_code = rtc_engine()->setAudioMixingPosition(pos);
        break;
      }
      case kEngineSetAudioMixingPitch: {
        int pitch;
        GET_VALUE$(document, pitch, int)
        error_code = rtc_engine()->setAudioMixingPitch(pitch);
        break;
      }
      case kEngineGetEffectsVolume: {
        error_code = rtc_engine()->getEffectsVolume();
        break;
      }
      case kEngineSetEffectsVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->setEffectsVolume(volume);
        break;
      }
      case kEngineSetVolumeOfEffect: {
        int soundId;
        GET_VALUE$(document, soundId, int)
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->setVolumeOfEffect(soundId, volume);
        break;
      }
      case kEngineEnableFaceDetection: {
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
        bool enable;
        GET_VALUE$(document, enable, bool)
        error_code = rtc_engine()->enableFaceDetection(enable);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEnginePlayEffect: {
        int soundId;
        GET_VALUE$(document, soundId, int)
        const char *filePath;
        GET_VALUE$(document, filePath, const char *)
        int loopCount;
        GET_VALUE$(document, loopCount, int)
        double pitch;
        GET_VALUE$(document, pitch, double)
        double pan;
        GET_VALUE$(document, pan, double)
        int gain;
        GET_VALUE$(document, gain, int)
        bool publish;
        GET_VALUE$(document, publish, bool)
        error_code = rtc_engine()->playEffect(soundId, filePath, loopCount,
                                              pitch, pan, gain, publish);
        break;
      }
      case kEngineStopEffect: {
        int soundId;
        GET_VALUE$(document, soundId, int)
        error_code = rtc_engine()->stopEffect(soundId);
        break;
      }
      case kEngineStopAllEffects: {
        error_code = rtc_engine()->stopAllEffects();
        break;
      }
      case kEnginePreloadEffect: {
        int soundId;
        GET_VALUE$(document, soundId, int)
        const char *filePath;
        GET_VALUE$(document, filePath, const char *)
        error_code = rtc_engine()->preloadEffect(soundId, filePath);
        break;
      }
      case kEngineUnloadEffect: {
        int soundId;
        GET_VALUE$(document, soundId, int)
        error_code = rtc_engine()->unloadEffect(soundId);
        break;
      }
      case kEnginePauseEffect: {
        int soundId;
        GET_VALUE$(document, soundId, int)
        error_code = rtc_engine()->pauseEffect(soundId);
        break;
      }
      case kEnginePauseAllEffects: {
        error_code = rtc_engine()->pauseAllEffects();
        break;
      }
      case kEngineResumeEffect: {
        int soundId;
        GET_VALUE$(document, soundId, int)
        error_code = rtc_engine()->resumeEffect(soundId);
        break;
      }
      case kEngineResumeAllEffects: {
        error_code = rtc_engine()->resumeAllEffects();
        break;
      }
      case kEngineEnableDeepLearningDenoise: {
        bool enable;
        GET_VALUE$(document, enable, bool)
        error_code = rtc_engine()->enableDeepLearningDenoise(enable);
        break;
      }
      case kEngineEnableSoundPositionIndication: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        error_code = rtc_engine()->enableSoundPositionIndication(enabled);
        break;
      }
      case kEngineSetRemoteVoicePosition: {
        unsigned int uid;
        GET_VALUE$(document, uid, unsigned int)
        double pan;
        GET_VALUE$(document, pan, double)
        double gain;
        GET_VALUE$(document, gain, double)
        error_code = rtc_engine()->setRemoteVoicePosition(uid, pan, gain);
        break;
      }
      case kEngineSetLocalVoicePitch: {
        double pitch;
        GET_VALUE$(document, pitch, double)
        error_code = rtc_engine()->setLocalVoicePitch(pitch);
        break;
      }
      case kEngineSetLocalVoiceEqualization: {
        AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency;
        GET_VALUE_UINT$(document, bandFrequency,
                        AUDIO_EQUALIZATION_BAND_FREQUENCY)
        int bandGain;
        GET_VALUE$(document, bandGain, int)
        error_code =
            rtc_engine()->setLocalVoiceEqualization(bandFrequency, bandGain);
        break;
      }
      case kEngineSetLocalVoiceReverb: {
        AUDIO_REVERB_TYPE reverbKey;
        GET_VALUE_UINT$(document, reverbKey, AUDIO_REVERB_TYPE)
        int value;
        GET_VALUE$(document, value, int)
        error_code = rtc_engine()->setLocalVoiceReverb(reverbKey, value);
        break;
      }
      case kEngineSetLocalVoiceChanger: {
        VOICE_CHANGER_PRESET voiceChanger;
        GET_VALUE_UINT$(document, voiceChanger, VOICE_CHANGER_PRESET)
        error_code = rtc_engine()->setLocalVoiceChanger(voiceChanger);
        break;
      }
      case kEngineSetLocalVoiceReverbPreset: {
        AUDIO_REVERB_PRESET reverbPreset;
        GET_VALUE_UINT$(document, reverbPreset, AUDIO_REVERB_PRESET)
        error_code = rtc_engine()->setLocalVoiceReverbPreset(reverbPreset);
        break;
      }
      case kEngineSetVoiceBeautifierPreset: {
        VOICE_BEAUTIFIER_PRESET preset;
        GET_VALUE_UINT$(document, preset, VOICE_BEAUTIFIER_PRESET)
        error_code = rtc_engine()->setVoiceBeautifierPreset(preset);
        break;
      }
      case kEngineSetAudioEffectPreset: {
        AUDIO_EFFECT_PRESET preset;
        GET_VALUE_UINT$(document, preset, AUDIO_EFFECT_PRESET)
        error_code = rtc_engine()->setAudioEffectPreset(preset);
        break;
      }
      case kEngineSetVoiceConversionPreset: {
        VOICE_CONVERSION_PRESET preset;
        GET_VALUE_UINT$(document, preset, VOICE_CONVERSION_PRESET)
        error_code = rtc_engine()->setVoiceConversionPreset(preset);
        break;
      }
      case kEngineSetAudioEffectParameters: {
        AUDIO_EFFECT_PRESET preset;
        GET_VALUE_UINT$(document, preset, AUDIO_EFFECT_PRESET)
        int param1;
        GET_VALUE$(document, param1, int)
        int param2;
        GET_VALUE$(document, param2, int)
        error_code =
            rtc_engine()->setAudioEffectParameters(preset, param1, param2);
        break;
      }
      case kEngineSetVoiceBeautifierParameters: {
        VOICE_BEAUTIFIER_PRESET preset;
        GET_VALUE_UINT$(document, preset, VOICE_BEAUTIFIER_PRESET)
        int param1;
        GET_VALUE$(document, param1, int)
        int param2;
        GET_VALUE$(document, param2, int)
        error_code =
            rtc_engine()->setVoiceBeautifierParameters(preset, param1, param2);
        break;
      }
      case kEngineSetLogFile: {
        const char *filePath;
        GET_VALUE$(document, filePath, const char *)
        error_code = rtc_engine()->setLogFile(filePath);
        break;
      }
      case kEngineSetLogFilter: {
        LOG_FILTER_TYPE filter;
        GET_VALUE_UINT$(document, filter, LOG_FILTER_TYPE)
        error_code = rtc_engine()->setLogFilter(filter);
        break;
      }
      case kEngineSetLogFileSize: {
        unsigned int fileSizeInKBytes;
        GET_VALUE$(document, fileSizeInKBytes, unsigned int)
        error_code = rtc_engine()->setLogFileSize(fileSizeInKBytes);
        break;
      }
      case kEngineUploadLogFile: {
        util::AString requestId;
        error_code = rtc_engine()->uploadLogFile(requestId);
        strcpy(result, requestId->c_str());
        break;
      }
      case kEngineSetLocalRenderMode: {
        RENDER_MODE_TYPE renderMode;
        GET_VALUE_UINT$(document, renderMode, RENDER_MODE_TYPE)
        try {
          VIDEO_MIRROR_MODE_TYPE mirrorMode;
          GET_VALUE_UINT$(document, mirrorMode, VIDEO_MIRROR_MODE_TYPE)
          error_code = rtc_engine()->setLocalRenderMode(renderMode, mirrorMode);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->setLocalRenderMode(renderMode);
        }
        break;
      }
      case kEngineSetRemoteRenderMode: {
        unsigned int userId;
        GET_VALUE$(document, userId, unsigned int)
        RENDER_MODE_TYPE renderMode;
        GET_VALUE_UINT$(document, renderMode, RENDER_MODE_TYPE)
        try {
          VIDEO_MIRROR_MODE_TYPE mirrorMode;
          GET_VALUE_UINT$(document, mirrorMode, VIDEO_MIRROR_MODE_TYPE)
          error_code =
              rtc_engine()->setRemoteRenderMode(userId, renderMode, mirrorMode);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->setRemoteRenderMode(userId, renderMode);
        }
        break;
      }
      case kEngineSetLocalVideoMirrorMode: {
        VIDEO_MIRROR_MODE_TYPE mirrorMode;
        GET_VALUE_UINT$(document, mirrorMode, VIDEO_MIRROR_MODE_TYPE)
        error_code = rtc_engine()->setLocalVideoMirrorMode(mirrorMode);
        break;
      }
      case kEngineEnableDualStreamMode: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        error_code = rtc_engine()->enableDualStreamMode(enabled);
        break;
      }
      case kEngineSetExternalAudioSource: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        int sampleRate;
        GET_VALUE$(document, sampleRate, int)
        int channels;
        GET_VALUE$(document, channels, int)
        error_code =
            rtc_engine()->setExternalAudioSource(enabled, sampleRate, channels);
        break;
      }
      case kEngineSetExternalAudioSink: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        int sampleRate;
        GET_VALUE$(document, sampleRate, int)
        int channels;
        GET_VALUE$(document, channels, int)
        error_code =
            rtc_engine()->setExternalAudioSink(enabled, sampleRate, channels);
        break;
      }
      case kEngineSetRecordingAudioFrameParameters: {
        int sampleRate;
        GET_VALUE$(document, sampleRate, int)
        int channel;
        GET_VALUE$(document, channel, int)
        RAW_AUDIO_FRAME_OP_MODE_TYPE mode;
        GET_VALUE_UINT$(document, mode, RAW_AUDIO_FRAME_OP_MODE_TYPE)
        int samplesPerCall;
        GET_VALUE$(document, samplesPerCall, int)
        error_code = rtc_engine()->setRecordingAudioFrameParameters(
            sampleRate, channel, mode, samplesPerCall);
        break;
      }
      case kEngineSetPlaybackAudioFrameParameters: {
        int sampleRate;
        GET_VALUE$(document, sampleRate, int)
        int channel;
        GET_VALUE$(document, channel, int)
        RAW_AUDIO_FRAME_OP_MODE_TYPE mode;
        GET_VALUE_UINT$(document, mode, RAW_AUDIO_FRAME_OP_MODE_TYPE)
        int samplesPerCall;
        GET_VALUE$(document, samplesPerCall, int)
        error_code = rtc_engine()->setPlaybackAudioFrameParameters(
            sampleRate, channel, mode, samplesPerCall);
        break;
      }
      case kEngineSetMixedAudioFrameParameters: {
        int sampleRate;
        GET_VALUE$(document, sampleRate, int)
        int samplesPerCall;
        GET_VALUE$(document, samplesPerCall, int)
        error_code = rtc_engine()->setMixedAudioFrameParameters(sampleRate,
                                                                samplesPerCall);
        break;
      }
      case kEngineAdjustRecordingSignalVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->adjustRecordingSignalVolume(volume);
        break;
      }
      case kEngineAdjustPlaybackSignalVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->adjustPlaybackSignalVolume(volume);
        break;
      }
      case kEngineEnableWebSdkInteroperability: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        error_code = rtc_engine()->enableWebSdkInteroperability(enabled);
        break;
      }
      case kEngineSetVideoQualityParameters: {
        bool preferFrameRateOverImageQuality;
        GET_VALUE$(document, preferFrameRateOverImageQuality, bool)
        error_code = rtc_engine()->setVideoQualityParameters(
            preferFrameRateOverImageQuality);
        break;
      }
      case kEngineSetLocalPublishFallbackOption: {
        STREAM_FALLBACK_OPTIONS option;
        GET_VALUE_UINT$(document, option, STREAM_FALLBACK_OPTIONS)
        error_code = rtc_engine()->setLocalPublishFallbackOption(option);
        break;
      }
      case kEngineSetRemoteSubscribeFallbackOption: {
        STREAM_FALLBACK_OPTIONS option;
        GET_VALUE_UINT$(document, option, STREAM_FALLBACK_OPTIONS)
        error_code = rtc_engine()->setRemoteSubscribeFallbackOption(option);
        break;
      }
      case kEngineSwitchCamera: {
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
        try {
          CAMERA_DIRECTION direction;
          GET_VALUE_UINT$(document, direction, CAMERA_DIRECTION)
          error_code = rtc_engine()->switchCamera(direction);
        } catch (std::invalid_argument &) {
          error_code = rtc_engine()->switchCamera();
        }
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineSetDefaultAudioRouteToSpeakerPhone: {
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
        bool defaultToSpeaker;
        GET_VALUE$(document, defaultToSpeaker, bool)
        error_code =
            rtc_engine()->setDefaultAudioRouteToSpeakerphone(defaultToSpeaker);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineSetEnableSpeakerPhone: {
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
        bool defaultToSpeaker;
        GET_VALUE$(document, defaultToSpeaker, bool)
        error_code = rtc_engine()->setEnableSpeakerphone(defaultToSpeaker);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineEnableInEarMonitoring: {
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        error_code = rtc_engine()->enableInEarMonitoring(enabled);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineSetInEarMonitoringVolume: {
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = rtc_engine()->setInEarMonitoringVolume(volume);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineIsSpeakerPhoneEnabled: {
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
        error_code = rtc_engine()->isSpeakerphoneEnabled();
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineSetAudioSessionOperationRestriction: {
#if (defined(__APPLE__) && TARGET_OS_IOS)
        AUDIO_SESSION_OPERATION_RESTRICTION restriction;
        GET_VALUE_UINT$(document, restriction,
                        AUDIO_SESSION_OPERATION_RESTRICTION)
        error_code =
            rtc_engine()->setAudioSessionOperationRestriction(restriction);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineEnableLoopBackRecording: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        const char *deviceName;
        GET_VALUE$(document, deviceName, const char *)
        error_code = rtc_engine()->enableLoopbackRecording(enabled, deviceName);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineStartScreenCaptureByDisplayId: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)
        unsigned int displayId;
        GET_VALUE$(document, displayId, unsigned int)
        Rectangle regionRect;
        GET_VALUE_DEF_OBJ$(document, regionRect)
        ScreenCaptureParameters captureParams;
        GET_VALUE_DEF_OBJ$(document, captureParams)
        GET_VALUE_DEF_ARR$(value_captureParams, captureParams,
                           excludeWindowList, excludeWindowCount, view_t)
        error_code = rtc_engine()->startScreenCaptureByDisplayId(
            displayId, regionRect, captureParams);

        LOG_F(INFO, "rtc_engine()->startScreenCaptureByDisplayId error_code %d",
              error_code);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineStartScreenCaptureByScreenRect: {
#if defined(_WIN32)
        Rectangle screenRect;
        GET_VALUE_DEF_OBJ$(document, screenRect)
        Rectangle regionRect;
        GET_VALUE_DEF_OBJ$(document, regionRect)
        ScreenCaptureParameters captureParams;
        GET_VALUE_DEF_OBJ$(document, captureParams)
        GET_VALUE_DEF_ARR$(value_captureParams, captureParams,
                           excludeWindowList, excludeWindowCount, view_t)
        error_code = rtc_engine()->startScreenCaptureByScreenRect(
            screenRect, regionRect, captureParams);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineStartScreenCaptureByWindowId: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
        view_t windowId;
        GET_VALUE_UINT$(document, windowId, view_t)
        Rectangle regionRect;
        GET_VALUE_DEF_OBJ$(document, regionRect)
        ScreenCaptureParameters captureParams;
        GET_VALUE_DEF_OBJ$(document, captureParams)
        GET_VALUE_DEF_ARR$(value_captureParams, captureParams,
                           excludeWindowList, excludeWindowCount, view_t)
        error_code = rtc_engine()->startScreenCaptureByWindowId(
            windowId, regionRect, captureParams);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineSetScreenCaptureContentHint: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
        VideoContentHint contentHint;
        GET_VALUE_UINT$(document, contentHint, VideoContentHint)
        error_code = rtc_engine()->setScreenCaptureContentHint(contentHint);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineUpdateScreenCaptureParameters: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
        ScreenCaptureParameters captureParams;
        GET_VALUE_OBJ$(document, captureParams)
        GET_VALUE_DEF_ARR$(value_captureParams, captureParams,
                           excludeWindowList, excludeWindowCount, view_t)
        error_code = rtc_engine()->updateScreenCaptureParameters(captureParams);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineUpdateScreenCaptureRegion: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
        Rectangle regionRect;
        GET_VALUE_OBJ$(document, regionRect)
        error_code = rtc_engine()->updateScreenCaptureRegion(regionRect);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineStopScreenCapture: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
        error_code = rtc_engine()->stopScreenCapture();
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineStartScreenCapture: {
#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)                 \
    || defined(_WIN32)
        IRtcEngine::WindowIDType windowId;
        GET_VALUE_UINT$(document, windowId, IRtcEngine::WindowIDType)
        int captureFreq;
        GET_VALUE$(document, captureFreq, int)
        Rect *rect;
        GET_VALUE_DEF_PTR(document, rect, rect, Rect)
        int bitrate;
        GET_VALUE$(document, bitrate, int)
        error_code = rtc_engine()->startScreenCapture(windowId, captureFreq,
                                                      rect, bitrate);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineSetVideoSource: {
#if defined(_WIN32)
        // TODO
        error_code = rtc_engine()->setVideoSource(nullptr);
#else
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
#endif
        break;
      }
      case kEngineGetCallId: {
        agora::util::AString callId;
        error_code = rtc_engine()->getCallId(callId);
        if (callId) { strcpy(result, callId->c_str()); }
        break;
      }
      case kEngineRate: {
        const char *callId;
        GET_VALUE$(document, callId, const char *)
        int rating;
        GET_VALUE$(document, rating, int)
        const char *description;
        GET_VALUE_DEF_CHAR$(document, description)
        error_code = rtc_engine()->rate(callId, rating, description);
        break;
      }
      case kEngineComplain: {
        const char *callId;
        GET_VALUE$(document, callId, const char *)
        const char *description;
        GET_VALUE_DEF_CHAR$(document, description)
        error_code = rtc_engine()->complain(callId, description);
        break;
      }
      case kEngineGetVersion: {
        int build;
        auto ret = rtc_engine()->getVersion(&build);
        if (ret) { strcpy(result, ret); }
        error_code = ERROR_CODE_TYPE::ERR_OK;
        break;
      }
      case kEngineEnableLastMileTest: {
        error_code = rtc_engine()->enableLastmileTest();
        break;
      }
      case kEngineDisableLastMileTest: {
        error_code = rtc_engine()->disableLastmileTest();
        break;
      }
      case kEngineStartLastMileProbeTest: {
        LastmileProbeConfig config{};
        GET_VALUE_OBJ$(document, config)
        error_code = rtc_engine()->startLastmileProbeTest(config);
        break;
      }
      case kEngineStopLastMileProbeTest: {
        error_code = rtc_engine()->stopLastmileProbeTest();
        break;
      }
      case kEngineGetErrorDescription: {
        int code;
        GET_VALUE$(document, code, int)
        auto ret = rtc_engine()->getErrorDescription(code);
        if (ret) { strcpy(result, ret); }
        error_code = ERROR_CODE_TYPE::ERR_OK;
        break;
      }
      case kEngineSetEncryptionSecret: {
        const char *secret;
        GET_VALUE$(document, secret, const char *)
        error_code = rtc_engine()->setEncryptionSecret(secret);
        break;
      }
      case kEngineSetEncryptionMode: {
        const char *encryptionMode;
        GET_VALUE$(document, encryptionMode, const char *)
        error_code = rtc_engine()->setEncryptionMode(encryptionMode);
        break;
      }
      case kEngineCreateDataStream: {
        int streamId;
        try {
          DataStreamConfig config{};
          GET_VALUE_OBJ$(document, config)
          error_code = rtc_engine()->createDataStream(&streamId, config);
        } catch (std::invalid_argument &) {
          bool reliable;
          GET_VALUE$(document, reliable, bool)
          bool ordered;
          GET_VALUE$(document, ordered, bool)
          error_code =
              rtc_engine()->createDataStream(&streamId, reliable, ordered);
        }
        if (error_code == ERROR_CODE_TYPE::ERR_OK) { error_code = streamId; }
        break;
      }
      case kEngineAddPublishStreamUrl: {
        const char *url;
        GET_VALUE$(document, url, const char *)
        bool transcodingEnabled;
        GET_VALUE$(document, transcodingEnabled, bool)
        error_code = rtc_engine()->addPublishStreamUrl(url, transcodingEnabled);
        break;
      }
      case kEngineRemovePublishStreamUrl: {
        const char *url;
        GET_VALUE$(document, url, const char *)
        error_code = rtc_engine()->removePublishStreamUrl(url);
        break;
      }
      case kEngineSetLiveTranscoding: {
        LiveTranscoding transcoding;
        GET_VALUE_OBJ$(document, transcoding)
        GET_VALUE_ARR$(value_transcoding, transcoding, transcodingUsers,
                       userCount, TranscodingUser)
        GET_VALUE_DEF_PTR$(value_transcoding, transcoding, watermark, RtcImage)
        GET_VALUE_DEF_PTR$(value_transcoding, transcoding, backgroundImage,
                           RtcImage)
        GET_VALUE_DEF_ARR$(value_transcoding, transcoding, advancedFeatures,
                           advancedFeatureCount, LiveStreamAdvancedFeature)
        error_code = rtc_engine()->setLiveTranscoding(transcoding);
        break;
      }
      case kEngineAddVideoWaterMark: {
        try {
          RtcImage watermark;
          GET_VALUE_OBJ$(document, watermark)
          error_code = rtc_engine()->addVideoWatermark(watermark);
        } catch (std::invalid_argument &) {
          const char *watermarkUrl;
          GET_VALUE$(document, watermarkUrl, const char *)
          WatermarkOptions options;
          GET_VALUE_DEF_OBJ$(document, options)
          error_code = rtc_engine()->addVideoWatermark(watermarkUrl, options);
        }
        break;
      }
      case kEngineClearVideoWaterMarks: {
        error_code = rtc_engine()->clearVideoWatermarks();
        break;
      }
      case kEngineSetBeautyEffectOptions: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        BeautyOptions options;
        GET_VALUE_DEF_OBJ$(document, options)
        error_code = rtc_engine()->setBeautyEffectOptions(enabled, options);
        break;
      }
      case kEngineAddInjectStreamUrl: {
        const char *url;
        GET_VALUE$(document, url, const char *)
        InjectStreamConfig config;
        GET_VALUE_DEF_OBJ$(document, config)
        error_code = rtc_engine()->addInjectStreamUrl(url, config);
        break;
      }
      case kEngineStartChannelMediaRelay: {
        ChannelMediaRelayConfiguration configuration;
        GET_VALUE_OBJ$(document, configuration)
        auto vv = ToJsonString(value_configuration);
        GET_VALUE_PTR$(value_configuration, configuration, srcInfo,
                       ChannelMediaInfo)
        GET_VALUE_ARR$(value_configuration, configuration, destInfos, destCount,
                       ChannelMediaInfo)
        error_code = rtc_engine()->startChannelMediaRelay(configuration);
        break;
      }
      case kEngineUpdateChannelMediaRelay: {
        ChannelMediaRelayConfiguration configuration;
        GET_VALUE_OBJ$(document, configuration)
        GET_VALUE_PTR$(value_configuration, configuration, srcInfo,
                       ChannelMediaInfo)
        GET_VALUE_ARR$(value_configuration, configuration, destInfos, destCount,
                       ChannelMediaInfo)
        error_code = rtc_engine()->updateChannelMediaRelay(configuration);
        break;
      }
      case kEngineStopChannelMediaRelay: {
        error_code = rtc_engine()->stopChannelMediaRelay();
        break;
      }
      case kEngineRemoveInjectStreamUrl: {
        const char *url;
        GET_VALUE$(document, url, const char *)
        error_code = rtc_engine()->removeInjectStreamUrl(url);
        break;
      }
      case kEngineGetConnectionState: {
        error_code = rtc_engine()->getConnectionState();
        break;
      }
      case kEngineEnableRemoteSuperResolution: {
        unsigned int userId;
        GET_VALUE$(document, userId, unsigned int)
        bool enable;
        GET_VALUE$(document, enable, bool)
        error_code = rtc_engine()->enableRemoteSuperResolution(userId, enable);
        break;
      }
      case kEngineRegisterMediaMetadataObserver: {
        IMetadataObserver::METADATA_TYPE type;
        GET_VALUE_UINT$(document, type, IMetadataObserver::METADATA_TYPE)
        error_code = rtc_engine()->registerMediaMetadataObserver(
            metadata_observer_, type);
        break;
      }
      case kEngineUnRegisterMediaMetadataObserver: {
        IMetadataObserver::METADATA_TYPE type;
        GET_VALUE_UINT$(document, type, IMetadataObserver::METADATA_TYPE)
        error_code = rtc_engine()->registerMediaMetadataObserver(nullptr, type);
        break;
      }
      case kEngineSetMaxMetadataSize: {
        int size;
        GET_VALUE$(document, size, int)
        error_code = metadata_observer_->SetMaxMetadataSize(size);
        break;
      }
      case kEngineSetParameters: {
        const char *parameters;
        GET_VALUE$(document, parameters, const char *)
        error_code = rtc_engine()->setParameters(parameters);
        break;
      }
      case kEngineEnableEncryption: {
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        EncryptionConfig config;
        GET_VALUE_DEF_OBJ$(document, config)
        error_code = rtc_engine()->enableEncryption(enabled, config);
        break;
      }
      case kEngineSendCustomReportMessage: {
        const char *id;
        GET_VALUE$(document, id, const char *)
        const char *category;
        GET_VALUE$(document, category, const char *)
        const char *event;
        GET_VALUE$(document, event, const char *)
        const char *label;
        GET_VALUE$(document, label, const char *)
        int value;
        GET_VALUE$(document, value, int)
        error_code = rtc_engine()->sendCustomReportMessage(id, category, event,
                                                           label, value);
        break;
      }
      case kEngineSetAppType: {
        AppType appType;
        GET_VALUE_UINT$(document, appType, AppType)
        auto engine = reinterpret_cast<IRtcEngine3 *>(rtc_engine());
        error_code = engine->setAppType(appType);
        break;
      }
      case kMediaSetExternalVideoSource: {
        bool enable;
        GET_VALUE$(document, enable, bool)
        bool useTexture;
        GET_VALUE$(document, useTexture, bool)
        util::AutoPtr<IMediaEngine> media_engine;
        media_engine.queryInterface(rtc_engine(), AGORA_IID_MEDIA_ENGINE);
        if (media_engine) {
          error_code = media_engine->setExternalVideoSource(enable, useTexture);
        }
        break;
      }
      default: {
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
        break;
      }
    }

    return error_code;
  }

  int CallApi(ApiTypeEngine api_type, const char *params, void *buffer,
              char result[kBasicResultLength]) {
    int error_code = -ERROR_CODE_TYPE::ERR_FAILED;
    Document document;
    document.Parse(params);

    switch (api_type) {
      case kEngineRegisterPacketObserver: {
        error_code = rtc_engine()->registerPacketObserver(
            reinterpret_cast<IPacketObserver *>(buffer));
        break;
      }
      case kEngineSendStreamMessage: {
        int streamId;
        GET_VALUE$(document, streamId, int)
        size_t length;
        GET_VALUE_UINT$(document, length, size_t)
        error_code = rtc_engine()->sendStreamMessage(
            streamId, reinterpret_cast<char *>(buffer), length);
        break;
      }
      case kEngineSendMetadata: {
        IMetadataObserver::Metadata metadata{};
        GET_VALUE_OBJ$(document, metadata)
        metadata.buffer = reinterpret_cast<unsigned char *>(buffer);
        error_code = metadata_observer_->SendMetadata(metadata);
        break;
      }
      case kMediaPushAudioFrame: {
        IAudioFrameObserver::AudioFrame frame{};
        GET_VALUE_OBJ$(document, frame)
        frame.buffer = buffer;
        util::AutoPtr<IMediaEngine> media_engine;
        media_engine.queryInterface(rtc_engine(), AGORA_IID_MEDIA_ENGINE);
        if (media_engine) {
          try {
            MEDIA_SOURCE_TYPE type;
            GET_VALUE_UINT$(document, type, MEDIA_SOURCE_TYPE)
            bool wrap;
            GET_VALUE$(document, wrap, bool)
            error_code = media_engine->pushAudioFrame(type, &frame, wrap);
          } catch (std::invalid_argument &) {
            error_code = media_engine->pushAudioFrame(&frame);
          }
        }
        break;
      }
      case kMediaPullAudioFrame: {
        IAudioFrameObserver::AudioFrame frame{};
        util::AutoPtr<IMediaEngine> media_engine;
        media_engine.queryInterface(rtc_engine(), AGORA_IID_MEDIA_ENGINE);
        if (media_engine) {
          error_code = media_engine->pullAudioFrame(&frame);
          memcpy(buffer, frame.buffer,
                 frame.samples * frame.channels * frame.bytesPerSample);
          Value value(rapidjson::kObjectType);
          JsonEncode(document, value, frame);
          strcpy(result, ToJsonString(value).c_str());
        }
        break;
      }
      case kMediaPushVideoFrame: {
        ExternalVideoFrame frame{};
        GET_VALUE_OBJ$(document, frame)
        frame.buffer = buffer;
        util::AutoPtr<IMediaEngine> media_engine;
        media_engine.queryInterface(rtc_engine(), AGORA_IID_MEDIA_ENGINE);
        if (media_engine) { error_code = media_engine->pushVideoFrame(&frame); }
        break;
      }
      default: {
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
        break;
      }
    }

    return error_code;
  }

  IrisRtcDeviceManager *device_manager() { return device_manager_; }

  IrisRtcChannel *channel() { return channel_; }

  IrisRtcRawData *raw_data() { return raw_data_; }

 private:
  IRtcEngine *rtc_engine() {
    if (rtc_engine_proxy_) return rtc_engine_proxy_;
    if (!rtc_engine_) { rtc_engine_ = createAgoraRtcEngine(); }
    return rtc_engine_;
  }

 public:
  IRtcEngine *rtc_engine_proxy_;

 private:
  IRtcEngine *rtc_engine_;
  RtcEngineEventHandler *rtc_engine_event_handler_;
  RtcMetadataObserver *metadata_observer_;
  IrisRtcDeviceManager *device_manager_;
  IrisRtcChannel *channel_;
  IrisRtcRawData *raw_data_;
};

IrisRtcEngine::IrisRtcEngine()
    : engine_(new IrisRtcEngineImpl), proxy_(nullptr) {}

IrisRtcEngine::~IrisRtcEngine() {
  if (engine_) {
    delete engine_;
    engine_ = nullptr;
  }
}

void IrisRtcEngine::SetEventHandler(IrisEventHandler *event_handler) {
  engine_->SetEventHandler(event_handler);
}

void IrisRtcEngine::SetProxy(IrisProxy *proxy) { proxy_ = proxy; }

int IrisRtcEngine::CallApi(ApiTypeEngine api_type, const char *params,
                           char result[kBasicResultLength]) {
  if (proxy_) { return proxy_->CallApi(api_type, params, result); }
  return engine_->CallApi(api_type, params, result);
}

int IrisRtcEngine::CallApi(ApiTypeEngine api_type, const char *params,
                           void *buffer, char result[kBasicResultLength]) {
  if (proxy_) { return proxy_->CallApi(api_type, params, buffer, result); }
  return engine_->CallApi(api_type, params, buffer, result);
}

IrisRtcDeviceManager *IrisRtcEngine::device_manager() {
  return engine_->device_manager();
}

IrisRtcChannel *IrisRtcEngine::channel() { return engine_->channel(); }

IrisRtcRawData *IrisRtcEngine::raw_data() { return engine_->raw_data(); }

void IrisRtcEngine::EnableTest(IRtcEngine *engine) {
  engine_->rtc_engine_proxy_ = engine;
}
}// namespace rtc
}// namespace iris
}// namespace agora
