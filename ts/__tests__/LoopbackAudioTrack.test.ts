import createAgoraRtcEngine from '../AgoraSdk';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';

jest.mock('../../build/Release/agora_node_ext', () => ({
  AgoraElectronBridge: function () {
    return {
      CallApi: jest.fn(() => ({
        callApiReturnCode: 0,
        callApiResult: JSON.stringify({ result: 0 }),
      })),
      OnEvent: jest.fn(),
    };
  },
}));

const bridge = AgoraElectronBridge as any;
const nativeEvent = bridge.OnEvent.mock.calls[0][1];
const emitVolume = (trackId: number) =>
  nativeEvent(
    'AudioTrackObserver_onAudioTrackVolumeIndication_9bd73f7',
    JSON.stringify({
      trackId,
      volumeInfo: { channelCount: 2, levels: [25, 50] },
    }),
    []
  );
const failNextCall = () =>
  bridge.CallApi.mockReturnValueOnce({
    callApiReturnCode: 0,
    callApiResult: JSON.stringify({ result: -2 }),
  });

beforeEach(() => {
  createAgoraRtcEngine().getMediaEngine().release();
  bridge.CallApi.mockClear();
});

test('routes native volume callbacks to the observer for the exact track', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const a = jest.fn();
  const b = jest.fn();
  expect(
    media.registerAudioTrackObserver(7, { onAudioTrackVolumeIndication: a })
  ).toBe(0);
  expect(
    media.registerAudioTrackObserver(8, { onAudioTrackVolumeIndication: b })
  ).toBe(0);
  emitVolume(7);
  emitVolume(99);
  expect(a).toHaveBeenCalledWith(7, { channelCount: 2, levels: [25, 50] });
  expect(b).not.toHaveBeenCalled();
});

test('does not retain an observer when native registration fails', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const callback = jest.fn();
  failNextCall();
  expect(
    media.registerAudioTrackObserver(7, {
      onAudioTrackVolumeIndication: callback,
    })
  ).toBe(-2);
  emitVolume(7);
  expect(callback).not.toHaveBeenCalled();
});

test('keeps the existing observer when a duplicate registration fails', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const first = jest.fn();
  const second = jest.fn();
  media.registerAudioTrackObserver(7, { onAudioTrackVolumeIndication: first });
  failNextCall();
  expect(
    media.registerAudioTrackObserver(7, {
      onAudioTrackVolumeIndication: second,
    })
  ).toBe(-2);
  emitVolume(7);
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).not.toHaveBeenCalled();
});

test.each(['unregister', 'destroy'] as const)(
  '%s failure preserves the observer; success removes it',
  (action) => {
    const media = createAgoraRtcEngine().getMediaEngine();
    const callback = jest.fn();
    const observer = { onAudioTrackVolumeIndication: callback };
    media.registerAudioTrackObserver(7, observer);
    const remove = () =>
      action === 'unregister'
        ? media.unregisterAudioTrackObserver(7, observer)
        : media.destroyLoopbackAudioTrack(7);
    failNextCall();
    expect(remove()).toBe(-2);
    emitVolume(7);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(remove()).toBe(0);
    emitVolume(7);
    expect(callback).toHaveBeenCalledTimes(1);
  }
);

test('release clears all audio-track observers', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const callback = jest.fn();
  media.registerAudioTrackObserver(7, {
    onAudioTrackVolumeIndication: callback,
  });
  media.release();
  emitVolume(7);
  expect(callback).not.toHaveBeenCalled();
});

test('uses published Iris API IDs and preserves loopback array/count parameters', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const config = {
    loopbackType: 3,
    processId: 4294967295,
    excludedAppNames: ['app'],
    excludedAppCount: 1,
    excludedProcessIds: [1, 4294967295],
    excludedProcessCount: 2,
  };
  media.createLoopbackAudioTrack(config);
  expect(bridge.CallApi.mock.calls.at(-1).slice(0, 2)).toEqual([
    'MediaEngine_createLoopbackAudioTrack_599af35',
    JSON.stringify({ config }),
  ]);
  media.registerAudioTrackObserver(7, {});
  expect(bridge.CallApi.mock.calls.at(-1).slice(0, 2)).toEqual([
    'MediaEngine_registerAudioTrackObserver_39ac049',
    '{"id":7}',
  ]);
});

test('returns loopback sources as an array and preserves source flags', () => {
  const engine = createAgoraRtcEngine();
  const sources = [{ appName: 'player', processIds: [7, 8], processCount: 2 }];
  bridge.CallApi.mockReturnValueOnce({
    callApiReturnCode: 0,
    callApiResult: JSON.stringify({ result: sources }),
  });
  expect(engine.getLoopbackRecordingSources({ flags: 3 })).toEqual(sources);
  expect(bridge.CallApi.mock.calls.at(-1).slice(0, 2)).toEqual([
    'RtcEngine_getLoopbackRecordingSources_89105d0',
    '{"options":{"flags":3}}',
  ]);
});

test('preserves optional channel loopback fields and custom user information', () => {
  const engine = createAgoraRtcEngine();
  engine.updateChannelMediaOptions({});
  expect(JSON.parse(bridge.CallApi.mock.calls.at(-1)[1])).toEqual({
    options: {},
  });
  const options = {
    publishLoopbackAudioTrack: false,
    publishLoopbackAudioTrackIds: { trackIds: [0, 7], trackCount: 2 },
    customUserInfo: 'user-defined information',
  };
  engine.updateChannelMediaOptions(options);
  expect(JSON.parse(bridge.CallApi.mock.calls.at(-1)[1])).toEqual({ options });
});

test('returns music request IDs and dispatches the extension response fields', () => {
  const center = createAgoraRtcEngine().getMusicContentCenter();
  const callback = jest.fn();
  center.registerEventHandler({ onExtResponse: callback });
  bridge.CallApi.mockReturnValueOnce({
    callApiReturnCode: 0,
    callApiResult: JSON.stringify({ result: 0, requestId: 'request-7' }),
  });
  const jsonOption = '{"action":"query"}';
  expect(center.sendExtRequest(jsonOption)).toBe('request-7');
  expect(bridge.CallApi.mock.calls.at(-1).slice(0, 2)).toEqual([
    'MusicContentCenter_sendExtRequest_5651f34',
    JSON.stringify({ jsonOption }),
  ]);
  nativeEvent(
    'MusicContentCenterEventHandler_onExtResponse',
    JSON.stringify({
      requestId: 'request-7',
      jsonOption,
      httpCode: 200,
      response: '{"ok":true}',
    }),
    []
  );
  expect(callback).toHaveBeenCalledWith(
    'request-7',
    jsonOption,
    200,
    '{"ok":true}'
  );
});
