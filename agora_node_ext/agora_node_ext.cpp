/*
 * Copyright (c) 2017 Agora.io
 * All rights reserved.
 * Proprietary and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2017
 */

#include "agora_node_ext.h"
#include "agora_rtc_engine.h"
using agora::rtc::NodeRtcEngine;
using v8::Object;

/**
 * Initialize NODEJS ADDON
 */
void InitExt(Local<Object> module) {
  LOG_ENTER;
  NodeRtcEngine::Init(module);
  LOG_LEAVE;
}

/**
 * NODEJS registration
 */
NAPI_MODULE(NODE_GYP_MODULE_NAME, InitExt)
