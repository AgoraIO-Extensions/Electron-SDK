import { Component } from 'react';
import {
  createAgoraRtcEngine,
  IMediaPlayer,
  IRtcEngineEx,
  RenderModeType,
  RtcConnection,
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
} from 'agora-electron-sdk';

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
      isMirror: false,
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
    nextState: Readonly<{}>,
    nextContext: any
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
    funcName.call(this, { ...canvas, view: dom }, connection!);
  };

  updateMirror = () => {
    const { canvas, connection } = this.props;
    const { isMirror } = this.state;
    const engine = createAgoraRtcEngine();

    let funcName:
      | typeof IRtcEngineEx.prototype.setRemoteRenderModeEx
      | typeof IRtcEngineEx.prototype.setLocalRenderMode
      | typeof IRtcEngineEx.prototype.setRemoteRenderMode;

    if (canvas.sourceType === undefined) {
      if (canvas.uid) {
        funcName = engine.setRemoteRenderMode;
      } else {
        funcName = engine.setLocalRenderMode;
      }
    } else if (canvas.sourceType === VideoSourceType.VideoSourceMediaPlayer) {
      funcName = engine.setLocalRenderMode;
    } else if (canvas.sourceType === VideoSourceType.VideoSourceRemote) {
      funcName = engine.setRemoteRenderMode;
    } else {
      funcName = engine.setLocalRenderMode;
    }

    if (funcName === engine.setRemoteRenderMode && connection) {
      funcName = engine.setRemoteRenderModeEx;
    }

    if (funcName === engine.setLocalRenderMode) {
      funcName.call(
        this,
        RenderModeType.RenderModeFit,
        isMirror
          ? VideoMirrorModeType.VideoMirrorModeEnabled
          : VideoMirrorModeType.VideoMirrorModeDisabled
      );
    } else {
      // @ts-ignore
      funcName.call(
        this,
        canvas.uid!,
        RenderModeType.RenderModeFit,
        isMirror
          ? VideoMirrorModeType.VideoMirrorModeEnabled
          : VideoMirrorModeType.VideoMirrorModeDisabled,
        connection!
      );
    }
  };

  render() {
    const { canvas } = this.props;
    const { isMirror, uniqueId } = this.state;

    return (
      <div
        className={styles['window-item']}
        onClick={() => {
          this.setState({ isMirror: !isMirror }, () => {
            setTimeout(() => {
              this.updateMirror();
            });
          });
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
