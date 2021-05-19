//
// Created by LXH on 2021/3/1.
//

#include "iris_rtc_raw_data.h"
#include "IAgoraMediaEngine.h"
#include "IAgoraRtcEngine.h"
#include "iris_rtc_raw_data_plugin_manager.h"
#include "iris_rtc_renderer.h"
#include "libyuv.h"
#include "loguru.hpp"
#include <list>
#include <string>
#include <utility>
#include <vector>

namespace agora {
using namespace rtc;
using namespace media;

namespace iris {
namespace rtc {

IrisRtcAudioFrameObserver::AudioFrame::AudioFrame()
    : type(kFrameTypePCM16), samples(0), bytes_per_sample(0), channels(0),
      samples_per_sec(0), buffer(nullptr), buffer_length(0), render_time_ms(0),
      av_sync_type(0) {}

IrisRtcAudioFrameObserver::AudioFrame::~AudioFrame() = default;

IrisRtcAudioFrameObserver::AudioFrame &
IrisRtcAudioFrameObserver::AudioFrame::operator=(
    const IrisRtcAudioFrameObserver::AudioFrame &rhs) {
  if (this == &rhs) { return *this; }
  type = rhs.type;
  samples = rhs.samples;
  bytes_per_sample = rhs.bytes_per_sample;
  channels = rhs.channels;
  samples_per_sec = rhs.samples_per_sec;
  if (buffer && rhs.buffer) { memcpy(buffer, rhs.buffer, rhs.buffer_length); }
  buffer_length = rhs.buffer_length;
  render_time_ms = rhs.render_time_ms;
  av_sync_type = rhs.av_sync_type;
  return *this;
}

void IrisRtcAudioFrameObserver::AudioFrame::ResizeBuffer() {
  switch (type) {
    case kFrameTypePCM16: {
      if (buffer_length != samples * channels * samples_per_sec) {
        if (buffer) { free(buffer); }
        buffer_length = samples * channels * samples_per_sec;
        buffer = malloc(buffer_length);
      }
      break;
    }
  }
}

void IrisRtcAudioFrameObserver::AudioFrame::ClearBuffer() {
  if (buffer) {
    free(buffer);
    buffer = nullptr;
  }
}

IrisRtcVideoFrameObserver::VideoFrame::VideoFrame()
    : type(kFrameTypeYUV420), width(0), height(0), y_stride(0), u_stride(0),
      v_stride(0), y_buffer(nullptr), u_buffer(nullptr), v_buffer(nullptr),
      y_buffer_length(0), u_buffer_length(0), v_buffer_length(0), rotation(0),
      render_time_ms(0), av_sync_type(0) {}

IrisRtcVideoFrameObserver::VideoFrame::~VideoFrame() = default;

IrisRtcVideoFrameObserver::VideoFrame &
IrisRtcVideoFrameObserver::VideoFrame::operator=(
    const IrisRtcVideoFrameObserver::VideoFrame &rhs) {
  if (this == &rhs) { return *this; }
  type = rhs.type;
  width = rhs.width;
  height = rhs.height;
  y_stride = rhs.y_stride;
  u_stride = rhs.u_stride;
  v_stride = rhs.v_stride;
  if (y_buffer && rhs.y_buffer) {
    memcpy(y_buffer, rhs.y_buffer, rhs.y_buffer_length);
  }
  if (u_buffer && rhs.u_buffer) {
    memcpy(u_buffer, rhs.u_buffer, rhs.u_buffer_length);
  }
  if (v_buffer && rhs.v_buffer) {
    memcpy(v_buffer, rhs.v_buffer, rhs.v_buffer_length);
  }
  y_buffer_length = rhs.y_buffer_length;
  u_buffer_length = rhs.u_buffer_length;
  v_buffer_length = rhs.v_buffer_length;
  rotation = rhs.rotation;
  render_time_ms = rhs.render_time_ms;
  av_sync_type = rhs.av_sync_type;
  return *this;
}

void IrisRtcVideoFrameObserver::VideoFrame::ResizeBuffer() {
  switch (type) {
    case kFrameTypeYUV420: {
      if (y_buffer_length != y_stride * height) {
        if (y_buffer) { free(y_buffer); }
        y_buffer_length = y_stride * height;
        y_buffer = malloc(y_buffer_length);
      }
      // u_stride = y_stride / 2 and u_height = height / 2, same as y_stride * height / 4
      if (u_buffer_length != u_stride * height / 2) {
        if (u_buffer) { free(u_buffer); }
        u_buffer_length = u_stride * height / 2;
        u_buffer = malloc(u_buffer_length);
      }
      // v_stride = y_stride / 2 and v_height = height / 2, same as y_stride * height / 4
      if (v_buffer_length != v_stride * height / 2) {
        if (v_buffer) { free(v_buffer); }
        v_buffer_length = v_stride * height / 2;
        v_buffer = malloc(v_buffer_length);
      }
      break;
    }
    case kFrameTypeYUV422: {
      if (y_buffer_length != y_stride * height) {
        if (y_buffer) { free(y_buffer); }
        y_buffer_length = y_stride * height;
        y_buffer = malloc(y_buffer_length);
      }
      // u_stride = y_stride / 2 and u_height = height, same as y_stride * height / 2
      if (u_buffer_length != u_stride * height) {
        if (u_buffer) { free(u_buffer); }
        u_buffer_length = u_stride * height;
        u_buffer = malloc(u_buffer_length);
      }
      // v_stride = v_stride / 2 and v_height = height, same as y_stride * height / 2
      if (v_buffer_length != v_stride * height) {
        if (v_buffer) { free(v_buffer); }
        v_buffer_length = v_stride * height;
        v_buffer = malloc(v_buffer_length);
      }
      break;
    }
    case kFrameTypeRGBA: {
      // y_stride = width * 4
      if (y_buffer_length != y_stride * height) {
        if (y_buffer) { free(y_buffer); }
        y_buffer_length = y_stride * height;
        y_buffer = malloc(y_buffer_length);
      }
      if (u_buffer) { free(u_buffer); }
      u_buffer_length = 0;
      u_buffer = nullptr;
      if (v_buffer) { free(v_buffer); }
      v_buffer_length = 0;
      v_buffer = nullptr;
      break;
    }
  }
}

void IrisRtcVideoFrameObserver::VideoFrame::ClearBuffer() {
  if (y_buffer) {
    free(y_buffer);
    y_buffer = nullptr;
  }
  if (u_buffer) {
    free(u_buffer);
    u_buffer = nullptr;
  }
  if (v_buffer) {
    free(v_buffer);
    v_buffer = nullptr;
  }
}

class AudioFrameObserver : public IAudioFrameObserver {
 private:
  struct ObserverEntry {
    ObserverEntry(IrisRtcAudioFrameObserver *observer, int order,
                  std::string identifier)
        : observer_(observer), order_(order),
          identifier_(std::move(identifier)) {}

