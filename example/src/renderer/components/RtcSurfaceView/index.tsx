import {
  IMediaPlayer,
  IRtcEngineEx,
  RtcConnection,
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { Component } from 'react';

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

export class RtcSurfaceView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMirror:
        props.canvas.mirrorMode === VideoMirrorModeType.VideoMirrorModeDisabled,
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
    const { canvas, connection } = this.props;

    this.getSetupVideoFunc().call(
      this,
      {
        ...canvas,
        view: null,
      },
      connection!
    );
  }

  getSetupVideoFunc = () => {
    const { canvas, connection } = this.props;
    const engine = createAgoraRtcEngine();

    let func:
      | typeof IRtcEngineEx.prototype.setupRemoteVideoEx
      | typeof IRtcEngineEx.prototype.setupRemoteVideo
      | typeof IRtcEngineEx.prototype.setupLocalVideo
      | typeof IMediaPlayer.prototype.setView;

    if (canvas.sourceType === undefined) {
      if (canvas.uid) {
        func = engine.setupRemoteVideo;
      } else {
        func = engine.setupLocalVideo;
      }
    } else if (canvas.sourceType === VideoSourceType.VideoSourceRemote) {
      func = engine.setupRemoteVideo;
    } else {
      func = engine.setupLocalVideo;
    }

    if (func === engine.setupRemoteVideo && connection) {
      func = engine.setupRemoteVideoEx;
    }

    return func;
  };

  updateRender = () => {
    const { canvas, connection } = this.props;
    const { isMirror } = this.state;
    const dom = this.getHTMLElement();

    this.getSetupVideoFunc().call(
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
    const { uniqueId } = this.state;

    return (
      <div
        className={styles['window-item']}
        onClick={() => {
          this.setState((preState) => {
            return { isMirror: !preState.isMirror };
          }, this.updateRender);
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
