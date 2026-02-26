import {
  ChannelProfileType,
  ClientRoleType,
  EncodingPreference,
  ErrorCodeType,
  IRtcEngineEventHandler,
  LocalVideoStreamReason,
  LocalVideoStreamState,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  VideoCanvas,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDropdown,
  AgoraStyle,
  AgoraTextInput,
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { arrayToItems, enumToItems } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  selectedUser?: number;
  camWidth: number;
  camHeight: number;
  camFrameRate: number;
  camBitrate: number;
  camEncodingPreference: EncodingPreference;
}

export default class Performance
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
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
      hideRightBar: false,
      camWidth: 320,
      camHeight: 180,
      camFrameRate: 10,
      camBitrate: 200,
      camEncodingPreference: EncodingPreference.PreferHardware,
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

    this.engine = createAgoraRtcEngine();
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    // Need granted the microphone and camera permission
    await askMediaAccess(['microphone', 'camera']);

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();

    this.engine.setVideoEncoderConfiguration({
      frameRate: 30,
      dimensions: {
        width: 1920,
        height: 1080,
      },
    });
    this.setState({ startPreview: true });
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
    });
  }

  /**
   * Step 3: leaveChannel
   */
  protected leaveChannel() {
    this.engine?.leaveChannel();
  }

  /**
   * Step 4: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  onError(err: ErrorCodeType, msg: string) {
    super.onError(err, msg);
  }

  onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    super.onJoinChannelSuccess(connection, elapsed);
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    super.onLeaveChannel(connection, stats);
  }

  onUserJoined(connection: RtcConnection, remoteUid: number, elapsed: number) {
    super.onUserJoined(connection, remoteUid, elapsed);
  }

  onUserOffline(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ) {
    super.onUserOffline(connection, remoteUid, reason);
  }

  onVideoDeviceStateChanged(
    deviceId: string,
    deviceType: number,
    deviceState: number
  ) {
    this.info(
      'onVideoDeviceStateChanged',
      'deviceId',
      deviceId,
      'deviceType',
      deviceType,
      'deviceState',
      deviceState
    );
  }

  onLocalVideoStateChanged(
    source: VideoSourceType,
    state: LocalVideoStreamState,
    error: LocalVideoStreamReason
  ) {
    this.info(
      'onLocalVideoStateChanged',
      'source',
      source,
      'state',
      state,
      'error',
      error
    );
  }

  setVideoEncoderConfiguration = () => {
    const {
      camWidth,
      camHeight,
      camBitrate,
      camFrameRate,
      camEncodingPreference,
    } = this.state;

    this.engine?.setVideoEncoderConfiguration({
      dimensions: {
        width: camWidth,
        height: camHeight,
      },
      frameRate: camFrameRate,
      bitrate: camBitrate,
      advanceOptions: {
        encodingPreference: camEncodingPreference,
      },
    });
  };

  protected renderUsers(): ReactElement | undefined {
    const { joinChannelSuccess, remoteUsers } = this.state;
    return (
      <>
        {joinChannelSuccess ? (
          <>
            {remoteUsers.map((item) =>
              this.renderUser({
                uid: item,
                sourceType: VideoSourceType.VideoSourceRemote,
              })
            )}
          </>
        ) : undefined}
      </>
    );
  }

  protected renderUser(user: VideoCanvas): ReactElement | undefined {
    return (
      <div key={user.uid}>
        <RtcSurfaceView
          canvas={user}
          videoClass="video-item-performance"
          containerClass="window-item-performance"
        />
      </div>
    );
  }

  protected renderVideo(user: VideoCanvas): ReactElement | undefined {
    return (
      <RtcSurfaceView
        containerClass={AgoraStyle.meetSurfaceViewContainer}
        videoClass={AgoraStyle.meetSurfaceViewVideo}
        canvas={user}
      />
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      joinChannelSuccess,
      remoteUsers,
      selectedUser,
      camEncodingPreference,
    } = this.state;
    return (
      <>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camWidth: text === '' ? this.createState().camWidth : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camWidth (defaults: ${this.createState().camWidth})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camHeight: text === '' ? this.createState().camHeight : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camHeight (defaults: ${this.createState().camHeight})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camFrameRate:
                text === '' ? this.createState().camFrameRate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camFrameRate (defaults: ${
            this.createState().camFrameRate
          })`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camBitrate: text === '' ? this.createState().camBitrate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camBitrate (defaults: ${
            this.createState().camBitrate
          })`}
        />
        <AgoraDropdown
          title={'EncodingPreference'}
          items={enumToItems(EncodingPreference)}
          value={camEncodingPreference}
          onValueChange={(value) => {
            this.setState({ camEncodingPreference: value });
          }}
        />
        <AgoraButton
          title={`setVideoEncoderConfiguration`}
          onPress={this.setVideoEncoderConfiguration}
        />
        {joinChannelSuccess ? (
          <>
            <AgoraDropdown
              title={'Append renderer to remote users'}
              items={arrayToItems(Array.from(new Set(remoteUsers)))}
              value={selectedUser}
              onValueChange={(value) => {
                this.setState({ selectedUser: value });
              }}
            />
            <AgoraView>
              <AgoraButton
                title="Add"
                onPress={() => {
                  if (selectedUser !== undefined) {
                    this.setState((prev) => {
                      return {
                        remoteUsers: [...prev.remoteUsers, selectedUser],
                      };
                    });
                  }
                }}
              />
              <AgoraButton
                title="Remove"
                onPress={() => {
                  if (selectedUser !== undefined) {
                    this.setState((prev) => {
                      const predicate = (it: number) => it === selectedUser;
                      const firstIndex = prev.remoteUsers.findIndex(predicate);
                      const lastIndex =
                        prev.remoteUsers.findLastIndex(predicate);
                      if (firstIndex !== lastIndex) {
                        prev.remoteUsers.splice(lastIndex, 1);
                      }
                      return {
                        remoteUsers: prev.remoteUsers,
                      };
                    });
                  }
                }}
              />
            </AgoraView>
          </>
        ) : undefined}
      </>
    );
  }
}
