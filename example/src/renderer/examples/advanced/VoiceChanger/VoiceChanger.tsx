import { Card, List } from 'antd'
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
import {
  AudioEffectMap,
  EqualizationReverbMap,
  VoiceBeautifierMap,
} from '../../config'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { configMapToOptions, getRandomInt } from '../../util'

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
  audioEffectMode: number
  equalizationReverbConfig: {
    min: number
    max: number
    defaultValue: number
    audioReverbType: number
    title: string
  }
  allUser: User[]
  isJoined: boolean
  pitchCorrectionParam1: number
  pitchCorrectionParam2: number
}

export default class VoiceChanger
  extends Component<{}, State, any>
  implements IRtcEngineEventHandler
{
  rtcEngine?: IRtcEngineEx

  audioDeviceManager: IAudioDeviceManager

  state: State = {
    audioRecordDevices: [],
    audioEffectMode: AudioEffectMap.AUDIO_EFFECT_OFF,
    equalizationReverbConfig: EqualizationReverbMap['Dry Level'],
    allUser: [],
    isJoined: false,
    pitchCorrectionParam1: 1,
    pitchCorrectionParam2: 1,
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

  onUserJoinedEx(
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

  onUserOfflineEx(
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

  setAudioEffectParameters = () => {
    const { pitchCorrectionParam2, pitchCorrectionParam1 } = this.state
    this.getRtcEngine().setAudioEffectParameters(
      AudioEffectMap.PITCH_CORRECTION,
      pitchCorrectionParam1,
      pitchCorrectionParam2
    )
  }

  renderItem = ({ isMyself, uid }: User) => {
    return (
      <List.Item>
        <Card title={`${isMyself ? 'Local' : 'Remote'} `}>Uid: {uid}</Card>
      </List.Item>
    )
  }

  renderRightBar = () => {
    const { audioRecordDevices, audioEffectMode, equalizationReverbConfig } =
      this.state

    return (
      <div className={styles.rightBar}>
        <div>
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
            title='Voice Beautifier'
            options={configMapToOptions(VoiceBeautifierMap)}
            onPress={(res) => {
              this.rtcEngine?.setVoiceBeautifierPreset(res.dropId)
            }}
          />
          <DropDownButton
            title='Audio Effect'
            options={configMapToOptions(AudioEffectMap)}
            onPress={(res) => {
              const mode = res.dropId
              this.setState({ audioEffectMode: mode })
              this.rtcEngine?.setAudioEffectPreset(mode)
            }}
          />
          {AudioEffectMap.PITCH_CORRECTION === audioEffectMode && (
            <>
              <SliderBar
                max={3}
                min={1}
                title='PitchCorrection Param 1'
                onChange={(value) => {
                  this.setState(
                    { pitchCorrectionParam1: value },
                    this.setAudioEffectParameters
                  )
                  this.rtcEngine?.adjustRecordingSignalVolume(value)
                }}
              />
              <SliderBar
                max={12}
                min={1}
                title='PitchCorrection Param 2'
                onChange={(value) => {
                  this.setState(
                    { pitchCorrectionParam2: value },
                    this.setAudioEffectParameters
                  )
                }}
              />
            </>
          )}
          <DropDownButton
            title='Equalization Reverb'
            options={configMapToOptions(EqualizationReverbMap)}
            onPress={(res) => {
              this.setState({ equalizationReverbConfig: res.dropId })
            }}
          />
          <SliderBar
            max={equalizationReverbConfig.max}
            min={equalizationReverbConfig.min}
            value={equalizationReverbConfig.defaultValue}
            step={1}
            title={equalizationReverbConfig.title}
            onChange={(value) => {
              this.getRtcEngine().setLocalVoiceReverb(
                equalizationReverbConfig.audioReverbType,
                value
              )
            }}
          />

          <SliderBar
            max={2.0}
            min={0.5}
            step={0.01}
            title='Voice Pitch'
            onChange={(value) => {
              this.getRtcEngine().setLocalVoicePitch(value)
            }}
          />
          <SliderBar
            max={15}
            min={-15}
            step={1}
            title='Equalization Band 31Hz'
            onChange={(value) => {
              // enum AUDIO_EQUALIZATION_BAND_FREQUENCY {
              //   /** 0: 31 Hz */
              //   AUDIO_EQUALIZATION_BAND_31 = 0,
              //   /** 1: 62 Hz */
              //   AUDIO_EQUALIZATION_BAND_62 = 1,
              //   /** 2: 125 Hz */
              //   AUDIO_EQUALIZATION_BAND_125 = 2,
              //   /** 3: 250 Hz */
              //   AUDIO_EQUALIZATION_BAND_250 = 3,
              //   /** 4: 500 Hz */
              //   AUDIO_EQUALIZATION_BAND_500 = 4,
              //   /** 5: 1 kHz */
              //   AUDIO_EQUALIZATION_BAND_1K = 5,
              //   /** 6: 2 kHz */
              //   AUDIO_EQUALIZATION_BAND_2K = 6,
              //   /** 7: 4 kHz */
              //   AUDIO_EQUALIZATION_BAND_4K = 7,
              //   /** 8: 8 kHz */
              //   AUDIO_EQUALIZATION_BAND_8K = 8,
              //   /** 9: 16 kHz */
              //   AUDIO_EQUALIZATION_BAND_16K = 9,
              // };
              this.getRtcEngine().setLocalVoiceEqualization(0, value)
            }}
          />
        </div>
        <JoinChannelBar
          onPressJoin={(channelId: string) => {
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
