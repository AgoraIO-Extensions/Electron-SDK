import JoinChannelAudio from './JoinChannelAudio/JoinChannelAudio';
import JoinChannelVideo from './JoinChannelVideo/JoinChannelVideo';
import StringUid from './StringUid/StringUid';
import VideoDecoder from './VideoDecoder/VideoDecoder';

const Basic = {
  title: 'Basic',
  data: [
    {
      name: 'JoinChannelAudio',
      component: JoinChannelAudio,
    },
    {
      name: 'JoinChannelVideo',
      component: JoinChannelVideo,
    },
    {
      name: 'StringUid',
      component: StringUid,
    },
    {
      name: 'VideoDecoder',
      component: VideoDecoder,
    },
  ],
};

export default Basic;
