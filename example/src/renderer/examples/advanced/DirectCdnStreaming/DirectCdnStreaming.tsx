import { Card, Input, List } from 'antd'
import createAgoraRtcEngine, {
  AudioProfileType,
  AudioScenarioType,
  ChannelProfileType,
  DegradationPreference,
  DirectCdnStreamingError,
  DirectCdnStreamingState,
  DirectCdnStreamingStats,
  ErrorCodeType,
  IAudioDeviceManager,
  IDirectCdnStreamingEventHandler,
  IRtcEngine,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  IVideoDeviceManager,
  MediaSourceType,
  OrientationMode,
  RtcConnection,
  RtcEngineExImplInternal,
  RtcStats,
  UserOfflineReasonType,
  VideoCodecType,
  VideoMirrorModeType,
  VideoSourceType,
} from 'electron-agora-rtc-ng'
import { Component } from 'react'
import DropDownButton from '../../component/DropDownButton'
import JoinChannelBar from '../../component/JoinChannelBar'
import Window from '../../component/Window'
import { FpsMap, ResolutionMap, RoleTypeMap } from '../../config'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { configMapToOptions, getRandomInt } from '../../util'
import './DirectCdnStreaming.scss'

const { Search } = Input

interface Device {
  deviceId: string
  deviceName: string
}

interface User {
  isMyself: boolean
  uid: number
}

interface State {
  isJoined: boolean
  channelId: string
  allUser: User[]
  audioRecordDevices: Device[]
  cameraDevices: Device[]
  currentFps?: number
  currentResolution?: { width: number; height: number }
  cdnResult: string
  isStartCDN: boolean
  publishUrl: string
}

