// //
// //  Agora Media SDK
// //
// //  Created by Sting Feng in 2015-05.
// //  Copyright (c) 2015 Agora IO. All rights reserved.
// //
// #pragma once
// #include "IAgoraRtcEngine.h"
// // #include "IAgoraRtcChannel.h"

// namespace agora {
// namespace rtc {

// enum AppType {
//     APP_TYPE_NATIVE = 0,
//     APP_TYPE_COCOS = 1,
//     APP_TYPE_UNITY = 2,
//     APP_TYPE_ELECTRON = 3,
//     APP_TYPE_FLUTTER = 4,
//     APP_TYPE_UNREAL = 5,
//     APP_TYPE_XAMARIN = 6,
//     APP_TYPE_APICLOUD = 7,
// };
  
// class IRtcEngine3 : public IRtcEngine2
// {
// public:
//     /**
//     * Specify video stream parameters based on video profile
//     * @param [in] width
//     *        width of video resolution in pixel
//     * @param [in] height
//     *        height of video resolution in pixel
//     * @param [in] frameRate
//     *        frame rate in fps
//     * @param [in] bitrate
//     *        bit rate in kbps
//     * @return return 0 if success or an error code
//     */
//     virtual int setVideoProfileEx(int width, int height, int frameRate, int bitrate) = 0;
//     virtual int setAppType(AppType appType) = 0;
// };

// }}