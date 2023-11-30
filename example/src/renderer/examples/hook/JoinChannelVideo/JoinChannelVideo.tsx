import {
  ClientRoleType,
  LocalVideoStreamReason,
  LocalVideoStreamState,
  VideoSourceType,
} from 'agora-electron-sdk';
import React, { useCallback, useEffect, useState } from 'react';

import * as log from '../../../utils/log';
import { BaseComponent } from '../components/BaseComponent';
import BaseRenderChannel from '../components/BaseRenderChannel';
import BaseRenderUsers from '../components/BaseRenderUsers';
import useInitRtcEngine from '../hooks/useInitRtcEngine';

export default function JoinChannelVideo() {
  const [enableVideo] = useState<boolean>(true);
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
    useInitRtcEngine(enableVideo);

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
   * Step 3: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannel();
  };

  const onVideoDeviceStateChanged = useCallback(
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
    },
    []
  );

  const onLocalVideoStateChanged = useCallback(
    (
      source: VideoSourceType,
      state: LocalVideoStreamState,
      error: LocalVideoStreamReason
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
    },
    []
  );

  useEffect(() => {
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
      engineCopy.removeListener(
        'onVideoDeviceStateChanged',
        onVideoDeviceStateChanged
      );
      engineCopy.removeListener(
        'onLocalVideoStateChanged',
        onLocalVideoStateChanged
      );
    };
  }, [engine, onLocalVideoStateChanged, onVideoDeviceStateChanged]);

  return (
    <BaseComponent
      name={'JoinChannelVideo'}
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
          startPreview={startPreview}
          joinChannelSuccess={joinChannelSuccess}
          remoteUsers={remoteUsers}
        />
      )}
    />
  );
}
