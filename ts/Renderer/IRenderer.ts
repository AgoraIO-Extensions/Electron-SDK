import { RenderModeType } from '../Private/AgoraMediaBase';
import { RendererOptions, ShareVideoFrame } from '../Types';

export abstract class IRenderer {
  parentElement?: HTMLElement;
  container?: HTMLElement;
  canvas?: HTMLCanvasElement;
  contentMode = RenderModeType.RenderModeHidden;
  mirror?: boolean;

  public snapshot(fileType = 'image/png') {
    if (this.canvas && this.canvas.toDataURL) {
      return this.canvas.toDataURL(fileType);
    }
    return null;
  }

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

  public equalsElement(element: Element): boolean {
    if (!this.parentElement) {
      console.error('parentElement is null');
    }
    return element === this.parentElement;
  }

  abstract drawFrame(imageData: ShareVideoFrame): void;

  public setRenderOption({ contentMode, mirror }: RendererOptions) {
    this.contentMode = contentMode ?? RenderModeType.RenderModeFit;
    this.mirror = mirror;
    Object.assign(this.parentElement!.style, {
      transform: mirror ? 'rotateY(180deg)' : '',
    });
  }

  abstract refreshCanvas(): void;
}