export default class DirectCdnStreaming
  extends Component<{}, State, any>
  implements IRtcEngineEventHandler, IDirectCdnStreamingEventHandler
{
  rtcEngine?: IRtcEngineEx

  videoDeviceManager: IVideoDeviceManager

  audioDeviceManager: IAudioDeviceManager

  state: State = {
    channelId: '',
    allUser: [],
    isJoined: false,
    audioRecordDevices: [],
    cameraDevices: [],
    cdnResult: '',
    isStartCDN: false,
    publishUrl:
      'rtmp://vid-218.push.chinanetcenter.broadcastapp.agora.io/live/test',
  }

  componentDidMount() {
    const rtcEngine = this.getRtcEngine()
    let res = rtcEngine.enableExtension(
      'agora_segmentation',
      'PortraitSegmentation',
      true,
      MediaSourceType.PrimaryCameraSource
    )
    console.log('enableExtension', res)

    this.getRtcEngine().registerEventHandler(this)
    this.videoDeviceManager = this.getRtcEngine().getVideoDeviceManager()
    this.audioDeviceManager = this.getRtcEngine().getAudioDeviceManager()

    this.setState({
      audioRecordDevices:
        this.audioDeviceManager.enumerateRecordingDevices() as any,
      cameraDevices: this.videoDeviceManager.enumerateVideoDevices() as any,
    })
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
      const res = this.rtcEngine.initialize({
        appId: config.appID,
      })
      console.log('initialize:', res)
    }

    return this.rtcEngine
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
    this.rtcEngine.enableAudio()
    this.rtcEngine.enableVideo()
    this.rtcEngine?.setChannelProfile(
      ChannelProfileType.ChannelProfileLiveBroadcasting
    )
    this.rtcEngine?.setAudioProfile(
      AudioProfileType.AudioProfileDefault,
      AudioScenarioType.AudioScenarioChatroom
    )

    this.rtcEngine?.joinChannel('', channelId, '', getRandomInt(1, 9999999))
  }

  setVideoConfig = () => {
    const { currentFps, currentResolution } = this.state
    if (!currentResolution || !currentFps) {
      return
    }

    this.getRtcEngine().setVideoEncoderConfiguration({
      codecType: VideoCodecType.VideoCodecH264,
      dimensions: currentResolution!,
      frameRate: currentFps,
      bitrate: 65,
      minBitrate: 1,
      orientationMode: OrientationMode.OrientationModeAdaptive,
      degradationPreference: DegradationPreference.MaintainBalanced,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeAuto,
    })
  }

  onDirectCdnStreamingStateChanged = (
    state: DirectCdnStreamingState,
    error: DirectCdnStreamingError,
    message: string
  ) => {
    console.log('onDirectCdnStreamingStateChanged', state, error, message)

    let cdnResult = ''
    switch (state) {
      case DirectCdnStreamingState.DirectCdnStreamingStateIdle:
        cdnResult = 'Idle'
        break
      case DirectCdnStreamingState.DirectCdnStreamingStateRunning:
        cdnResult = 'Running'
        break
      case DirectCdnStreamingState.DirectCdnStreamingStateStopped:
        cdnResult = 'Stopped'
        break
      case DirectCdnStreamingState.DirectCdnStreamingStateFailed:
        cdnResult = 'Failed'
        break
      case DirectCdnStreamingState.DirectCdnStreamingStateRecovering:
        cdnResult = 'Recovering'
        break
      default:
        break
    }
    this.setState({ cdnResult })
  }

  onDirectCdnStreamingStats = (stats: DirectCdnStreamingStats) => {
    console.log('onDirectCdnStreamingStats', stats)
  }

  onPressStartOrStop = (publishUrl) => {
    const { currentFps, currentResolution, isStartCDN } = this.state
    const rtcEngine = this.getRtcEngine()
    let res
    if (!isStartCDN) {
      rtcEngine.setDirectCdnStreamingVideoConfiguration({
        codecType: VideoCodecType.VideoCodecAv1,
        dimensions: currentResolution,
        frameRate: currentFps,
        bitrate: 500,
        minBitrate: 1,
        orientationMode: OrientationMode.OrientationModeAdaptive,
        degradationPreference: DegradationPreference.MaintainBalanced,
        mirrorMode: VideoMirrorModeType.VideoMirrorModeAuto,
      })
      res = rtcEngine.startDirectCdnStreaming(this, publishUrl, {
        publishCameraTrack: true,
        publishMicrophoneTrack: false,
        publishCustomAudioTrack: false,
        publishCustomVideoTrack: false,
        publishMediaPlayerAudioTrack: false,
      })
      console.log('startDirectCdnStreaming', '\nres:', res)
    } else {
      res = rtcEngine.stopDirectCdnStreaming()
      console.log('stopDirectCdnStreaming', '\nres:', res)
    }
    this.setState({ isStartCDN: !isStartCDN, publishUrl })
  }

  renderRightBar = () => {
    const {
      audioRecordDevices,
      cameraDevices,
      isJoined,
      cdnResult,
      isStartCDN,
      publishUrl,
    } = this.state

    return (
      <div className={styles.rightBar}>
        <div>
          <DropDownButton
            options={cameraDevices.map((obj) => {
              const { deviceId, deviceName } = obj
              return { dropId: deviceId, dropText: deviceName, ...obj }
            })}
            onPress={(res) => {
              this.videoDeviceManager.setDevice(res.dropId)
            }}
            title='Camera'
          />
          <DropDownButton
            title='Microphone'
            options={audioRecordDevices.map((obj) => {
              const { deviceId, deviceName } = obj
              return { dropId: deviceId, dropText: deviceName, ...obj }
            })}
            onPress={(res) => {
              this.audioDeviceManager.setRecordingDevice(res.dropId)
            }}
          />
          <DropDownButton
            title='Role'
            options={configMapToOptions(RoleTypeMap)}
            onPress={(res) => {
              this.getRtcEngine().setClientRole(res.dropId)
            }}
          />
          <DropDownButton
            title='Resolution'
            options={configMapToOptions(ResolutionMap)}
            onPress={(res) => {
              this.setState(
                { currentResolution: res.dropId },
                this.setVideoConfig
              )
            }}
          />
          <DropDownButton
            title='FPS'
            options={configMapToOptions(FpsMap)}
            onPress={(res) => {
              this.setState({ currentFps: res.dropId }, this.setVideoConfig)
            }}
          />
          <br />
          <Search
            placeholder='publishUrl'
            allowClear
            defaultValue={publishUrl}
            enterButton={!isStartCDN ? 'Start CDN' : 'Stop CDN'}
            size='small'
            onSearch={this.onPressStartOrStop}
          />

          {isStartCDN && (
            <>
              <p>{'Result: ' + cdnResult.replace('push', 'pull')}</p>
              <pre>ffplay {publishUrl}</pre>
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
