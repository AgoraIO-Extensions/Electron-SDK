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
const std::string assets_dir_name = "Resources";
const std::string file_separator = "/";
#endif

#if defined(_WIN32)
const std::string assets_dir_name = "assets";
const std::string file_separator = "\\";
#endif


const std::string g_v3Data = "v3.bundle";

// std::string faceBeautyParamName[] = { "blur_level","color_level", "red_level", "eye_bright", "tooth_whiten" };

const std::string default_filter_name = "origin";
const double default_filter_level = 1.0;
const double default_color_level = 0.2;
const double default_red_level = 0.5;
const double default_blur_level = 6.0;
const double default_skin_detect = 0.0;
const double default_nonshin_blur_scale = 0.45;
const double default_heavy_blur = 0;
const double default_face_shape = 3;
const double default_face_shape_level = 1.0;
const double default_eye_enlarging = 0.5;
const double default_cheek_thinning = 0.0;
const double default_intensity_nose = 0.0;
const double default_intensity_forehead = 0.5;
const double default_intensity_mouth = 0.5;
const double default_intensity_chin = 0.5;
const double default_change_frames = 0.0;
const double default_eye_bright = 1.0;
const double default_tooth_whiten = 1.0;
const double default_is_beauty_on = 0.0;

#endif // !FU_CONFIG_H