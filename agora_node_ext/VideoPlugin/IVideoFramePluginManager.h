#pragma once
#include <IAgoraMediaEngine.h>
#include <string>
#include <map>
#include <node.h>
#ifdef _WIN32
#include <Windows.h>
#endif
class IVideoFramePlugin;

typedef struct tag_agora_plugin_info {
    const char* id;
    void * pluginModule;
    IVideoFramePlugin* instance;
    bool enabled;
}agora_plugin_info;

class IVideoFramePluginManager :
    public agora::media::IVideoFrameObserver
{
public:
    IVideoFramePluginManager();
    ~IVideoFramePluginManager();

    virtual bool onCaptureVideoFrame(VideoFrame& videoFrame);
    virtual bool onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame);

    void registerPlugin(agora_plugin_info& plugin);
    void unregisterPlugin(std::string& pluginId);
    bool hasPlugin(std::string& pluginId);
    bool enablePlugin(std::string& pluginId, bool enabled);
    bool getPlugin(std::string& pluginId, agora_plugin_info& pluginInfo);
    std::vector<std::string> getPlugins();
private:
    std::map<std::string, agora_plugin_info> m_mapPlugins;
};
