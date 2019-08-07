#pragma once
#include <IAgoraMediaEngine.h>
#include <unordered_set>
#ifdef _WIN32
#include <Windows.h>
#endif
class IVideoFramePlugin;

class IVideoFramePluginManager :
    public agora::media::IVideoFrameObserver
{
public:
    IVideoFramePluginManager();
    ~IVideoFramePluginManager();

    virtual bool onCaptureVideoFrame(VideoFrame& videoFrame);
    virtual bool onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame);

    void registerVideoFramePlugin(IVideoFramePlugin* plugin);
    void unRegisterVideoFramePlugin(IVideoFramePlugin* plugin);
private:
    std::unordered_set<IVideoFramePlugin*> m_lstPlugins;
};

