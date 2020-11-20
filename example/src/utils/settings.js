export const APP_ID = #APPID
export const SHARE_ID = 0
export const RTMP_URL = ''
export const FU_AUTH = []

import { VoiceChangerPreset, AudioReverbPreset } from '../../../JS/Api/native_type';

export const voiceReverbList = [
  {
    value: AudioReverbPreset.AUDIO_REVERB_OFF,
    label: "AUDIO_REVERB_OFF"
  },
  {
    value: AudioReverbPreset.AUDIO_REVERB_FX_POPULAR,
    label: "AUDIO_REVERB_FX_POPULAR"
  },
  {
    value: AudioReverbPreset.AUDIO_REVERB_FX_KTV,
    label: "AUDIO_REVERB_FX_KTV"
  },
  {
    value: AudioReverbPreset.AUDIO_REVERB_FX_UNCLE,
    label: "AUDIO_REVERB_FX_UNCLE"
  }
]

export const voiceChangerList = [
  {
    value: 0,
    label: "VOICE_CHANGER_OFF"
  },
  {
    value: 1,
    label: "VOICE_CHANGER_OLDMAN"
  },
  {
    value: 2,
    label: "VOICE_CHANGER_BABYBOY"
  },
  {
    value: 3,
    label: "VOICE_CHANGER_BABYGIRL"
  },
  {
    value: 4,
    label: "VOICE_CHANGER_ZHUBAJIE"
  },
  {
    value: 5,
    label: "VOICE_CHANGER_ETHEREAL"
  },
  {
    value: 6,
    label: "VOICE_CHANGER_HULK"
  },
  {
    value: VoiceChangerPreset.GENERAL_BEAUTY_VOICE_MALE_MAGNETIC,
    label:"GENERAL_BEAUTY_VOICE_MALE_MAGNETIC"
  }
]

export const videoProfileList = [
  {
    value: 0,
    label: '160x120	15fps	65kbps'
  },
  {
    value: 20,
    label: '320x240	15fps	200kbps'
  },
  {
    value: 30,
    label: '640x360	15fps	400kbps'
  },
  {
    value: 43,
    label: '640x480	30fps	750kbps'
  },
  {
    value: 50,
    label: '1280x720 15fps 1130kbps'
  },
  {
    value: 60,
    label: '1920x1080 15fps 2080kbps'
  }
]

export const audioProfileList = [
  {
    value: 0,
    label: 'AUDIO_PROFILE_DEFAULT'
  },
  {
    value: 1,
    label: 'AUDIO_PROFILE_SPEECH_STANDARD'
  },
  {
    value: 2,
    label: 'AUDIO_PROFILE_MUSIC_STANDARD'
  },
  {
    value: 3,
    label: 'AUDIO_PROFILE_MUSIC_STANDARD_STEREO'
  },
  {
    value: 4,
    label: 'AUDIO_PROFILE_MUSIC_HIGH_QUALITY'
  },
  {
    value: 5,
    label: 'AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO'
  } 
]

export const audioScenarioList = [
  {
    value: 0,
    label: 'AUDIO_PROFILE_DEFAULT'
  },
  {
    value: 1,
    label: 'AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT'
  },
  {
    value: 2,
    label: 'AUDIO_SCENARIO_EDUCATION'
  },
  {
    value: 3,
    label: 'AUDIO_SCENARIO_GAME_STREAMING'
  },
  {
    value: 4,
   label: 'AUDIO_SCENARIO_SHOWROOM'
  },
  {
    value: 5,
    label: 'AUDIO_SCENARIO_CHATROOM_GAMING'
  } 
]