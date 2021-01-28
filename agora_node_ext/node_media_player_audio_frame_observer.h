#ifndef NODE_MEDIA_PLAYER_AUDIO_FRAME_OBSERVER
#define NODE_MEDIA_PLAYER_AUDIO_FRAME_OBSERVER

#include <mutex>
#include "IAgoraMediaPlayer.h"
#include "IAgoraRtcEngine.h"
#include "agora_rtc_channel_publish_helper.h"

namespace agora
{
    namespace rtc
    {
        class NodeMediaPlayerAudioFrameObserver : public agora::media::base::IAudioFrameObserver
        {
            public:
            virtual void onFrame(const agora::media::base::AudioPcmFrame *frame) override
            {
                std::lock_guard<std::mutex> lck(mtx_);
                AgoraRtcChannelPublishHelper::Get()->pushAudioData((void *)(&frame->data_[0]), frame->bytes_per_sample * frame->samples_per_channel_);

            }

            void publishAudioToRtc() {
                std::lock_guard<std::mutex> lck(mtx_);
                isPublishAudioFrame = true;
            }

            void unpublishAudioToRtc() {
                std::lock_guard<std::mutex> lck(mtx_);
                isPublishAudioFrame = false;
            }

            private:
            std::mutex mtx_;
            bool isPublishAudioFrame = false;

        };
    } // namespace rtc
} // namespace agora

#endif // NODE_MEDIA_PLAYER_AUDIO_FRAME_OBSERVER