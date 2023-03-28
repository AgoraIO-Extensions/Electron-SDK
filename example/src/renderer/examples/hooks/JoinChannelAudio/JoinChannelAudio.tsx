import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  ErrorCodeType,
  IRtcEngine,
  LocalAudioStreamError,
  LocalAudioStreamState,
  MediaDeviceType,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
} from 'agora-electron-sdk';

import {
  AgoraButton,
  AgoraDivider,
  AgoraSlider,
  AgoraView,
} from '../../../components/ui';
import * as log from '../../../utils/log';
import { useInitRtcEngine } from '../../../hook/useInitRtcEngine';
import AgoraStyle from '../../config/public.scss';
import BaseRenderUsers from '../base/BaseRenderUsers';
import BaseRenderChannel from '../base/BaseRenderChannel';
import Config from '../../../config/agora.config';

function JoinChannelAudio() {
  const [enableAudio] = useState<boolean>(true);
  const [enableVideo] = useState<boolean>(false);
  const [enablePreview] = useState<boolean>(false);
  const engine = useRef<IRtcEngine>(createAgoraRtcEngine());
  const [channelId, setChannelId] = useState<string>(Config.channelId);
  const [uid] = useState<number>(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState<boolean>(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [enableLocalAudio, setEnableLocalAudio] = useState<boolean>(true);
  const [muteLocalAudioStream, setMuteLocalAudioStream] =
    useState<boolean>(false);
  const [recordingSignalVolume, setRecordingSignalVolume] =
    useState<number>(100);
  const [playbackSignalVolume, setPlaybackSignalVolume] = useState<number>(100);

  /**
   * Step 1: initRtcEngine
   */
  const { token, initRtcEngine, startPreview } = useInitRtcEngine({
    enableAudio,
    enableVideo,
    enablePreview,
    engine: engine.current,
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
   * Step 3-1-1 (Optional): enableLocalAudio
   */
  const handleEnableLocalAudio = () => {
    engine.current.enableLocalAudio(true);
    setEnableLocalAudio(true);
  };

  /**
   * Step 3-1-2 (Optional): disableLocalAudio
   */
  const handleDisableLocalAudio = () => {
    engine.current.enableLocalAudio(false);
    setEnableLocalAudio(false);
  };
  /**
   * Step 3-2-1 (Optional): muteLocalAudioStream
   */
  const handleMuteLocalAudioStream = () => {
    engine.current.muteLocalAudioStream(true);
    setMuteLocalAudioStream(true);
  };

  /**
   * Step 3-2-2 (Optional): unmuteLocalAudioStream
   */
  const handleUnmuteLocalAudioStream = () => {
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
      'onAudioDeviceStateChanged',
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
      'onLocalAudioStateChanged',
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
      }
    );

    engine.current.addListener('onAudioRoutingChanged', (routing: number) => {
      log.info('onAudioRoutingChanged', 'routing', routing);
    });

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
        <AgoraDivider>The Configuration of JoinChannelAudio</AgoraDivider>
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
        <AgoraDivider />
        <>
          <AgoraButton
            title={`${enableLocalAudio ? 'disable' : 'enable'} Local Audio`}
            onPress={
              enableLocalAudio
                ? handleDisableLocalAudio
                : handleEnableLocalAudio
            }
          />
          <AgoraButton
            title={`${
              muteLocalAudioStream ? 'unmute' : 'mute'
            } Local Audio Stream`}
            onPress={
              muteLocalAudioStream
                ? handleUnmuteLocalAudioStream
                : handleMuteLocalAudioStream
            }
          />
        </>
      </AgoraView>
    </AgoraView>
  );
}
export default JoinChannelAudio;
