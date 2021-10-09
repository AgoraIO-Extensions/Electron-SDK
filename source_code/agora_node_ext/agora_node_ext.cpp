/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:52:36
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-07-29 15:48:30
 */

#include "node_iris_rtc_engine.h"

using namespace agora::rtc::electron;

napi_value Init(napi_env env, napi_value exports) {
    return NodeIrisRtcEngine::Init(env, exports);
}
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)