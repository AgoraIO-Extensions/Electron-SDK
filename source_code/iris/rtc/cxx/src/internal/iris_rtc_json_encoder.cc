//
// Created by LXH on 2021/1/18.
//

#include "internal/iris_rtc_json_encoder.h"
#include "internal/iris_json_utils.h"

#define SET_VALUE$(doc, val, obj, key) SET_VALUE(doc, val, key, (obj).key)

#define SET_VALUE_CHAR$(doc, val, obj, key)                                    \
  SET_VALUE_CHAR(doc, val, key, (obj).key)

#define SET_VALUE_OBJ$(doc, val, obj, key)                                     \
  SET_VALUE_OBJ(doc, val, key, (obj).key)

#define SET_VALUE_PTR$(doc, val, obj, key)                                     \
  SET_VALUE_PTR(doc, val, key, (obj).key)

#define SET_VALUE_ARR$(doc, val, obj, key, count)                              \
  SET_VALUE_ARR(doc, val, key, (obj).key, (obj).count)

namespace agora {
using namespace rtc;
using namespace media;

namespace iris {
namespace rtc {
using rapidjson::Document;
using rapidjson::Value;

void JsonEncode(Document &document, Value &value,
                const IAudioFrameObserver::AudioFrame &audio_frame) {
  SET_VALUE$(document, value, audio_frame, type)
  SET_VALUE$(document, value, audio_frame, samples)
  SET_VALUE$(document, value, audio_frame, bytesPerSample)
  SET_VALUE$(document, value, audio_frame, channels)
  SET_VALUE$(document, value, audio_frame, samplesPerSec)
  SET_VALUE$(document, value, audio_frame, renderTimeMs)
  SET_VALUE$(document, value, audio_frame, avsync_type)
}

void JsonEncode(Document &document, Value &value,
                const IVideoFrameObserver::VideoFrame &video_frame) {
  SET_VALUE$(document, value, video_frame, type)
  SET_VALUE$(document, value, video_frame, width)
  SET_VALUE$(document, value, video_frame, height)
  SET_VALUE$(document, value, video_frame, yStride)
  SET_VALUE$(document, value, video_frame, uStride)
  SET_VALUE$(document, value, video_frame, vStride)
  SET_VALUE$(document, value, video_frame, rotation)
  SET_VALUE$(document, value, video_frame, renderTimeMs)
  SET_VALUE$(document, value, video_frame, avsync_type)
}

void JsonEncode(Document &document, Value &value,
                const ExternalVideoRenerContext &external_video_rener_context) {
  auto view = reinterpret_cast<int64_t>(external_video_rener_context.view);
  SET_VALUE(document, value, view, view)
  SET_VALUE$(document, value, external_video_rener_context, renderMode)
  SET_VALUE$(document, value, external_video_rener_context, zOrder)
  SET_VALUE$(document, value, external_video_rener_context, left)
  SET_VALUE$(document, value, external_video_rener_context, top)
  SET_VALUE$(document, value, external_video_rener_context, right)
  SET_VALUE$(document, value, external_video_rener_context, bottom)
}

void JsonEncode(Document &document, Value &value,
                const ExternalVideoFrame &external_video_frame) {
  SET_VALUE$(document, value, external_video_frame, type)
  SET_VALUE$(document, value, external_video_frame, format)
  SET_VALUE$(document, value, external_video_frame, stride)
  SET_VALUE$(document, value, external_video_frame, height)
  SET_VALUE$(document, value, external_video_frame, cropLeft)
  SET_VALUE$(document, value, external_video_frame, cropTop)
  SET_VALUE$(document, value, external_video_frame, cropRight)
  SET_VALUE$(document, value, external_video_frame, cropBottom)
  SET_VALUE$(document, value, external_video_frame, rotation)
  int64_t timestamp = external_video_frame.timestamp;
  SET_VALUE(document, value, timestamp, timestamp)
}

void JsonEncode(Document &document, Value &value,
                const ChannelMediaOptions &channel_media_options) {
  SET_VALUE$(document, value, channel_media_options, autoSubscribeAudio)
  SET_VALUE$(document, value, channel_media_options, autoSubscribeVideo)
}

void JsonEncode(
    Document &document, Value &value,
    const LastmileProbeOneWayResult &lastmile_probe_one_way_result) {
  SET_VALUE$(document, value, lastmile_probe_one_way_result, packetLossRate)
  SET_VALUE$(document, value, lastmile_probe_one_way_result, jitter)
  SET_VALUE$(document, value, lastmile_probe_one_way_result, availableBandwidth)
}

void JsonEncode(Document &document, Value &value,
                const LastmileProbeResult &lastmile_probe_result) {
  SET_VALUE$(document, value, lastmile_probe_result, state)
  SET_VALUE_OBJ$(document, value, lastmile_probe_result, uplinkReport)
  SET_VALUE_OBJ$(document, value, lastmile_probe_result, downlinkReport)
  SET_VALUE$(document, value, lastmile_probe_result, rtt)
}

void JsonEncode(Document &document, Value &value,
                const LastmileProbeConfig &lastmile_probe_config) {
  SET_VALUE$(document, value, lastmile_probe_config, probeUplink)
  SET_VALUE$(document, value, lastmile_probe_config, probeDownlink)
  SET_VALUE$(document, value, lastmile_probe_config, expectedUplinkBitrate)
  SET_VALUE$(document, value, lastmile_probe_config, expectedDownlinkBitrate)
}

void JsonEncode(Document &document, Value &value,
                const AudioVolumeInfo &audio_volume_info) {
  SET_VALUE$(document, value, audio_volume_info, uid)
  SET_VALUE$(document, value, audio_volume_info, volume)
  SET_VALUE$(document, value, audio_volume_info, vad)
  SET_VALUE_CHAR$(document, value, audio_volume_info, channelId)
}

void JsonEncode(Document &document, Value &value,
                const AudioVolumeInfo *audio_volume_infos, int count) {
  for (int i = 0; i < count; i++) {
    auto it = audio_volume_infos[i];
    Value audio_volume_info(rapidjson::kObjectType);
    JsonEncode(document, audio_volume_info, it);
    value.PushBack(audio_volume_info, document.GetAllocator());
  }
}

void JsonEncode(Document &document, Value &value,
                const ClientRoleOptions &client_role_options) {
  SET_VALUE$(document, value, client_role_options, audienceLatencyLevel)
}

void JsonEncode(Document &document, Value &value, const RtcStats &rtc_stats) {
  SET_VALUE$(document, value, rtc_stats, duration)
  SET_VALUE$(document, value, rtc_stats, txBytes)
  SET_VALUE$(document, value, rtc_stats, rxBytes)
  SET_VALUE$(document, value, rtc_stats, txAudioBytes)
  SET_VALUE$(document, value, rtc_stats, txVideoBytes)
  SET_VALUE$(document, value, rtc_stats, rxAudioBytes)
  SET_VALUE$(document, value, rtc_stats, rxVideoBytes)
  SET_VALUE$(document, value, rtc_stats, txKBitRate)
  SET_VALUE$(document, value, rtc_stats, rxKBitRate)
  SET_VALUE$(document, value, rtc_stats, rxAudioKBitRate)
  SET_VALUE$(document, value, rtc_stats, txAudioKBitRate)
  SET_VALUE$(document, value, rtc_stats, rxVideoKBitRate)
  SET_VALUE$(document, value, rtc_stats, txVideoKBitRate)
  SET_VALUE$(document, value, rtc_stats, lastmileDelay)
  SET_VALUE$(document, value, rtc_stats, txPacketLossRate)
  SET_VALUE$(document, value, rtc_stats, rxPacketLossRate)
  SET_VALUE$(document, value, rtc_stats, userCount)
  SET_VALUE$(document, value, rtc_stats, cpuAppUsage)
  SET_VALUE$(document, value, rtc_stats, cpuTotalUsage)
  SET_VALUE$(document, value, rtc_stats, gatewayRtt)
  SET_VALUE$(document, value, rtc_stats, memoryAppUsageRatio)
  SET_VALUE$(document, value, rtc_stats, memoryTotalUsageRatio)
  SET_VALUE$(document, value, rtc_stats, memoryAppUsageInKbytes)
}

void JsonEncode(Document &document, Value &value,
                const LocalVideoStats &local_video_stats) {
  SET_VALUE$(document, value, local_video_stats, sentBitrate)
  SET_VALUE$(document, value, local_video_stats, sentFrameRate)
  SET_VALUE$(document, value, local_video_stats, encoderOutputFrameRate)
  SET_VALUE$(document, value, local_video_stats, rendererOutputFrameRate)
  SET_VALUE$(document, value, local_video_stats, targetBitrate)
  SET_VALUE$(document, value, local_video_stats, targetFrameRate)
  SET_VALUE$(document, value, local_video_stats, qualityAdaptIndication)
  SET_VALUE$(document, value, local_video_stats, encodedBitrate)
  SET_VALUE$(document, value, local_video_stats, encodedFrameWidth)
  SET_VALUE$(document, value, local_video_stats, encodedFrameHeight)
  SET_VALUE$(document, value, local_video_stats, encodedFrameCount)
  SET_VALUE$(document, value, local_video_stats, codecType)
  SET_VALUE$(document, value, local_video_stats, txPacketLossRate)
  SET_VALUE$(document, value, local_video_stats, captureFrameRate)
  SET_VALUE$(document, value, local_video_stats, captureBrightnessLevel)
}

void JsonEncode(Document &document, Value &value,
                const RemoteVideoStats &remote_video_stats) {
  SET_VALUE$(document, value, remote_video_stats, uid)
  SET_VALUE$(document, value, remote_video_stats, delay)
  SET_VALUE$(document, value, remote_video_stats, width)
  SET_VALUE$(document, value, remote_video_stats, height)
  SET_VALUE$(document, value, remote_video_stats, receivedBitrate)
  SET_VALUE$(document, value, remote_video_stats, decoderOutputFrameRate)
  SET_VALUE$(document, value, remote_video_stats, rendererOutputFrameRate)
  SET_VALUE$(document, value, remote_video_stats, packetLossRate)
  SET_VALUE$(document, value, remote_video_stats, rxStreamType)
  SET_VALUE$(document, value, remote_video_stats, totalFrozenTime)
  SET_VALUE$(document, value, remote_video_stats, frozenRate)
  SET_VALUE$(document, value, remote_video_stats, totalActiveTime)
  SET_VALUE$(document, value, remote_video_stats, publishDuration)
}

void JsonEncode(Document &document, Value &value,
                const LocalAudioStats &local_audio_stats) {
  SET_VALUE$(document, value, local_audio_stats, numChannels)
  SET_VALUE$(document, value, local_audio_stats, sentSampleRate)
  SET_VALUE$(document, value, local_audio_stats, sentBitrate)
  SET_VALUE$(document, value, local_audio_stats, txPacketLossRate)
}

void JsonEncode(Document &document, Value &value,
                const RemoteAudioStats &remote_audio_stats) {
  SET_VALUE$(document, value, remote_audio_stats, uid)
  SET_VALUE$(document, value, remote_audio_stats, quality)
  SET_VALUE$(document, value, remote_audio_stats, networkTransportDelay)
  SET_VALUE$(document, value, remote_audio_stats, jitterBufferDelay)
  SET_VALUE$(document, value, remote_audio_stats, audioLossRate)
  SET_VALUE$(document, value, remote_audio_stats, numChannels)
  SET_VALUE$(document, value, remote_audio_stats, receivedSampleRate)
  SET_VALUE$(document, value, remote_audio_stats, receivedBitrate)
  SET_VALUE$(document, value, remote_audio_stats, totalFrozenTime)
  SET_VALUE$(document, value, remote_audio_stats, frozenRate)
  SET_VALUE$(document, value, remote_audio_stats, totalActiveTime)
  SET_VALUE$(document, value, remote_audio_stats, publishDuration)
  SET_VALUE$(document, value, remote_audio_stats, qoeQuality)
  SET_VALUE$(document, value, remote_audio_stats, qualityChangedReason)
  SET_VALUE$(document, value, remote_audio_stats, mosValue)
}

void JsonEncode(Document &document, Value &value,
                const VideoDimensions &video_dimensions) {
  SET_VALUE$(document, value, video_dimensions, width)
  SET_VALUE$(document, value, video_dimensions, height)
}

void JsonEncode(Document &document, Value &value,
                const VideoEncoderConfiguration &video_encoder_configuration) {
  SET_VALUE_OBJ$(document, value, video_encoder_configuration, dimensions)
  SET_VALUE$(document, value, video_encoder_configuration, frameRate)
  SET_VALUE$(document, value, video_encoder_configuration, minFrameRate)
  SET_VALUE$(document, value, video_encoder_configuration, bitrate)
  SET_VALUE$(document, value, video_encoder_configuration, minBitrate)
  SET_VALUE$(document, value, video_encoder_configuration, orientationMode)
  SET_VALUE$(document, value, video_encoder_configuration,
             degradationPreference)
  SET_VALUE$(document, value, video_encoder_configuration, mirrorMode)
}

void JsonEncode(Document &document, Value &value,
                const TranscodingUser &transcoding_user) {
  SET_VALUE$(document, value, transcoding_user, uid)
  SET_VALUE$(document, value, transcoding_user, x)
  SET_VALUE$(document, value, transcoding_user, y)
  SET_VALUE$(document, value, transcoding_user, width)
  SET_VALUE$(document, value, transcoding_user, height)
  SET_VALUE$(document, value, transcoding_user, zOrder)
  SET_VALUE$(document, value, transcoding_user, alpha)
  SET_VALUE$(document, value, transcoding_user, audioChannel)
}

void JsonEncode(Document &document, Value &value,
                const TranscodingUser *transcoding_users, int count) {
  for (int i = 0; i < count; i++) {
    auto it = transcoding_users[i];
    Value transcoding_user(rapidjson::kObjectType);
    JsonEncode(document, transcoding_user, it);
    value.PushBack(transcoding_user, document.GetAllocator());
  }
}

void JsonEncode(Document &document, Value &value, const RtcImage &rtc_image) {
  SET_VALUE_CHAR$(document, value, rtc_image, url)
  SET_VALUE$(document, value, rtc_image, x)
  SET_VALUE$(document, value, rtc_image, y)
  SET_VALUE$(document, value, rtc_image, width)
  SET_VALUE$(document, value, rtc_image, height)
}

void JsonEncode(Document &document, Value &value,
                const LiveStreamAdvancedFeature &live_stream_advanced_feature) {
  SET_VALUE_CHAR$(document, value, live_stream_advanced_feature, featureName)
  SET_VALUE$(document, value, live_stream_advanced_feature, opened)
}

void JsonEncode(Document &document, Value &value,
                const LiveStreamAdvancedFeature *live_stream_advanced_features,
                int count) {
  for (int i = 0; i < count; i++) {
    auto it = live_stream_advanced_features[i];
    Value live_stream_advanced_feature(rapidjson::kObjectType);
    JsonEncode(document, live_stream_advanced_feature, it);
    value.PushBack(live_stream_advanced_feature, document.GetAllocator());
  }
}

void JsonEncode(Document &document, Value &value,
                const LiveTranscoding &live_transcoding) {
  SET_VALUE$(document, value, live_transcoding, width)
  SET_VALUE$(document, value, live_transcoding, height)
  SET_VALUE$(document, value, live_transcoding, videoBitrate)
  SET_VALUE$(document, value, live_transcoding, videoFramerate)
  SET_VALUE$(document, value, live_transcoding, lowLatency)
  SET_VALUE$(document, value, live_transcoding, videoGop)
  SET_VALUE$(document, value, live_transcoding, videoCodecProfile)
  SET_VALUE$(document, value, live_transcoding, backgroundColor)
  SET_VALUE$(document, value, live_transcoding, videoCodecType)
  SET_VALUE$(document, value, live_transcoding, userCount)
  SET_VALUE_ARR$(document, value, live_transcoding, transcodingUsers, userCount)
  SET_VALUE_CHAR$(document, value, live_transcoding, transcodingExtraInfo)
  SET_VALUE_CHAR$(document, value, live_transcoding, metadata)
  SET_VALUE_PTR$(document, value, live_transcoding, watermark)
  SET_VALUE_PTR$(document, value, live_transcoding, backgroundImage)
  SET_VALUE$(document, value, live_transcoding, audioSampleRate)
  SET_VALUE$(document, value, live_transcoding, audioBitrate)
  SET_VALUE$(document, value, live_transcoding, audioChannels)
  SET_VALUE$(document, value, live_transcoding, audioCodecProfile)
  SET_VALUE_ARR$(document, value, live_transcoding, advancedFeatures,
                 advancedFeatureCount)
  SET_VALUE$(document, value, live_transcoding, advancedFeatureCount)
}

void JsonEncode(
    Document &document, Value &value,
    const CameraCapturerConfiguration &camera_capturer_configuration) {
  SET_VALUE$(document, value, camera_capturer_configuration, preference)
  SET_VALUE$(document, value, camera_capturer_configuration, captureWidth)
  SET_VALUE$(document, value, camera_capturer_configuration, captureHeight)
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
  SET_VALUE$(document, value, camera_capturer_configuration, cameraDirection)
#endif
}

void JsonEncode(Document &document, Value &value,
                const DataStreamConfig &data_stream_config) {
  SET_VALUE$(document, value, data_stream_config, syncWithAudio)
  SET_VALUE$(document, value, data_stream_config, ordered)
}

void JsonEncode(Document &document, Value &value,
                const InjectStreamConfig &inject_stream_config) {
  SET_VALUE$(document, value, inject_stream_config, width)
  SET_VALUE$(document, value, inject_stream_config, height)
  SET_VALUE$(document, value, inject_stream_config, videoGop)
  SET_VALUE$(document, value, inject_stream_config, videoFramerate)
  SET_VALUE$(document, value, inject_stream_config, videoBitrate)
  SET_VALUE$(document, value, inject_stream_config, audioSampleRate)
  SET_VALUE$(document, value, inject_stream_config, audioBitrate)
  SET_VALUE$(document, value, inject_stream_config, audioChannels)
}

void JsonEncode(Document &document, Value &value,
                const ChannelMediaInfo &channel_media_info) {
  SET_VALUE_CHAR$(document, value, channel_media_info, channelName)
  SET_VALUE_CHAR$(document, value, channel_media_info, token)
  SET_VALUE$(document, value, channel_media_info, uid)
}

void JsonEncode(Document &document, Value &value,
                const ChannelMediaInfo *channel_media_infos, int count) {
  for (int i = 0; i < count; i++) {
    auto it = channel_media_infos[i];
    Value channel_media_info(rapidjson::kObjectType);
    JsonEncode(document, channel_media_info, it);
    value.PushBack(channel_media_info, document.GetAllocator());
  }
}

void JsonEncode(
    Document &document, Value &value,
    const ChannelMediaRelayConfiguration &channel_media_relay_configuration) {
  SET_VALUE_PTR$(document, value, channel_media_relay_configuration, srcInfo)
  SET_VALUE_ARR$(document, value, channel_media_relay_configuration, destInfos,
                 destCount)
  SET_VALUE$(document, value, channel_media_relay_configuration, destCount)
}

void JsonEncode(Document &document, Value &value, const Rectangle &rectangle) {
  SET_VALUE$(document, value, rectangle, x)
  SET_VALUE$(document, value, rectangle, y)
  SET_VALUE$(document, value, rectangle, width)
  SET_VALUE$(document, value, rectangle, height)
}

void JsonEncode(Document &document, Value &value, const Rectangle *rectangles,
                int count) {
  for (int i = 0; i < count; i++) {
    auto it = rectangles[i];
    Value rectangle(rapidjson::kObjectType);
    JsonEncode(document, rectangle, it);
    value.PushBack(rectangle, document.GetAllocator());
  }
}

void JsonEncode(Document &document, Value &value, const int *distances,
                int count) {
  for (int i = 0; i < count; i++) {
    auto it = distances[i];
    value.PushBack(it, document.GetAllocator());
  }
}

void JsonEncode(Document &document, Value &value, const Rect &rect) {
  SET_VALUE$(document, value, rect, top)
  SET_VALUE$(document, value, rect, left)
  SET_VALUE$(document, value, rect, bottom)
  SET_VALUE$(document, value, rect, right)
}

void JsonEncode(Document &document, Value &value,
                const WatermarkOptions &watermark_options) {
  SET_VALUE$(document, value, watermark_options, visibleInPreview)
  SET_VALUE_OBJ$(document, value, watermark_options, positionInLandscapeMode)
  SET_VALUE_OBJ$(document, value, watermark_options, positionInPortraitMode)
}

void JsonEncode(Document &document, Value &value, const view_t *views,
                int count) {
  for (int i = 0; i < count; i++) {
    auto it = views[i];
    value.PushBack(reinterpret_cast<int64_t>(it), document.GetAllocator());
  }
}

void JsonEncode(Document &document, Value &value,
                const ScreenCaptureParameters &screen_capture_parameters) {
  SET_VALUE_OBJ$(document, value, screen_capture_parameters, dimensions)
  SET_VALUE$(document, value, screen_capture_parameters, frameRate)
  SET_VALUE$(document, value, screen_capture_parameters, bitrate)
  SET_VALUE$(document, value, screen_capture_parameters, captureMouseCursor)
  SET_VALUE$(document, value, screen_capture_parameters, windowFocus)
  SET_VALUE_ARR$(document, value, screen_capture_parameters, excludeWindowList,
                 excludeWindowCount)
  SET_VALUE$(document, value, screen_capture_parameters, excludeWindowCount)
}

void JsonEncode(Document &document, Value &value,
                const VideoCanvas &video_canvas) {
  auto view = reinterpret_cast<int64_t>(video_canvas.view);
  SET_VALUE(document, value, view, view)
  SET_VALUE$(document, value, video_canvas, renderMode)
  SET_VALUE_CHAR$(document, value, video_canvas, channelId)
  SET_VALUE$(document, value, video_canvas, uid)
  SET_VALUE$(document, value, video_canvas, mirrorMode)
}

void JsonEncode(Document &document, Value &value,
                const BeautyOptions &beauty_options) {
  SET_VALUE$(document, value, beauty_options, lighteningLevel)
  SET_VALUE$(document, value, beauty_options, smoothnessLevel)
  SET_VALUE$(document, value, beauty_options, rednessLevel)
  SET_VALUE$(document, value, beauty_options, lighteningContrastLevel)
}

void JsonEncode(Document &document, Value &value, const UserInfo &user_info) {
  SET_VALUE$(document, value, user_info, uid)
  SET_VALUE_CHAR$(document, value, user_info, userAccount)
}

void JsonEncode(Document &document, Value &value, const LogConfig &log_config) {
  SET_VALUE_CHAR$(document, value, log_config, filePath)
  SET_VALUE$(document, value, log_config, fileSize)
  SET_VALUE(document, value, level, static_cast<int>(log_config.level))
}

void JsonEncode(Document &document, Value &value,
                const RtcEngineContext &rtc_engine_context) {
  SET_VALUE_CHAR$(document, value, rtc_engine_context, appId)
  auto context = reinterpret_cast<int64_t>(rtc_engine_context.context);
  SET_VALUE(document, value, context, context)
  SET_VALUE$(document, value, rtc_engine_context, areaCode)
  SET_VALUE_OBJ$(document, value, rtc_engine_context, logConfig)
}

void JsonEncode(Document &document, Value &value,
                const IMetadataObserver::Metadata &metadata) {
  SET_VALUE$(document, value, metadata, uid)
  SET_VALUE$(document, value, metadata, size)
  int64_t timeStampMs = metadata.timeStampMs;
  SET_VALUE(document, value, timeStampMs, timeStampMs)
}

void JsonEncode(Document &document, Value &value,
                const EncryptionConfig &encryption_config) {
  SET_VALUE$(document, value, encryption_config, encryptionMode)
  SET_VALUE_CHAR$(document, value, encryption_config, encryptionKey)
}
}// namespace rtc
}// namespace iris
}// namespace agora
