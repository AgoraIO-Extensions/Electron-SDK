import { Card, Input, List, Switch } from 'antd'
import createAgoraRtcEngine, {
  ClientRoleType,
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

const { Search } = Input

interface User {
  isMyself: boolean
  uid: number
}

interface Device {
  deviceId: string
  deviceName: string
}
interface State {
  audioRecordDevices: Device[]
  audioProfile: number
  audioScenario: number
  allUser: User[]
  isJoined: boolean
  beatsPerMeasure: number
  beatsPerMinute: number
  file1: string
  file2: string
  enableRhythm: boolean
}

export default class RhythmPlayer
  extends Component<State>
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
    beatsPerMeasure: 4,
    beatsPerMinute: 60,
    file1: getResourcePath('dang.mp3'),
    file2: getResourcePath('ding.mp3'),
    enableRhythm: false,
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

  onPressRhythmPlayer = (enableRhythm) => {
    this.setState({ enableRhythm })
    if (enableRhythm) {
      const { beatsPerMeasure, beatsPerMinute, file1, file2 } = this.state
      const res = this.getRtcEngine().startRhythmPlayer(file1, file2, {
        beatsPerMeasure,
        beatsPerMinute,
      })
      console.log('startRhythmPlayer\nres:', res)
    } else {
      this.getRtcEngine().stopRhythmPlayer()
    }
  }

  renderItem = ({ isMyself, uid }) => {
    return (
      <List.Item>
        <Card title={`${isMyself ? 'Local' : 'Remote'} `}>Uid: {uid}</Card>
      </List.Item>
    )
  }

  renderRightBar = () => {
    const {
      audioRecordDevices: audioDevices,
      file1,
      file2,
      enableRhythm,
      beatsPerMeasure,
      beatsPerMinute,
    } = this.state
    return (
      <div className={styles.rightBar}>
        <div>
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
            options={audioDevices.map((obj) => {
              const { deviceId, deviceName } = obj
              return { dropId: deviceId, dropText: deviceName, ...obj }
            })}
            onPress={(res) => {
              this.audioDeviceManager.setRecordingDevice(res.dropId)
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
            {'RhythmPlayer:   '}
            <Switch
              checkedChildren='Enable'
              unCheckedChildren='Disable'
              defaultChecked={enableRhythm}
              onChange={this.onPressRhythmPlayer}
            />
          </div>
          <br></br>
          {!enableRhythm && (
            <>
              <Search
                placeholder={'please input path or url'}
                defaultValue={file1}
                allowClear
                enterButton={'File1'}
                size='small'
                onChange={(value) => {
                  this.setState({ file1: value })
                }}
              />
              <br />
              <Search
                placeholder={'please input path or url'}
                defaultValue={file2}
                allowClear
                enterButton={'File2'}
                size='small'
                onChange={(value) => {
                  this.setState({ file2: value })
                }}
              />
              <br />

              <SliderBar
                max={9}
                min={1}
                value={beatsPerMeasure}
                step={1}
                title='Beats Per Measure'
                onChange={(value) => {
                  this.setState({
                    beatsPerMeasure: value,
                  })
                }}
              />
              <SliderBar
                max={360}
                min={60}
                value={beatsPerMinute}
                step={1}
                title='Beats Per Minute'
                onChange={(value) => {
                  this.setState({
                    beatsPerMinute: value,
                  })
                }}
              />
            </>
          )}
        </div>
        <JoinChannelBar
          onPressJoin={(channelId) => {
            const rtcEngine = this.getRtcEngine()

            rtcEngine.disableVideo()
            rtcEngine.enableAudio()
            rtcEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster)
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
