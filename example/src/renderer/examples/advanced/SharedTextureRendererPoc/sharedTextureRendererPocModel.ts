import type { SharedTextureFrame } from 'agora-electron-sdk';

export const FRAME_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_FRAME';
export const FRAME_RESULT_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_FRAME_RESULT';
export const SET_PUSHING_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_SET_PUSHING';
export const START_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_START';
export const STATS_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_STATS';
export const STATUS_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_STATUS';
export const STOP_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_STOP';

type TransferredSharedTextureFrame = Omit<
  SharedTextureFrame,
  'nativeHandle' | 'rtcTimestampMs'
> & {
  nativeHandle: Buffer | Uint8Array;
  rtcTimestampMs?: number;
};

export function prepareRendererSharedTextureFrame(
  frame: TransferredSharedTextureFrame,
  rtcTimestampMs: number,
  architecture: string = process.arch
): SharedTextureFrame {
  if (!Number.isSafeInteger(rtcTimestampMs) || rtcTimestampMs < 0) {
    throw new Error(`Invalid Agora monotonic timestamp: ${rtcTimestampMs}`);
  }
  const nativeHandle = Buffer.isBuffer(frame.nativeHandle)
    ? frame.nativeHandle
    : Buffer.from(frame.nativeHandle);
  const expectedHandleBytes = architecture === 'ia32' ? 4 : 8;
  if (nativeHandle.length !== expectedHandleBytes) {
    throw new Error(
      `Shared texture nativeHandle must contain exactly ${expectedHandleBytes} bytes`
    );
  }
  return {
    ...frame,
    nativeHandle,
    rtcTimestampMs,
    directHandlePreview: false,
  };
}

export type { TransferredSharedTextureFrame };
