import { Card, Input, List } from 'antd'
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IRtcEngine,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  RtcConnection,
  RtcEngineExImplInternal,
  RtcStats,
  UserOfflineReasonType,
} from 'electron-agora-rtc-ng'
import { Component } from 'react'
import JoinChannelBar from '../../component/JoinChannelBar'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { getRandomInt } from '../../util'
import createDataStreamStyle from './CreateDataStream.scss'
const { Search } = Input
interface User {
  isMyself: boolean
  uid: number
}

interface State {
  allUser: User[]
  isJoined: boolean
  msgs: string[]
}

export default class CreateDataStream
  extends Component<State>
  implements IRtcEngineEventHandler
{
  rtcEngine?: IRtcEngineEx

  streamId?: number

  state: State = {
    allUser: [],
    isJoined: false,
    msgs: [],
  }

  componentDidMount() {
    this.getRtcEngine().registerEventHandler(this)
  }

  componentWillUnmount() {
    this.getRtcEngine().unregisterEventHandler(this)
    this.rtcEngine?.leaveChannel()
    this.rtcEngine?.release()
  }

  getRtcEngine() {
    if (!this.rtcEngine) {
      this.rtcEngine = createAgoraRtcEngine()
      //@ts-ignore
      window.rtcEngine = this.rtcEngine
      const res = this.rtcEngine.initialize({ appId: config.appID })
      this.rtcEngine.setLogFile(config.nativeSDKLogPath)
      console.log('initialize:', res)
    }

    return this.rtcEngine
  }

  onJoinChannelSuccess(
    { channelId, localUid }: RtcConnection,
    elapsed: number
  ): void {
    try {
      const { allUser: oldAllUser } = this.state
      const newAllUser = [...oldAllUser]
      newAllUser.push({ isMyself: true, uid: localUid })
      this.setState({
        isJoined: true,
        allUser: newAllUser,
      })
    } catch (error) {
      console.log(error)
    }
  }

  onUserJoined(
    connection: RtcConnection,
    remoteUid: number,
    elapsed: number
  ): void {
    console.log(
      'onUserJoined',
      'connection',
      connection,
      'remoteUid',
      remoteUid
    )

    const { allUser: oldAllUser } = this.state
    const newAllUser = [...oldAllUser]
    newAllUser.push({ isMyself: false, uid: remoteUid })
    this.setState({
      allUser: newAllUser,
    })
  }

  onUserOffline(
    { localUid, channelId }: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ): void {
    console.log('onUserOffline', channelId, remoteUid)

    const { allUser: oldAllUser } = this.state
    const newAllUser = [...oldAllUser.filter((obj) => obj.uid !== remoteUid)]
    this.setState({
      allUser: newAllUser,
    })
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats): void {
    this.setState({
      isJoined: false,
      allUser: [],
    })
  }

  onError(err: ErrorCodeType, msg: string): void {
    console.error(err, msg)
  }

  onStreamMessage?(
    connection: RtcConnection,
    remoteUid: number,
    streamId: number,
    data: Uint8Array,
    length: number,
    sentTs: number
  ): void {
    const string = String.fromCharCode.apply(null, data)
    const formatStr = decodeURIComponent(string)
    this.setState({
      msgs: [...this.state.msgs, `from:${remoteUid} message:${formatStr}`],
    })
    console.log('received message: ', remoteUid, streamId, data)
  }

  onStreamMessageErrorEx?(
    connection: RtcConnection,
    remoteUid: number,
    streamId: number,
    code: number,
    missed: number,
    cached: number
  ): void {
    console.log('onStreamMessageErrorEx')
  }

  getStreamId = () => {
    if (!this.streamId) {
      this.streamId = this.rtcEngine?.createDataStream({
        syncWithAudio: false,
        ordered: true,
      })
      console.log(this.streamId)
    }

    return this.streamId!
  }

  pressSendMsg = (msg: string) => {
    if (!msg) {
      return
    }
    // create the data stream
    // Each user can create up to five data streams during the lifecycle of the agoraKit
    const streamId = this.getStreamId()
    console.log('current stream id', streamId)
    const asciiStringArray = [...encodeURIComponent(msg)].map((char) =>
      char.charCodeAt(0)
    )
    this.rtcEngine?.sendStreamMessage(
      streamId,
      new Uint8Array(asciiStringArray),
      asciiStringArray.length
    )
    console.log('streamId:', this.streamId, ' content:', msg)
  }

  renderItem = ({ isMyself, uid }) => {
    return (
      <List.Item>
        <Card title={`${isMyself ? 'Local' : 'Remote'} `}>Uid: {uid}</Card>
      </List.Item>
    )
  }

  renderRightBar = () => {
    const { isJoined, msgs } = this.state

    return (
      <div className={styles.rightBarBig}>
        <div className={createDataStreamStyle.toolBarContent}>
          <div>
            <p>Received Messages:</p>
            <div className={createDataStreamStyle.msgList}>
              {msgs.map((msg, index) => (
                <div key={index} className={createDataStreamStyle.msg}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p>Send Message:</p>
            <Search
              placeholder='input msg text'
              enterButton='Send'
              size='middle'
              onSearch={this.pressSendMsg}
              disabled={!isJoined}
            />
          </div>
        </div>
        <JoinChannelBar
          onPressJoin={(channelId) => {
            this.setState({ channelId })
            this.rtcEngine?.setChannelProfile(
              ChannelProfileType.ChannelProfileLiveBroadcasting
            )

            this.rtcEngine?.setClientRole(ClientRoleType.ClientRoleBroadcaster)

            const localUid = getRandomInt(1, 9999999)
            console.log(`localUid: ${localUid}`)
            this.rtcEngine?.joinChannel('', channelId, '', localUid)
          }}
          onPressLeave={() => {
            this.getRtcEngine().leaveChannel()
          }}
        />
      </div>
    )
  }

  render() {
    const { isJoined, allUser } = this.state
    return (
      <div className={styles.screen}>
        <div className={styles.content}>
          {isJoined && (
            <List
              style={{ width: '100%' }}
              grid={{ gutter: 16, column: 4 }}
              dataSource={allUser}
              renderItem={this.renderItem}
            />
          )}
        </div>
        {this.renderRightBar()}
      </div>
    )
  }
}
