import { Component } from 'react';
import {
  AgoraEnv,
  RenderModeType,
  RtcConnection,
  VideoCanvas,
  VideoSourceType,
  createAgoraRtcEngine,
  IRtcEngineEx,
  IMediaPlayer,
} from 'agora-electron-sdk';

import { getRandomInt } from '../../utils';
import styles from './index.scss';

interface Props {
  canvas: VideoCanvas;

  connection?: RtcConnection;
}

class RtcSurfaceView extends Component<Props> {
  state = {
    isMirror: false,
    uniqueId: getRandomInt(),
  };

  getHTMLElement = () => {
    const { uniqueId } = this.state;
    const { canvas } = this.props;

    return document.querySelector(
      `#video-${canvas.uid}-${uniqueId}`
    ) as HTMLElement;
  };

  componentDidMount() {
    const { canvas, connection } = this.props;
    const dom = this.getHTMLElement();
    const engine = createAgoraRtcEngine();

    let funcName:
      | typeof IRtcEngineEx.prototype.setupRemoteVideoEx
      | typeof IRtcEngineEx.prototype.setupRemoteVideo
      | typeof IRtcEngineEx.prototype.setupLocalVideo
      | typeof IMediaPlayer.prototype.setView;

    if (canvas.sourceType === undefined) {
      if (canvas.uid) {
        funcName = engine.setupRemoteVideo;
      } else {
        funcName = engine.setupLocalVideo;
      }
    } else if (canvas.sourceType === VideoSourceType.VideoSourceMediaPlayer) {
      funcName = engine.setupLocalVideo;
    } else if (canvas.sourceType === VideoSourceType.VideoSourceRemote) {
      funcName = engine.setupRemoteVideo;
    } else {
      funcName = engine.setupLocalVideo;
    }

    if (funcName === engine.setupRemoteVideo && connection) {
      funcName = engine.setupRemoteVideoEx;
    }

    funcName.call(this, { ...canvas, view: dom }, connection);
  }

  componentWillUnmount() {
    const dom = this.getHTMLElement();

    createAgoraRtcEngine().destroyRendererByView(dom);
  }

  updateMirror = () => {
    const { isMirror } = this.state;
    const dom = this.getHTMLElement();

    AgoraEnv.AgoraRendererManager.setRenderOption(
      dom,
      RenderModeType.RenderModeAdaptive,
      isMirror
    );
  };

  render() {
    const { canvas } = this.props;
    const { isMirror, uniqueId } = this.state;

    return (
      <div
        className={styles['window-item']}
        onClick={() => {
          this.setState({ isMirror: !isMirror }, this.updateMirror);
        }}
      >
        <div
          className={styles['video-item']}
          id={`video-${canvas.uid}-${uniqueId}`}
        />
      </div>
    );
  }
}

export default RtcSurfaceView;
