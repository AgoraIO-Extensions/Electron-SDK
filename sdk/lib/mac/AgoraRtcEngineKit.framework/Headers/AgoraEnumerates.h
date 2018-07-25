//
//  AgoraEnumerates.h
//  AgoraRtcEngineKit
//
//  Created by Yuhua Gong
//  Copyright (c) 2015 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>

// channel
typedef NS_ENUM(NSInteger, AgoraWarningCode) {
    AgoraWarningCodeInvalidView = 8,
    AgoraWarningCodeInitVideo = 16,
    AgoraWarningCodePending = 20,
    AgoraWarningCodeNoAvailableChannel = 103,
    AgoraWarningCodeLookupChannelTimeout = 104,
    AgoraWarningCodeLookupChannelRejected = 105,
    AgoraWarningCodeOpenChannelTimeout = 106,
    AgoraWarningCodeOpenChannelRejected = 107,
    AgoraWarningCodeSwitchLiveVideoTimeout = 111,
    // sdk:vos, callmanager, peermanager: 100~1000
    AgoraWarningCodeSetClientRoleTimeout = 118,
    AgoraWarningCodeSetClientRoleNotAuthorized = 119,
    AgoraWarningCodeOpenChannelInvalidTicket = 121,
    AgoraWarningCodeOpenChannelTryNextVos = 122,
    AgoraWarningCodeAudioMixingOpenError = 701,

    AgoraWarningCodeAdmRuntimePlayoutWarning = 1014,
    AgoraWarningCodeAdmRuntimeRecordingWarning = 1016,
    AgoraWarningCodeAdmRecordAudioSilence = 1019,
    AgoraWarningCodeAdmPlaybackMalfunction = 1020,
    AgoraWarningCodeAdmRecordMalfunction = 1021,
    AgoraWarningCodeAdmInterruption = 1025,
    AgoraWarningCodeAdmRecordAudioLowlevel = 1031,
    AgoraWarningCodeAdmPlayoutAudioLowlevel = 1032,
    AgoraWarningCodeApmHowling = 1051,
    AgoraWarningCodeAdmGlitchState = 1052,
    AgoraWarningCodeAdmImproperSettings = 1053,
};

typedef NS_ENUM(NSInteger, AgoraErrorCode) {
    AgoraErrorCodeNoError = 0,
    AgoraErrorCodeFailed = 1,
    AgoraErrorCodeInvalidArgument = 2,
    AgoraErrorCodeNotReady = 3,
    AgoraErrorCodeNotSupported = 4,
    AgoraErrorCodeRefused = 5,
    AgoraErrorCodeBufferTooSmall = 6,
    AgoraErrorCodeNotInitialized = 7,
    AgoraErrorCodeNoPermission = 9,
    AgoraErrorCodeTimedOut = 10,
    AgoraErrorCodeCanceled = 11,
    AgoraErrorCodeTooOften = 12,
    AgoraErrorCodeBindSocket = 13,
    AgoraErrorCodeNetDown = 14,
    AgoraErrorCodeNoBufs = 15,
    AgoraErrorCodeJoinChannelRejected = 17,
    AgoraErrorCodeLeaveChannelRejected = 18,
    AgoraErrorCodeAlreadyInUse = 19,
    AgoraErrorCodeAbort = 20,
    AgoraErrorCodeInitNetEngine = 21,
    AgoraErrorCodeResourceLimited = 22,

    AgoraErrorCodeInvalidAppId = 101,
    AgoraErrorCodeInvalidChannelId = 102,
    AgoraErrorCodeTokenExpired = 109,
    AgoraErrorCodeInvalidToken = 110,
    AgoraErrorCodeConnectionInterrupted = 111, // only used in web sdk
    AgoraErrorCodeConnectionLost = 112, // only used in web sdk
    AgoraErrorCodeNotInChannel = 113,
    AgoraErrorCodeSizeTooLarge = 114,
    AgoraErrorCodeBitrateLimit = 115,
    AgoraErrorCodeTooManyDataStreams = 116,
    AgoraErrorCodeDecryptionFailed = 120,
    
    AgoraErrorCodeWatermarkParam = 124,
    AgoraErrorCodeWatermarkPath = 125,
    AgoraErrorCodeWatermarkPng = 126,
    AgoraErrorCodeWatermarkInfo = 127,
    AgoraErrorCodeWatermarkAGRB = 128,
    AgoraErrorCodeWatermarkRead = 129,

    AgoraErrorCodeEncryptedStreamNotAllowedPublish = 130,

    AgoraErrorCodePublishFailed = 150,

    AgoraErrorCodeLoadMediaEngine = 1001,
    AgoraErrorCodeStartCall = 1002,
    AgoraErrorCodeStartCamera = 1003,
    AgoraErrorCodeStartVideoRender = 1004,
    AgoraErrorCodeAdmGeneralError = 1005,
    AgoraErrorCodeAdmJavaResource = 1006,
    AgoraErrorCodeAdmSampleRate = 1007,
    AgoraErrorCodeAdmInitPlayout = 1008,
    AgoraErrorCodeAdmStartPlayout = 1009,
    AgoraErrorCodeAdmStopPlayout = 1010,
    AgoraErrorCodeAdmInitRecording = 1011,
    AgoraErrorCodeAdmStartRecording = 1012,
    AgoraErrorCodeAdmStopRecording = 1013,
    AgoraErrorCodeAdmRuntimePlayoutError = 1015,
    AgoraErrorCodeAdmRuntimeRecordingError = 1017,
    AgoraErrorCodeAdmRecordAudioFailed = 1018,
    AgoraErrorCodeAdmPlayAbnormalFrequency = 1020,
    AgoraErrorCodeAdmRecordAbnormalFrequency = 1021,
    AgoraErrorCodeAdmInitLoopback  = 1022,
    AgoraErrorCodeAdmStartLoopback = 1023,
    AgoraErrorCodeAdmNoRecordingDevice = 1359,
    AgoraErrorCodeAdmNoPlayoutDevice = 1360,
    // 1025, as warning for interruption of adm on ios
    // 1026, as warning for route change of adm on ios
    // VDM error code starts from 1500
    AgoraErrorCodeVdmCameraNotAuthorized = 1501,

    // VCM error code starts from 1600
    AgoraErrorCodeVcmUnknownError = 1600,
    AgoraErrorCodeVcmEncoderInitError = 1601,
    AgoraErrorCodeVcmEncoderEncodeError = 1602,
    AgoraErrorCodeVcmEncoderSetError = 1603,
};


