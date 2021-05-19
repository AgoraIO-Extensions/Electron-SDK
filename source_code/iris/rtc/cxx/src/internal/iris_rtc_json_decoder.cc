//
// Created by LXH on 2021/1/15.
//

#include "internal/iris_rtc_json_decoder.h"
#include "internal/iris_json_utils.h"

#define GET_VALUE_DEF$(val, obj, key) GET_VALUE_DEF(val, key, (obj).key)

#define GET_VALUE_DEF_UINT$(val, obj, key, type)                               \
  GET_VALUE_DEF_UINT(val, key, (obj).key, type)

#define GET_VALUE_DEF_CHAR$(val, obj, key)                                     \
  GET_VALUE_DEF_CHAR(val, key, (obj).key)

#define GET_VALUE_DEF_OBJ$(val, obj, key) GET_VALUE_DEF_OBJ(val, key, (obj).key)

#define GET_VALUE$(val, obj, key, type) GET_VALUE(val, key, (obj).key, type)

#define GET_VALUE_UINT$(val, obj, key, type)                                   \
  GET_VALUE_UINT(val, key, (obj).key, type)

#define GET_VALUE_CHAR$(val, obj, key) GET_VALUE_CHAR(val, key, (obj).key)

#define GET_VALUE_OBJ$(val, obj, key) GET_VALUE_OBJ(val, key, (obj).key)

