#pragma once
#include <IAgoraMediaEngine.h>
#include <string>
#include <map>
#include <node.h>
#ifdef _WIN32
#include <Windows.h>
#elif defined(__APPLE__)
#include <dlfcn.h>
#endif
class IAVFramePlugin;

#define MAX_PLUGIN_ID   512

typedef struct tag_agora_plugin_info {
    char id[MAX_PLUGIN_ID];
    void * pluginModule;
    IAVFramePlugin* instance;
    bool enabled;
}agora_plugin_info;

class IAVFramePluginManager :
    public agora::media::IVideoFrameObserver,
    public agora::media::IAudioFrameObserver
{
public:
    IAVFramePluginManager();
    ~IAVFramePluginManager();

    virtual bool onCaptureVideoFrame(VideoFrame& videoFrame);
    virtual bool onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame);

    virtual bool onRecordAudioFrame(AudioFrame& audioFrame);
    virtual bool onPlaybackAudioFrame(AudioFrame& audioFrame);
    virtual bool onMixedAudioFrame(AudioFrame& audioFrame);
    virtual bool onPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioFrame& audioFrame);

    void registerPlugin(agora_plugin_info& plugin);
    void unregisterPlugin(std::string& pluginId);
    bool hasPlugin(std::string& pluginId);
    bool enablePlugin(std::string& pluginId, bool enabled);
    bool getPlugin(std::string& pluginId, agora_plugin_info& pluginInfo);
    std::vector<std::string> getPlugins();
    void release();
private:
    std::map<std::string, agora_plugin_info> m_mapPlugins;
};
