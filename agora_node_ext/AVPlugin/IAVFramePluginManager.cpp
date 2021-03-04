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

    if (!isPublishMediaPlayerAudio) {
        return true;
    }

    std::lock_guard<std::mutex> _(recordMutex);
    int bytes = audioFrame.samples * audioFrame.channels * audioFrame.bytesPerSample;
    int16_t *tmpBuf = (int16_t *)malloc(bytes);
    memcpy(tmpBuf, audioFrame.buffer, bytes);

    if (recordCircularBuffer->mAvailSamples < bytes) {
        free(tmpBuf);
        return false;
    }
    int ret = recordCircularBuffer->mAvailSamples - bytes;
    if (ret < 0){
        memcpy(audioFrame.buffer, tmpBuf, bytes);
        free(tmpBuf);
        return false;
    }
    char *data = (char *)malloc(sizeof(char)*bytes);
    recordCircularBuffer->Pop(data, bytes);

    int16_t* p16 = (int16_t*)data;
    int16_t *audioBuf = (int16_t *)malloc(bytes);
    memcpy(audioBuf, tmpBuf, bytes);
    for (int i = 0; i < bytes / 2; ++i) {
        int tmp = p16[i] * recordVolume;
        audioBuf[i] = audioBuf[i] * 1;
        tmp += audioBuf[i];

        if (tmp > 32767) {
            audioBuf[i] = 32767;
        }
        else if (tmp < -32768) {
            audioBuf[i] = -32768;
        }
        else {
            audioBuf[i] += tmp;
        }
    }
    memcpy(audioFrame.buffer, audioBuf,  bytes);
    free(audioBuf);
    free(tmpBuf);
    free(p16);

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

    if (!isPlaybackMediaPlayerAudio) {
        return true;
    }

    std::lock_guard<std::mutex> _(playbackMutex);
    int bytes = audioFrame.samples * audioFrame.channels * audioFrame.bytesPerSample;
	int16_t *tmpBuf = (int16_t *)malloc(bytes);
	memcpy(tmpBuf, audioFrame.buffer, bytes);

	if (playbackCircularBuffer->mAvailSamples < bytes) {
		memcpy(audioFrame.buffer, tmpBuf, bytes);
		free(tmpBuf);
		return true;
	}
	
	// int ret = playbackCircularBuffer->mAvailSamples - bytes;
	// if (ret < 0) {
	// 	memcpy(audioFrame.buffer, tmpBuf, bytes);
	// 	free(tmpBuf);
	// 	return true;
	// }
	char *data = (char *)malloc(sizeof(char)*bytes);

	playbackCircularBuffer->Pop(data, bytes);

	int16_t* p16 = (int16_t*)data;
	int16_t *audioBuf = (int16_t *)malloc(bytes);
	memcpy(audioBuf, tmpBuf, bytes);
	for (int i = 0; i < bytes / 2; ++i) {
		int tmp = p16[i] * playbackVolume;
		audioBuf[i] = audioBuf[i] * 1;
		tmp += audioBuf[i];

		if (tmp > 32767) {
			audioBuf[i] = 32767;
		}
		else if (tmp < -32768) {
			audioBuf[i] = -32768;
		}
		else {
			audioBuf[i] = tmp;
		}
	}
	memcpy(audioFrame.buffer, audioBuf, bytes);
	free(audioBuf);
	free(tmpBuf);
	free(p16);

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

void IAVFramePluginManager::pushAudioData(void* data, int len)
{
    {
        std::lock_guard<std::mutex> _(recordMutex);
        if (isPublishMediaPlayerAudio)
            recordCircularBuffer->Push((char*)data, len);
    }
    {
        std::lock_guard<std::mutex> _(playbackMutex);
        if (isPlaybackMediaPlayerAudio)
            playbackCircularBuffer->Push((char*)data, len);
    }
}

void IAVFramePluginManager::resetAudioBuffer()
{
    {
        std::lock_guard<std::mutex> _(recordMutex);
        recordCircularBuffer.reset(new AudioCircularBuffer<char>(2048, true));
    }
    {
        std::lock_guard<std::mutex> _(playbackMutex);
        playbackCircularBuffer.reset(new AudioCircularBuffer<char>(2048, true));
    }
}

void IAVFramePluginManager::setRecordVolume(int volume)
{
    {
        std::lock_guard<std::mutex> _(recordMutex);
        if (volume > 0) {
            recordVolume = volume / 100.0f;
        }
    }
}

void IAVFramePluginManager::setPlaybackVolume(int volume)
{
    {
        std::lock_guard<std::mutex> _(playbackMutex);
        if (volume > 0) {
            playbackVolume = volume / 100.0f;
        }
    }
}

void IAVFramePluginManager::publishMediaPlayerAudio(bool publish, bool localPlayback)
{
    isPublishMediaPlayerAudio.store(publish);
    isPlaybackMediaPlayerAudio.store(localPlayback);
}

void IAVFramePluginManager::unpublishMediaPlayerAudio()
{
    isPublishMediaPlayerAudio.store(false);
    isPlaybackMediaPlayerAudio.store(false);
}