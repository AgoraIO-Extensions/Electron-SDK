//
// AgoraEnumerates.h
// AgoraRtcEngineKit
//
// Copyright (c) 2018 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>

/** Warning code.

Warning codes occur when the SDK encounters an error that may be recovered automatically. These are only notifications, and can generally be ignored. For example, when the SDK loses connection to the server, the SDK reports the AgoraWarningCodeOpenChannelTimeout(106) warning and tries to reconnect automatically.
*/
typedef NS_ENUM(NSInteger, AgoraWarningCode) {
    /** 8: The specified view is invalid. Specify a view when using the video call function. */
    AgoraWarningCodeInvalidView = 8,
    /** 16: Failed to initialize the video function, possibly caused by a lack of resources. The users cannot see the video while the voice communication is not affected. */
    AgoraWarningCodeInitVideo = 16,
     /** 20: The request is pending, usually due to some module not being ready, and the SDK postpones processing the request. */
    AgoraWarningCodePending = 20,
    /** 103: No channel resources are available. Maybe because the server cannot allocate any channel resource. */
    AgoraWarningCodeNoAvailableChannel = 103,
    /** 104: A timeout occurs when looking up the channel. When joining a channel, the SDK looks up the specified channel. The warning usually occurs when the network condition is too poor for the SDK to connect to the server. */
    AgoraWarningCodeLookupChannelTimeout = 104,
    /** 105: The server rejects the request to look up the channel. The server cannot process this request or the request is illegal.
     <br></br><b>DEPRECATED</b> as of v2.4.1. Use AgoraConnectionChangedRejectedByServer(10) in the `reason` parameter of [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]).
     */
    AgoraWarningCodeLookupChannelRejected = 105,
    /** 106: The server rejects the request to look up the channel. The server cannot process this request or the request is illegal. */
    AgoraWarningCodeOpenChannelTimeout = 106,
    /** 107: The server rejects the request to open the channel. The server cannot process this request or the request is illegal. */
    AgoraWarningCodeOpenChannelRejected = 107,
    /** 111: A timeout occurs when switching to the live video. */
    AgoraWarningCodeSwitchLiveVideoTimeout = 111,
    /** 118: A timeout occurs when setting the client role in the live broadcast profile. */
    AgoraWarningCodeSetClientRoleTimeout = 118,
    /** 119: The client role is unauthorized. */
    AgoraWarningCodeSetClientRoleNotAuthorized = 119,
    /** 121: The ticket to open the channel is invalid. */
    AgoraWarningCodeOpenChannelInvalidTicket = 121,
    /** 122: Try connecting to another server. */
    AgoraWarningCodeOpenChannelTryNextVos = 122,
    /** 701: An error occurs in opening the audio mixing file. */
    AgoraWarningCodeAudioMixingOpenError = 701,
    /** 1014: Audio Device Module: a warning occurs in the playback device. */
    AgoraWarningCodeAdmRuntimePlayoutWarning = 1014,
    /** 1016: Audio Device Module: a warning occurs in the recording device. */
    AgoraWarningCodeAdmRuntimeRecordingWarning = 1016,
    /** 1019: Audio Device Module: no valid audio data is collected. */
    AgoraWarningCodeAdmRecordAudioSilence = 1019,
    /** 1020: Audio Device Module: a playback device fails. */
    AgoraWarningCodeAdmPlaybackMalfunction = 1020,
    /** 1021: Audio Device Module: a recording device fails. */
    AgoraWarningCodeAdmRecordMalfunction = 1021,
    /** 1025: The system interrupts the audio session, and the session is no longer active. */
    AgoraWarningCodeAdmInterruption = 1025,
    /** 1031: Audio Device Module: the recorded audio is too low. */
    AgoraWarningCodeAdmRecordAudioLowlevel = 1031,
    /** 1032: Audio Device Module: the playback audio is too low. */
    AgoraWarningCodeAdmPlayoutAudioLowlevel = 1032,
    /** 1051: Audio Device Module: howling is detected. */
    AgoraWarningCodeApmHowling = 1051,
    /** 1052: Audio Device Module: the device is in the glitch state. */
    AgoraWarningCodeAdmGlitchState = 1052,
    /** 1053: Audio Device Module: the underlying audio settings have changed. */
    AgoraWarningCodeAdmImproperSettings = 1053,
};