namespace agora {
using namespace rtc;
using namespace media;

namespace iris {
namespace rtc {
using rapidjson::Value;

void JsonDecode(const Value &value,
                IAudioFrameObserver::AudioFrame &audio_frame, void *buffer) {
  GET_VALUE_UINT$(value, audio_frame, type,
                  IAudioFrameObserver::AUDIO_FRAME_TYPE)
  GET_VALUE$(value, audio_frame, samples, int)
  GET_VALUE$(value, audio_frame, bytesPerSample, int)
  GET_VALUE$(value, audio_frame, channels, int)
  GET_VALUE$(value, audio_frame, samplesPerSec, int)
  audio_frame.buffer = buffer;
  GET_VALUE$(value, audio_frame, renderTimeMs, int64_t)
  GET_VALUE$(value, audio_frame, avsync_type, int)
}

void JsonDecode(const Value &value,
                IVideoFrameObserver::VideoFrame &video_frame, void *yBuffer,
                void *uBuffer, void *vBuffer) {
  GET_VALUE_UINT$(value, video_frame, type,
                  IVideoFrameObserver::VIDEO_FRAME_TYPE)
  GET_VALUE$(value, video_frame, width, int)
  GET_VALUE$(value, video_frame, height, int)
  GET_VALUE$(value, video_frame, yStride, int)
  GET_VALUE$(value, video_frame, uStride, int)
  GET_VALUE$(value, video_frame, vStride, int)
  video_frame.yBuffer = yBuffer;
  video_frame.uBuffer = uBuffer;
  video_frame.vBuffer = vBuffer;
  GET_VALUE$(value, video_frame, rotation, int)
  GET_VALUE$(value, video_frame, renderTimeMs, int64_t)
  GET_VALUE$(value, video_frame, avsync_type, int)
}

void JsonDecode(const Value &value,
                ExternalVideoRenerContext &external_video_rener_context,
                IExternalVideoRenderCallback *external_video_render_callback) {
  external_video_rener_context.renderCallback = external_video_render_callback;
  GET_VALUE_UINT$(value, external_video_rener_context, view, void *)
  GET_VALUE_UINT$(value, external_video_rener_context, renderMode,
                  RENDER_MODE_TYPE)
  GET_VALUE$(value, external_video_rener_context, zOrder, int)
  GET_VALUE$(value, external_video_rener_context, left, float)
  GET_VALUE$(value, external_video_rener_context, top, float)
  GET_VALUE$(value, external_video_rener_context, right, float)
  GET_VALUE$(value, external_video_rener_context, bottom, float)
}

void JsonDecode(const Value &value, ExternalVideoFrame &external_video_frame,
                void *buffer) {
  GET_VALUE_UINT$(value, external_video_frame, type,
                  ExternalVideoFrame::VIDEO_BUFFER_TYPE)
  GET_VALUE_UINT$(value, external_video_frame, format,
                  ExternalVideoFrame::VIDEO_PIXEL_FORMAT)
  external_video_frame.buffer = buffer;
  GET_VALUE$(value, external_video_frame, stride, int)
  GET_VALUE$(value, external_video_frame, height, int)
  GET_VALUE_DEF$(value, external_video_frame, cropLeft)
  GET_VALUE_DEF$(value, external_video_frame, cropTop)
  GET_VALUE_DEF$(value, external_video_frame, cropRight)
  GET_VALUE_DEF$(value, external_video_frame, cropBottom)
  GET_VALUE_DEF$(value, external_video_frame, rotation)
  GET_VALUE$(value, external_video_frame, timestamp, int64_t)
}

void JsonDecode(const Value &value,
                ChannelMediaOptions &channel_media_options) {
  GET_VALUE_DEF$(value, channel_media_options, autoSubscribeAudio)
  GET_VALUE_DEF$(value, channel_media_options, autoSubscribeVideo)
}

void JsonDecode(const Value &value,
                LastmileProbeOneWayResult &lastmile_probe_one_way_result) {
  GET_VALUE$(value, lastmile_probe_one_way_result, packetLossRate, unsigned int)
  GET_VALUE$(value, lastmile_probe_one_way_result, jitter, unsigned int)
  GET_VALUE$(value, lastmile_probe_one_way_result, availableBandwidth,
             unsigned int)
}

void JsonDecode(const Value &value,
                LastmileProbeResult &lastmile_probe_result) {
  GET_VALUE_UINT$(value, lastmile_probe_result, state,
                  LASTMILE_PROBE_RESULT_STATE)
  GET_VALUE_OBJ$(value, lastmile_probe_result, uplinkReport)
  GET_VALUE_OBJ$(value, lastmile_probe_result, downlinkReport)
  GET_VALUE$(value, lastmile_probe_result, rtt, unsigned int)
}

void JsonDecode(const Value &value,
                LastmileProbeConfig &lastmile_probe_config) {
  GET_VALUE$(value, lastmile_probe_config, probeUplink, bool)
  GET_VALUE$(value, lastmile_probe_config, probeDownlink, bool)
  GET_VALUE$(value, lastmile_probe_config, expectedUplinkBitrate, unsigned int)
  GET_VALUE$(value, lastmile_probe_config, expectedDownlinkBitrate,
             unsigned int)
}

void JsonDecode(const Value &value, AudioVolumeInfo &audio_volume_info) {
  GET_VALUE$(value, audio_volume_info, uid, unsigned int)
  GET_VALUE$(value, audio_volume_info, volume, unsigned int)
  GET_VALUE$(value, audio_volume_info, vad, unsigned int)
  GET_VALUE_DEF_CHAR$(value, audio_volume_info, channelId)
}

void JsonDecode(const Value &value, ClientRoleOptions &client_role_options) {
  GET_VALUE_DEF_UINT$(value, client_role_options, audienceLatencyLevel,
                      AUDIENCE_LATENCY_LEVEL_TYPE)
}

void JsonDecode(const Value &value, RtcStats &rtc_stats) {
  GET_VALUE$(value, rtc_stats, duration, unsigned int)
  GET_VALUE$(value, rtc_stats, txBytes, unsigned int)
  GET_VALUE$(value, rtc_stats, rxBytes, unsigned int)
  GET_VALUE$(value, rtc_stats, txAudioBytes, unsigned int)
  GET_VALUE$(value, rtc_stats, txVideoBytes, unsigned int)
  GET_VALUE$(value, rtc_stats, rxAudioBytes, unsigned int)
  GET_VALUE$(value, rtc_stats, rxVideoBytes, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, txKBitRate, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, rxKBitRate, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, rxAudioKBitRate, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, txAudioKBitRate, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, rxVideoKBitRate, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, txVideoKBitRate, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, lastmileDelay, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, txPacketLossRate, unsigned int)
  GET_VALUE_UINT$(value, rtc_stats, rxPacketLossRate, unsigned int)
  GET_VALUE$(value, rtc_stats, userCount, unsigned int)
  GET_VALUE$(value, rtc_stats, cpuAppUsage, double)
  GET_VALUE$(value, rtc_stats, cpuTotalUsage, double)
  GET_VALUE$(value, rtc_stats, gatewayRtt, int)
  GET_VALUE$(value, rtc_stats, memoryAppUsageRatio, double)
  GET_VALUE$(value, rtc_stats, memoryTotalUsageRatio, double)
  GET_VALUE$(value, rtc_stats, memoryAppUsageInKbytes, int)
}

void JsonDecode(const Value &value, LocalVideoStats &local_video_stats) {
  GET_VALUE$(value, local_video_stats, sentBitrate, int)
  GET_VALUE$(value, local_video_stats, sentFrameRate, int)
  GET_VALUE$(value, local_video_stats, encoderOutputFrameRate, int)
  GET_VALUE$(value, local_video_stats, rendererOutputFrameRate, int)
  GET_VALUE$(value, local_video_stats, targetBitrate, int)
  GET_VALUE$(value, local_video_stats, targetFrameRate, int)
  GET_VALUE_UINT$(value, local_video_stats, qualityAdaptIndication,
                  QUALITY_ADAPT_INDICATION)
  GET_VALUE$(value, local_video_stats, encodedBitrate, int)
  GET_VALUE$(value, local_video_stats, encodedFrameWidth, int)
  GET_VALUE$(value, local_video_stats, encodedFrameHeight, int)
  GET_VALUE$(value, local_video_stats, encodedFrameCount, int)
  GET_VALUE_UINT$(value, local_video_stats, codecType, VIDEO_CODEC_TYPE)
  GET_VALUE_UINT$(value, local_video_stats, txPacketLossRate, unsigned int)
  GET_VALUE$(value, local_video_stats, captureFrameRate, int)
  GET_VALUE_UINT$(value, local_video_stats, captureBrightnessLevel,
                  CAPTURE_BRIGHTNESS_LEVEL_TYPE)
}

void JsonDecode(const Value &value, RemoteVideoStats &remote_video_stats) {
  GET_VALUE$(value, remote_video_stats, uid, unsigned int)
  GET_VALUE$(value, remote_video_stats, delay, int)
  GET_VALUE$(value, remote_video_stats, width, int)
  GET_VALUE$(value, remote_video_stats, height, int)
  GET_VALUE$(value, remote_video_stats, receivedBitrate, int)
  GET_VALUE$(value, remote_video_stats, decoderOutputFrameRate, int)
  GET_VALUE$(value, remote_video_stats, rendererOutputFrameRate, int)
  GET_VALUE$(value, remote_video_stats, packetLossRate, int)
  GET_VALUE_UINT$(value, remote_video_stats, rxStreamType,
                  REMOTE_VIDEO_STREAM_TYPE)
  GET_VALUE$(value, remote_video_stats, totalFrozenTime, int)
  GET_VALUE$(value, remote_video_stats, frozenRate, int)
  GET_VALUE$(value, remote_video_stats, totalActiveTime, int)
  GET_VALUE$(value, remote_video_stats, publishDuration, int)
}

void JsonDecode(const Value &value, LocalAudioStats &local_audio_stats) {
  GET_VALUE$(value, local_audio_stats, numChannels, int)
  GET_VALUE$(value, local_audio_stats, sentSampleRate, int)
  GET_VALUE$(value, local_audio_stats, sentBitrate, int)
  GET_VALUE_UINT$(value, local_audio_stats, txPacketLossRate, unsigned int)
}

void JsonDecode(const Value &value, RemoteAudioStats &remote_audio_stats) {
  GET_VALUE$(value, remote_audio_stats, uid, unsigned int)
  GET_VALUE$(value, remote_audio_stats, quality, int)
  GET_VALUE$(value, remote_audio_stats, networkTransportDelay, int)
  GET_VALUE$(value, remote_audio_stats, jitterBufferDelay, int)
  GET_VALUE$(value, remote_audio_stats, audioLossRate, int)
  GET_VALUE$(value, remote_audio_stats, numChannels, int)
  GET_VALUE$(value, remote_audio_stats, receivedSampleRate, int)
  GET_VALUE$(value, remote_audio_stats, receivedBitrate, int)
  GET_VALUE$(value, remote_audio_stats, totalFrozenTime, int)
  GET_VALUE$(value, remote_audio_stats, frozenRate, int)
  GET_VALUE$(value, remote_audio_stats, totalActiveTime, int)
  GET_VALUE$(value, remote_audio_stats, publishDuration, int)
  GET_VALUE$(value, remote_audio_stats, qoeQuality, int)
  GET_VALUE$(value, remote_audio_stats, qualityChangedReason, int)
  GET_VALUE$(value, remote_audio_stats, mosValue, int)
}

void JsonDecode(const Value &value, VideoDimensions &video_dimensions) {
  GET_VALUE_DEF$(value, video_dimensions, width)
  GET_VALUE_DEF$(value, video_dimensions, height)
}

void JsonDecode(const Value &value,
                VideoEncoderConfiguration &video_encoder_configuration) {
  GET_VALUE_DEF_OBJ$(value, video_encoder_configuration, dimensions)
  GET_VALUE_DEF_UINT$(value, video_encoder_configuration, frameRate, FRAME_RATE)
  GET_VALUE_DEF$(value, video_encoder_configuration, minFrameRate)
  GET_VALUE_DEF$(value, video_encoder_configuration, bitrate)
  GET_VALUE_DEF$(value, video_encoder_configuration, minBitrate)
  GET_VALUE_DEF_UINT$(value, video_encoder_configuration, orientationMode,
                      ORIENTATION_MODE)
  GET_VALUE_DEF_UINT$(value, video_encoder_configuration, degradationPreference,
                      DEGRADATION_PREFERENCE)
  GET_VALUE_DEF_UINT$(value, video_encoder_configuration, mirrorMode,
                      VIDEO_MIRROR_MODE_TYPE)
}

void JsonDecode(const Value &value, TranscodingUser &transcoding_user) {
  GET_VALUE$(value, transcoding_user, uid, unsigned int)
  GET_VALUE_DEF$(value, transcoding_user, x)
  GET_VALUE_DEF$(value, transcoding_user, y)
  GET_VALUE$(value, transcoding_user, width, int)
  GET_VALUE$(value, transcoding_user, height, int)
  GET_VALUE_DEF$(value, transcoding_user, zOrder)
  GET_VALUE_DEF$(value, transcoding_user, alpha)
  GET_VALUE_DEF$(value, transcoding_user, audioChannel)
}

void JsonDecode(const Value &value,
                std::vector<TranscodingUser> &transcoding_user_list) {
  for (auto &it : value.GetArray()) {
    TranscodingUser transcoding_user;
    JsonDecode(it, transcoding_user);
    transcoding_user_list.push_back(transcoding_user);
  }
}

void JsonDecode(const Value &value, RtcImage &rtc_image) {
  GET_VALUE$(value, rtc_image, url, const char *)
  GET_VALUE_DEF$(value, rtc_image, x)
  GET_VALUE_DEF$(value, rtc_image, y)
  GET_VALUE$(value, rtc_image, width, int)
  GET_VALUE$(value, rtc_image, height, int)
}

void JsonDecode(const Value &value,
                LiveStreamAdvancedFeature &live_stream_advanced_feature) {
  GET_VALUE$(value, live_stream_advanced_feature, featureName, const char *)
  GET_VALUE_DEF$(value, live_stream_advanced_feature, opened)
}

void JsonDecode(
    const Value &value,
    std::vector<LiveStreamAdvancedFeature> &live_stream_advanced_feature_list) {
  for (auto &it : value.GetArray()) {
    LiveStreamAdvancedFeature live_stream_advanced_feature;
    JsonDecode(it, live_stream_advanced_feature);
    live_stream_advanced_feature_list.push_back(live_stream_advanced_feature);
  }
}

void JsonDecode(const Value &value, LiveTranscoding &live_transcoding,
                TranscodingUser *transcoding_users, int user_count,
                RtcImage *watermark, RtcImage *background_image,
                LiveStreamAdvancedFeature *advanced_features,
                int feature_count) {
  GET_VALUE_DEF$(value, live_transcoding, width)
  GET_VALUE_DEF$(value, live_transcoding, height)
  GET_VALUE_DEF$(value, live_transcoding, videoBitrate)
  GET_VALUE_DEF$(value, live_transcoding, videoFramerate)
  GET_VALUE_DEF$(value, live_transcoding, lowLatency)
  GET_VALUE_DEF$(value, live_transcoding, videoGop)
  GET_VALUE_DEF_UINT$(value, live_transcoding, videoCodecProfile,
                      VIDEO_CODEC_PROFILE_TYPE)
  GET_VALUE_DEF$(value, live_transcoding, backgroundColor)
  GET_VALUE_DEF_UINT$(value, live_transcoding, videoCodecType,
                      VIDEO_CODEC_TYPE_FOR_STREAM)
  live_transcoding.userCount = user_count;
  live_transcoding.transcodingUsers = transcoding_users;
  GET_VALUE_DEF_CHAR$(value, live_transcoding, transcodingExtraInfo)
  GET_VALUE_DEF_CHAR$(value, live_transcoding, metadata)
  live_transcoding.watermark = watermark;
  live_transcoding.backgroundImage = background_image;
  GET_VALUE_DEF_UINT$(value, live_transcoding, audioSampleRate,
                      AUDIO_SAMPLE_RATE_TYPE)
  GET_VALUE_DEF$(value, live_transcoding, audioBitrate)
  GET_VALUE_DEF$(value, live_transcoding, audioChannels)
  GET_VALUE_DEF_UINT$(value, live_transcoding, audioCodecProfile,
                      AUDIO_CODEC_PROFILE_TYPE)
  live_transcoding.advancedFeatures = advanced_features;
  live_transcoding.advancedFeatureCount = feature_count;
}

void JsonDecode(const Value &value,
                CameraCapturerConfiguration &camera_capturer_configuration) {
  GET_VALUE_DEF_UINT$(value, camera_capturer_configuration, preference,
                      CAPTURER_OUTPUT_PREFERENCE)
  GET_VALUE_DEF$(value, camera_capturer_configuration, captureWidth)
  GET_VALUE_DEF$(value, camera_capturer_configuration, captureHeight)
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
  GET_VALUE_UINT$(value, camera_capturer_configuration, cameraDirection,
                  CAMERA_DIRECTION)
#endif
}

void JsonDecode(const Value &value, DataStreamConfig &data_stream_config) {
  GET_VALUE$(value, data_stream_config, syncWithAudio, bool)
  GET_VALUE$(value, data_stream_config, ordered, bool)
}

void JsonDecode(const Value &value, InjectStreamConfig &inject_stream_config) {
  GET_VALUE_DEF$(value, inject_stream_config, width)
  GET_VALUE_DEF$(value, inject_stream_config, height)
  GET_VALUE_DEF$(value, inject_stream_config, videoGop)
  GET_VALUE_DEF$(value, inject_stream_config, videoFramerate)
  GET_VALUE_DEF$(value, inject_stream_config, videoBitrate)
  GET_VALUE_DEF_UINT$(value, inject_stream_config, audioSampleRate,
                      AUDIO_SAMPLE_RATE_TYPE)
  GET_VALUE_DEF$(value, inject_stream_config, audioBitrate)
  GET_VALUE_DEF$(value, inject_stream_config, audioChannels)
}

void JsonDecode(const Value &value, ChannelMediaInfo &channel_media_info) {
  auto vv = ToJsonString(value);
  GET_VALUE$(value, channel_media_info, channelName, const char *)
  GET_VALUE_DEF_CHAR$(value, channel_media_info, token)
  GET_VALUE$(value, channel_media_info, uid, unsigned int)
}

void JsonDecode(const Value &value,
                std::vector<ChannelMediaInfo> &channel_media_info_list) {
  for (auto &it : value.GetArray()) {
    ChannelMediaInfo channel_media_info{};
    JsonDecode(it, channel_media_info);
    channel_media_info_list.push_back(channel_media_info);
  }
}

void JsonDecode(
    const Value &value,
    ChannelMediaRelayConfiguration &channel_media_relay_configuration,
    ChannelMediaInfo *src_info, ChannelMediaInfo *dest_infos, int count) {
  channel_media_relay_configuration.srcInfo = src_info;
  channel_media_relay_configuration.destInfos = dest_infos;
  channel_media_relay_configuration.destCount = count;
}

void JsonDecode(const Value &value, Rectangle &rectangle) {
  GET_VALUE_DEF$(value, rectangle, x)
  GET_VALUE_DEF$(value, rectangle, y)
  GET_VALUE_DEF$(value, rectangle, width)
  GET_VALUE_DEF$(value, rectangle, height)
}

void JsonDecode(const Value &value, Rect &rect) {
  GET_VALUE_DEF$(value, rect, top)
  GET_VALUE_DEF$(value, rect, left)
  GET_VALUE_DEF$(value, rect, bottom)
  GET_VALUE_DEF$(value, rect, right)
}

void JsonDecode(const Value &value, WatermarkOptions &watermark_options) {
  GET_VALUE_DEF$(value, watermark_options, visibleInPreview)
  GET_VALUE_OBJ$(value, watermark_options, positionInLandscapeMode)
  GET_VALUE_OBJ$(value, watermark_options, positionInPortraitMode)
}

void JsonDecode(const Value &value, std::vector<view_t> view_list) {
  for (auto &it : value.GetArray()) {
    auto view = it.GetUint();
    view_list.push_back(reinterpret_cast<view_t>(view));
  }
}

void JsonDecode(const Value &value,
                ScreenCaptureParameters &screen_capture_parameters,
                view_t *exclude_window_list, int count) {
  GET_VALUE_OBJ$(value, screen_capture_parameters, dimensions)
  GET_VALUE_DEF$(value, screen_capture_parameters, frameRate)
  GET_VALUE_DEF$(value, screen_capture_parameters, bitrate)
  GET_VALUE_DEF$(value, screen_capture_parameters, captureMouseCursor)
  GET_VALUE_DEF$(value, screen_capture_parameters, windowFocus)
  screen_capture_parameters.excludeWindowList = exclude_window_list;
  screen_capture_parameters.excludeWindowCount = count;
}

void JsonDecode(const Value &value, VideoCanvas &video_canvas, void *priv) {
  GET_VALUE_DEF_UINT$(value, video_canvas, view, view_t)
  GET_VALUE_DEF_UINT$(value, video_canvas, renderMode, RENDER_MODE_TYPE)
  GET_VALUE_CHAR$(value, video_canvas, channelId)
  GET_VALUE_DEF$(value, video_canvas, uid)
  video_canvas.priv = priv;
  GET_VALUE_DEF_UINT$(value, video_canvas, mirrorMode, VIDEO_MIRROR_MODE_TYPE)
}

void JsonDecode(const Value &value, BeautyOptions &beauty_options) {
  GET_VALUE_DEF_UINT$(value, beauty_options, lighteningContrastLevel,
                      BeautyOptions::LIGHTENING_CONTRAST_LEVEL)
  GET_VALUE_DEF$(value, beauty_options, lighteningLevel)
  GET_VALUE_DEF$(value, beauty_options, smoothnessLevel)
  GET_VALUE_DEF$(value, beauty_options, rednessLevel)
}

void JsonDecode(const Value &value, UserInfo &user_info) {
  GET_VALUE$(value, user_info, uid, unsigned int)
  GET_VALUE_CHAR$(value, user_info, userAccount)
}

void JsonDecode(const Value &value, LogConfig &log_config) {
  GET_VALUE_DEF_CHAR$(value, log_config, filePath)
  GET_VALUE_DEF$(value, log_config, fileSize)
  GET_VALUE_DEF_UINT$(value, log_config, level, LOG_LEVEL)
}

void JsonDecode(const Value &value, RtcEngineContext &rtc_engine_context,
                IRtcEngineEventHandler *rtc_engine_event_handler) {
  rtc_engine_context.eventHandler = rtc_engine_event_handler;
  GET_VALUE$(value, rtc_engine_context, appId, const char *)
  GET_VALUE_DEF_UINT$(value, rtc_engine_context, context, void *)
  GET_VALUE_DEF$(value, rtc_engine_context, areaCode)
  GET_VALUE_DEF_OBJ$(value, rtc_engine_context, logConfig)
}

void JsonDecode(const Value &value, IMetadataObserver::Metadata &metadata,
                void *buffer) {
  GET_VALUE_DEF$(value, metadata, uid)
  GET_VALUE$(value, metadata, size, unsigned int)
  metadata.buffer = reinterpret_cast<unsigned char *>(buffer);
  GET_VALUE_DEF_UINT$(value, metadata, timeStampMs, long long)
}

void JsonDecode(const Value &value, EncryptionConfig &encryption_config) {
  GET_VALUE_DEF_UINT$(value, encryption_config, encryptionMode, ENCRYPTION_MODE)
  GET_VALUE_DEF_CHAR$(value, encryption_config, encryptionKey)
}
}// namespace rtc
}// namespace iris
}// namespace agora
