/*
* Copyright (c) 2019 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

//#pragma once
#ifndef FU_CONFIG_H
#define FU_CONFIG_H

#include <string>

const std::string g_faceBeautification = "face_beautification.bundle";

const std::string g_LightMakeup = "light_makeup.bundle";

const std::string g_gestureRecongnition = "heart.bundle";

const std::string g_anim_model = "anim_model.bundle";

const std::string g_ardata_ex = "ardata_ex.bundle";

const std::string g_fxaa = "fxaa.bundle";

const std::string g_tongue = "tongue.bundle";

#if defined(__APPLE__)
const std::string g_fuDataDir = "../common/FULive/mac/Resources/";
#endif

#if defined(_WIN32)
const std::string g_fuDataDir = "../common/FULive/win/assets/";
#endif


const std::string g_v3Data = "v3.bundle";

std::string faceBeautyParamName[] = { "blur_level","color_level", "red_level", "eye_bright", "tooth_whiten" };

#endif // !FU_CONFIG_H