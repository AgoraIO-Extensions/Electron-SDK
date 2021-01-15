#ifndef AGORA_NODE_META_DATA_OBSERVER
#define AGORA_NODE_META_DATA_OBSERVER

#include "IAgoraRtcEngine.h"
#include "node_napi_api.h"
#include "node_async_queue.h"
#include "uv.h"
#include "v8.h"
#include <queue>
#include <mutex>
#include "loguru.hpp"
#include <string.h>

namespace agora {
    namespace rtc {
        class NodeMetadataObserver : public agora::rtc::IMetadataObserver {

            public:
                NodeMetadataObserver();
                ~NodeMetadataObserver();

                virtual int getMaxMetadataSize() override;

                virtual bool onReadyToSendMetadata(Metadata& metadata, VIDEO_SOURCE_TYPE source_type) override;

                virtual void onMetadataReceived(const Metadata &metadata) override;

                virtual int sendMetadata(unsigned int uid, unsigned int size, unsigned char *buffer, long long timeStampMs);

                virtual int addEventHandler(Persistent<Object>& obj, Persistent<Function>& callback, Persistent<Function>& callback2);

                virtual int setMaxMetadataSize(int size);

                virtual void clearData();

            private:
                std::queue<Metadata *> messageQueue;
                std::mutex queueMutex;
                Persistent<Object> js_this;
                Persistent<Function> callback;
                Persistent<Function> messageSendCallback;
                int MAX_META_DATA_SIZE = 1024;
        };
    }
}

#endif
