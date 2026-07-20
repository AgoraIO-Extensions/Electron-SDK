import createAgoraRtcEngine from '../AgoraSdk';

test('addListener', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const callback = jest.fn();
  const callback2 = jest.fn();
  engine.addListener('onCaptureVideoFrame', callback);
  engine.addListener('onFaceInfo', callback2);
  emitEvent('onCaptureVideoFrame', EVENT_PROCESSORS.IVideoFrameObserver, {});
  emitEvent('onFaceInfo', EVENT_PROCESSORS.IFaceInfoObserver, {});
  expect(callback).toBeCalledTimes(1);
  expect(callback2).toBeCalledTimes(1);
});

test('addListenerWithSameEventTypeAndCallback', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const callback = jest.fn();
  engine.addListener('onCaptureVideoFrame', callback);
  engine.addListener('onCaptureVideoFrame', callback);
  emitEvent('onCaptureVideoFrame', EVENT_PROCESSORS.IVideoFrameObserver, {});
  expect(callback).toBeCalledTimes(2);
});

test('addListenerWithSameCallback', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const callback = jest.fn();
  engine.addListener('onCaptureVideoFrame', callback);
  engine.addListener('onRecordAudioFrame', callback);
  emitEvent('onCaptureVideoFrame', EVENT_PROCESSORS.IVideoFrameObserver, {});
  emitEvent('onRecordAudioFrame', EVENT_PROCESSORS.IAudioFrameObserver, {});
  expect(callback).toBeCalledTimes(2);
});

test('removeListener', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const callback = jest.fn();
  const callback2 = jest.fn();
  engine.addListener('onCaptureVideoFrame', callback);
  engine.addListener('onFaceInfo', callback2);
  engine.removeListener('onCaptureVideoFrame', callback);
  engine.removeListener('onFaceInfo', callback2);
  emitEvent('onCaptureVideoFrame', EVENT_PROCESSORS.IVideoFrameObserver, {});
  emitEvent('onFaceInfo', EVENT_PROCESSORS.IFaceInfoObserver, {});
  expect(callback).not.toBeCalled();
  expect(callback2).not.toBeCalled();
});

test('removeListenerWithoutCallback', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const callback = jest.fn();
  engine.addListener('onCaptureVideoFrame', callback);
  engine.removeListener('onCaptureVideoFrame');
  emitEvent('onCaptureVideoFrame', EVENT_PROCESSORS.IVideoFrameObserver, {});
  expect(callback).not.toBeCalled();
});

test('removeAllListenersWithEventType', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  engine.addListener('onCaptureVideoFrame', callback1);
  engine.addListener('onCaptureVideoFrame', callback2);
  engine.removeAllListeners('onCaptureVideoFrame');
  emitEvent('onCaptureVideoFrame', EVENT_PROCESSORS.IVideoFrameObserver, {});
  expect(callback1).not.toBeCalled();
  expect(callback2).not.toBeCalled();
});

test('removeAllListeners', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const callback3 = jest.fn();
  engine.addListener('onCaptureVideoFrame', callback1);
  engine.addListener('onRecordAudioFrame', callback2);
  engine.addListener('onFaceInfo', callback3);
  engine.removeAllListeners();
  emitEvent('onCaptureVideoFrame', EVENT_PROCESSORS.IVideoFrameObserver, {});
  emitEvent('onRecordAudioFrame', EVENT_PROCESSORS.IAudioFrameObserver, {});
  emitEvent('onFaceInfo', EVENT_PROCESSORS.IFaceInfoObserver, {});
  expect(callback1).not.toBeCalled();
  expect(callback2).not.toBeCalled();
  expect(callback3).not.toBeCalled();
});

test('pushVideoFrame sends binary fields only through native buffers', () => {
  const engine = createAgoraRtcEngine().getMediaEngine();
  const buffer = new Uint8Array([1, 2, 3]);
  const metadataBuffer = new Uint8Array([4, 5]);
  const alphaBuffer = new Uint8Array([6, 7, 8]);
  const d3d11Texture2d = { texture: 9 };
  const frame = {
    buffer,
    metadataBuffer,
    alphaBuffer,
    d3d11Texture2d,
    stride: 1280,
    height: 720,
  };
  const callApiSpy = jest
    .spyOn(AgoraElectronBridge, 'CallApi')
    .mockReturnValue({
      callApiReturnCode: 0,
      callApiResult: JSON.stringify({ result: 0 }),
    });

  try {
    expect(engine.pushVideoFrame(frame, 7)).toBe(0);
    expect(callApiSpy).toHaveBeenCalledTimes(1);

    const call = callApiSpy.mock.calls[0];
    expect(call).toBeDefined();
    const [, json, buffers, bufferCount] = call!;
    expect(buffers).toBeDefined();
    expect(bufferCount).toBe(5);
    expect(buffers![0]).toBe(buffer);
    expect(buffers![1]).toHaveLength(0);
    expect(buffers![2]).toHaveLength(0);
    expect(buffers![3]).toBe(alphaBuffer);
    expect(buffers![4]).toHaveLength(0);

    expect(frame.buffer).toBe(buffer);
    expect(frame.metadataBuffer).toBe(metadataBuffer);
    expect(frame.alphaBuffer).toBe(alphaBuffer);
    expect(frame.d3d11Texture2d).toBe(d3d11Texture2d);

    const params = JSON.parse(json);
    expect(params.videoTrackId).toBe(7);
    expect(params.frame.stride).toBe(1280);
    expect(params.frame.height).toBe(720);
    expect(params.frame).not.toHaveProperty('buffer');
    expect(params.frame).not.toHaveProperty('metadataBuffer');
    expect(params.frame).not.toHaveProperty('alphaBuffer');
    expect(params.frame).not.toHaveProperty('d3d11Texture2d');
  } finally {
    callApiSpy.mockRestore();
  }
});

import {
  AgoraElectronBridge,
  EVENT_PROCESSORS,
  emitEvent,
} from '../Private/internal/IrisApiEngine';
