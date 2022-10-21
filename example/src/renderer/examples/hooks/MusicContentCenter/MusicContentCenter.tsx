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
  Music,
  PreloadStatusCode,
  MediaPlayerState
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

  const [mccUid] = useState<number>(333);
  const [rtmToken, setRtmToken] = useState(
    '006695752b975654e44bea00137d084c71cIABuvxvygEFterthWg0JvQZQqLOYK3969qaDJiKCpgnezf2G15IAAAAAEAAFKVBPBGdTYwEA6AMEZ1Nj'
  );
  const [initedMusicContentCenter, setinitedMusicContentCenter] =
    useState(false);
  // const [requestId, setRequestId] = useState<string>();
  const [musicCollectionRequestId, setMusicCollectionRequestId] =
    useState<string>();
  const [musicChartInfos, setMusicChartInfos] = useState<MusicChartInfo[]>([]);
  const [musicCollection, setMusicCollection] = useState<MusicCollection>();
  const [musicList, setMusiclist] = useState<Music[]>();
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

    initedMusicContentCenter ||
      musicContentCenter.registerEventHandler({
        onMusicChartsResult: (requestId, status, result) => {
          if (
            status === MusicContentCenterStatusCode.KMusicContentCenterStatusOk
          ) {
            setMusicChartInfos(result);
            console.log('onMusicChartsResult:musicCollectionRequestId\n', {
              requestId,
              status,
              result,
            });
          }
        },
        onMusicCollectionResult: (requestId, status, result) => {
          console.log('onMusicCollectionResult:\n', {
            requestId,
            status,
            result,
          });

          let collection: Music[] = [];
          for (let i = 0; i < result.getCount(); i++) {
            collection.push(result.getMusic(i));
          }
          setMusiclist(collection);
          setMusicCollection(result);
        },
        onPreLoadEvent: (songCode, percent, status, msg, lyricUrl) => {
          console.log('资源加载onPreLoadEvent:\n', {
            songCode,
            percent,
            status,
            msg,
            lyricUrl,
          });
          if (status === PreloadStatusCode.KPreloadStatusPreloading) {
            console.log('加载完成');
          }
        },
        onLyricResult: (requestId, lyricUrl) => {
          console.log('onLyricResult', { requestId, lyricUrl });
        },
      });

    setMusicPlayer(musicContentCenter.createMusicPlayer());
    setinitedMusicContentCenter(true);
  };

  /**
   * MusicContentCenter Step 2: getMusicCharts
   */
  const getMusicCharts = () => {
    musicContentCenter.getMusicCharts();
    // setRequestId(musicContentCenter.getMusicCharts());
  };

  /**
   * MusicContentCenter Step 3: getMusicCollectionByMusicChartId
   */
  const getMusicCollectionByMusicChartId = (musicChartId) => {
    setMusicCollectionRequestId(
      musicContentCenter.getMusicCollectionByMusicChartId(musicChartId, 1, 20)
    );
  };

  /**
   * MusicContentCenter Step 4: preload
   */
  const preload = (songCode: number) => {
    console.log(preload);
    musicContentCenter.preload(songCode);
  };

  /**
   * MusicContentCenter Step 5: openWithSongCode
   */
  const openWithSongCode = (songCode: number) => {
    musicPlayer.openWithSongCode(songCode);
  };
  

  useEffect(() => {
    if(musicPlayer) {

      musicPlayer.registerPlayerSourceObserver({
        onPlayerSourceStateChanged:(state, ec) => {
          console.log('');
          if (state === MediaPlayerState.PlayerStateOpenCompleted) {
            musicPlayer.play();
          }
          
        }
      });
      (window as any).musicPlayer = musicPlayer;
    }
  }, [musicPlayer]);
  
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
      // musicContentCenter.unregisterEventHandler();
      releaseRtcEngine();
    };
  }, []);
  
  const configuration = renderConfiguration();
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        {musicCollection && (
          <MusicsList
            musicList={musicList}
            preload={(songCode: number)=> preload(songCode)}
            openWithSongCode={(songCode: number)=> openWithSongCode(songCode)}
          />
        )}
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
              getMusicCollectionByMusicChartId(value);
            }}
          />
        ) : null}
      </>
    );
  }
}
