import creteAgoraRtcEngine, {
  AudioProfileType,
  AudioScenarioType,
  BackgroundBlurDegree,
  BackgroundSourceType,
  ChannelProfileType,
  DegradationPreference,
  IAudioDeviceManagerImpl,
  IRtcEngine,
  IRtcEngineEventHandlerEx,
  IRtcEngineEx,
  IVideoDeviceManagerImpl,
  MediaSourceType,
  OrientationMode,
  RtcConnection,
  RtcEngineExImplInternal,
  RtcStats,
  UserOfflineReasonType,
  VideoCodecType,
  VideoMirrorModeType,
  VideoSourceType,
  VirtualBackgroundSource,
} from '../../../../../..'
import { Button, Card, List, Switch } from 'antd'
import { Component } from 'react'
import DropDownButton from '../../component/DropDownButton'
import JoinChannelBar from '../../component/JoinChannelBar'
import Window from '../../component/Window'
import { FpsMap, ResolutionMap, RoleTypeMap } from '../../config'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { configMapToOptions, getRandomInt, getResourcePath } from '../../util'

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
  enableVirtual: boolean
  isColorMode: boolean
}
const localUid = getRandomInt(1, 9999999)

export default class VirtualBackground
  extends Component<{}, State, any>
  implements IRtcEngineEventHandlerEx
{
  rtcEngine?: IRtcEngineEx & IRtcEngine & RtcEngineExImplInternal

  videoDeviceManager: IVideoDeviceManagerImpl

  audioDeviceManager: IAudioDeviceManagerImpl

  state: State = {
    channelId: '',
    allUser: [],
    isJoined: false,
    audioRecordDevices: [],
    cameraDevices: [],
    enableVirtual: false,
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
    this.videoDeviceManager = new IVideoDeviceManagerImpl()
    this.audioDeviceManager = new IAudioDeviceManagerImpl()

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
      this.rtcEngine = creteAgoraRtcEngine()
      //@ts-ignore
      window.rtcEngine = this.rtcEngine
      const res = this.rtcEngine.initialize({
        appId: config.appID,
      })
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

  onSnapshotTaken(
    channel: string,
    uid: number,
    filePath: string,
    width: number,
    height: number,
    errCode: number
  ): void {
    console.log(
      'onSnapshotTaken',
      channel,
      uid,
      filePath,
      width,
      height,
      errCode
    )
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

    console.log(`localUid: ${localUid}`)
    this.rtcEngine?.joinChannel('', channelId, '', localUid)
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

  onPressVirtualBackground = (enableVirtual) => {
    const { isColorMode } = this.state
    const rtcEngine = this.getRtcEngine()

    rtcEngine.enableVideo()

    let virtualBackgroundSource: VirtualBackgroundSource
    if (isColorMode) {
      virtualBackgroundSource = {
        backgroundSourceType: BackgroundSourceType.BackgroundColor,
        color: 232,
        // source: 1,
        blurDegree: BackgroundBlurDegree.BlurDegreeHigh,
      }
    } else {
      virtualBackgroundSource = {
        backgroundSourceType: BackgroundSourceType.BackgroundImg,
        source: getResourcePath('background.png'),
        blurDegree: BackgroundBlurDegree.BlurDegreeHigh,
      }
    }
    this.getRtcEngine().enableVirtualBackground(
      enableVirtual,
      virtualBackgroundSource
    )

    this.setState({ enableVirtual })
  }

  renderRightBar = () => {
    const {
      audioRecordDevices,
      cameraDevices,
      isJoined,
      enableVirtual,
      isColorMode,
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
          {isJoined && (
            <>
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                {'Enable Virtual:   '}
                <Switch
                  checkedChildren='Enable'
                  unCheckedChildren='Disable'
                  defaultChecked={enableVirtual}
                  onChange={(value) => {
                    this.onPressVirtualBackground(value)
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                {'Mode:   '}
                <Switch
                  unCheckedChildren='Image'
                  checkedChildren='Color'
                  defaultChecked={isColorMode}
                  onChange={(value) => {
                    this.setState({ isColorMode: value })
                  }}
                />
              </div>
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