    IrisRtcAudioFrameObserver *observer_;
    int order_;
    std::string identifier_;
  };
  typedef std::list<ObserverEntry *> ObserverEntryList;

 public:
  AudioFrameObserver() = default;

  virtual ~AudioFrameObserver() { RemoveAllObservers(); }

 private:
  static void CopyAudioFrame(IrisRtcAudioFrameObserver::AudioFrame &dst,
                             const AudioFrame &src) {
    dst.type = static_cast<IrisRtcAudioFrameObserver::AudioFrameType>(src.type);
    dst.samples = src.samples;
    dst.bytes_per_sample = src.bytesPerSample;
    dst.channels = src.channels;
    dst.samples_per_sec = src.samplesPerSec;
    dst.buffer = src.buffer;
    dst.buffer_length = src.samples * src.channels * src.bytesPerSample;
    dst.render_time_ms = src.renderTimeMs;
    dst.av_sync_type = src.avsync_type;
  }

 private:
  bool onRecordAudioFrame(AudioFrame &audioFrame) override {
    IrisRtcAudioFrameObserver::AudioFrame audio_frame{};
    CopyAudioFrame(audio_frame, audioFrame);

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      (*it)->observer_->OnRecordAudioFrame(audio_frame);
    }
    return true;
  }

  bool onPlaybackAudioFrame(AudioFrame &audioFrame) override {
    IrisRtcAudioFrameObserver::AudioFrame audio_frame{};
    CopyAudioFrame(audio_frame, audioFrame);

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      (*it)->observer_->OnPlaybackAudioFrame(audio_frame);
    }
    return true;
  }

