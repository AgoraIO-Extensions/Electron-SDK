#pragma once
typedef IAudioFramePlugin* (*createAgoraAudioFramePlugin)();

#ifdef AGORA_AUDIO_PLUGIN_EXPORT
#define AGORA_AUDIO_PLUGIN_API extern "C" __declspec(dllexport)
#else
#define AGORA_AUDIO_PLUGIN_API __declspec(dllimport)
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
class IAudioFramePluginCallback {
public:
    virtual bool onPluginRecordAudioFrame(AudioPluginFrame* audioFrame) = 0;
    virtual bool onPluginPlaybackAudioFrame(AudioPluginFrame* audioFrame) = 0;
    virtual bool onPluginMixedAudioFrame(AudioPluginFrame* audioFrame) = 0;
    virtual bool onPluginPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioPluginFrame* audioFrame) = 0;
};
class IAudioFramePlugin : public IAudioFramePluginCallback
{
public:
    virtual bool load(const char* path) = 0;
    virtual bool unLoad() = 0;
    virtual bool enable() = 0;
    virtual bool disable() = 0;
    virtual bool setBoolParameter(const char* param, bool value) = 0;
    virtual bool setStringParameter(const char* param, const char* value) = 0;
    virtual void release() = 0;
};

typedef struct tag_agora_audio_plugin_info {
    const char* id;
    void * pluginModule;
    IAudioFramePlugin* audioFramePlugin;
}agora_audio_plugin_info;

 IAudioFramePlugin* createAudioFramePlugin();
