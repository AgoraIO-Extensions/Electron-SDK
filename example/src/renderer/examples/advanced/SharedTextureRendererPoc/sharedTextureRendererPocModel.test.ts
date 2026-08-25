import { prepareRendererSharedTextureFrame } from './sharedTextureRendererPocModel';

test('restores the transferred handle Buffer and stamps the renderer RTC clock', () => {
  const nativeHandle = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const frame = prepareRendererSharedTextureFrame(
    {
      frameId: 1,
      nativeHandle,
      width: 640,
      height: 360,
      timestampUs: 1000,
      pixelFormat: 'bgra',
      sourceProcessId: 2468,
      ioSurfaceId: 77,
    },
    4242
  );

  expect(Buffer.isBuffer(frame.nativeHandle)).toBe(true);
  expect([...frame.nativeHandle]).toEqual([...nativeHandle]);
  expect(frame.rtcTimestampMs).toBe(4242);
  expect(frame.sourceProcessId).toBe(2468);
  expect(frame.ioSurfaceId).toBe(77);
  expect(frame.directHandlePreview).toBe(false);
});

test('rejects malformed handles and timestamps', () => {
  const base = {
    frameId: 1,
    width: 640,
    height: 360,
    timestampUs: 1000,
    pixelFormat: 'bgra' as const,
  };
  expect(() =>
    prepareRendererSharedTextureFrame(
      { ...base, nativeHandle: Buffer.alloc(4) },
      4242
    )
  ).toThrow('exactly 8 bytes');
  expect(() =>
    prepareRendererSharedTextureFrame(
      { ...base, nativeHandle: Buffer.alloc(8) },
      -1
    )
  ).toThrow('Invalid Agora monotonic timestamp');
});
