export {};

const mockDrawFrame: jest.Mock = jest.fn();
const mockFormat: jest.Mock = jest.fn(() => ({ format: true }));
const mockFrame: jest.Mock = jest.fn(() => ({}));

jest.mock('yuv-buffer', () => ({
  format: mockFormat,
  frame: mockFrame,
}));

jest.mock('yuv-canvas', () => ({
  attach: jest.fn(() => ({
    drawFrame: mockDrawFrame,
  })),
}));

const { YUVCanvasRenderer } = jest.requireActual('../Renderer/YUVCanvasRenderer');

const createRenderer = () => {
  const renderer = new YUVCanvasRenderer();
  renderer.container = {
    clientWidth: 320,
    clientHeight: 180,
  } as HTMLElement;
  renderer.canvas = {
    style: {},
    width: 0,
    height: 0,
  } as HTMLCanvasElement;
  (renderer as any)._yuvCanvasSink = {
    drawFrame: mockDrawFrame,
  };
  return renderer;
};

const createFrame = (alphaBuffer: Uint8Array) => ({
  width: 640,
  height: 360,
  yStride: 640,
  uStride: 320,
  vStride: 320,
  rotation: 0,
  yBuffer: new Uint8Array(640 * 360),
  uBuffer: new Uint8Array(320 * 180),
  vBuffer: new Uint8Array(320 * 180),
  alphaBuffer,
});

describe('YUVCanvasRenderer alpha handling', () => {
  beforeEach(() => {
    mockDrawFrame.mockClear();
    mockFormat.mockClear();
    mockFrame.mockClear();
  });

  test('does not forward empty alphaBuffer to yuv-canvas', () => {
    const renderer = createRenderer();
    const yuvFrame: { a?: Uint8Array } = {};
    mockFrame.mockReturnValue(yuvFrame);

    renderer.drawFrame(createFrame(new Uint8Array(0)));

    expect(mockDrawFrame).toHaveBeenCalledWith(yuvFrame);
    expect(yuvFrame.a).toBeUndefined();
  });

  test('forwards alphaBuffer only when it matches frame size and alpha is enabled', () => {
    const renderer = createRenderer();
    renderer.enableAlphaMask = true;
    const alphaBuffer = new Uint8Array(640 * 360);
    const yuvFrame: { a?: Uint8Array } = {};
    mockFrame.mockReturnValue(yuvFrame);

    renderer.drawFrame(createFrame(alphaBuffer));

    expect(mockDrawFrame).toHaveBeenCalledWith(yuvFrame);
    expect(yuvFrame.a).toBe(alphaBuffer);
  });
});