  bool onMixedAudioFrame(AudioFrame &audioFrame) override {
    IrisRtcAudioFrameObserver::AudioFrame audio_frame{};
    CopyAudioFrame(audio_frame, audioFrame);

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      (*it)->observer_->OnMixedAudioFrame(audio_frame);
    }
    return true;
  }

  bool onPlaybackAudioFrameBeforeMixing(unsigned int uid,
                                        AudioFrame &audioFrame) override {
    IrisRtcAudioFrameObserver::AudioFrame audio_frame{};
    CopyAudioFrame(audio_frame, audioFrame);

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      (*it)->observer_->OnPlaybackAudioFrameBeforeMixing(uid, audio_frame);
    }
    return true;
  }

  bool isMultipleChannelFrameWanted() override { return true; }

  bool onPlaybackAudioFrameBeforeMixingEx(const char *channelId,
                                          unsigned int uid,
                                          AudioFrame &audioFrame) override {
    IrisRtcAudioFrameObserver::AudioFrame audio_frame{};
    CopyAudioFrame(audio_frame, audioFrame);

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      auto observer = (*it)->observer_;
      if (observer->IsMultipleChannelFrameWanted()) {
        observer->OnPlaybackAudioFrameBeforeMixingEx(channelId, uid,
                                                     audio_frame);
      }
    }
    return true;
  }

 public:
  void RegisterObserver(IrisRtcAudioFrameObserver *observer, int order,
                        const char *identifier) {
    auto observer_entry = new ObserverEntry(observer, order, identifier);
    if (observer_entry_list_.empty()) {
      observer_entry_list_.push_back(observer_entry);
      return;
    }

    // Insert before the first entry with a higher |order| value.
    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      if ((*it)->order_ > order) { break; }
    }

    observer_entry_list_.emplace(it, observer_entry);
  }

  void UnRegisterObserver(const char *identifier) {
    if (observer_entry_list_.empty()) return;

    auto it = observer_entry_list_.begin();
    while (it != observer_entry_list_.end()) {
      if ((*it)->identifier_ == identifier) {
        DeleteObserver(it);
      } else {
        ++it;
      }
    }
  }

 private:
  void DeleteObserver(ObserverEntryList::iterator &iterator) {
    ObserverEntry *current_entry = *(iterator);
    // Delete the provider entry now.
    iterator = observer_entry_list_.erase(iterator);
    delete current_entry;
  }

  void RemoveAllObservers() {
    if (observer_entry_list_.empty()) return;

    auto it = observer_entry_list_.begin();
    while (it != observer_entry_list_.end()) { DeleteObserver(it); }
  }

 private:
  ObserverEntryList observer_entry_list_;
};

class VideoFrameObserver : public IVideoFrameObserver {
 private:
  struct ObserverEntry {
    ObserverEntry(IrisRtcVideoFrameObserver *observer, int order,
                  std::string identifier)
        : observer_(observer), order_(order),
          identifier_(std::move(identifier)) {}

    IrisRtcVideoFrameObserver *observer_;
    int order_;
    std::string identifier_;
  };
  typedef std::list<ObserverEntry *> ObserverEntryList;

 public:
  explicit VideoFrameObserver(IrisRtcRenderer *renderer)
      : renderer_(renderer) {}

  virtual ~VideoFrameObserver() { RemoveAllObservers(); }

 private:
  static void I420(IrisRtcVideoFrameObserver::VideoFrame &dst,
                   const VideoFrame &src) {
    dst.type = IrisRtcVideoFrameObserver::kFrameTypeYUV420;
    dst.width = src.width;
    dst.height = src.height;
    dst.y_stride = src.yStride;
    dst.u_stride = src.uStride;
    dst.v_stride = src.vStride;
    dst.y_buffer = src.yBuffer;
    dst.u_buffer = src.uBuffer;
    dst.v_buffer = src.vBuffer;
    dst.y_buffer_length = src.yStride * src.height;
    dst.u_buffer_length = src.uStride * src.height / 2;
    dst.v_buffer_length = src.vStride * src.height / 2;
    dst.rotation = src.rotation;
    dst.render_time_ms = src.renderTimeMs;
    dst.av_sync_type = src.avsync_type;
  }