/** Error code.

Error codes occur when the SDK encounters an error that cannot be recovered automatically without any app intervention. For example, the SDK reports the AgoraErrorCodeStartCall = 1002 error if it fails to start a call, and reminds the user to call the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method.
*/
typedef NS_ENUM(NSInteger, AgoraErrorCode) {
    /** 0: No error occurs. */
    AgoraErrorCodeNoError = 0,
    /** 1: A general error occurs (no specified reason). */
    AgoraErrorCodeFailed = 1,
    /** 2: An invalid parameter is used. For example, the specific channel name includes illegal characters. */
    AgoraErrorCodeInvalidArgument = 2,
    /** 3: The SDK module is not ready.
     <p>Possible solutions：
     <ul><li>Check the audio device.</li>
     <li>Check the completeness of the app.</li>
     <li>Re-initialize the SDK.</li></ul></p>
    */
    AgoraErrorCodeNotReady = 3,
    /** 4: The current state of the SDK does not support this function. */
    AgoraErrorCodeNotSupported = 4,
    /** 5: The request is rejected. This is for internal SDK use only, and is not returned to the app through any method or callback. */
    AgoraErrorCodeRefused = 5,
    /** 6: The buffer size is not big enough to store the returned data. */
    AgoraErrorCodeBufferTooSmall = 6,
    /** 7: The SDK is not initialized before calling this method. */
    AgoraErrorCodeNotInitialized = 7,
    /** 9: No permission exists. This is for internal SDK use only, and is not returned to the app through any method or callback. */
    AgoraErrorCodeNoPermission = 9,
    /** 10: An API method timeout occurs. Some API methods require the SDK to return the execution result, and this error occurs if the request takes too long (over 10 seconds) for the SDK to process. */
    AgoraErrorCodeTimedOut = 10,
    /** 11: The request is canceled. This is for internal SDK use only, and is not returned to the app through any method or callback. */
    AgoraErrorCodeCanceled = 11,
    /** 12: The method is called too often. This is for internal SDK use only, and is not returned to the app through any method or callback. */
    AgoraErrorCodeTooOften = 12,
    /** 13: The SDK fails to bind to the network socket. This is for internal SDK use only, and is not returned to the app through any method or callback. */
    AgoraErrorCodeBindSocket = 13,
    /** 14: The network is unavailable. This is for internal SDK use only, and is not returned to the app through any method or callback. */
    AgoraErrorCodeNetDown = 14,
    /** 15: No network buffers are available. This is for internal SDK use only, and is not returned to the app through any method or callback. */
    AgoraErrorCodeNoBufs = 15,
    /** 17: The request to join the channel is rejected.
     <p>Possible reasons are:
     <ul><li>The user is already in the channel, and still calls the API method to join the channel, for example, [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]).</li>
     <li>The user tries joining the channel during the echo test. Please join the channel after the echo test ends.</li></ul></p>
    */
    AgoraErrorCodeJoinChannelRejected = 17,
    /** 18: The request to leave the channel is rejected.
     <p>Possible reasons are:
     <ul><li>The user left the channel and still calls the API method to leave the channel, for example, [leaveChannel]([AgoraRtcEngineKit leaveChannel:]).</li>
     <li>The user has not joined the channel and calls the API method to leave the channel.</li></ul></p>
    */
    AgoraErrorCodeLeaveChannelRejected = 18,
    /** 19: The resources are occupied and cannot be used. */
    AgoraErrorCodeAlreadyInUse = 19,
    /** 20: The SDK gave up the request due to too many requests.  */
    AgoraErrorCodeAbort = 20,
    /** 21: In Windows, specific firewall settings cause the SDK to fail to initialize and crash. */
    AgoraErrorCodeInitNetEngine = 21,
    /** 22: The app uses too much of the system resources and the SDK fails to allocate the resources. */
    AgoraErrorCodeResourceLimited = 22,
    /** 101: The specified App ID is invalid. Please try to rejoin the channel with a valid App ID.*/
    AgoraErrorCodeInvalidAppId = 101,
    /** 102: The specified channel name is invalid. Please try to rejoin the channel with a valid channel name. */
    AgoraErrorCodeInvalidChannelId = 102,
    /** 109: The token expired.
     <br></br><b>DEPRECATED</b> as of v2.4.1. Use AgoraConnectionChangedTokenExpired(9) in the `reason` parameter of [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]).
     <p>Possible reasons are:
     <ul><li>Authorized Timestamp expired: The timestamp is represented by the number of seconds elapsed since 1/1/1970. The user can use the token to access the Agora service within five minutes after the token is generated. If the user does not access the Agora service after five minutes, this token is no longer valid.</li>
     <li>Call Expiration Timestamp expired: The timestamp is the exact time when a user can no longer use the Agora service (for example, when a user is forced to leave an ongoing call). When a value is set for the Call Expiration Timestamp, it does not mean that the token will expire, but that the user will be banned from the channel.</li></ul></p>
     */
    AgoraErrorCodeTokenExpired = 109,
    /** 110: The token is invalid.
<br></br><b>DEPRECATED</b> as of v2.4.1. Use AgoraConnectionChangedInvalidToken(8) in the `reason` parameter of [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]).
     <p>Possible reasons are:
     <ul><li>The App Certificate for the project is enabled in Dashboard, but the user is using the App ID. Once the App Certificate is enabled, the user must use a token.</li>
     <li>The uid is mandatory, and users must set the same uid as the one set in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.</li></ul></p>
     */
    AgoraErrorCodeInvalidToken = 110,
    /** 111: The Internet connection is interrupted. This applies to the Agora Web SDK only. */
    AgoraErrorCodeConnectionInterrupted = 111,
    /** 112: The Internet connection is lost. This applies to the Agora Web SDK only. */
    AgoraErrorCodeConnectionLost = 112,
    /** 113: The user is not in the channel when calling the [sendStreamMessage]([AgoraRtcEngineKit sendStreamMessage:data:]) or [getUserInfoByUserAccount]([AgoraRtcEngineKit getUserInfoByUserAccount:withError:]) method. */
    AgoraErrorCodeNotInChannel = 113,
    /** 114: The size of the sent data is over 1024 bytes when the user calls the [sendStreamMessage]([AgoraRtcEngineKit sendStreamMessage:data:]) method. */
    AgoraErrorCodeSizeTooLarge = 114,
    /** 115: The bitrate of the sent data exceeds the limit of 6 Kbps when the user calls the [sendStreamMessage]([AgoraRtcEngineKit sendStreamMessage:data:]) method. */
    AgoraErrorCodeBitrateLimit = 115,
    /** 116: Too many data streams (over five streams) are created when the user calls the [createDataStream]([AgoraRtcEngineKit createDataStream:reliable:ordered:]) method. */
    AgoraErrorCodeTooManyDataStreams = 116,
    /** 120: Decryption fails. The user may have used a different encryption password to join the channel. Check your settings or try rejoining the channel. */
    AgoraErrorCodeDecryptionFailed = 120,
    /** 124: Incorrect watermark file parameter. */
    AgoraErrorCodeWatermarkParam = 124,
    /** 125: Incorrect watermark file path. */
    AgoraErrorCodeWatermarkPath = 125,
    /** 126: Incorrect watermark file format. */
    AgoraErrorCodeWatermarkPng = 126,
    /** 127: Incorrect watermark file information. */
    AgoraErrorCodeWatermarkInfo = 127,
    /** 128: Incorrect watermark file data format. */
    AgoraErrorCodeWatermarkAGRB = 128,
    /** 129: An error occurs in reading the watermark file. */
    AgoraErrorCodeWatermarkRead = 129,
    /** 130: The encrypted stream is not allowed to publish. */
    AgoraErrorCodeEncryptedStreamNotAllowedPublish = 130,
    /** 134: The user account is invalid. */
    AgoraErrorCodeInvalidUserAccount = 134,

    /** 151: CDN related errors. Remove the original URL address and add a new one by calling the [removePublishStreamUrl]([AgoraRtcEngineKit removePublishStreamUrl:]) and [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) methods. */
    AgoraErrorCodePublishStreamCDNError = 151,
    /** 152: The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones. */
    AgoraErrorCodePublishStreamNumReachLimit = 152,
    /** 153: The host manipulates other hosts' URLs. Check your app logic. */
    AgoraErrorCodePublishStreamNotAuthorized = 153,
    /** 154: An error occurs in Agora's streaming server. Call the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method to publish the stream again. */
    AgoraErrorCodePublishStreamInternalServerError = 154,
    /** 155: The server fails to find the stream. */
    AgoraErrorCodePublishStreamNotFound = 155,
    /** 156: The format of the RTMP stream URL is not supported. Check whether the URL format is correct. */
    AgoraErrorCodePublishStreamFormatNotSuppported = 156,

    /** 1001: Fails to load the media engine. */
    AgoraErrorCodeLoadMediaEngine = 1001,
    /** 1002: Fails to start the call after enabling the media engine. */
    AgoraErrorCodeStartCall = 1002,
    /** 1003: Fails to start the camera.
     <br></br><b>DEPRECATED</b> as of v2.4.1. Use AgoraLocalVideoStreamErrorCaptureFailure(4) in the `error` parameter of [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]).
     */
    AgoraErrorCodeStartCamera = 1003,
    /** 1004: Fails to start the video rendering module. */
    AgoraErrorCodeStartVideoRender = 1004,
    /** 1005: A general error occurs in the Audio Device Module (the reason is not classified specifically). Check if the audio device is used by another app, or try rejoining the channel. */
    AgoraErrorCodeAdmGeneralError = 1005,
    /** 1006: Audio Device Module: An error occurs in using the Java resources. */
    AgoraErrorCodeAdmJavaResource = 1006,
    /** 1007: Audio Device Module: An error occurs in setting the sampling frequency. */
    AgoraErrorCodeAdmSampleRate = 1007,
    /** 1008: Audio Device Module: An error occurs in initializing the playback device. */
    AgoraErrorCodeAdmInitPlayout = 1008,
    /** 1009: Audio Device Module: An error occurs in starting the playback device. */
    AgoraErrorCodeAdmStartPlayout = 1009,
    /** 1010: Audio Device Module: An error occurs in stopping the playback device. */
    AgoraErrorCodeAdmStopPlayout = 1010,
    /** 1011: Audio Device Module: An error occurs in initializing the recording device. */
    AgoraErrorCodeAdmInitRecording = 1011,
    /** 1012: Audio Device Module: An error occurs in starting the recording device. */
    AgoraErrorCodeAdmStartRecording = 1012,
    /** 1013: Audio Device Module: An error occurs in stopping the recording device. */
    AgoraErrorCodeAdmStopRecording = 1013,
    /** 1015: Audio Device Module: A playback error occurs. Check your playback device, or try rejoining the channel. */
    AgoraErrorCodeAdmRuntimePlayoutError = 1015,
    /** 1017: Audio Device Module: A recording error occurs. */
    AgoraErrorCodeAdmRuntimeRecordingError = 1017,
    /** 1018: Audio Device Module: Fails to record. */
    AgoraErrorCodeAdmRecordAudioFailed = 1018,
    /** 1020: Audio Device Module: Abnormal audio playback frequency. */
    AgoraErrorCodeAdmPlayAbnormalFrequency = 1020,
    /** 1021: Audio Device Module: Abnormal audio recording frequency. */
    AgoraErrorCodeAdmRecordAbnormalFrequency = 1021,
    /** 1022: Audio Device Module: An error occurs in initializing the loopback device. */
    AgoraErrorCodeAdmInitLoopback  = 1022,
    /** 1023: Audio Device Module: An error occurs in starting the loopback device. */
    AgoraErrorCodeAdmStartLoopback = 1023,
    /** 1027: Audio Device Module: An error occurs in no recording Permission. */
    AgoraErrorCodeAdmNoPermission = 1027,
    /** 1359: No recording device exists. */
    AgoraErrorCodeAdmNoRecordingDevice = 1359,
    /** 1360: No playback device exists. */
    AgoraErrorCodeAdmNoPlayoutDevice = 1360,
    /** 1501: Video Device Module: The camera is unauthorized. */
    AgoraErrorCodeVdmCameraNotAuthorized = 1501,
    /** 1600: Video Device Module: An unknown error occurs. */
    AgoraErrorCodeVcmUnknownError = 1600,
    /** 1601: Video Device Module: An error occurs in initializing the video encoder. */
    AgoraErrorCodeVcmEncoderInitError = 1601,
    /** 1602: Video Device Module: An error occurs in video encoding. */
    AgoraErrorCodeVcmEncoderEncodeError = 1602,
    /** 1603: Video Device Module: An error occurs in setting the video encoder.
    <p><b>DEPRECATED</b></p>
    */
    AgoraErrorCodeVcmEncoderSetError = 1603,
};

/** The state of the audio mixing file. */
typedef NS_ENUM(NSInteger, AgoraAudioMixingStateCode){
    /** The audio mixing file is playing. */
    AgoraAudioMixingStatePlaying = 710,
    /** The audio mixing file pauses playing. */
    AgoraAudioMixingStatePaused = 711,
    /** The audio mixing file stops playing. */
    AgoraAudioMixingStateStopped = 713,
    /** An exception occurs when playing the audio mixing file. */
    AgoraAudioMixingStateFailed = 714,
};

/**  The error code of the audio mixing file. */
typedef NS_ENUM(NSInteger, AgoraAudioMixingErrorCode){
    /** The SDK cannot open the audio mixing file. */
   AgoraAudioMixingErrorCanNotOpen = 701,
   /** The SDK opens the audio mixing file too frequently. */
   AgoraAudioMixingErrorTooFrequentCall = 702,
   /** The opening of the audio mixing file is interrupted. */
   AgoraAudioMixingErrorInterruptedEOF = 703,
   /** No error. */
   AgoraAudioMixingErrorOK = 0,
};

