import creteAgoraRtcEngine, {
  AudioProfileType,
  AudioScenarioType,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  IRtcEngineEventHandlerEx,
  IRtcEngineEx,
  RtcConnection,
  RtcEngineExImplInternal,
  RtcStats,
  UserOfflineReasonType,
  VideoSourceType,
} from '../../../../../..'
import { Button, Card, Checkbox, Input, List, message } from 'antd'
import React, { Component } from 'react'
import JoinChannelBar from '../../component/JoinChannelBar'
import Window from '../../component/Window'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { getRandomInt } from '../../util'

interface User {
  isMyself: boolean
  uid: number
}

interface State {
  isJoined: boolean
  channelId: string
  allUser: User[]
  isTranscoding: boolean
  url: string
  currentResolution?: { width: number; height: number }
}

export default class SetLiveTranscoding
  extends Component<{}, State, any>
  implements IRtcEngineEventHandlerEx
{
  rtcEngine?: IRtcEngineEx & IRtcEngine & RtcEngineExImplInternal

  state: State = {
    channelId: '',
    url: '',
    allUser: [],
    isJoined: false,
    isTranscoding: false,
  }

  componentDidMount() {
    this.getRtcEngine().registerEventHandler(this)
    this.getRtcEngine().enableVideo()
    this.getRtcEngine().enableAudio()
  }

  componentWillUnmount() {
    this.rtcEngine?.unregisterEventHandler(this)
    this.rtcEngine?.leaveChannel()
    this.rtcEngine?.release()
  }

  getRtcEngine() {
    if (!this.rtcEngine) {
      this.rtcEngine = creteAgoraRtcEngine()
      //@ts-ignore
      window.rtcEngine = this.rtcEngine
      const res = this.rtcEngine.initialize({ appId: config.appID })
      this.rtcEngine.setLogFile(config.nativeSDKLogPath)
      console.log('initialize:', res)
    }

    return this.rtcEngine
  }

  onJoinChannelSuccessEx(
    { channelId, localUid }: RtcConnection,
    elapsed: number
  ): void {
    const { allUser: oldAllUser } = this.state
    const newAllUser = [...oldAllUser]
    newAllUser.push({ isMyself: true, uid: localUid })
    this.setState({
      isJoined: true,
      allUser: newAllUser,
    })
  }

  onUserJoinedEx(
    connection: RtcConnection,
    remoteUid: number,
    elapsed: number
  ): void {
    console.log(
      'onUserJoinedEx',
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

  onUserOfflineEx(
    { localUid, channelId }: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ): void {
    console.log('onUserOfflineEx', channelId, remoteUid)

    const { allUser: oldAllUser } = this.state
    const newAllUser = [...oldAllUser.filter((obj) => obj.uid !== remoteUid)]
    this.setState({
      allUser: newAllUser,
    })
  }

  onLeaveChannelEx(connection: RtcConnection, stats: RtcStats): void {
    this.setState({
      isJoined: false,
      allUser: [],
    })
  }

  onError(err: number, msg: string): void {
    console.error(err, msg)
  }

  onPressJoinChannel = (channelId: string) => {
    this.setState({ channelId })
    this.rtcEngine?.enableAudio()
    this.rtcEngine?.enableVideo()
    this.rtcEngine?.setChannelProfile(
      ChannelProfileType.ChannelProfileLiveBroadcasting
    )
    this.rtcEngine?.setAudioProfile(
      AudioProfileType.AudioProfileDefault,
      AudioScenarioType.AudioScenarioChatroom
    )
    this.rtcEngine?.setClientRole(ClientRoleType.ClientRoleBroadcaster)

    const localUid = getRandomInt(1, 9999999)
    console.log(`localUid: ${localUid}`)
    this.rtcEngine?.joinChannel('', channelId, '', localUid)
  }

  onPressStart = () => {
    const { url, isTranscoding } = this.state
    if (!url || !url.startsWith('rtmp://') || url === 'rtmp://') {
      message.error("RTMP URL cannot be empty or not start with 'rtmp://'")
      return
    }
    let res
    if (isTranscoding) {
      const transcoding = {
        audioBitrate: 48,
        audioChannels: 1,
        audioCodecProfile: 1,
        audioSampleRate: 44100,
        backgroundColor: 12632256,
        backgroundImage: [],
        height: 720,
        lowLatency: false,
        transcodingExtraInfo: '',
        watermark: [],
        videoBitrate: 1130,
        videoCodecProfile: 100,
        videoFrameRate: 15,
        videoGop: 30,
        width: 1280,
        transcodingUsers: [],
      }
      res = this.getRtcEngine().updateRtmpTranscoding(transcoding)
      console.log('updateRtmpTranscoding', res)
      res = this.getRtcEngine().startRtmpStreamWithTranscoding(url, transcoding)
      console.log('startRtmpStreamWithTranscoding', res)
      return
    }
    res = this.getRtcEngine().startRtmpStreamWithoutTranscoding(url)
    console.log('startRtmpStreamWithoutTranscoding', res)
  }

  onPressStop = () => {
    const { url } = this.state
    const res = this.getRtcEngine().stopRtmpStream(url)
    console.log('stopRtmpStream', res)
  }

  renderRightBar = () => {
    const { isTranscoding } = this.state

    return (
      <div className={styles.rightBar}>
        <div>
          <p>rtmp</p>
          <Input
            placeholder='rtmp://'
            defaultValue='rtmp://'
            onChange={(res) => {
              this.setState({
                //@ts-ignore
                url: res.nativeEvent.target.value as string,
              })
            }}
          />
          <Checkbox
            onChange={() => {
              this.setState({ isTranscoding: !isTranscoding })
            }}
            checked={isTranscoding}
          >
            Transcoding
          </Checkbox>
          <br />
          <Button onClick={this.onPressStart}>Start Rtmp Stream</Button>
          <br />
          <Button onClick={this.onPressStart}>Stop Rtmp Stream</Button>
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
    const videoSourceType = isMyself
      ? VideoSourceType.VideoSourceCameraPrimary
      : VideoSourceType.VideoSourceRemote
    return (
      <List.Item>
        <Card title={`${isMyself ? 'Local' : 'Remote'} Uid: ${uid}`}>
          <Window
            uid={uid}
            rtcEngine={this.rtcEngine!}
            videoSourceType={videoSourceType}
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