  static void RGBA(IrisRtcVideoFrameObserver::VideoFrame &dst,
                   const VideoFrame &src, std::vector<uint8_t> &y_buffer) {
    dst.type = IrisRtcVideoFrameObserver::kFrameTypeRGBA;
    dst.width = src.width;
    dst.height = src.height;
    dst.y_stride = src.width * 4;
    dst.u_stride = 0;
    dst.v_stride = 0;
    y_buffer.resize(dst.y_stride * src.height);
    libyuv::I420ToABGR(static_cast<uint8_t *>(src.yBuffer), src.yStride,
                       static_cast<uint8_t *>(src.uBuffer), src.uStride,
                       static_cast<uint8_t *>(src.vBuffer), src.vStride,
                       &y_buffer[0], dst.y_stride, src.width, src.height);
    dst.y_buffer = y_buffer.data();
    dst.u_buffer = nullptr;
    dst.v_buffer = nullptr;
    dst.y_buffer_length = y_buffer.size();
    dst.u_buffer_length = 0;
    dst.v_buffer_length = 0;
    dst.rotation = src.rotation;
    dst.render_time_ms = src.renderTimeMs;
    dst.av_sync_type = src.avsync_type;
  }

 private:
  bool onCaptureVideoFrame(VideoFrame &videoFrame) override {
    IrisRtcVideoFrameObserver::VideoFrame video_frame_i420;
    I420(video_frame_i420, videoFrame);

    IrisRtcVideoFrameObserver::VideoFrame video_frame_rgba;
    std::vector<uint8_t> y_buffer;

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      auto observer = (*it)->observer_;
      auto format = observer->GetVideoFormatPreference();
      if (format == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
        observer->OnCaptureVideoFrame(video_frame_i420);
      } else if (format == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
        if (y_buffer.empty()) { RGBA(video_frame_rgba, videoFrame, y_buffer); }
        observer->OnCaptureVideoFrame(video_frame_rgba);
      }
    }

