//
//  encoder_data.cpp
//  agora_node_ext
//
//  Created by Jerry-Luo on 2022/4/20.
//
#include "decode_data.hpp"

void decodeChannelMediaOptions(ChannelMediaOptions &option, std::string &token,
                               const Nan::FunctionCallbackInfo<Value> &args,
                               const Local<Object> &value) {
  Isolate *isolate = args.GetIsolate();
  napi_status status = napi_invalid_arg;

  // publishCameraTrack;//1
  bool publishCameraTrack = false;
  status = napi_get_object_property_bool_(isolate, value, "publishCameraTrack",
                                          publishCameraTrack);
  if (status == napi_ok) {
    option.publishCameraTrack = publishCameraTrack;
  }

  // publishSecondaryCameraTrack;//2
  bool publishSecondaryCameraTrack = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "publishSecondaryCameraTrack",
                                          publishSecondaryCameraTrack);
  if (status == napi_ok) {
    option.publishSecondaryCameraTrack = publishSecondaryCameraTrack;
  }

  //publishTertiaryCameraTrack;//3
  bool publishTertiaryCameraTrack = false;
  status = napi_get_object_property_bool_(isolate, value,
  "publishTertiaryCameraTrack", publishTertiaryCameraTrack); if (status ==
  napi_ok) {
    option.publishTertiaryCameraTrack = publishTertiaryCameraTrack;
  }

  //publishQuaternaryCameraTrack;//4
  bool publishQuaternaryCameraTrack = false;
  status = napi_get_object_property_bool_(isolate, value,
  "publishQuaternaryCameraTrack", publishQuaternaryCameraTrack); if (status
  == napi_ok) {
    option.publishQuaternaryCameraTrack = publishQuaternaryCameraTrack;
  }

  // publishAudioTrack;//5
  bool publishAudioTrack = false;
  status = napi_get_object_property_bool_(isolate, value, "publishAudioTrack",
                                          publishAudioTrack);
  if (status == napi_ok) {
    option.publishAudioTrack = publishAudioTrack;
  }

  // publishScreenTrack;//6
  bool publishScreenTrack = false;
  status = napi_get_object_property_bool_(isolate, value, "publishScreenTrack",
                                          publishScreenTrack);
  if (status == napi_ok) {
    option.publishScreenTrack = publishScreenTrack;
  }

  // publishSecondaryScreenTrack;//7
  bool publishSecondaryScreenTrack = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "publishSecondaryScreenTrack",
                                          publishSecondaryScreenTrack);
  if (status == napi_ok) {
    option.publishSecondaryScreenTrack = publishSecondaryScreenTrack;
  }

  // publishCustomAudioTrack;//8
  bool publishCustomAudioTrack = false;
  status = napi_get_object_property_bool_(
      isolate, value, "publishCustomAudioTrack", publishCustomAudioTrack);
  if (status == napi_ok) {
    option.publishCustomAudioTrack = publishCustomAudioTrack;
  }

  // publishCustomAudioSourceId;//9
  int32_t publishCustomAudioSourceId = 0;
  status = napi_get_object_property_int32_(
      isolate, value, "publishCustomAudioSourceId", publishCustomAudioSourceId);
  if (status == napi_ok) {
    option.publishCustomAudioSourceId = publishCustomAudioSourceId;
  }

  // publishCustomAudioTrackEnableAec;//10
  bool publishCustomAudioTrackEnableAec = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "publishCustomAudioTrackEnableAec",
                                          publishCustomAudioTrackEnableAec);
  if (status == napi_ok) {
    option.publishCustomAudioTrackEnableAec = publishCustomAudioTrackEnableAec;
  }

  // publishDirectCustomAudioTrack;//11
  bool publishDirectCustomAudioTrack = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "publishDirectCustomAudioTrack",
                                          publishDirectCustomAudioTrack);
  if (status == napi_ok) {
    option.publishDirectCustomAudioTrack = publishDirectCustomAudioTrack;
  }

  // publishCustomAudioTrackAec;//12
  bool publishCustomAudioTrackAec = false;
  status = napi_get_object_property_bool_(
      isolate, value, "publishCustomAudioTrackAec", publishCustomAudioTrackAec);
  if (status == napi_ok) {
    option.publishCustomAudioTrackAec = publishCustomAudioTrackAec;
  }

  // publishCustomVideoTrack;//13
  bool publishCustomVideoTrack = false;
  status = napi_get_object_property_bool_(
      isolate, value, "publishCustomVideoTrack", publishCustomVideoTrack);
  if (status == napi_ok) {
    option.publishCustomVideoTrack = publishCustomVideoTrack;
  }

  // publishEncodedVideoTrack;//14
  bool publishEncodedVideoTrack = false;
  status = napi_get_object_property_bool_(
      isolate, value, "publishEncodedVideoTrack", publishEncodedVideoTrack);
  if (status == napi_ok) {
    option.publishEncodedVideoTrack = publishEncodedVideoTrack;
  }

  // publishMediaPlayerAudioTrack;//15
  bool publishMediaPlayerAudioTrack = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "publishMediaPlayerAudioTrack",
                                          publishMediaPlayerAudioTrack);
  if (status == napi_ok) {
    option.publishMediaPlayerAudioTrack = publishMediaPlayerAudioTrack;
  }

  // publishMediaPlayerVideoTrack;//16
  bool publishMediaPlayerVideoTrack = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "publishMediaPlayerVideoTrack",
                                          publishMediaPlayerVideoTrack);
  if (status == napi_ok) {
    option.publishMediaPlayerVideoTrack = publishMediaPlayerVideoTrack;
  }

  // publishTrancodedVideoTrack;//17
  bool publishTrancodedVideoTrack = false;
  status = napi_get_object_property_bool_(
      isolate, value, "publishTrancodedVideoTrack", publishTrancodedVideoTrack);
  if (status == napi_ok) {
    option.publishTrancodedVideoTrack = publishTrancodedVideoTrack;
  }

  // autoSubscribeAudio;//18
  bool autoSubscribeAudio = false;
  status = napi_get_object_property_bool_(isolate, value, "autoSubscribeAudio",
                                          autoSubscribeAudio);
  if (status == napi_ok) {
    option.autoSubscribeAudio = autoSubscribeAudio;
  }

  // autoSubscribeVideo;//19
  bool autoSubscribeVideo = false;
  status = napi_get_object_property_bool_(isolate, value, "autoSubscribeVideo",
                                          autoSubscribeVideo);
  if (status == napi_ok) {
    option.autoSubscribeVideo = autoSubscribeVideo;
  }

  // enableAudioRecordingOrPlayout;//20
  bool enableAudioRecordingOrPlayout = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "enableAudioRecordingOrPlayout",
                                          enableAudioRecordingOrPlayout);
  if (status == napi_ok) {
    option.enableAudioRecordingOrPlayout = enableAudioRecordingOrPlayout;
  }

  // publishMediaPlayerId;//21
  int32_t publishMediaPlayerId = 0;
  status = napi_get_object_property_int32_(
      isolate, value, "publishMediaPlayerId", publishMediaPlayerId);
  if (status == napi_ok) {
    option.publishMediaPlayerId = publishMediaPlayerId;
  }

  // publishMediaPlayerId;//22
  int32_t clientRoleType = 0;
  status = napi_get_object_property_int32_(isolate, value, "clientRoleType",
                                           clientRoleType);
  if (status == napi_ok) {
    option.clientRoleType = (CLIENT_ROLE_TYPE)clientRoleType;
  }

  // audienceLatencyLevel;//23
  int32_t audienceLatencyLevel = 0;
  status = napi_get_object_property_int32_(
      isolate, value, "audienceLatencyLevel", audienceLatencyLevel);
  if (status == napi_ok) {
    option.audienceLatencyLevel =
        (AUDIENCE_LATENCY_LEVEL_TYPE)audienceLatencyLevel;
  }

  // defaultVideoStreamType;//24
  int32_t defaultVideoStreamType = 0;
  status = napi_get_object_property_int32_(
      isolate, value, "defaultVideoStreamType", defaultVideoStreamType);
  if (status == napi_ok) {
    option.defaultVideoStreamType = (VIDEO_STREAM_TYPE)defaultVideoStreamType;
  }

  // channelProfile;//25
  int32_t channelProfile = 0;
  status = napi_get_object_property_int32_(isolate, value, "channelProfile",
                                           channelProfile);
  if (status == napi_ok) {
    option.channelProfile = (CHANNEL_PROFILE_TYPE)channelProfile;
  }

  // audioDelayMs;//26
  int32_t audioDelayMs = 0;
  status = napi_get_object_property_int32_(isolate, value, "audioDelayMs",
                                           audioDelayMs);
  if (status == napi_ok) {
    option.audioDelayMs = audioDelayMs;
  }

  // mediaPlayerAudioDelayMs;//27
  int32_t mediaPlayerAudioDelayMs = 0;
  status = napi_get_object_property_int32_(
      isolate, value, "mediaPlayerAudioDelayMs", mediaPlayerAudioDelayMs);
  if (status == napi_ok) {
    option.mediaPlayerAudioDelayMs = mediaPlayerAudioDelayMs;
  }

  // token;//28
  NodeString tokenNodeString;
  status = napi_get_object_property_nodestring_(isolate, value, "token",
                                                tokenNodeString);
  if (status == napi_ok && tokenNodeString) {
    token = std::string(tokenNodeString);
    option.token = token.c_str();
  }

  // enableBuiltInMediaEncryption;29
  bool enableBuiltInMediaEncryption = false;
  status = napi_get_object_property_bool_(isolate, value,
                                          "enableBuiltInMediaEncryption",
                                          enableBuiltInMediaEncryption);
  if (status == napi_ok) {
    option.enableBuiltInMediaEncryption = enableBuiltInMediaEncryption;
  }

  // publishRhythmPlayerTrack;//30
  bool publishRhythmPlayerTrack = false;
  status = napi_get_object_property_bool_(
      isolate, value, "publishRhythmPlayerTrack", publishRhythmPlayerTrack);
  if (status == napi_ok) {
    option.publishRhythmPlayerTrack = publishRhythmPlayerTrack;
  }

  // isInteractiveAudience;//31
  bool isInteractiveAudience = false;
  status = napi_get_object_property_bool_(
      isolate, value, "isInteractiveAudience", isInteractiveAudience);
  if (status == napi_ok) {
    option.isInteractiveAudience = isInteractiveAudience;
  }

  Local<Object> encodedVideoTrackOptionObj;
  status = napi_get_object_property_object_(
      isolate, value, "encodedVideoTrackOption", encodedVideoTrackOptionObj);
  if (status == napi_ok && encodedVideoTrackOptionObj->IsObject()) {
    // Optional<TCcMode> ccMode;
    // Optional<VIDEO_CODEC_TYPE> codecType;
    // Optional<int> targetBitrate;

    int32_t ccMode = 0;
    status = napi_get_object_property_int32_(
        isolate, encodedVideoTrackOptionObj, "ccMode", ccMode);
    if (status == napi_ok) {
      option.encodedVideoTrackOption.ccMode = (TCcMode)ccMode;
    }

    int32_t codecType = 0;
    status = napi_get_object_property_int32_(
        isolate, encodedVideoTrackOptionObj, "codecType", codecType);
    if (status == napi_ok) {
      option.encodedVideoTrackOption.codecType = (VIDEO_CODEC_TYPE)codecType;
    }

    int32_t targetBitrate = 0;
    status = napi_get_object_property_int32_(
        isolate, encodedVideoTrackOptionObj, "targetBitrate", targetBitrate);
    if (status == napi_ok) {
      option.encodedVideoTrackOption.targetBitrate = targetBitrate;
    }
  }

  Local<Object> audioOptionsAdvancedObj;
  status = napi_get_object_property_object_(
      isolate, value, "audioOptionsAdvanced", audioOptionsAdvancedObj);
  if (status == napi_ok && audioOptionsAdvancedObj->IsObject()) {
    // Optional<bool> enable_aec_external_custom_;
    // Optional<bool> enable_aec_external_loopback_;

    bool enable_aec_external_custom_ = 0;
    status = napi_get_object_property_bool_(isolate, audioOptionsAdvancedObj,
                                            "enable_aec_external_custom_",
                                            enable_aec_external_custom_);
    if (status == napi_ok) {
      option.audioOptionsAdvanced.enable_aec_external_custom_ =
          enable_aec_external_custom_;
    }

    bool enable_aec_external_loopback_ = 0;
    status = napi_get_object_property_bool_(isolate, audioOptionsAdvancedObj,
                                            "enable_aec_external_loopback_",
                                            enable_aec_external_loopback_);
    if (status == napi_ok) {
      option.audioOptionsAdvanced.enable_aec_external_loopback_ =
          enable_aec_external_loopback_;
    }
  }

  // Optional<bool> publishCameraTrack; 1
  // Optional<bool> publishSecondaryCameraTrack; 2
  // Optional<bool> publishTertiaryCameraTrack;3
  // Optional<bool> publishQuaternaryCameraTrack;4
  // Optional<bool> publishAudioTrack;5
  // Optional<bool> publishScreenTrack;6
  // Optional<bool> publishSecondaryScreenTrack;7
  // Optional<bool> publishCustomAudioTrack;8
  // Optional<int> publishCustomAudioSourceId;//9
  // Optional<bool> publishCustomAudioTrackEnableAec;//10
  // Optional<bool> publishDirectCustomAudioTrack;//11
  // Optional<bool> publishCustomAudioTrackAec;//12
  // Optional<bool> publishCustomVideoTrack;//13
  // Optional<bool> publishEncodedVideoTrack;//14
  // Optional<bool> publishMediaPlayerAudioTrack;//15
  // Optional<bool> publishMediaPlayerVideoTrack;//16
  // Optional<bool> publishTrancodedVideoTrack;//17
  // Optional<bool> autoSubscribeAudio;//18
  // Optional<bool> autoSubscribeVideo;//19
  // Optional<bool> enableAudioRecordingOrPlayout;//20
  // Optional<int> publishMediaPlayerId;//21
  // Optional<CLIENT_ROLE_TYPE> clientRoleType;//22
  // Optional<AUDIENCE_LATENCY_LEVEL_TYPE> audienceLatencyLevel;//23
  // Optional<VIDEO_STREAM_TYPE> defaultVideoStreamType;//24
  // Optional<CHANNEL_PROFILE_TYPE> channelProfile;//25
  // Optional<int> audioDelayMs;//26
  // Optional<int> mediaPlayerAudioDelayMs;//27
  // Optional<const char*> token;//28
  // Optional<bool> enableBuiltInMediaEncryption;29
  // Optional<bool> publishRhythmPlayerTrack;//30
  // Optional<bool> isInteractiveAudience;//31
  // EncodedVideoTrackOptions encodedVideoTrackOption;//32
  // AudioOptionsAdvanced audioOptionsAdvanced;//33
}

