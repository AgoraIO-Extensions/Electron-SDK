import AudioMixing from './AudioMixing/AudioMixing';
import SendMultiVideoStream from './SendMultiVideoStream/SendMultiVideoStream';
import ChannelMediaRelay from './ChannelMediaRelay/ChannelMediaRelay';
import ContentInspect from './ContentInspect/ContentInspect';
import StreamMessage from './StreamMessage/StreamMessage';
import DirectCdnStreaming from './DirectCdnStreaming/DirectCdnStreaming';
import LocalVideoTranscoder from './LocalVideoTranscoder/LocalVideoTranscoder';
import MediaPlayer from './MediaPlayer/MediaPlayer';
import JoinMultipleChannel from './JoinMultipleChannel/JoinMultipleChannel';
import RhythmPlayer from './RhythmPlayer/RhythmPlayer';
import ScreenShare from './ScreenShare/ScreenShare';
import SendMetadata from './SendMetadata/SendMetadata';
import Encryption from './Encryption/Encryption';
import RTMPStreaming from './RTMPStreaming/RTMPStreaming';
import SpatialAudio from './SpatialAudio/SpatialAudio';
import TakeSnapshot from './TakeSnapshot/TakeSnapshot';
import VirtualBackground from './VirtualBackground/VirtualBackground';
import VoiceChanger from './VoiceChanger/VoiceChanger';
import AudioSpectrum from './AudioSpectrum/AudioSpectrum';
import BeautyEffect from './BeautyEffect/BeautyEffect';
import EncodedVideoFrame from './EncodedVideoFrame/EncodedVideoFrame';
import MediaRecorder from './MediaRecorder/MediaRecorder';
import PlayEffect from './PlayEffect/PlayEffect';
import PushVideoFrame from './PushVideoFrame/PushVideoFrame';
import VideoEncoderConfiguration from './VideoEncoderConfiguration/VideoEncoderConfiguration';
import Extension from './Extension/Extension';
import LocalSpatialAudioEngine from './LocalSpatialAudioEngine/LocalSpatialAudioEngine';
import DeviceManager from './DeviceManager/DeviceManager';
import MusicContentCenter from './MusicContentCenter/MusicContentCenter';

const advanceRoute = [
  { path: '/AudioMixing', component: AudioMixing, title: 'AudioMixing' },
  { path: '/AudioSpectrum', component: AudioSpectrum, title: 'AudioSpectrum' },
  { path: '/BeautyEffect', component: BeautyEffect, title: 'BeautyEffect' },
  {
    path: '/ChannelMediaRelay',
    component: ChannelMediaRelay,
    title: 'ChannelMediaRelay',
  },
  {
    path: '/ContentInspect',
    component: ContentInspect,
    title: 'ContentInspect',
  },
  {
    path: '/DeviceManager',
    component: DeviceManager,
    title: 'DeviceManager',
  },
  {
    path: '/DirectCdnStreaming',
    component: DirectCdnStreaming,
    title: 'DirectCdnStreaming',
  },
  {
    path: '/EncodedVideoFrame',
    component: EncodedVideoFrame,
    title: 'EncodedVideoFrame',
  },
  { path: '/Encryption', component: Encryption, title: 'Encryption' },
  { path: '/Extension', component: Extension, title: 'Extension' },
  {
    path: '/JoinMultipleChannel',
    component: JoinMultipleChannel,
    title: 'JoinMultipleChannel',
  },
  {
    path: '/LocalSpatialAudioEngine',
    component: LocalSpatialAudioEngine,
    title: 'LocalSpatialAudioEngine',
  },
  {
    path: '/LocalVideoTranscoder',
    component: LocalVideoTranscoder,
    title: 'LocalVideoTranscoder',
  },
  { path: '/MediaPlayer', component: MediaPlayer, title: 'MediaPlayer' },
  { path: '/MediaRecorder', component: MediaRecorder, title: 'MediaRecorder' },
  {
    path: '/MusicContentCenter',
    component: MusicContentCenter,
    title: 'MusicContentCenter',
  },
  { path: '/PlayEffect', component: PlayEffect, title: 'PlayEffect' },
  {
    path: '/PushVideoFrame',
    component: PushVideoFrame,
    title: 'PushVideoFrame',
  },
  { path: '/RhythmPlayer', component: RhythmPlayer, title: 'RhythmPlayer' },
  {
    path: '/RTMPStreaming',
    component: RTMPStreaming,
    title: 'RTMPStreaming',
  },
  { path: '/ScreenShare', component: ScreenShare, title: 'ScreenShare' },
  { path: '/SendMetadata', component: SendMetadata, title: 'SendMetadata' },
  {
    path: '/SendMultiVideoStream',
    component: SendMultiVideoStream,
    title: 'SendMultiVideoStream',
  },
  { path: '/SpatialAudio', component: SpatialAudio, title: 'SpatialAudio' },
  {
    path: '/StreamMessage',
    component: StreamMessage,
    title: 'StreamMessage',
  },
  { path: '/TakeSnapshot', component: TakeSnapshot, title: 'TakeSnapshot' },
  {
    path: '/VideoEncoderConfiguration',
    component: VideoEncoderConfiguration,
    title: 'VideoEncoderConfiguration',
  },
  {
    path: '/VirtualBackground',
    component: VirtualBackground,
    title: 'VirtualBackground',
  },
  { path: '/VoiceChanger', component: VoiceChanger, title: 'VoiceChanger' },
];

export default advanceRoute;
