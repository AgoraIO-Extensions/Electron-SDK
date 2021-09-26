#include "IAVFramePluginManager.h"
#include "IAVFramePlugin.h"
#include <stdint.h>
#include <stdio.h>

IAVFramePluginManager::IAVFramePluginManager()
{
}

IAVFramePluginManager::~IAVFramePluginManager()
{
    release();
}

bool IAVFramePluginManager::onCaptureVideoFrame(VideoFrame& videoFrame)
{
    captureVideoFrameMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginCaptureVideoFrame((VideoPluginFrame*)&videoFrame);
        }
    }
    captureVideoFrameMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame)
{
    renderVideoFrameMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginRenderVideoFrame(uid, (VideoPluginFrame*)&videoFrame);
        }
    }
    renderVideoFrameMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onRecordAudioFrame(AudioFrame& audioFrame)
{
    recordAudioFrameMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginRecordAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    recordAudioFrameMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onPlaybackAudioFrame(AudioFrame& audioFrame)
{
    playbackAudioFrameMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginPlaybackAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    playbackAudioFrameMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onMixedAudioFrame(AudioFrame& audioFrame)
{
    mixedAudioFrameMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginMixedAudioFrame((AudioPluginFrame*)&audioFrame);
        }
    }
    mixedAudioFrameMutex.unlock();
    return true;
}

bool IAVFramePluginManager::onPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioFrame& audioFrame)
{
    playBackAudioFrameBeforeMixingMutex.lock();
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginPlaybackAudioFrameBeforeMixing(uid, (AudioPluginFrame*)&audioFrame);
        }
    }
    playBackAudioFrameBeforeMixingMutex.unlock();
    return true;
}

void IAVFramePluginManager::registerPlugin(agora_plugin_info& plugin)
{
    m_mapPlugins.emplace(plugin.id, plugin);
}

void IAVFramePluginManager::unregisterPlugin(std::string& pluginId)
{
    captureVideoFrameMutex.lock();
    renderVideoFrameMutex.lock();
    recordAudioFrameMutex.lock();
    playbackAudioFrameMutex.lock();
    mixedAudioFrameMutex.lock();
    playBackAudioFrameBeforeMixingMutex.lock();
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
    captureVideoFrameMutex.unlock();
    renderVideoFrameMutex.unlock();
    recordAudioFrameMutex.unlock();
    playbackAudioFrameMutex.unlock();
    mixedAudioFrameMutex.unlock();
    playBackAudioFrameBeforeMixingMutex.unlock();
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
    captureVideoFrameMutex.lock();
    renderVideoFrameMutex.lock();
    recordAudioFrameMutex.lock();
    playbackAudioFrameMutex.lock();
    mixedAudioFrameMutex.lock();
    playBackAudioFrameBeforeMixingMutex.lock();
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
    captureVideoFrameMutex.unlock();
    renderVideoFrameMutex.unlock();
    recordAudioFrameMutex.unlock();
    playbackAudioFrameMutex.unlock();
    mixedAudioFrameMutex.unlock();
    playBackAudioFrameBeforeMixingMutex.unlock();
    return 0;
}
