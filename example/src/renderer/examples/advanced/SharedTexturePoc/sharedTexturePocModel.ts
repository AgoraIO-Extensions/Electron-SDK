import Config from '../../../config/agora.config';

export interface SharedTexturePocConfig {
  appId: string;
  channelId: string;
  token: string;
  uid: number;
  frameRate: 30 | 48 | 60;
  captureWindowState: SharedTextureCaptureWindowState;
}

export type SharedTextureCaptureWindowState =
  | 'hidden'
  | 'visible'
  | 'minimized';

export interface SharedTexturePocStatus {
  state: string;
  health: 'healthy' | 'degraded' | 'failed';
  failureReason?: string | null;
  degradationReasons: string[];
  paintCount: number;
  submittedCount: number;
  submissionFailureCount: number;
  rtc: {
    encodedFrameCount: number;
    sentFrameRate: number;
    txVideoKBitRate: number;
  };
}

export type SharedTexturePocLifecycle =
  | 'idle'
  | 'joining'
  | 'joined'
  | 'leaving';

export const getInitialSharedTextureChannel = () => Config.channelId;

export const createSharedTexturePocConfig = (
  channelId: string,
  frameRate: 30 | 48 | 60 = 30,
  captureWindowState: SharedTextureCaptureWindowState = 'hidden'
): SharedTexturePocConfig => ({
  appId: Config.appId,
  channelId,
  token: Config.token,
  uid: Config.uid,
  frameRate,
  captureWindowState,
});

export const subscribeSharedTexturePocStatus = (
  ipc: {
    on: (channel: string, listener: (...args: any[]) => void) => unknown;
    removeListener: (
      channel: string,
      listener: (...args: any[]) => void
    ) => unknown;
  },
  onStatus: (status: SharedTexturePocStatus) => void
) => {
  const listener = (_event: unknown, status: SharedTexturePocStatus) =>
    onStatus(status);
  ipc.on('SHARED_TEXTURE_POC_STATUS', listener);
  return () => ipc.removeListener('SHARED_TEXTURE_POC_STATUS', listener);
};

export const shouldStopOnUnmount = (state: SharedTexturePocLifecycle) =>
  state !== 'idle';

export const getSharedTexturePocAction = (
  state: SharedTexturePocLifecycle
) => ({
  title:
    state === 'joined' || state === 'leaving'
      ? 'leave Channel'
      : 'join Channel',
  disabled: state === 'joining' || state === 'leaving',
});

export const startSharedTexturePoc = (
  invoke: (channel: string, config: SharedTexturePocConfig) => Promise<unknown>,
  config: SharedTexturePocConfig
) => invoke('SHARED_TEXTURE_POC_START', config);

export const stopSharedTexturePoc = (
  invoke: (channel: string) => Promise<unknown>
) => invoke('SHARED_TEXTURE_POC_STOP');
