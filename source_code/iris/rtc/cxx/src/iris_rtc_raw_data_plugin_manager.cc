//
// Created by LXH on 2021/4/21.
//
#include "iris_rtc_raw_data_plugin_manager.h"
#include "AgoraBase.h"
#include "internal/iris_json_utils.h"
#include "loguru.hpp"
#include <map>
#include <stdexcept>
#include <vector>

#if !defined(_WIN32)
#include <dlfcn.h>
#endif

#define GET_VALUE$(val, key, type) GET_VALUE(val, key, key, type)

#define GET_VALUE_UINT$(val, key, type) GET_VALUE_UINT(val, key, key, type)

#define SET_VALUE_CHAR$(doc, val, key) SET_VALUE_CHAR(doc, val, key, key)

namespace agora {
namespace iris {
namespace rtc {
using rapidjson::Document;
using rapidjson::Value;

IrisRtcRawDataPlugin::IrisRtcRawDataPlugin(
    const char plugin_id[kMaxPluginIdLength], const char *plugin_path)
    : plugin_id_(""), plugin_dynamic_lib_(nullptr), plugin_(nullptr),
      enabled_(false) {
  memcpy(plugin_id_, plugin_id, kMaxPluginIdLength);

#if defined(_WIN32)
  auto len = MultiByteToWideChar(CP_UTF8, 0, plugin_path, -1, nullptr, 0);
  auto w_str = new wchar_t[len + 1];
  memset(w_str, 0, len + 1);
  MultiByteToWideChar(CP_UTF8, 0, plugin_path, -1, w_str, len);
  len = WideCharToMultiByte(CP_ACP, 0, w_str, -1, nullptr, 0, nullptr, nullptr);
  auto path = new char[len + 1];
  memset(path, 0, len + 1);
  WideCharToMultiByte(CP_ACP, 0, w_str, -1, path, len, nullptr, nullptr);

  plugin_dynamic_lib_ =
      LoadLibraryEx(path, nullptr, LOAD_WITH_ALTERED_SEARCH_PATH);
  delete[] w_str;
  delete[] path;

  DWORD error = GetLastError();
  if (error != 0) {
    throw std::runtime_error(
        (R"(LoadLibraryEx Failed: )" + std::to_string(error)).c_str());
  }

  auto create_plugin_method = (createAgoraAVFramePlugin) GetProcAddress(
      (HMODULE) plugin_dynamic_lib_, "createAVFramePlugin");
  if (!create_plugin_method) {
    FreeLibrary((HMODULE) plugin_dynamic_lib_);
    plugin_dynamic_lib_ = nullptr;
    throw std::runtime_error("GetProcAddress Failed");
  }
#else
  plugin_dynamic_lib_ = dlopen(plugin_path, RTLD_LAZY);

  auto create_plugin_method = (createAgoraAVFramePlugin) dlsym(
      plugin_dynamic_lib_, "createAVFramePlugin");
  if (!create_plugin_method) {
    dlclose(plugin_dynamic_lib_);
    plugin_dynamic_lib_ = nullptr;
    throw std::runtime_error("dlsym Failed");
  }
#endif

  plugin_ = create_plugin_method();
  if (!plugin_) { throw std::runtime_error("createAVFramePlugin Failed"); }

  plugin_->load(plugin_path);
  enabled_ = true;
}

IrisRtcRawDataPlugin::~IrisRtcRawDataPlugin() {
  if (plugin_) {
    plugin_->unLoad();
    plugin_->release();
  }

  if (plugin_dynamic_lib_) {
#if defined(_WIN32)
    FreeLibrary((HMODULE) plugin_dynamic_lib_);
#else
    dlclose(plugin_dynamic_lib_);
#endif
  }
}

const char *IrisRtcRawDataPlugin::plugin_id() { return plugin_id_; }

int IrisRtcRawDataPlugin::Enable(bool enabled) {
  enabled_ = enabled;
  if (!plugin_) { throw std::runtime_error("plugin is nullptr"); }
  if (enabled_) {
    return plugin_->enable();
  } else {
    return plugin_->disable();
  }
}

int IrisRtcRawDataPlugin::SetParameter(const char *parameter) {
  if (!plugin_) { throw std::runtime_error("plugin is nullptr"); }
  return plugin_->setParameter(parameter);
}

const char *IrisRtcRawDataPlugin::GetParameter(const char *key) {
  if (!plugin_) { throw std::runtime_error("plugin is nullptr"); }
  return plugin_->getParameter(key);
}

bool IrisRtcRawDataPlugin::OnRecordAudioFrame(
    IrisRtcAudioFrameObserver::AudioFrame &audio_frame) {
  if (!enabled_) return false;
  if (plugin_) {
    AudioPluginFrame frame{};
    CopyAudioFrame(frame, audio_frame);
    return plugin_->onPluginRecordAudioFrame(&frame);
  }
  return false;
}

bool IrisRtcRawDataPlugin::OnPlaybackAudioFrame(
    IrisRtcAudioFrameObserver::AudioFrame &audio_frame) {
  if (!enabled_) return false;
  if (plugin_) {
    AudioPluginFrame frame{};
    CopyAudioFrame(frame, audio_frame);
    return plugin_->onPluginPlaybackAudioFrame(&frame);
  }
  return false;
}

bool IrisRtcRawDataPlugin::OnMixedAudioFrame(
    IrisRtcAudioFrameObserver::AudioFrame &audio_frame) {
  if (!enabled_) return false;
  if (plugin_) {
    AudioPluginFrame frame{};
    CopyAudioFrame(frame, audio_frame);
    return plugin_->onPluginMixedAudioFrame(&frame);
  }
  return false;
}

bool IrisRtcRawDataPlugin::OnPlaybackAudioFrameBeforeMixing(
    unsigned int uid, IrisRtcAudioFrameObserver::AudioFrame &audio_frame) {
  if (!enabled_) return false;
  if (plugin_) {
    AudioPluginFrame frame{};
    CopyAudioFrame(frame, audio_frame);
    return plugin_->onPluginPlaybackAudioFrameBeforeMixing(uid, &frame);
  }
  return false;
}

bool IrisRtcRawDataPlugin::OnCaptureVideoFrame(
    IrisRtcVideoFrameObserver::VideoFrame &video_frame) {
  if (!enabled_) return false;
  if (plugin_) {
    VideoPluginFrame frame{};
    CopyVideoFrame(frame, video_frame);
    return plugin_->onPluginCaptureVideoFrame(&frame);
  }
  return false;
}

bool IrisRtcRawDataPlugin::OnRenderVideoFrame(
    unsigned int uid, IrisRtcVideoFrameObserver::VideoFrame &video_frame) {
  if (!enabled_) return false;
  if (plugin_) {
    VideoPluginFrame frame{};
    CopyVideoFrame(frame, video_frame);
    return plugin_->onPluginRenderVideoFrame(uid, &frame);
  }
  return false;
}

void IrisRtcRawDataPlugin::CopyAudioFrame(
    AudioPluginFrame &dst, const IrisRtcAudioFrameObserver::AudioFrame &src) {
  dst.type = src.type;
  dst.samples = src.samples;
  dst.bytesPerSample = src.bytes_per_sample;
  dst.channels = src.channels;
  dst.samplesPerSec = src.samples_per_sec;
  dst.buffer = src.buffer;
  dst.renderTimeMs = src.render_time_ms;
  dst.avsync_type = src.av_sync_type;
}

void IrisRtcRawDataPlugin::CopyVideoFrame(
    VideoPluginFrame &dst, const IrisRtcVideoFrameObserver::VideoFrame &src) {
  dst.type = src.type;
  dst.width = src.width;
  dst.height = src.height;
  dst.yStride = src.y_stride;
  dst.uStride = src.u_stride;
  dst.vStride = src.v_stride;
  dst.yBuffer = src.y_buffer;
  dst.uBuffer = src.u_buffer;
  dst.vBuffer = src.v_buffer;
  dst.rotation = src.rotation;
  dst.renderTimeMs = src.render_time_ms;
  dst.avsync_type = src.av_sync_type;
}

class IrisRtcRawDataPluginManager::IrisRtcRawDataPluginManagerImpl {
 public:
  typedef std::map<std::string, IrisRtcRawDataPlugin *> IrisRawDataPluginMap;

