import createAgoraRtcEngine, {
  ClientRoleType,
  IMediaPlayer,
  IMediaPlayerSourceObserver,
  IRtcEngine,
  IRtcEngineEx,
  MediaPlayerError,
  MediaPlayerState,
  RtcEngineExImplInternal,
  VideoSourceType,
} from 'electron-agora-rtc-ng'
import { Button, Input } from 'antd'
import { Component } from 'react'
import SliderBar from '../../component/SliderBar'
import Window from '../../component/Window'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { getRandomInt } from '../../util'
const { Search } = Input

interface State {
  isPlaying: boolean
  mpkState?: MediaPlayerState
  duration: number
}

export default class MediaPlayer
  extends Component<State>
  implements IMediaPlayerSourceObserver
{
  rtcEngine?: IRtcEngineEx

  mpk?: IMediaPlayer

  streamId?: number

  state: State = {
    isPlaying: false,
    mpkState: undefined,
    duration: 100000,
  }

  componentDidMount() {
    this.getMediaPlayer().registerPlayerSourceObserver(this)
  }

  componentWillUnmount() {
    this.getMediaPlayer().unregisterPlayerSourceObserver(this)
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

  getMediaPlayer = () => {
    if (!this.mpk) {
      const mpk = this.getRtcEngine().createMediaPlayer()
      this.mpk = mpk
      return mpk
    }
    return this.mpk
  }

  onPlayerSourceStateChanged(
    state: MediaPlayerState,
    ec: MediaPlayerError
  ): void {
    switch (state) {
      case MediaPlayerState.PlayerStateOpenCompleted:
        console.log('onPlayerSourceStateChanged1:open finish')
        this.getMediaPlayer().play()
        const duration = this.getMediaPlayer().getDuration()
        this.setState({ duration })
        break
      default:
        break
    }
    console.log('onPlayerSourceStateChanged', state, ec)
    this.setState({ mpkState: state })
  }

  onPositionChanged?(position: number): void {
    console.log('onPositionChanged', position)
  }

  onPressMpk = (url) => {
    if (!url) {
      return
    }
    const { isPlaying } = this.state
    const mpk = this.getMediaPlayer()

    if (isPlaying) {
      mpk.stop()
    } else {
      mpk.open(url, 0)
    }

    this.setState({ isPlaying: !isPlaying })
  }

  renderRightBar = () => {
    const { isPlaying, duration } = this.state
    return (
      <div className={styles.rightBar} style={{ justifyContent: 'flex-start' }}>
        <Search
          placeholder={'please input url for media'}
          defaultValue='https://agora-adc-artifacts.oss-cn-beijing.aliyuncs.com/video/meta_live_mpk.mov'
          allowClear
          enterButton={!isPlaying ? 'Play' : 'Stop'}
          size='small'
          onSearch={this.onPressMpk}
        />
        <br />
        {isPlaying && (
          <>
            <Button
              onClick={() => {
                this.getMediaPlayer().pause()
              }}
            >
              Pause
            </Button>
            <Button
              onClick={() => {
                this.getMediaPlayer().resume()
              }}
            >
              Resume
            </Button>
            <SliderBar
              max={100}
              min={0}
              step={1}
              title='Process'
              onChange={(value) => {
                this.getMediaPlayer().seek((value / 100) * this.state.duration)
              }}
            />
            <Button
              onClick={() => {
                const res = this.rtcEngine.joinChannelWithOptions(
                  '',
                  config.defaultChannelId,
                  getRandomInt(),
                  {
                    publishMediaPlayerId:
                      this.getMediaPlayer().getMediaPlayerId(),
                    autoSubscribeAudio: false,
                    autoSubscribeVideo: false,
                    publishMediaPlayerAudioTrack: true,
                    publishMediaPlayerVideoTrack: true,
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                  }
                )
                console.log('joinChannel2', res)
              }}
            >
              Publish
            </Button>
            <Button
              onClick={() => {
                this.rtcEngine.leaveChannel()
              }}
            >
              UnPublish
            </Button>
          </>
        )}
      </div>
    )
  }

  render() {
    const { isPlaying } = this.state
    return (
      <div className={styles.screen}>
        <div className={styles.content}>
          {isPlaying && (
            <Window
              uid={this.getMediaPlayer().getMediaPlayerId()}
              rtcEngine={this.rtcEngine!}
              videoSourceType={VideoSourceType.VideoSourceMediaPlayer}
              channelId={''}
            />
          )}
        </div>
        {this.renderRightBar()}
      </div>
    )
  }
}
