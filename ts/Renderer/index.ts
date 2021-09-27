import SoftwareRenderer from './SoftwareRenderer';
import createGlRenderer from './GlRenderer';
import { EventEmitter } from 'events';

interface IRenderer {
  event: EventEmitter;
  bind(element: Element, isWebGL: boolean): void;
  unbind(): void;
  equalsElement(element: Element): boolean;
  drawFrame(imageData: {
    header: any,
    yUint8Array: any,
    uUint8Array: any,
    vUint8Array: any
  }): void;
  setContentMode(mode: number): void;
  refreshCanvas(): void;
  snapshot(type :string): string;
}

class GlRenderer implements IRenderer {
  self: any;
  event: EventEmitter;
  constructor(props: any) {
    console.log('GlRenderer')
    this.self = createGlRenderer.apply(this,[props.initRenderFailCallBack]);
    this.event = this.self.event;
  }
  snapshot(type :string): string{
    return this.self.snapshot(type);
  }
  bind(element: Element): void {
    return this.self.bind(element);
  }
  unbind(): void {
    return this.self.unbind();
  }
  equalsElement(element: Element): boolean{
    return this.self.view === element;
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

class CustomRenderer implements IRenderer {
  constructor() {
    throw new Error('You have to declare your own custom render');
  }

  event: EventEmitter;
  snapshot(type :string): string{
    throw new Error('You have to declare your own custom render');
  }

  bind(element: Element) {
    throw new Error('You have to declare your own custom render');
  }

  unbind() {
    throw new Error('You have to declare your own custom render');
  }

  equalsElement(element: Element) {
    throw new Error('You have to declare your own custom render');
    return false;
  }

  drawFrame(imageData: {
    header: any,
    yUint8Array: any,
    uUint8Array: any,
    vUint8Array: any
  }) {
    throw new Error('You have to declare your own custom render');
  }

  setContentMode(mode: number) {
    throw new Error('You have to declare your own custom render');
  }

  refreshCanvas() {
    throw new Error('You have to declare your own custom render');
  }


}

export {
  SoftwareRenderer, GlRenderer, IRenderer, CustomRenderer
};