typedef NS_ENUM(NSInteger, AgoraVideoProfile) {
                                                // res       fps
    AgoraVideoProfileInvalid = -1,
    AgoraVideoProfileLandscape120P = 0,         // 160x120   15
#if TARGET_OS_IPHONE
    AgoraVideoProfileLandscape120P_3 = 2,       // 120x120   15
    AgoraVideoProfileLandscape180P = 10,        // 320x180   15
    AgoraVideoProfileLandscape180P_3 = 12,      // 180x180   15
    AgoraVideoProfileLandscape180P_4 = 13,      // 240x180   15
#endif
    AgoraVideoProfileLandscape240P = 20,        // 320x240   15
#if TARGET_OS_IPHONE
    AgoraVideoProfileLandscape240P_3 = 22,      // 240x240   15
    AgoraVideoProfileLandscape240P_4 = 23,      // 424x240   15
#endif
    AgoraVideoProfileLandscape360P = 30,        // 640x360   15
#if TARGET_OS_IPHONE
    AgoraVideoProfileLandscape360P_3 = 32,      // 360x360   15
#endif
    AgoraVideoProfileLandscape360P_4 = 33,      // 640x360   30
    AgoraVideoProfileLandscape360P_6 = 35,      // 360x360   30
    AgoraVideoProfileLandscape360P_7 = 36,      // 480x360   15
    AgoraVideoProfileLandscape360P_8 = 37,      // 480x360   30
    AgoraVideoProfileLandscape360P_9 = 38,      // 640x360   15
    AgoraVideoProfileLandscape360P_10 = 39,     // 640x360   24
    AgoraVideoProfileLandscape360P_11 = 100,    // 640x360   24
    AgoraVideoProfileLandscape480P = 40,        // 640x480   15
#if TARGET_OS_IPHONE
    AgoraVideoProfileLandscape480P_3 = 42,      // 480x480   15
#endif
    AgoraVideoProfileLandscape480P_4 = 43,      // 640x480   30
    AgoraVideoProfileLandscape480P_6 = 45,      // 480x480   30
    AgoraVideoProfileLandscape480P_8 = 47,      // 848x480   15
    AgoraVideoProfileLandscape480P_9 = 48,      // 848x480   30
    AgoraVideoProfileLandscape480P_10 = 49,     // 640x480   10
    AgoraVideoProfileLandscape720P = 50,        // 1280x720  15
    AgoraVideoProfileLandscape720P_3 = 52,      // 1280x720  30
    AgoraVideoProfileLandscape720P_5 = 54,      // 960x720   15
    AgoraVideoProfileLandscape720P_6 = 55,      // 960x720   30
#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
    AgoraVideoProfileLandscape1080P = 60,       // 1920x1080 15
    AgoraVideoProfileLandscape1080P_3 = 62,     // 1920x1080 30
    AgoraVideoProfileLandscape1080P_5 = 64,     // 1920x1080 60
    AgoraVideoProfileLandscape1440P = 66,       // 2560x1440 30
    AgoraVideoProfileLandscape1440P_2 = 67,     // 2560x1440 60
    AgoraVideoProfileLandscape4K = 70,          // 3840x2160 30
    AgoraVideoProfileLandscape4K_3 = 72,        // 3840x2160 60
#endif
    
    AgoraVideoProfilePortrait120P = 1000,       // 120x160   15
#if TARGET_OS_IPHONE
    AgoraVideoProfilePortrait120P_3 = 1002,     // 120x120   15
    AgoraVideoProfilePortrait180P = 1010,       // 180x320   15
    AgoraVideoProfilePortrait180P_3 = 1012,     // 180x180   15
    AgoraVideoProfilePortrait180P_4 = 1013,     // 180x240   15
#endif
    AgoraVideoProfilePortrait240P = 1020,       // 240x320   15
#if TARGET_OS_IPHONE
    AgoraVideoProfilePortrait240P_3 = 1022,     // 240x240   15
    AgoraVideoProfilePortrait240P_4 = 1023,     // 240x424   15
#endif
    AgoraVideoProfilePortrait360P = 1030,       // 360x640   15
#if TARGET_OS_IPHONE
    AgoraVideoProfilePortrait360P_3 = 1032,     // 360x360   15
#endif
    AgoraVideoProfilePortrait360P_4 = 1033,     // 360x640   30
    AgoraVideoProfilePortrait360P_6 = 1035,     // 360x360   30
    AgoraVideoProfilePortrait360P_7 = 1036,     // 360x480   15
    AgoraVideoProfilePortrait360P_8 = 1037,     // 360x480   30
    AgoraVideoProfilePortrait360P_9 = 1038,     // 360x640   15
    AgoraVideoProfilePortrait360P_10 = 1039,    // 360x640   24
    AgoraVideoProfilePortrait360P_11 = 1100,    // 360x640   24
    AgoraVideoProfilePortrait480P = 1040,       // 480x640   15
#if TARGET_OS_IPHONE
    AgoraVideoProfilePortrait480P_3 = 1042,     // 480x480   15
#endif
    AgoraVideoProfilePortrait480P_4 = 1043,     // 480x640   30
    AgoraVideoProfilePortrait480P_6 = 1045,     // 480x480   30
    AgoraVideoProfilePortrait480P_8 = 1047,     // 480x848   15
    AgoraVideoProfilePortrait480P_9 = 1048,     // 480x848   30
    AgoraVideoProfilePortrait480P_10 = 1049,    // 480x640   10
    AgoraVideoProfilePortrait720P = 1050,       // 720x1280  15
    AgoraVideoProfilePortrait720P_3 = 1052,     // 720x1280  30
    AgoraVideoProfilePortrait720P_5 = 1054,     // 720x960   15
    AgoraVideoProfilePortrait720P_6 = 1055,     // 720x960   30
#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
    AgoraVideoProfilePortrait1080P = 1060,      // 1080x1920 15
    AgoraVideoProfilePortrait1080P_3 = 1062,    // 1080x1920 30
    AgoraVideoProfilePortrait1080P_5 = 1064,    // 1080x1920 60
    AgoraVideoProfilePortrait1440P = 1066,      // 1440x2560 30
    AgoraVideoProfilePortrait1440P_2 = 1067,    // 1440x2560 60
    AgoraVideoProfilePortrait4K = 1070,         // 2160x3840 30
    AgoraVideoProfilePortrait4K_3 = 1072,       // 2160x3840 60
#endif
    AgoraVideoProfileDEFAULT = AgoraVideoProfileLandscape360P,
};

