#ifndef AGORA_ELECTRON_MEDIA_PLAYER
#define AGORA_ELECTRON_MEDIA_PLAYER

#include <node.h>
#include <node_object_wrap.h>
#include "node_log.h"
#include "node_napi_api.h"
#include <functional>
#include <list>
#include <mutex>
#include <unordered_set>
#include <map>
#include "IAgoraMediaPlayerSource.h"
#include "node_media_player_observer.h"
// #include "node_media_player_video_frame_observer.h"
#include "../common/loguru.hpp"

namespace agora {
    namespace rtc {

                /*
        * Used to declare native interface to nodejs
        */
        #define NAPI_API_MEDIA_PLAYER(m) \
            static void (m)(const Nan::FunctionCallbackInfo<Value>& args)

        struct IMediaPlayerSourceWraper {
            agora_refptr<IMediaPlayer> m_mediaPlayerSource;
        };

         class NodeMediaPlayer : public node::ObjectWrap {
             
             typedef NodeString nodestring;

            public:
                NodeMediaPlayer(Isolate *isolate, IMediaPlayerSourceWraper* mediaPlayer);
                ~NodeMediaPlayer();
                static void createInstance(const FunctionCallbackInfo<Value>& args);
                static Local<Object> Init(Isolate* isolate, agora_refptr<IMediaPlayer> mediaPlayer);
                NAPI_API_MEDIA_PLAYER(open);
                NAPI_API_MEDIA_PLAYER(play);
                NAPI_API_MEDIA_PLAYER(pause);
                NAPI_API_MEDIA_PLAYER(stop);
                NAPI_API_MEDIA_PLAYER(seek);
                NAPI_API_MEDIA_PLAYER(getPlayPosition);
                NAPI_API_MEDIA_PLAYER(getDuration);
                NAPI_API_MEDIA_PLAYER(getStreamCount);
                NAPI_API_MEDIA_PLAYER(getSourceId);
                NAPI_API_MEDIA_PLAYER(getStreamInfo);
                NAPI_API_MEDIA_PLAYER(setPlayerOption);
                NAPI_API_MEDIA_PLAYER(changePlaybackSpeed);
                NAPI_API_MEDIA_PLAYER(selectAudioTrack);

                NAPI_API_MEDIA_PLAYER(onEvent);

//   virtual int registerPlayerObserver(IMediaPlayerObserver* observer) = 0;
//   virtual int unregisterPlayerObserver(IMediaPlayerObserver* observer) = 0;
//   virtual int registerVideoFrameObserver(agora::media::base::IVideoFrameObserver* observer) = 0;
//   virtual int unregisterVideoFrameObserver(agora::media::base::IVideoFrameObserver* observer) = 0;
//   virtual int registerAudioFrameObserver(agora::media::base::IAudioFrameObserver* observer) = 0;
//   virtual int unregisterAudioFrameObserver(agora::media::base::IAudioFrameObserver* observer) = 0;
            private:
                DECLARE_CLASS;
                Isolate *isolate = NULL;
                IMediaPlayerSourceWraper* mMediaPlayer = NULL;
                NodeMediaPlayerObserver *nodeMediaPlayerObserver = NULL;
                // NodeMediaPlayerVideoFrameObserver *nodeMediaPlayerVideoFrameObserver = NULL;
         };
    }
}



#endif
