import { Button, Card, Divider, List, Switch } from 'antd'
import createAgoraRtcEngine, {
  AudioProfileType,
  AudioScenarioType,
  ChannelProfileType,
  ErrorCodeType,
  IAudioDeviceManager,
  IRtcEngine,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  RtcConnection,
  RtcEngineExImplInternal,
  RtcStats,
  UserOfflineReasonType,
} from 'electron-agora-rtc-ng'
import { Component } from 'react'
import DropDownButton from '../../component/DropDownButton'
import JoinChannelBar from '../../component/JoinChannelBar'
import SliderBar from '../../component/SliderBar'
import { AudioProfileList, AudioScenarioList } from '../../config'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { configMapToOptions, getRandomInt, getResourcePath } from '../../util'

const EFFECT_ID = 1
const mp3Path = getResourcePath('audioEffect.mp3')
interface User {
  isMyself: boolean
  uid: number
}

interface Device {
  deviceName: string
  deviceId: string
}
interface State {
  audioRecordDevices: Device[]
  audioProfile: number
  audioScenario: number
  allUser: User[]
  isJoined: boolean
  effectCount: number
  effectPitch: number
  effectPan: number
  effectGain: number
  effectPublish: boolean
}

export default class AudioMixing
  extends Component<{}, State, any>
  implements IRtcEngineEventHandler
{
  rtcEngine?: IRtcEngineEx

  audioDeviceManager: IAudioDeviceManager

  state: State = {
    audioRecordDevices: [],
    audioProfile: AudioProfileList.SpeechStandard,
    audioScenario: AudioScenarioList.Standard,
    allUser: [],
    isJoined: false,
    effectCount: -1,
    effectPitch: 1,
    effectPan: 0,
    effectGain: 100,
    effectPublish: true,
  }

  componentDidMount() {
    this.getRtcEngine().registerEventHandler(this)
    this.audioDeviceManager = this.getRtcEngine().getAudioDeviceManager()

    this.setState({
      audioRecordDevices:
        this.audioDeviceManager.enumerateRecordingDevices() as any,
    })
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

  setAudioProfile = () => {
    const { audioProfile, audioScenario } = this.state
    this.rtcEngine?.setAudioProfile(audioProfile, audioScenario)
  }

  renderItem = ({ isMyself, uid }: User) => {
    return (
      <List.Item>
        <Card title={`${isMyself ? 'Local' : 'Remote'} `}>Uid: {uid}</Card>
      </List.Item>
    )
  }

  renderRightBar = () => {
    const { audioRecordDevices } = this.state
    return (
      <div className={styles.rightBar} style={{ width: '60%' }}>
        <div style={{ overflow: 'auto' }}>
          <DropDownButton
            options={configMapToOptions(AudioProfileList)}
            onPress={(res) =>
              this.setState({ audioProfile: res.dropId }, this.setAudioProfile)
            }
            title='Audio Profile'
          />
          <DropDownButton
            options={configMapToOptions(AudioScenarioList)}
            onPress={(res) =>
              this.setState({ audioScenario: res.dropId }, this.setAudioProfile)
            }
            title='Audio Scenario'
          />
          <DropDownButton
            title='Microphone'
            options={audioRecordDevices.map((obj) => {
              const { deviceId, deviceName } = obj
              return {
                dropId: deviceId,
                dropText: deviceName,
                ...obj,
              }
            })}
            onPress={(res) => {
              this.audioDeviceManager.setRecordingDevice(res.dropId)
            }}
          />

          <Divider>Audio Mixing</Divider>
          <Button
            htmlType='button'
            onClick={() => {
              this.getRtcEngine().startAudioMixing(mp3Path, true, false, -1)
            }}
          >
            Start Audio Mixing
          </Button>
          <Button
            htmlType='button'
            onClick={() => {
              this.getRtcEngine().stopAudioMixing()
            }}
          >
            Stop Audio Mixing
          </Button>
          <SliderBar
            max={100}
            title='Mixing Volume'
            onChange={(value) => {
              this.rtcEngine?.adjustAudioMixingVolume(value)
            }}
          />
          <SliderBar
            max={100}
            title='Mixing Playback Volume'
            onChange={(value) => {
              this.rtcEngine?.adjustAudioMixingPlayoutVolume(value)
            }}
          />
          <SliderBar
            max={100}
            title='Mixing Publish Volume'
            onChange={(value) => {
              this.rtcEngine?.adjustAudioMixingPublishVolume(value)
            }}
          />

          <Divider>Audio Effect Controls</Divider>

          <SliderBar
            max={1}
            min={-1}
            value={-1}
            step={1}
            title='Effect Count'
            onChange={(value) => {
              this.setState({ effectCount: value })
            }}
          />
          <SliderBar
            max={2.0}
            min={0.5}
            value={1}
            step={0.1}
            title='Effect Pitch'
            onChange={(value) => {
              this.setState({ effectPitch: value })
            }}
          />
          <SliderBar
            max={1}
            min={-1}
            value={0}
            step={1}
            title='Effect Pan'
            onChange={(value) => {
              this.setState({ effectPan: value })
            }}
          />
          <SliderBar
            max={100}
            min={0}
            value={100}
            step={1}
            title='Effect Gain'
            onChange={(value) => {
              this.setState({ effectGain: value })
            }}
          />
          <br></br>
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            {'Enable publish:   '}
            <Switch
              checkedChildren='Enable'
              unCheckedChildren='Disable'
              defaultChecked={false}
              onChange={(value) => {
                this.setState({ effectPublish: value })
              }}
            />
          </div>
          <br></br>
          <Button
            htmlType='button'
            onClick={() => {
              const {
                effectCount,
                effectGain,
                effectPan,
                effectPitch,
                effectPublish,
              } = this.state

              //  loopCount: number, pitch: number, pan: number, gain
              this.getRtcEngine().playEffect(
                EFFECT_ID,
                mp3Path,
                effectCount,
                effectPitch,
                effectPan,
                effectGain,
                effectPublish,
                0
              )
            }}
          >
            Play
          </Button>
          <Button
            htmlType='button'
            onClick={() => {
              this.getRtcEngine().resumeEffect(EFFECT_ID)
            }}
          >
            Resume
          </Button>
          <Button
            htmlType='button'
            onClick={() => {
              this.getRtcEngine().pauseEffect(EFFECT_ID)
            }}
          >
            Pause
          </Button>
          <Button
            htmlType='button'
            onClick={() => {
              this.getRtcEngine().stopEffect(EFFECT_ID)
            }}
          >
            Stop
          </Button>
          <br></br>
          <br></br>
          <SliderBar
            max={100}
            title='Effect Volume'
            onChange={(value) => {
              this.getRtcEngine().setEffectsVolume(value)
            }}
          />
          <SliderBar
            max={100}
            title='Loopback Recording Volume'
            onChange={(value) => {
              this.rtcEngine?.adjustLoopbackRecordingVolume(value)
            }}
          />
          <br></br>

          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            {'Enable LoopBack Recording:   '}
            <Switch
              checkedChildren='Enable'
              unCheckedChildren='Disable'
              defaultChecked={false}
              onChange={(value) => {
                this.getRtcEngine().enableLoopbackRecording(value)
              }}
            />
          </div>
        </div>
        <JoinChannelBar
          onPressJoin={(channelId: string) => {
            this.getRtcEngine().enableAudio()
            this.rtcEngine?.setChannelProfile(
              ChannelProfileType.ChannelProfileLiveBroadcasting
            )
            this.rtcEngine?.setAudioProfile(
              AudioProfileType.AudioProfileDefault,
              AudioScenarioType.AudioScenarioChatroom
            )

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
