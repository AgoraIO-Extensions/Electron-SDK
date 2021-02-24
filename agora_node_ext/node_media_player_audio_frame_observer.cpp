#include "node_media_player_audio_frame_observer.h"
#include "agora_rtc_channel_publish_helper.h"

namespace agora
{
    namespace rtc
    {

        void NodeMediaPlayerAudioFrameObserver::onFrame(const agora::media::base::AudioPcmFrame *frame)
        {
            std::lock_guard<std::mutex> lck(mtx_);
            if (isPublishAudioFrame || isPlaybackAudioFrame) {
                AgoraRtcChannelPublishHelper::Get()->pushAudioData((void *)(&frame->data_[0]), frame->bytes_per_sample * frame->samples_per_channel_);
            }
        }
    }
}