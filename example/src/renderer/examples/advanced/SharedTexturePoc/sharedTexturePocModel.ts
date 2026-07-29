import Config from '../../../config/agora.config';

export interface SharedTexturePocConfig {
  appId: string;
  channelId: string;
  token: string;
  uid: number;
}

export type SharedTexturePocLifecycle =
  | 'idle'
  | 'joining'
  | 'joined'
  | 'leaving';

export const getInitialSharedTextureChannel = () => Config.channelId;

export const createSharedTexturePocConfig = (
  channelId: string
): SharedTexturePocConfig => ({
  appId: Config.appId,
  channelId,
  token: Config.token,
  uid: Config.uid,
});

export const shouldStopOnUnmount = (state: SharedTexturePocLifecycle) =>
  state !== 'idle';

export const startSharedTexturePoc = (
  invoke: (channel: string, config: SharedTexturePocConfig) => Promise<unknown>,
  config: SharedTexturePocConfig
) => invoke('SHARED_TEXTURE_POC_START', config);

export const stopSharedTexturePoc = (
  invoke: (channel: string) => Promise<unknown>
) => invoke('SHARED_TEXTURE_POC_STOP');
