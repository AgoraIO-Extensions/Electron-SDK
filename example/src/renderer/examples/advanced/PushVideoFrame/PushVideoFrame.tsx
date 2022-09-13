import React from 'react';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  ExternalVideoSourceType,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  VideoBufferType,
  VideoPixelFormat,
  ScreenCaptureSourceInfo,
  RtcConnection,
  RtcStats,
} from 'electron-agora-rtc-ng';

import Config from '../../../config/agora.config';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import { AgoraButton, AgoraDropdown, AgoraImage } from '../../../components/ui';
import { rgbImageBufferToBase64 } from '../../../utils/base64';

interface State extends BaseVideoComponentState {
  sources?: ScreenCaptureSourceInfo[];
  targetSource?: ScreenCaptureSourceInfo;
}

export default class PushVideoFrame
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  // @ts-ignore
  protected engine?: IRtcEngineEx;

  protected createState(): State {
    return {
      appId: Config.appId,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      startPreview: false,
      sources: [],
      targetSource: undefined,
    };
  }

  /**
   * Step 1: initRtcEngine
   */
  protected async initRtcEngine() {
    const { appId } = this.state;
    if (!appId) {
      this.error(`appId is invalid`);
    }

    this.engine = createAgoraRtcEngine() as IRtcEngineEx;
    this.engine.registerEventHandler(this);
    this.engine.initialize({
      appId,
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();

    this.setExternalVideoSource();
    this.getScreenCaptureSources();
  }

  /**
   * Step 2: joinChannel
   */
  protected joinChannel() {
    const { channelId, token, uid } = this.state;
    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid < 0) {
      this.error('uid is invalid');
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    this.engine?.joinChannel(token, channelId, uid, {
      // Make myself as the broadcaster to send stream to remote
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishCameraTrack: false,
      publishEncodedVideoTrack: true,
    });
  }

  /**
   * Step 3-1: setExternalVideoSource
   */
  setExternalVideoSource = () => {
    this.engine
      ?.getMediaEngine()
      .setExternalVideoSource(true, false, ExternalVideoSourceType.VideoFrame);
  };

  /**
   * Step 3-2 (Optional): getScreenCaptureSources
   */
  getScreenCaptureSources = () => {
    const sources = this.engine?.getScreenCaptureSources(
      { width: 1920, height: 1080 },
      { width: 64, height: 64 },
      true
    );
    this.setState({
      sources,
      targetSource: sources[0],
    });
  };

  /**
   * Step 3-3: pushVideoFrame
   */
  pushVideoFrame = () => {
    const { targetSource } = this.state;
    if (!targetSource) {
      console.error('targetSource is invalid');
      return;
    }

    this.engine?.getMediaEngine().pushVideoFrame({
      type: VideoBufferType.VideoBufferRawData,
      format: VideoPixelFormat.VideoPixelRgba,
      buffer: targetSource.thumbImage.buffer,
      stride: targetSource.thumbImage.width,
      height: targetSource.thumbImage.height,
    });
  };

  /**
   * Step 4: leaveChannel
   */
  protected leaveChannel() {
    this.engine?.leaveChannel();
  }

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', 'connection', connection, 'stats', stats);
    const state = this.createState();
    delete state.sources;
    delete state.targetSource;
    this.setState(state);
  }

  protected renderConfiguration(): React.ReactNode {
    const { sources, targetSource } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'targetSource'}
          items={sources.map((value) => {
            return {
              value: value.sourceId,
              label: value.sourceName,
            };
          })}
          value={targetSource?.sourceId}
          onValueChange={(value, index) => {
            this.setState({ targetSource: sources[index] });
          }}
        />
        {targetSource ? (
          <AgoraImage
            source={rgbImageBufferToBase64(targetSource.thumbImage)}
          />
        ) : undefined}
      </>
    );
  }

  protected renderAction(): React.ReactNode {
    const { joinChannelSuccess } = this.state;
    return (
      <>
        <AgoraButton
          disabled={!joinChannelSuccess}
          title={`push Video Frame`}
          onPress={this.pushVideoFrame}
        />
      </>
    );
  }
}