/** Video profile.

**DEPRECATED**

Please use AgoraVideoEncoderConfiguration.

iPhones do not support resolutions above 720p.
*/
typedef NS_ENUM(NSInteger, AgoraVideoProfile) {
    /** Invalid profile. */
    AgoraVideoProfileInvalid = -1,
    /** Resolution 160 &times; 120, frame rate 15 fps, bitrate 65 Kbps. */
    AgoraVideoProfileLandscape120P = 0,
    /** (iOS only) Resolution 120 &times; 120, frame rate 15 fps, bitrate 50 Kbps. */
    AgoraVideoProfileLandscape120P_3 = 2,
    /** (iOS only) Resolution 320 &times; 180, frame rate 15 fps, bitrate 140 Kbps. */
    AgoraVideoProfileLandscape180P = 10,
    /** (iOS only) Resolution 180 &times; 180, frame rate 15 fps, bitrate 100 Kbps. */
    AgoraVideoProfileLandscape180P_3 = 12,
    /** Resolution 240 &times; 180, frame rate 15 fps, bitrate 120 Kbps. */
    AgoraVideoProfileLandscape180P_4 = 13,
    /** Resolution 320 &times; 240, frame rate 15 fps, bitrate 200 Kbps. */
    AgoraVideoProfileLandscape240P = 20,
    /** (iOS only) Resolution 240 &times; 240, frame rate 15 fps, bitrate 140 Kbps. */
    AgoraVideoProfileLandscape240P_3 = 22,
    /** Resolution 424 &times; 240, frame rate 15 fps, bitrate 220 Kbps. */
    AgoraVideoProfileLandscape240P_4 = 23,
    /** Resolution 640 &times; 360, frame rate 15 fps, bitrate 400 Kbps. */
    AgoraVideoProfileLandscape360P = 30,
    /** (iOS only) Resolution 360 &times; 360, frame rate 15 fps, bitrate 260 Kbps. */
    AgoraVideoProfileLandscape360P_3 = 32,
    /** Resolution 640 &times; 360, frame rate 30 fps, bitrate 600 Kbps. */
    AgoraVideoProfileLandscape360P_4 = 33,
    /** Resolution 360 &times; 360, frame rate 30 fps, bitrate 400 Kbps. */
    AgoraVideoProfileLandscape360P_6 = 35,
    /** Resolution 480 &times; 360, frame rate 15 fps, bitrate 320 Kbps. */
    AgoraVideoProfileLandscape360P_7 = 36,
    /** Resolution 480 &times; 360, frame rate 30 fps, bitrate 490 Kbps. */
    AgoraVideoProfileLandscape360P_8 = 37,
    /** Resolution 640 &times; 360, frame rate 15 fps, bitrate 800 Kbps.
    <br>
     <b>Note:</b> This profile applies to the live broadcast channel profile only.
     */
    AgoraVideoProfileLandscape360P_9 = 38,
    /** Resolution 640 &times; 360, frame rate 24 fps, bitrate 800 Kbps.
    <br>
     <b>Note:</b> This profile applies to the live broadcast channel profile only.
     */
    AgoraVideoProfileLandscape360P_10 = 39,
    /** Resolution 640 &times; 360, frame rate 24 fps, bitrate 1000 Kbps.
    <br>
     <b>Note:</b> This profile applies to the live broadcast channel profile only.
     */
    AgoraVideoProfileLandscape360P_11 = 100,
    /** Resolution 640 &times; 480, frame rate 15 fps, bitrate 500 Kbps. */
    AgoraVideoProfileLandscape480P = 40,
    /** (iOS only) Resolution 480 &times; 480, frame rate 15 fps, bitrate 400 Kbps. */
    AgoraVideoProfileLandscape480P_3 = 42,
    /** Resolution 640 &times; 480, frame rate 30 fps, bitrate 750 Kbps. */
    AgoraVideoProfileLandscape480P_4 = 43,
    /** Resolution 480 &times; 480, frame rate 30 fps, bitrate 600 Kbps. */
    AgoraVideoProfileLandscape480P_6 = 45,
    /** Resolution 848 &times; 480, frame rate 15 fps, bitrate 610 Kbps. */
    AgoraVideoProfileLandscape480P_8 = 47,
    /** Resolution 848 &times; 480, frame rate 30 fps, bitrate 930 Kbps. */
    AgoraVideoProfileLandscape480P_9 = 48,
    /** Resolution 640 &times; 480, frame rate 10 fps, bitrate 400 Kbps. */
    AgoraVideoProfileLandscape480P_10 = 49,
    /** Resolution 1280 &times; 720, frame rate 15 fps, bitrate 1130 Kbps. */
    AgoraVideoProfileLandscape720P = 50,
    /** Resolution 1280 &times; 720, frame rate 30 fps, bitrate 1710 Kbps. */
    AgoraVideoProfileLandscape720P_3 = 52,
    /** Resolution 960 &times; 720, frame rate 15 fps, bitrate 910 Kbps. */
    AgoraVideoProfileLandscape720P_5 = 54,
    /** Resolution 960 &times; 720, frame rate 30 fps, bitrate 1380 Kbps. */
    AgoraVideoProfileLandscape720P_6 = 55,
    /** (macOS only) Resolution 1920 &times; 1080, frame rate 15 fps, bitrate 2080 Kbps. */
    AgoraVideoProfileLandscape1080P = 60,
    /** (macOS only) Resolution 1920 &times; 1080, frame rate 30 fps, bitrate 3150 Kbps. */
    AgoraVideoProfileLandscape1080P_3 = 62,
    /** (macOS only) Resolution 1920 &times; 1080, frame rate 60 fps, bitrate 4780 Kbps. */
    AgoraVideoProfileLandscape1080P_5 = 64,
    /** (macOS only) Resolution 2560 &times; 1440, frame rate 30 fps, bitrate 4850 Kbps. */
    AgoraVideoProfileLandscape1440P = 66,
    /** (macOS only) Resolution 2560 &times; 1440, frame rate 60 fps, bitrate 6500 Kbps. */
    AgoraVideoProfileLandscape1440P_2 = 67,
    /** (macOS only) Resolution 3840 &times; 2160, frame rate 30 fps, bitrate 6500 Kbps. */
    AgoraVideoProfileLandscape4K = 70,
    /** (macOS only) Resolution 3840 &times; 2160, frame rate 60 fps, bitrate 6500 Kbps. */
    AgoraVideoProfileLandscape4K_3 = 72,

    /** Resolution 120 &times; 160, frame rate 15 fps, bitrate 65 Kbps. */
    AgoraVideoProfilePortrait120P = 1000,
    /** (iOS only) Resolution 120 &times; 120, frame rate 15 fps, bitrate 50 Kbps. */
    AgoraVideoProfilePortrait120P_3 = 1002,
    /** (iOS only) Resolution 180 &times; 320, frame rate 15 fps, bitrate 140 Kbps. */
    AgoraVideoProfilePortrait180P = 1010,
    /** (iOS only) Resolution 180 &times; 180, frame rate 15 fps, bitrate 100 Kbps. */
    AgoraVideoProfilePortrait180P_3 = 1012,
    /** Resolution 180 &times; 240, frame rate 15 fps, bitrate 120 Kbps. */
    AgoraVideoProfilePortrait180P_4 = 1013,
    /** Resolution 240 &times; 320, frame rate 15 fps, bitrate 200 Kbps. */
    AgoraVideoProfilePortrait240P = 1020,
    /** (iOS only) Resolution 240 &times; 240, frame rate 15 fps, bitrate 140 Kbps. */
    AgoraVideoProfilePortrait240P_3 = 1022,
    /** Resolution 240 &times; 424, frame rate 15 fps, bitrate 220 Kbps. */
    AgoraVideoProfilePortrait240P_4 = 1023,
    /** Resolution 360 &times; 640, frame rate 15 fps, bitrate 400 Kbps. */
    AgoraVideoProfilePortrait360P = 1030,
    /** (iOS only) Resolution 360 &times; 360, frame rate 15 fps, bitrate 260 Kbps. */
    AgoraVideoProfilePortrait360P_3 = 1032,
    /** Resolution 360 &times; 640, frame rate 30 fps, bitrate 600 Kbps. */
    AgoraVideoProfilePortrait360P_4 = 1033,
    /** Resolution 360 &times; 360, frame rate 30 fps, bitrate 400 Kbps. */
    AgoraVideoProfilePortrait360P_6 = 1035,
    /** Resolution 360 &times; 480, frame rate 15 fps, bitrate 320 Kbps. */
    AgoraVideoProfilePortrait360P_7 = 1036,
    /** Resolution 360 &times; 480, frame rate 30 fps, bitrate 490 Kbps. */
    AgoraVideoProfilePortrait360P_8 = 1037,
    /** Resolution 360 &times; 640, frame rate 15 fps, bitrate 600 Kbps. */
    AgoraVideoProfilePortrait360P_9 = 1038,
    /** Resolution 360 &times; 640, frame rate 24 fps, bitrate 800 Kbps. */
    AgoraVideoProfilePortrait360P_10 = 1039,
    /** Resolution 360 &times; 640, frame rate 24 fps, bitrate 800 Kbps. */
    AgoraVideoProfilePortrait360P_11 = 1100,
    /** Resolution 480 &times; 640, frame rate 15 fps, bitrate 500 Kbps. */
    AgoraVideoProfilePortrait480P = 1040,
    /** (iOS only) Resolution 480 &times; 480, frame rate 15 fps, bitrate 400 Kbps. */
    AgoraVideoProfilePortrait480P_3 = 1042,
    /** Resolution 480 &times; 640, frame rate 30 fps, bitrate 750 Kbps. */
    AgoraVideoProfilePortrait480P_4 = 1043,
    /** Resolution 480 &times; 480, frame rate 30 fps, bitrate 600 Kbps. */
    AgoraVideoProfilePortrait480P_6 = 1045,
    /** Resolution 480 &times; 848, frame rate 15 fps, bitrate 610 Kbps. */
    AgoraVideoProfilePortrait480P_8 = 1047,
    /** Resolution 480 &times; 848, frame rate 30 fps, bitrate 930 Kbps. */
    AgoraVideoProfilePortrait480P_9 = 1048,
    /** Resolution 480 &times; 640, frame rate 10 fps, bitrate 400 Kbps. */
    AgoraVideoProfilePortrait480P_10 = 1049,
    /** Resolution 720 &times; 1280, frame rate 15 fps, bitrate 1130 Kbps. */
    AgoraVideoProfilePortrait720P = 1050,
    /** Resolution 720 &times; 1280, frame rate 30 fps, bitrate 1710 Kbps. */
    AgoraVideoProfilePortrait720P_3 = 1052,
    /** Resolution 720 &times; 960, frame rate 15 fps, bitrate 910 Kbps. */
    AgoraVideoProfilePortrait720P_5 = 1054,
    /** Resolution 720 &times; 960, frame rate 30 fps, bitrate 1380 Kbps. */
    AgoraVideoProfilePortrait720P_6 = 1055,
    /** (macOS only) Resolution 1080 &times; 1920, frame rate 15 fps, bitrate 2080 Kbps. */
    AgoraVideoProfilePortrait1080P = 1060,
    /** (macOS only) Resolution 1080 &times; 1920, frame rate 30 fps, bitrate 3150 Kbps. */
    AgoraVideoProfilePortrait1080P_3 = 1062,
    /** (macOS only) Resolution 1080 &times; 1920, frame rate 60 fps, bitrate 4780 Kbps. */
    AgoraVideoProfilePortrait1080P_5 = 1064,
    /** (macOS only) Resolution 1440 &times; 2560, frame rate 30 fps, bitrate 4850 Kbps. */
    AgoraVideoProfilePortrait1440P = 1066,
    /** (macOS only) Resolution 1440 &times; 2560, frame rate 60 fps, bitrate 6500 Kbps. */
    AgoraVideoProfilePortrait1440P_2 = 1067,
    /** (macOS only) Resolution 2160 &times; 3840, frame rate 30 fps, bitrate 6500 Kbps. */
    AgoraVideoProfilePortrait4K = 1070,
    /** (macOS only) Resolution 2160 &times; 3840, frame rate 60 fps, bitrate 6500 Kbps. */
    AgoraVideoProfilePortrait4K_3 = 1072,
    /** (Default) Resolution 640 &times; 360, frame rate 15 fps, bitrate 400 Kbps. */
    AgoraVideoProfileDEFAULT = AgoraVideoProfileLandscape360P,
};

