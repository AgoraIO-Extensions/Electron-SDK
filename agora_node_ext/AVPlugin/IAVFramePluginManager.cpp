#include "IAVFramePluginManager.h"
#include "IAVFramePlugin.h"
#include <stdint.h>
#include <stdio.h>

IAVFramePluginManager::IAVFramePluginManager() {
#ifdef _WIN32
  m_onFrame = ::CreateEvent(NULL, FALSE, FALSE, NULL);
  m_doneFrame = ::CreateEvent(NULL, FALSE, FALSE, NULL);
  m_thread = std::thread([this] {
    while (!m_stop) {
      ::WaitForSingleObject(m_onFrame, INFINITE);
      for (auto const& element : m_mapPlugins) {
        if (element.second.enabled && m_pFrame) {
          element.second.instance->onPluginCaptureVideoFrame(
              (VideoPluginFrame*)m_pFrame);
        }
      }
      ::SetEvent(m_doneFrame);
    }
  });
#endif
}

IAVFramePluginManager::~IAVFramePluginManager() {
#ifdef _WIN32
  m_pFrame = NULL;
  m_stop = true;
  ::SetEvent(m_onFrame);
  m_thread.join();
  ::CloseHandle(m_onFrame);
  ::CloseHandle(m_doneFrame);
#endif
}

bool IAVFramePluginManager::onCaptureVideoFrame(VideoFrame& videoFrame) {
#ifdef _WIN32
  std::lock_guard<std::mutex> _(m_lock);
  m_pFrame = &videoFrame;
  ::SetEvent(m_onFrame);
  ::WaitForSingleObject(m_doneFrame, INFINITE);
#else
  for (auto const& element : m_mapPlugins) {
    if(element.second.enabled) {
        element.second.instance->onPluginCaptureVideoFrame((VideoPluginFrame*)&videoFrame);
    }
  }
#endif
  return true;
}

bool IAVFramePluginManager::onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame)
{
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginRenderVideoFrame(uid, (VideoPluginFrame*)&videoFrame);
        }
    }
    return true;
}

bool IAVFramePluginManager::onRecordAudioFrame(AudioFrame& audioFrame)
{
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginRecordAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    return true;
}

bool IAVFramePluginManager::onPlaybackAudioFrame(AudioFrame& audioFrame)
{
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginPlaybackAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    return true;
}

bool IAVFramePluginManager::onMixedAudioFrame(AudioFrame& audioFrame)
{
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginMixedAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    return true;
}

bool IAVFramePluginManager::onPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioFrame& audioFrame)
{
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginPlaybackAudioFrameBeforeMixing(uid, (AudioPluginFrame*)&audioFrame);
        }
    }
    return true;
}

void IAVFramePluginManager::registerPlugin(agora_plugin_info& plugin)
{
    m_mapPlugins.emplace(plugin.id, plugin);
}

void IAVFramePluginManager::unregisterPlugin(std::string& pluginId)
{
    auto iter = m_mapPlugins.find(pluginId);
    if(iter!=m_mapPlugins.end())
    {
        //free plugin instance
        if(iter->second.instance) {
            iter->second.instance->release();
        }
        //unload libs
        if(iter->second.pluginModule) {
            #ifdef _WIN32
                //FreeLibrary((HMODULE)(iter->second.pluginModule));
            #else
                dlclose(iter->second.pluginModule);
            #endif
        }
        m_mapPlugins.erase(iter);
    }
}

bool IAVFramePluginManager::hasPlugin(std::string& pluginId)
{
    return m_mapPlugins.end() != m_mapPlugins.find(pluginId);
}

bool IAVFramePluginManager::enablePlugin(std::string& pluginId, bool enabled)
{
    auto iter = m_mapPlugins.find(pluginId);
    if(iter!=m_mapPlugins.end())
    {
        iter->second.enabled = enabled;
        return true;
    }
    return false;
}

bool IAVFramePluginManager::getPlugin(std::string& pluginId, agora_plugin_info& pluginInfo)
{
    auto iter = m_mapPlugins.find(pluginId);
    if(iter!=m_mapPlugins.end())
    {
        pluginInfo = iter->second;
        return true;
    }
    return false;
}

std::vector<std::string> IAVFramePluginManager::getPlugins()
{
    std::vector<std::string> result;
    for (auto const& element : m_mapPlugins) {
        result.push_back(element.first);
    }
    return result;
}

int IAVFramePluginManager::release()
{
    for (auto const& element : m_mapPlugins) {
        //free plugin instance
        if(element.second.instance) {
            element.second.instance->release();
        }
        //unload libs
        if(element.second.pluginModule) {
            #ifdef _WIN32
                //FreeLibrary((HMODULE)(element.second.pluginModule));
            #else
                dlclose(element.second.pluginModule);
            #endif
        }
    }
    return 0;
}
