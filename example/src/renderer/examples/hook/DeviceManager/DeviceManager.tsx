import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  AudioDeviceInfo,
  ClientRoleType,
  LocalVideoStreamError,
  LocalVideoStreamState,
  MediaDeviceType,
  VideoDeviceInfo,
  VideoSourceType,
} from 'agora-electron-sdk';

import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraSlider,
  AgoraSwitch,
} from '../../../components/ui';
import * as log from '../../../utils/log';
import { useInitRtcEngine } from '../hooks/useInitRtcEngine';
import BaseRenderUsers from '../components/BaseRenderUsers';
import BaseRenderChannel from '../components/BaseRenderChannel';
import { BaseComponent } from '../components/BaseComponent';

export default function DeviceManager() {
  const {
    channelId,
    setChannelId,
    token,
    uid,
    joinChannelSuccess,
    remoteUsers,
    startPreview,
    engine,
  } =
    /**
     * Step 1: initRtcEngine
     */
    useInitRtcEngine(true);

  const [playbackDevices, setPlaybackDevices] = useState<AudioDeviceInfo[]>([]);
  const [playbackDeviceId, setPlaybackDeviceId] = useState<
    string | undefined
  >();
  const [playbackDeviceVolume, setPlaybackDeviceVolume] = useState<number>(100);
  const [playbackDeviceMute, setPlaybackDeviceMute] = useState<boolean>(false);
  const [recordingDevices, setRecordingDevices] = useState<AudioDeviceInfo[]>(
    []
  );
  const [recordingDeviceId, setRecordingDeviceId] = useState<
    string | undefined
  >();
  const [recordingDeviceVolume, setRecordingDeviceVolume] =
    useState<number>(100);
  const [recordingDeviceMute, setRecordingDeviceMute] =
    useState<boolean>(false);
  const [videoDevices, setVideoDevices] = useState<VideoDeviceInfo[]>([]);
  const [videoDeviceId, setVideoDeviceId] = useState<string | undefined>();

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
   * Step 3-1: enumerateDevices
   */
  const enumerateDevices = useCallback(() => {
    const playbackDevices = engine.current
      .getAudioDeviceManager()
      .enumeratePlaybackDevices();
    const recordingDevices = engine.current
      .getAudioDeviceManager()
      .enumerateRecordingDevices();
    const videoDevices = engine.current
      .getVideoDeviceManager()
      .enumerateVideoDevices();

    setPlaybackDevices(playbackDevices);
    setPlaybackDeviceId(() => playbackDevices?.at(0)?.deviceId ?? '');
    setRecordingDevices(recordingDevices);
    setRecordingDeviceId(() => recordingDevices?.at(0)?.deviceId ?? '');
    setVideoDevices(videoDevices);
    setVideoDeviceId(() => videoDevices?.at(0)?.deviceId ?? '');
  }, [engine]);

  /**
   * Step 3-2 (Optional): setDevice
   */
  const setDevice = () => {
    if (playbackDeviceId)
      engine.current
        .getAudioDeviceManager()
        .setPlaybackDevice(playbackDeviceId);
    if (recordingDeviceId)
      engine.current
        .getAudioDeviceManager()
        .setRecordingDevice(recordingDeviceId);
    if (videoDeviceId)
      engine.current.getVideoDeviceManager().setDevice(videoDeviceId);
  };

  /**
   * Step 3-3 (Optional): getDeviceMute
   */
  const getDeviceMute = useCallback(() => {
    setPlaybackDeviceMute(
      engine.current.getAudioDeviceManager().getPlaybackDeviceMute()
    );
    setRecordingDeviceMute(
      engine.current.getAudioDeviceManager().getRecordingDeviceMute()
    );
  }, [engine]);

  /**
   * Step 3-4 (Optional): setDeviceMute
   */
  const setDeviceMute = () => {
    engine.current
      .getAudioDeviceManager()
      .setPlaybackDeviceMute(playbackDeviceMute!);
    engine.current
      .getAudioDeviceManager()
      .setRecordingDeviceMute(recordingDeviceMute!);
  };

  /**
   * Step 3-5 (Optional): getDeviceVolume
   */
  const getDeviceVolume = useCallback(() => {
    setPlaybackDeviceVolume(
      engine.current.getAudioDeviceManager().getPlaybackDeviceVolume()
    );
    setRecordingDeviceVolume(
      engine.current.getAudioDeviceManager().getRecordingDeviceVolume()
    );
  }, [engine]);

  /**
   * Step 3-6 (Optional): setDeviceVolume
   */
  const setDeviceVolume = () => {
    engine.current
      .getAudioDeviceManager()
      .setPlaybackDeviceVolume(playbackDeviceVolume!);
    engine.current
      .getAudioDeviceManager()
      .setRecordingDeviceVolume(recordingDeviceVolume!);
  };

  /**
   * Step 4: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannel();
  };

  useEffect(() => {
    enumerateDevices();
    getDeviceMute();
    getDeviceVolume();
  }, [enumerateDevices, getDeviceMute, getDeviceVolume]);

  useEffect(() => {
    engine.current.addListener(
      'onAudioDeviceStateChanged',
      (deviceId: string, deviceType: MediaDeviceType, deviceState: number) => {
        log.info(
          'onAudioDeviceStateChanged',
          'deviceId',
          deviceId,
          'deviceType',
          deviceType,
          'deviceState',
          deviceState
        );
      }
    );

    engine.current.addListener(
      'onAudioDeviceVolumeChanged',
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
      }
    );

    engine.current.addListener(
      'onVideoDeviceStateChanged',
      (deviceId: string, deviceType: number, deviceState: number) => {
        log.info(
          'onVideoDeviceStateChanged',
          'deviceId',
          deviceId,
          'deviceType',
          deviceType,
          'deviceState',
          deviceState
        );
      }
    );

    engine.current.addListener(
      'onLocalVideoStateChanged',
      (
        source: VideoSourceType,
        state: LocalVideoStreamState,
        error: LocalVideoStreamError
      ) => {
        log.info(
          'onLocalVideoStateChanged',
          'source',
          source,
          'state',
          state,
          'error',
          error
        );
      }
    );

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeAllListeners();
    };
  }, [engine]);

  return (
    <BaseComponent
      name={'DeviceManager'}
      enableVideo={true}
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
          startPreview={startPreview}
          joinChannelSuccess={joinChannelSuccess}
          remoteUsers={remoteUsers}
        />
      )}
    />
  );

  function renderConfiguration(): ReactNode {
    return (
      <>
        <AgoraDropdown
          title={'playbackDeviceId'}
          items={playbackDevices?.map((value) => {
            return {
              value: value.deviceId!,
              label: value.deviceName!,
            };
          })}
          value={playbackDeviceId}
          onValueChange={(value, index) => {
            setPlaybackDeviceId(playbackDevices?.at(index)?.deviceId);
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'recordingDeviceId'}
          items={recordingDevices?.map((value) => {
            return {
              value: value.deviceId!,
              label: value.deviceName!,
            };
          })}
          value={recordingDeviceId}
          onValueChange={(value, index) => {
            setRecordingDeviceId(recordingDevices?.at(index)?.deviceId);
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'videoDeviceId'}
          items={videoDevices?.map((value) => {
            return {
              value: value.deviceId!,
              label: value.deviceName!,
            };
          })}
          value={videoDeviceId}
          onValueChange={(value, index) => {
            setVideoDeviceId(videoDevices?.at(index)?.deviceId);
          }}
        />
        <AgoraDivider />
        <AgoraButton title={`setDevice`} onPress={setDevice} />
        <AgoraDivider />
        <AgoraSwitch
          title={'playbackDeviceMute'}
          value={playbackDeviceMute}
          onValueChange={(value) => {
            setPlaybackDeviceMute(value);
          }}
        />
        <AgoraDivider />
        <AgoraSwitch
          title={'recordingDeviceMute'}
          value={recordingDeviceMute}
          onValueChange={(value) => {
            setRecordingDeviceMute(value);
          }}
        />
        <AgoraDivider />
        <AgoraButton title={`setDeviceMute`} onPress={setDeviceMute} />
        <AgoraSlider
          title={`playbackDeviceVolume ${playbackDeviceVolume}`}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={playbackDeviceVolume}
          onSlidingComplete={(value) => {
            setPlaybackDeviceVolume(value);
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
            setRecordingDeviceVolume(value);
          }}
        />
        <AgoraDivider />
        <AgoraButton title={`setDeviceVolume`} onPress={setDeviceVolume} />
      </>
    );
  }
}