void decodeVideoEncoderConfiguration(
    VideoEncoderConfiguration &config, napi_status &status,
    const Nan::FunctionCallbackInfo<Value> &args, const Local<Object> &value) {

  Isolate *isolate = args.GetIsolate();
  status = napi_invalid_arg;

  if (!value->IsObject() || value->IsUndefined()) {
    status = napi_invalid_arg;
    return;
  }

  int32_t codecType = 0;
  status =
      napi_get_object_property_int32_(isolate, value, "codecType", codecType);
  if (status != napi_ok) {
    return;
  }
  config.codecType = (VIDEO_CODEC_TYPE)codecType;

  Local<Object> dimensionsObj;
  status = napi_get_object_property_object_(isolate, value, "dimensions",
                                            dimensionsObj);
  if (status != napi_ok) {
    return;
  } else {
    status = napi_get_object_property_int32_(isolate, dimensionsObj, "width",
                                             config.dimensions.width);
    if (status != napi_ok) {
      return;
    }
    status = napi_get_object_property_int32_(isolate, dimensionsObj, "height",
                                             config.dimensions.height);
    if (status != napi_ok) {
      return;
    }
  }

  status = napi_get_object_property_int32_(isolate, value, "frameRate",
                                           config.frameRate);
  if (status != napi_ok) {
    return;
  }

  status = napi_get_object_property_int32_(isolate, value, "bitrate",
                                           config.bitrate);
  if (status != napi_ok) {
    return;
  }

  status = napi_get_object_property_int32_(isolate, value, "minBitrate",
                                           config.minBitrate);
  if (status != napi_ok) {
    return;
  }

  int32_t orientationMode = 0;
  status = napi_get_object_property_int32_(isolate, value, "orientationMode",
                                           orientationMode);
  if (status != napi_ok) {
    return;
  }

  config.orientationMode = (ORIENTATION_MODE)orientationMode;

  int32_t degradationPreference = 0;
  status = napi_get_object_property_int32_(
      isolate, value, "degradationPreference", degradationPreference);
  if (status != napi_ok) {
    return;
  }

  config.degradationPreference = (DEGRADATION_PREFERENCE)degradationPreference;

  int32_t mirrorMode = 0;
  status =
      napi_get_object_property_int32_(isolate, value, "mirrorMode", mirrorMode);
  if (status != napi_ok) {
    return;
  }

  config.mirrorMode = (VIDEO_MIRROR_MODE_TYPE)mirrorMode;
}

