import { EventEmitter } from "events";
import { CONTENT_MODE, RendererOptions, VideoFrame } from "./type";

export class IRenderer {
  parentElement?: HTMLElement;
  canvas?: HTMLCanvasElement;
  event?: EventEmitter;
  contentMode = CONTENT_MODE.FIT;
  mirror?: boolean;

  snapshot(fileType = "image/png") {
    if (this.canvas && this.canvas.toDataURL) {
      return this.canvas.toDataURL(fileType);
    }
    return null;
  }

  bind(element: HTMLElement) {
    if (!element) {
      throw new Error("You have pass a element");
    }
    this.parentElement = element;
  }

  unbind() {
    throw new Error("You have to declare your own custom render");
  }

  equalsElement(element: Element): boolean {
    if (!element) {
      throw new Error("You have pass a element");
    }
    if (!this.parentElement) {
      throw new Error("parentElement is null");
    }
    return element === this.parentElement;
  }

  drawFrame(imageData: VideoFrame) {
    throw new Error("You have to declare your own custom render");
  }

  setRenderOption({ contentMode, mirror }: RendererOptions) {
    this.contentMode = contentMode;
    this.mirror = mirror;
    Object.assign(this.parentElement!.style, {
      transform: mirror ? "rotateY(180deg)" : "",
    });
  }

  refreshCanvas() {
    throw new Error("You have to declare your own custom render");
  }
}
