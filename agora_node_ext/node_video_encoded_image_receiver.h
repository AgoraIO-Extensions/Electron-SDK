#ifndef AGRORA_NODE_VIDEO_ENCODED_IMAGE_RECEIVER
#define AGRORA_NODE_VIDEO_ENCODED_IMAGE_RECEIVER

#include "IAgoraRtcEngine.h"
#include "node_napi_api.h"
#include "node_async_queue.h"
#include "uv.h"
#include "v8.h"
#include "loguru.hpp"

namespace agora {
    namespace rtc {

        class NodeVideoEncodedImageReceiver : public agora::media::IVideoEncodedImageReceiver {
            public:
            NodeVideoEncodedImageReceiver();
            ~NodeVideoEncodedImageReceiver();
            virtual bool OnEncodedVideoImageReceived(const uint8_t* imageBuffer, unsigned int length, const agora::media::EncodedVideoFrameInfo& videoEncodedFrameInfo) override;
            void AddEventHandler(Persistent<Object>& js_this, Persistent<Function>& callback);
            void ClearEventHandler();

            private:
            Persistent<Object> js_this_;
            Persistent<Function> callback_;
        };

    }
}

#endif // AGRORA_NODE_VIDEO_ENCODED_IMAGE_RECEIVER