#include "IAVFramePluginManager.h"
#include "IAVFramePlugin.h"
#include <stdint.h>
#include <stdio.h>
#include "loguru.hpp"

IAVFramePluginManager::IAVFramePluginManager()
{
}

IAVFramePluginManager::~IAVFramePluginManager()
{
    release();
}

bool IAVFramePluginManager::onCaptureVideoFrame(VideoFrame& videoFrame)
{
    pluginMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginCaptureVideoFrame((VideoPluginFrame*)&videoFrame);
        }
    }
    pluginMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame)
{
    pluginMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginRenderVideoFrame(uid, (VideoPluginFrame*)&videoFrame);
        }
    }
    pluginMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onRecordAudioFrame(AudioFrame& audioFrame)
{
    pluginMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginRecordAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    pluginMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onPlaybackAudioFrame(AudioFrame& audioFrame)
{
    pluginMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginPlaybackAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    pluginMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onMixedAudioFrame(AudioFrame& audioFrame)
{
    pluginMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginMixedAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    pluginMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioFrame& audioFrame)
{
    pluginMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginPlaybackAudioFrameBeforeMixing(uid, (AudioPluginFrame*)&audioFrame);
        }
    }
    pluginMutex.unlock();
    return true;
}

void IAVFramePluginManager::registerPlugin(agora_plugin_info& plugin)
{
    m_mapPlugins.emplace(plugin.id, plugin);
}

void IAVFramePluginManager::unregisterPlugin(std::string& pluginId)
{
    pluginMutex.lock();
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
    pluginMutex.unlock();
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
    pluginMutex.lock();
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
    m_mapPlugins.clear();
    pluginMutex.unlock();
    return 0;
}
