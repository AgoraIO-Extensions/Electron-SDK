#pragma once

#include "IAgoraRtcEngine.h"
#include "IAgoraMediaPlayer.h"
#include "IAgoraMediaEngine.h"
#include "AgoraBase.h"
#include "node_media_player_video_frame_observer.h"

namespace agora
{
	namespace rtc
	{

		class AgoraRtcChannelPublishHelper
		{
		public:
			static AgoraRtcChannelPublishHelper * Get()
			{
				static AgoraRtcChannelPublishHelper helper;
				return &helper;
			}

			void setRtcEngine(IRtcEngine *rtc_engine)
			{
				rtc_engine_ = rtc_engine;
			}

			void pushAudioData(void* data, int len) {

			}

			// 启动/停止推送音频流到频道
			void publishAudio()
			{
				
			}
			void unpublishAudio()
			{
				
			}
			// 启动/停止推送视频流到频道
			void publishVideoToRtc(NodeMediaPlayerVideoFrameObserver *media_playerk_video_frame_observer)
			{
				if (media_playerk_video_frame_observer_ && media_playerk_video_frame_observer_ != media_playerk_video_frame_observer)
				{
					media_playerk_video_frame_observer_->unpublishVideoToRtc();
				}
				media_playerk_video_frame_observer_ = media_playerk_video_frame_observer;

				if (media_playerk_video_frame_observer_) 
				{
					if (rtc_engine_)
					{
						agora::util::AutoPtr<agora::media::IMediaEngine> mediaEngine;
						mediaEngine.queryInterface(rtc_engine_, agora::AGORA_IID_MEDIA_ENGINE);
						if (mediaEngine)
						{
							mediaEngine->setExternalVideoSource(true, false);
						}
					}
					media_playerk_video_frame_observer_->publishVideoToRtc(rtc_engine_);
				}
			}
			void unpublishVideoToRtc(NodeMediaPlayerVideoFrameObserver *media_playerk_video_frame_observer)
			{
				if (media_playerk_video_frame_observer != media_playerk_video_frame_observer_) {
					return;
				}

				if (media_playerk_video_frame_observer_) 
				{
					if (rtc_engine_)
					{
						agora::util::AutoPtr<agora::media::IMediaEngine> mediaEngine;
						mediaEngine.queryInterface(rtc_engine_, agora::AGORA_IID_MEDIA_ENGINE);
						if (mediaEngine)
						{
							mediaEngine->setExternalVideoSource(false, false);
						}
					}
					media_playerk_video_frame_observer_->unpublishVideoToRtc();
				} 
			}
			// 调节推送到频道内音频流的音量
			void adjustPublishSignalVolume(int volume)
			{

			}
			// 调节本地播放视频音量
			void adjustPlayoutSignalVolume(int volume)
			{

			}
			// 断开 MediaPlayer 和 RTC SDK 的关联
			void detachPlayerFromRtc()
			{

			}

			AgoraRtcChannelPublishHelper() {}
			~AgoraRtcChannelPublishHelper() {}

		private:
			IRtcEngine *rtc_engine_ = nullptr;
			NodeMediaPlayerVideoFrameObserver *media_playerk_video_frame_observer_ = nullptr;
		};
	} // namespace rtc
} // namespace agora
