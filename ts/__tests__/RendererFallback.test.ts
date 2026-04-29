export {};

jest.mock('../Renderer/WebGLRenderer/webgl-utils', () => ({
  createProgramFromSources: jest.fn(),
}));

const { RendererManager } = jest.requireActual('../Renderer/RendererManager');
const { WebGLRenderer } = jest.requireActual('../Renderer/WebGLRenderer');
const { RenderModeType } = jest.requireActual('../Private/AgoraMediaBase');

type MockElement = {
  style: Record<string, unknown>;
  parentNode?: MockElement | null;
  clientWidth: number;
  clientHeight: number;
  appendChild: jest.Mock;
  removeChild: jest.Mock;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  querySelector: jest.Mock;
  getContext?: jest.Mock;
};

const createMockElement = (tagName = 'div'): MockElement => {
  const element: MockElement = {
    style: {},
    parentNode: null,
    clientWidth: 320,
    clientHeight: 180,
    appendChild: jest.fn((child: MockElement) => {
      child.parentNode = element;
      return child;
    }),
    removeChild: jest.fn((child: MockElement) => {
      if (child.parentNode === element) {
        child.parentNode = null;
      }
      return child;
    }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    querySelector: jest.fn(() => null),
    getContext:
      tagName === 'canvas'
        ? jest.fn(() => null)
        : undefined,
  };

  return element;
};

const createFrame = () => ({
  width: 640,
  height: 360,
  yStride: 640,
  uStride: 320,
  vStride: 320,
  rotation: 0,
  yBuffer: new Uint8Array(640 * 360),
  uBuffer: new Uint8Array(320 * 180),
  vBuffer: new Uint8Array(320 * 180),
  alphaBuffer: new Uint8Array(0),
});

describe('renderer fallback regressions', () => {
  const originalDocument = global.document;
  const originalWindow = global.window;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.document = {
      createElement: jest.fn((tagName: string) => createMockElement(tagName)),
    } as unknown as Document;
    global.window = {} as Window & typeof globalThis;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.document = originalDocument;
    global.window = originalWindow;
  });

  test('drawFrame triggers fallback only once when webgl reinitialization fails', () => {
    const fallback = jest.fn();
    const renderer = new WebGLRenderer(fallback);
    const view = createMockElement('div');
    renderer.bind(view as unknown as HTMLElement);

    renderer.drawFrame(createFrame());

    expect(fallback).toHaveBeenCalledTimes(1);
  });

  test('handleWebGLFallback skips detached renderers', () => {
    const manager = new RendererManager();
    const renderers: unknown[] = [];
    const newRenderer = {
      bind: jest.fn((view) => {
        if (!view) {
          throw new TypeError('invalid view');
        }
      }),
      setRenderOption: jest.fn(),
    };

    jest.spyOn(manager as any, 'getRenderers').mockReturnValue(renderers);
    jest.spyOn(manager as any, 'createRenderer').mockReturnValue(newRenderer);

    const renderer = {
      parentElement: undefined,
      contentMode: RenderModeType.RenderModeFit,
      mirror: true,
      enableAlphaMask: true,
      unbind: jest.fn(),
    };
    renderers.push(renderer);

    const fallback = (manager as any).handleWebGLFallback({} as any);

    expect(() => fallback(renderer)).not.toThrow();
    expect(newRenderer.bind).not.toHaveBeenCalled();
  });

  test('handleWebGLFallback preserves alpha mask when switching to software renderer', () => {
    const manager = new RendererManager();
    const renderers: unknown[] = [];
    const view = createMockElement('div') as unknown as HTMLElement;
    const newRenderer = {
      bind: jest.fn(),
      setRenderOption: jest.fn(),
    };

    jest.spyOn(manager as any, 'getRenderers').mockReturnValue(renderers);
    jest.spyOn(manager as any, 'createRenderer').mockReturnValue(newRenderer);

    const renderer = {
      parentElement: view,
      contentMode: RenderModeType.RenderModeHidden,
      mirror: false,
      enableAlphaMask: true,
      unbind: jest.fn(),
    };
    renderers.push(renderer);

    const fallback = (manager as any).handleWebGLFallback({} as any);
    fallback(renderer);

    expect(newRenderer.bind).toHaveBeenCalledWith(view);
    expect(newRenderer.setRenderOption).toHaveBeenCalledWith({
      contentMode: RenderModeType.RenderModeHidden,
      mirror: false,
      enableAlphaMask: true,
    });
  });
});
