"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Local voice changer options. */
var VoiceChangerPreset;
(function (VoiceChangerPreset) {
    /** 0: The original voice (no local voice change). */
    VoiceChangerPreset[VoiceChangerPreset["VOICE_CHANGER_OFF"] = 0] = "VOICE_CHANGER_OFF";
    /** 1: An old man's voice. */
    VoiceChangerPreset[VoiceChangerPreset["VOICE_CHANGER_OLDMAN"] = 1] = "VOICE_CHANGER_OLDMAN";
    /** 2: A little boy's voice. */
    VoiceChangerPreset[VoiceChangerPreset["VOICE_CHANGER_BABYBOY"] = 2] = "VOICE_CHANGER_BABYBOY";
    /** 3: A little girl's voice. */
    VoiceChangerPreset[VoiceChangerPreset["VOICE_CHANGER_BABYGIRL"] = 3] = "VOICE_CHANGER_BABYGIRL";
    /** 4: The voice of a growling bear. */
    VoiceChangerPreset[VoiceChangerPreset["VOICE_CHANGER_ZHUBAJIE"] = 4] = "VOICE_CHANGER_ZHUBAJIE";
    /** 5: Ethereal vocal effects. */
    VoiceChangerPreset[VoiceChangerPreset["VOICE_CHANGER_ETHEREAL"] = 5] = "VOICE_CHANGER_ETHEREAL";
    /** 6: Hulk's voice. */
    VoiceChangerPreset[VoiceChangerPreset["VOICE_CHANGER_HULK"] = 6] = "VOICE_CHANGER_HULK";
})(VoiceChangerPreset = exports.VoiceChangerPreset || (exports.VoiceChangerPreset = {}));
var AudioReverbPreset;
(function (AudioReverbPreset) {
    /** 0: The original voice (no local voice reverberation). */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_OFF"] = 0] = "AUDIO_REVERB_OFF";
    /** 1: Pop music. */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_POPULAR"] = 1] = "AUDIO_REVERB_POPULAR";
    /** 2: R&B. */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_RNB"] = 2] = "AUDIO_REVERB_RNB";
    /** 3: Rock music. */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_ROCK"] = 3] = "AUDIO_REVERB_ROCK";
    /** 4: Hip-hop. */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_HIPHOP"] = 4] = "AUDIO_REVERB_HIPHOP";
    /** 5: Pop concert. */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_VOCAL_CONCERT"] = 5] = "AUDIO_REVERB_VOCAL_CONCERT";
    /** 6: Karaoke. */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_KTV"] = 6] = "AUDIO_REVERB_KTV";
    /** 7: Recording studio. */
    AudioReverbPreset[AudioReverbPreset["AUDIO_REVERB_STUDIO"] = 7] = "AUDIO_REVERB_STUDIO";
})(AudioReverbPreset = exports.AudioReverbPreset || (exports.AudioReverbPreset = {}));
var Priority;
(function (Priority) {
    /** 50: The user's priority is high. */
    Priority[Priority["PRIORITY_HIGH"] = 50] = "PRIORITY_HIGH";
    /** 100: (Default) The user's priority is normal. */
    Priority[Priority["PRIORITY_NORMAL"] = 100] = "PRIORITY_NORMAL";
})(Priority = exports.Priority || (exports.Priority = {}));
var AualityAdaptIndication;
(function (AualityAdaptIndication) {
    /** The quality of the local video stays the same. */
    AualityAdaptIndication[AualityAdaptIndication["ADAPT_NONE"] = 0] = "ADAPT_NONE";
    /** The quality improves because the network bandwidth increases. */
    AualityAdaptIndication[AualityAdaptIndication["ADAPT_UP_BANDWIDTH"] = 1] = "ADAPT_UP_BANDWIDTH";
    /** The quality worsens because the network bandwidth decreases. */
    AualityAdaptIndication[AualityAdaptIndication["ADAPT_DOWN_BANDWIDTH"] = 2] = "ADAPT_DOWN_BANDWIDTH";
})(AualityAdaptIndication = exports.AualityAdaptIndication || (exports.AualityAdaptIndication = {}));
var DegradationPreference;
(function (DegradationPreference) {
    /** 0: (Default) Degrade the frame rate in order to maintain the video quality. */
    DegradationPreference[DegradationPreference["MAINTAIN_QUALITY"] = 0] = "MAINTAIN_QUALITY";
    /** 1: Degrade the video quality in order to maintain the frame rate. */
    DegradationPreference[DegradationPreference["MAINTAIN_FRAMERATE"] = 1] = "MAINTAIN_FRAMERATE";
    /** 2: (For future use) Maintain a balance between the frame rate and video quality. */
    DegradationPreference[DegradationPreference["MAINTAIN_BALANCED"] = 2] = "MAINTAIN_BALANCED";
})(DegradationPreference = exports.DegradationPreference || (exports.DegradationPreference = {}));
var OrientationMode;
(function (OrientationMode) {
    OrientationMode[OrientationMode["ORIENTATION_MODE_ADAPTIVE"] = 0] = "ORIENTATION_MODE_ADAPTIVE";
    OrientationMode[OrientationMode["ORIENTATION_MODE_FIXED_LANDSCAPE"] = 1] = "ORIENTATION_MODE_FIXED_LANDSCAPE";
    OrientationMode[OrientationMode["ORIENTATION_MODE_FIXED_PORTRAIT"] = 2] = "ORIENTATION_MODE_FIXED_PORTRAIT";
})(OrientationMode = exports.OrientationMode || (exports.OrientationMode = {}));
var CaptureOutPreference;
(function (CaptureOutPreference) {
    /** 0: (Default) self-adapts the camera output parameters to the system performance and network conditions to balance CPU consumption and video preview quality.
     */
    CaptureOutPreference[CaptureOutPreference["CAPTURER_OUTPUT_PREFERENCE_AUTO"] = 0] = "CAPTURER_OUTPUT_PREFERENCE_AUTO";
    /** 2: Prioritizes the system performance. The SDK chooses the dimension and frame rate of the local camera capture closest to those set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration".
     */
    CaptureOutPreference[CaptureOutPreference["CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE"] = 1] = "CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE";
    /** 2: Prioritizes the local preview quality. The SDK chooses higher camera output parameters to improve the local video preview quality. This option requires extra CPU and RAM usage for video pre-processing.
     */
    CaptureOutPreference[CaptureOutPreference["CAPTURER_OUTPUT_PREFERENCE_PREVIEW"] = 2] = "CAPTURER_OUTPUT_PREFERENCE_PREVIEW";
})(CaptureOutPreference = exports.CaptureOutPreference || (exports.CaptureOutPreference = {}));
var VideoContentHint;
(function (VideoContentHint) {
    VideoContentHint[VideoContentHint["CONTENT_HINT_NONE"] = 0] = "CONTENT_HINT_NONE";
    VideoContentHint[VideoContentHint["CONTENT_HINT_MOTION"] = 1] = "CONTENT_HINT_MOTION";
    VideoContentHint[VideoContentHint["CONTENT_HINT_DETAILS"] = 2] = "CONTENT_HINT_DETAILS"; // Motionless content. Choose this option if you prefer sharpness or when you are sharing a picture, PowerPoint slide, or text.
})(VideoContentHint = exports.VideoContentHint || (exports.VideoContentHint = {}));
/** @deprecated Video profile. */
var VIDEO_PROFILE_TYPE;
(function (VIDEO_PROFILE_TYPE) {
    /** 0: 160 &times; 120, frame rate 15 fps, bitrate 65 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_120P"] = 0] = "VIDEO_PROFILE_LANDSCAPE_120P";
    /** 2: 120 &times; 120, frame rate 15 fps, bitrate 50 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_120P_3"] = 2] = "VIDEO_PROFILE_LANDSCAPE_120P_3";
    /** 10: 320&times;180, frame rate 15 fps, bitrate 140 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_180P"] = 10] = "VIDEO_PROFILE_LANDSCAPE_180P";
    /** 12: 180 &times; 180, frame rate 15 fps, bitrate 100 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_180P_3"] = 12] = "VIDEO_PROFILE_LANDSCAPE_180P_3";
    /** 13: 240 &times; 180, frame rate 15 fps, bitrate 120 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_180P_4"] = 13] = "VIDEO_PROFILE_LANDSCAPE_180P_4";
    /** 20: 320 &times; 240, frame rate 15 fps, bitrate 200 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_240P"] = 20] = "VIDEO_PROFILE_LANDSCAPE_240P";
    /** 22: 240 &times; 240, frame rate 15 fps, bitrate 140 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_240P_3"] = 22] = "VIDEO_PROFILE_LANDSCAPE_240P_3";
    /** 23: 424 &times; 240, frame rate 15 fps, bitrate 220 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_240P_4"] = 23] = "VIDEO_PROFILE_LANDSCAPE_240P_4";
    /** 30: 640 &times; 360, frame rate 15 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P"] = 30] = "VIDEO_PROFILE_LANDSCAPE_360P";
    /** 32: 360 &times; 360, frame rate 15 fps, bitrate 260 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_3"] = 32] = "VIDEO_PROFILE_LANDSCAPE_360P_3";
    /** 33: 640 &times; 360, frame rate 30 fps, bitrate 600 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_4"] = 33] = "VIDEO_PROFILE_LANDSCAPE_360P_4";
    /** 35: 360 &times; 360, frame rate 30 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_6"] = 35] = "VIDEO_PROFILE_LANDSCAPE_360P_6";
    /** 36: 480 &times; 360, frame rate 15 fps, bitrate 320 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_7"] = 36] = "VIDEO_PROFILE_LANDSCAPE_360P_7";
    /** 37: 480 &times; 360, frame rate 30 fps, bitrate 490 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_8"] = 37] = "VIDEO_PROFILE_LANDSCAPE_360P_8";
    /** 38: 640 &times; 360, frame rate 15 fps, bitrate 800 Kbps.
     * @note Live broadcast profile only.
     */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_9"] = 38] = "VIDEO_PROFILE_LANDSCAPE_360P_9";
    /** 39: 640 &times; 360, frame rate 24 fps, bitrate 800 Kbps.
     * @note Live broadcast profile only.
     */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_10"] = 39] = "VIDEO_PROFILE_LANDSCAPE_360P_10";
    /** 100: 640 &times; 360, frame rate 24 fps, bitrate 1000 Kbps.
     * @note Live broadcast profile only.
     */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_11"] = 100] = "VIDEO_PROFILE_LANDSCAPE_360P_11";
    /** 40: 640 &times; 480, frame rate 15 fps, bitrate 500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P"] = 40] = "VIDEO_PROFILE_LANDSCAPE_480P";
    /** 42: 480 &times; 480, frame rate 15 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_3"] = 42] = "VIDEO_PROFILE_LANDSCAPE_480P_3";
    /** 43: 640 &times; 480, frame rate 30 fps, bitrate 750 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_4"] = 43] = "VIDEO_PROFILE_LANDSCAPE_480P_4";
    /** 45: 480 &times; 480, frame rate 30 fps, bitrate 600 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_6"] = 45] = "VIDEO_PROFILE_LANDSCAPE_480P_6";
    /** 47: 848 &times; 480, frame rate 15 fps, bitrate 610 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_8"] = 47] = "VIDEO_PROFILE_LANDSCAPE_480P_8";
    /** 48: 848 &times; 480, frame rate 30 fps, bitrate 930 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_9"] = 48] = "VIDEO_PROFILE_LANDSCAPE_480P_9";
    /** 49: 640 &times; 480, frame rate 10 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_10"] = 49] = "VIDEO_PROFILE_LANDSCAPE_480P_10";
    /** 50: 1280 &times; 720, frame rate 15 fps, bitrate 1130 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P"] = 50] = "VIDEO_PROFILE_LANDSCAPE_720P";
    /** 52: 1280 &times; 720, frame rate 30 fps, bitrate 1710 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P_3"] = 52] = "VIDEO_PROFILE_LANDSCAPE_720P_3";
    /** 54: 960 &times; 720, frame rate 15 fps, bitrate 910 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P_5"] = 54] = "VIDEO_PROFILE_LANDSCAPE_720P_5";
    /** 55: 960 &times; 720, frame rate 30 fps, bitrate 1380 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P_6"] = 55] = "VIDEO_PROFILE_LANDSCAPE_720P_6";
    /** 60: 1920 &times; 1080, frame rate 15 fps, bitrate 2080 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1080P"] = 60] = "VIDEO_PROFILE_LANDSCAPE_1080P";
    /** 62: 1920 &times; 1080, frame rate 30 fps, bitrate 3150 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1080P_3"] = 62] = "VIDEO_PROFILE_LANDSCAPE_1080P_3";
    /** 64: 1920 &times; 1080, frame rate 60 fps, bitrate 4780 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1080P_5"] = 64] = "VIDEO_PROFILE_LANDSCAPE_1080P_5";
    /** 66: 2560 &times; 1440, frame rate 30 fps, bitrate 4850 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1440P"] = 66] = "VIDEO_PROFILE_LANDSCAPE_1440P";
    /** 67: 2560 &times; 1440, frame rate 60 fps, bitrate 6500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1440P_2"] = 67] = "VIDEO_PROFILE_LANDSCAPE_1440P_2";
    /** 70: 3840 &times; 2160, frame rate 30 fps, bitrate 6500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_4K"] = 70] = "VIDEO_PROFILE_LANDSCAPE_4K";
    /** 72: 3840 &times; 2160, frame rate 60 fps, bitrate 6500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_4K_3"] = 72] = "VIDEO_PROFILE_LANDSCAPE_4K_3";
    /** 1000: 120 &times; 160, frame rate 15 fps, bitrate 65 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_120P"] = 1000] = "VIDEO_PROFILE_PORTRAIT_120P";
    /** 1002: 120 &times; 120, frame rate 15 fps, bitrate 50 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_120P_3"] = 1002] = "VIDEO_PROFILE_PORTRAIT_120P_3";
    /** 1010: 180 &times; 320, frame rate 15 fps, bitrate 140 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_180P"] = 1010] = "VIDEO_PROFILE_PORTRAIT_180P";
    /** 1012: 180 &times; 180, frame rate 15 fps, bitrate 100 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_180P_3"] = 1012] = "VIDEO_PROFILE_PORTRAIT_180P_3";
    /** 1013: 180 &times; 240, frame rate 15 fps, bitrate 120 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_180P_4"] = 1013] = "VIDEO_PROFILE_PORTRAIT_180P_4";
    /** 1020: 240 &times; 320, frame rate 15 fps, bitrate 200 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_240P"] = 1020] = "VIDEO_PROFILE_PORTRAIT_240P";
    /** 1022: 240 &times; 240, frame rate 15 fps, bitrate 140 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_240P_3"] = 1022] = "VIDEO_PROFILE_PORTRAIT_240P_3";
    /** 1023: 240 &times; 424, frame rate 15 fps, bitrate 220 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_240P_4"] = 1023] = "VIDEO_PROFILE_PORTRAIT_240P_4";
    /** 1030: 360 &times; 640, frame rate 15 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P"] = 1030] = "VIDEO_PROFILE_PORTRAIT_360P";
    /** 1032: 360 &times; 360, frame rate 15 fps, bitrate 260 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_3"] = 1032] = "VIDEO_PROFILE_PORTRAIT_360P_3";
    /** 1033: 360 &times; 640, frame rate 30 fps, bitrate 600 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_4"] = 1033] = "VIDEO_PROFILE_PORTRAIT_360P_4";
    /** 1035: 360 &times; 360, frame rate 30 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_6"] = 1035] = "VIDEO_PROFILE_PORTRAIT_360P_6";
    /** 1036: 360 &times; 480, frame rate 15 fps, bitrate 320 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_7"] = 1036] = "VIDEO_PROFILE_PORTRAIT_360P_7";
    /** 1037: 360 &times; 480, frame rate 30 fps, bitrate 490 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_8"] = 1037] = "VIDEO_PROFILE_PORTRAIT_360P_8";
    /** 1038: 360 &times; 640, frame rate 15 fps, bitrate 800 Kbps.
     * @note Live broadcast profile only.
     */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_9"] = 1038] = "VIDEO_PROFILE_PORTRAIT_360P_9";
    /** 1039: 360 &times; 640, frame rate 24 fps, bitrate 800 Kbps.
     * @note Live broadcast profile only.
     */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_10"] = 1039] = "VIDEO_PROFILE_PORTRAIT_360P_10";
    /** 1100: 360 &times; 640, frame rate 24 fps, bitrate 1000 Kbps.
     * @note Live broadcast profile only.
     */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_11"] = 1100] = "VIDEO_PROFILE_PORTRAIT_360P_11";
    /** 1040: 480 &times; 640, frame rate 15 fps, bitrate 500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P"] = 1040] = "VIDEO_PROFILE_PORTRAIT_480P";
    /** 1042: 480 &times; 480, frame rate 15 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_3"] = 1042] = "VIDEO_PROFILE_PORTRAIT_480P_3";
    /** 1043: 480 &times; 640, frame rate 30 fps, bitrate 750 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_4"] = 1043] = "VIDEO_PROFILE_PORTRAIT_480P_4";
    /** 1045: 480 &times; 480, frame rate 30 fps, bitrate 600 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_6"] = 1045] = "VIDEO_PROFILE_PORTRAIT_480P_6";
    /** 1047: 480 &times; 848, frame rate 15 fps, bitrate 610 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_8"] = 1047] = "VIDEO_PROFILE_PORTRAIT_480P_8";
    /** 1048: 480 &times; 848, frame rate 30 fps, bitrate 930 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_9"] = 1048] = "VIDEO_PROFILE_PORTRAIT_480P_9";
    /** 1049: 480 &times; 640, frame rate 10 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_10"] = 1049] = "VIDEO_PROFILE_PORTRAIT_480P_10";
    /** 1050: 720 &times; 1280, frame rate 15 fps, bitrate 1130 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P"] = 1050] = "VIDEO_PROFILE_PORTRAIT_720P";
    /** 1052: 720 &times; 1280, frame rate 30 fps, bitrate 1710 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P_3"] = 1052] = "VIDEO_PROFILE_PORTRAIT_720P_3";
    /** 1054: 720 &times; 960, frame rate 15 fps, bitrate 910 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P_5"] = 1054] = "VIDEO_PROFILE_PORTRAIT_720P_5";
    /** 1055: 720 &times; 960, frame rate 30 fps, bitrate 1380 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P_6"] = 1055] = "VIDEO_PROFILE_PORTRAIT_720P_6";
    /** 1060: 1080 &times; 1920, frame rate 15 fps, bitrate 2080 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1080P"] = 1060] = "VIDEO_PROFILE_PORTRAIT_1080P";
    /** 1062: 1080 &times; 1920, frame rate 30 fps, bitrate 3150 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1080P_3"] = 1062] = "VIDEO_PROFILE_PORTRAIT_1080P_3";
    /** 1064: 1080 &times; 1920, frame rate 60 fps, bitrate 4780 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1080P_5"] = 1064] = "VIDEO_PROFILE_PORTRAIT_1080P_5";
    /** 1066: 1440 &times; 2560, frame rate 30 fps, bitrate 4850 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1440P"] = 1066] = "VIDEO_PROFILE_PORTRAIT_1440P";
    /** 1067: 1440 &times; 2560, frame rate 60 fps, bitrate 6500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1440P_2"] = 1067] = "VIDEO_PROFILE_PORTRAIT_1440P_2";
    /** 1070: 2160 &times; 3840, frame rate 30 fps, bitrate 6500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_4K"] = 1070] = "VIDEO_PROFILE_PORTRAIT_4K";
    /** 1072: 2160 &times; 3840, frame rate 60 fps, bitrate 6500 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_4K_3"] = 1072] = "VIDEO_PROFILE_PORTRAIT_4K_3";
    /** Default 640 &times; 360, frame rate 15 fps, bitrate 400 Kbps. */
    VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_DEFAULT"] = 30] = "VIDEO_PROFILE_DEFAULT";
})(VIDEO_PROFILE_TYPE = exports.VIDEO_PROFILE_TYPE || (exports.VIDEO_PROFILE_TYPE = {}));
