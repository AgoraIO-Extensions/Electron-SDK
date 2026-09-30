import {
  activeChannelLevels,
  isValidLoopbackTrackId,
  loopbackTrackIds,
} from './loopbackAudioTrackModel';

test('uses explicit track IDs even for a single published track', () => {
  expect(loopbackTrackIds([7])).toEqual({ trackIds: [7], trackCount: 1 });
  expect(loopbackTrackIds([7, 9])).toEqual({
    trackIds: [7, 9],
    trackCount: 2,
  });
});

test('rejects the Native create failure sentinel', () => {
  expect(isValidLoopbackTrackId(0)).toBe(true);
  expect(isValidLoopbackTrackId(0xffffffff)).toBe(false);
  expect(isValidLoopbackTrackId(-1)).toBe(false);
});

test('reads only the valid channels in a volume snapshot', () => {
  expect(activeChannelLevels({ channelCount: 1, levels: [82, -1] })).toEqual([
    82,
  ]);
  expect(
    activeChannelLevels({ channelCount: 10, levels: Array(10).fill(42) })
  ).toHaveLength(8);
});
