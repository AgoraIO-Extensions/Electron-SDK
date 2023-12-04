import {
  ClientRoleType,
  LocalVideoStreamReason,
  LocalVideoStreamState,
  RenderModeType,
  RtcConnection,
  RtcStats,
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
  UserOfflineReasonType,
  VideoSourceType,
} from 'agora-electron-sdk';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { SketchPicker } from 'react-color';

import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraImage,
  AgoraSlider,
  AgoraSwitch,
  AgoraTextInput,
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import { thumbImageBufferToBase64 } from '../../../utils/base64';
import * as log from '../../../utils/log';
import { askMediaAccess } from '../../../utils/permissions';
import { BaseComponent } from '../components/BaseComponent';
import BaseRenderChannel from '../components/BaseRenderChannel';
import BaseRenderUsers from '../components/BaseRenderUsers';
import useInitRtcEngine from '../hooks/useInitRtcEngine';
import useResetState from '../hooks/useResetState';

export default function ScreenShare() {
  const [enableVideo] = useState<boolean>(true);
  const {
    channelId,
    setChannelId,
    token,
    uid,
    joinChannelSuccess,
    remoteUsers,
    setRemoteUsers,
    startPreview,
    engine,
  } =
    /**
     * Step 1: initRtcEngine
     */
    useInitRtcEngine(enableVideo, false);
  const [token2] = useState<string>('');
  const [uid2, setUid2] = useState<number>(0);
  const [sources, setSources, resetSources] = useResetState<
    ScreenCaptureSourceInfo[]
  >([]);
  const [targetSource, setTargetSource, resetTargetSource] = useResetState<
    ScreenCaptureSourceInfo | undefined
  >(undefined);
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [frameRate, setFrameRate] = useState<number>(15);
  const [bitrate, setBitrate] = useState<number>(0);
  const [captureMouseCursor, setCaptureMouseCursor] = useState<boolean>(true);
  const [windowFocus, setWindowFocus] = useState<boolean>(false);
  const [excludeWindowList, setExcludeWindowList] = useState<number[]>([]);
  const [highLightWidth, setHighLightWidth] = useState<number>(0);
  const [highLightColor, setHighLightColor] = useState<number>(0xff8cbf26);
  const [enableHighLight, setEnableHighLight] = useState<boolean>(false);
  const [startScreenCapture, setStartScreenCapture] = useState<boolean>(false);
  const [publishScreenCapture, setPublishScreenCapture] =
    useState<boolean>(false);

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
   * Step 3-1: getScreenCaptureSources
   */
  const getScreenCaptureSources = useCallback(() => {
    const sources = engine.current.getScreenCaptureSources(
      { width: 1920, height: 1080 },
      { width: 64, height: 64 },
      true
    );
    setSources(sources);
    setTargetSource(sources?.at(0));
  }, [engine, setSources, setTargetSource]);

  useEffect(() => {
    askMediaAccess(['screen']).then(() => {
      getScreenCaptureSources();
    });
  }, [engine, getScreenCaptureSources]);

  /**
   * Step 3-2: startScreenCapture
   */
  const _startScreenCapture = () => {
    if (!targetSource) {
      log.error('targetSource is invalid');
      return;
    }

    if (
      targetSource.type ===
      ScreenCaptureSourceType.ScreencapturesourcetypeScreen
    ) {
      engine.current.startScreenCaptureByDisplayId(
        targetSource.sourceId,
        {},
        {
          dimensions: { width, height },
          frameRate,
          bitrate,
          captureMouseCursor,
          excludeWindowList,
          excludeWindowCount: excludeWindowList.length,
          highLightWidth,
          highLightColor,
          enableHighLight,
        }
      );
    } else {
      engine.current.startScreenCaptureByWindowId(
        targetSource.sourceId,
        {},
        {
          dimensions: { width, height },
          frameRate,
          bitrate,
          windowFocus,
          highLightWidth,
          highLightColor,
          enableHighLight,
        }
      );
    }
    setStartScreenCapture(true);
  };

  /**
   * Step 3-2 (Optional): updateScreenCaptureParameters
   */
  const updateScreenCaptureParameters = () => {
    engine.current.updateScreenCaptureParameters({
      dimensions: { width, height },
      frameRate,
      bitrate,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      excludeWindowCount: excludeWindowList.length,
      highLightWidth,
      highLightColor,
      enableHighLight,
    });
  };

  /**
   * Step 3-4: publishScreenCapture
   */
  const _publishScreenCapture = () => {
    if (!channelId) {
      log.error('channelId is invalid');
      return;
    }
    if (uid2 <= 0) {
      log.error('uid2 is invalid');
      return;
    }

    // publish screen share stream
    engine.current.joinChannelEx(
      token2,
      { channelId, localUid: uid2 },
      {
        autoSubscribeAudio: false,
        autoSubscribeVideo: false,
        publishMicrophoneTrack: false,
        publishCameraTrack: false,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishScreenTrack: true,
      }
    );
  };

  /**
   * Step 3-5: stopScreenCapture
   */
  const stopScreenCapture = () => {
    engine.current.stopScreenCapture();
    setStartScreenCapture(false);
  };

  /**
   * Step 3-6: unpublishScreenCapture
   */
  const unpublishScreenCapture = () => {
    engine.current.leaveChannelEx({ channelId, localUid: uid2 });
  };

  /**
   * Step 4: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannel();
  };

  const onJoinChannelSuccess = useCallback(
    (connection: RtcConnection, elapsed: number) => {
      if (connection.localUid === uid2) {
        log.info(
          'onJoinChannelSuccess',
          'connection',
          connection,
          'elapsed',
          elapsed
        );
        setPublishScreenCapture(true);
        return;
      }
    },
    [uid2]
  );

  const onLeaveChannel = useCallback(
    (connection: RtcConnection, stats: RtcStats) => {
      log.info('onLeaveChannel', 'connection', connection, 'stats', stats);
      if (connection.localUid === uid2) {
        setPublishScreenCapture(false);
        return;
      }
      resetSources();
      resetTargetSource();
    },
    [resetSources, resetTargetSource, uid2]
  );

  const onUserJoined = useCallback(
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
      if (connection.localUid === uid2 || remoteUid === uid2) {
        // ⚠️ mute the streams from screen sharing
        engine.current.muteRemoteAudioStream(uid2, true);
        engine.current.muteRemoteVideoStream(uid2, true);
        return;
      } else {
        setRemoteUsers((prev) => {
          if (prev === undefined) return [];
          return [...prev, remoteUid];
        });
      }
    },
    [engine, setRemoteUsers, uid2]
  );

  const onUserOffline = useCallback(
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
      if (connection.localUid === uid2 || remoteUid === uid2) {
        return;
      } else {
        setRemoteUsers((prev) => {
          if (prev === undefined) return [];
          return prev!.filter((value) => value !== remoteUid);
        });
      }
    },
    [setRemoteUsers, uid2]
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
      if (source === VideoSourceType.VideoSourceScreen) {
        switch (state) {
          case LocalVideoStreamState.LocalVideoStreamStateStopped:
          case LocalVideoStreamState.LocalVideoStreamStateFailed:
            break;
          case LocalVideoStreamState.LocalVideoStreamStateCapturing:
          case LocalVideoStreamState.LocalVideoStreamStateEncoding:
            setStartScreenCapture(true);
            break;
        }
      }
    },
    []
  );

  useEffect(() => {
    engine.current.addListener('onJoinChannelSuccess', onJoinChannelSuccess);
    engine.current.addListener('onLeaveChannel', onLeaveChannel);
    engine.current.addListener('onUserJoined', onUserJoined);
    engine.current.addListener('onUserOffline', onUserOffline);
    engine.current.addListener(
      'onLocalVideoStateChanged',
      onLocalVideoStateChanged
    );

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeListener('onJoinChannelSuccess', onJoinChannelSuccess);
      engineCopy.removeListener('onLeaveChannel', onLeaveChannel);
      engineCopy.removeListener('onUserJoined', onUserJoined);
      engineCopy.removeListener('onUserOffline', onUserOffline);
      engineCopy.removeListener(
        'onLocalVideoStateChanged',
        onLocalVideoStateChanged
      );
    };
  }, [
    engine,
    onJoinChannelSuccess,
    onLeaveChannel,
    onLocalVideoStateChanged,
    onUserJoined,
    onUserOffline,
  ]);

  return (
    <BaseComponent
      name={'ScreenShare'}
      renderConfiguration={renderConfiguration}
      renderChannel={() => (
        <BaseRenderChannel
          channelId={channelId}
          joinChannel={joinChannel}
          leaveChannel={leaveChannel}
          joinChannelSuccess={joinChannelSuccess}
          onChannelIdChange={setChannelId}
        />
      )}
      renderUsers={renderUsers}
      renderAction={renderAction}
    />
  );

  function renderUsers(): ReactElement | undefined {
    return (
      <>
        <BaseRenderUsers
          enableVideo={enableVideo}
          joinChannelSuccess={joinChannelSuccess}
          remoteUsers={remoteUsers}
          startPreview={startPreview}
        />
        {startScreenCapture ? (
          <RtcSurfaceView
            canvas={{
              sourceType: VideoSourceType.VideoSourceScreen,
              renderMode: RenderModeType.RenderModeFit,
            }}
          />
        ) : undefined}
      </>
    );
  }

  function renderConfiguration(): ReactElement | undefined {
    return (
      <>
        <AgoraDropdown
          title={'targetSource'}
          items={sources?.map((value) => {
            return {
              value: value.sourceId!,
              label: value.sourceName!,
            };
          })}
          value={targetSource?.sourceId}
          onValueChange={(value, index) => {
            setTargetSource(sources?.at(index));
          }}
        />
        {targetSource ? (
          <AgoraImage
            source={thumbImageBufferToBase64(targetSource.thumbImage)}
          />
        ) : undefined}
        {uid2}
        <AgoraTextInput
          editable={!publishScreenCapture}
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            setUid2((prev) => (text === '' ? prev : +text));
          }}
          numberKeyboard={true}
          placeholder={`uid2 (must > 0)`}
          value={uid2 > 0 ? uid2.toString() : ''}
        />
        <AgoraView>
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              setWidth((prev) => (text === '' ? prev : +text));
            }}
            numberKeyboard={true}
            placeholder={`width (defaults: ${width})`}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              setHeight((prev) => (text === '' ? prev : +text));
            }}
            numberKeyboard={true}
            placeholder={`height (defaults: ${height})`}
          />
        </AgoraView>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            setFrameRate((prev) => (text === '' ? prev : +text));
          }}
          numberKeyboard={true}
          placeholder={`frameRate (defaults: ${frameRate})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            setBitrate((prev) => (text === '' ? prev : +text));
          }}
          numberKeyboard={true}
          placeholder={`bitrate (defaults: ${bitrate})`}
        />
        {targetSource?.type ===
        ScreenCaptureSourceType.ScreencapturesourcetypeScreen ? (
          <>
            <AgoraSwitch
              title={`captureMouseCursor`}
              value={captureMouseCursor}
              onValueChange={(value) => {
                setCaptureMouseCursor(value);
              }}
            />
            <AgoraDivider />
          </>
        ) : undefined}
        {targetSource?.type ===
        ScreenCaptureSourceType.ScreencapturesourcetypeWindow ? (
          <>
            <AgoraSwitch
              title={`windowFocus`}
              value={windowFocus}
              onValueChange={(value) => {
                setWindowFocus(value);
              }}
            />
            <AgoraDivider />
          </>
        ) : undefined}
        {targetSource?.type ===
        ScreenCaptureSourceType.ScreencapturesourcetypeScreen ? (
          <>
            <AgoraDropdown
              title={'excludeWindowList'}
              items={sources
                ?.filter(
                  (value) =>
                    value.type ===
                    ScreenCaptureSourceType.ScreencapturesourcetypeWindow
                )
                .map((value) => {
                  return {
                    value: value.sourceId!,
                    label: value.sourceName!,
                  };
                })}
              value={excludeWindowList}
              onValueChange={(value, index) => {
                if (excludeWindowList.indexOf(value) === -1) {
                  setExcludeWindowList((prev) => [...prev, value]);
                } else {
                  setExcludeWindowList((prev) =>
                    prev.filter((v) => v !== value)
                  );
                }
              }}
            />
            <AgoraDivider />
          </>
        ) : undefined}
        <AgoraSwitch
          title={`enableHighLight`}
          value={enableHighLight}
          onValueChange={(value) => {
            setEnableHighLight(value);
          }}
        />
        {enableHighLight ? (
          <>
            <AgoraDivider />
            <AgoraSlider
              title={`highLightWidth ${highLightWidth}`}
              minimumValue={0}
              maximumValue={50}
              step={1}
              value={highLightWidth}
              onSlidingComplete={(value) => {
                setHighLightWidth(value);
              }}
            />
            <AgoraDivider />
            <SketchPicker
              onChangeComplete={(color) => {
                const { a = 1, r, g, b } = color.rgb;
                const argbHex =
                  `${((a * 255) | (1 << 8)).toString(16).slice(1)}` +
                  `${(r | (1 << 8)).toString(16).slice(1)}` +
                  `${(g | (1 << 8)).toString(16).slice(1)}` +
                  `${(b | (1 << 8)).toString(16).slice(1)}`;
                console.log(
                  'onChangeComplete',
                  color.hex,
                  `#${argbHex}`,
                  +`0x${argbHex}`,
                  color
                );
                setHighLightColor(+`0x${argbHex}`);
              }}
              color={(function () {
                const argb = highLightColor?.toString(16);
                const rgba = `${argb.slice(2)}` + `${argb.slice(0, 2)}`;
                console.log('argb', `#${argb}`, 'rgba', `#${rgba}`);
                return `#${rgba}`;
              })()}
            />
          </>
        ) : undefined}
      </>
    );
  }

  function renderAction(): ReactElement | undefined {
    return (
      <>
        <AgoraButton
          title={`${startScreenCapture ? 'stop' : 'start'} Screen Capture`}
          onPress={startScreenCapture ? stopScreenCapture : _startScreenCapture}
        />
        <AgoraButton
          disabled={!startScreenCapture}
          title={'updateScreenCaptureParameters'}
          onPress={updateScreenCaptureParameters}
        />
        <AgoraButton
          title={`${
            publishScreenCapture ? 'unpublish' : 'publish'
          } Screen Capture`}
          onPress={
            publishScreenCapture
              ? unpublishScreenCapture
              : _publishScreenCapture
          }
        />
      </>
    );
  }
}
