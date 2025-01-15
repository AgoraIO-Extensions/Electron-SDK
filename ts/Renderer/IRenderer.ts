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

  public bind(element: HTMLElement) {
    this.parentElement = element;
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    });
    this.parentElement.appendChild(this.container);
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
      this.updateRenderMode(context.renderMode);
    }

    if (this.context.mirrorMode !== context.mirrorMode) {
      this.updateMirrorMode(context.mirrorMode);
    }
    this.context = { ...this.context, ...context };
  }

  protected updateRenderMode(renderMode?: RenderModeType): void {
    if (!this.canvas || !this.container) return;

    const { clientWidth, clientHeight } = this.container;
    const { width, height } = this.canvas;

    const containerAspectRatio = clientWidth / clientHeight;
    const canvasAspectRatio = width / height;
    const widthScale = clientWidth / width;
    const heightScale = clientHeight / height;
    const isHidden = renderMode === RenderModeType.RenderModeHidden;

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

  protected updateMirrorMode(mirrorMode?: VideoMirrorModeType): void {
    if (!this.parentElement) return;

    Object.assign(this.parentElement.style, {
      transform:
        mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled
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
