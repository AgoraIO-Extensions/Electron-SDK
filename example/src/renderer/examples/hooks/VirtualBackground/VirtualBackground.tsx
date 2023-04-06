import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackgroundBlurDegree,
  BackgroundSourceType,
  ClientRoleType,
  createAgoraRtcEngine,
  ErrorCodeType,
  IRtcEngine,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
} from 'agora-electron-sdk';
import { SketchPicker } from 'react-color';

import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import * as log from '../../../utils/log';
import { useInitRtcEngine } from '../../../hook/useInitRtcEngine';
import AgoraStyle from '../../config/public.scss';
import BaseRenderUsers from '../base/BaseRenderUsers';
import BaseRenderChannel from '../base/BaseRenderChannel';
import Config from '../../../config/agora.config';
import { enumToItems, getResourcePath } from '../../../utils';

export default function VirtualBackground() {
  /**
   * Step 1: initRtcEngine
   */
  const [enableAudio] = useState<boolean>(false);
  const [enableVideo] = useState<boolean>(true);
  const [enablePreview] = useState<boolean>(true);
  const engine = useRef<IRtcEngine>(createAgoraRtcEngine());

  const [channelId, setChannelId] = useState<string>(Config.channelId);
  const [uid] = useState<number>(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState<boolean>(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [background_source_type, setBackground_source_type] = useState<number>(
    BackgroundSourceType.BackgroundColor
  );
  const [color, setColor] = useState<number>(0xffffff);
  const [source, setSource] = useState<string>(getResourcePath('png.png'));
  const [blur_degree, setBlur_degree] = useState<BackgroundBlurDegree>(
    BackgroundBlurDegree.BlurDegreeMedium
  );
  const [enableVirtualBackground, setEnableVirtualBackground] =
    useState<boolean>(false);

  const setupOtherExtension = useCallback(() => {
    engine.current.enableExtension(
      'agora_video_filters_segmentation',
      'portrait_segmentation',
      true
    );
  }, [engine]);

  const { token, initRtcEngine, startPreview } = useInitRtcEngine({
    enableAudio,
    enableVideo,
    enablePreview,
    engine: engine.current,
    setupOtherExtension,
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
   * Step 3-1: enableVirtualBackground
   */
  const handleEnableVirtualBackground = async () => {
    if (
      background_source_type === BackgroundSourceType.BackgroundImg &&
      !source
    ) {
      log.error('source is invalid');
      return;
    }

    engine.current.enableVirtualBackground(
      true,
      {
        background_source_type,
        color,
        source,
        blur_degree,
      },
      {}
    );
    setEnableVirtualBackground(true);
  };

  /**
   * Step 3-2: disableVirtualBackground
   */
  const disableVirtualBackground = () => {
    engine.current.enableVirtualBackground(false, {}, {});
    setEnableVirtualBackground(false);
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
        <AgoraDivider>The Configuration of VirtualBackground</AgoraDivider>
        <>
          <AgoraDropdown
            title={'backgroundSourceType'}
            items={enumToItems(BackgroundSourceType)}
            value={background_source_type}
            onValueChange={(value) => {
              setBackground_source_type(value);
            }}
          />
          {background_source_type === BackgroundSourceType.BackgroundColor ? (
            <SketchPicker
              onChangeComplete={({ hex }) => {
                setColor(+hex.replace('#', '0x'));
              }}
              color={`#${color?.toString(16)}`}
            />
          ) : undefined}
          <AgoraTextInput
            editable={
              background_source_type === BackgroundSourceType.BackgroundImg
            }
            onChangeText={(text) => {
              setSource(text);
            }}
            placeholder={'source'}
            value={source}
          />
          <AgoraDropdown
            enabled={
              background_source_type === BackgroundSourceType.BackgroundBlur
            }
            title={'blurDegree'}
            items={enumToItems(BackgroundBlurDegree)}
            value={blur_degree}
            onValueChange={(value) => {
              setBlur_degree(value);
            }}
          />
        </>
        <AgoraDivider />
        <>
          <>
            <AgoraButton
              disabled={!(startPreview || joinChannelSuccess)}
              title={`${
                enableVirtualBackground ? 'disable' : 'enable'
              } Virtual Background`}
              onPress={
                enableVirtualBackground
                  ? disableVirtualBackground
                  : handleEnableVirtualBackground
              }
            />
          </>
        </>
      </AgoraView>
    </AgoraView>
  );
}