/** The camera capturer configuration. */
typedef NS_ENUM(NSInteger, AgoraCameraCaptureOutputPreference) {
    /** (default) Self-adapts the camera output parameters to the system performance and network conditions to balance CPU consumption and video preview quality. */
    AgoraCameraCaptureOutputPreferenceAuto = 0,
    /** Prioritizes the system performance. The SDK chooses the dimension and frame rate of the local camera capture closest to those set by [setVideoEncoderConfiguration]([AgoraRtcEngineKit setVideoEncoderConfiguration:]). */
    AgoraCameraCaptureOutputPreferencePerformance = 1,
    /** Prioritizes the local preview quality. The SDK chooses higher camera output parameters to improve the local video preview quality. This option requires extra CPU and RAM usage for video pre-processing. */
    AgoraCameraCaptureOutputPreferencePreview = 2,
    /** Internal use only */
    AgoraCameraCaptureOutputPreferenceUnkown = 3
};


/** Video frame rate */
typedef NS_ENUM(NSInteger, AgoraVideoFrameRate) {
    /** 1 fps. */
    AgoraVideoFrameRateFps1 = 1,
    /** 7 fps. */
    AgoraVideoFrameRateFps7 = 7,
    /** 10 fps. */
    AgoraVideoFrameRateFps10 = 10,
    /** 15 fps. */
    AgoraVideoFrameRateFps15 = 15,
    /** 24 fps. */
    AgoraVideoFrameRateFps24 = 24,
    /** 30 fps. */
    AgoraVideoFrameRateFps30 = 30,
    /** 60 fps (macOS only). */
    AgoraVideoFrameRateFps60 = 60,
};

/** Video output orientation mode.

  **Note:** When a custom video source is used, if you set AgoraVideoOutputOrientationMode as AgoraVideoOutputOrientationModeFixedLandscape(1) or AgoraVideoOutputOrientationModeFixedPortrait(2), when the rotated video image has a different orientation than the specified output orientation, the video encoder first crops it and then encodes it.
 */
typedef NS_ENUM(NSInteger, AgoraVideoOutputOrientationMode) {
    /** Adaptive mode (Default).
     <p>The video encoder adapts to the orientation mode of the video input device. When you use a custom video source, the output video from the encoder inherits the orientation of the original video.
     <ul><li>If the width of the captured video from the SDK is greater than the height, the encoder sends the video in landscape mode. The encoder also sends the rotational information of the video, and the receiver uses the rotational information to rotate the received video.</li>
     <li>If the original video is in portrait mode, the output video from the encoder is also in portrait mode. The encoder also sends the rotational information of the video to the receiver.</li></ul></p>
     */
    AgoraVideoOutputOrientationModeAdaptative = 0,
    /** Landscape mode.
     <p>The video encoder always sends the video in landscape mode. The video encoder rotates the original video before sending it and the rotational information is 0. This mode applies to scenarios involving CDN live streaming.</p>
     */
    AgoraVideoOutputOrientationModeFixedLandscape = 1,
     /** Portrait mode.
      <p>The video encoder always sends the video in portrait mode. The video encoder rotates the original video before sending it and the rotational information is 0. This mode applies to scenarios involving CDN live streaming.</p>
      */
    AgoraVideoOutputOrientationModeFixedPortrait = 2,
};

/** Channel profile. */
typedef NS_ENUM(NSInteger, AgoraChannelProfile) {
    /** Communication (default).
     <p>This is used in one-on-one or group calls, where all users in the channel can talk freely.</p>
     */
    AgoraChannelProfileCommunication = 0,
    /** Live Broadcast.
     <p>Host and audience roles that can be set by calling the [setClientRole]([AgoraRtcEngineKit setClientRole:]) method. The host sends and receives voice/video, while the audience can only receive voice/video.</p>
     */
    AgoraChannelProfileLiveBroadcasting = 1,
    /** Gaming.
     <p>This mode is for the Agora Gaming SDK only.</p>
     <p>Any user in the channel can talk freely. This mode uses the codec with low-power consumption and low bitrate by default. </p>
     */
    AgoraChannelProfileGame = 2,
};

/** Client role in a live broadcast. */
typedef NS_ENUM(NSInteger, AgoraClientRole) {
    /** Host. */
    AgoraClientRoleBroadcaster = 1,
    /** Audience. */
    AgoraClientRoleAudience = 2,
};


/** Media type. */
typedef NS_ENUM(NSInteger, AgoraMediaType) {
    /** No audio and video. */
    AgoraMediaTypeNone = 0,
    /** Audio only. */
    AgoraMediaTypeAudioOnly = 1,
    /** Video only. */
    AgoraMediaTypeVideoOnly = 2,
    /** Audio and video. */
    AgoraMediaTypeAudioAndVideo = 3,
};

/** Encryption mode */
typedef NS_ENUM(NSInteger, AgoraEncryptionMode) {
    /** When encryptionMode is set as NULL, the encryption mode is set as "aes-128-xts" by default. */
    AgoraEncryptionModeNone = 0,
    /** (Default) 128-bit AES encryption, XTS mode. */
    AgoraEncryptionModeAES128XTS = 1,
    /** 256-bit AES encryption, XTS mode. */
    AgoraEncryptionModeAES256XTS = 2,
    /** 128-bit AES encryption, ECB mode. */
    AgoraEncryptionModeAES128ECB = 3,
};

/** Reason for the user being offline. */
typedef NS_ENUM(NSUInteger, AgoraUserOfflineReason) {
    /** The user left the current channel. */
    AgoraUserOfflineReasonQuit = 0,
    /** The SDK timed out and the user dropped offline because no data packet is received within a certain period of time. If a user quits the call and the message is not passed to the SDK (due to an unreliable channel), the SDK assumes the user dropped offline. */
    AgoraUserOfflineReasonDropped = 1,
    /** (Live broadcast only.) The client role switched from the host to the audience. */
    AgoraUserOfflineReasonBecomeAudience = 2,
};

/** The RTMP streaming state. */
typedef NS_ENUM(NSUInteger, AgoraRtmpStreamingState) {
  /** The RTMP streaming has not started or has ended. This state is also triggered after you remove an RTMP address from the CDN by calling removePublishStreamUrl.*/
  AgoraRtmpStreamingStateIdle = 0,
  /** The SDK is connecting to Agora's streaming server and the RTMP server. This state is triggered after you call the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method. */
  AgoraRtmpStreamingStateConnecting = 1,
  /** The RTMP streaming is being published. The SDK successfully publishes the RTMP streaming and returns this state. */
  AgoraRtmpStreamingStateRunning = 2,
  /** The RTMP streaming is recovering. When exceptions occur to the CDN, or the streaming is interrupted, the SDK attempts to resume RTMP streaming and returns this state.
<li> If the SDK successfully resumes the streaming, AgoraRtmpStreamingStateRunning(2) returns.
<li> If the streaming does not resume within 60 seconds or server errors occur, AgoraRtmpStreamingStateFailure(4) returns. You can also reconnect to the server by calling the [removePublishStreamUrl]([AgoraRtcEngineKit removePublishStreamUrl:]) and [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) methods. */
  AgoraRtmpStreamingStateRecovering = 3,
  /** The RTMP streaming fails. See the errorCode parameter for the detailed error information. You can also call the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method to publish the RTMP streaming again. */
  AgoraRtmpStreamingStateFailure = 4,
};


enum RTMP_STREAM_PUBLISH_ERROR
{
  RTMP_STREAM_PUBLISH_ERROR_OK = 0,
  RTMP_STREAM_PUBLISH_ERROR_INVALID_ARGUMENT = 1,
  RTMP_STREAM_PUBLISH_ERROR_ENCRYPTED_STREAM_NOT_ALLOWED = 2,
  RTMP_STREAM_PUBLISH_ERROR_CONNECTION_TIMEOUT = 3,
  RTMP_STREAM_PUBLISH_ERROR_INTERNAL_SERVER_ERROR = 4,
  RTMP_STREAM_PUBLISH_ERROR_RTMP_SERVER_ERROR = 5,
  RTMP_STREAM_PUBLISH_ERROR_TOO_OFTEN = 6,
  RTMP_STREAM_PUBLISH_ERROR_REACH_LIMIT = 7,
  RTMP_STREAM_PUBLISH_ERROR_NOT_AUTHORIZED = 8,
  RTMP_STREAM_PUBLISH_ERROR_STREAM_NOT_FOUND = 9,
  RTMP_STREAM_PUBLISH_ERROR_FORMAT_NOT_SUPPORTED = 10,
};

