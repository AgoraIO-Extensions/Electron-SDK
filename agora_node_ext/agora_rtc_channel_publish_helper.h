#pragma once

#include "IAgoraRtcEngine.h"
#include "IAgoraMediaPlayer.h"
#include "IAgoraMediaEngine.h"
#include "AgoraBase.h"
#include "node_media_player_video_frame_observer.h"
#include "node_media_player_audio_frame_observer.h"
#include "AVPlugin/IAVFramePluginManager.h"

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

			void setAudioObserver(IAVFramePluginManager* rtcAudioObserver)
			{
				rtcAudioObserver_ = rtcAudioObserver;
			}

			int attachPlayerToRtc()
			{
				if (rtc_engine_ == nullptr)
				{
					return -7;
				}

				agora::util::AutoPtr<agora::media::IMediaEngine> mediaEngine;
				mediaEngine.queryInterface(rtc_engine_, agora::AGORA_IID_MEDIA_ENGINE);
				if (mediaEngine)
				{
					return mediaEngine->setExternalVideoSource(true, false);
				}
				else
				{
					return -7;
				}
			}

			int detachPlayerFromRtc()
			{
				if (rtc_engine_ == nullptr)
				{
					return -7;
				}

				agora::util::AutoPtr<agora::media::IMediaEngine> mediaEngine;
				mediaEngine.queryInterface(rtc_engine_, agora::AGORA_IID_MEDIA_ENGINE);
				if (mediaEngine)
				{
					return mediaEngine->setExternalVideoSource(false, false);
				}
				else
				{
					return -7;
				}

			}

			void publishVideoToRtc(NodeMediaPlayerVideoFrameObserver *videoObserver)
			{
				if (mediaPlayerVideoFrameObserver_ && mediaPlayerVideoFrameObserver_ != videoObserver)
				{
					mediaPlayerVideoFrameObserver_->unpublishVideoToRtc();
				}
				mediaPlayerVideoFrameObserver_ = videoObserver;

				if (mediaPlayerVideoFrameObserver_)
				{
					mediaPlayerVideoFrameObserver_->publishVideoToRtc(rtc_engine_);
				}
			}
			void unpublishVideoToRtc(NodeMediaPlayerVideoFrameObserver *videoObserver)
			{
				if (mediaPlayerVideoFrameObserver_ != videoObserver)
				{
					return;
				}

				if (mediaPlayerVideoFrameObserver_)
				{
					mediaPlayerVideoFrameObserver_->unpublishVideoToRtc();
					mediaPlayerVideoFrameObserver_ = nullptr;
				}
			}

			void pushAudioData(void* data, int len) {
				if (rtcAudioObserver_)
				{
					rtcAudioObserver_->pushAudioData(data, len);
				}
			}

			void publishAudioToRtc(NodeMediaPlayerAudioFrameObserver *audioObserver, bool publishAudio, bool playebackAudio)
			{
				if (rtc_engine_) {
					// rtc_engine_->setAudioProfile(agora::rtc::AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO, agora::rtc::AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT);
					rtc_engine_->setRecordingAudioFrameParameters(48000, 2, agora::rtc::RAW_AUDIO_FRAME_OP_MODE_READ_WRITE, 960);
					rtc_engine_->setPlaybackAudioFrameParameters(48000, 2, agora::rtc::RAW_AUDIO_FRAME_OP_MODE_READ_WRITE, 960);
				}
				if (mediaPlayerAudioFrameObserver_ && mediaPlayerAudioFrameObserver_ != audioObserver)
				{
					mediaPlayerAudioFrameObserver_->unpublishAudioToRtc();
				}
				mediaPlayerAudioFrameObserver_ = audioObserver;
				if (mediaPlayerAudioFrameObserver_)
				{
					mediaPlayerAudioFrameObserver_->publishAudioToRtc(publishAudio, playebackAudio);
				}

				if (rtcAudioObserver_)
				{
					rtcAudioObserver_->publishMediaPlayerAudio(publishAudio, playebackAudio);
				}
			}
			void unpublishAudioToRtc(NodeMediaPlayerAudioFrameObserver *audioObserver)
			{
				if (mediaPlayerAudioFrameObserver_ != audioObserver)
				{
					return;
				}

				if (mediaPlayerAudioFrameObserver_)
				{
					mediaPlayerAudioFrameObserver_->unpublishAudioToRtc();
					mediaPlayerAudioFrameObserver_ = nullptr;
				}

				if (rtcAudioObserver_)
				{
					rtcAudioObserver_->unpublishMediaPlayerAudio();
				}
			}

			void adjustPublishSignalVolume(int volume)
			{
				rtcAudioObserver_->setRecordVolume(volume);
			}

			void adjustPlayoutSignalVolume(int volume)
			{
				rtcAudioObserver_->setPlaybackVolume(volume);
			}

			AgoraRtcChannelPublishHelper() {}
			~AgoraRtcChannelPublishHelper() {}

		private:
			IRtcEngine *rtc_engine_ = nullptr;
			NodeMediaPlayerVideoFrameObserver *mediaPlayerVideoFrameObserver_ = nullptr;
			IAVFramePluginManager* rtcAudioObserver_ = nullptr;
			NodeMediaPlayerAudioFrameObserver* mediaPlayerAudioFrameObserver_ = nullptr;
		};
	} // namespace rtc
} // namespace agora
