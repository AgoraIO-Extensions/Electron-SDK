import PW from './JoinChannelAudio/JoinChannelAudio';
import StringUid from './StringUid/StringUid';
import VideoDecoder from './VideoDecoder/VideoDecoder';

const Basic = {
  title: 'Basic',
  data: [
    {
      name: 'PW Test',
      component: PW,
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