/** The detailed error information for streaming. */
typedef NS_ENUM(NSUInteger, AgoraRtmpStreamingErrorCode) {
  /** The RTMP streaming publishes successfully. */
  AgoraRtmpStreamingErrorCodeOK = 0,
  /** Invalid argument used. If, for example, you do not call the [setLiveTranscoding]([AgoraRtcEngineKit setLiveTranscoding:]) method to configure the LiveTranscoding parameters before calling the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method, the SDK returns this error. Check whether you set the parameters in the setLiveTranscoding method properly. */
  AgoraRtmpStreamingErrorCodeInvalidParameters = 1,
  /** The RTMP streaming is encrypted and cannot be published. */
  AgoraRtmpStreamingErrorCodeEncryptedStreamNotAllowed = 2,
  /** Timeout for the RTMP streaming. Call the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method to publish the streaming again. */
  AgoraRtmpStreamingErrorCodeConnectionTimeout = 3,
  /** An error occurs in Agora's streaming server. Call the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method to publish the streaming again. */
  AgoraRtmpStreamingErrorCodeInternalServerError = 4,
  /** An error occurs in the RTMP server. */
  AgoraRtmpStreamingErrorCodeRtmpServerError = 5,
  /** The RTMP streaming publishes too frequently. */
  AgoraRtmpStreamingErrorCodeTooOften = 6,
  /** The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones. */
  AgoraRtmpStreamingErrorCodeReachLimit = 7,
  /** The host manipulates other hosts' URLs. Check your app logic. */
  AgoraRtmpStreamingErrorCodeNotAuthorized = 8,
  /** Agora's server fails to find the RTMP streaming. */
  AgoraRtmpStreamingErrorCodeStreamNotFound = 9,
  /** The format of the RTMP streaming URL is not supported. Check whether the URL format is correct. */
  AgoraRtmpStreamingErrorCodeFormatNotSupported = 10,
};

/** State of importing an external video stream in a live broadcast. */
typedef NS_ENUM(NSUInteger, AgoraInjectStreamStatus) {
    /** The external video stream imported successfully. */
    AgoraInjectStreamStatusStartSuccess = 0,
    /** The external video stream already exists. */
    AgoraInjectStreamStatusStartAlreadyExists = 1,
    /** The external video stream import is unauthorized. */
    AgoraInjectStreamStatusStartUnauthorized = 2,
    /** Import external video stream timeout. */
    AgoraInjectStreamStatusStartTimedout = 3,
    /** The external video stream failed to import. */
    AgoraInjectStreamStatusStartFailed = 4,
    /** The external video stream imports successfully. */
    AgoraInjectStreamStatusStopSuccess = 5,
    /** No external video stream is found. */
    AgoraInjectStreamStatusStopNotFound = 6,
    /** The external video stream is stopped from being unauthorized. */
    AgoraInjectStreamStatusStopUnauthorized = 7,
    /** Importing the external video stream timeout. */
    AgoraInjectStreamStatusStopTimedout = 8,
    /** Importing the external video stream failed. */
    AgoraInjectStreamStatusStopFailed = 9,
    /** The external video stream import is interrupted. */
    AgoraInjectStreamStatusBroken = 10,
};

/** Output log filter level. */
typedef NS_ENUM(NSUInteger, AgoraLogFilter) {
    /** Do not output any log information. */
    AgoraLogFilterOff = 0,
    /** Output all log information. Set your log filter as debug if you want to get the most complete log file. */
    AgoraLogFilterDebug = 0x080f,
    /** Output CRITICAL, ERROR, WARNING, and INFO level log information. We recommend setting your log filter as this level. */
    AgoraLogFilterInfo = 0x000f,
    /** Outputs CRITICAL, ERROR, and WARNING level log information. */
    AgoraLogFilterWarning = 0x000e,
    /** Outputs CRITICAL and ERROR level log information. */
    AgoraLogFilterError = 0x000c,
    /** Outputs CRITICAL level log information. */
    AgoraLogFilterCritical = 0x0008,
};

/** Audio recording quality. */
typedef NS_ENUM(NSInteger, AgoraAudioRecordingQuality) {
   /** Low quality: The sample rate is 32 KHz, and the file size is around 1.2 MB after 10 minutes of recording. */
    AgoraAudioRecordingQualityLow = 0,
    /** Medium quality: The sample rate is 32 KHz, and the file size is around 2 MB after 10 minutes of recording. */
    AgoraAudioRecordingQualityMedium = 1,
    /** High quality: The sample rate is 32 KHz, and the file size is around 3.75 MB after 10 minutes of recording. */
    AgoraAudioRecordingQualityHigh = 2
};

/** Lifecycle of the CDN live video stream.

**DEPRECATED**
*/
typedef NS_ENUM(NSInteger, AgoraRtmpStreamLifeCycle) {
    /** Bound to the channel lifecycle. If all hosts leave the channel, the CDN live streaming stops after 30 seconds. */
    AgoraRtmpStreamLifeCycleBindToChannel = 1,
    /** Bound to the owner of the RTMP stream. If the owner leaves the channel, the CDN live streaming stops immediately. */
    AgoraRtmpStreamLifeCycleBindToOwnner = 2,
};

/** Network quality. */
typedef NS_ENUM(NSUInteger, AgoraNetworkQuality) {
    /** The network quality is unknown. */
    AgoraNetworkQualityUnknown = 0,
    /**  The network quality is excellent. */
    AgoraNetworkQualityExcellent = 1,
    /** The network quality is quite good, but the bitrate may be slightly lower than excellent. */
    AgoraNetworkQualityGood = 2,
    /** Users can feel the communication slightly impaired. */
    AgoraNetworkQualityPoor = 3,
    /** Users can communicate only not very smoothly. */
    AgoraNetworkQualityBad = 4,
     /** The network quality is so bad that users can hardly communicate. */
    AgoraNetworkQualityVBad = 5,
     /** The network is disconnected and users cannot communicate at all. */
    AgoraNetworkQualityDown = 6,
     /** Users cannot detect the network quality. (Not in use.) */
    AgoraNetworkQualityUnsupported = 7,
     /** Detecting the network quality. */
    AgoraNetworkQualityDetecting = 8,
};

/** Video stream type. */
typedef NS_ENUM(NSInteger, AgoraVideoStreamType) {
    /** High-bitrate, high-resolution video stream. */
    AgoraVideoStreamTypeHigh = 0,
    /** Low-bitrate, low-resolution video stream. */
    AgoraVideoStreamTypeLow = 1,
};

/** The priority of the remote user. */
typedef NS_ENUM(NSInteger, AgoraUserPriority) {
  /** The user's priority is high. */
  AgoraUserPriorityHigh = 50,
  /** (Default) The user's priority is normal. */
  AgoraUserPriorityNormal = 100,
};

/**  Quality change of the local video in terms of target frame rate and target bit rate since last count. */
typedef NS_ENUM(NSInteger, AgoraVideoQualityAdaptIndication) {
  /** The quality of the local video stays the same. */
  AgoraVideoQualityAdaptNone = 0,
  /** The quality improves because the network bandwidth increases. */
  AgoraVideoQualityAdaptUpBandwidth = 1,
  /** The quality worsens because the network bandwidth decreases. */
  AgoraVideoQualityAdaptDownBandwidth = 2,
};

/** Video display mode. */
typedef NS_ENUM(NSUInteger, AgoraVideoRenderMode) {
    /** Hidden(1): Uniformly scale the video until it fills the visible boundaries (cropped). One dimension of the video may have clipped contents. */
    AgoraVideoRenderModeHidden = 1,

    /** Fit(2): Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). Areas that are not filled due to the disparity in the aspect ratio are filled with black. */
    AgoraVideoRenderModeFit = 2,

    /**
     Adaptive(3)：This mode is deprecated.
     */
    AgoraVideoRenderModeAdaptive __deprecated_enum_msg("AgoraVideoRenderModeAdaptive is deprecated.") = 3,
};

/** Self-defined video codec profile. */
typedef NS_ENUM(NSInteger, AgoraVideoCodecProfileType) {
    /** 66: Baseline video codec profile. Generally used in video calls on mobile phones. */
    AgoraVideoCodecProfileTypeBaseLine = 66,
    /** 77: Main video codec profile. Generally used in mainstream electronics, such as MP4 players, portable video players, PSP, and iPads. */
    AgoraVideoCodecProfileTypeMain = 77,
    /** 100: (Default) High video codec profile. Generally used in high-resolution broadcasts or television. */
    AgoraVideoCodecProfileTypeHigh = 100
};

/** Video codec types. */
typedef NS_ENUM(NSInteger, AgoraVideoCodecType) {
    /** Standard VP8. */
    AgoraVideoCodecTypeVP8 = 1,
    /** Standard H.264. */
    AgoraVideoCodecTypeH264 = 2,
    /** Enhanced VP8. */
    AgoraVideoCodecTypeEVP = 3,
    /** Enhanced H.264. */
    AgoraVideoCodecTypeE264 = 4,
};

/** Video mirror mode. */
typedef NS_ENUM(NSUInteger, AgoraVideoMirrorMode) {
    /** The SDK determines the default mirror mode. */
    AgoraVideoMirrorModeAuto = 0,
    /** Enables mirror mode. */
    AgoraVideoMirrorModeEnabled = 1,
    /** Disables mirror mode. */
    AgoraVideoMirrorModeDisabled = 2,
};

/** The content hint for screen sharing. */
typedef NS_ENUM(NSUInteger, AgoraVideoContentHint) {
    /** (Default) No content hint. */
    AgoraVideoContentHintNone = 0,
    /** Motion-intensive content. Choose this option if you prefer smoothness or when you are sharing a video clip, movie, or video game. */
    AgoraVideoContentHintMotion = 1,
    /** Motionless content. Choose this option if you prefer sharpness or when you are sharing a picture, PowerPoint slide, or text. */
    AgoraVideoContentHintDetails = 2,
};

