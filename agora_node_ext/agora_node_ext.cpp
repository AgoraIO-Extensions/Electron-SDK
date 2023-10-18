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
#include "dump.h"

using agora::rtc::NodeRtcEngine;
using v8::Object;

void miniDmpSenderCallback(UINT nCode, LPVOID lVal1, LPVOID lVal2) {
  LOG_ERROR(
      "Crash happened, exception code : 0x%08x val0: 0x%08x val1 0x%08x\n",
      nCode, (std::uintptr_t)lVal1, (std::uintptr_t)lVal2);
}

/**
 * Initialize NODEJS ADDON
 */
void InitExt(Local<Object> module) {
  LOG_ENTER;
  initializeDump(L"3.6.1.19", miniDmpSenderCallback);
  NodeRtcEngine::Init(module);
  LOG_LEAVE;
}

/**
 * NODEJS registration
 */
NAPI_MODULE(NODE_GYP_MODULE_NAME, InitExt)
