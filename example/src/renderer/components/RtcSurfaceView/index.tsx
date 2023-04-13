import {
  IMediaPlayer,
  IRtcEngineEx,
  RtcConnection,
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import { Component } from 'react';

import { getRandomInt } from '../../utils';

import styles from './index.scss';

interface Props {
  canvas: VideoCanvas;
  connection?: RtcConnection;
}

interface State {
  isMirror: boolean;
  uniqueId: number;
}

class RtcSurfaceView extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isMirror:
        props.mirrorMode === VideoMirrorModeType.VideoMirrorModeDisabled,
      uniqueId: getRandomInt(),
    };
  }

  getHTMLElement = () => {
    const { uniqueId } = this.state;
    const { canvas } = this.props;

    return document.querySelector(
      `#video-${canvas.uid}-${uniqueId}`
    ) as HTMLElement;
  };

  componentDidMount() {
    this.updateRender();
  }

  shouldComponentUpdate(
    nextProps: Readonly<Props>,
    nextState: Readonly<State>
  ): boolean {
    return (
      JSON.stringify(this.props.canvas) !== JSON.stringify(nextProps.canvas) ||
      JSON.stringify(this.props.connection) !==
        JSON.stringify(nextProps.connection) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    );
  }

  componentDidUpdate() {
    this.updateRender();
  }

  componentWillUnmount() {
    const dom = this.getHTMLElement();

    createAgoraRtcEngine().destroyRendererByView(dom);
  }

  updateRender = () => {
    const { canvas, connection } = this.props;
    const { isMirror } = this.state;
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

    try {
      engine.destroyRendererByView(dom);
    } catch (e) {
      console.warn(e);
    }
    funcName.call(
      this,
      {
        ...canvas,
        mirrorMode: isMirror
          ? VideoMirrorModeType.VideoMirrorModeEnabled
          : VideoMirrorModeType.VideoMirrorModeDisabled,
        view: dom,
      },
      connection!
    );
  };

  render() {
    const { canvas } = this.props;
    const { isMirror, uniqueId } = this.state;

    return (
      <div
        className={styles['window-item']}
        onClick={() => {
          this.setState({ isMirror: !isMirror }, this.updateRender);
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