/** The state of the remote video. */
typedef NS_ENUM(NSUInteger, AgoraVideoRemoteState) {
    /** 0: The remote video is in the default state, probably due to AgoraVideoRemoteStateReasonLocalMuted(3), AgoraVideoRemoteStateReasonRemoteMuted(5), or AgoraVideoRemoteStateReasonRemoteOffline(7).
     */
    AgoraVideoRemoteStateStopped = 0,
    /** 1: The first remote video packet is received.
     */
    AgoraVideoRemoteStateStarting = 1,
    /** 2: The remote video stream is decoded and plays normally, probably due to AgoraVideoRemoteStateReasonNetworkRecovery(2), AgoraVideoRemoteStateReasonLocalUnmuted(4), AgoraVideoRemoteStateReasonRemoteUnmuted(6), or AgoraVideoRemoteStateReasonAudioFallbackRecovery(9).
     */
    AgoraVideoRemoteStateDecoding = 2,
    /** 3: The remote video is frozen, probably due to AgoraVideoRemoteStateReasonNetworkCongestion(1) or AgoraVideoRemoteStateReasonAudioFallback(8).
     */
    AgoraVideoRemoteStateFrozen = 3,
    /** 4: The remote video fails to start, probably due to AgoraVideoRemoteStateReasonInternal(0).
     */
    AgoraVideoRemoteStateFailed = 4,
};

/** The reason of the remote video state change. */
typedef NS_ENUM(NSUInteger, AgoraVideoRemoteStateReason) {
    /** 0: Internal reasons. */
    AgoraVideoRemoteStateReasonInternal = 0,
    /** 1: Network congestion. */
    AgoraVideoRemoteStateReasonNetworkCongestion = 1,
    /** 2: Network recovery. */
    AgoraVideoRemoteStateReasonNetworkRecovery = 2,
    /** 3: The local user stops receiving the remote video stream or disables the video module. */
    AgoraVideoRemoteStateReasonLocalMuted = 3,
    /** 4: The local user resumes receiving the remote video stream or enables the video module. */
    AgoraVideoRemoteStateReasonLocalUnmuted = 4,
    /** 5: The remote user stops sending the video stream or disables the video module. */
    AgoraVideoRemoteStateReasonRemoteMuted = 5,
    /** 6: The remote user resumes sending the video stream or enables the video module. */
    AgoraVideoRemoteStateReasonRemoteUnmuted = 6,
    /** 7: The remote user leaves the channel. */
    AgoraVideoRemoteStateReasonRemoteOffline = 7,
    /** 8: The remote media stream falls back to the audio-only stream due to poor network conditions. */
    AgoraVideoRemoteStateReasonAudioFallback = 8,
    /** 9: The remote media stream switches back to the video stream after the network conditions improve. */
    AgoraVideoRemoteStateReasonAudioFallbackRecovery = 9,
};

/** Stream fallback option. */
typedef NS_ENUM(NSInteger, AgoraStreamFallbackOptions) {
    /** No fallback behavior for the local/remote video stream when the uplink/downlink network condition is unreliable. The quality of the stream is not guaranteed. */
    AgoraStreamFallbackOptionDisabled = 0,
    /** Under unreliable downlink network conditions, the remote video stream falls back to the low-stream (low resolution and low bitrate) video. You can only set this option in the [setRemoteSubscribeFallbackOption]([AgoraRtcEngineKit setRemoteSubscribeFallbackOption:]) method. Nothing happens when you set this in the [setLocalPublishFallbackOption]([AgoraRtcEngineKit setLocalPublishFallbackOption:]) method. */
    AgoraStreamFallbackOptionVideoStreamLow = 1,
    /**
     <li> Under unreliable uplink network conditions, the published video stream falls back to audio only.
     <li> Under unreliable downlink network conditions, the remote video stream first falls back to the low-stream (low resolution and low bitrate) video; and then to an audio-only stream if the network condition deteriorates. */
    AgoraStreamFallbackOptionAudioOnly = 2,
};

/** Audio sample rate. */
typedef NS_ENUM(NSInteger, AgoraAudioSampleRateType) {
    /** 32 kHz. */
    AgoraAudioSampleRateType32000 = 32000,
    /** 44.1 kHz. */
    AgoraAudioSampleRateType44100 = 44100,
    /** 48 kHz. */
    AgoraAudioSampleRateType48000 = 48000,
};

/** Audio profile. */
typedef NS_ENUM(NSInteger, AgoraAudioProfile) {
    /** Default audio profile. In the communication profile, the default value is AgoraAudioProfileSpeechStandard; in the live-broadcast profile, the default value is AgoraAudioProfileMusicStandard. */
    AgoraAudioProfileDefault = 0,
    /** A sample rate of 32 kHz, audio encoding, mono, and a bitrate of up to 18 Kbps. */
    AgoraAudioProfileSpeechStandard = 1,
    /** A sample rate of 48 kHz, music encoding, mono, and a bitrate of up to 48 Kbps. */
    AgoraAudioProfileMusicStandard = 2,
    /** A sample rate of 48 kHz, music encoding, stereo, and a bitrate of up to 56 Kbps. */
    AgoraAudioProfileMusicStandardStereo = 3,
    /** A sample rate of 48 kHz, music encoding, mono, and a bitrate of up to 128 Kbps. */
    AgoraAudioProfileMusicHighQuality = 4,
    /** A sample rate of 48 kHz, music encoding, stereo, and a bitrate of up to 192 Kbps. */
    AgoraAudioProfileMusicHighQualityStereo = 5,
};

/** Audio scenario. */
typedef NS_ENUM(NSInteger, AgoraAudioScenario) {
    /** Default. */
    AgoraAudioScenarioDefault = 0,
    /** Entertainment scenario, supporting voice during gameplay. */
    AgoraAudioScenarioChatRoomEntertainment = 1,
    /** Education scenario, prioritizing fluency and stability. */
    AgoraAudioScenarioEducation = 2,
    /** Live gaming scenario, enabling the gaming audio effects in the speaker mode in a live broadcast scenario. Choose this scenario for high-fidelity music playback.*/
    AgoraAudioScenarioGameStreaming = 3,
    /** Showroom scenario, optimizing the audio quality with external professional equipment. */
    AgoraAudioScenarioShowRoom = 4,
    /** Gaming scenario. */
    AgoraAudioScenarioChatRoomGaming = 5
};

/** Audio output routing. */
typedef NS_ENUM(NSInteger, AgoraAudioOutputRouting) {
    /** Default. */
    AgoraAudioOutputRoutingDefault = -1,
    /** Headset.*/
    AgoraAudioOutputRoutingHeadset = 0,
    /** Earpiece. */
    AgoraAudioOutputRoutingEarpiece = 1,
    /** Headset with no microphone. */
    AgoraAudioOutputRoutingHeadsetNoMic = 2,
    /** Speakerphone. */
    AgoraAudioOutputRoutingSpeakerphone = 3,
    /** Loudspeaker. */
    AgoraAudioOutputRoutingLoudspeaker = 4,
    /** Bluetooth headset. */
    AgoraAudioOutputRoutingHeadsetBluetooth = 5
};

/** Use mode of the onRecordAudioFrame callback. */
typedef NS_ENUM(NSInteger, AgoraAudioRawFrameOperationMode) {
    /** Read-only mode: Users only read the AudioFrame data without modifying anything. For example, when users acquire data with the Agora SDK then push the RTMP streams. */
    AgoraAudioRawFrameOperationModeReadOnly = 0,
    /** Write-only mode: Users replace the AudioFrame data with their own data and pass them to the SDK for encoding. For example, when users acquire data. */
    AgoraAudioRawFrameOperationModeWriteOnly = 1,
    /** Read and write mode: Users read the data from AudioFrame, modify it, and then play it. For example, when users have their own sound-effect processing module and perform some voice pre-processing such as a voice change. */
    AgoraAudioRawFrameOperationModeReadWrite = 2,
};

/** Audio equalization band frequency. */
typedef NS_ENUM(NSInteger, AgoraAudioEqualizationBandFrequency) {
    /** 31 Hz. */
    AgoraAudioEqualizationBand31 = 0,
    /** 62 Hz. */
    AgoraAudioEqualizationBand62 = 1,
    /** 125 Hz. */
    AgoraAudioEqualizationBand125 = 2,
    /** 250 Hz. */
    AgoraAudioEqualizationBand250 = 3,
    /** 500 Hz */
    AgoraAudioEqualizationBand500 = 4,
    /** 1 kHz. */
    AgoraAudioEqualizationBand1K = 5,
    /** 2 kHz. */
    AgoraAudioEqualizationBand2K = 6,
    /** 4 kHz. */
    AgoraAudioEqualizationBand4K = 7,
    /** 8 kHz. */
    AgoraAudioEqualizationBand8K = 8,
    /** 16 kHz. */
    AgoraAudioEqualizationBand16K = 9,
};

/** Audio reverberation type. */
typedef NS_ENUM(NSInteger, AgoraAudioReverbType) {
    /** The level of the dry signal (dB). The value ranges between -20 and 10. */
    AgoraAudioReverbDryLevel = 0,
    /** The level of the early reflection signal (wet signal) in dB. The value ranges between -20 and 10. */
    AgoraAudioReverbWetLevel = 1,
    /** The room size of the reverberation. A larger room size means a stronger reverberation. The value ranges between 0 and 100. */
    AgoraAudioReverbRoomSize = 2,
    /** The length of the initial delay of the wet signal (ms). The value ranges between 0 and 200. */
    AgoraAudioReverbWetDelay = 3,
     /** The reverberation strength. The value ranges between 0 and 100. */
    AgoraAudioReverbStrength = 4,
};

