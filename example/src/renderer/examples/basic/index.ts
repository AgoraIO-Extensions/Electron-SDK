import JoinChannelAudio from './JoinChannelAudio/JoinChannelAudio';
import JoinChannelVideo from './JoinChannelVideo/JoinChannelVideo';
import LoopbackAudio from './LoopbackAudio/LoopbackAudio';
import StringUid from './StringUid/StringUid';

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
      name: 'Loopback',
      component: LoopbackAudio,
    },
  ],
};

export default Basic;
