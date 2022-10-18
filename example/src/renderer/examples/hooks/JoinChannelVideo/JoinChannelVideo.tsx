import React, { useEffect, useState } from 'react';
import {
  ChannelProfileType,
  ErrorCodeType,
  ClientRoleType,
  createAgoraRtcEngine,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
} from 'agora-electron-sdk';

import Config from '../../../config/agora.config';

import RtcSurfaceView from '../../../components/RtcSurfaceView';
import { Card, List } from 'antd';

import {
  AgoraButton,
  AgoraDivider,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import AgoraStyle from '../../config/public.scss';

export default function JoinChannelVideoWithAddlisten() {
  const [appId] = useState(Config.appId);
  const [enableVideo] = useState(true);
  const [channelId, setChannelId] = useState(Config.channelId);
  const [token] = useState(Config.token);
  const [uid] = useState(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState(false);
  const [engine] = useState(createAgoraRtcEngine());
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [startPreview, setStartPreview] = useState(false);

  /**
   * Step 1: initRtcEngine
   */
  const initRtcEngine = async () => {
    if (!appId) {
      error(`appId is invalid`);
    }

    engine.initialize({
      appId,
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    engine.enableVideo();

    // Start preview before joinChannel
    engine.startPreview();
    setStartPreview(true);
  };

  /**
   * Step 2: joinChannel
   */
  const joinChannel = () => {
    if (!channelId) {
      error('channelId is invalid');
      return;
    }
    if (uid < 0) {
      error('uid is invalid');
      return;
    }
    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    engine?.joinChannel(token, channelId, uid, {
      // Make myself as the broadcaster to send stream to remote
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  /**
   * Step 3: leaveChannel
   */
  const leaveChannel = () => {
    engine?.leaveChannel();
  };

  /**
   * Step 4: releaseRtcEngine
   */
  const releaseRtcEngine = () => {
    engine?.release();
  };

  const _logSink = (
    level: 'debug' | 'log' | 'info' | 'warn' | 'error',
    message?: any,
    ...optionalParams: any[]
  ): string => {
    console[level](message, optionalParams);
    return `${optionalParams.map((v) => JSON.stringify(v))}`;
  };

  const debug = (message?: any, ...optionalParams: any[]): void => {
    alert(`${message}: ${_logSink('debug', message, ...optionalParams)}`);
  };

  const log = (message?: any, ...optionalParams: any[]): void => {
    _logSink('log', message, optionalParams);
  };

  const info = (message?: any, ...optionalParams: any[]): void => {
    _logSink('info', message, optionalParams);
  };

  const warn = (message?: any, ...optionalParams: any[]): void => {
    _logSink('warn', message, optionalParams);
  };

  const error = (message?: any, ...optionalParams: any[]): void => {
    _logSink('error', message, optionalParams);
  };

  useEffect(() => {
    initRtcEngine();

    engine.addListener('onError', (err: ErrorCodeType, msg: string) => {
      info('onError', 'err', err, 'msg', msg);
    });

    engine.addListener(
      'onJoinChannelSuccess',
      (connection: RtcConnection, elapsed: number) => {
        info(
          'onJoinChannelSuccess',
          'connection',
          connection,
          'elapsed',
          elapsed
        );
        setJoinChannelSuccess(true);
        console.log('addListener:onJoinChannelSuccess', {
          connection,
          elapsed,
        });
      }
    );

    engine.addListener(
      'onLeaveChannel',
      (connection: RtcConnection, stats: RtcStats) => {
        info('onLeaveChannel', 'connection', connection, 'stats', stats);
        setJoinChannelSuccess(false);
        setStartPreview(false);
        setRemoteUsers([]);
        console.log(
          'addListener:onLeaveChannel',
          'connection',
          connection,
          'stats',
          stats
        );
      }
    );

    engine.addListener(
      'onUserJoined',
      (connection: RtcConnection, remoteUid: number, elapsed: number) => {
        info(
          'onUserJoined',
          'connection',
          connection,
          'remoteUid',
          remoteUid,
          'elapsed',
          elapsed
        );
        if (remoteUsers === undefined) return;
        setRemoteUsers([...remoteUsers!, remoteUid]);
      }
    );

    engine.addListener(
      'onUserOffline',
      (
        connection: RtcConnection,
        remoteUid: number,
        reason: UserOfflineReasonType
      ) => {
        info(
          'onUserOffline',
          'connection',
          connection,
          'remoteUid',
          remoteUid,
          'reason',
          reason
        );
        if (remoteUsers === undefined) return;
        setRemoteUsers([...remoteUsers!, remoteUid]);
      }
    );

    return () => {
      engine.removeAllListeners('onJoinChannelSuccess');
      engine.removeAllListeners('onLeaveChannel');
      engine.removeAllListeners('onUserOffline');
      engine.removeAllListeners('onUserJoined');
      engine.removeAllListeners('onError');
      releaseRtcEngine();
    };
  }, []);

  const configuration = renderConfiguration();
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>{renderUsers()}</AgoraView>
      <AgoraView className={AgoraStyle.rightBar}>
        {renderChannel()}
        {configuration ? (
          <>
            <AgoraDivider>
              The Configuration of JoinChannelVideoWithAddlisten
            </AgoraDivider>
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
            renderItem={renderVideo.bind(window)}
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
          {enableVideo ? (
            <RtcSurfaceView canvas={{ uid }} connection={{ channelId }} />
          ) : undefined}
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
