#pragma once
typedef IVideoFramePlugin* (*createAgoraVideoFramePlugin)();

#ifdef AGORA_VIDEO_PLUGIN_EXPORT
#define AGORA_VIDEO_PLUGIN_API extern "C" __declspec(dllexport)
#else
#define AGORA_VIDEO_PLUGIN_API __declspec(dllimport)
#endif
struct VideoPluginFrame {
    int type;
    int width;  //width of video frame
    int height;  //height of video frame
    int yStride;  //stride of Y data buffer
    int uStride;  //stride of U data buffer
    int vStride;  //stride of V data buffer
    void* yBuffer;  //Y data buffer
    void* uBuffer;  //U data buffer
    void* vBuffer;  //V data buffer
    int rotation; // rotation of this frame (0, 90, 180, 270)
    int64_t renderTimeMs;
    int avsync_type;
  };
class IVideoFramePluginCallback {
public:
    virtual bool onPluginCaptureVideoFrame(VideoPluginFrame* videoFrame) = 0;
    virtual bool onPluginRenderVideoFrame(unsigned int uid, VideoPluginFrame* videoFrame) = 0;
};
class IVideoFramePlugin : public IVideoFramePluginCallback
{
public:
    virtual bool load(const char* path) = 0;
    virtual bool unLoad() = 0;
    virtual bool enable() = 0;
    virtual bool disable() = 0;
    virtual bool setParameter(const char* param) = 0;
    virtual void release() = 0;
};

 IVideoFramePlugin* createVideoFramePlugin();
