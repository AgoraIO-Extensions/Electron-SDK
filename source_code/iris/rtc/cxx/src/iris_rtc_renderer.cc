//
// Created by LXH on 2021/3/4.
//

#include "iris_rtc_renderer.h"
#include "internal/iris_json_utils.h"
#include "libyuv.h"
#include "loguru.hpp"
#include <mutex>
#include <unordered_map>

namespace agora {
namespace iris {
namespace rtc {
using rapidjson::Document;
using rapidjson::Value;

class IrisRtcRendererCache : public IrisRtcRendererCacheConfig {
 public:
  IrisRtcRendererCache()
      : IrisRtcRendererCacheConfig(IrisRtcVideoFrameObserver::kFrameTypeYUV420),
        is_new_frame(true) {}

  explicit IrisRtcRendererCache(const IrisRtcRendererCacheConfig &rhs)
      : IrisRtcRendererCacheConfig(rhs.type, rhs.delegate, rhs.resize_width,
                                   rhs.resize_height),
        is_new_frame(true) {}

  IrisRtcRendererCache &operator=(const IrisRtcRendererCacheConfig &rhs) {
    if (this == &rhs) { return *this; }
    type = rhs.type;
    delegate = rhs.delegate;
    resize_width = rhs.resize_width;
    resize_height = rhs.resize_height;
    return *this;
  }

 public:
  bool is_new_frame;
};

IrisRtcRendererCacheConfig::IrisRtcRendererCacheConfig(
    IrisRtcVideoFrameObserver::VideoFrameType type,
    IrisRtcRendererDelegate *delegate, int resize_width, int resize_height)
    : IrisRtcVideoFrameObserver::VideoFrame(), delegate(delegate),
      resize_width(resize_width), resize_height(resize_height) {
  IrisRtcVideoFrameObserver::VideoFrame::type = type;
}

class IrisRtcRenderer::IrisRtcRendererImpl {
 private:
  typedef std::unordered_map<unsigned int, IrisRtcRendererCache>
      IrisRendererCacheMap;

 public:
  IrisRtcRendererImpl() : event_handler_(nullptr) {}
  virtual ~IrisRtcRendererImpl() { RemoveAllCaches(); }

  void EnableVideoFrameCache(const IrisRtcRendererCacheConfig &cache_config,
                             unsigned int uid, const char *channel_id) {
    // lock
    std::lock_guard<std::mutex> lock_guard(mutex_);

    auto it = render_cache_map_.find(channel_id);
    if (it == render_cache_map_.end()) {
      render_cache_map_.emplace(channel_id, IrisRendererCacheMap());
    }

    it = render_cache_map_.find(channel_id);
    auto it_ = it->second.find(uid);
    if (it_ == it->second.end()) {
      it->second.emplace(uid, IrisRtcRendererCache(cache_config));
    } else {
      it_->second = cache_config;
    }
  }

  void DisableVideoFrameCache(const IrisRtcRendererDelegate *delegate) {
    // lock
    std::lock_guard<std::mutex> lock_guard(mutex_);

    if (render_cache_map_.empty()) return;

    auto it = render_cache_map_.begin();
    for (; it != render_cache_map_.end(); ++it) {
      auto it_ = it->second.begin();
      while (it_ != it->second.end()) {
        if (it_->second.delegate == delegate) {
          DeleteCache(it->second, it_);
        } else {
          ++it_;
        }
      }
    }
  }

  void DisableVideoFrameCache(unsigned int uid, const char *channel_id) {
    // lock
    std::lock_guard<std::mutex> lock_guard(mutex_);

    if (uid == -1) {
      RemoveAllCaches();
      return;
    }

    auto it = render_cache_map_.find(channel_id);
    if (it == render_cache_map_.end()) { return; }

    auto it_ = it->second.find(uid);
    if (it_ == it->second.end()) { return; }

    DeleteCache(it->second, it_);
  }

