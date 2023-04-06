import JoinChannelVideo from './JoinChannelVideo/JoinChannelVideo';
import StringUid from './StringUid/StringUid';
import JoinChannelAudio from './JoinChannelAudio/JoinChannelAudio';
import JoinMultipleChannel from './JoinMultipleChannel/JoinMultipleChannel';
import VirtualBackground from './VirtualBackground/VirtualBackground';
import DeviceManager from './DeviceManager/DeviceManager';

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
