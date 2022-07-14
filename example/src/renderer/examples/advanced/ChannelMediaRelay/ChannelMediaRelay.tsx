import { Card, Input, List } from 'antd'
import createAgoraRtcEngine, {
  AudioProfileType,
  AudioScenarioType,
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
  VideoSourceType,
} from 'electron-agora-rtc-ng'
import { Component } from 'react'
import JoinChannelBar from '../../component/JoinChannelBar'
import Window from '../../component/Window'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { getRandomInt } from '../../util'
const { Search } = Input

interface User {
  isMyself: boolean
  uid: number
}

interface State {
  isJoined: boolean
  isRelaying: boolean
  channelId: string
  allUser: User[]
  currentFps?: number
  currentResolution?: { width: number; height: number }
  relayChannelName: string
}

export default class ChannelMediaRelay
  extends Component<{}, State, any>
  implements IRtcEngineEventHandler
{
  rtcEngine?: IRtcEngineEx

  state: State = {
    channelId: '',
    allUser: [],
    isJoined: false,
    isRelaying: false,
    relayChannelName: 'testRelay',
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
    console.log(
      `onJoinChannelSuccessEx channelId:${channelId} localUid:${localUid}`
    )
    const { allUser: oldAllUser } = this.state
    const newAllUser = [...oldAllUser]
    newAllUser.push({ isMyself: true, uid: localUid })
    this.setState({
      isJoined: true,
      allUser: newAllUser,
    })
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

  onChannelMediaRelayEvent(code: number): void {
    console.log('onChannelMediaRelayEvent', code)
  }

  onChannelMediaRelayStateChanged(state: number, code: number): void {
    console.log(`onChannelMediaRelayStateChanged state:${state}, code${code}`)
  }

  onPressJoinChannel = (channelId: string) => {
    this.setState({ channelId })
    this.getRtcEngine().enableVideo()
    this.getRtcEngine().enableAudio()
    this.rtcEngine?.setChannelProfile(
      ChannelProfileType.ChannelProfileLiveBroadcasting
    )
    this.rtcEngine?.setAudioProfile(
      AudioProfileType.AudioProfileDefault,
      AudioScenarioType.AudioScenarioChatroom
    )
    this.rtcEngine?.setClientRole(ClientRoleType.ClientRoleBroadcaster)

    this.rtcEngine?.enableVideo()

    const localUid = getRandomInt(1, 9999999)
    console.log(`localUid: ${localUid}`)
    this.rtcEngine?.joinChannel('', channelId, '', localUid)
  }

  onPressChannelRelay = (relayChannelName: string) => {
    const { isRelaying } = this.state
    if (isRelaying) {
      this.getRtcEngine().stopChannelMediaRelay()
    } else {
      if (!relayChannelName) {
        return
      }
      const { channelId } = this.state

      this.getRtcEngine().startChannelMediaRelay({
        srcInfo: {
          channelName: channelId,
          token: config.token,
          uid: 0,
        },
        destInfos: [
          {
            channelName: relayChannelName,
            token: config.token,
            uid: 0,
          },
        ],
        destCount: 1,
      })
    }
    this.setState({ isRelaying: !isRelaying })
  }

  renderRightBar = () => {
    const { isJoined, isRelaying, relayChannelName } = this.state

    return (
      <div className={styles.rightBar}>
        <div>
          <p>Relay Channel:</p>
          <Search
            placeholder='ChannelName'
            allowClear
            enterButton={!isRelaying ? 'Start Relay' : 'Stop Relay'}
            size='small'
            defaultValue={relayChannelName}
            disabled={!isJoined}
            onSearch={this.onPressChannelRelay}
          />
        </div>
        <JoinChannelBar
          onPressJoin={this.onPressJoinChannel}
          onPressLeave={() => {
            this.rtcEngine?.leaveChannel()
          }}
        />
      </div>
    )
  }

  renderItem = ({ isMyself, uid }: User) => {
    const { channelId } = this.state
    return (
      <List.Item>
        <Card title={`${isMyself ? 'Local' : 'Remote'} Uid: ${uid}`}>
          <Window
            uid={uid}
            rtcEngine={this.rtcEngine!}
            videoSourceType={VideoSourceType.VideoSourceCameraPrimary}
            channelId={channelId}
          />
        </Card>
      </List.Item>
    )
  }

  render() {
    const { isJoined, allUser } = this.state
    return (
      <div className={styles.screen}>
        <div className={styles.content}>
          {isJoined && (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 2,
              }}
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
