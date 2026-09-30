import { LeftOutlined } from '@ant-design/icons';
import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';

import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraStyle,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';

import {
  SharedTextureCaptureWindowState,
  SharedTexturePocLifecycle,
  SharedTexturePocStatus,
  createSharedTexturePocConfig,
  getInitialSharedTextureChannel,
  getSharedTexturePocAction,
  setSharedTexturePocPushing,
  shouldStopOnUnmount,
  startSharedTexturePoc,
  stopSharedTexturePoc,
  subscribeSharedTexturePocStatus,
} from './sharedTexturePocModel';

const invoke = ipcRenderer.invoke.bind(ipcRenderer);

const intervalSummaryFps = (averageMs: number) =>
  averageMs > 0 ? (1000 / averageMs).toFixed(1) : '0.0';

const formatMilliseconds = (value: number) => value.toFixed(1);

interface SharedTexturePocViewProps {
  title?: string;
  captureWindowState: SharedTextureCaptureWindowState;
  channelId: string;
  error: string;
  frameRate: 30 | 48 | 60;
  hideRightBar: boolean;
  lifecycle: SharedTexturePocLifecycle;
  pushPending: boolean;
  status: SharedTexturePocStatus | null;
  onCaptureWindowStateChange: (value: SharedTextureCaptureWindowState) => void;
  onChannelChange: (value: string) => void;
  onFrameRateChange: (value: 30 | 48 | 60) => void;
  onToggleChannel: () => void;
  onTogglePush: () => void;
  onToggleRightBar: () => void;
}

export function SharedTexturePocView({
  title = 'Shared Texture PoC',
  captureWindowState,
  channelId,
  error,
  frameRate,
  hideRightBar,
  lifecycle,
  pushPending,
  status,
  onCaptureWindowStateChange,
  onChannelChange,
  onFrameRateChange,
  onToggleChannel,
  onTogglePush,
  onToggleRightBar,
}: SharedTexturePocViewProps) {
  const action = getSharedTexturePocAction(lifecycle);
  const pushing = status?.pushing === true;
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        <AgoraText>{`${title}: ${lifecycle}`}</AgoraText>
        {status ? (
          <>
            <AgoraText>{`Stream health: ${status.health}`}</AgoraText>
            <AgoraText>{`Paint: ${status.paintCount}`}</AgoraText>
            <AgoraText>{`Submitted: ${status.submittedCount}`}</AgoraText>
            <AgoraText>{`Worker draw: ${intervalSummaryFps(
              status.workerDrawIntervalsMs.average
            )} fps`}</AgoraText>
            <AgoraText>{`Electron paint: ${intervalSummaryFps(
              status.paintIntervalsMs.average
            )} fps`}</AgoraText>
            <AgoraText>{`Paint P95 gap: ${formatMilliseconds(
              status.paintIntervalsMs.p95
            )} ms`}</AgoraText>
            <AgoraText>{`Submission P95: ${formatMilliseconds(
              status.submissionLatencyMs.p95
            )} ms`}</AgoraText>
            <AgoraText>{`Submission failures: ${status.submissionFailureCount}`}</AgoraText>
            {status.lastSubmissionError ? (
              <AgoraText
                style={{ color: '#cf1322' }}
              >{`Last submission error: ${status.lastSubmissionError}`}</AgoraText>
            ) : undefined}
            <AgoraText>{`Encoded: ${status.rtc.encodedFrameCount}`}</AgoraText>
            <AgoraText>{`Sent frame rate: ${status.rtc.sentFrameRate}`}</AgoraText>
            <AgoraText>{`Video bitrate: ${status.rtc.txVideoKBitRate} Kbps`}</AgoraText>
            {status.degradationReasons.length > 0 ? (
              <AgoraText>{`Degraded: ${status.degradationReasons.join(
                ', '
              )}`}</AgoraText>
            ) : undefined}
            {status.failureReason ? (
              <AgoraText>{`Failure: ${status.failureReason}`}</AgoraText>
            ) : undefined}
          </>
        ) : undefined}
        {error ? (
          <AgoraText style={{ color: '#cf1322' }}>{error}</AgoraText>
        ) : undefined}
      </AgoraView>
      <AgoraView
        className={`${AgoraStyle.rightBar} ${
          hideRightBar ? AgoraStyle.hide : ''
        }`}
      >
        <LeftOutlined
          className={AgoraStyle.rightBarIcon}
          onClick={onToggleRightBar}
        />
        <AgoraTextInput
          editable={lifecycle === 'idle'}
          onChangeText={onChannelChange}
          placeholder="channelId"
          value={channelId}
        />
        <AgoraDropdown
          enabled={lifecycle === 'idle'}
          items={[
            { label: '30 fps', value: 30 },
            { label: '48 fps', value: 48 },
            { label: '60 fps', value: 60 },
          ]}
          onValueChange={(value) => onFrameRateChange(value as 30 | 48 | 60)}
          title="Frame rate"
          value={frameRate}
        />
        <AgoraDropdown
          enabled={lifecycle === 'idle'}
          items={[
            { label: 'Hidden', value: 'hidden' },
            { label: 'Visible', value: 'visible' },
            { label: 'Minimized', value: 'minimized' },
          ]}
          onValueChange={(value) =>
            onCaptureWindowStateChange(value as SharedTextureCaptureWindowState)
          }
          title="Capture window"
          value={captureWindowState}
        />
        <AgoraButton
          disabled={action.disabled || pushPending}
          title={action.title}
          onPress={onToggleChannel}
        />
        <AgoraButton
          disabled={lifecycle !== 'joined' || pushPending}
          title={pushing ? '停止' : '开始'}
          onPress={onTogglePush}
        />
        <AgoraDivider />
      </AgoraView>
    </AgoraView>
  );
}

