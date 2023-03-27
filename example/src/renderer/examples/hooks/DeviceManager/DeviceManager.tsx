import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AudioDeviceInfo,
  ClientRoleType,
  createAgoraRtcEngine,
  ErrorCodeType,
  IRtcEngine,
  LocalVideoStreamError,
  LocalVideoStreamState,
  MediaDeviceType,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  VideoDeviceInfo,
  VideoSourceType,
} from 'agora-electron-sdk';

import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraSlider,
  AgoraSwitch,
  AgoraView,
} from '../../../components/ui';
import * as log from '../../../utils/log';
import { useInitRtcEngine } from '../../../hook/useInitRtcEngine';
import AgoraStyle from '../../config/public.scss';
import BaseRenderUsers from '../base/BaseRenderUsers';
import BaseRenderChannel from '../base/BaseRenderChannel';
import Config from '../../../config/agora.config';

export default function DeviceManager() {
  const [enableAudio] = useState<boolean>(false);
  const [enableVideo] = useState<boolean>(true);
  const [enablePreview] = useState<boolean>(true);
  const engine = useRef<IRtcEngine>(createAgoraRtcEngine());

  const [channelId, setChannelId] = useState<string>(Config.channelId);
  const [uid] = useState<number>(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState<boolean>(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);

  const [playbackDevices, setPlaybackDevices] = useState<AudioDeviceInfo[]>([]);
  const [playbackDeviceId, setPlaybackDeviceId] = useState<string>('');
  const [playbackDeviceVolume, setPlaybackDeviceVolume] = useState<number>(100);
  const [playbackDeviceMute, setPlaybackDeviceMute] = useState<boolean>(false);
  const [recordingDevices, setRecordingDevices] = useState<AudioDeviceInfo[]>(
    []
  );
  const [recordingDeviceId, setRecordingDeviceId] = useState<string>('');
  const [recordingDeviceVolume, setRecordingDeviceVolume] =
    useState<number>(100);
  const [recordingDeviceMute, setRecordingDeviceMute] =
    useState<boolean>(false);
  const [videoDevices, setVideoDevices] = useState<VideoDeviceInfo[]>([]);
  const [videoDeviceId, setVideoDeviceId] = useState<string>('');

  /**
   * Step 1: initRtcEngine
   */
  const { token, initRtcEngine, startPreview } = useInitRtcEngine({
    enableAudio,
    enableVideo,
    enablePreview,
    engine: engine.current,
    setupOtherExtension: () => {
      enumerateDevices();
      getDeviceMute();
      getDeviceVolume();
    },
  });

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
  const enumerateDevices = () => {
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
  };

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
  const getDeviceMute = () => {
    setPlaybackDeviceMute(
      engine.current.getAudioDeviceManager().getPlaybackDeviceMute()
    );
    setRecordingDeviceMute(
      engine.current.getAudioDeviceManager().getRecordingDeviceMute()
    );
  };

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
  const getDeviceVolume = () => {
    setPlaybackDeviceVolume(
      engine.current.getAudioDeviceManager().getPlaybackDeviceVolume()
    );
    setRecordingDeviceVolume(
      engine.current.getAudioDeviceManager().getRecordingDeviceVolume()
    );
  };

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
    engine.current.addListener('onError', (err: ErrorCodeType, msg: string) => {
      log.info('onError', 'err', err, 'msg', msg);
    });

    engine.current.addListener(
      'onJoinChannelSuccess',
      (connection: RtcConnection, elapsed: number) => {
        log.info(
          'onJoinChannelSuccess',
          'connection',
          connection,
          'elapsed',
          elapsed
        );
        setJoinChannelSuccess(true);
      }
    );

    engine.current.addListener(
      'onLeaveChannel',
      (connection: RtcConnection, stats: RtcStats) => {
        log.info('onLeaveChannel', 'connection', connection, 'stats', stats);
        setJoinChannelSuccess(false);
        setRemoteUsers([]);
        setPlaybackDevices([]);
        setPlaybackDeviceId('');
        setPlaybackDeviceVolume(100);
        setPlaybackDeviceMute(false);
        setRecordingDevices([]);
        setRecordingDeviceId('');
        setRecordingDeviceVolume(100);
        setRecordingDeviceMute(false);
        setVideoDevices([]);
        setVideoDeviceId('');
      }
    );

    // engine.current.addListener(
    //   'onMediaDeviceChanged',
    //   (deviceType: MediaDeviceType) => {
    //     log.info('onMediaDeviceChanged', 'deviceType', deviceType);
    //   }
    // );

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

    engine.current.addListener(
      'onUserJoined',
      (connection: RtcConnection, remoteUid: number, elapsed: number) => {
        log.info(
          'onUserJoined',
          'connection',
          connection,
          'remoteUid',
          remoteUid,
          'elapsed',
          elapsed
        );
        setRemoteUsers((r) => {
          if (r === undefined) return [];
          return [...r, remoteUid];
        });
      }
    );

    engine.current.addListener(
      'onUserOffline',
      (
        connection: RtcConnection,
        remoteUid: number,
        reason: UserOfflineReasonType
      ) => {
        log.info(
          'onUserOffline',
          'connection',
          connection,
          'remoteUid',
          remoteUid,
          'reason',
          reason
        );
        setRemoteUsers((r) => {
          if (r === undefined) return [];
          return r.filter((value) => value !== remoteUid);
        });
      }
    );

    engine.current.addListener(
      'onLocalUserRegistered',
      (uid: number, userAccount: string) => {
        log.info('LocalUserRegistered', 'uid', uid, 'userAccount', userAccount);
      }
    );

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeAllListeners();
    };
  }, [initRtcEngine]);

  const onChannelIdChange = useCallback((text) => setChannelId(text), []);

  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        <BaseRenderUsers
          startPreview={startPreview}
          joinChannelSuccess={joinChannelSuccess}
          remoteUsers={remoteUsers}
          enableVideo={enableVideo}
        />
      </AgoraView>
      <AgoraView className={AgoraStyle.rightBar}>
        <BaseRenderChannel
          joinChannelSuccess={joinChannelSuccess}
          joinChannel={joinChannel}
          leaveChannel={leaveChannel}
          onChannelIdChange={onChannelIdChange}
          channelId={channelId}
        />
        <AgoraDivider>The Configuration of DeviceManager</AgoraDivider>
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
              setPlaybackDeviceId(() => playbackDevices?.at(0)?.deviceId ?? '');
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
              setRecordingDeviceId(
                () => playbackDevices?.at(0)?.deviceId ?? ''
              );
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
              setVideoDeviceId(() => playbackDevices?.at(0)?.deviceId ?? '');
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
        <AgoraDivider />
      </AgoraView>
    </AgoraView>
  );
}
