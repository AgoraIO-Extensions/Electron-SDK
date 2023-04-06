import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  ErrorCodeType,
  IRtcEngine,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
} from 'agora-electron-sdk';

import {
  AgoraButton,
  AgoraDivider,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import * as log from '../../../utils/log';
import { useInitRtcEngine } from '../../../hook/useInitRtcEngine';
import AgoraStyle from '../../config/public.scss';
import BaseRenderUsers from '../base/BaseRenderUsers';
import BaseRenderChannel from '../base/BaseRenderChannel';
import Config from '../../../config/agora.config';

export default function StringUid() {
  const [enableAudio] = useState<boolean>(true);
  const [enableVideo] = useState<boolean>(false);
  const [enablePreview] = useState<boolean>(false);
  const engine = useRef<IRtcEngine>(createAgoraRtcEngine());

  const [userAccount, setUserAccount] = useState<string>('');
  const [channelId, setChannelId] = useState<string>(Config.channelId);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState<boolean>(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);

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
    if (!userAccount) {
      log.error('userAccount is invalid');
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    engine.current.joinChannelWithUserAccount(token, channelId, userAccount, {
      // Make myself as the broadcaster to send stream to remote
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  /**
   * Step 3 (Optional): getUserInfoByUserAccount
   */
  const getUserInfoByUserAccount = () => {
    const userInfo = engine.current.getUserInfoByUserAccount(userAccount);
    if (userInfo) {
      log.debug('getUserInfoByUserAccount', userInfo);
    } else {
      log.error('getUserInfoByUserAccount');
    }
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

  const onChannelIdChange = useCallback(
    (text: string) => setChannelId(text),
    []
  );

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
        <AgoraDivider>The Configuration of StringUid</AgoraDivider>
        <>
          <AgoraTextInput
            editable={!joinChannelSuccess}
            onChangeText={(text) => {
              setUserAccount(text);
            }}
            placeholder={`userAccount`}
            value={userAccount}
          />
        </>
        <AgoraDivider />
        <>
          <AgoraButton
            disabled={!joinChannelSuccess}
            title={`get User Info By User Account`}
            onPress={getUserInfoByUserAccount}
          />
        </>
      </AgoraView>
    </AgoraView>
  );
}
