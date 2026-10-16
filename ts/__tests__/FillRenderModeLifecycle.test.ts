import createAgoraRtcEngine from '../AgoraSdk';
import { VideoSourceType } from '../Private/AgoraMediaBase';
import {
  FILL_RENDER_MODE_UIDS_KEY,
  getFillRenderModeUids,
  isFillRenderModeEnabled,
  parseFillRenderModeFromParameters,
  resetFillRenderMode,
  setFillRenderModeUids,
} from '../Private/internal/FillRenderMode';

const remote = (uid: number) => ({
  uid,
  sourceType: VideoSourceType.VideoSourceRemote,
});

describe('fill render mode parameter lifecycle', () => {
  beforeEach(() => {
    resetFillRenderMode();
  });

  it('starts off', () => {
    expect(getFillRenderModeUids()).toBeUndefined();
    expect(isFillRenderModeEnabled(remote(11))).toBe(false);
  });

  it('clears a match all value', () => {
    setFillRenderModeUids('*');
    expect(isFillRenderModeEnabled(remote(11))).toBe(true);

    resetFillRenderMode();

    expect(getFillRenderModeUids()).toBeUndefined();
    expect(isFillRenderModeEnabled(remote(11))).toBe(false);
  });

  it('clears a uid list', () => {
    setFillRenderModeUids('11,12');
    expect(isFillRenderModeEnabled(remote(11))).toBe(true);
    expect(isFillRenderModeEnabled(remote(13))).toBe(false);

    resetFillRenderMode();

    expect(isFillRenderModeEnabled(remote(11))).toBe(false);
    expect(isFillRenderModeEnabled(remote(12))).toBe(false);
  });

  it('is idempotent', () => {
    setFillRenderModeUids('*');
    resetFillRenderMode();
    resetFillRenderMode();
    expect(getFillRenderModeUids()).toBeUndefined();
    expect(isFillRenderModeEnabled(remote(11))).toBe(false);
  });

  it('lets the same value be applied again after a reset', () => {
    expect(setFillRenderModeUids('*')).toBe(true);
    expect(setFillRenderModeUids('*')).toBe(false);

    resetFillRenderMode();

    expect(setFillRenderModeUids('*')).toBe(true);
    expect(isFillRenderModeEnabled(remote(11))).toBe(true);
  });

  it('accepts the value again through the parameter path after a reset', () => {
    const parameters = JSON.stringify({ [FILL_RENDER_MODE_UIDS_KEY]: '11' });
    expect(parseFillRenderModeFromParameters(parameters)).toBe(true);
    expect(isFillRenderModeEnabled(remote(11))).toBe(true);

    resetFillRenderMode();

    expect(parseFillRenderModeFromParameters(parameters)).toBe(true);
    expect(isFillRenderModeEnabled(remote(11))).toBe(true);
  });
});

describe('engine release', () => {
  it('resets the fill render mode parameter', () => {
    setFillRenderModeUids('*');
    expect(isFillRenderModeEnabled(remote(11))).toBe(true);

    const engine = createAgoraRtcEngine();
    engine.release();

    expect(getFillRenderModeUids()).toBeUndefined();
    expect(isFillRenderModeEnabled(remote(11))).toBe(false);
  });

  it('leaves a re-initialized engine with fill off', () => {
    setFillRenderModeUids('11,12');

    const engine = createAgoraRtcEngine();
    engine.release();
    engine.initialize({ appId: 'app' });

    expect(isFillRenderModeEnabled(remote(11))).toBe(false);
    expect(isFillRenderModeEnabled(remote(12))).toBe(false);
    engine.release();
  });
});
