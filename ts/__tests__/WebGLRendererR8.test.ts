// NMS-32101: WebGLRenderer uses R8 / RED textures on WebGL2 unless the private parameter
//   electron.video.render.enable_r8 is false; WebGL1 keeps LUMINANCE. The parameter is read from
//   the SDK (getParameters, bool) each time a WebGL renderer is bound, without caching.
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
import * as Utils from '../Utils';

jest.mock('../Renderer/WebGLRenderer/webgl-utils', () => ({
  createProgramFromSources: jest.fn(),
}));

beforeEach(() => {
  resetRenderParameters();
  jest.spyOn(Utils, 'logInfo').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe('reading enable_r8 from the SDK (S7-03)', () => {
  test.each([
    // [read result, expected value, expected source]
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

  test('each switch is read on its own key, at every call', () => {
    const read = jest.fn().mockReturnValue({ result: 0, value: true });
    setRenderParameterReader(read);
    isR8Enabled();
    expect(read.mock.calls).toEqual([[ENABLE_R8]]);
    isVideoElementRendererEnabled();
    isR8Enabled();
    expect(read.mock.calls).toEqual([
      [ENABLE_R8],
      [ENABLE_VIDEO_ELEMENT],
      [ENABLE_R8],
    ]);
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

  test('each WebGL view reads the format; a change applies to the next view', () => {
    const read = jest.fn().mockReturnValue({ result: 0, value: false });
    setRenderParameterReader(read);
    expect(WebGLRenderer.selectTextureFormat(webgl2())).toEqual({
      internalFormat: LUMINANCE,
      format: LUMINANCE,
    });
    read.mockReturnValue({ result: 0, value: true });
    expect(WebGLRenderer.selectTextureFormat(webgl2())).toEqual({
      internalFormat: R8,
      format: RED,
    });
    expect(read.mock.calls).toEqual([[ENABLE_R8], [ENABLE_R8]]);
  });
});
