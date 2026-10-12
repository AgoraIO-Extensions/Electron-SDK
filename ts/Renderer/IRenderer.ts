import { VideoMirrorModeType } from '../Private/AgoraBase';
import { RenderModeType, VideoFrame } from '../Private/AgoraMediaBase';
import { isFillRenderModeEnabled } from '../Private/internal/FillRenderMode';
import { CodecConfigInfo, RendererContext, RendererType } from '../Types';

export abstract class IRenderer {
  parentElement?: HTMLElement;
  container?: HTMLElement;
  canvas?: HTMLCanvasElement;
  rendererType: RendererType | undefined;
  context: RendererContext = {};
  private _frameCount = 0;
  private _startTime: number | null = null;
  // CSD-80258: 本 view 要不要用 fill。只在私参下发或 context 变化时重算，
  // 逐帧的 updateRenderMode() 只读它。
  private _fillRenderMode = false;

  public bind(context: RendererContext) {
    this.parentElement = context.view;
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    });
    this.parentElement?.appendChild(this.container);
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    this.container.appendChild(this.canvas);
  }

  public unbind() {
    if (this.container && this.canvas?.parentNode === this.container) {
      this.container.removeChild(this.canvas);
    }
    if (
      this.parentElement &&
      this.container?.parentNode === this.parentElement
    ) {
      this.parentElement.removeChild(this.container);
    }

    this.canvas = undefined;
    this.container = undefined;
    this.parentElement = undefined;
  }

  public drawFrame(
    uid: number,
    _videoFrame?: VideoFrame,
    _codecConfig?: CodecConfigInfo
  ): void {
    if (!this.canvas) return;
    if (this.canvas.style.display !== '') {
      this.canvas.style.display = '';
    }
  }

  public setContext(context: RendererContext) {
    if (this.context.renderMode !== context.renderMode) {
      this.context.renderMode = context.renderMode;
      this.updateRenderMode();
    }

    if (this.context.mirrorMode !== context.mirrorMode) {
      this.context.mirrorMode = context.mirrorMode;
      this.updateMirrorMode();
    }

    if (this.context.enableAlphaMask !== context.enableAlphaMask) {
      this.context.enableAlphaMask = context.enableAlphaMask;
    }
    this.context = { ...this.context, ...context };
    // uid / sourceType 可能刚变（view 首次绑定走的就是这里），重算一次 fill 命中
    this.refreshFillRenderMode();
  }

  /**
   * CSD-80258: 重算本 view 要不要用 fill，变了就立刻刷一次 transform。
   *
   * 两个触发源，都不在逐帧路径上：
   *   1. 私参下发 —— IrisApiEngine 旁听到配置变化后遍历所有 renderer 推一次；
   *   2. context 变化 —— setContext（view 首次绑定、换 uid、换 renderMode 等）。
   *
   * 关掉 fill 时同样走这里：updateRenderMode() 会按 Hidden/Fit 重算等比 scale，
   * 自动恢复原行为。
   *
   * @returns 命中状态是否发生了变化。
   */
  public refreshFillRenderMode(): boolean {
    const next = isFillRenderModeEnabled(this.context);
    if (next === this._fillRenderMode) return false;
    this._fillRenderMode = next;
    this.updateRenderMode();
    return true;
  }

  protected updateRenderMode(): void {
    if (!this.canvas || !this.container) return;

    const { clientWidth, clientHeight } = this.container;
    const { width, height } = this.canvas;

    const containerAspectRatio = clientWidth / clientHeight;
    const canvasAspectRatio = width / height;
    const widthScale = clientWidth / width;
    const heightScale = clientHeight / height;

    // CSD-80258: fill（拉伸）模式。RenderModeHidden 与 RenderModeFit 都是**等比**缩放
    // （下面那段只算一个 scale），区别只在取 max 还是 min，所以必然要么裁剪要么留边。
    // fill 要的是两轴各自独立缩放 —— 画面变形，但既不裁也不留边。
    //
    // 由私参 rtc.video.render.remote_view_fill_enable_uids 打开，公共 API 不变。
    // 这里只读一个布尔：命中判定在私参下发时算完并推进来（refreshFillRenderMode），
    // 不在逐帧路径上解析配置。
    if (this._fillRenderMode) {
      this.canvas.style.transform = `scale(${widthScale}, ${heightScale})`;
      return;
    }

    const isHidden =
      this.context.renderMode === RenderModeType.RenderModeHidden;

    let scale = 1;
    // If container's aspect ratio is larger than canvas's aspect ratio
    if (containerAspectRatio > canvasAspectRatio) {
      // Scale canvas to fit container's width on hidden mode
      // Scale canvas to fit container's height on fit mode
      scale = isHidden ? widthScale : heightScale;
    } else {
      // Scale canvas to fit container's height on hidden mode
      // Scale canvas to fit container's width on fit mode
      scale = isHidden ? heightScale : widthScale;
    }
    this.canvas.style.transform = `scale(${scale})`;
  }

  protected updateMirrorMode(): void {
    if (!this.parentElement) return;

    Object.assign(this.parentElement.style, {
      transform:
        this.context.mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled
          ? 'rotateY(180deg)'
          : '',
    });
  }

  protected rotateCanvas({ width, height, rotation }: VideoFrame): void {
    if (!this.canvas) return;

    if (rotation === 0 || rotation === 180) {
      this.canvas.width = width!;
      this.canvas.height = height!;
    } else if (rotation === 90 || rotation === 270) {
      this.canvas.height = width!;
      this.canvas.width = height!;
    } else {
      throw new Error(
        `Invalid rotation: ${rotation}, only 0, 90, 180, 270 are supported`
      );
    }
  }

  public getFps(): number {
    let fps = 0;
    if (!this.context.enableFps || !this.container) {
      return fps;
    }
    if (this._startTime == null) {
      this._startTime = performance.now();
    } else {
      const elapsed = (performance.now() - this._startTime) / 1000;
      fps = ++this._frameCount / elapsed;
    }

    let span = this.container.querySelector('span');
    if (!span) {
      span = document.createElement('span');

      Object.assign(span.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        zIndex: '10',
        width: '55px',
        background: '#fff',
      });

      this.container.style.position = 'relative';

      this.container.appendChild(span);
    }

    span.innerText = `fps: ${fps.toFixed(0)}`;

    return fps;
  }
}