/** The preset audio voice configuration used to change the voice effect. */
typedef NS_ENUM(NSInteger, AgoraAudioVoiceChanger) {
    /** The original voice (no local voice change). */
    AgoraAudioVoiceChangerOff = 0,
    /** An old man's voice. */
    AgoraAudioVoiceChangerOldMan = 1,
    /** A little boy's voice. */
    AgoraAudioVoiceChangerBabyBoy = 2,
    /** A little girl's voice. */
    AgoraAudioVoiceChangerBabyGirl = 3,
    /** TBD */
    AgoraAudioVoiceChangerZhuBaJie = 4,
    /** Ethereal vocal effects. */
    AgoraAudioVoiceChangerEthereal = 5,
    /** Hulk's voice. */
    AgoraAudioVoiceChangerHulk = 6
};

/** The preset local voice reverberation option. */
typedef NS_ENUM(NSInteger, AgoraAudioReverbPreset) {
    /** The original voice (no local voice reverberation). */
    AgoraAudioReverbPresetOff = 0,
    /** Pop music */
    AgoraAudioReverbPresetPopular = 1,
    /** R&B */
    AgoraAudioReverbPresetRnB = 2,
    /** Rock music */
    AgoraAudioReverbPresetRock = 3,
    /** Hip-hop music */
    AgoraAudioReverbPresetHipHop = 4,
    /** Pop concert */
    AgoraAudioReverbPresetVocalConcert = 5,
    /** Karaoke */
    AgoraAudioReverbPresetKTV = 6,
    /** Recording studio */
    AgoraAudioReverbPresetStudio = 7
};

/** Audio session restriction. */
typedef NS_OPTIONS(NSUInteger, AgoraAudioSessionOperationRestriction) {
    /** No restriction, the SDK has full control of the audio session operations. */
    AgoraAudioSessionOperationRestrictionNone              = 0,
    /** The SDK does not change the audio session category. */
    AgoraAudioSessionOperationRestrictionSetCategory       = 1,
    /** The SDK does not change any setting of the audio session (category, mode, categoryOptions). */
    AgoraAudioSessionOperationRestrictionConfigureSession  = 1 << 1,
    /** The SDK keeps the audio session active when leaving a channel. */
    AgoraAudioSessionOperationRestrictionDeactivateSession = 1 << 2,
    /** The SDK does not configure the audio session anymore. */
    AgoraAudioSessionOperationRestrictionAll               = 1 << 7
};

/** Audio codec profile. */
typedef NS_ENUM(NSInteger, AgoraAudioCodecProfileType) {
    /** (Default) LC-AAC, the low-complexity audio codec profile. */
  AgoraAudioCodecProfileLCAAC = 0,
  /** HE-AAC, the high-efficiency audio codec profile. */
  AgoraAudioCodecProfileHEAAC = 1
};

/** The state of the remote audio. */
typedef NS_ENUM(NSUInteger, AgoraAudioRemoteState) {
    /** 0: The remote audio is in the default state, probably due to AgoraAudioRemoteReasonLocalMuted(3), AgoraAudioRemoteReasonRemoteMuted(5), or AgoraAudioRemoteReasonRemoteOffline(7). */
    AgoraAudioRemoteStateStopped = 0,
    /** 1: The first remote audio packet is received. */
    AgoraAudioRemoteStateStarting = 1,
    /** 2: The remote audio stream is decoded and plays normally, probably due to AgoraAudioRemoteReasonNetworkRecovery(2), AgoraAudioRemoteReasonLocalUnmuted(4), or AgoraAudioRemoteReasonRemoteUnmuted(6). */
    AgoraAudioRemoteStateDecoding = 2,
    /** 3: The remote audio is frozen, probably due to AgoraAudioRemoteReasonNetworkCongestion(1). */
    AgoraAudioRemoteStateFrozen = 3,
    /** 4: The remote audio fails to start, probably due to AgoraAudioRemoteReasonInternal(0). */
    AgoraAudioRemoteStateFailed = 4,
};

/** The reason of the remote audio state change. */
typedef NS_ENUM(NSUInteger, AgoraAudioRemoteStateReason) {
    /** 0: Internal reasons. */
    AgoraAudioRemoteReasonInternal = 0,
    /** 1: Network congestion. */
    AgoraAudioRemoteReasonNetworkCongestion = 1,
    /** 2: Network recovery. */
    AgoraAudioRemoteReasonNetworkRecovery = 2,
    /** 3: The local user stops receiving the remote audio stream or disables the audio module. */
    AgoraAudioRemoteReasonLocalMuted = 3,
    /** 4: The local user resumes receiving the remote audio stream or enables the audio module. */
    AgoraAudioRemoteReasonLocalUnmuted = 4,
    /** 5: The remote user stops sending the audio stream or disables the audio module. */
    AgoraAudioRemoteReasonRemoteMuted = 5,
    /** 6: The remote user resumes sending the audio stream or enables the audio module. */
    AgoraAudioRemoteReasonRemoteUnmuted = 6,
    /** 7: The remote user leaves the channel. */
    AgoraAudioRemoteReasonRemoteOffline = 7,
};

/** The state of the local audio. */
typedef NS_ENUM(NSUInteger, AgoraAudioLocalState) {
    /** 0: The local audio is in the initial state. */
    AgoraAudioLocalStateStopped = 0,
    /** 1: The recording device starts successfully.  */
    AgoraAudioLocalStateRecording = 1,
    /** 2: The first audio frame encodes successfully. */
    AgoraAudioLocalStateEncoding = 2,
    /** 3: The local audio fails to start. */
    AgoraAudioLocalStateFailed = 3,
};

/** The error information of the local audio. */
typedef NS_ENUM(NSUInteger, AgoraAudioLocalError) {
    /** 0: The local audio is normal. */
    AgoraAudioLocalErrorOk = 0,
    /** 1: No specified reason for the local audio failure. */
    AgoraAudioLocalErrorFailure = 1,
    /** 2: No permission to use the local audio device. */
    AgoraAudioLocalErrorDeviceNoPermission = 2,
    /** 3: The microphone is in use. */
    AgoraAudioLocalErrorDeviceBusy = 3,
    /** 4: The local audio recording fails. Check whether the recording device is working properly. */
    AgoraAudioLocalErrorRecordFailure = 4,
    /** 5: The local audio encoding fails. */
    AgoraAudioLocalErrorEncodeFailure = 5,
};

/** Media device type. */
typedef NS_ENUM(NSInteger, AgoraMediaDeviceType) {
    /** Unknown device. */
    AgoraMediaDeviceTypeAudioUnknown = -1,
    /** Audio playback device. */
    AgoraMediaDeviceTypeAudioPlayout = 0,
    /** Audio recording device. */
    AgoraMediaDeviceTypeAudioRecording = 1,
    /** Video render device. */
    AgoraMediaDeviceTypeVideoRender = 2,
    /** Video capture device. */
    AgoraMediaDeviceTypeVideoCapture = 3,
};

/** Connection states. */
typedef NS_ENUM(NSInteger, AgoraConnectionStateType) {
    /** <p>1: The SDK is disconnected from Agora's edge server.</p>
This is the initial state before [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]).<br>
The SDK also enters this state when the app calls [leaveChannel]([AgoraRtcEngineKit leaveChannel:]).
    */
    AgoraConnectionStateDisconnected = 1,
    /** <p>2: The SDK is connecting to Agora's edge server.</p>
When the app calls [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]), the SDK starts to establish a connection to the specified channel, triggers the [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) callback, and switches to the `AgoraConnectionStateConnecting` state.<br>
<br>
When the SDK successfully joins the channel, the SDK triggers the [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) callback and switches to the `AgoraConnectionStateConnected` state.<br>
<br>
After the SDK joins the channel and when it finishes initializing the media engine, the SDK triggers the [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]) callback.
*/
    AgoraConnectionStateConnecting = 2,
    /** <p>3: The SDK is connected to Agora's edge server and joins a channel. You can now publish or subscribe to a media stream in the channel.</p>
If the connection to the channel is lost because, for example, the network is down or switched, the SDK automatically tries to reconnect and triggers:
<li> The [rtcEngineConnectionDidInterrupted]([AgoraRtcEngineDelegate rtcEngineConnectionDidInterrupted:])(deprecated) callback
<li> The [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) callback, and switches to the `AgoraConnectionStateReconnecting` state.
    */
    AgoraConnectionStateConnected = 3,
    /** <p>4: The SDK keeps rejoining the channel after being disconnected from a joined channel because of network issues.</p>
<li>If the SDK cannot rejoin the channel within 10 seconds after being disconnected from Agora's edge server, the SDK triggers the [rtcEngineConnectionDidLost]([AgoraRtcEngineDelegate rtcEngineConnectionDidLost:]) callback, stays in the `AgoraConnectionStateReconnecting` state, and keeps rejoining the channel.
<li>If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK triggers the [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) callback, switches to the `AgoraConnectionStateFailed` state, and stops rejoining the channel.
    */
    AgoraConnectionStateReconnecting = 4,
    /** <p>5: The SDK fails to connect to Agora's edge server or join the channel.</p>
You must call [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) to leave this state, and call [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) again to rejoin the channel.<br>
<br>
If the SDK is banned from joining the channel by Agora's edge server (through the RESTful API), the SDK triggers the [rtcEngineConnectionDidBanned]([AgoraRtcEngineDelegate rtcEngineConnectionDidBanned:])(deprecated) and [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) callbacks.
    */
    AgoraConnectionStateFailed = 5,
};

