import {
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  LocalVideoStreamError,
  LocalVideoStreamState,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';

import { Card, List } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import RtcSurfaceView from '../../../components/RtcSurfaceView';

import {
  AgoraButton,
  AgoraDivider,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import AgoraStyle from '../../config/public.scss';

export default function JoinChannelVideo() {
  const [appId] = useState(Config.appId);
  const [enableVideo] = useState(true);
  const [channelId, setChannelId] = useState(Config.channelId);
  const [token] = useState(Config.token);
  const [uid] = useState(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [startPreview, setStartPreview] = useState(false);

  const engine = useRef(createAgoraRtcEngine());

  /**
   * Step 1: initRtcEngine
   */
  const initRtcEngine = useCallback(async () => {
    if (!appId) {
      console.error(`appId is invalid`);
    }

    engine.current.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    engine.current.enableVideo();

    // Start preview before joinChannel
    engine.current.startPreview();
    setStartPreview(true);
  }, [appId]);

  /**
   * Step 2: joinChannel
   */
  const joinChannel = () => {
    if (!channelId) {
      console.error('channelId is invalid');
      return;
    }
    if (uid < 0) {
      console.error('uid is invalid');
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
   * Step 3: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannel();
  };

  const onError = useCallback((err: ErrorCodeType, msg: string) => {
    console.info('onError', 'err', err, 'msg', msg);
  }, []);

  const onJoinChannelSuccess = useCallback(
    (connection: RtcConnection, elapsed: number) => {
      console.info(
        'onJoinChannelSuccess',
        'connection',
        connection,
        'elapsed',
        elapsed
      );
      setJoinChannelSuccess(true);
    },
    []
  );

  const onLeaveChannel = useCallback(
    (connection: RtcConnection, stats: RtcStats) => {
      console.info('onLeaveChannel', 'connection', connection, 'stats', stats);
      setJoinChannelSuccess(false);
      setRemoteUsers([]);
    },
    []
  );

  const onUserJoined = useCallback(
    (connection: RtcConnection, remoteUid: number, elapsed: number) => {
      console.info(
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
        return [...remoteUsers, remoteUid];
      });
    },
    [remoteUsers]
  );

  const onUserOffline = useCallback(
    (
      connection: RtcConnection,
      remoteUid: number,
      reason: UserOfflineReasonType
    ) => {
      console.info(
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
        return remoteUsers.filter((value) => value !== remoteUid);
      });
    },
    [remoteUsers]
  );

  const onVideoDeviceStateChanged = useCallback(
    (deviceId: string, deviceType: number, deviceState: number) => {
      console.info(
        'onVideoDeviceStateChanged',
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

  const onLocalVideoStateChanged = useCallback(
    (
      source: VideoSourceType,
      state: LocalVideoStreamState,
      error: LocalVideoStreamError
    ) => {
      console.info(
        'onLocalVideoStateChanged',
        'source',
        source,
        'state',
        state,
        'error',
        error
      );
    },
    []
  );

  useEffect(() => {
    initRtcEngine();
  }, [initRtcEngine]);

  useEffect(() => {
    engine.current.addListener('onError', onError);
    engine.current.addListener('onJoinChannelSuccess', onJoinChannelSuccess);
    engine.current.addListener('onLeaveChannel', onLeaveChannel);
    engine.current.addListener('onUserJoined', onUserJoined);
    engine.current.addListener('onUserOffline', onUserOffline);
    engine.current.addListener(
      'onVideoDeviceStateChanged',
      onVideoDeviceStateChanged
    );
    engine.current.addListener(
      'onLocalVideoStateChanged',
      onLocalVideoStateChanged
    );

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeListener('onError', onError);
      engineCopy.removeListener('onJoinChannelSuccess', onJoinChannelSuccess);
      engineCopy.removeListener('onLeaveChannel', onLeaveChannel);
      engineCopy.removeListener('onUserJoined', onUserJoined);
      engineCopy.removeListener('onUserOffline', onUserOffline);
      engineCopy.removeListener(
        'onVideoDeviceStateChanged',
        onVideoDeviceStateChanged
      );
      engineCopy.removeListener(
        'onLocalVideoStateChanged',
        onLocalVideoStateChanged
      );
      engineCopy.removeAllListeners();
      engineCopy.release();
    };
  }, [
    onError,
    onJoinChannelSuccess,
    onLeaveChannel,
    onLocalVideoStateChanged,
    onUserJoined,
    onUserOffline,
    onVideoDeviceStateChanged,
  ]);

  const configuration = renderConfiguration();
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>{renderUsers()}</AgoraView>
      <AgoraView className={AgoraStyle.rightBar}>
        {renderChannel()}
        {configuration ? (
          <>
            <AgoraDivider>The Configuration of JoinChannelVideo</AgoraDivider>
            {configuration}
          </>
        ) : undefined}
        <AgoraDivider />
        {renderAction()}
      </AgoraView>
    </AgoraView>
  );

  function renderConfiguration() {
    return undefined;
  }

  function renderUsers() {
    return (
      <>
        {startPreview || joinChannelSuccess ? (
          <List
            style={{ width: '100%' }}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1,
              xxl: 2,
            }}
            dataSource={[0, ...remoteUsers]}
            renderItem={renderVideo}
          />
        ) : undefined}
      </>
    );
  }

  function renderChannel() {
    return (
      <>
        <AgoraTextInput
          onChangeText={(text) => {
            setChannelId(text);
          }}
          placeholder={`channelId`}
          value={channelId}
        />
        <AgoraButton
          title={`${joinChannelSuccess ? 'leave' : 'join'} Channel`}
          onPress={() => {
            joinChannelSuccess ? leaveChannel() : joinChannel();
          }}
        />
      </>
    );
  }

  function renderAction() {
    return undefined;
  }

  function renderVideo(uid: number) {
    return (
      <List.Item>
        <Card title={`${uid === 0 ? 'Local' : 'Remote'} Uid: ${uid}`}>
          <AgoraText>Click view to mirror</AgoraText>
          {enableVideo ? <RtcSurfaceView canvas={{ uid }} /> : undefined}
          <AgoraButton
            title={`Append`}
            onPress={() => {
              setRemoteUsers([...remoteUsers!, uid]);
            }}
          />
        </Card>
      </List.Item>
    );
  }
}
