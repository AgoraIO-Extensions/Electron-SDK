// NMS-32101: render parameters electron.video.render.enable_video_element / enable_r8.
//   setParameters is not intercepted: the keys go to the SDK unchanged. The rendering module reads
//   each switch from the SDK (getParameters, bool) the first time it needs it and keeps the value
//   until release; a failed read uses the default. The renderer is chosen by the switch only.
import createAgoraRtcEngine from '../AgoraSdk';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';
import { RtcEngineExInternal } from '../Private/internal/RtcEngineExInternal';
import {
  ENABLE_R8,
  ENABLE_VIDEO_ELEMENT,
  getRenderParameter,
  isR8Enabled,
  isVideoElementRendererEnabled,
  resetRenderParameters,
  setRenderParameterReader,
} from '../Renderer/RenderParameters';
import { WebGLRenderer } from '../Renderer/WebGLRenderer';
import { RendererType } from '../Types';
import * as Utils from '../Utils';

jest.mock('../Renderer/WebGLRenderer/webgl-utils', () => ({
  createProgramFromSources: jest.fn(),
}));

import { VideoSourceType } from '../Private/AgoraMediaBase';

const VideoSourceRemote = VideoSourceType.VideoSourceRemote;
const VideoSourceCamera = VideoSourceType.VideoSourceCameraPrimary; // local
const VideoSourceMediaPlayer = VideoSourceType.VideoSourceMediaPlayer;

