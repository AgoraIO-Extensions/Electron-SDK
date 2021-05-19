//
// Created by LXH on 2021/1/18.
//

#include "internal/iris_rtc_struct_extensions.h"

namespace agora {
using namespace rtc;
using namespace media;

namespace iris {
namespace rtc {
using namespace std;

ostream &operator<<(ostream &os,
                    const IAudioFrameObserver::AudioFrame &audio_frame) {
  return os << "type: " << audio_frame.type
            << " samples: " << audio_frame.samples
            << " bytesPerSample: " << audio_frame.bytesPerSample
            << " channels: " << audio_frame.channels
            << " samplesPerSec: " << audio_frame.samplesPerSec
            << " buffer: " << audio_frame.buffer
            << " renderTimeMs: " << audio_frame.renderTimeMs
            << " avsync_type: " << audio_frame.avsync_type;
}

ostream &operator<<(ostream &os,
                    const IVideoFrameObserver::VideoFrame &video_frame) {
  return os << "type: " << video_frame.type << " width: " << video_frame.width
            << " height: " << video_frame.height
            << " yStride: " << video_frame.yStride
            << " uStride: " << video_frame.uStride
            << " vStride: " << video_frame.vStride
            << " yBuffer: " << video_frame.yBuffer
            << " uBuffer: " << video_frame.uBuffer
            << " vBuffer: " << video_frame.vBuffer
            << " rotation: " << video_frame.rotation
            << " renderTimeMs: " << video_frame.renderTimeMs
            << " avsync_type: " << video_frame.avsync_type;
}

ostream &
operator<<(ostream &os,
           const ExternalVideoRenerContext &external_video_rener_context) {
  return os << "renderCallback: " << external_video_rener_context.renderCallback
            << " view: " << external_video_rener_context.view
            << " renderMode: " << external_video_rener_context.renderMode
            << " zOrder: " << external_video_rener_context.zOrder
            << " left: " << external_video_rener_context.left
            << " top: " << external_video_rener_context.top
            << " right: " << external_video_rener_context.right
            << " bottom: " << external_video_rener_context.bottom;
}

ostream &operator<<(ostream &os,
                    const ExternalVideoFrame &external_video_frame) {
  return os << "type: " << external_video_frame.type
            << " format: " << external_video_frame.format
            << " buffer: " << external_video_frame.buffer
            << " stride: " << external_video_frame.stride
            << " height: " << external_video_frame.height
            << " cropLeft: " << external_video_frame.cropLeft
            << " cropTop: " << external_video_frame.cropTop
            << " cropRight: " << external_video_frame.cropRight
            << " cropBottom: " << external_video_frame.cropBottom
            << " rotation: " << external_video_frame.rotation
            << " timestamp: " << external_video_frame.timestamp;
}

ostream &operator<<(ostream &os,
                    const ChannelMediaOptions &channel_media_options) {
  return os << "autoSubscribeAudio: "
            << channel_media_options.autoSubscribeAudio
            << " autoSubscribeVideo: "
            << channel_media_options.autoSubscribeVideo;
}

ostream &
operator<<(ostream &os,
           const LastmileProbeOneWayResult &lastmile_probe_one_way_result) {
  return os << "packetLossRate: "
            << lastmile_probe_one_way_result.packetLossRate
            << " jitter: " << lastmile_probe_one_way_result.jitter
            << " availableBandwidth: "
            << lastmile_probe_one_way_result.availableBandwidth;
}

ostream &operator<<(ostream &os,
                    const LastmileProbeResult &lastmile_probe_result) {
  return os << "state: " << lastmile_probe_result.state
            << " uplinkReport: " << lastmile_probe_result.uplinkReport
            << " downlinkReport: " << lastmile_probe_result.downlinkReport
            << " rtt: " << lastmile_probe_result.rtt;
}

ostream &operator<<(ostream &os,
                    const LastmileProbeConfig &lastmile_probe_config) {
  return os << "probeUplink: " << lastmile_probe_config.probeUplink
            << " probeDownlink: " << lastmile_probe_config.probeDownlink
            << " expectedUplinkBitrate: "
            << lastmile_probe_config.expectedUplinkBitrate
            << " expectedDownlinkBitrate: "
            << lastmile_probe_config.expectedDownlinkBitrate;
}

ostream &operator<<(ostream &os, const AudioVolumeInfo &audio_volume_info) {
  return os << "uid: " << audio_volume_info.uid
            << " volume: " << audio_volume_info.volume
            << " vad: " << audio_volume_info.vad << " channelId: "
            << (audio_volume_info.channelId ? audio_volume_info.channelId
                                            : "nullptr");
}

ostream &operator<<(ostream &os, const ClientRoleOptions &client_role_options) {
  return os << "audienceLatencyLevel: "
            << client_role_options.audienceLatencyLevel;
}

ostream &operator<<(ostream &os, const RtcStats &rtc_stats) {
  return os << "duration: " << rtc_stats.duration
            << " txBytes: " << rtc_stats.txBytes
            << " rxBytes: " << rtc_stats.rxBytes
            << " txAudioBytes: " << rtc_stats.txAudioBytes
            << " txVideoBytes: " << rtc_stats.txVideoBytes
            << " rxAudioBytes: " << rtc_stats.rxAudioBytes
            << " rxVideoBytes: " << rtc_stats.rxVideoBytes
            << " txKBitRate: " << rtc_stats.txKBitRate
            << " rxKBitRate: " << rtc_stats.rxKBitRate
            << " rxAudioKBitRate: " << rtc_stats.rxAudioKBitRate
            << " txAudioKBitRate: " << rtc_stats.txAudioKBitRate
            << " rxVideoKBitRate: " << rtc_stats.rxVideoKBitRate
            << " txVideoKBitRate: " << rtc_stats.txVideoKBitRate
            << " lastmileDelay: " << rtc_stats.lastmileDelay
            << " txPacketLossRate: " << rtc_stats.txPacketLossRate
            << " rxPacketLossRate: " << rtc_stats.rxPacketLossRate
            << " userCount: " << rtc_stats.userCount
            << " cpuAppUsage: " << rtc_stats.cpuAppUsage
            << " cpuTotalUsage: " << rtc_stats.cpuTotalUsage
            << " gatewayRtt: " << rtc_stats.gatewayRtt
            << " memoryAppUsageRatio: " << rtc_stats.memoryAppUsageRatio
            << " memoryTotalUsageRatio: " << rtc_stats.memoryTotalUsageRatio
            << " memoryAppUsageInKbytes: " << rtc_stats.memoryAppUsageInKbytes;
}

ostream &operator<<(ostream &os, const LocalVideoStats &local_video_stats) {
  return os << "sentBitrate: " << local_video_stats.sentBitrate
            << " sentFrameRate: " << local_video_stats.sentFrameRate
            << " encoderOutputFrameRate: "
            << local_video_stats.encoderOutputFrameRate
            << " rendererOutputFrameRate: "
            << local_video_stats.rendererOutputFrameRate
            << " targetBitrate: " << local_video_stats.targetBitrate
            << " targetFrameRate: " << local_video_stats.targetFrameRate
            << " qualityAdaptIndication: "
            << local_video_stats.qualityAdaptIndication
            << " encodedBitrate: " << local_video_stats.encodedBitrate
            << " encodedFrameWidth: " << local_video_stats.encodedFrameWidth
            << " encodedFrameHeight: " << local_video_stats.encodedFrameHeight
            << " encodedFrameCount: " << local_video_stats.encodedFrameCount
            << " codecType: " << local_video_stats.codecType
            << " txPacketLossRate: " << local_video_stats.txPacketLossRate
            << " captureFrameRate: " << local_video_stats.captureFrameRate
            << " captureBrightnessLevel: "
            << local_video_stats.captureBrightnessLevel;
}

ostream &operator<<(ostream &os, const RemoteVideoStats &remote_video_stats) {
  return os << "uid: " << remote_video_stats.uid
            << " delay: " << remote_video_stats.delay
            << " width: " << remote_video_stats.width
            << " height: " << remote_video_stats.height
            << " receivedBitrate: " << remote_video_stats.receivedBitrate
            << " decoderOutputFrameRate: "
            << remote_video_stats.decoderOutputFrameRate
            << " rendererOutputFrameRate: "
            << remote_video_stats.rendererOutputFrameRate
            << " packetLossRate: " << remote_video_stats.packetLossRate
            << " rxStreamType: " << remote_video_stats.rxStreamType
            << " totalFrozenTime: " << remote_video_stats.totalFrozenTime
            << " frozenRate: " << remote_video_stats.frozenRate
            << " totalActiveTime: " << remote_video_stats.totalActiveTime
            << " publishDuration: " << remote_video_stats.publishDuration;
}

ostream &operator<<(ostream &os, const LocalAudioStats &local_audio_stats) {
  return os << "numChannels: " << local_audio_stats.numChannels
            << " sentSampleRate: " << local_audio_stats.sentSampleRate
            << " sentBitrate: " << local_audio_stats.sentBitrate
            << " txPacketLossRate: " << local_audio_stats.txPacketLossRate;
}

ostream &operator<<(ostream &os, const RemoteAudioStats &remote_audio_stats) {
  return os << "uid: " << remote_audio_stats.uid
            << " quality: " << remote_audio_stats.quality
            << " networkTransportDelay: "
            << remote_audio_stats.networkTransportDelay
            << " jitterBufferDelay: " << remote_audio_stats.jitterBufferDelay
            << " audioLossRate: " << remote_audio_stats.audioLossRate
            << " numChannels: " << remote_audio_stats.numChannels
            << " receivedSampleRate: " << remote_audio_stats.receivedSampleRate
            << " receivedBitrate: " << remote_audio_stats.receivedBitrate
            << " totalFrozenTime: " << remote_audio_stats.totalFrozenTime
            << " frozenRate: " << remote_audio_stats.frozenRate
            << " totalActiveTime: " << remote_audio_stats.totalActiveTime
            << " publishDuration: " << remote_audio_stats.publishDuration
            << " qoeQuality: " << remote_audio_stats.qoeQuality
            << " qualityChangedReason: "
            << remote_audio_stats.qualityChangedReason
            << " mosValue: " << remote_audio_stats.mosValue;
}

ostream &operator<<(ostream &os, const VideoDimensions &video_dimensions) {
  return os << "width: " << video_dimensions.width
            << " height: " << video_dimensions.height;
}

ostream &
operator<<(ostream &os,
           const VideoEncoderConfiguration &video_encoder_configuration) {
  return os << "dimensions: " << video_encoder_configuration.dimensions
            << " frameRate: " << video_encoder_configuration.frameRate
            << " minFrameRate: " << video_encoder_configuration.minFrameRate
            << " bitrate: " << video_encoder_configuration.bitrate
            << " minBitrate: " << video_encoder_configuration.minBitrate
            << " orientationMode: "
            << video_encoder_configuration.orientationMode
            << " degradationPreference: "
            << video_encoder_configuration.degradationPreference
            << " mirrorMode: " << video_encoder_configuration.mirrorMode;
}

ostream &operator<<(ostream &os, const TranscodingUser &transcoding_user) {
  return os << "uid: " << transcoding_user.uid << " x: " << transcoding_user.x
            << " y: " << transcoding_user.y
            << " width: " << transcoding_user.width
            << " height: " << transcoding_user.height
            << " zOrder: " << transcoding_user.zOrder
            << " alpha: " << transcoding_user.alpha
            << " audioChannel: " << transcoding_user.audioChannel;
}

ostream &operator<<(ostream &os, const RtcImage &rtc_image) {
  return os << "url: " << (rtc_image.url ? rtc_image.url : "nullptr")
            << " x: " << rtc_image.x << " y: " << rtc_image.y
            << " width: " << rtc_image.width << " height: " << rtc_image.height;
}

ostream &
operator<<(ostream &os,
           const LiveStreamAdvancedFeature &live_stream_advanced_feature) {
  return os << "featureName: "
            << (live_stream_advanced_feature.featureName
                    ? live_stream_advanced_feature.featureName
                    : "nullptr")
            << " opened: " << live_stream_advanced_feature.opened;
}

ostream &operator<<(ostream &os, const LiveTranscoding &live_transcoding) {
  return os << "width: " << live_transcoding.width
            << " height: " << live_transcoding.height
            << " videoBitrate: " << live_transcoding.videoBitrate
            << " videoFramerate: " << live_transcoding.videoFramerate
            << " lowLatency: " << live_transcoding.lowLatency
            << " videoGop: " << live_transcoding.videoGop
            << " videoCodecProfile: " << live_transcoding.videoCodecProfile
            << " backgroundColor: " << live_transcoding.backgroundColor
            << " videoCodecType: " << live_transcoding.videoCodecType
            << " userCount: " << live_transcoding.userCount
            << " transcodingUsers: " << live_transcoding.transcodingUsers
            << " transcodingExtraInfo: "
            << (live_transcoding.transcodingExtraInfo
                    ? live_transcoding.transcodingExtraInfo
                    : "nullptr")
            << " metadata: "
            << (live_transcoding.metadata ? live_transcoding.metadata
                                          : "nullptr")
            << " watermark: " << live_transcoding.watermark
            << " backgroundImage: " << live_transcoding.backgroundImage
            << " audioSampleRate: " << live_transcoding.audioSampleRate
            << " audioBitrate: " << live_transcoding.audioBitrate
            << " audioChannels: " << live_transcoding.audioChannels
            << " audioCodecProfile: " << live_transcoding.audioCodecProfile
            << " advancedFeatures: " << live_transcoding.advancedFeatures
            << " advancedFeatureCount: "
            << live_transcoding.advancedFeatureCount;
}

ostream &
operator<<(ostream &os,
           const CameraCapturerConfiguration &camera_capturer_configuration) {
  return os << "preference: " << camera_capturer_configuration.preference
            << " captureWidth: " << camera_capturer_configuration.captureWidth
            << " captureHeight: " << camera_capturer_configuration.captureHeight
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
            << "cameraDirection: "
            << camera_capturer_configuration.cameraDirection
#endif
      ;
}

ostream &operator<<(ostream &os, const DataStreamConfig &data_stream_config) {
  return os << "syncWithAudio: " << data_stream_config.syncWithAudio
            << " ordered: " << data_stream_config.ordered;
}

ostream &operator<<(ostream &os,
                    const InjectStreamConfig &inject_stream_config) {
  return os << "width: " << inject_stream_config.width
            << " height: " << inject_stream_config.height
            << " videoGop: " << inject_stream_config.videoGop
            << " videoFramerate: " << inject_stream_config.videoFramerate
            << " videoBitrate: " << inject_stream_config.videoBitrate
            << " audioSampleRate: " << inject_stream_config.audioSampleRate
            << " audioBitrate: " << inject_stream_config.audioBitrate
            << " audioChannels: " << inject_stream_config.audioChannels;
}

ostream &operator<<(ostream &os, const ChannelMediaInfo &channel_media_info) {
  return os << "channelName: "
            << (channel_media_info.channelName ? channel_media_info.channelName
                                               : "nullptr")
            << " token: "
            << (channel_media_info.token ? channel_media_info.token : "nullptr")
            << " uid: " << channel_media_info.uid;
}

ostream &operator<<(
    ostream &os,
    const ChannelMediaRelayConfiguration &channel_media_relay_configuration) {
  return os << "srcInfo: " << channel_media_relay_configuration.srcInfo
            << " destInfos: " << channel_media_relay_configuration.destInfos
            << " destCount: " << channel_media_relay_configuration.destCount;
}

ostream &operator<<(ostream &os, const Rectangle &rectangle) {
  return os << "x: " << rectangle.x << " y: " << rectangle.y
            << " width: " << rectangle.width << " height: " << rectangle.height;
}

ostream &operator<<(ostream &os, const Rect &rect) {
  return os << "top: " << rect.top << " left: " << rect.left
            << " bottom: " << rect.bottom << " right: " << rect.right;
}

ostream &operator<<(ostream &os, const WatermarkOptions &watermark_options) {
  return os << "visibleInPreview: " << watermark_options.visibleInPreview
            << " positionInLandscapeMode: "
            << watermark_options.positionInLandscapeMode
            << " positionInPortraitMode: "
            << watermark_options.positionInPortraitMode;
}

ostream &operator<<(ostream &os,
                    const ScreenCaptureParameters &screen_capture_parameters) {
  return os << "dimensions: " << screen_capture_parameters.dimensions
            << " frameRate: " << screen_capture_parameters.frameRate
            << " bitrate: " << screen_capture_parameters.bitrate
            << " captureMouseCursor: "
            << screen_capture_parameters.captureMouseCursor
            << " windowFocus: " << screen_capture_parameters.windowFocus
            << " excludeWindowList: "
            << screen_capture_parameters.excludeWindowList
            << " excludeWindowCount: "
            << screen_capture_parameters.excludeWindowCount;
}

ostream &operator<<(ostream &os, const VideoCanvas &video_canvas) {
  return os << "view: " << video_canvas.view
            << " renderMode: " << video_canvas.renderMode
            << " channelId: " << video_canvas.channelId
            << " uid: " << video_canvas.uid << " priv: " << video_canvas.priv
            << " mirrorMode: " << video_canvas.mirrorMode;
}

ostream &operator<<(ostream &os, const BeautyOptions &beauty_options) {
  return os << "lighteningContrastLevel: "
            << beauty_options.lighteningContrastLevel
            << " lighteningLevel: " << beauty_options.lighteningLevel
            << " smoothnessLevel: " << beauty_options.smoothnessLevel
            << " rednessLevel: " << beauty_options.rednessLevel;
}

ostream &operator<<(ostream &os, const UserInfo &user_info) {
  return os << "uid: " << user_info.uid
            << " userAccount: " << user_info.userAccount;
}

ostream &operator<<(ostream &os, const LogConfig &log_config) {
  return os << "filePath: "
            << (log_config.filePath ? log_config.filePath : "nullptr")
            << " fileSize: " << log_config.fileSize
            << " level: " << static_cast<int>(log_config.level);
}

ostream &operator<<(ostream &os, const RtcEngineContext &rtc_engine_context) {
  return os << "eventHandler: " << rtc_engine_context.eventHandler << " appId: "
            << (rtc_engine_context.appId ? rtc_engine_context.appId : "nullptr")
            << " rtc_engine_context: " << rtc_engine_context.context
            << " areaCode: " << rtc_engine_context.areaCode
            << " logConfig: " << rtc_engine_context.logConfig;
}

ostream &operator<<(ostream &os, const IMetadataObserver::Metadata &metadata) {
  return os << "uid: " << metadata.uid << " size: " << metadata.size
            << " buffer: " << reinterpret_cast<void *>(metadata.buffer)
            << " timeStampMs: " << metadata.timeStampMs;
}

ostream &operator<<(ostream &os, const EncryptionConfig &encryption_config) {
  return os << "encryptionMode: " << encryption_config.encryptionMode
            << " encryptionKey: "
            << (encryption_config.encryptionKey
                    ? encryption_config.encryptionKey
                    : "nullptr");
}
}// namespace rtc
}// namespace iris
}// namespace agora
