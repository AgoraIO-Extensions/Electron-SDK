import JoinChannelVideo from './JoinChannelVideo/JoinChannelVideo';
import MusicContentCenter from './MusicContentCenter/MusicContentCenter';

const hooksRoutes = [
  {
    path: '/JoinChannelVideoWithHook',
    component: JoinChannelVideo,
    title: 'JoinChannelVideoWithHook',
  },
  {
    path: '/MusicContentCenter',
    component: MusicContentCenter,
    title: 'MusicContentCenter',
  },
];

export default hooksRoutes;
