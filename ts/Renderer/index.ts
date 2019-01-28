import SoftwareRenderer from './SoftwareRenderer';
import createGlRenderer from './GlRenderer';

interface IRenderer {
  bind(element: Element): void;
  unbind(): void;
  drawFrame(imageData: Object): void;
  setContentMode(mode: number): void;
}

class GlRenderer implements IRenderer {
  self;
  constructor() {
    this.self = createGlRenderer.apply(this);
  }
  bind(element: Element): void {
    return this.self.bind(element);
  }
  unbind(): void {
    return this.self.unbind();
  }
  drawFrame(imageData: Object): void {
    return this.self.drawFrame(imageData);
  }
  setContentMode(mode: number): void {
    return this.self.setContentMode(mode);
  }
}

export {
  SoftwareRenderer, GlRenderer, IRenderer
};