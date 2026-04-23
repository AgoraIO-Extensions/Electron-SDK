import createAgoraRtcEngine from '../AgoraSdk';

const nativeHandle = 1;
jest.mock('../../build/Release/agora_node_ext', () => {
  return {
    AgoraElectronBridge: function () {
      return {
        CallApi: () => {
          return {
            callApiReturnCode: 0,
            callApiResult: JSON.stringify({ result: nativeHandle }),
          };
        },
        OnEvent: () => {},
      };
    },
  };
});

test('addListener', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback);
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  expect(callback).toBeCalledTimes(1);
});

test('addListenerWithWrongData', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback);
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle: 2,
  });
  expect(callback).not.toBeCalled();
});

test('addListenerWithSameEventTypeAndCallback', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback);
  engine.addListener('onRecorderInfoUpdated', callback);
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  expect(callback).toBeCalledTimes(2);
});

test('addListenerWithSameCallback', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback);
  engine.addListener('onRecorderStateChanged', callback);
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  emitEvent('onRecorderStateChanged', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  expect(callback).toBeCalledTimes(2);
});

test('removeListener', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback);
  engine.removeListener('onRecorderInfoUpdated', callback);
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  expect(callback).not.toBeCalled();
});

test('removeListenerWithoutCallback', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback);
  engine.removeListener('onRecorderInfoUpdated');
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  expect(callback).not.toBeCalled();
});

test('removeAllListenersWithEventType', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback1);
  engine.addListener('onRecorderInfoUpdated', callback2);
  engine.removeAllListeners('onRecorderInfoUpdated');
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  expect(callback1).not.toBeCalled();
  expect(callback2).not.toBeCalled();
});

test('removeAllListeners', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  engine.addListener('onRecorderInfoUpdated', callback1);
  engine.addListener('onRecorderStateChanged', callback2);
  engine.removeAllListeners();
  emitEvent('onRecorderInfoUpdated', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  emitEvent('onRecorderStateChanged', EVENT_PROCESSORS.IMediaRecorderObserver, {
    nativeHandle,
  });
  expect(callback1).not.toBeCalled();
  expect(callback2).not.toBeCalled();
});

test('setMediaRecorderObserver should replace placeholder observer created by addListener', () => {
  const engine = createAgoraRtcEngine().createMediaRecorder({});
  engine.addListener('onRecorderInfoUpdated', jest.fn());

  const recorderObserver = {
    onRecorderInfoUpdated: jest.fn(),
  };
  engine.setMediaRecorderObserver(recorderObserver);

  const eventType = 'onRecorderInfoUpdated';
  const data = {
    nativeHandle,
    channelId: 'test-channel',
    uid: 1001,
    info: { fileName: 'test.mp4' },
  };
  const handlers = EVENT_PROCESSORS.IMediaRecorderObserver.handlers(
    eventType,
    data,
    []
  );
  handlers?.forEach((handler) => {
    if (!handler) {
      return;
    }
    EVENT_PROCESSORS.IMediaRecorderObserver.func.forEach((processor) => {
      processor(handler, eventType, data);
    });
  });

  expect(recorderObserver.onRecorderInfoUpdated).toBeCalledTimes(1);
});

import { EVENT_PROCESSORS, emitEvent } from '../Private/internal/IrisApiEngine';
