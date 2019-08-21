#pragma once
typedef IAVFramePlugin* (*createAgoraAVFramePlugin)();

#ifdef AGORA_VIDEO_PLUGIN_EXPORT
#define AGORA_VIDEO_PLUGIN_API extern "C" __declspec(dllexport)
#else
#define AGORA_VIDEO_PLUGIN_API __declspec(dllimport)
#endif

struct AudioPluginFrame {
    int type;
    /** Number of samples in the audio frame: samples = (int)samplesPerCall = (int)(sampleRate &times; sampleInterval)
    */
    int samples;  //number of samples in this frame
                /** Number of bytes per audio sample. For example, each PCM audio sample usually takes up 16 bits (2 bytes).
                */
    int bytesPerSample;  //number of bytes per sample: 2 for PCM16
                        /** Number of audio channels.
                        - 1: Mono
                        - 2: Stereo (the data is interleaved)
                        */
    int channels;  //number of channels (data are interleaved if stereo)
                    /** Audio frame sample rate: 8000, 16000, 32000, 44100, or 48000 Hz.
                    */
    int samplesPerSec;  //sampling rate
                    /** Audio frame data buffer. The valid data length is: samples &times; channels &times; bytesPerSample
                    */
    void* buffer;  //data buffer
                    /** Timestamp to render the audio stream.
                    */
    long long renderTimeMs;
    int avsync_type;
};

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
class IAVFramePluginCallback {
public:
    virtual bool onPluginCaptureVideoFrame(VideoPluginFrame* videoFrame) = 0;
    virtual bool onPluginRenderVideoFrame(unsigned int uid, VideoPluginFrame* videoFrame) = 0;

    virtual bool onPluginRecordAudioFrame(AudioPluginFrame* audioFrame) = 0;
    virtual bool onPluginPlaybackAudioFrame(AudioPluginFrame* audioFrame) = 0;
    virtual bool onPluginMixedAudioFrame(AudioPluginFrame* audioFrame) = 0;
    virtual bool onPluginPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioPluginFrame* audioFrame) = 0;
};
class IAVFramePlugin : public IAVFramePluginCallback
{
public:
    virtual bool load(const char* path) = 0;
    virtual bool unLoad() = 0;
    virtual bool enable() = 0;
    virtual bool disable() = 0;
    virtual bool setParameter(const char* param) = 0;
    virtual void release() = 0;
};

 IAVFramePlugin* createAVFramePlugin();
