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
				SIZE_T nSize = audioFrame.channels*audioFrame.samples * 2;
				//	CAudioPlayPackageQueue::GetInstance()->PushAudioPackage(audioFrame.buffer, nSize);
				// 	FILE * recordf = fopen("d:/playback.pcm", "ab+");
				// 	fwrite(audioFrame.buffer, 1, nSize, recordf);
				// 	fclose(recordf);
#if 0
				if (bIsDebugMode)
				{
								FILE* outfile1 = fopen("./AgoraHookLog/PlayOut.pcm", "ab+");
								if (outfile1)
								{
												fwrite(this->pPlayerData, 1, nSize, outfile1);
												fclose(outfile1);
												outfile1 = NULL;
								}
				}
#endif

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