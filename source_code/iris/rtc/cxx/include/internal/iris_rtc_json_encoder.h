//
// Created by LXH on 2021/1/18.
//

#ifndef IRIS_RTC_JSON_ENCODER_H_
#define IRIS_RTC_JSON_ENCODER_H_

#include "IAgoraMediaEngine.h"
#include "IAgoraRtcChannel.h"
#include "IAgoraRtcEngine.h"
#include "document.h"
#include <string>

namespace agora {
namespace iris {
namespace rtc {
void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const media::IAudioFrameObserver::AudioFrame &audio_frame);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const media::IVideoFrameObserver::VideoFrame &video_frame);

void JsonEncode(
    rapidjson::Document &document, rapidjson::Value &value,
    const media::ExternalVideoRenerContext &external_video_rener_context);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const media::ExternalVideoFrame &external_video_frame);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::ChannelMediaOptions &channel_media_options);

void JsonEncode(
    rapidjson::Document &document, rapidjson::Value &value,
    const agora::rtc::LastmileProbeOneWayResult &lastmile_probe_one_way_result);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::LastmileProbeResult &lastmile_probe_result);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::LastmileProbeConfig &lastmile_probe_config);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::AudioVolumeInfo &audio_volume_info);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::AudioVolumeInfo *audio_volume_infos,
                int count);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::ClientRoleOptions &client_role_options);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::RtcStats &rtc_stats);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::LocalVideoStats &local_video_stats);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::RemoteVideoStats &remote_video_stats);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::LocalAudioStats &local_audio_stats);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::RemoteAudioStats &remote_audio_stats);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::VideoDimensions &video_dimensions);

void JsonEncode(
    rapidjson::Document &document, rapidjson::Value &value,
    const agora::rtc::VideoEncoderConfiguration &video_encoder_configuration);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::TranscodingUser &transcoding_user);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::TranscodingUser *transcoding_users,
                int count);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::RtcImage &rtc_image);

void JsonEncode(
    rapidjson::Document &document, rapidjson::Value &value,
    const agora::rtc::LiveStreamAdvancedFeature &live_stream_advanced_feature);

void JsonEncode(
    rapidjson::Document &document, rapidjson::Value &value,
    const agora::rtc::LiveStreamAdvancedFeature *live_stream_advanced_features,
    int count);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::LiveTranscoding &live_transcoding);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::CameraCapturerConfiguration
                    &camera_capturer_configuration);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::DataStreamConfig &data_stream_config);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::InjectStreamConfig &inject_stream_config);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::ChannelMediaInfo &channel_media_info);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::ChannelMediaInfo *channel_media_infos,
                int count);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::ChannelMediaRelayConfiguration
                    &channel_media_relay_configuration);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::Rectangle &rectangle);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::Rectangle *rectangles, int count);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const int *distances, int count);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::Rect &rect);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::WatermarkOptions &watermark_options);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::view_t *views, int count);

void JsonEncode(
    rapidjson::Document &document, rapidjson::Value &value,
    const agora::rtc::ScreenCaptureParameters &screen_capture_parameters);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::VideoCanvas &video_canvas);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::BeautyOptions &beauty_options);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::UserInfo &user_info);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::LogConfig &log_config);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::RtcEngineContext &rtc_engine_context);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::IMetadataObserver::Metadata &metadata);

void JsonEncode(rapidjson::Document &document, rapidjson::Value &value,
                const agora::rtc::EncryptionConfig &encryption_config);
}// namespace rtc
}// namespace iris
}// namespace agora

#endif// IRIS_RTC_JSON_ENCODER_H_
