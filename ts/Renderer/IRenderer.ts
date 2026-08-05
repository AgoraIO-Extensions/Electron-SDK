import { VideoMirrorModeType } from '../Private/AgoraBase';
import { RenderModeType, VideoFrame } from '../Private/AgoraMediaBase';
import { CodecConfigInfo, RendererContext, RendererType } from '../Types';

export abstract class IRenderer {
  parentElement?: HTMLElement;
  container?: HTMLElement;
  canvas?: HTMLCanvasElement;
  rendererType: RendererType | undefined;
  context: RendererContext = {};
  private _frameCount = 0;
  private _startTime: number | null = null;
  private _lastRenderModeMetrics?: {
    containerWidth: number;
    containerHeight: number;
    canvasWidth: number;
    canvasHeight: number;
    renderMode: RenderModeType | undefined;
  };
  private _scaleTransform = 'scale(1)';
  private _rotationDegrees = 0;

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
    this.resetRenderModeState();
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
    this.resetRenderModeState();
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
      this.resetRenderModeMetrics();
      this.updateRenderModeIfNeeded();
    }

    if (this.context.mirrorMode !== context.mirrorMode) {
      this.context.mirrorMode = context.mirrorMode;
      this.updateMirrorMode();
    }

    if (this.context.enableAlphaMask !== context.enableAlphaMask) {
      this.context.enableAlphaMask = context.enableAlphaMask;
    }
    this.context = { ...this.context, ...context };
  }

  protected updateRenderMode(): void {
    if (!this.canvas || !this.container) return;

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
    this._scaleTransform = `scale(${scale})`;
    this.applyCanvasTransform();
  }

  protected updateRenderModeIfNeeded(): void {
    if (!this.canvas || !this.container) return;

    const metrics = {
      containerWidth: this.container.clientWidth,
      containerHeight: this.container.clientHeight,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      renderMode: this.context.renderMode,
    };

    const previousMetrics = this._lastRenderModeMetrics;
    if (
      previousMetrics &&
      previousMetrics.containerWidth === metrics.containerWidth &&
      previousMetrics.containerHeight === metrics.containerHeight &&
      previousMetrics.canvasWidth === metrics.canvasWidth &&
      previousMetrics.canvasHeight === metrics.canvasHeight &&
      previousMetrics.renderMode === metrics.renderMode
    ) {
      return;
    }

    this.updateRenderMode();
    this._lastRenderModeMetrics = metrics;
  }

  protected resetRenderModeMetrics(): void {
    this._lastRenderModeMetrics = undefined;
  }

  protected setCanvasRotation(rotation: number = 0): void {
    this._rotationDegrees = rotation;
    this.applyCanvasTransform();
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

  private applyCanvasTransform(): void {
    if (!this.canvas) return;

    const rotationTransform = this._rotationDegrees
      ? ` rotateZ(${this._rotationDegrees}deg)`
      : '';
    this.canvas.style.transform = `${this._scaleTransform}${rotationTransform}`;
  }

  private resetRenderModeState(): void {
    this._lastRenderModeMetrics = undefined;
    this._scaleTransform = 'scale(1)';
    this._rotationDegrees = 0;
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
