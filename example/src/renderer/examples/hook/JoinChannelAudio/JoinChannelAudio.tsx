import {
  ClientRoleType,
  LocalAudioStreamError,
  LocalAudioStreamState,
  MediaDeviceType,
  RtcConnection,
} from 'agora-electron-sdk';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import { AgoraButton, AgoraDivider, AgoraSlider } from '../../../components/ui';
import * as log from '../../../utils/log';
import { BaseComponent } from '../components/BaseComponent';
import BaseRenderChannel from '../components/BaseRenderChannel';
import BaseRenderUsers from '../components/BaseRenderUsers';
import useInitRtcEngine from '../hooks/useInitRtcEngine';

export default function JoinChannelAudio() {
  const [enableVideo] = useState<boolean>(false);
  const {
    channelId,
    setChannelId,
    token,
    uid,
    joinChannelSuccess,
    remoteUsers,
    engine,
  } =
    /**
     * Step 1: initRtcEngine
     */
    useInitRtcEngine(enableVideo);

  const [enableLocalAudio, setEnableLocalAudio] = useState(true);
  const [muteLocalAudioStream, setMuteLocalAudioStream] = useState(false);
  const [recordingSignalVolume, setRecordingSignalVolume] = useState(100);
  const [playbackSignalVolume, setPlaybackSignalVolume] = useState(100);

  /**
   * Step 2: joinChannel
   */
  const joinChannel = () => {
    if (!channelId) {
      log.error('channelId is invalid');
      return;
    }
    if (uid < 0) {
      log.error('uid is invalid');
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    engine.current.joinChannel(token, channelId, uid, {
      // Make myself as the broadcaster to send stream to remote
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  /**
   * Step 3-1-1 (Optional): enableLocalAudio
   */
  const _enableLocalAudio = () => {
    engine.current.enableLocalAudio(true);
    setEnableLocalAudio(true);
  };

  /**
   * Step 3-1-2 (Optional): disableLocalAudio
   */
  const disableLocalAudio = () => {
    engine.current.enableLocalAudio(false);
    setEnableLocalAudio(false);
  };

  /**
   * Step 3-2-1 (Optional): muteLocalAudioStream
   */
  const _muteLocalAudioStream = () => {
    engine.current.muteLocalAudioStream(true);
    setMuteLocalAudioStream(true);
  };

  /**
   * Step 3-2-2 (Optional): unmuteLocalAudioStream
   */
  const unmuteLocalAudioStream = () => {
    engine.current.muteLocalAudioStream(false);
    setMuteLocalAudioStream(false);
  };

  /**
   * Step 3-3 (Optional): adjustRecordingSignalVolume
   */
  const adjustRecordingSignalVolume = () => {
    engine.current.adjustRecordingSignalVolume(recordingSignalVolume);
  };

  /**
   * Step 3-4 (Optional): adjustPlaybackSignalVolume
   */
  const adjustPlaybackSignalVolume = () => {
    engine.current.adjustPlaybackSignalVolume(playbackSignalVolume);
  };

  /**
   * Step 4: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannel();
  };

  const onAudioDeviceStateChanged = useCallback(
    (deviceId: string, deviceType: number, deviceState: number) => {
      log.info(
        'onAudioDeviceStateChanged',
        'deviceId',
        deviceId,
        'deviceType',
        deviceType,
        'deviceState',
        deviceState
      );
    },
    []
  );

  const onAudioDeviceVolumeChanged = useCallback(
    (deviceType: MediaDeviceType, volume: number, muted: boolean) => {
      log.info(
        'onAudioDeviceVolumeChanged',
        'deviceType',
        deviceType,
        'volume',
        volume,
        'muted',
        muted
      );
    },
    []
  );

  const onLocalAudioStateChanged = useCallback(
    (
      connection: RtcConnection,
      state: LocalAudioStreamState,
      error: LocalAudioStreamError
    ) => {
      log.info(
        'onLocalAudioStateChanged',
        'connection',
        connection,
        'state',
        state,
        'error',
        error
      );
    },
    []
  );

  const onAudioRoutingChanged = useCallback((routing: number) => {
    log.info('onAudioRoutingChanged', 'routing', routing);
  }, []);

  useEffect(() => {
    engine.current.addListener(
      'onAudioDeviceStateChanged',
      onAudioDeviceStateChanged
    );
    engine.current.addListener(
      'onAudioDeviceVolumeChanged',
      onAudioDeviceVolumeChanged
    );
    engine.current.addListener(
      'onLocalAudioStateChanged',
      onLocalAudioStateChanged
    );
    engine.current.addListener('onAudioRoutingChanged', onAudioRoutingChanged);

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeListener(
        'onAudioDeviceStateChanged',
        onAudioDeviceStateChanged
      );
      engineCopy.removeListener(
        'onAudioDeviceVolumeChanged',
        onAudioDeviceVolumeChanged
      );
      engineCopy.removeListener(
        'onLocalAudioStateChanged',
        onLocalAudioStateChanged
      );
      engineCopy.removeListener('onAudioRoutingChanged', onAudioRoutingChanged);
    };
  }, [
    engine,
    onAudioDeviceStateChanged,
    onAudioDeviceVolumeChanged,
    onAudioRoutingChanged,
    onLocalAudioStateChanged,
  ]);

  return (
    <BaseComponent
      name={'JoinChannelAudio'}
      renderConfiguration={renderConfiguration}
      renderChannel={() => (
        <BaseRenderChannel
          channelId={channelId}
          joinChannel={joinChannel}
          leaveChannel={leaveChannel}
          joinChannelSuccess={joinChannelSuccess}
          onChannelIdChange={setChannelId}
        />
      )}
      renderUsers={() => (
        <BaseRenderUsers
          enableVideo={enableVideo}
          joinChannelSuccess={joinChannelSuccess}
          remoteUsers={remoteUsers}
        />
      )}
      renderAction={renderAction}
    />
  );

  function renderConfiguration(): ReactNode {
    return (
      <>
        <AgoraSlider
          title={`recordingSignalVolume ${recordingSignalVolume}`}
          minimumValue={0}
          maximumValue={400}
          step={1}
          value={recordingSignalVolume}
          onSlidingComplete={(value) => {
            setRecordingSignalVolume(value);
          }}
        />
        <AgoraButton
          title={'adjust Recording Signal Volume'}
          onPress={adjustRecordingSignalVolume}
        />
        <AgoraDivider />
        <AgoraSlider
          title={`playbackSignalVolume ${playbackSignalVolume}`}
          minimumValue={0}
          maximumValue={400}
          step={1}
          value={playbackSignalVolume}
          onSlidingComplete={(value) => {
            setPlaybackSignalVolume(value);
          }}
        />
        <AgoraButton
          title={'adjust Playback Signal Volume'}
          onPress={adjustPlaybackSignalVolume}
        />
      </>
    );
  }

  function renderAction(): ReactNode {
    return (
      <>
        <AgoraButton
          title={`${enableLocalAudio ? 'disable' : 'enable'} Local Audio`}
          onPress={enableLocalAudio ? disableLocalAudio : _enableLocalAudio}
        />
        <AgoraButton
          title={`${
            muteLocalAudioStream ? 'unmute' : 'mute'
          } Local Audio Stream`}
          onPress={
            muteLocalAudioStream
              ? unmuteLocalAudioStream
              : _muteLocalAudioStream
          }
        />
      </>
    );
  }
}
