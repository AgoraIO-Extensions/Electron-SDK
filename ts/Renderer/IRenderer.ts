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
    this.refreshFillRenderMode();
  }

  public refreshFillRenderMode(): boolean {
    const next = isFillRenderModeEnabled(this.context);
    if (next === this._fillRenderMode) return false;
    this._fillRenderMode = next;
    this.updateRenderMode();
    return true;
  }

  protected updateRenderMode(): void {
    if (!this.canvas || !this.container) return;

    if (this._fillRenderMode) {
      // Hand the container box to the canvas and let the browser scale the
      // bitmap, rather than keeping a bitmap sized layout box and squashing it
      // with a transform.
      //
      // A bitmap sized box is centred by the flex container at
      // `(clientHeight - height) / 2`, which is half a pixel whenever that
      // difference is odd. The layer gets rasterised on that half pixel grid,
      // so once the transform and the clip have been applied the first row is
      // only half covered and blends with the black behind it. That reads as a
      // one pixel dark line along the top edge. It only shows at a device pixel
      // ratio of 1, because at 2 the half pixel is a whole device pixel.
      //
      // Owning the container box puts the layout box at an integer offset and
      // removes the transform, so the edges land on whole pixels. It also means
      // fill no longer reads the container geometry on every frame.
      this.canvas.style.transform = '';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.objectFit = 'fill';
      return;
    }

    // The proportional modes still size the layout box from the bitmap, so undo
    // what the fill branch sets before measuring.
    this.canvas.style.width = '';
    this.canvas.style.height = '';
    this.canvas.style.objectFit = '';

    const { clientWidth, clientHeight } = this.container;
    const { width, height } = this.canvas;

    const containerAspectRatio = clientWidth / clientHeight;
    const canvasAspectRatio = width / height;
    const widthScale = clientWidth / width;
    const heightScale = clientHeight / height;

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
