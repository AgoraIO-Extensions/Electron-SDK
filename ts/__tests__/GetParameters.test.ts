import createAgoraRtcEngine from '../AgoraSdk';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';
import { RtcEngineExInternal } from '../Private/internal/RtcEngineExInternal';

// NMS-32110: RtcEngineExInternal.getParameters -> iris RtcEngine_getParameters.
describe('getParameters', () => {
  const engine = createAgoraRtcEngine() as RtcEngineExInternal;
  let callApi: jest.SpyInstance;
  const reply = (callApiReturnCode: number, out: any) =>
    callApi.mockReturnValueOnce({
      callApiReturnCode,
      callApiResult: out === undefined ? '' : JSON.stringify(out),
    });

  beforeEach(() => {
    callApi = jest.spyOn(AgoraElectronBridge, 'CallApi');
  });
  afterEach(() => {
    callApi.mockRestore();
  });

  test('sends key and type to RtcEngine_getParameters', () => {
    reply(0, { result: 0, value: true });
    expect(
      engine.getParameters('electron.video.render.enable_video_element', 'bool')
    ).toEqual({ result: 0, value: true });
    expect(callApi).toHaveBeenCalledTimes(1);
    const [name, json] = callApi.mock.calls[0];
    expect(name).toBe('RtcEngine_getParameters');
    expect(JSON.parse(json)).toEqual({
      key: 'electron.video.render.enable_video_element',
      type: 'bool',
    });
  });

  test('passes args for array', () => {
    reply(0, { result: 0, value: [1, 2] });
    expect(engine.getParameters('k', 'array', 'a1')).toEqual({
      result: 0,
      value: [1, 2],
    });
    expect(JSON.parse(callApi.mock.calls[0][1])).toEqual({
      key: 'k',
      type: 'array',
      args: 'a1',
    });
  });

  test.each([
    ['int', -7],
    ['uint', 4000000000],
    ['number', 1.5],
    ['string', 'hello'],
    ['object', { mode: 2, enabled: false }],
    ['bool', false],
    ['string', ''],
  ])('returns %s value %p', (type, value) => {
    reply(0, { result: 0, value });
    expect(engine.getParameters('k', type as any)).toEqual({
      result: 0,
      value,
    });
  });

  test('native error: result only', () => {
    reply(0, { result: -7 });
    expect(engine.getParameters('never_set', 'bool')).toEqual({ result: -7 });
  });

  test('iris without the API: iris error code', () => {
    reply(-1009, undefined);
    expect(engine.getParameters('k', 'bool')).toEqual({ result: -1009 });
  });

  test('result 0 without value is treated as failure', () => {
    reply(0, { result: 0 });
    expect(engine.getParameters('k', 'bool')).toEqual({ result: -1 });
  });

  test('bridge throws: failure, no exception', () => {
    callApi.mockImplementationOnce(() => {
      throw new Error('boom');
    });
    expect(engine.getParameters('k', 'bool')).toEqual({ result: -1 });
  });
});
