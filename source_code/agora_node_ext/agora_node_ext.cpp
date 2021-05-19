/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:52:36
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-10 21:24:32
 */

#include "node_iris_rtc_engine.h"

using namespace agora::rtc::electron;

void Init(v8_Local<v8_Object> module) { NodeIrisRtcEngine::Init(module); }
NODE_MODULE(NODE_GYP_MODULE_NAME, Init)