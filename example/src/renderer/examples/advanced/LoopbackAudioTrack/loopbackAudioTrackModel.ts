import { AudioTrackVolumeInfo } from 'agora-electron-sdk';

export const isValidLoopbackTrackId = (id: number) =>
  Number.isInteger(id) && id >= 0 && id !== 0xffffffff;

export const loopbackTrackIds = (trackIds: number[]) => ({
  trackIds,
  trackCount: trackIds.length,
});

export const activeChannelLevels = (info: AudioTrackVolumeInfo) =>
  (info.levels ?? []).slice(
    0,
    Math.min(Math.max(info.channelCount ?? 0, 0), 8)
  );