void decodeRtcConnection(RtcConnection &connection, std::string &channelId,
                         napi_status &status,
                         const Nan::FunctionCallbackInfo<Value> &args,
                         const Local<Object> &value) {
  Isolate *isolate = args.GetIsolate();
  status = napi_invalid_arg;

  if (!value->IsObject() || value->IsUndefined()) {
    status = napi_invalid_arg;
    return;
  }
  nodestring channel;
  status = napi_get_object_property_nodestring_(isolate, value, "channelId",
                                                channel);
  if (status != napi_ok) {
    return;
  }
  channelId = std::string(channel);

  connection.channelId = channelId.c_str();

  status = napi_get_object_property_uint32_(isolate, value, "localUid",
                                            connection.localUid);
  if (status != napi_ok) {
    return;
  }
}
void decodeStreamConfig(SimulcastStreamConfig &config,
                        napi_status &status,
                        const Nan::FunctionCallbackInfo<Value> &args,
                        const Local<Object> &value) {
  Isolate *isolate = args.GetIsolate();
  
  Local<Object> dimensionsObj;
  status = napi_get_object_property_object_(isolate, value, "dimensions",
                                            dimensionsObj);
  if (status != napi_ok) {
    return;
  } else {
    status = napi_get_object_property_int32_(isolate, dimensionsObj, "width",
                                             config.dimensions.width);
    if (status != napi_ok) {
      return;
    }
    status = napi_get_object_property_int32_(isolate, dimensionsObj, "height",
                                             config.dimensions.height);
    if (status != napi_ok) {
      return;
    }
  }

  status = napi_get_object_property_int32_(isolate, value, "bitrate",
                                            config.bitrate);
  status = napi_get_object_property_int32_(isolate, value, "framerate",
                                            config.framerate);
  if (status != napi_ok) {
    return;
  }
}
