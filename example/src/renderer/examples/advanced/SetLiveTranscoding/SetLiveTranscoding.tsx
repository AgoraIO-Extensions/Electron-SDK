import { Button, Card, Input, List, message } from 'antd'
import createAgoraRtcEngine, {
  AudioCodecProfileType,
  AudioProfileType,
  AudioSampleRateType,
  AudioScenarioType,
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IRtcEngine,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  LiveTranscoding,
  RtcConnection,
  RtcEngineExImplInternal,
  RtcStats,
  RtmpStreamPublishErrorType,
  RtmpStreamPublishState,
  UserOfflineReasonType,
  VideoCodecProfileType,
  VideoSourceType,
} from 'electron-agora-rtc-ng'
import { Component } from 'react'
import JoinChannelBar from '../../component/JoinChannelBar'
import Window from '../../component/Window'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { getRandomInt } from '../../util'

const localUid1 = getRandomInt(1, 9999999)
interface User {
  isMyself: boolean
  uid: number
}

interface State {
  isJoined: boolean
  channelId: string
  allUser: User[]
  url: string
  rtmpUrl: string
  isRtmping: boolean
  rtmpResult: string
}

export default class SetLiveTranscoding
  extends Component<{}, State, any>
  implements IRtcEngineEventHandler
{
  rtcEngine?: IRtcEngineEx

  state: State = {
    channelId: '',
    url: '',
    allUser: [],
    isJoined: false,
    rtmpUrl:
      'rtmp://vid-218.push.chinanetcenter.broadcastapp.agora.io/live/test',
    isRtmping: false,
    rtmpResult: '',
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
      this.rtcEngine = createAgoraRtcEngine()
      //@ts-ignore
      window.rtcEngine = this.rtcEngine
      const res = this.rtcEngine.initialize({ appId: config.appID })
      this.rtcEngine.setLogFile(config.nativeSDKLogPath)
      console.log('initialize:', res)
    }

    return this.rtcEngine
  }

  onRtmpStreamingStateChanged(
    url: string,
    state: RtmpStreamPublishState,
    errCode: RtmpStreamPublishErrorType
  ): void {
    let stateStr: string
    switch (state) {
      case RtmpStreamPublishState.RtmpStreamPublishStateIdle:
        stateStr = 'Idle'
        break
      case RtmpStreamPublishState.RtmpStreamPublishStateConnecting:
        stateStr = 'Connecting'
        break
      case RtmpStreamPublishState.RtmpStreamPublishStateRunning:
        stateStr = 'Running'
        break
      case RtmpStreamPublishState.RtmpStreamPublishStateRecovering:
        stateStr = 'Recovering'
        break
      case RtmpStreamPublishState.RtmpStreamPublishStateRecovering:
        stateStr = 'Recovering'
        break
      case RtmpStreamPublishState.RtmpStreamPublishStateFailure:
        stateStr = 'Failure'
        break
      case RtmpStreamPublishState.RtmpStreamPublishStateDisconnecting:
        stateStr = 'Disconnecting'
        break

      default:
        break
    }
    this.setState({ rtmpResult: stateStr })
    console.log(
      `onRtmpStreamingStateChanged url:${url} publishState:${stateStr} errCode:${errCode}`
    )
  }

  onJoinChannelSuccess(
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

    console.log(`localUid: ${localUid1}`)
    this.rtcEngine?.joinChannel('', channelId, '', localUid1)
  }

  onPressRTMP = () => {
    const { rtmpUrl, isRtmping } = this.state
    let res
    if (isRtmping) {
      res = this.getRtcEngine().stopRtmpStream(rtmpUrl)
      console.log('stopRtmpStream', res)
    } else {
      if (!rtmpUrl || !rtmpUrl.startsWith('rtmp://') || rtmpUrl === 'rtmp://') {
        message.error("RTMP URL cannot be empty or not start with 'rtmp://'")
        return
      }

      const transcoding: LiveTranscoding = {
        transcodingUsers: [
          {
            uid: 0,
            x: 0,
            y: 0,
            width: 360,
            height: 640,
            zOrder: 0,
            alpha: 1,
            audioChannel: 0,
          },
        ],
        userCount: 1,
        width: 1080,
        height: 720,
        videoBitrate: 400,
        videoCodecProfile: VideoCodecProfileType.VideoCodecProfileHigh,
        videoGop: 30,
        videoFramerate: 15,
        lowLatency: false,
        audioSampleRate: AudioSampleRateType.AudioSampleRate44100,
        audioBitrate: 48,
        audioChannels: 1,
        audioCodecProfile: AudioCodecProfileType.AudioCodecProfileLcAac,
      }

      res = this.getRtcEngine().startRtmpStreamWithTranscoding(
        rtmpUrl,
        transcoding
      )
      console.log('startRtmpStreamWithTranscoding', res)
    }
    this.setState({ isRtmping: !isRtmping })
  }

  renderRightBar = () => {
    const { rtmpUrl, isRtmping, isJoined, rtmpResult } = this.state

    return (
      <div className={styles.rightBar}>
        <div>
          {isJoined && (
            <>
              <p>rtmp</p>
              <Input
                placeholder='rtmp://'
                defaultValue={rtmpUrl}
                onChange={(res) => {
                  this.setState({
                    //@ts-ignore
                    rtmpUrl: res.nativeEvent.target.value as string,
                  })
                }}
              />

              <br />
              <Button onClick={this.onPressRTMP}>
                {!isRtmping ? 'Start' : 'Stop'} Rtmp Stream
              </Button>
              {isRtmping && (
                <>
                  <p>{'Result: ' + rtmpResult}</p>
                  <pre>ffplay {rtmpUrl.replace('push', 'pull')}</pre>
                </>
              )}
            </>
          )}
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
