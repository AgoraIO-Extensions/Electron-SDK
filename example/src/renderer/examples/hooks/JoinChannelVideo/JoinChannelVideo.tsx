import React, { ReactNode, useEffect, useState } from 'react';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcConnection,
  RtcStats,
} from 'electron-agora-rtc-ng';

import Config from '../../../config/agora.config';

import RtcSurfaceView from '../../../components/RtcSurfaceView';
import { Card } from 'antd';

import {
  AgoraButton,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import AgoraStyle from '../../config/public.scss';

export default function JoinChannelVideoWithAddlisten() {
  const [appId] = useState(Config.appId);
  const [enableVideo, setEnableVideo] = useState(true);
  const [channelId] = useState(Config.channelId);
  const [token] = useState(Config.token);
  const [uid] = useState(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState(false);
  const [engine] = useState(createAgoraRtcEngine());

  const initRtcEngine = async () => {
    if (!appId) {
      this.error(`appId is invalid`);
    }

    engine.initialize({
      appId,
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });

    engine.enableVideo();
    engine.startPreview();
  };

  useEffect(() => {
    initRtcEngine();
    engine.addListener(
      'onJoinChannelSuccess',
      (connection: RtcConnection, elapsed: number) => {
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
        setJoinChannelSuccess(false);
        console.log(
          'addListener:onLeaveChannel',
          'connection',
          connection,
          'stats',
          stats
        );
      }
    );
    return () => {
      engine.removeAllListeners('onJoinChannelSuccess');
      engine.removeAllListeners('onLeaveChannel');
    };
  }, []);

  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        <RenderVideo
          uid={uid}
          channelId={channelId}
          enableVideo={enableVideo}
        />
      </AgoraView>
      <AgoraView className={AgoraStyle.rightBar}>
        <RenderChannel
          engine={engine}
          uid={uid}
          channelId={channelId}
          joinChannelSuccess={joinChannelSuccess}
          token={token}
        />
      </AgoraView>
    </AgoraView>
  );
}

function RenderVideo(props: {
  uid: number;
  channelId: string;
  enableVideo: boolean;
}) {
  const { uid, channelId, enableVideo } = props;
  return (
    <Card title={`${uid === 0 ? 'Local' : 'Remote'} Uid: ${uid}`}>
      <AgoraText>Click view to mirror</AgoraText>
      {enableVideo ? (
        <RtcSurfaceView canvas={{ uid }} connection={{ channelId }} />
      ) : (
        <div></div>
      )}
      {/* <AgoraButton/> */}
    </Card>
  );
}

function RenderChannel(props: {
  engine: IRtcEngine;
  channelId: string;
  joinChannelSuccess: boolean;
  uid: number;
  token: string;
}) {
  const { engine, channelId, joinChannelSuccess, uid, token } = props;
  const leaveChannel = () => {
    engine.leaveChannel();
  };
  const joinChannel = () => {
    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid < 0) {
      this.error('uid is invalid');
      return;
    }
    engine.joinChannel(token, channelId, uid, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  return (
    <>
      <AgoraTextInput
        onChangeText={(text) => {
          this.setState({ channelId: text });
        }}
        placeholder={`channelId`}
        value={channelId}
      />
      <AgoraButton
        title={`${joinChannelSuccess ? 'leave' : 'join'} Channe`}
        onPress={() => {
          joinChannelSuccess ? leaveChannel() : joinChannel();
        }}
      />
    </>
  );
}
