import Config from '../../../config/agora.config';

export interface SharedTexturePocConfig {
  appId: string;
  channelId: string;
  token: string;
  uid: number;
}

export const initialSharedTexturePocConfig: SharedTexturePocConfig = {
  appId: Config.appId,
  channelId: Config.channelId,
  token: Config.token,
  uid: Config.uid,
};

export const startSharedTexturePoc = (
  invoke: (channel: string, config: SharedTexturePocConfig) => Promise<unknown>,
  config: SharedTexturePocConfig
) => invoke('SHARED_TEXTURE_POC_START', config);

export const stopSharedTexturePoc = (
  invoke: (channel: string) => Promise<unknown>
) => invoke('SHARED_TEXTURE_POC_STOP');
