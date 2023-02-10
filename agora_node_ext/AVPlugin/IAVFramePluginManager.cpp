#include "IAVFramePluginManager.h"
#include "IAVFramePlugin.h"
#include <stdint.h>
#include <stdio.h>
#include <thread>

IAVFramePluginManager::IAVFramePluginManager() {}

IAVFramePluginManager::~IAVFramePluginManager() {}

bool IAVFramePluginManager::onCaptureVideoFrame(VideoFrame& videoFrame) {
  void *y_buffer = malloc(videoFrame.yStride * videoFrame.height);
  void *u_buffer = malloc(videoFrame.yStride * videoFrame.height/4);
  void *v_buffer = malloc(videoFrame.yStride * videoFrame.height/4);
  memcpy(y_buffer, videoFrame.yBuffer, videoFrame.yStride * videoFrame.height);
  memcpy(u_buffer, videoFrame.uBuffer, videoFrame.yStride * videoFrame.height/4);
  memcpy(v_buffer, videoFrame.vBuffer, videoFrame.yStride * videoFrame.height/4);
  std::thread thread([this, videoFrame, y_buffer, u_buffer, v_buffer] {
    VideoFrame frame = videoFrame;
    frame.yBuffer = y_buffer;
    frame.uBuffer = u_buffer;
    frame.vBuffer = v_buffer;
    for (auto const& element : m_mapPlugins) {
      if (element.second.enabled) {
        element.second.instance->onPluginCaptureVideoFrame(
            (VideoPluginFrame*)&frame);
      }
    }
    free(y_buffer);
    free(u_buffer);
    free(v_buffer);
  });
  thread.join();
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
            #ifdef WIN32
                FreeLibrary((HMODULE)(iter->second.pluginModule));
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
            #ifdef WIN32
                FreeLibrary((HMODULE)(element.second.pluginModule));
            #else
                dlclose(element.second.pluginModule);
            #endif
        }
    }
    return 0;
}
