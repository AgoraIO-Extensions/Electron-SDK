#ifndef NODE_MEDIA_PLAYER_AUDIO_FRAME_OBSERVER
#define NODE_MEDIA_PLAYER_AUDIO_FRAME_OBSERVER

#include <mutex>
#include "IAgoraMediaPlayer.h"
#include "IAgoraRtcEngine.h"

namespace agora
{
    namespace rtc
    {
        class NodeMediaPlayerAudioFrameObserver : public agora::media::base::IAudioFrameObserver
        {
            public:
            virtual void onFrame(const agora::media::base::AudioPcmFrame *frame) override;

            void publishAudioToRtc(bool publishAudio, bool playbackAudio) {
                std::lock_guard<std::mutex> lck(mtx_);
                isPublishAudioFrame = publishAudio;
                isPlaybackAudioFrame = playbackAudio;

            }

            void unpublishAudioToRtc() {
                std::lock_guard<std::mutex> lck(mtx_);
                isPublishAudioFrame = false;
                isPlaybackAudioFrame = false;
            }

            private:
            std::mutex mtx_;
            bool isPublishAudioFrame = false;
            bool isPlaybackAudioFrame = false;
        };
    } // namespace rtc
} // namespace agora

#endif // NODE_MEDIA_PLAYER_AUDIO_FRAME_OBSERVER