    IrisRtcVideoFrameObserver::VideoFrame video_frame;
    if (renderer_->GetVideoFrameInternal(video_frame, 0)) {
      if (video_frame.type == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
        renderer_->SetVideoFrameInternal(video_frame_i420, 0);
      } else if (video_frame.type
                 == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
        if (y_buffer.empty()) { RGBA(video_frame_rgba, videoFrame, y_buffer); }
        renderer_->SetVideoFrameInternal(video_frame_rgba, 0);
      }
    }
    return true;
  }

  bool onRenderVideoFrame(unsigned int uid, VideoFrame &videoFrame) override {
    IrisRtcVideoFrameObserver::VideoFrame video_frame_i420;
    I420(video_frame_i420, videoFrame);

    IrisRtcVideoFrameObserver::VideoFrame video_frame_rgba;
    std::vector<uint8_t> y_buffer;

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      auto observer = (*it)->observer_;
      auto format = observer->GetVideoFormatPreference();
      if (format == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
        observer->OnRenderVideoFrame(uid, video_frame_i420);
      } else if (format == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
        if (y_buffer.empty()) { RGBA(video_frame_rgba, videoFrame, y_buffer); }
        observer->OnRenderVideoFrame(uid, video_frame_rgba);
      }
    }

    IrisRtcVideoFrameObserver::VideoFrame video_frame;
    if (renderer_->GetVideoFrameInternal(video_frame, uid)) {
      if (video_frame.type == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
        renderer_->SetVideoFrameInternal(video_frame_i420, uid);
      } else if (video_frame.type
                 == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
        if (y_buffer.empty()) { RGBA(video_frame_rgba, videoFrame, y_buffer); }
        renderer_->SetVideoFrameInternal(video_frame_rgba, uid);
      }
    }
    return true;
  }

  bool onPreEncodeVideoFrame(VideoFrame &videoFrame) override {
    IrisRtcVideoFrameObserver::VideoFrame video_frame_i420;
    I420(video_frame_i420, videoFrame);

    IrisRtcVideoFrameObserver::VideoFrame video_frame_rgba;
    std::vector<uint8_t> y_buffer;

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      auto observer = (*it)->observer_;
      auto format = observer->GetVideoFormatPreference();
      if (format == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
        observer->OnPreEncodeVideoFrame(video_frame_i420);
      } else if (format == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
        if (y_buffer.empty()) { RGBA(video_frame_rgba, videoFrame, y_buffer); }
        observer->OnPreEncodeVideoFrame(video_frame_rgba);
      }
    }
    return true;
  }

  VIDEO_FRAME_TYPE getVideoFormatPreference() override {
    return VIDEO_FRAME_TYPE::FRAME_TYPE_YUV420;
  }

  uint32_t getObservedFramePosition() override {
    return static_cast<uint32_t>(POSITION_POST_CAPTURER | POSITION_PRE_RENDERER
                                 | POSITION_PRE_ENCODER);
  }

  bool isMultipleChannelFrameWanted() override { return true; }

  bool onRenderVideoFrameEx(const char *channelId, unsigned int uid,
                            VideoFrame &videoFrame) override {
    IrisRtcVideoFrameObserver::VideoFrame video_frame_i420;
    I420(video_frame_i420, videoFrame);

    IrisRtcVideoFrameObserver::VideoFrame video_frame_rgba;
    std::vector<uint8_t> y_buffer;

    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      auto observer = (*it)->observer_;
      if (observer->IsMultipleChannelFrameWanted()) {
        auto format = observer->GetVideoFormatPreference();
        if (format == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
          observer->OnRenderVideoFrameEx(channelId, uid, video_frame_i420);
        } else if (format == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
          if (y_buffer.empty()) {
            RGBA(video_frame_rgba, videoFrame, y_buffer);
          }
          observer->OnRenderVideoFrameEx(channelId, uid, video_frame_rgba);
        }
      }
    }

    IrisRtcVideoFrameObserver::VideoFrame video_frame;
    if (renderer_->GetVideoFrameInternal(video_frame, uid, channelId)) {
      if (video_frame.type == IrisRtcVideoFrameObserver::kFrameTypeYUV420) {
        renderer_->SetVideoFrameInternal(video_frame_i420, uid, channelId);
      } else if (video_frame.type
                 == IrisRtcVideoFrameObserver::kFrameTypeRGBA) {
        if (y_buffer.empty()) { RGBA(video_frame_rgba, videoFrame, y_buffer); }
        renderer_->SetVideoFrameInternal(video_frame_rgba, uid, channelId);
      }
    }
    return true;
  }

 public:
  void RegisterObserver(IrisRtcVideoFrameObserver *observer, int order,
                        const char *identifier) {
    auto observer_entry = new ObserverEntry(observer, order, identifier);
    if (observer_entry_list_.empty()) {
      observer_entry_list_.push_back(observer_entry);
      return;
    }

    // Insert before the first entry with a higher |order| value.
    auto it = observer_entry_list_.begin();
    for (; it != observer_entry_list_.end(); ++it) {
      if ((*it)->order_ > order) { break; }
    }

    observer_entry_list_.emplace(it, observer_entry);
  }

  void UnRegisterObserver(const char *identifier) {
    if (observer_entry_list_.empty()) return;

    auto it = observer_entry_list_.begin();
    while (it != observer_entry_list_.end()) {
      if ((*it)->identifier_ == identifier) {
        DeleteObserver(it);
      } else {
        ++it;
      }
    }
  }

 private:
  void DeleteObserver(ObserverEntryList::iterator &iterator) {
    ObserverEntry *current_entry = *(iterator);
    // Delete the provider entry now.
    iterator = observer_entry_list_.erase(iterator);
    delete current_entry;
  }

  void RemoveAllObservers() {
    if (observer_entry_list_.empty()) return;

    auto it = observer_entry_list_.begin();
    while (it != observer_entry_list_.end()) { DeleteObserver(it); }
  }

 private:
  ObserverEntryList observer_entry_list_;
  IrisRtcRenderer *renderer_;
};

