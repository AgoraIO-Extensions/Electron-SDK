import SoftwareRenderer from './SoftwareRenderer';
import createGlRenderer from './GlRenderer';

interface IRenderer {
  contentMode: 0|1; // 0 for fill, 1 for fit
  bind(element: Element): void;
  unbind(): void;
  drawFrame(imageData: Object): void;
}

class GlRenderer implements IRenderer {
  self;
  contentMode: 0|1;
  constructor() {
    this.self = createGlRenderer.apply(this);
    this.contentMode = 0;
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
}

export {
  SoftwareRenderer, GlRenderer, IRenderer
};