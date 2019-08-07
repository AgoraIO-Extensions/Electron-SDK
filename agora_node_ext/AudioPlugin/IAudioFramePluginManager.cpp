#include "IAudioFramePluginManager.h"
#include "IAudioFramePlugin.h"
#include <stdint.h>
#include <stdio.h>

bool gIsSaveDumpPcm = true;

IAudioFramePluginManager::IAudioFramePluginManager()
{
}

IAudioFramePluginManager::~IAudioFramePluginManager()
{
}

bool IAudioFramePluginManager::onRecordAudioFrame(AudioFrame& audioFrame)
{
				for (auto iter : m_lstPlugins) {
								iter->onPluginRecordAudioFrame((AudioPluginFrame*)&audioFrame);
				}

				return true;
}

bool IAudioFramePluginManager::onPlaybackAudioFrame(AudioFrame& audioFrame)
{
    return true;
}

bool IAudioFramePluginManager::onMixedAudioFrame(AudioFrame& audioFrame)
{
    return true;
}

bool IAudioFramePluginManager::onPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioFrame& audioFrame)
{
    return true;
}

void IAudioFramePluginManager::registerAudioFramePlugin(IAudioFramePlugin* plugin)
{
    m_lstPlugins.insert(plugin);
}

void IAudioFramePluginManager::unRegisterAudioFramePlugin(IAudioFramePlugin* plugin)
{
    m_lstPlugins.erase(plugin);
}