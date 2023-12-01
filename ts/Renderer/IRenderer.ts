import { VideoMirrorModeType } from '../Private/AgoraBase';
import { RenderModeType, VideoFrame } from '../Private/AgoraMediaBase';
import { RendererContext } from '../Types';

export type _RendererContext = Pick<
  RendererContext,
  'renderMode' | 'mirrorMode'
>;

export abstract class IRenderer {
  parentElement?: HTMLElement;
  container?: HTMLElement;
  canvas?: HTMLCanvasElement;
  context: _RendererContext = {};

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

  public abstract drawFrame(videoFrame: VideoFrame): void;

  public set rendererContext({ renderMode, mirrorMode }: RendererContext) {
    if (this.context.renderMode !== renderMode) {
      this.context.renderMode = renderMode;
      this.updateRenderMode();
    }

    if (this.context.mirrorMode !== mirrorMode) {
      this.context.mirrorMode = mirrorMode;
      this.updateMirrorMode();
    }
  }

  protected updateRenderMode() {
    if (!this.canvas || !this.container) return;

    const { clientWidth, clientHeight } = this.container;
    const { width, height } = this.canvas;

    const containerAspectRatio = clientWidth / clientHeight;
    const canvasAspectRatio = width / height;
    const widthScale = clientWidth / width;
    const heightScale = clientHeight / height;

    const isHidden =
      this.context?.renderMode === RenderModeType.RenderModeHidden;

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

  protected abstract rotateCanvas({
    width,
    height,
    rotation,
  }: VideoFrame): void;
}