class IrisRtcRawData::IrisRtcRawDataImpl {
 public:
  explicit IrisRtcRawDataImpl()
      : engine_(nullptr), renderer_(new IrisRtcRenderer),
        audio_frame_observer_(new AudioFrameObserver),
        video_frame_observer_(new VideoFrameObserver(renderer_)) {}

  virtual ~IrisRtcRawDataImpl() {
    if (renderer_) {
      delete renderer_;
      renderer_ = nullptr;
    }
    if (audio_frame_observer_) {
      delete audio_frame_observer_;
      audio_frame_observer_ = nullptr;
    }
    if (video_frame_observer_) {
      delete video_frame_observer_;
      video_frame_observer_ = nullptr;
    }
  }

  void Initialize(IRtcEngine *engine) {
    engine_ = engine;
    util::AutoPtr<IMediaEngine> media_engine;
    media_engine.queryInterface(engine_, AGORA_IID_MEDIA_ENGINE);
    if (media_engine) {
      media_engine->registerAudioFrameObserver(audio_frame_observer_);
      media_engine->registerVideoFrameObserver(video_frame_observer_);
    }
  }

  void Release() {
    if (!engine_) { return; }
    util::AutoPtr<IMediaEngine> media_engine;
    media_engine.queryInterface(engine_, AGORA_IID_MEDIA_ENGINE);
    if (media_engine) {
      media_engine->registerAudioFrameObserver(nullptr);
      media_engine->registerVideoFrameObserver(nullptr);
    }
  }

  void RegisterAudioFrameObserver(IrisRtcAudioFrameObserver *observer,
                                  int order, const char *identifier) {
    audio_frame_observer_->RegisterObserver(observer, order, identifier);
  }

  void UnRegisterAudioFrameObserver(const char *identifier) {
    audio_frame_observer_->UnRegisterObserver(identifier);
  }

  void RegisterVideoFrameObserver(IrisRtcVideoFrameObserver *observer,
                                  int order, const char *identifier) {
    video_frame_observer_->RegisterObserver(observer, order, identifier);
  }

  void UnRegisterVideoFrameObserver(const char *identifier) {
    video_frame_observer_->UnRegisterObserver(identifier);
  }

  IrisRtcRenderer *renderer() { return renderer_; };

 private:
  IRtcEngine *engine_;
  IrisRtcRenderer *renderer_;
  AudioFrameObserver *audio_frame_observer_;
  VideoFrameObserver *video_frame_observer_;
};

IrisRtcRawData::IrisRtcRawData()
    : raw_data_(new IrisRtcRawDataImpl),
      plugin_manager_(new IrisRtcRawDataPluginManager(this)) {}

IrisRtcRawData::~IrisRtcRawData() {
  if (raw_data_) {
    delete raw_data_;
    raw_data_ = nullptr;
  }
  if (plugin_manager_) {
    delete plugin_manager_;
    plugin_manager_ = nullptr;
  }
}

void IrisRtcRawData::Initialize(IRtcEngine *engine) {
  raw_data_->Initialize(engine);
}

void IrisRtcRawData::Release() { raw_data_->Release(); }

void IrisRtcRawData::RegisterAudioFrameObserver(
    IrisRtcAudioFrameObserver *observer, int order, const char *identifier) {
  raw_data_->RegisterAudioFrameObserver(observer, order, identifier);
}

void IrisRtcRawData::UnRegisterAudioFrameObserver(const char *identifier) {
  raw_data_->UnRegisterAudioFrameObserver(identifier);
}

void IrisRtcRawData::RegisterVideoFrameObserver(
    IrisRtcVideoFrameObserver *observer, int order, const char *identifier) {
  raw_data_->RegisterVideoFrameObserver(observer, order, identifier);
}

void IrisRtcRawData::UnRegisterVideoFrameObserver(const char *identifier) {
  raw_data_->UnRegisterVideoFrameObserver(identifier);
}

IrisRtcRawDataPluginManager *IrisRtcRawData::plugin_manager() {
  return plugin_manager_;
}

IrisRtcRenderer *IrisRtcRawData::renderer() { return raw_data_->renderer(); }
}// namespace rtc
}// namespace iris
}// namespace agora
