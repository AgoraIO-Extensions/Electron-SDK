#include "IVideoFramePluginManager.h"
#include "IVideoFramePlugin.h"
#include <stdint.h>
#include <stdio.h>

IVideoFramePluginManager::IVideoFramePluginManager()
{
}

IVideoFramePluginManager::~IVideoFramePluginManager()
{
}

bool IVideoFramePluginManager::onCaptureVideoFrame(VideoFrame& videoFrame)
{
    // for (auto iter : m_lstPlugins) {
    //     iter->onPluginCaptureVideoFrame((VideoPluginFrame*)&videoFrame);
    // }
    for (auto const& element : m_mapPlugins) {
        if(element.second.enabled) {
            element.second.instance->onPluginCaptureVideoFrame((VideoPluginFrame*)&videoFrame);
        }
    }

    return true;
}

bool IVideoFramePluginManager::onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame)
{
    return true;
}

void IVideoFramePluginManager::registerPlugin(agora_plugin_info& plugin)
{
    m_mapPlugins.emplace(plugin.id, plugin);
}

void IVideoFramePluginManager::unregisterPlugin(std::string& pluginId)
{
    auto iter = m_mapPlugins.find(pluginId);
    if(iter!=m_mapPlugins.end())
    {
        m_mapPlugins.erase(iter);
    }
}

bool IVideoFramePluginManager::hasPlugin(std::string& pluginId)
{
    return m_mapPlugins.end() != m_mapPlugins.find(pluginId);
}

bool IVideoFramePluginManager::enablePlugin(std::string& pluginId, bool enabled)
{
    auto iter = m_mapPlugins.find(pluginId);
    if(iter!=m_mapPlugins.end())
    {
        iter->second.enabled = enabled;
        return true;
    }
    return false;
}

bool IVideoFramePluginManager::getPlugin(std::string& pluginId, agora_plugin_info& pluginInfo)
{
    auto iter = m_mapPlugins.find(pluginId);
    if(iter!=m_mapPlugins.end())
    {
        pluginInfo = iter->second;
        return true;
    }
    return false;
}

std::vector<std::string> IVideoFramePluginManager::getPlugins()
{
    std::vector<std::string> result;
    for (auto const& element : m_mapPlugins) {
        result.push_back(element.first);
    }
    return result;
}