#pragma once
#include <IAgoraMediaEngine.h>
#include <Windows.h>
#include <unordered_set>
class IAudioFramePlugin;

class IAudioFramePluginManager :
    public agora::media::IAudioFrameObserver
{
public:
    IAudioFramePluginManager();
    ~IAudioFramePluginManager();

    virtual bool onRecordAudioFrame(AudioFrame& audioFrame);
    virtual bool onPlaybackAudioFrame(AudioFrame& audioFrame);
    virtual bool onMixedAudioFrame(AudioFrame& audioFrame);
    virtual bool onPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioFrame& audioFrame);

    void registerAudioFramePlugin(IAudioFramePlugin* plugin);
    void unRegisterAudioFramePlugin(IAudioFramePlugin* plugin);
private:
    std::unordered_set<IAudioFramePlugin*> m_lstPlugins;
};

