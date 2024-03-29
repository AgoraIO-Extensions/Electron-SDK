import createAgoraRtcEngine from '../AgoraSdk';

const playerId = 1;
jest.mock('../../build/Release/agora_node_ext', () => {
  return {
    AgoraElectronBridge: function () {
      return {
        CallApi: () => {
          return {
            callApiReturnCode: 0,
            callApiResult: JSON.stringify({ result: playerId }),
          };
        },
        OnEvent: () => {},
      };
    },
  };
});

test('addListener', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback);
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId }
  );
  expect(callback).toBeCalledTimes(1);
});

test('addListenerWithWrongData', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback);
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId: 2 }
  );
  expect(callback).not.toBeCalled();
});

test('addListenerWithSameEventTypeAndCallback', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback);
  engine.addListener('onAgoraCDNTokenWillExpire', callback);
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId }
  );
  expect(callback).toBeCalledTimes(2);
});

test('addListenerWithSameCallback', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback);
  engine.addListener('onFrame', callback);
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId }
  );
  emitEvent('onFrame', EVENT_PROCESSORS.IMediaPlayerVideoFrameObserver, {
    playerId,
  });
  expect(callback).toBeCalledTimes(2);
});

test('removeListener', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback);
  engine.removeListener('onAgoraCDNTokenWillExpire', callback);
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId }
  );
  expect(callback).not.toBeCalled();
});

test('removeListenerWithoutCallback', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback);
  engine.removeListener('onAgoraCDNTokenWillExpire');
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId }
  );
  expect(callback).not.toBeCalled();
});

test('removeAllListenersWithEventType', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback1);
  engine.addListener('onAgoraCDNTokenWillExpire', callback2);
  engine.removeAllListeners('onAgoraCDNTokenWillExpire');
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId }
  );
  expect(callback1).not.toBeCalled();
  expect(callback2).not.toBeCalled();
});

test('removeAllListeners', () => {
  const engine = createAgoraRtcEngine().createMediaPlayer();
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  engine.addListener('onAgoraCDNTokenWillExpire', callback1);
  engine.addListener('onFrame', callback2);
  engine.removeAllListeners();
  emitEvent(
    'onAgoraCDNTokenWillExpire',
    EVENT_PROCESSORS.IMediaPlayerSourceObserver,
    { playerId }
  );
  emitEvent('onFrame', EVENT_PROCESSORS.IMediaPlayerVideoFrameObserver, {
    playerId,
  });
  expect(callback1).not.toBeCalled();
  expect(callback2).not.toBeCalled();
});

import { EVENT_PROCESSORS, emitEvent } from '../Private/internal/IrisApiEngine';
