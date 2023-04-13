import DeviceManager from './DeviceManager/DeviceManager';
import JoinChannelAudio from './JoinChannelAudio/JoinChannelAudio';
import JoinChannelVideo from './JoinChannelVideo/JoinChannelVideo';
import JoinMultipleChannel from './JoinMultipleChannel/JoinMultipleChannel';
import StringUid from './StringUid/StringUid';
import VirtualBackground from './VirtualBackground/VirtualBackground';

const hooksRoutes = [
  {
    path: '/JoinChannelVideoWithHook',
    component: JoinChannelVideo,
    title: 'JoinChannelVideoWithHook',
  },
  {
    path: '/JoinChannelAudioWithHook',
    component: JoinChannelAudio,
    title: 'JoinChannelAudioWithHook',
  },
  {
    path: '/StringUidHook',
    component: StringUid,
    title: 'StringUidHook',
  },
  {
    path: '/JoinMultipleChannelHook',
    component: JoinMultipleChannel,
    title: 'JoinMultipleChannelHook',
  },
  {
    path: '/VirtualBackgroundHook',
    component: VirtualBackground,
    title: 'VirtualBackgroundHook',
  },
  {
    path: '/DeviceManagerHook',
    component: DeviceManager,
    title: 'DeviceManagerHook',
  },
];

export default hooksRoutes;
