import { LeftOutlined } from '@ant-design/icons';
import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';

import {
  AgoraButton,
  AgoraDivider,
  AgoraStyle,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import {
  createSharedTexturePocConfig,
  getInitialSharedTextureChannel,
  getSharedTexturePocAction,
  SharedTexturePocLifecycle,
  shouldStopOnUnmount,
  startSharedTexturePoc,
  stopSharedTexturePoc,
} from './sharedTexturePocModel';

const invoke = ipcRenderer.invoke.bind(ipcRenderer);

export default function SharedTexturePoc() {
  const [channelId, setChannelId] = useState(getInitialSharedTextureChannel);
  const [lifecycle, setLifecycle] =
    useState<SharedTexturePocLifecycle>('idle');
  const [hideRightBar, setHideRightBar] = useState(false);
  const [error, setError] = useState('');
  const lifecycleRef = useRef(lifecycle);
  const mountedRef = useRef(true);

  const updateLifecycle = (next: SharedTexturePocLifecycle) => {
    lifecycleRef.current = next;
    setLifecycle(next);
  };

  useEffect(() => {
    return () => {
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
        createSharedTexturePocConfig(channelId)
      );
      if (mountedRef.current) updateLifecycle('joined');
    } catch (cause) {
      if (mountedRef.current) {
        updateLifecycle('idle');
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    }
  };

  const action = getSharedTexturePocAction(lifecycle);
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        <AgoraText>{`Shared Texture PoC: ${lifecycle}`}</AgoraText>
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
          onClick={() => setHideRightBar((hidden) => !hidden)}
        />
        <AgoraTextInput
          editable={lifecycle === 'idle'}
          onChangeText={setChannelId}
          placeholder="channelId"
          value={channelId}
        />
        <AgoraButton
          disabled={action.disabled}
          title={action.title}
          onPress={toggleChannel}
        />
        <AgoraDivider />
      </AgoraView>
    </AgoraView>
  );
}