  bool SetVideoFrameInternal(
      const IrisRtcVideoFrameObserver::VideoFrame &src_video_frame,
      unsigned int uid, const char *channel_id) {
    // lock
    std::lock_guard<std::mutex> lock_guard(mutex_);

    auto it = render_cache_map_.find(channel_id);
    if (it == render_cache_map_.end()) { return false; }
    auto it_ = it->second.find(uid);
    if (it_ == it->second.end()) { return false; }

    auto &dst_video_frame = it_->second;

    // the size of last video frame
    auto last_video_frame_width = dst_video_frame.width;
    auto last_video_frame_height = dst_video_frame.height;

    // set the video frame as new.
    dst_video_frame.is_new_frame = true;
    dst_video_frame.width = dst_video_frame.resize_width > 0
        ? dst_video_frame.resize_width
        : src_video_frame.width;
    dst_video_frame.height = dst_video_frame.resize_height > 0
        ? dst_video_frame.resize_height
        : src_video_frame.height;

    auto resize = last_video_frame_width != dst_video_frame.width
        || last_video_frame_height != dst_video_frame.height;

    if (dst_video_frame.type == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
      if (dst_video_frame.width != src_video_frame.width
          || dst_video_frame.height != src_video_frame.height) {
        // the new video frame size is different with the last one.
        int dst_stride_y = dst_video_frame.width;
        if (dst_stride_y & 0xf) {
          // make sure the stride_y is multiple of 16
          dst_stride_y = (((dst_stride_y + 3) >> 4) << 4);
        }
        dst_video_frame.y_stride = dst_stride_y;
        dst_video_frame.u_stride = dst_stride_y / 2;
        dst_video_frame.v_stride = dst_stride_y / 2;
        dst_video_frame.ResizeBuffer();
        libyuv::I420Scale(
            (uint8_t *) src_video_frame.y_buffer, src_video_frame.y_stride,
            (uint8_t *) src_video_frame.u_buffer, src_video_frame.u_stride,
            (uint8_t *) src_video_frame.v_buffer, src_video_frame.v_stride,
            src_video_frame.width, src_video_frame.height,
            (uint8_t *) dst_video_frame.y_buffer, dst_video_frame.y_stride,
            (uint8_t *) dst_video_frame.u_buffer, dst_video_frame.u_stride,
            (uint8_t *) dst_video_frame.v_buffer, dst_video_frame.v_stride,
            dst_video_frame.width, dst_video_frame.height, libyuv::kFilterNone);
      } else {
        // the new video frame size is same as the last one.
        int dst_stride_y = src_video_frame.y_stride;
        if (dst_stride_y & 0xf) {
          // make sure the stride_y is multiple of 16
          dst_stride_y = (((dst_stride_y + 3) >> 4) << 4);
        }
        dst_video_frame.y_stride = dst_stride_y;
        dst_video_frame.u_stride = dst_stride_y / 2;
        dst_video_frame.v_stride = dst_stride_y / 2;
        dst_video_frame.ResizeBuffer();
        CopyAndCentreYuv(
            (uint8_t *) src_video_frame.y_buffer, src_video_frame.y_stride,
            (uint8_t *) src_video_frame.u_buffer, src_video_frame.u_stride,
            (uint8_t *) src_video_frame.v_buffer, src_video_frame.v_stride,
            src_video_frame.width, src_video_frame.height,
            (uint8_t *) dst_video_frame.y_buffer, dst_video_frame.y_stride,
            (uint8_t *) dst_video_frame.u_buffer, dst_video_frame.u_stride,
            (uint8_t *) dst_video_frame.v_buffer, dst_video_frame.v_stride);
      }
    } else if (dst_video_frame.type
               == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
      if (dst_video_frame.width != src_video_frame.width
          || dst_video_frame.height != src_video_frame.height) {
        // the new video frame size is different with the last one.
        dst_video_frame.y_stride = src_video_frame.y_stride;
        dst_video_frame.ResizeBuffer();
        libyuv::ARGBScale(
            (uint8_t *) src_video_frame.y_buffer, src_video_frame.y_stride,
            src_video_frame.width, src_video_frame.height,
            (uint8_t *) dst_video_frame.y_buffer, dst_video_frame.y_stride,
            dst_video_frame.width, dst_video_frame.height, libyuv::kFilterNone);
      } else {
        // the new video frame size is same as the last one.
        dst_video_frame.y_stride = src_video_frame.y_stride;
        dst_video_frame.ResizeBuffer();
        memcpy(dst_video_frame.y_buffer, src_video_frame.y_buffer,
               dst_video_frame.y_stride * dst_video_frame.height);
      }
    }
    dst_video_frame.rotation = src_video_frame.rotation;
    dst_video_frame.render_time_ms = src_video_frame.render_time_ms;
    dst_video_frame.av_sync_type = src_video_frame.av_sync_type;

    if (event_handler_ && resize) {
      Document document;
      Value value(rapidjson::kObjectType);
      SET_VALUE(document, value, uid, uid)
      SET_VALUE_CHAR(document, value, channelId, channel_id)
      SET_VALUE(document, value, width, dst_video_frame.y_stride)
      SET_VALUE(document, value, height, dst_video_frame.height)
      SET_VALUE(document, value, elapsed, 0)
      if (uid == 0) {
        LOG_F(INFO,
              "IrisRtcRender SetVideoFrameInternal onFirstLocalVideoFrame");
        event_handler_->OnEvent("onFirstLocalVideoFrame",
                                ToJsonString(value).c_str());

      } else {
        LOG_F(INFO,
              "IrisRtcRender SetVideoFrameInternal onFirstRemoteVideoFrame");
        event_handler_->OnEvent("onFirstRemoteVideoFrame",
                                ToJsonString(value).c_str());
      }
    }

    if (dst_video_frame.delegate) {
      dst_video_frame.delegate->OnVideoFrameReceived(dst_video_frame, resize);
    }
    return true;
  }