typedef NS_ENUM(NSInteger, AgoraChannelProfile) {
    AgoraChannelProfileCommunication = 0,
    AgoraChannelProfileLiveBroadcasting = 1,
    AgoraChannelProfileGame = 2,
};

typedef NS_ENUM(NSInteger, AgoraClientRole) {
    AgoraClientRoleBroadcaster = 1,
    AgoraClientRoleAudience = 2,
};

typedef NS_ENUM(NSInteger, AgoraMediaType) {
    AgoraMediaTypeNone = 0,
    AgoraMediaTypeAudioOnly = 1,
    AgoraMediaTypeVideoOnly = 2,
    AgoraMediaTypeAudioAndVideo = 3,
};

typedef NS_ENUM(NSInteger, AgoraEncryptionMode) {
    AgoraEncryptionModeNone = 0,
    AgoraEncryptionModeAES128XTS = 1,
    AgoraEncryptionModeAES256XTS = 2,
    AgoraEncryptionModeAES128ECB = 3,
};

typedef NS_ENUM(NSUInteger, AgoraUserOfflineReason) {
    AgoraUserOfflineReasonQuit = 0,
    AgoraUserOfflineReasonDropped = 1,
    AgoraUserOfflineReasonBecomeAudience = 2,
};

typedef NS_ENUM(NSUInteger, AgoraInjectStreamStatus) {
    AgoraInjectStreamStatusStartSuccess = 0,
    AgoraInjectStreamStatusStartAlreadyExists = 1,
    AgoraInjectStreamStatusStartUnauthorized = 2,
    AgoraInjectStreamStatusStartTimedout = 3,
    AgoraInjectStreamStatusStartFailed = 4,
    AgoraInjectStreamStatusStopSuccess = 5,
    AgoraInjectStreamStatusStopNotFound = 6,
    AgoraInjectStreamStatusStopUnauthorized = 7,
    AgoraInjectStreamStatusStopTimedout = 8,
    AgoraInjectStreamStatusStopFailed = 9,
    AgoraInjectStreamStatusBroken = 10,
};

