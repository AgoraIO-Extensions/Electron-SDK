/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:52:36
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-10 22:07:49
 */

#include "agora_electron_bridge.h"

using namespace agora::rtc::electron;

napi_value Init(napi_env env, napi_value exports) {
  return AgoraElectronBridge::Init(env, exports);
}
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