  void GetVideoFrameInternal(IrisRtcRendererCache *&renderer_cache,
                             unsigned int uid, const char *channel_id) {
    // lock
    std::lock_guard<std::mutex> lock_guard(mutex_);

    auto it = render_cache_map_.find(channel_id);
    if (it == render_cache_map_.end()) {
      renderer_cache = nullptr;
      return;
    }
    auto it_ = it->second.find(uid);
    if (it_ == it->second.end()) {
      renderer_cache = nullptr;
      return;
    }

    renderer_cache = &it_->second;
  }

  bool GetVideoFrame(IrisRtcVideoFrameObserver::VideoFrame &video_frame,
                     bool &is_new_frame, unsigned int uid,
                     const char *channel_id) {
    IrisRtcRendererCache *cache;
    GetVideoFrameInternal(cache, uid, channel_id);
    if (!cache) { return false; }
    // already set size, not copy if size not same
    if (video_frame.width != 0 && video_frame.height != 0) {
      if (video_frame.width != cache->width
          || video_frame.height != cache->height) {
        return false;
      }
    }
    is_new_frame = cache->is_new_frame;
    cache->is_new_frame = false;
    video_frame = *(IrisRtcVideoFrameObserver::VideoFrame *) cache;
    return true;
  }

 private:
  static void CopyAndCentreYuv(const uint8_t *src_y, int src_stride_y,
                               const uint8_t *src_u, int src_stride_u,
                               const uint8_t *src_v, int src_stride_v,
                               int width, int height, uint8_t *dst_y,
                               int dst_stride_y, uint8_t *dst_u,
                               int dst_stride_u, uint8_t *dst_v,
                               int dst_stride_v) {
    if (src_stride_y == width && dst_stride_y == width) {
      memcpy(dst_y, src_y, src_stride_y * height);
      memcpy(dst_u, src_u, src_stride_u * height / 2);
      memcpy(dst_v, src_v, src_stride_v * height / 2);
      return;
    }

    int diff = dst_stride_y - width;
    // RGB(0,0,0) to YUV(0,128,128)
    memset(dst_y, 0, dst_stride_y * height);
    memset(dst_u, 128, dst_stride_u * height / 2);
    memset(dst_v, 128, dst_stride_v * height / 2);

    for (int i = 0; i < height; ++i) {
      memcpy(dst_y + (diff >> 1), src_y, width);
      src_y += src_stride_y;
      dst_y += dst_stride_y;

      if (i % 2 == 0) {
        memcpy(dst_u + (diff >> 2), src_u, width >> 1);
        src_u += src_stride_u;
        dst_u += dst_stride_u;

        memcpy(dst_v + (diff >> 2), src_v, width >> 1);
        src_v += src_stride_v;
        dst_v += dst_stride_v;
      }
    }
  }

