import React, { useEffect, useRef, useState } from 'react';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngineEx,
  RemoteVideoState,
  RemoteVideoStateReason,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
} from 'agora-electron-sdk';

import {
  AgoraButton,
  AgoraDivider,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import * as log from '../../../utils/log';
import { useInitRtcEngine } from '../../../hook/useInitRtcEngine';
import AgoraStyle from '../../config/public.scss';
import Config from '../../../config/agora.config';
import { Card, List } from 'antd';
import RtcSurfaceView from '../../../components/RtcSurfaceView';

const renderVideo = (uid: number, channelId?: string): React.ReactNode => {
  return (
    <List.Item>
      <Card title={`ChannelId: ${channelId} Uid: ${uid}`}>
        <AgoraText>Click view to mirror</AgoraText>
        <RtcSurfaceView canvas={{ uid }} connection={{ channelId }} />
      </Card>
    </List.Item>
  );
};

export default function JoinMultipleChannel() {
  const [enableAudio] = useState<boolean>(false);
  const [enableVideo] = useState<boolean>(true);
  const [enablePreview] = useState<boolean>(true);
  const engine = useRef<IRtcEngineEx>(createAgoraRtcEngine());
  const [channelId, setChannelId] = useState<string>(Config.channelId);
  const [channelId2, setChannelId2] = useState<string>('');
  const [token2] = useState<string>('');
  const [uid, setUid] = useState<number>(Config.uid);
  const [uid2, setUid2] = useState<number>(0);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState<boolean>(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [joinChannelSuccess2, setJoinChannelSuccess2] =
    useState<boolean>(false);
  const [remoteUsers2, setRemoteUsers2] = useState<number[]>([]);

  /**
   * Step 1: initRtcEngine
   */
  const { token, startPreview, initRtcEngine } = useInitRtcEngine({
    enableAudio,
    enableVideo,
    enablePreview,
    engine: engine.current,
  });

  /**
   * Step 2-1: joinChannel
   */
  const joinChannel = () => {
    if (!channelId) {
      log.error('channelId is invalid');
      return;
    }
    if (uid <= 0) {
      log.error('uid is invalid');
      return;
    }
    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    engine.current.joinChannelEx(
      token,
      {
        channelId,
        localUid: uid,
      },
      {
        // Make myself as the broadcaster to send stream to remote
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: false,
        publishCameraTrack: false,
      }
    );
  };

  /**
   * Step 2-2: joinChannel2
   */
  const joinChannel2 = () => {
    if (!channelId2) {
      log.error('channelId2 is invalid');
      return;
    }
    if (uid2 < 0) {
      log.error('uid2 is invalid');
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    engine.current.joinChannelEx(
      token2,
      {
        channelId: channelId2,
        localUid: uid2,
      },
      {
        // Make myself as the broadcaster to send stream to remote
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: false,
        publishCameraTrack: false,
      }
    );
  };

  /**
   * Step 3-1: publishStreamToChannel
   */
  const publishStreamToChannel = () => {
    engine.current.updateChannelMediaOptionsEx(
      { publishMicrophoneTrack: false, publishCameraTrack: false },
      {
        channelId: channelId2,
        localUid: uid2,
      }
    );
    engine.current.updateChannelMediaOptionsEx(
      { publishMicrophoneTrack: true, publishCameraTrack: true },
      {
        channelId,
        localUid: uid,
      }
    );
  };

  /**
   * Step 3-2: publishStreamToChannel2
   */
  const publishStreamToChannel2 = () => {
    engine.current.updateChannelMediaOptionsEx(
      { publishMicrophoneTrack: false, publishCameraTrack: false },
      {
        channelId,
        localUid: uid,
      }
    );
    engine.current.updateChannelMediaOptionsEx(
      { publishMicrophoneTrack: true, publishCameraTrack: true },
      {
        channelId: channelId2,
        localUid: uid2,
      }
    );
  };

  /**
   * Step 4-1: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannelEx({
      channelId,
      localUid: uid,
    });
  };

  /**
   * Step 4-2: leaveChannel2
   */
  const leaveChannel2 = () => {
    engine.current.leaveChannelEx({
      channelId: channelId2,
      localUid: uid2,
    });
  };

  useEffect(() => {
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
        if (connection.channelId === channelId) {
          setJoinChannelSuccess(true);
        } else if (connection.channelId === channelId2) {
          setJoinChannelSuccess2(true);
        }
      }
    );
    engine.current.addListener(
      'onLeaveChannel',
      (connection: RtcConnection, stats: RtcStats) => {
        log.info('onLeaveChannel', 'connection', connection, 'stats', stats);
        if (connection.channelId === channelId) {
          setJoinChannelSuccess(false);
          setRemoteUsers([]);
        } else if (connection.channelId === channelId2) {
          setJoinChannelSuccess2(false);
          setRemoteUsers2([]);
        }
        // Keep preview after leave channel
        engine.current.startPreview();
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
      }
    );
    engine.current.addListener(
      'onRemoteVideoStateChanged',
      (
        connection: RtcConnection,
        remoteUid: number,
        state: RemoteVideoState,
        reason: RemoteVideoStateReason,
        elapsed: number
      ) => {
        log.info(
          'onRemoteVideoStateChanged',
          'connection',
          connection,
          'remoteUid',
          remoteUid,
          'state',
          state,
          'reason',
          reason,
          'elapsed',
          elapsed
        );
        if (state === RemoteVideoState.RemoteVideoStateStarting) {
          if (connection.channelId === channelId) {
            setRemoteUsers([...remoteUsers, remoteUid]);
          } else if (connection.channelId === channelId2) {
            setRemoteUsers([...remoteUsers2, remoteUid]);
          }
        } else if (state === RemoteVideoState.RemoteVideoStateStopped) {
          if (connection.channelId === channelId) {
            setRemoteUsers(remoteUsers.filter((value) => value !== remoteUid));
          } else if (connection.channelId === channelId2) {
            setRemoteUsers2(
              remoteUsers2.filter((value) => value !== remoteUid)
            );
          }
        }
      }
    );

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeAllListeners();
    };
  }, [initRtcEngine, channelId, channelId2, remoteUsers, remoteUsers2]);

  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        <>
          {startPreview}
          {startPreview || joinChannelSuccess || joinChannelSuccess2 ? (
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
              dataSource={[0, ...remoteUsers, ...remoteUsers2]}
              renderItem={(item) => {
                return renderVideo(
                  item,
                  remoteUsers2.indexOf(item) === -1 ? channelId : channelId2
                );
              }}
            />
          ) : undefined}
        </>
      </AgoraView>
      <AgoraView className={AgoraStyle.rightBar}>
        <>
          <AgoraTextInput
            onChangeText={(text) => {
              setChannelId(text);
            }}
            placeholder={`channelId`}
            value={channelId}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              setUid(text === '' ? uid : +text);
            }}
            placeholder={`uid (must > 0)`}
            value={uid > 0 ? uid.toString() : ''}
          />
          <AgoraButton
            title={`${joinChannelSuccess ? 'leave' : 'join'} Channel`}
            onPress={() => {
              joinChannelSuccess ? leaveChannel() : joinChannel();
            }}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              setChannelId2(text);
            }}
            placeholder={`channelId2`}
            value={channelId2}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              setUid2(text === '' ? uid2 : +text);
            }}
            placeholder={`uid2 (must > 0)`}
            value={uid2 > 0 ? uid2.toString() : ''}
          />
          <AgoraButton
            title={`${joinChannelSuccess2 ? 'leave' : 'join'} Channel2`}
            onPress={() => {
              joinChannelSuccess2 ? leaveChannel2() : joinChannel2();
            }}
          />
        </>
        <AgoraDivider />
        <>
          <AgoraButton
            disabled={!joinChannelSuccess}
            title={`publish Stream To Channel`}
            onPress={publishStreamToChannel}
          />
          <AgoraButton
            disabled={!joinChannelSuccess2}
            title={`publish Stream To Channel2`}
            onPress={publishStreamToChannel2}
          />
        </>
      </AgoraView>
    </AgoraView>
  );
}
