import createAgoraRtcEngine from '../AgoraSdk';
import {
  LocalAudioStreamReason,
  LocalAudioStreamState,
} from '../Private/AgoraBase';
import {
  AgoraElectronBridge,
  handleEvent,
} from '../Private/internal/IrisApiEngine';

function successfulCall(result: number) {
  return {
    callApiReturnCode: 0,
    callApiResult: JSON.stringify({ result }),
  };
}

test('legacy loopback creation keeps capture enabled and the waiting policy omitted', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const spy = jest
    .spyOn(AgoraElectronBridge, 'CallApi')
    .mockReturnValue(successfulCall(42));
  try {
    expect(media.createLoopbackAudioTrack({})).toBe(42);
    const [api, json] = spy.mock.calls[0]!;
    expect(api).toBe('MediaEngine_createLoopbackAudioTrack_7dc7df9');
    expect(JSON.parse(json)).toEqual({ config: {}, enable: true });
  } finally {
    spy.mockRestore();
  }
});

test('a deferred loopback track forwards false and its waiting policy without coercion', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const spy = jest
    .spyOn(AgoraElectronBridge, 'CallApi')
    .mockReturnValue(successfulCall(43));
  try {
    const config = { allowWaitingForApplication: true };
    expect(media.createLoopbackAudioTrack(config, false)).toBe(43);
    const [api, json] = spy.mock.calls[0]!;
    expect(api).toBe('MediaEngine_createLoopbackAudioTrack_7dc7df9');
    expect(JSON.parse(json)).toEqual({ config, enable: false });

    spy.mockReturnValue(successfulCall(0));
    expect(media.enableLoopbackAudioTrack(43, false)).toBe(0);
    const [enableApi, enableJson] = spy.mock.calls[1]!;
    expect(enableApi).toBe('MediaEngine_enableLoopbackAudioTrack_5f38e8a');
    expect(JSON.parse(enableJson)).toEqual({ trackId: 43, enable: false });
  } finally {
    spy.mockRestore();
  }
});

test('waiting state reaches only the registered track and stops after unregistering', () => {
  const media = createAgoraRtcEngine().getMediaEngine();
  const observer = { onAudioTrackStateChanged: jest.fn() };
  const spy = jest
    .spyOn(AgoraElectronBridge, 'CallApi')
    .mockReturnValue(successfulCall(0));
  try {
    expect(media.registerAudioTrackObserver(17, observer)).toBe(0);
    const event = 'AudioTrackObserver_onAudioTrackStateChanged_23df833';
    const state = LocalAudioStreamState.LocalAudioStreamStateStopped;
    const reason =
      LocalAudioStreamReason.LocalAudioStreamReasonWaitingForTarget;
    expect(reason).toBe(11);
    handleEvent(event, JSON.stringify({ trackId: 18, state, reason }), []);
    expect(observer.onAudioTrackStateChanged).not.toHaveBeenCalled();
    handleEvent(event, JSON.stringify({ trackId: 17, state, reason }), []);
    expect(observer.onAudioTrackStateChanged).toHaveBeenCalledWith(
      17,
      state,
      reason
    );
    expect(media.unregisterAudioTrackObserver(17, observer)).toBe(0);
    handleEvent(event, JSON.stringify({ trackId: 17, state, reason }), []);
    expect(observer.onAudioTrackStateChanged).toHaveBeenCalledTimes(1);
  } finally {
    media.release();
    spy.mockRestore();
  }
});

test('recording device test retains the API and JSON field implemented by the Iris package', () => {
  const manager = createAgoraRtcEngine().getAudioDeviceManager();
  const spy = jest
    .spyOn(AgoraElectronBridge, 'CallApi')
    .mockReturnValue(successfulCall(0));
  try {
    expect(manager.startRecordingDeviceTest(250)).toBe(0);
    const [api, json] = spy.mock.calls[0]!;
    expect(api).toBe('AudioDeviceManager_startRecordingDeviceTest_46f8ab7');
    expect(JSON.parse(json)).toEqual({ indicationInterval: 250 });
  } finally {
    spy.mockRestore();
  }
});
