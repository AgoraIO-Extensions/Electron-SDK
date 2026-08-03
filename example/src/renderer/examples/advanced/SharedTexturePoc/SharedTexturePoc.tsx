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
  shouldStopOnUnmount,
  startSharedTexturePoc,
  stopSharedTexturePoc,
  subscribeSharedTexturePocStatus,
} from './sharedTexturePocModel';

const invoke = ipcRenderer.invoke.bind(ipcRenderer);

interface SharedTexturePocViewProps {
  captureWindowState: SharedTextureCaptureWindowState;
  channelId: string;
  error: string;
  frameRate: 30 | 60;
  hideRightBar: boolean;
  lifecycle: SharedTexturePocLifecycle;
  status: SharedTexturePocStatus | null;
  onCaptureWindowStateChange: (value: SharedTextureCaptureWindowState) => void;
  onChannelChange: (value: string) => void;
  onFrameRateChange: (value: 30 | 60) => void;
  onToggleChannel: () => void;
  onToggleRightBar: () => void;
}

export function SharedTexturePocView({
  captureWindowState,
  channelId,
  error,
  frameRate,
  hideRightBar,
  lifecycle,
  status,
  onCaptureWindowStateChange,
  onChannelChange,
  onFrameRateChange,
  onToggleChannel,
  onToggleRightBar,
}: SharedTexturePocViewProps) {
  const action = getSharedTexturePocAction(lifecycle);
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        <AgoraText>{`Shared Texture PoC: ${lifecycle}`}</AgoraText>
        {status ? (
          <>
            <AgoraText>{`Stream health: ${status.health}`}</AgoraText>
            <AgoraText>{`Paint: ${status.paintCount}`}</AgoraText>
            <AgoraText>{`Submitted: ${status.submittedCount}`}</AgoraText>
            <AgoraText>{`Submission failures: ${status.submissionFailureCount}`}</AgoraText>
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
            { label: '60 fps', value: 60 },
          ]}
          onValueChange={(value) => onFrameRateChange(value as 30 | 60)}
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
          disabled={action.disabled}
          title={action.title}
          onPress={onToggleChannel}
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
  const [frameRate, setFrameRate] = useState<30 | 60>(30);
  const [captureWindowState, setCaptureWindowState] =
    useState<SharedTextureCaptureWindowState>('hidden');
  const [status, setStatus] = useState<SharedTexturePocStatus | null>(null);
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
    />
  );
}
