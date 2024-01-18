#include "AVFramePluginImpl.h"

IAVFramePlugin *createAVFramePlugin() {
  return new agora::plugin::AVFramePluginImpl();
}