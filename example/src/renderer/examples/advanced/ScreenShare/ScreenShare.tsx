import createAgoraRtcEngine, {
  ClientRoleType,
  IRtcEngine,
  IRtcEngineEx,
  RtcEngineExImplInternal,
  VideoSourceType,
} from 'electron-agora-rtc-ng'
import { Card, message, Switch } from 'antd'
import { Component } from 'react'
import ChooseFilterWindowModal from '../../component/ChooseFilterWindowModal'
import DropDownButton from '../../component/DropDownButton'
import JoinChannelBar from '../../component/JoinChannelBar'
import Window from '../../component/Window'
import { FpsMap, ResolutionMap } from '../../config'
import config from '../../config/agora.config'
import styles from '../../config/public.scss'
import { configMapToOptions, getRandomInt } from '../../util'
import { rgbImageBufferToBase64 } from '../../util/base64'
import screenStyle from './ScreenShare.scss'

const localScreenUid1 = getRandomInt(1, 9999999)
const localScreenUid2 = getRandomInt(1, 9999999)

interface State {
  currentFps: number
  currentResolution: { width: number; height: number }
  captureInfoList: any[]
  currentWindowSourceId?: number
  currentScreenSourceId?: number
  channelId: string
  isShared: boolean
  captureMouseCursor: boolean
}

export default class ScreenShare extends Component<{}, State, any> {
  rtcEngine?: IRtcEngineEx

  state: State = {
    captureInfoList: [],
    channelId: '',
    isShared: false,
    currentResolution: ResolutionMap['1920x1080'],
    currentFps: FpsMap['7fps'],
    captureMouseCursor: false,
  }

  componentDidMount = async () => {
    this.getScreenCaptureInfo()
  }

  componentWillUnmount() {
    this.onPressStopSharing()
    this.getRtcEngine().release()
  }

