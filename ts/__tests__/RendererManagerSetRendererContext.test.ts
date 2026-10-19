(global as any).window = (global as any).window ?? {};
(global as any).document = {
  createElement: () => ({
    getContext: () => null,
    style: {},
    appendChild: () => {},
  }),
};

import type { RendererContext } from '../Types';

jest.mock('../Renderer/WebGLRenderer', () => ({
  WebGLRenderer: class {},
}));

const { RendererManager } = jest.requireActual('../Renderer/RendererManager');
const { IRendererCache } = jest.requireActual('../Renderer/IRendererCache');
const { IRenderer } = jest.requireActual('../Renderer/IRenderer');

const CAMERA = 0;
const MEDIA_PLAYER = 5;
const REMOTE = 9;
const HIDDEN = 1;
const FIT = 2;
const MIRROR_ON = 1;
const MIRROR_OFF = 2;

class TestRenderer extends IRenderer {
  constructor() {
    super();
    this.container = { clientWidth: 400, clientHeight: 400 } as any;
    this.canvas = { width: 640, height: 360, style: {} } as any;
  }
}

class TestCache extends IRendererCache {
  constructor(context: Partial<RendererContext>) {
    super(context);
  }

  draw() {}
  fetchVideoFrame() {
    return { hasMoreFrame: false, needRender: false };
  }
  renderFrame() {}
  startRendering() {}
  stopRendering() {}
}

interface Bound {
  label: string;
  renderer: any;
}

function setup() {
  const manager = new RendererManager();
  manager.defaultChannelId = 'ch';

  const bind = (label: string, context: any): Bound => {
    const cache = new TestCache(context);
    const renderer = new TestRenderer();
    renderer.setContext({
      ...context,
      renderMode: FIT,
      mirrorMode: MIRROR_OFF,
    });
    cache.renderers.push(renderer);
    manager.getRendererCaches().push(cache);
    return { label, renderer };
  };

  return {
    manager,
    remoteA: bind('remoteA', { channelId: 'ch', uid: 11, sourceType: REMOTE }),
    remoteB: bind('remoteB', { channelId: 'ch', uid: 12, sourceType: REMOTE }),
    local: bind('local', { channelId: '', uid: 0, sourceType: CAMERA }),
  };
}

const modeOf = (bound: Bound) => bound.renderer.context.renderMode;
const mirrorOf = (bound: Bound) => bound.renderer.context.mirrorMode;

describe('RendererManager.setRendererContext targeting', () => {
  it('applies a remote render mode to the addressed uid only', () => {
    const { manager, remoteA, remoteB, local } = setup();

    const applied = manager.setRendererContext({
      sourceType: REMOTE,
      uid: 12,
      renderMode: HIDDEN,
      mirrorMode: MIRROR_OFF,
    });

    expect(applied).toBe(true);
    expect(modeOf(remoteB)).toBe(HIDDEN);
    expect(modeOf(remoteA)).toBe(FIT);
    expect(modeOf(local)).toBe(FIT);
  });

  it('leaves the identity fields of other views untouched', () => {
    const { manager, remoteA } = setup();

    manager.setRendererContext({
      sourceType: REMOTE,
      uid: 12,
      renderMode: HIDDEN,
      mirrorMode: MIRROR_OFF,
    });

    expect(remoteA.renderer.context.uid).toBe(11);
    expect(remoteA.renderer.context.sourceType).toBe(REMOTE);
  });

  it('applies a local render mode to the local preview only', () => {
    const { manager, remoteA, remoteB, local } = setup();

    const applied = manager.setRendererContext({
      sourceType: CAMERA,
      renderMode: HIDDEN,
      mirrorMode: MIRROR_OFF,
    });

    expect(applied).toBe(true);
    expect(modeOf(local)).toBe(HIDDEN);
    expect(modeOf(remoteA)).toBe(FIT);
    expect(modeOf(remoteB)).toBe(FIT);
    expect(remoteA.renderer.context.uid).toBe(11);
    expect(remoteA.renderer.context.sourceType).toBe(REMOTE);
  });

  it('applies a local mirror mode to the local preview only', () => {
    const { manager, remoteA, local } = setup();

    manager.setRendererContext({
      sourceType: CAMERA,
      mirrorMode: MIRROR_ON,
    });

    expect(mirrorOf(local)).toBe(MIRROR_ON);
    expect(mirrorOf(remoteA)).toBe(MIRROR_OFF);
  });

  it('addresses a media player view by its player id', () => {
    const { manager, remoteA } = setup();
    const cache = new TestCache({
      channelId: '',
      uid: 7,
      sourceType: MEDIA_PLAYER,
    });
    const renderer = new TestRenderer();
    renderer.setContext({
      channelId: '',
      uid: 7,
      sourceType: MEDIA_PLAYER,
      renderMode: FIT,
    });
    cache.renderers.push(renderer);
    manager.getRendererCaches().push(cache);

    const applied = manager.setRendererContext({
      sourceType: MEDIA_PLAYER,
      mediaPlayerId: 7,
      renderMode: HIDDEN,
    });

    expect(applied).toBe(true);
    expect(renderer.context.renderMode).toBe(HIDDEN);
    expect(modeOf(remoteA)).toBe(FIT);
  });

  it('still addresses a view-carrying context by its view', () => {
    const { manager, remoteA, remoteB } = setup();
    const view = { style: {} } as any;
    remoteB.renderer.parentElement = view;

    const applied = manager.setRendererContext({
      view,
      renderMode: HIDDEN,
      mirrorMode: MIRROR_OFF,
    });

    expect(applied).toBe(true);
    expect(modeOf(remoteB)).toBe(HIDDEN);
    expect(modeOf(remoteA)).toBe(FIT);
  });

  it('reports failure and changes nothing when the target is not bound', () => {
    const { manager, remoteA, remoteB, local } = setup();

    const applied = manager.setRendererContext({
      sourceType: REMOTE,
      uid: 99,
      renderMode: HIDDEN,
      mirrorMode: MIRROR_OFF,
    });

    expect(applied).toBe(false);
    expect(modeOf(remoteA)).toBe(FIT);
    expect(modeOf(remoteB)).toBe(FIT);
    expect(modeOf(local)).toBe(FIT);
  });
});
