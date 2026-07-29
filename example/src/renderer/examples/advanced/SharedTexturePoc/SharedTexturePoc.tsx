import { ipcRenderer } from 'electron';
import React, { useState } from 'react';

import { AgoraButton, AgoraText, AgoraTextInput, AgoraView } from '../../../components/ui';
import {
  initialSharedTexturePocConfig,
  SharedTexturePocConfig,
  startSharedTexturePoc,
  stopSharedTexturePoc,
} from './sharedTexturePocModel';

export default function SharedTexturePoc() {
  const [config, setConfig] = useState<SharedTexturePocConfig>({
    ...initialSharedTexturePocConfig,
  });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const update = (key: keyof SharedTexturePocConfig, value: string | number) =>
    setConfig((current) => ({ ...current, [key]: value }));

  const toggle = async () => {
    setError('');
    try {
      const result =
        state === 'running'
          ? await stopSharedTexturePoc(ipcRenderer.invoke.bind(ipcRenderer))
          : await startSharedTexturePoc(
              ipcRenderer.invoke.bind(ipcRenderer),
              config
            );
      setState((result as { state: string }).state);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  return (
    <AgoraView style={{ maxWidth: 560, padding: 24 }}>
      <AgoraTextInput
        editable={state === 'idle'}
        placeholder="App ID"
        value={config.appId}
        onChangeText={(value) => update('appId', value)}
      />
      <AgoraTextInput
        editable={state === 'idle'}
        placeholder="Channel"
        value={config.channelId}
        onChangeText={(value) => update('channelId', value)}
      />
      <AgoraTextInput
        editable={state === 'idle'}
        placeholder="Token"
        value={config.token}
        onChangeText={(value) => update('token', value)}
      />
      <AgoraTextInput
        editable={state === 'idle'}
        numberKeyboard
        placeholder="UID"
        value={config.uid}
        onChangeText={(value) => update('uid', value === '' ? 0 : Number(value))}
      />
      <AgoraButton
        title={state === 'running' ? 'Stop' : 'Start'}
        onPress={toggle}
      />
      <AgoraText>{state}</AgoraText>
      {error ? <AgoraText style={{ color: '#cf1322' }}>{error}</AgoraText> : null}
    </AgoraView>
  );
}
