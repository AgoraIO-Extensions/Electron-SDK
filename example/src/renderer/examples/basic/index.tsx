import JoinChannelAudio from './JoinChannelAudio'
import JoinChannelVideo from './JoinChannelVideo'
import StringUid from './StringUid'

const basicRoutes = [
  {
    path: '/JoinChannelVideo',
    component: JoinChannelVideo,
    title: 'JoinChannelVideo',
  },
  {
    path: '/JoinChannelAudio',
    component: JoinChannelAudio,
    title: 'JoinChannelAudio',
  },
  {
    path: '/StringUid',
    component: StringUid,
    title: 'StringUid',
  },
]

export default basicRoutes
