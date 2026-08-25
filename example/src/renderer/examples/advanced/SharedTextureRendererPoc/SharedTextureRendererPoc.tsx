import {
  IAgoraElectronBridge,
  IRtcEngine,
  IRtcEngineEventHandler,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';

import { SharedTexturePocView } from '../SharedTexturePoc/SharedTexturePoc';
import {
  SharedTextureCaptureWindowState,
  SharedTexturePocLifecycle,
  SharedTexturePocStatus,
  createSharedTexturePocConfig,
  getInitialSharedTextureChannel,
  shouldStopOnUnmount,
} from '../SharedTexturePoc/sharedTexturePocModel';

import {
  FRAME_CHANNEL,
  FRAME_RESULT_CHANNEL,
  START_CHANNEL,
  STATS_CHANNEL,
  STATUS_CHANNEL,
  STOP_CHANNEL,
  TransferredSharedTextureFrame,
  prepareRendererSharedTextureFrame,
} from './sharedTextureRendererPocModel';

const { AgoraElectronBridge } =
  require('agora-electron-sdk/js/Private/internal/IrisApiEngine.js') as {
    AgoraElectronBridge: IAgoraElectronBridge;
  };

type MediaEngine = ReturnType<IRtcEngine['getMediaEngine']>;

function requireSuccess(result: number, operation: string) {
  if (result < 0) throw new Error(`${operation} failed with result ${result}`);
}

function releaseEngine(
  engine: IRtcEngine | null,
  mediaEngine: MediaEngine | null
) {
  if (!engine) return;
  try {
    engine.leaveChannel();
    mediaEngine?.setExternalVideoSource(false, true, 0);
  } finally {
    engine.release();
  }
}

export default function SharedTextureRendererPoc() {
  const [channelId, setChannelId] = useState(getInitialSharedTextureChannel);
  const [lifecycle, setLifecycle] = useState<SharedTexturePocLifecycle>('idle');
  const [hideRightBar, setHideRightBar] = useState(false);
  const [error, setError] = useState('');
  const [frameRate, setFrameRate] = useState<30 | 48 | 60>(30);
  const [captureWindowState, setCaptureWindowState] =
    useState<SharedTextureCaptureWindowState>('hidden');
  const [status, setStatus] = useState<SharedTexturePocStatus | null>(null);
  const lifecycleRef = useRef(lifecycle);
  const mountedRef = useRef(true);
  const engineRef = useRef<IRtcEngine | null>(null);
  const mediaEngineRef = useRef<MediaEngine | null>(null);

  const updateLifecycle = (next: SharedTexturePocLifecycle) => {
    lifecycleRef.current = next;
    if (mountedRef.current) setLifecycle(next);
  };

  const stop = async () => {
    try {
      await ipcRenderer.invoke(STOP_CHANNEL);
    } finally {
      const engine = engineRef.current;
      const mediaEngine = mediaEngineRef.current;
      engineRef.current = null;
      mediaEngineRef.current = null;
      releaseEngine(engine, mediaEngine);
    }
  };

  useEffect(() => {
    const handleStatus = (_event: unknown, snapshot: SharedTexturePocStatus) =>
      setStatus(snapshot);
    const handleFrame = async (
      _event: unknown,
      transferredFrame: TransferredSharedTextureFrame
    ) => {
      const frameId = transferredFrame?.frameId;
      try {
        const engine = engineRef.current;
        if (!engine) throw new Error('Renderer RTC Engine is not running');
        const frame = prepareRendererSharedTextureFrame(
          transferredFrame,
          engine.getCurrentMonotonicTimeInMs()
        );
        const result = await AgoraElectronBridge.PushSharedTexture(frame);
        ipcRenderer.send(FRAME_RESULT_CHANNEL, {
          frameId,
          result: result.result,
          rtcTimestampMs: frame.rtcTimestampMs,
        });
      } catch (cause) {
        ipcRenderer.send(FRAME_RESULT_CHANNEL, {
          frameId,
          error: cause instanceof Error ? cause.message : String(cause),
        });
      }
    };
    ipcRenderer.on(STATUS_CHANNEL, handleStatus);
    ipcRenderer.on(FRAME_CHANNEL, handleFrame);
    return () => {
      mountedRef.current = false;
      if (shouldStopOnUnmount(lifecycleRef.current)) {
        void stop().catch((cause) =>
          console.error('Renderer Engine Shared Texture cleanup failed', cause)
        );
      }
      ipcRenderer.removeListener(STATUS_CHANNEL, handleStatus);
      ipcRenderer.removeListener(FRAME_CHANNEL, handleFrame);
    };
  }, []);

  const start = async () => {
    const config = createSharedTexturePocConfig(
      channelId,
      frameRate,
      captureWindowState
    );
    const engine = createAgoraRtcEngine();
    engineRef.current = engine;
    let joined = false;
    const joinedPromise = new Promise<void>((resolve, reject) => {
      const eventHandler: IRtcEngineEventHandler = {
        onJoinChannelSuccess: () => {
          joined = true;
          resolve();
        },
        onError: (errorCode, message) => {
          const cause = new Error(`RTC error ${errorCode}: ${message || ''}`);
          if (!joined) reject(cause);
          else if (mountedRef.current) setError(cause.message);
        },
        onRtcStats: (_connection, stats) =>
          ipcRenderer.send(STATS_CHANNEL, { type: 'rtc', stats }),
        onLocalVideoStats: (_connection, stats) =>
          ipcRenderer.send(STATS_CHANNEL, { type: 'localVideo', stats }),
      };
      engine.registerEventHandler(eventHandler);
    });

    try {
      requireSuccess(engine.initialize({ appId: config.appId }), 'initialize');
      requireSuccess(engine.enableVideo(), 'enableVideo');
      const mediaEngine = engine.getMediaEngine();
      mediaEngineRef.current = mediaEngine;
      requireSuccess(
        mediaEngine.setExternalVideoSource(true, true, 0),
        'setExternalVideoSource'
      );
      requireSuccess(
        engine.setVideoEncoderConfiguration({ frameRate }),
        'setVideoEncoderConfiguration'
      );
      requireSuccess(
        engine.joinChannel(config.token, config.channelId, config.uid, {
          publishCameraTrack: false,
          publishMicrophoneTrack: false,
          publishCustomVideoTrack: true,
          customVideoTrackId: 1,
          clientRoleType: 1,
        }),
        'joinChannel'
      );
      await joinedPromise;
      await ipcRenderer.invoke(START_CHANNEL, config);
    } catch (cause) {
      try {
        await ipcRenderer.invoke(STOP_CHANNEL);
      } catch {
        // Capture may not have started yet.
      }
      const mediaEngine = mediaEngineRef.current;
      engineRef.current = null;
      mediaEngineRef.current = null;
      releaseEngine(engine, mediaEngine);
      throw cause;
    }
  };

  const toggleChannel = async () => {
    setError('');
    if (lifecycle === 'joined') {
      updateLifecycle('leaving');
      try {
        await stop();
        updateLifecycle('idle');
      } catch (cause) {
        updateLifecycle('joined');
        if (mountedRef.current) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      }
      return;
    }

    updateLifecycle('joining');
    try {
      await start();
      updateLifecycle('joined');
    } catch (cause) {
      updateLifecycle('idle');
      if (mountedRef.current) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    }
  };

  return (
    <SharedTexturePocView
      captureWindowState={captureWindowState}
      channelId={channelId}
      error={error}
      frameRate={frameRate}
      hideRightBar={hideRightBar}
      lifecycle={lifecycle}
      onCaptureWindowStateChange={setCaptureWindowState}
      onChannelChange={setChannelId}
      onFrameRateChange={setFrameRate}
      onToggleChannel={toggleChannel}
      onToggleRightBar={() => setHideRightBar((hidden) => !hidden)}
      status={status}
      title="Shared Texture PoC (Renderer Engine)"
    />
  );
}
