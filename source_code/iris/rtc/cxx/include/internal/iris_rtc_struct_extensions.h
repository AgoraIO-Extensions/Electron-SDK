//
// Created by LXH on 2021/1/19.
//

#ifndef IRIS_RTC_STRUCT_EXTENSIONS_H_
#define IRIS_RTC_STRUCT_EXTENSIONS_H_

#include "IAgoraMediaEngine.h"
#include "IAgoraRtcChannel.h"
#include "IAgoraRtcEngine.h"
#include <sstream>
#include <string>

namespace agora {
namespace iris {
namespace rtc {
std::ostream &
operator<<(std::ostream &os,
           const media::IAudioFrameObserver::AudioFrame &audio_frame);

std::ostream &
operator<<(std::ostream &os,
           const media::IVideoFrameObserver::VideoFrame &video_frame);

std::ostream &operator<<(
    std::ostream &os,
    const media::ExternalVideoRenerContext &external_video_rener_context);

std::ostream &operator<<(std::ostream &os,
                         const media::ExternalVideoFrame &external_video_frame);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::ChannelMediaOptions &channel_media_options);

std::ostream &operator<<(
    std::ostream &os,
    const agora::rtc::LastmileProbeOneWayResult &lastmile_probe_one_way_result);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::LastmileProbeResult &lastmile_probe_result);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::LastmileProbeConfig &lastmile_probe_config);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::AudioVolumeInfo &audio_volume_info);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::ClientRoleOptions &client_role_options);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::RtcStats &rtc_stats);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::LocalVideoStats &local_video_stats);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::RemoteVideoStats &remote_video_stats);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::LocalAudioStats &local_audio_stats);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::RemoteAudioStats &remote_audio_stats);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::VideoDimensions &video_dimensions);

std::ostream &operator<<(
    std::ostream &os,
    const agora::rtc::VideoEncoderConfiguration &video_encoder_configuration);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::TranscodingUser &transcoding_user);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::RtcImage &rtc_image);

std::ostream &operator<<(
    std::ostream &os,
    const agora::rtc::LiveStreamAdvancedFeature &live_stream_advanced_feature);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::LiveTranscoding &live_transcoding);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::CameraCapturerConfiguration
                             &camera_capturer_configuration);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::DataStreamConfig &data_stream_config);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::InjectStreamConfig &inject_stream_config);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::ChannelMediaInfo &channel_media_info);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::ChannelMediaRelayConfiguration
                             &channel_media_relay_configuration);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::Rectangle &rectangle);

std::ostream &operator<<(std::ostream &os, const agora::rtc::Rect &rect);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::WatermarkOptions &watermark_options);

std::ostream &operator<<(
    std::ostream &os,
    const agora::rtc::ScreenCaptureParameters &screen_capture_parameters);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::VideoCanvas &video_canvas);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::BeautyOptions &beauty_options);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::UserInfo &user_info);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::LogConfig &log_config);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::RtcEngineContext &rtc_engine_context);

std::ostream &
operator<<(std::ostream &os,
           const agora::rtc::IMetadataObserver::Metadata &metadata);

std::ostream &operator<<(std::ostream &os,
                         const agora::rtc::EncryptionConfig &encryption_config);
}// namespace rtc
}// namespace iris
}// namespace agora

#endif// IRIS_RTC_STRUCT_EXTENSIONS_H_
