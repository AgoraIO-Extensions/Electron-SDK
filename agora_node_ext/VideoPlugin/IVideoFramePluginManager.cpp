#include "IVideoFramePluginManager.h"
#include "IVideoFramePlugin.h"
#include <stdint.h>
#include <stdio.h>

bool gIsSaveDumpPcm = true;

IVideoFramePluginManager::IVideoFramePluginManager()
{
}

IVideoFramePluginManager::~IVideoFramePluginManager()
{
}

bool IVideoFramePluginManager::onCaptureVideoFrame(VideoFrame& videoFrame)
{
    for (auto iter : m_lstPlugins) {
        iter->onPluginCaptureVideoFrame((VideoPluginFrame*)&videoFrame);
    }

    return true;
}

bool IVideoFramePluginManager::onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame)
{
    return true;
}

void IVideoFramePluginManager::registerVideoFramePlugin(IVideoFramePlugin* plugin)
{
    m_lstPlugins.insert(plugin);
}

void IVideoFramePluginManager::unRegisterVideoFramePlugin(IVideoFramePlugin* plugin)
{
    m_lstPlugins.erase(plugin);
}