typedef NS_ENUM(NSUInteger, AgoraLogFilter) {
    AgoraLogFilterOff = 0,
    AgoraLogFilterDebug = 0x080f,
    AgoraLogFilterInfo = 0x000f,
    AgoraLogFilterWarning = 0x000e,
    AgoraLogFilterError = 0x000c,
    AgoraLogFilterCritical = 0x0008,
};

typedef NS_ENUM(NSInteger, AgoraAudioRecordingQuality) {
    AgoraAudioRecordingQualityLow = 0,
    AgoraAudioRecordingQualityMedium = 1,
    AgoraAudioRecordingQualityHigh = 2
};

typedef NS_ENUM(NSInteger, AgoraRtmpStreamLifeCycle) {
    AgoraRtmpStreamLifeCycleBindToChannel = 1,
    AgoraRtmpStreamLifeCycleBindToOwnner = 2,
};

// network
typedef NS_ENUM(NSUInteger, AgoraNetworkQuality) {
    AgoraNetworkQualityUnknown = 0,
    AgoraNetworkQualityExcellent = 1,
    AgoraNetworkQualityGood = 2,
    AgoraNetworkQualityPoor = 3,
    AgoraNetworkQualityBad = 4,
    AgoraNetworkQualityVBad = 5,
    AgoraNetworkQualityDown = 6,
};

// video
typedef NS_ENUM(NSInteger, AgoraVideoStreamType) {
    AgoraVideoStreamTypeHigh = 0,
    AgoraVideoStreamTypeLow = 1,
};

typedef NS_ENUM(NSUInteger, AgoraVideoRenderMode) {
    /**
     Hidden(1)
     The replaced content is sized to maintain its aspect ratio while filling the View's rectangular area.
     If the content's aspect ratio does not match the aspect ratio of its View, then the content will be clipped to fit.
     The content is then centered in the view.
     */
    AgoraVideoRenderModeHidden = 1,

    /**
     Fit(2)
     The replaced content is scaled to maintain its aspect ratio while fitting within View's rectangular area.
     The entire content is made to fill the box, while preserving its aspect ratio, so the content will be "letterboxed"
     if its aspect ratio does not match the aspect ratio of the View.
     */
    AgoraVideoRenderModeFit = 2,

    /**
     Adaptive(3)：If both callers use the same screen orientation, i.e., both use vertical screens or both use horizontal screens, the AgoraVideoRenderModeHidden mode applies; if they use different screen orientations, i.e., one vertical and one horizontal, the AgoraVideoRenderModeFit mode applies.
     */
    AgoraVideoRenderModeAdaptive __deprecated_enum_msg("AgoraVideoRenderModeAdaptive is deprecated.") = 3,
};

typedef NS_ENUM(NSInteger, AgoraVideoCodecProfileType) {
    AgoraVideoCodecProfileTypeBaseLine = 66,
    AgoraVideoCodecProfileTypeMain = 77,
    AgoraVideoCodecProfileTypeHigh = 100,
};