  static void DeleteCache(IrisRendererCacheMap &map,
                          IrisRendererCacheMap::iterator &iterator) {
    auto &current_cache = iterator->second;
    // Delete the provider cache now.
    iterator = map.erase(iterator);
    current_cache.ClearBuffer();
  }

  void RemoveAllCaches() {
    if (render_cache_map_.empty()) return;

    auto it = render_cache_map_.begin();
    for (; it != render_cache_map_.end(); ++it) {
      auto it_ = it->second.begin();
      while (it_ != it->second.end()) { DeleteCache(it->second, it_); }
    }
  }

 public:
  IrisEventHandler *event_handler_;

 private:
  std::unordered_map<std::string, IrisRendererCacheMap> render_cache_map_;
  std::mutex mutex_;
};

IrisRtcRenderer::IrisRtcRenderer() : renderer_(new IrisRtcRendererImpl) {}

IrisRtcRenderer::~IrisRtcRenderer() {
  if (renderer_) {
    delete renderer_;
    renderer_ = nullptr;
  }
}

void IrisRtcRenderer::SetEventHandler(IrisEventHandler *event_handler) {
  renderer_->event_handler_ = event_handler;
}

void IrisRtcRenderer::EnableVideoFrameCache(
    const IrisRtcRendererCacheConfig &cache_config, unsigned int uid,
    const char *channel_id) {
  renderer_->EnableVideoFrameCache(cache_config, uid, channel_id);
}

void IrisRtcRenderer::DisableVideoFrameCache(
    const IrisRtcRendererDelegate *delegate) {
  renderer_->DisableVideoFrameCache(delegate);
}

void IrisRtcRenderer::DisableVideoFrameCache(unsigned int uid,
                                             const char *channel_id) {
  renderer_->DisableVideoFrameCache(uid, channel_id);
}

void IrisRtcRenderer::SetVideoFrameInternal(
    const IrisRtcVideoFrameObserver::VideoFrame &video_frame, unsigned int uid,
    const char *channel_id) {
  renderer_->SetVideoFrameInternal(video_frame, uid, channel_id);
}

bool IrisRtcRenderer::GetVideoFrameInternal(
    IrisRtcVideoFrameObserver::VideoFrame &video_frame, unsigned int uid,
    const char *channel_id) {
  IrisRtcRendererCache *cache;
  renderer_->GetVideoFrameInternal(cache, uid, channel_id);
  if (!cache) { return false; }
  video_frame = *(IrisRtcVideoFrameObserver::VideoFrame *) cache;
  return true;
}

bool IrisRtcRenderer::GetVideoFrame(
    IrisRtcVideoFrameObserver::VideoFrame &video_frame, bool &is_new_frame,
    unsigned int uid, const char *channel_id) {
  return renderer_->GetVideoFrame(video_frame, is_new_frame, uid, channel_id);
}
}// namespace rtc
}// namespace iris
}// namespace agora
