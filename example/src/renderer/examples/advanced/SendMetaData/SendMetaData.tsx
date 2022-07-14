import { Card, Input, List } from 'antd'
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IMetadataObserver,
  IRtcEngine,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  Metadata,
  MetadataType,
  RtcConnection,
  RtcEngineExImplInternal,
  RtcStats,
  UserOfflineReasonType,
  VideoSourceType,
} from 'electron-agora-rtc-ng'
import { Component } from 'react'
import JoinChannelBar from '../../component/JoinChannelBar'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { getRandomInt } from '../../util'
import sendMetaDataStyle from './SendMetaData.scss'
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

const localUid = getRandomInt(1, 9999999)

export default class SendMetaData
  extends Component<State>
  implements IRtcEngineEventHandler, IMetadataObserver
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
    this.getRtcEngine().registerMediaMetadataObserver(
      this,
      MetadataType.VideoMetadata
    )
  }

  componentWillUnmount() {
    this.getRtcEngine().unregisterMediaMetadataObserver(
      this,
      MetadataType.VideoMetadata
    )
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

  onMetadataReceived?({ uid, size, buffer, timeStampMs }: Metadata): void {
    console.log('onMetadataReceived', uid, size, buffer, timeStampMs)
    const string = String.fromCharCode.apply(null, buffer)
    const formatStr = decodeURIComponent(string)
    this.setState({
      msgs: [...this.state.msgs, `from:${uid} message:${formatStr}`],
    })
  }

  pressSendMetaData = (msg: string) => {
    if (!msg) {
      return
    }
    const asciiStringArray = [...encodeURIComponent(msg)].map((char) =>
      char.charCodeAt(0)
    )
    this.rtcEngine?.sendMetaData(
      {
        uid: localUid,
        size: asciiStringArray.length,
        buffer: new Uint8Array(asciiStringArray),
      },
      VideoSourceType.VideoSourceCamera
    )
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
        <div className={sendMetaDataStyle.toolBarContent}>
          <div>
            <p>Received MetaData:</p>
            <div className={sendMetaDataStyle.msgList}>
              {msgs.map((msg, index) => (
                <div key={index} className={sendMetaDataStyle.msg}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p>Send Meta Data:</p>
            <Search
              placeholder='input meta data'
              enterButton='Send'
              size='middle'
              onSearch={this.pressSendMetaData}
              disabled={!isJoined}
            />
          </div>
        </div>
        <JoinChannelBar
          onPressJoin={(channelId) => {
            this.setState({ channelId })
            this.rtcEngine.enableVideo()
            this.rtcEngine?.setChannelProfile(
              ChannelProfileType.ChannelProfileLiveBroadcasting
            )

            this.rtcEngine?.setClientRole(ClientRoleType.ClientRoleBroadcaster)

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
