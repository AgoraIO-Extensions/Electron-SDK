//
// Created by LXH on 2021/1/15.
//

#ifndef IRIS_RTC_JSON_DECODER_H_
#define IRIS_RTC_JSON_DECODER_H_

#include "IAgoraMediaEngine.h"
#include "IAgoraRtcChannel.h"
#include "IAgoraRtcEngine.h"
#include "document.h"
#include <vector>

namespace agora {
namespace iris {
namespace rtc {
void JsonDecode(const rapidjson::Value &value,
                media::IAudioFrameObserver::AudioFrame &audio_frame,
                void *buffer = nullptr);

void JsonDecode(const rapidjson::Value &value,
                media::IVideoFrameObserver::VideoFrame &video_frame,
                void *yBuffer = nullptr, void *uBuffer = nullptr,
                void *vBuffer = nullptr);

void JsonDecode(const rapidjson::Value &value,
                media::ExternalVideoRenerContext &external_video_rener_context,
                media::IExternalVideoRenderCallback
                    *external_video_render_callback = nullptr);

void JsonDecode(const rapidjson::Value &value,
                media::ExternalVideoFrame &external_video_frame,
                void *buffer = nullptr);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::ChannelMediaOptions &channel_media_options);

void JsonDecode(
    const rapidjson::Value &value,
    agora::rtc::LastmileProbeOneWayResult &lastmile_probe_one_way_result);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::LastmileProbeResult &lastmile_probe_result);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::LastmileProbeConfig &lastmile_probe_config);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::AudioVolumeInfo &audio_volume_info);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::ClientRoleOptions &client_role_options);

void JsonDecode(const rapidjson::Value &value, agora::rtc::RtcStats &rtc_stats);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::LocalVideoStats &local_video_stats);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::RemoteVideoStats &remote_video_stats);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::LocalAudioStats &local_audio_stats);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::RemoteAudioStats &remote_audio_stats);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::VideoDimensions &video_dimensions);

void JsonDecode(
    const rapidjson::Value &value,
    agora::rtc::VideoEncoderConfiguration &video_encoder_configuration);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::TranscodingUser &transcoding_user);

void JsonDecode(
    const rapidjson::Value &value,
    std::vector<agora::rtc::TranscodingUser> &transcoding_user_list);

void JsonDecode(const rapidjson::Value &value, agora::rtc::RtcImage &rtc_image);

void JsonDecode(
    const rapidjson::Value &value,
    agora::rtc::LiveStreamAdvancedFeature &live_stream_advanced_feature);

void JsonDecode(const rapidjson::Value &value,
                std::vector<agora::rtc::LiveStreamAdvancedFeature>
                    &live_stream_advanced_feature_list);

void JsonDecode(
    const rapidjson::Value &value,
    agora::rtc::LiveTranscoding &live_transcoding,
    agora::rtc::TranscodingUser *transcoding_users = nullptr,
    int user_count = 0, agora::rtc::RtcImage *watermark = nullptr,
    agora::rtc::RtcImage *background_image = nullptr,
    agora::rtc::LiveStreamAdvancedFeature *advanced_features = nullptr,
    int feature_count = 0);

void JsonDecode(
    const rapidjson::Value &value,
    agora::rtc::CameraCapturerConfiguration &camera_capturer_configuration);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::DataStreamConfig &data_stream_config);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::InjectStreamConfig &inject_stream_config);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::ChannelMediaInfo &channel_media_info);

void JsonDecode(
    const rapidjson::Value &value,
    std::vector<agora::rtc::ChannelMediaInfo> &channel_media_info_list);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::ChannelMediaRelayConfiguration
                    &channel_media_relay_configuration,
                agora::rtc::ChannelMediaInfo *src_info = nullptr,
                agora::rtc::ChannelMediaInfo *dest_infos = nullptr,
                int count = 0);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::Rectangle &rectangle);

void JsonDecode(const rapidjson::Value &value, agora::rtc::Rect &rect);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::WatermarkOptions &watermark_options);

void JsonDecode(const rapidjson::Value &value,
                std::vector<agora::rtc::view_t> view_list);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::ScreenCaptureParameters &screen_capture_parameters,
                agora::rtc::view_t *exclude_window_list = nullptr,
                int count = 0);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::VideoCanvas &video_canvas, void *priv = nullptr);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::BeautyOptions &beauty_options);

void JsonDecode(const rapidjson::Value &value, agora::rtc::UserInfo &user_info);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::LogConfig &log_config);

void JsonDecode(
    const rapidjson::Value &value,
    agora::rtc::RtcEngineContext &rtc_engine_context,
    agora::rtc::IRtcEngineEventHandler *rtc_engine_event_handler = nullptr);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::IMetadataObserver::Metadata &metadata,
                void *buffer = nullptr);

void JsonDecode(const rapidjson::Value &value,
                agora::rtc::EncryptionConfig &encryption_config);
}// namespace rtc
}// namespace iris
}// namespace agora

#endif// IRIS_RTC_JSON_DECODER_H_