/** Reasons for the connection state change. */
typedef NS_ENUM(NSUInteger, AgoraConnectionChangedReason) {
    /** 0: The SDK is connecting to Agora's edge server. */
    AgoraConnectionChangedConnecting = 0,
    /** 1: The SDK has joined the channel successfully. */
    AgoraConnectionChangedJoinSuccess = 1,
    /** 2: The connection between the SDK and Agora's edge server is interrupted.  */
    AgoraConnectionChangedInterrupted = 2,
    /** 3: The connection between the SDK and Agora's edge server is banned by Agora's edge server. */
    AgoraConnectionChangedBannedByServer = 3,
    /** 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel. */
    AgoraConnectionChangedJoinFailed = 4,
    /** 5: The SDK has left the channel. */
    AgoraConnectionChangedLeaveChannel = 5,
    /** 6: The specified App ID is invalid. Try to rejoin the channel with a valid App ID. */
    AgoraConnectionChangedInvalidAppId = 6,
    /** 7: The specified channel name is invalid. Try to rejoin the channel with a valid channel name. */
    AgoraConnectionChangedInvalidChannelName = 7,
    /** 8: The generated token is invalid probably due to the following reasons:
<li>The App Certificate for the project is enabled in Dashboard, but you do not use Token when joining the channel. If you enable the App Certificate, you must use a token to join the channel.
<li>The uid that you specify in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method is different from the uid that you pass for generating the token. */
    AgoraConnectionChangedInvalidToken = 8,
    /** 9: The token has expired. Generate a new token from your server. */
    AgoraConnectionChangedTokenExpired = 9,
    /** 10: The user is banned by the server. */
    AgoraConnectionChangedRejectedByServer = 10,
    /** 11: The SDK tries to reconnect after setting a proxy server. */
    AgoraConnectionChangedSettingProxyServer = 11,
    /** 12: The token renews. */
    AgoraConnectionChangedRenewToken = 12,
    /** 13: The client IP address has changed, probably due to a change of the network type, IP address, or network port. */
    AgoraConnectionChangedClientIpAddressChanged = 13,
    /** 14: Timeout for the keep-alive of the connection between the SDK and Agora's edge server. The connection state changes to AgoraConnectionStateReconnecting(4). */
    AgoraConnectionChangedKeepAliveTimeout = 14,
};

/** The state code in AgoraChannelMediaRelayState.
 */
typedef NS_ENUM(NSInteger, AgoraChannelMediaRelayState) {
    /** 0: The SDK is initializing.
     */
    AgoraChannelMediaRelayStateIdle = 0,
    /** 1: The SDK tries to relay the media stream to the destination channel.
     */
    AgoraChannelMediaRelayStateConnecting = 1,
    /** 2: The SDK successfully relays the media stream to the destination channel.
     */
    AgoraChannelMediaRelayStateRunning = 2,
    /** 3: A failure occurs. See the details in `error`.
     */
    AgoraChannelMediaRelayStateFailure = 3,
};

/** The event code in AgoraChannelMediaRelayEvent.
 */
typedef NS_ENUM(NSInteger, AgoraChannelMediaRelayEvent) {
    /** 0: The user disconnects from the server due to poor network connections.
     */
    AgoraChannelMediaRelayEventDisconnect = 0,
    /** 1: The network reconnects.
     */
    AgoraChannelMediaRelayEventConnected = 1,
    /** 2: The user joins the source channel.
     */
    AgoraChannelMediaRelayEventJoinedSourceChannel = 2,
    /** 3: The user joins the destination channel.
     */
    AgoraChannelMediaRelayEventJoinedDestinationChannel = 3,
    /** 4: The SDK starts relaying the media stream to the destination channel.
     */
    AgoraChannelMediaRelayEventSentToDestinationChannel = 4,
    /** 5: The server receives the video stream from the source channel.
     */
    AgoraChannelMediaRelayEventReceivedVideoPacketFromSource = 5,
    /** 6: The server receives the audio stream from the source channel.
     */
    AgoraChannelMediaRelayEventReceivedAudioPacketFromSource = 6,
    /** 7: The destination channel is updated.
     */
    AgoraChannelMediaRelayEventUpdateDestinationChannel = 7,
    /** 8: The destination channel update fails due to internal reasons.
     */
    AgoraChannelMediaRelayEventUpdateDestinationChannelRefused = 8,
    /** 9: The destination channel does not change, which means that the destination channel fails to be updated.
     */
    AgoraChannelMediaRelayEventUpdateDestinationChannelNotChange = 9,
    /** 10: The destination channel name is NULL.
     */
    AgoraChannelMediaRelayEventUpdateDestinationChannelIsNil = 10,
    /** 11: The video profile is sent to the server.
     */
    AgoraChannelMediaRelayEventVideoProfileUpdate = 11,
};

/** The error code in AgoraChannelMediaRelayError.
 */
typedef NS_ENUM(NSInteger, AgoraChannelMediaRelayError) {
    /** 0: The state is normal.
     */
    AgoraChannelMediaRelayErrorNone = 0,
    /** 1: An error occurs in the server response.
     */
    AgoraChannelMediaRelayErrorServerErrorResponse = 1,
    /** 2: No server response. You can call the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method to leave the channel.
     */
    AgoraChannelMediaRelayErrorServerNoResponse = 2,
    /** 3: The SDK fails to access the service, probably due to limited resources of the server.
     */
    AgoraChannelMediaRelayErrorNoResourceAvailable = 3,
    /** 4: The server fails to join the source channel.
     */
    AgoraChannelMediaRelayErrorFailedJoinSourceChannel = 4,
    /** 5: The server fails to join the destination channel.
     */
    AgoraChannelMediaRelayErrorFailedJoinDestinationChannel = 5,
    /** 6: The server fails to receive the data from the source channel.
     */
    AgoraChannelMediaRelayErrorFailedPacketReceivedFromSource = 6,
    /** 7: The source channel fails to transmit data.
     */
    AgoraChannelMediaRelayErrorFailedPacketSentToDestination = 7,
    /** 8: The SDK disconnects from the server due to poor network connections. You can call the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method to leave the channel.
     */
    AgoraChannelMediaRelayErrorServerConnectionLost = 8,
    /** 9: An internal error occurs in the server.
     */
    AgoraChannelMediaRelayErrorInternalError = 9,
    /** 10: The token of the source channel has expired.    
     */
    AgoraChannelMediaRelayErrorSourceTokenExpired = 10,
    /** 11: The token of the destination channel has expired.
     */
    AgoraChannelMediaRelayErrorDestinationTokenExpired = 11,
};

/** Network type. */
typedef NS_ENUM(NSInteger, AgoraNetworkType) {
  /** -1: The network type is unknown. */
  AgoraNetworkTypeUnknown = -1,
  /** 0: The SDK disconnects from the network. */
  AgoraNetworkTypeDisconnected = 0,
  /** 1: The network type is LAN. */
  AgoraNetworkTypeLAN = 1,
  /** 2: The network type is Wi-Fi (including hotspots). */
  AgoraNetworkTypeWIFI = 2,
  /** 3: The network type is mobile 2G. */
  AgoraNetworkTypeMobile2G = 3,
  /** 4: The network type is mobile 3G. */
  AgoraNetworkTypeMobile3G = 4,
  /** 5: The network type is mobile 4G. */
  AgoraNetworkTypeMobile4G = 5,
};

/** The video encoding degradation preference under limited bandwidth. */
typedef NS_ENUM(NSInteger, AgoraDegradationPreference) {
    /** (Default) Degrades the frame rate to guarantee the video quality. */
    AgoraDegradationMaintainQuality = 0,
    /** Degrades the video quality to guarantee the frame rate. */
    AgoraDegradationMaintainFramerate = 1,
    /** Reserved for future use. */
    AgoraDegradationBalanced = 2,
};
/** The lightening contrast level. */
typedef NS_ENUM(NSUInteger, AgoraLighteningContrastLevel) {
    /** Low contrast level. */
    AgoraLighteningContrastLow = 0,
    /** (Default) Normal contrast level. */
    AgoraLighteningContrastNormal = 1,
    /** High contrast level. */
    AgoraLighteningContrastHigh = 2,
};

/** The state of the probe test result. */
typedef NS_ENUM(NSUInteger, AgoraLastmileProbeResultState) {
  /** 1: the last-mile network probe test is complete. */
  AgoraLastmileProbeResultComplete = 1,
  /** 2: the last-mile network probe test is incomplete and the bandwidth estimation is not available, probably due to limited test resources. */
  AgoraLastmileProbeResultIncompleteNoBwe = 2,
  /** 3: the last-mile network probe test is not carried out, probably due to poor network conditions. */
  AgoraLastmileProbeResultUnavailable = 3,
};

/** The state of the local video stream. */
typedef NS_ENUM(NSInteger, AgoraLocalVideoStreamState) {
  /** 0: the local video is in the initial state. */
  AgoraLocalVideoStreamStateStopped = 0,
  /** 1: the local video capturer starts successfully. */
  AgoraLocalVideoStreamStateCapturing = 1,
  /** 2: the first local video frame encodes successfully. */
  AgoraLocalVideoStreamStateEncoding = 2,
  /** 3: the local video fails to start. */
  AgoraLocalVideoStreamStateFailed = 3,
};

/** The detailed error information of the local video. */
typedef NS_ENUM(NSInteger, AgoraLocalVideoStreamError) {
  /** 0: the local video is normal. */
  AgoraLocalVideoStreamErrorOK = 0,
  /** 1: no specified reason for the local video failure. */
  AgoraLocalVideoStreamErrorFailure = 1,
  /** 2: no permission to use the local video device. */
  AgoraLocalVideoStreamErrorDeviceNoPermission = 2,
  /** 3: the local video capturer is in use. */
  AgoraLocalVideoStreamErrorDeviceBusy = 3,
  /** 4: the local video capture fails. Check whether the capturer is working properly. */
  AgoraLocalVideoStreamErrorCaptureFailure = 4,
  /** 5: the local video encoding fails. */
  AgoraLocalVideoStreamErrorEncodeFailure = 5,
};
