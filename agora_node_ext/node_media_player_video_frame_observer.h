#ifndef NODE_MEDIA_PLAYER_VIDEO_FRAME_OBSERVER
#define NODE_MEDIA_PLAYER_VIDEO_FRAME_OBSERVER
#include "IAgoraMediaPlayer.h"
#include <unordered_map>
#include "node_napi_api.h"
#include "node_async_queue.h"
#include <string>
#include <uv.h>

namespace agora {
    namespace rtc {
        class NodeMediaPlayerVideoFrameObserver : public agora::media::base::IVideoFrameObserver {
            // public:
            //     NodeMediaPlayerVideoFrameObserver();
            //     ~NodeMediaPlayerVideoFrameObserver();
            //     virtual void onFrame(const agora::media::base::VideoFrame* frame) override;
            //     virtual void initialize(Isolate *isolate, Persistent<Function> callback, Persistent<Object> js_this);

            // private:
            //     Isolate* _isolate;
            //     Persistent<Function> _callback;
            //     Persistent<Object> _js_this;
         };
    }
}
#endif