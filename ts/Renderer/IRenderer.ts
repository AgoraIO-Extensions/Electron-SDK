import { EventEmitter } from 'events';

import { RenderModeType } from '../Private/AgoraMediaBase';
import { RendererOptions, ShareVideoFrame } from '../Types';

export type RenderFailCallback =
  | ((obj: { error: string }) => void)
  | undefined
  | null;

export abstract class IRenderer {
  parentElement?: HTMLElement;
  canvas?: HTMLCanvasElement;
  event?: EventEmitter;
  contentMode = RenderModeType.RenderModeFit;
  mirror?: boolean;

  public snapshot(fileType = 'image/png') {
    if (this.canvas && this.canvas.toDataURL) {
      return this.canvas.toDataURL(fileType);
    }
    return null;
  }

  public bind(element: HTMLElement) {
    if (!element) {
      throw new Error('You have pass a element');
    }
    this.parentElement = element;
  }

  abstract unbind(): void;

  public equalsElement(element: Element): boolean {
    if (!element) {
      throw new Error('You have pass a element');
    }
    if (!this.parentElement) {
      throw new Error('parentElement is null');
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
