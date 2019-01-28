import SoftwareRenderer from './SoftwareRenderer';
interface IRenderer {
    bind(element: Element): void;
    unbind(): void;
    drawFrame(imageData: Object): void;
    setContentMode(mode: number): void;
}
declare class GlRenderer implements IRenderer {
    self: any;
    constructor();
    bind(element: Element): void;
    unbind(): void;
    drawFrame(imageData: Object): void;
    setContentMode(mode: number): void;
}
export { SoftwareRenderer, GlRenderer, IRenderer };