  getScreenCaptureInfo = async () => {
    const list = this.getRtcEngine().getScreenCaptureSources(
      { width: 500, height: 500 },
      { width: 500, height: 500 },
      true
    )

    const imageList = list.map((item) =>
      rgbImageBufferToBase64(item.thumbImage)
    )

    const formatList = list.map(
      ({ sourceName, sourceTitle, sourceId, type }, index) => ({
        isScreen: type === 1,
        image: imageList[index],
        sourceId,
        sourceName,
        sourceTitle:
          sourceTitle.length < 20
            ? sourceTitle
            : sourceTitle.replace(/\s+/g, '').substr(0, 20) + '...',
      })
    )
    this.setState({ captureInfoList: formatList })
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

  startWindowCapture = (channelId: string) => {
    const { currentWindowSourceId, currentFps, currentResolution } = this.state

    const rtcEngine = this.getRtcEngine()
    rtcEngine.startPrimaryScreenCapture({
      isCaptureWindow: true,
      screenRect: { width: 0, height: 0, x: 0, y: 0 },
      windowId: currentWindowSourceId,
      params: {
        dimensions: currentResolution,
        frameRate: currentFps,
        captureMouseCursor: false,
        windowFocus: false,
        excludeWindowList: [],
        excludeWindowCount: 0,
      },

      regionRect: { x: 0, y: 0, width: 0, height: 0 },
    })
    rtcEngine.joinChannelEx(
      '',
      {
        localUid: localScreenUid1,
        channelId,
      },
      {
        publishCameraTrack: false,
        publishAudioTrack: false,
        publishScreenTrack: true,
        publishCustomAudioTrack: false,
        publishCustomVideoTrack: false,
        publishEncodedVideoTrack: false,
        publishMediaPlayerAudioTrack: false,
        publishMediaPlayerVideoTrack: false,
        autoSubscribeAudio: false,
        autoSubscribeVideo: false,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      }
    )
  }

  startScreenCapture = (channelId: string, excludeWindows: number[]) => {
    const { currentScreenSourceId, currentFps, currentResolution } = this.state

    const rtcEngine = this.getRtcEngine()
    rtcEngine.startSecondaryScreenCapture({
      isCaptureWindow: false,
      screenRect: { width: 0, height: 0, x: 0, y: 0 },
      windowId: currentScreenSourceId,
      displayId: currentScreenSourceId,
      params: {
        dimensions: currentResolution,
        frameRate: currentFps,
        captureMouseCursor: false,
        windowFocus: false,
        excludeWindowList: excludeWindows,
        excludeWindowCount: excludeWindows.length,
      },

      regionRect: { x: 0, y: 0, width: 0, height: 0 },
    })

    rtcEngine.joinChannelEx(
      '',
      {
        localUid: localScreenUid2,
        channelId,
      },
      {
        publishCameraTrack: false,
        publishAudioTrack: false,
        publishScreenTrack: false,
        publishSecondaryScreenTrack: true,
        publishCustomAudioTrack: false,
        publishCustomVideoTrack: false,
        publishEncodedVideoTrack: false,
        publishMediaPlayerAudioTrack: false,
        publishMediaPlayerVideoTrack: false,
        autoSubscribeAudio: false,
        autoSubscribeVideo: false,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      }
    )
  }

  onPressStartShare = async (channelId: string) => {
    const { currentScreenSourceId, currentWindowSourceId } = this.state
    if (
      currentScreenSourceId === undefined ||
      currentWindowSourceId === undefined
    ) {
      message.error(
        `Must select window:${currentWindowSourceId} and screen:${currentScreenSourceId} to share`
      )
      return true
    }
    const { captureInfoList } = this.state

    const windowIds = captureInfoList
      .filter((obj) => !obj.isScreen)
      .map((obj) => obj.sourceId)

    let excludeWindows: number[] = []
    //@ts-ignore
    const isCancel = !(await this.modal.showModal(windowIds, (res) => {
      excludeWindows = (res && res.map((windowId) => parseInt(windowId))) || []
    }))
    if (isCancel) {
      return true
    }

    this.setState({ channelId, isShared: true })
    await this.startWindowCapture(channelId)
    await this.startScreenCapture(channelId, excludeWindows)

    return false
  }

  onPressStopSharing = () => {
    this.setState({ isShared: false })
    const rtcEngine = this.getRtcEngine()
    rtcEngine.stopPrimaryScreenCapture()
    rtcEngine.stopSecondaryScreenCapture()
    const { channelId } = this.state
    rtcEngine.leaveChannelEx({ channelId, localUid: localScreenUid1 })
    rtcEngine.leaveChannelEx({ channelId, localUid: localScreenUid2 })
  }

  renderPopup = (item: { image: string }) => {
    return (
      <div>
        <img
          src={item.image}
          alt='preview img'
          className={screenStyle.previewShotBig}
        />
      </div>
    )
  }

  updateScreenCaptureParameters = () => {
    const { currentFps, currentResolution, captureMouseCursor } = this.state

    if (!currentFps || !currentResolution) {
      return
    }
    const res = this.rtcEngine.updateScreenCaptureParameters({
      dimensions: currentResolution,
      frameRate: currentFps,
      captureMouseCursor: captureMouseCursor,
      windowFocus: false,
      excludeWindowList: [],
      excludeWindowCount: 0,
    })
    console.log(
      'updateScreenCaptureParameters',
      currentFps,
      currentResolution,
      res
    )
  }

  renderRightBar = () => {
    const { captureInfoList, isShared } = this.state

    const screenList = captureInfoList
      .filter((obj) => obj.isScreen)
      .map((obj) => ({
        dropId: obj,
        dropText: obj.sourceName,
      }))
    const windowList = captureInfoList
      .filter((obj) => !obj.isScreen)
      .map((obj) => ({
        dropId: obj,
        dropText: obj.sourceTitle,
      }))

    return (
      <div className={styles.rightBar}>
        <div>
          <div>Please Select a window/scrren to share</div>
          <DropDownButton
            defaultIndex={0}
            title='Screen Share'
            options={screenList}
            PopContent={this.renderPopup}
            PopContentTitle='Preview'
            onPress={(res) => {
              console.log('Screen Share choose', res.dropId.sourceId)
              const sourceId = res.dropId.sourceId
              if (sourceId === undefined) {
                return
              }
              this.setState({ currentScreenSourceId: sourceId })
            }}
          />
          <DropDownButton
            defaultIndex={0}
            title='Windows Share'
            options={windowList}
            PopContent={this.renderPopup}
            PopContentTitle='Preview'
            onPress={(res) => {
              console.log('Windows Share choose', res.dropId.sourceId)
              const sourceId = res.dropId.sourceId
              if (sourceId === undefined) {
                return
              }
              this.setState({ currentWindowSourceId: sourceId })
            }}
          />
          {isShared && (
            <>
              <DropDownButton
                title='Resolution'
                options={configMapToOptions(ResolutionMap)}
                defaultIndex={configMapToOptions(ResolutionMap).length - 1}
                onPress={(res) => {
                  this.setState(
                    { currentResolution: res.dropId },
                    this.updateScreenCaptureParameters
                  )
                }}
              />
              <DropDownButton
                title='FPS'
                options={configMapToOptions(FpsMap)}
                onPress={(res) => {
                  this.setState(
                    { currentFps: res.dropId },
                    this.updateScreenCaptureParameters
                  )
                }}
              />
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                {'CaptureMouseCursor'}
                <Switch
                  checkedChildren='Enable'
                  unCheckedChildren='Disable'
                  defaultChecked={false}
                  onChange={(enable) => {
                    this.setState(
                      { captureMouseCursor: enable },
                      this.updateScreenCaptureParameters
                    )
                  }}
                />
              </div>
            </>
          )}
        </div>
        <JoinChannelBar
          buttonTitle='Start Share'
          buttonTitleDisable='Stop Share'
          onPressJoin={this.onPressStartShare}
          onPressLeave={this.onPressStopSharing}
        />
        <ChooseFilterWindowModal
          cRef={(ref) => {
            //@ts-ignore
            this.modal = ref
          }}
        />
      </div>
    )
  }

  render() {
    const { isShared, channelId } = this.state
    return (
      <div className={styles.screen}>
        <div className={styles.content}>
          {isShared && (
            <>
              <Card title='Local Share1' className={styles.card}>
                <Window
                  uid={localScreenUid1}
                  rtcEngine={this.rtcEngine!}
                  videoSourceType={VideoSourceType.VideoSourceScreenPrimary}
                  channelId={channelId}
                />
              </Card>
              <Card title='Local Share2' className={styles.card}>
                <Window
                  uid={localScreenUid2}
                  rtcEngine={this.rtcEngine!}
                  videoSourceType={VideoSourceType.VideoSourceScreenSecondary}
                  channelId={channelId}
                />
              </Card>
            </>
          )}
        </div>
        {this.renderRightBar()}
      </div>
    )
  }
}
