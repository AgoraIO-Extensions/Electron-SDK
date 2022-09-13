import { EventEmitter } from 'events';
import { RenderModeType } from '../Private/AgoraMediaBase';
import { RendererOptions, ShareVideoFrame } from '../Types';

export type RenderFailCallback =
  | ((obj: { error: string }) => void)
  | undefined
  | null;
export class IRenderer {
  parentElement?: HTMLElement;
  canvas?: HTMLCanvasElement;
  event?: EventEmitter;
  contentMode = RenderModeType.RenderModeFit;
  mirror?: boolean;

  snapshot(fileType = 'image/png') {
    if (this.canvas && this.canvas.toDataURL) {
      return this.canvas.toDataURL(fileType);
    }
    return null;
  }

  bind(element: HTMLElement) {
    if (!element) {
      throw new Error('You have pass a element');
    }
    this.parentElement = element;
  }

  unbind() {
    throw new Error('You have to declare your own custom render');
  }

  equalsElement(element: Element): boolean {
    if (!element) {
      throw new Error('You have pass a element');
    }
    if (!this.parentElement) {
      throw new Error('parentElement is null');
    }
    return element === this.parentElement;
  }

  drawFrame(imageData: ShareVideoFrame) {
    throw new Error('You have to declare your own custom render');
  }

  setRenderOption({ contentMode, mirror }: RendererOptions) {
    this.contentMode =
      contentMode === undefined ? RenderModeType.RenderModeFit : contentMode;
    this.mirror = mirror;
    Object.assign(this.parentElement!.style, {
      transform: mirror ? 'rotateY(180deg)' : '',
    });
  }

  refreshCanvas() {
    throw new Error('You have to declare your own custom render');
  }
}