beforeEach(() => {
  resetRenderParameters();
  jest.spyOn(Utils, 'logInfo').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe('setParameters (S2-03)', () => {
  const engine = createAgoraRtcEngine() as RtcEngineExInternal;
  const sent = (callApi: jest.SpyInstance) =>
    callApi.mock.calls
      .filter(([name]) => name.startsWith('RtcEngine_setParameters'))
      .map(([, json]) => JSON.parse(json).parameters);

  test.each([
    '{"electron.video.render.enable_video_element":true}',
    '{"electron.video.render.enable_r8":false,"rtc.video.enable_sr":{"mode":2,"enabled":false}}',
    'not json',
    '[1,2]',
  ])('sends %s to the SDK unchanged', (parameters) => {
    const callApi = jest.spyOn(AgoraElectronBridge, 'CallApi');
    engine.setParameters(parameters);
    expect(sent(callApi)).toEqual([parameters]);
  });

  test('is not intercepted: no client value, the switch comes from the SDK read only', () => {
    jest.spyOn(AgoraElectronBridge, 'CallApi');
    engine.setParameters(
      '{"electron.video.render.enable_video_element":true,"electron.video.render.enable_r8":false}'
    );
    setRenderParameterReader(() => ({ result: -7 }));
    expect(getRenderParameter(ENABLE_VIDEO_ELEMENT)).toEqual({
      value: false,
      source: 'default',
    });
    expect(getRenderParameter(ENABLE_R8)).toEqual({
      value: true,
      source: 'default',
    });
  });
});

describe('reading from the SDK (S2-04, S7-03)', () => {
  test('nothing is read until a switch is needed', () => {
    const read = jest.fn().mockReturnValue({ result: 0, value: true });
    setRenderParameterReader(read);
    expect(read).not.toHaveBeenCalled();
    isVideoElementRendererEnabled();
    expect(read.mock.calls).toEqual([[ENABLE_VIDEO_ELEMENT]]);
    isR8Enabled();
    expect(read.mock.calls).toEqual([[ENABLE_VIDEO_ELEMENT], [ENABLE_R8]]);
  });

  test('each switch is read once; later calls use the cached value', () => {
    const read = jest.fn().mockReturnValue({ result: 0, value: true });
    setRenderParameterReader(read);
    for (let i = 0; i < 3; i++) {
      isVideoElementRendererEnabled();
      isR8Enabled();
    }
    expect(read).toHaveBeenCalledTimes(2);
  });

  test('a failed read is cached too (default, no retry)', () => {
    const read = jest.fn().mockReturnValue({ result: -7 });
    setRenderParameterReader(read);
    expect(isVideoElementRendererEnabled()).toBe(false);
    expect(isVideoElementRendererEnabled()).toBe(false);
    expect(read).toHaveBeenCalledTimes(1);
  });

  test('value set before the first use takes effect (initialize -> setParameters -> setupVideo)', () => {
    let native: boolean | undefined; // what the SDK holds
    setRenderParameterReader(() =>
      native === undefined ? { result: -7 } : { result: 0, value: native }
    );
    native = true; // setParameters after initialize, before the first view
    expect(isVideoElementRendererEnabled()).toBe(true);
    native = false; // later changes apply after release + initialize
    expect(isVideoElementRendererEnabled()).toBe(true);
  });

  test.each([
    // [read result, expected value, expected source]
    [{ result: 0, value: true }, true, 'native'],
    [{ result: 0, value: false }, false, 'native'],
    [{ result: -1009 }, false, 'default'],
    [{ result: -7 }, false, 'default'],
    [{ result: 0, value: 'true' }, false, 'default'],
    [{ result: 0, value: 1 }, false, 'default'],
  ])('enable_video_element: read %p -> %p (%s)', (ret, value, source) => {
    setRenderParameterReader(() => ret);
    expect(getRenderParameter(ENABLE_VIDEO_ELEMENT)).toEqual({
      value,
      source,
    });
  });

  test.each([
    [{ result: 0, value: false }, false, 'native'],
    [{ result: 0, value: true }, true, 'native'],
    [{ result: -7 }, true, 'default'],
    [{ result: -1009 }, true, 'default'],
    [{ result: 0, value: 'false' }, true, 'default'],
    [{ result: 0, value: 0 }, true, 'default'],
  ])('enable_r8: read %p -> %p (%s)', (ret, value, source) => {
    setRenderParameterReader(() => ret);
    expect(getRenderParameter(ENABLE_R8)).toEqual({ value, source });
  });

  test('a throwing read uses the default', () => {
    setRenderParameterReader(() => {
      throw new Error('bridge');
    });
    expect(getRenderParameter(ENABLE_VIDEO_ELEMENT)).toEqual({
      value: false,
      source: 'default',
    });
  });

  test('without a reader (not initialized): default, not cached', () => {
    expect(isVideoElementRendererEnabled()).toBe(false);
    const read = jest.fn().mockReturnValue({ result: 0, value: true });
    setRenderParameterReader(read);
    expect(isVideoElementRendererEnabled()).toBe(true);
    expect(read).toHaveBeenCalledTimes(1);
  });

  test('release forgets the values; the next initialize reads again', () => {
    const read = jest.fn().mockReturnValue({ result: 0, value: true });
    setRenderParameterReader(read);
    expect(isVideoElementRendererEnabled()).toBe(true);
    resetRenderParameters();
    expect(isVideoElementRendererEnabled()).toBe(false); // no reader
    read.mockReturnValue({ result: 0, value: false });
    setRenderParameterReader(read);
    expect(isVideoElementRendererEnabled()).toBe(false);
    expect(read).toHaveBeenCalledTimes(2);
  });

  test('initialize registers the reader without reading; release resets it (S2-02)', () => {
    jest.isolateModules(() => {
      const prev = (process as any).type;
      (process as any).type = 'renderer';
      (globalThis as any).window = {}; // initialize sets window.AgoraEnv
      jest.doMock('../Renderer/CapabilityManager', () => ({
        CapabilityManager: function () {},
      }));
      try {
        const { AgoraEnv } = require('../Utils');
        AgoraEnv.enableArgusCounters = false;
        AgoraEnv.AgoraRendererManager = undefined;
        require('../AgoraSdk'); // load order of the SDK entry (circular imports)
        const {
          RtcEngineExInternal: Engine,
        } = require('../Private/internal/RtcEngineExInternal');
        const RP = require('../Renderer/RenderParameters');
        const engine = new Engine();
        const getParameters = jest
          .spyOn(engine, 'getParameters')
          .mockReturnValue({ result: 0, value: true });
        engine.initialize({});
        expect(getParameters).not.toHaveBeenCalled();
        expect(RP.isVideoElementRendererEnabled()).toBe(true);
        expect(RP.isR8Enabled()).toBe(true);
        expect(getParameters.mock.calls).toEqual([
          [ENABLE_VIDEO_ELEMENT, 'bool'],
          [ENABLE_R8, 'bool'],
        ]);
        RP.isVideoElementRendererEnabled();
        expect(getParameters).toHaveBeenCalledTimes(2);
        const bridge = require('../Private/internal/IrisApiEngine')
          .AgoraElectronBridge;
        bridge.ReleaseRenderer ??= () => {}; // not in the test addon mock
        AgoraEnv.AgoraRendererManager = undefined; // not a full manager in node
        AgoraEnv.CapabilityManager = undefined; // mocked above
        engine.release();
        expect(RP.getRenderParameter(ENABLE_VIDEO_ELEMENT).source).toBe(
          'default'
        );
        expect(getParameters).toHaveBeenCalledTimes(2);
      } finally {
        (process as any).type = prev;
        delete (globalThis as any).window;
      }
    });
  });
});

describe('renderer selection by the switch only (S2-01)', () => {
  const mockVideoElementRenderer = jest.fn();
  const mockWebGLRenderer = jest.fn();
  let isSupported = true;
  let bindThrows = false;
  let RendererManager: any;
  let RP: typeof import('../Renderer/RenderParameters'); // same module instance as RendererManager
  let U: any;
  beforeEach(() => {
    RP.resetRenderParameters(); // isolated module instance: reset it too
    jest.spyOn(U, 'isSupportWebGL').mockReturnValue(true); // no DOM in the node test env
    jest.spyOn(U, 'logInfo').mockImplementation(() => {});
  });

  beforeAll(() => {
    jest.isolateModules(() => {
      jest.doMock('../Renderer/VideoElementRenderer', () => ({
        VideoElementRenderer: Object.assign(
          function (this: any) {
            mockVideoElementRenderer();
            this.rendererType = RendererType.VIDEOELEMENT;
            this.bind = () => {
              if (bindThrows) throw new Error('MediaStreamTrackGenerator');
            };
            this.unbind = () => {};
            this.setContext = () => {};
          },
          { isSupported: () => isSupported }
        ),
      }));
      jest.doMock('../Renderer/WebGLRenderer', () => ({
        WebGLRenderer: function (this: any) {
          mockWebGLRenderer();
          this.rendererType = RendererType.WEBGL;
          this.bind = () => {};
          this.setContext = () => {};
        },
      }));
      jest.doMock('../Renderer/YUVCanvasRenderer', () => ({
        YUVCanvasRenderer: function (this: any) {
          this.rendererType = RendererType.SOFTWARE;
          this.bind = () => {};
          this.setContext = () => {};
        },
      }));
      U = require('../Utils');
      RendererManager = jest.requireActual(
        '../Renderer/RendererManager'
      ).RendererManager;
      RP = require('../Renderer/RenderParameters');
    });
  });

  const create = (ctx: any) =>
    new RendererManager().createRenderer(ctx, RendererType.WEBGL).rendererType;

  test.each([
    // [switch, sourceType, alpha, supported, expected]
    [true, VideoSourceRemote, false, true, RendererType.VIDEOELEMENT],
    [true, VideoSourceCamera, false, true, RendererType.VIDEOELEMENT],
    [true, VideoSourceMediaPlayer, false, true, RendererType.VIDEOELEMENT],
    [true, VideoSourceRemote, true, true, RendererType.WEBGL],
    [true, VideoSourceCamera, false, false, RendererType.WEBGL],
    [false, VideoSourceRemote, false, true, RendererType.WEBGL],
    [false, VideoSourceCamera, false, true, RendererType.WEBGL],
  ])(
    'switch %p, sourceType %p, alpha %p, supported %p -> rendererType %p',
    (on, sourceType, enableAlphaMask, supported, expected) => {
      isSupported = supported;
      RP.setRenderParameterReader(() => ({ result: 0, value: on }));
      expect(create({ sourceType, enableAlphaMask, uid: 1 })).toBe(expected);
    }
  );

  test('falls back to WebGL when the <video> renderer cannot be created (S6-01)', () => {
    isSupported = true;
    bindThrows = true;
    jest.spyOn(U, 'logWarn').mockImplementation(() => {});
    RP.setRenderParameterReader(() => ({ result: 0, value: true }));
    try {
      expect(create({ sourceType: VideoSourceRemote, uid: 1 })).toBe(
        RendererType.WEBGL
      );
    } finally {
      bindThrows = false;
    }
  });

  test.each([
    // [switch, alpha, expected] with the SOFTWARE default (no WebGL, e.g. hardware acceleration
    // off without SwiftShader WebGL)
    [true, false, RendererType.VIDEOELEMENT],
    [true, true, RendererType.SOFTWARE],
    [false, false, RendererType.SOFTWARE],
  ])(
    'no WebGL: switch %p, alpha %p -> rendererType %p (S6-02)',
    (on, enableAlphaMask, expected) => {
      isSupported = true;
      RP.setRenderParameterReader(() => ({ result: 0, value: on }));
      expect(
        new RendererManager().createRenderer(
          { sourceType: VideoSourceRemote, enableAlphaMask, uid: 1 },
          RendererType.SOFTWARE
        ).rendererType
      ).toBe(expected);
    }
  );

  test('the first view reads the SDK; later views do not', () => {
    isSupported = true;
    const read = jest.fn().mockReturnValue({ result: 0, value: true });
    RP.setRenderParameterReader(read);
    expect(read).not.toHaveBeenCalled();
    create({ sourceType: VideoSourceRemote, uid: 1 });
    create({ sourceType: VideoSourceCamera, uid: 0 });
    create({ sourceType: VideoSourceRemote, uid: 2 });
    expect(read.mock.calls).toEqual([[ENABLE_VIDEO_ELEMENT]]);
  });
});

describe('WebGLRenderer texture format (S7-02)', () => {
  const LUMINANCE = 0x1909;
  const R8 = 0x8229;
  const RED = 0x1903;
  class FakeWebGL2 {
    LUMINANCE = LUMINANCE;
    R8 = R8;
    RED = RED;
  }
  beforeAll(() => {
    (globalThis as any).WebGL2RenderingContext = FakeWebGL2;
  });
  afterAll(() => {
    delete (globalThis as any).WebGL2RenderingContext;
  });
  const webgl2 = () => new FakeWebGL2() as unknown as WebGLRenderingContext;
  const webgl1 = () => ({ LUMINANCE } as unknown as WebGLRenderingContext);

  test.each([
    ['webgl2, not set', webgl2, undefined, { internalFormat: R8, format: RED }],
    ['webgl2, true', webgl2, true, { internalFormat: R8, format: RED }],
    [
      'webgl2, false',
      webgl2,
      false,
      { internalFormat: LUMINANCE, format: LUMINANCE },
    ],
    [
      'webgl1, not set',
      webgl1,
      undefined,
      { internalFormat: LUMINANCE, format: LUMINANCE },
    ],
    [
      'webgl1, true',
      webgl1,
      true,
      { internalFormat: LUMINANCE, format: LUMINANCE },
    ],
  ])('%s', (_name, gl, native, expected) => {
    setRenderParameterReader(() =>
      native === undefined ? { result: -7 } : { result: 0, value: native }
    );
    expect(WebGLRenderer.selectTextureFormat(gl())).toEqual(expected);
  });

  test('the format is read once for all WebGL views', () => {
    const read = jest.fn().mockReturnValue({ result: 0, value: false });
    setRenderParameterReader(read);
    WebGLRenderer.selectTextureFormat(webgl2());
    WebGLRenderer.selectTextureFormat(webgl2());
    expect(read.mock.calls).toEqual([[ENABLE_R8]]);
  });
});