export default function SharedTexturePoc() {
  const [channelId, setChannelId] = useState(getInitialSharedTextureChannel);
  const [lifecycle, setLifecycle] = useState<SharedTexturePocLifecycle>('idle');
  const [hideRightBar, setHideRightBar] = useState(false);
  const [error, setError] = useState('');
  const [frameRate, setFrameRate] = useState<30 | 48 | 60>(30);
  const [captureWindowState, setCaptureWindowState] =
    useState<SharedTextureCaptureWindowState>('hidden');
  const [status, setStatus] = useState<SharedTexturePocStatus | null>(null);
  const [pushPending, setPushPending] = useState(false);
  const lifecycleRef = useRef(lifecycle);
  const mountedRef = useRef(true);

  const updateLifecycle = (next: SharedTexturePocLifecycle) => {
    lifecycleRef.current = next;
    setLifecycle(next);
  };

  useEffect(() => {
    const disposeStatus = subscribeSharedTexturePocStatus(
      ipcRenderer,
      setStatus
    );
    return () => {
      disposeStatus();
      mountedRef.current = false;
      if (shouldStopOnUnmount(lifecycleRef.current)) {
        void stopSharedTexturePoc(invoke).catch((cause) =>
          console.error('Shared Texture PoC cleanup failed', cause)
        );
      }
    };
  }, []);

  const toggleChannel = async () => {
    setError('');
    if (lifecycle === 'joined') {
      updateLifecycle('leaving');
      try {
        await stopSharedTexturePoc(invoke);
        if (mountedRef.current) updateLifecycle('idle');
      } catch (cause) {
        if (mountedRef.current) {
          updateLifecycle('joined');
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      }
      return;
    }

    updateLifecycle('joining');
    try {
      await startSharedTexturePoc(
        invoke,
        createSharedTexturePocConfig(channelId, frameRate, captureWindowState)
      );
      if (mountedRef.current) updateLifecycle('joined');
    } catch (cause) {
      if (mountedRef.current) {
        updateLifecycle('idle');
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    }
  };

  const togglePush = async () => {
    if (lifecycle !== 'joined') return;
    setError('');
    setPushPending(true);
    try {
      await setSharedTexturePocPushing(invoke, status?.pushing !== true);
    } catch (cause) {
      if (mountedRef.current) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    } finally {
      if (mountedRef.current) setPushPending(false);
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
      pushPending={pushPending}
      onCaptureWindowStateChange={setCaptureWindowState}
      onChannelChange={setChannelId}
      onFrameRateChange={setFrameRate}
      onToggleChannel={toggleChannel}
      onTogglePush={togglePush}
      onToggleRightBar={() => setHideRightBar((hidden) => !hidden)}
      status={status}
    />
  );
}