typedef NS_ENUM(NSUInteger, AgoraVideoMirrorMode) {
    AgoraVideoMirrorModeAuto = 0,
    AgoraVideoMirrorModeEnabled = 1,
    AgoraVideoMirrorModeDisabled = 2,
};

typedef NS_ENUM(NSUInteger, AgoraVideoRemoteState) {
    AgoraVideoRemoteStateStopped = 0,
    AgoraVideoRemoteStateRunning = 1,
    AgoraVideoRemoteStateFrozen = 2,
};

// Audio
typedef NS_ENUM(NSInteger, AgoraAudioSampleRateType) {
    AgoraAudioSampleRateType32000 = 32000,
    AgoraAudioSampleRateType44100 = 44100,
    AgoraAudioSampleRateType48000 = 48000,
};

typedef NS_ENUM(NSInteger, AgoraAudioProfile) {
    // sample rate, bit rate, mono/stereo, speech/music codec
    AgoraAudioProfileDefault = 0,                // use default settings
    AgoraAudioProfileSpeechStandard = 1,         // 32Khz, 18kbps, mono, speech
    AgoraAudioProfileMusicStandard = 2,          // 48Khz, 48kbps, mono, music
    AgoraAudioProfileMusicStandardStereo = 3,    // 48Khz, 56kbps, stereo, music
    AgoraAudioProfileMusicHighQuality = 4,       // 48Khz, 128kbps, mono, music
    AgoraAudioProfileMusicHighQualityStereo = 5, // 48Khz, 192kbps, stereo, music
};

typedef NS_ENUM(NSInteger, AgoraAudioScenario) {
    AgoraAudioScenarioDefault = 0,
    AgoraAudioScenarioChatRoomEntertainment = 1,
    AgoraAudioScenarioEducation = 2,
    AgoraAudioScenarioGameStreaming = 3,
    AgoraAudioScenarioShowRoom = 4,
    AgoraAudioScenarioChatRoomGaming = 5
};

typedef NS_ENUM(NSInteger, AgoraAudioOutputRouting)
{
    AgoraAudioOutputRoutingDefault = -1,
    AgoraAudioOutputRoutingHeadset = 0,
    AgoraAudioOutputRoutingEarpiece = 1,
    AgoraAudioOutputRoutingHeadsetNoMic = 2,
    AgoraAudioOutputRoutingSpeakerphone = 3,
    AgoraAudioOutputRoutingLoudspeaker = 4,
    AgoraAudioOutputRoutingHeadsetBluetooth = 5
};

typedef NS_ENUM(NSInteger, AgoraAudioRawFrameOperationMode) {
    AgoraAudioRawFrameOperationModeReadOnly = 0,
    AgoraAudioRawFrameOperationModeWriteOnly = 1,
    AgoraAudioRawFrameOperationModeReadWrite = 2,
};

typedef NS_ENUM(NSInteger, AgoraAudioEqualizationBandFrequency) {
    AgoraAudioEqualizationBand31 = 0,
    AgoraAudioEqualizationBand62 = 1,
    AgoraAudioEqualizationBand125 = 2,
    AgoraAudioEqualizationBand250 = 3,
    AgoraAudioEqualizationBand500 = 4,
    AgoraAudioEqualizationBand1K = 5,
    AgoraAudioEqualizationBand2K = 6,
    AgoraAudioEqualizationBand4K = 7,
    AgoraAudioEqualizationBand8K = 8,
    AgoraAudioEqualizationBand16K = 9,
};

typedef NS_ENUM(NSInteger, AgoraAudioReverbType) {
    AgoraAudioReverbDryLevel = 0, // (dB, [-20,10]), the level of the dry signal
    AgoraAudioReverbWetLevel = 1, // (dB, [-20,10]), the level of the early reflection signal (wet signal)
    AgoraAudioReverbRoomSize = 2, // ([0，100]), the room size of the reflection
    AgoraAudioReverbWetDelay = 3, // (ms, [0, 200]), the length of the initial delay of the wet signal in ms
    AgoraAudioReverbStrength = 4, // ([0，100]), the strength of the late reverberation
};

// device
typedef NS_ENUM(NSInteger, AgoraMediaDeviceType) {
    AgoraMediaDeviceTypeAudioUnknown = -1,
    AgoraMediaDeviceTypeAudioRecording = 0,
    AgoraMediaDeviceTypeAudioPlayout = 1,
    AgoraMediaDeviceTypeVideoRender = 2,
    AgoraMediaDeviceTypeVideoCapture = 3,
};
