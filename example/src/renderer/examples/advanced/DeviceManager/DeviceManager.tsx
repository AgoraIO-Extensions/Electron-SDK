import React, { ReactNode } from 'react';
import {
  AudioDeviceInfo,
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngineEventHandler,
  LocalVideoStreamError,
  LocalVideoStreamState,
  MediaDeviceType,
  RtcConnection,
  RtcStats,
  VideoDeviceInfo,
  VideoSourceType,
} from 'electron-agora-rtc-ng';

import Config from '../../../config/agora.config';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraSlider,
  AgoraSwitch,
} from '../../../components/ui';

interface State extends BaseVideoComponentState {
  playbackDevices?: AudioDeviceInfo[];
  playbackDeviceId?: string;
  playbackDeviceVolume?: number;
  playbackDeviceMute?: boolean;
  recordingDevices?: AudioDeviceInfo[];
  recordingDeviceId?: string;
  recordingDeviceVolume?: number;
  recordingDeviceMute?: boolean;
  videoDevices?: VideoDeviceInfo[];
  videoDeviceId?: string;
}

export default class DeviceManager
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
      playbackDevices: [],
      playbackDeviceId: undefined,
      playbackDeviceVolume: 100,
      playbackDeviceMute: false,
      recordingDevices: [],
      recordingDeviceId: undefined,
      recordingDeviceVolume: 100,
      recordingDeviceMute: false,
      videoDevices: [],
      videoDeviceId: undefined,
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
    this.engine.registerEventHandler(this);
    this.engine.initialize({
      appId,
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();

    // Start preview before joinChannel
    this.engine.startPreview();
    this.setState({ startPreview: true });

    this.enumerateDevices();
    this.getDeviceMute();
    this.getDeviceVolume();
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
   * Step 3-1: enumerateDevices
   */
  enumerateDevices = () => {
    const playbackDevices = this.engine
      .getAudioDeviceManager()
      .enumeratePlaybackDevices();
    const recordingDevices = this.engine
      .getAudioDeviceManager()
      .enumerateRecordingDevices();
    const videoDevices = this.engine
      .getVideoDeviceManager()
      .enumerateVideoDevices();

    this.setState({
      playbackDevices,
      playbackDeviceId: playbackDevices[0].deviceId,
      recordingDevices,
      recordingDeviceId: recordingDevices[0].deviceId,
      videoDevices,
      videoDeviceId: videoDevices[0].deviceId,
    });
  };

  /**
   * Step 3-2 (Optional): setDevice
   */
  setDevice = () => {
    const { playbackDeviceId, recordingDeviceId, videoDeviceId } = this.state;

    this.engine.getAudioDeviceManager().setPlaybackDevice(playbackDeviceId);
    this.engine.getAudioDeviceManager().setRecordingDevice(recordingDeviceId);
    this.engine.getVideoDeviceManager().setDevice(videoDeviceId);
  };

  /**
   * Step 3-3 (Optional): getDeviceMute
   */
  getDeviceMute = () => {
    this.setState({
      playbackDeviceMute: this.engine
        .getAudioDeviceManager()
        .getPlaybackDeviceMute(),
      recordingDeviceMute: this.engine
        .getAudioDeviceManager()
        .getRecordingDeviceMute(),
    });
  };

  /**
   * Step 3-4 (Optional): setDeviceMute
   */
  setDeviceMute = () => {
    const { playbackDeviceMute, recordingDeviceMute } = this.state;
    this.engine
      .getAudioDeviceManager()
      .setPlaybackDeviceMute(playbackDeviceMute);
    this.engine
      .getAudioDeviceManager()
      .setRecordingDeviceMute(recordingDeviceMute);
  };

  /**
   * Step 3-5 (Optional): getDeviceVolume
   */
  getDeviceVolume = () => {
    this.setState({
      playbackDeviceVolume: this.engine
        .getAudioDeviceManager()
        .getPlaybackDeviceVolume(),
      recordingDeviceVolume: this.engine
        .getAudioDeviceManager()
        .getRecordingDeviceVolume(),
    });
  };

  /**
   * Step 3-6 (Optional): setDeviceVolume
   */
  setDeviceVolume = () => {
    const { playbackDeviceVolume, recordingDeviceVolume } = this.state;
    this.engine
      .getAudioDeviceManager()
      .setPlaybackDeviceVolume(playbackDeviceVolume);
    this.engine
      .getAudioDeviceManager()
      .setRecordingDeviceVolume(recordingDeviceVolume);
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
    delete state.playbackDevices;
    delete state.playbackDeviceId;
    delete state.playbackDeviceVolume;
    delete state.playbackDeviceMute;
    delete state.recordingDevices;
    delete state.recordingDeviceId;
    delete state.recordingDeviceVolume;
    delete state.recordingDeviceMute;
    delete state.videoDevices;
    delete state.videoDeviceId;
    this.setState(state);
  }

  onMediaDeviceChanged(deviceType: MediaDeviceType) {
    this.info('onMediaDeviceChanged', 'deviceType', deviceType);
  }

  onAudioDeviceStateChanged(
    deviceId: string,
    deviceType: MediaDeviceType,
    deviceState: number
  ) {
    this.info(
      'onAudioDeviceStateChanged',
      'deviceId',
      deviceId,
      'deviceType',
      deviceType,
      'deviceState',
      deviceState
    );
  }

  onAudioDeviceVolumeChanged(
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) {
    this.info(
      'onAudioDeviceVolumeChanged',
      'deviceType',
      deviceType,
      'volume',
      volume,
      'muted',
      muted
    );
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
    error: LocalVideoStreamError
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

  protected renderConfiguration(): ReactNode {
    const {
      playbackDevices,
      playbackDeviceId,
      playbackDeviceMute,
      playbackDeviceVolume,
      recordingDevices,
      recordingDeviceId,
      recordingDeviceMute,
      recordingDeviceVolume,
      videoDevices,
      videoDeviceId,
    } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'playbackDeviceId'}
          items={playbackDevices.map((value) => {
            return {
              value: value.deviceId,
              label: value.deviceName,
            };
          })}
          value={playbackDeviceId}
          onValueChange={(value, index) => {
            this.setState({
              playbackDeviceId: playbackDevices[index].deviceId,
            });
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'recordingDeviceId'}
          items={recordingDevices.map((value) => {
            return {
              value: value.deviceId,
              label: value.deviceName,
            };
          })}
          value={recordingDeviceId}
          onValueChange={(value, index) => {
            this.setState({
              recordingDeviceId: recordingDevices[index].deviceId,
            });
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'videoDeviceId'}
          items={videoDevices.map((value) => {
            return {
              value: value.deviceId,
              label: value.deviceName,
            };
          })}
          value={videoDeviceId}
          onValueChange={(value, index) => {
            this.setState({
              videoDeviceId: videoDevices[index].deviceId,
            });
          }}
        />
        <AgoraDivider />
        <AgoraButton title={`setDevice`} onPress={this.setDevice} />
        <AgoraDivider />
        <AgoraSwitch
          title={'playbackDeviceMute'}
          value={playbackDeviceMute}
          onValueChange={(value) => {
            this.setState({ playbackDeviceMute: value });
          }}
        />
        <AgoraDivider />
        <AgoraSwitch
          title={'recordingDeviceMute'}
          value={recordingDeviceMute}
          onValueChange={(value) => {
            this.setState({ recordingDeviceMute: value });
          }}
        />
        <AgoraDivider />
        <AgoraButton title={`setDeviceMute`} onPress={this.setDeviceMute} />
        <AgoraSlider
          title={`playbackDeviceVolume ${playbackDeviceVolume}`}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={playbackDeviceVolume}
          onSlidingComplete={(value) => {
            this.setState({
              playbackDeviceVolume: value,
            });
          }}
        />
        <AgoraDivider />
        <AgoraSlider
          title={`recordingDeviceVolume ${recordingDeviceVolume}`}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={recordingDeviceVolume}
          onSlidingComplete={(value) => {
            this.setState({
              recordingDeviceVolume: value,
            });
          }}
        />
        <AgoraDivider />
        <AgoraButton title={`setDeviceVolume`} onPress={this.setDeviceVolume} />
      </>
    );
  }
}