 public:
  explicit IrisRtcRawDataPluginManagerImpl(IrisRtcRawData *raw_data)
      : raw_data_(raw_data) {}
  virtual ~IrisRtcRawDataPluginManagerImpl() { RemoveAllPlugins(); }

 public:
  int CallApi(ApiTypeRawDataPlugin api_type, const char *params, char *result) {
    int error_code = -ERROR_CODE_TYPE::ERR_FAILED;
    Document document;
    document.Parse(params);

    switch (api_type) {
      case kRegisterPlugin: {
        const char *pluginId;
        GET_VALUE$(document, pluginId, const char *)
        const char *pluginPath;
        GET_VALUE$(document, pluginPath, const char *)
        int order;
        GET_VALUE$(document, order, int)
        error_code = RegisterPlugin(pluginId, pluginPath, order);
        break;
      }
      case kUnregisterPlugin: {
        const char *pluginId;
        GET_VALUE$(document, pluginId, const char *)
        error_code = UnRegisterPlugin(pluginId);
        break;
      }
      case kHasPlugin: {
        const char *pluginId;
        GET_VALUE$(document, pluginId, const char *)
        error_code = HasPlugin(pluginId);
        break;
      }
      case kEnablePlugin: {
        const char *pluginId;
        GET_VALUE$(document, pluginId, const char *)
        bool enabled;
        GET_VALUE$(document, enabled, bool)
        error_code = EnablePlugin(pluginId, enabled);
        break;
      }
      case kGetPlugins: {
        std::vector<std::string> plugins;
        error_code = GetPlugins(plugins);
        Value value(rapidjson::kArrayType);
        for (const auto &it : plugins) {
          value.PushBack(Value(it.c_str(), document.GetAllocator()).Move(),
                         document.GetAllocator());
        }
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kSetPluginParameter: {
        const char *pluginId;
        GET_VALUE$(document, pluginId, const char *)
        const char *parameter;
        GET_VALUE$(document, parameter, const char *)
        error_code = SetPluginParameter(pluginId, parameter);
        break;
      }
      case kGetPluginParameter: {
        const char *pluginId;
        GET_VALUE$(document, pluginId, const char *)
        const char *key;
        GET_VALUE$(document, key, const char *)
        std::string parameter;
        error_code = GetPluginParameter(pluginId, key, parameter);
        strcpy(result, parameter.c_str());
        break;
      }
      case kRelease: {
        RemoveAllPlugins();
        error_code = ERROR_CODE_TYPE::ERR_OK;
        break;
      }
    }

    return error_code;
  }

 private:
  int RegisterPlugin(const char *plugin_id, const char *plugin_path,
                     int order) {
    auto plugin = new IrisRtcRawDataPlugin(plugin_id, plugin_path);
    raw_data_->RegisterAudioFrameObserver(plugin, order, plugin_id);
    raw_data_->RegisterVideoFrameObserver(plugin, order, plugin_id);
    plugins_.emplace(plugin_id, plugin);
    return ERROR_CODE_TYPE::ERR_OK;
  }

  int UnRegisterPlugin(const char *plugin_id) {
    raw_data_->UnRegisterAudioFrameObserver(plugin_id);
    raw_data_->UnRegisterVideoFrameObserver(plugin_id);
    auto it = plugins_.find(plugin_id);
    if (it != plugins_.end()) { DeletePlugin(it); }
    return ERROR_CODE_TYPE::ERR_OK;
  }

  bool HasPlugin(const char *plugin_id) {
    return plugins_.find(plugin_id) != plugins_.end();
  }

  int EnablePlugin(const char *plugin_id, bool enabled) {
    auto it = plugins_.find(plugin_id);
    if (it != plugins_.end()) { return it->second->Enable(enabled); }
    return -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED;
  }

  int GetPlugins(std::vector<std::string> &plugins) {
    auto it = plugins_.begin();
    for (; it != plugins_.end(); ++it) { plugins.push_back(it->first); }
    return ERROR_CODE_TYPE::ERR_OK;
  }

  int SetPluginParameter(const char *plugin_id, const char *parameter) {
    auto it = plugins_.find(plugin_id);
    if (it != plugins_.end()) { return it->second->SetParameter(parameter); }
    return -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED;
  }

  int GetPluginParameter(const char *plugin_id, const char *key,
                         std::string &parameter) {
    auto it = plugins_.find(plugin_id);
    if (it != plugins_.end()) { parameter = it->second->GetParameter(key); }
    return ERROR_CODE_TYPE::ERR_OK;
  }

 private:
  void DeletePlugin(IrisRawDataPluginMap::iterator &iterator) {
    auto current_entry = iterator->second;
    // Delete the provider entry now.
    iterator = plugins_.erase(iterator);
    delete current_entry;
  }

  void RemoveAllPlugins() {
    if (plugins_.empty()) return;

    auto it = plugins_.begin();
    while (it != plugins_.end()) { DeletePlugin(it); }
  }

 private:
  IrisRtcRawData *raw_data_;
  IrisRawDataPluginMap plugins_;
};

IrisRtcRawDataPluginManager::IrisRtcRawDataPluginManager(
    IrisRtcRawData *raw_data)
    : plugin_manager_(new IrisRtcRawDataPluginManagerImpl(raw_data)) {}

IrisRtcRawDataPluginManager::~IrisRtcRawDataPluginManager() {
  if (plugin_manager_) {
    delete plugin_manager_;
    plugin_manager_ = nullptr;
  }
}

int IrisRtcRawDataPluginManager::CallApi(ApiTypeRawDataPlugin api_type,
                                         const char *params, char *result) {
  return plugin_manager_->CallApi(api_type, params, result);
}
}// namespace rtc
}// namespace iris
}// namespace agora
