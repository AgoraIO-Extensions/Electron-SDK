import SoftwareRenderer from './SoftwareRenderer';
import createGlRenderer from './GlRenderer';

interface IRenderer {
  bind(element: HTMLElement): void;
  unbind(): void;
  drawFrame(imageData: {
    header: any,
    yUint8Array: any,
    uUint8Array: any,
    vUint8Array: any
  }): void;
  setContentMode(mode: number): void;
  refreshCanvas(): void;
}

class GlRenderer implements IRenderer {
  self: any;
  constructor() {
    this.self = createGlRenderer.apply(this);
  }
  bind(element: HTMLElement): void {
    return this.self.bind(element);
  }
  unbind(): void {
    return this.self.unbind();
  }
  drawFrame(imageData: {
    header: any,
    yUint8Array: any,
    uUint8Array: any,
    vUint8Array: any
  }): void {
    return this.self.drawFrame(imageData);
  }
  setContentMode(mode: number): void {
    return this.self.setContentMode(mode);
  }
  refreshCanvas() {
      return this.self.refreshCanvas();
  }
}

export {
  SoftwareRenderer, GlRenderer, IRenderer
};
