#pragma once

#include "IAVFramePlugin.h"

namespace agora {
namespace plugin {

class AVFramePluginImpl : public IAVFramePlugin {
public:
  AVFramePluginImpl();

private:
  ~AVFramePluginImpl();

public:
  int load(const char *path) override;
  int unLoad() override;
  int enable() override;
  int disable() override;
  int setParameter(const char *param) override;
  const char *getParameter(const char *key) override;
  int release() override;

  bool onPluginCaptureVideoFrame(VideoPluginFrame *videoFrame) override;
  bool onPluginRenderVideoFrame(unsigned int uid,
                                VideoPluginFrame *videoFrame) override;

  bool onPluginRecordAudioFrame(AudioPluginFrame *audioFrame) override;
  bool onPluginPlaybackAudioFrame(AudioPluginFrame *audioFrame) override;
  bool onPluginMixedAudioFrame(AudioPluginFrame *audioFrame) override;
  bool
  onPluginPlaybackAudioFrameBeforeMixing(unsigned int uid,
                                         AudioPluginFrame *audioFrame) override;
  bool onPluginSendAudioPacket(PluginPacket *packet) override;
  bool onPluginSendVideoPacket(PluginPacket *packet) override;
  bool onPluginReceiveAudioPacket(PluginPacket *packet) override;
  bool onPluginReceiveVideoPacket(PluginPacket *packet) override;
};

} // namespace plugin
} // namespace agora