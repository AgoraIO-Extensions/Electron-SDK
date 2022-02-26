#include "node_media_player_observer.h"

namespace agora {
namespace rtc {
NodeMediaPlayerObserver::NodeMediaPlayerObserver() {
  LOG_F(INFO, "NodeMediaPlayerObserver::NodeMediaPlayerObserver");
}

NodeMediaPlayerObserver::~NodeMediaPlayerObserver() {
  std::unordered_map<std::string, MediaPlayerEventCallback *>::iterator
      _iterator;
  for (_iterator = m_callbacks.begin(); _iterator != m_callbacks.end();) {
    MediaPlayerEventCallback *callback = _iterator->second;
    if (callback) {
      delete callback;
      callback = NULL;
    }
    m_callbacks.erase(_iterator++);
  }
  LOG_F(INFO, " NodeMediaPlayerObserver::~NodeMediaPlayerObserver");
}

void NodeMediaPlayerObserver::onPlayerSourceStateChanged(
    media::base::MEDIA_PLAYER_STATE state, media::base::MEDIA_PLAYER_ERROR ec) {
  node_async_call::async_call([this, state, ec] {
    MEDIA_PLAYER_MAKE_JS_CALL_2(MEDIA_PLAYER_ON_PLAYER_STATE_CHANGED, int32,
                                state, int32, ec);
  });
}

void NodeMediaPlayerObserver::onPositionChanged(int64_t position) {
  node_async_call::async_call([this, position] {
    MEDIA_PLAYER_MAKE_JS_CALL_1(MEDIA_PLAYER_ON_POSITION_CHANGED, uint64,
                                position);
  });
}

void NodeMediaPlayerObserver::onPlayerEvent(
    media::base::MEDIA_PLAYER_EVENT eventCode, int64_t elapsedTime,
    const char *message) {
  std::string msg;
  if (message)
    msg.assign(message);

  node_async_call::async_call([this, eventCode, elapsedTime, msg] {
    MEDIA_PLAYER_MAKE_JS_CALL_3(MEDIA_PLAYER_ON_PLAY_EVENT, uint32, eventCode, uint64, eventCode, string, msg.c_str())
  });
}

void NodeMediaPlayerObserver::onMetaData(const void *data, int length) {
  // node_async_call::async_call([this, type, ])
}
void NodeMediaPlayerObserver::onPreloadEvent(
    const char *src, media::base::PLAYER_PRELOAD_EVENT event) {}
void NodeMediaPlayerObserver::onAgoraCDNTokenWillExpire() {}
void NodeMediaPlayerObserver::onPlayerSrcInfoChanged(
    const media::base::SrcInfo &from, const media::base::SrcInfo &to) {}
void NodeMediaPlayerObserver::onPlayerInfoUpdated(
    const media::base::PlayerUpdatedInfo &info) {}
void NodeMediaPlayerObserver::onAudioVolumeIndication(int volume) {}

void NodeMediaPlayerObserver::onPlayBufferUpdated(int64_t playCachedBuffer) {}

void NodeMediaPlayerObserver::onCompleted() {}

void NodeMediaPlayerObserver::fireApiError(const char *funcName) {
  node_async_call::async_call([this, funcName] {
    MEDIA_PLAYER_MAKE_JS_CALL_1(MEDIA_PLAYER_ON_FIRE_API_ERROR, string,
                                funcName);
  });
}

void NodeMediaPlayerObserver::addEventHandler(const std::string &eventName,
                                              Persistent<Object> &obj,
                                              Persistent<Function> &callback) {
  MediaPlayerEventCallback *cb = new MediaPlayerEventCallback();
  ;
  cb->js_this.Reset(obj);
  cb->callback.Reset(callback);
  m_callbacks.emplace(eventName, cb);
}
} // namespace rtc
} // namespace agora
