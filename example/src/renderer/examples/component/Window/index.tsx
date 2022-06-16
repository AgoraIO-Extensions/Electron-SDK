import {
  AgoraEnv,
  IRtcEngine,
  IRtcEngineEx,
  RenderModeType,
  RtcEngineExImplInternal,
  VideoMirrorModeType,
  VideoSourceType,
} from 'electron-agora-rtc-ng'
import { Component } from 'react'
import { getRandomInt } from '../../util'
import styles from './index.scss'

interface WindowProps {
  rtcEngine: IRtcEngineEx & IRtcEngine & RtcEngineExImplInternal
  uid?: number
  videoSourceType: VideoSourceType
  channelId?: string
}
class Window extends Component<WindowProps> {
  state = {
    isMirror: false,
    uniqueId: getRandomInt(),
  }

  getHTMLElement = () => {
    const { uniqueId } = this.state
    const { uid, rtcEngine, channelId, videoSourceType } = this.props

    return document.querySelector(`#video-${uid}-${uniqueId}`) as HTMLElement
  }

  componentDidMount() {
    const { uid, rtcEngine, channelId, videoSourceType } = this.props
    const dom = this.getHTMLElement()

    console.log(
      `Window:  VideoSourceType: ${videoSourceType}, channelId:${channelId}, uid:${uid}, view: ${dom}`
    )
    if (videoSourceType === VideoSourceType.VideoSourceRemote) {
      rtcEngine.setupRemoteVideoEx(
        {
          sourceType: videoSourceType,
          uid,
          view: dom,
          mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
          renderMode: RenderModeType.RenderModeFit,
        },
        { channelId }
      )
    } else {
      rtcEngine.setupLocalVideo({
        sourceType: videoSourceType,
        uid,
        view: dom,
        mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
        renderMode: RenderModeType.RenderModeFit,
      })
    }
  }

  componentWillUnmount() {
    const { rtcEngine } = this.props

    const dom = this.getHTMLElement()

    rtcEngine.destroyRendererByView(dom)
  }

  updateMirror = () => {
    const { isMirror } = this.state
    const dom = this.getHTMLElement()

    AgoraEnv.AgoraRendererManager.setRenderOption(
      dom,
      RenderModeType.RenderModeAdaptive,
      isMirror
    )
  }

  render() {
    const { uid } = this.props
    const { isMirror, uniqueId } = this.state

    return (
      <div
        className={styles['window-item']}
        onClick={() => {
          this.setState({ isMirror: !isMirror }, this.updateMirror)
        }}
      >
        <div className={styles['video-item']} id={`video-${uid}-${uniqueId}`} />
      </div>
    )
  }
}

export default Window
