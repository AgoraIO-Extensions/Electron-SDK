import React, { useEffect, useState, useCallback } from 'react';
import {
  ChannelProfileType,
  ErrorCodeType,
  ClientRoleType,
  createAgoraRtcEngine,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  IMusicContentCenter,
  IMusicPlayer,
  MusicContentCenterStatusCode,
  MusicChartInfo,
  MusicCollection,
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
  AgoraDropdown,
} from '../../../components/ui';

import MusicsList from './component/MusicsList';
import AgoraStyle from '../../config/public.scss';
import { _logSink, info, error } from '../../../utils/log';

export default function JoinChannelVideoWithAddlisten() {
  const [appId] = useState(Config.appId);
  const [enableVideo] = useState(true);
  const [channelId, setChannelId] = useState(Config.channelId);

  //
  const [mccUid, setMccUid] = useState<number>(333);
  const [rtmToken, setRtmToken] = useState(
    '006695752b975654e44bea00137d084c71cIACEI8tOU0O5z1EoQoZkl0kwonNd1G1gHYbbMnA1XURO3P2G15IAAAAAEABmOrPdchJSYwEA6ANyElJj'
  );
  const [initedMusicContentCenter, setinitedMusicContentCenter] =
    useState(false);
  const [requestId, setRequestId] = useState<string>();
  const [musicCollectionRequestId, setMusicCollectionRequestId] =
    useState<string>();
  const [musicChartInfos, setMusicChartInfos] = useState<MusicChartInfo[]>([]);
  const [MusicCollection, setMusicCollection] = useState<MusicCollection>();

  const [token] = useState(Config.token);
  const [uid] = useState(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState(false);
  const [engine] = useState(createAgoraRtcEngine());
  const [musicContentCenter, setMusicContentCenter] =
    useState<IMusicContentCenter>(null);
  const [musicPlayer, setMusicPlayer] = useState<IMusicPlayer>(null);

  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [startPreview, setStartPreview] = useState(false);

  /**
   * Step 1: initRtcEngine4
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

    // engine.startPreview();
    // setStartPreview(true);

    setMusicContentCenter(engine.getMusicContentCenter());
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

  /**
   *  MusicContentCenter Step 1: initialize
   *  初始化MusicContentCenter
   */
  const initMusicContentCenter = async () => {
    const result = musicContentCenter.initialize({
      appId: '695752b975654e44bea00137d084c71c',
      rtmToken,
      mccUid,
    });
    console.log('initMusicContentCenter:', result);
    console.log('存在initedMusicContentCenter？', initedMusicContentCenter);
    initedMusicContentCenter ||
      musicContentCenter.registerEventHandler({
        onMusicChartsResult: (requestId, status, result) => {
          if (
            status === MusicContentCenterStatusCode.KMusicContentCenterStatusOk
          ) {
            setMusicChartInfos(result);
            console.log('onMusicChartsResult:\n', {
              requestId,
              status,
              result,
            });
          }
        },
        onMusicCollectionResult: (requestId, status, result) => {
          if (musicCollectionRequestId == requestId) {
            console.log('onMusicCollectionResult:\n', {
              requestId,
              status,
              result,
            });
            setMusicCollection(result);
          }
        },
        onPreLoadEvent: (songCode, percent, status, msg, lyricUrl) => {
          console.log('onMusicCollectionResult:\n', {
            songCode,
            percent,
            status,
            msg,
            lyricUrl,
          });
        },
      });

    const playMusic = musicContentCenter.createMusicPlayer();
    console.log('playMusic', musicContentCenter, playMusic);
    setinitedMusicContentCenter(true);
  };

  /**
   * Step 2: getMusicCollectionByMusicChartId
   */
  const getMusicCharts = () => {
    setRequestId(musicContentCenter.getMusicCharts());
    // const _musicCollectionRequestId = musicContentCenter.getMusicCollectionByMusicChartId(1, 1, 20);
    // console.log('_musicCollectionRequestId', _musicCollectionRequestId);
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
      console.log('unregisterEventHandler');
      engine.removeAllListeners('onJoinChannelSuccess');
      engine.removeAllListeners('onLeaveChannel');
      engine.removeAllListeners('onUserOffline');
      engine.removeAllListeners('onUserJoined');
      engine.removeAllListeners('onError');
      musicContentCenter.unregisterEventHandler();
      releaseRtcEngine();
    };
  }, []);

  const configuration = renderConfiguration();
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        <MusicsList />
      </AgoraView>
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
        <AgoraText>MusicContentCenter:</AgoraText>

        {renderAction()}
      </AgoraView>
    </AgoraView>
  );

  function renderConfiguration() {
    return undefined;
  }

  // function renderUsers() {
  //   return (
  //     <>
  //       {startPreview || joinChannelSuccess ? (
  //         <List
  //           style={{ width: '100%' }}
  //           grid={{
  //             gutter: 16,
  //             xs: 1,
  //             sm: 1,
  //             md: 1,
  //             lg: 1,
  //             xl: 1,
  //             xxl: 2,
  //           }}
  //           dataSource={[uid, ...remoteUsers]}
  //           renderItem={renderVideo.bind(window)}
  //         />
  //       ) : undefined}
  //     </>
  //   );
  // }

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
    return (
      <>
        <AgoraTextInput
          onChangeText={(text) => {
            setRtmToken(text);
          }}
          placeholder={`Rtm Token`}
          value={rtmToken}
        />
        <AgoraButton
          title={`initialize`}
          onPress={() => {
            initMusicContentCenter();
          }}
        />

        <AgoraButton
          title={`GetMusicCharts`}
          onPress={() => {
            getMusicCharts();
          }}
        />

        {musicChartInfos.length ? (
          <AgoraDropdown
            title={'musicChartInfos:'}
            items={musicChartInfos.map((value) => {
              return {
                value: value.id,
                label: value.chartName,
              };
            })}
            value={musicChartInfos.length ? musicChartInfos[0].id : null}
            onValueChange={(value, index) => {
              // musicChartId
              const musicCollectionRequestId =
                musicContentCenter.getMusicCollectionByMusicChartId(
                  value,
                  1,
                  20
                );
              setMusicCollectionRequestId(musicCollectionRequestId);
              console.log(
                '_musicCollectionRequestId',
                musicCollectionRequestId,
                value
              );
              // this.setState({ targetSource: sources[index] });
            }}
          />
        ) : null}
      </>
    );
  }
}
