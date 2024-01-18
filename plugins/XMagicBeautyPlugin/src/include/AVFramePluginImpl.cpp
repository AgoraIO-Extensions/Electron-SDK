#include "AVFramePluginImpl.h"
#include "AVFramePluginBase.h"

namespace agora {
namespace plugin {

AVFramePluginImpl::AVFramePluginImpl() {}

AVFramePluginImpl::~AVFramePluginImpl() {}

int AVFramePluginImpl::load(const char *path) {
  return AVFramePluginError::kOk;
}

int AVFramePluginImpl::unLoad() { return AVFramePluginError::kOk; }

int AVFramePluginImpl::enable() { return AVFramePluginError::kOk; }

int AVFramePluginImpl::disable() { return AVFramePluginError::kOk; }

int AVFramePluginImpl::setParameter(const char *param) {
  return AVFramePluginError::kOk;
}

const char *AVFramePluginImpl::getParameter(const char *key) { return ""; }

int AVFramePluginImpl::release() { return AVFramePluginError::kOk; }

bool AVFramePluginImpl::onPluginCaptureVideoFrame(
    VideoPluginFrame *videoFrame) {
  return true;
}

bool AVFramePluginImpl::onPluginRenderVideoFrame(unsigned int uid,
                                                 VideoPluginFrame *videoFrame) {
  return true;
}

bool AVFramePluginImpl::onPluginRecordAudioFrame(AudioPluginFrame *audioFrame) {
  return true;
}

bool AVFramePluginImpl::onPluginPlaybackAudioFrame(
    AudioPluginFrame *audioFrame) {
  return true;
}

bool AVFramePluginImpl::onPluginMixedAudioFrame(AudioPluginFrame *audioFrame) {
  return true;
}

bool AVFramePluginImpl::onPluginPlaybackAudioFrameBeforeMixing(
    unsigned int uid, AudioPluginFrame *audioFrame) {
  return true;
}

bool AVFramePluginImpl::onPluginSendAudioPacket(PluginPacket *packet) {
  return true;
}

bool AVFramePluginImpl::onPluginSendVideoPacket(PluginPacket *packet) {
  return true;
}

bool AVFramePluginImpl::onPluginReceiveAudioPacket(PluginPacket *packet) {
  return true;
}

bool AVFramePluginImpl::onPluginReceiveVideoPacket(PluginPacket *packet) {
  return true;
}

} // namespace plugin
} // namespace agora