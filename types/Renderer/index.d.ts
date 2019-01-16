import SoftwareRenderer from './SoftwareRenderer';
interface IRenderer {
    contentMode: 0 | 1;
    bind(element: Element): void;
    unbind(): void;
    drawFrame(imageData: Object): void;
}
declare class GlRenderer implements IRenderer {
    self: any;
    contentMode: 0 | 1;
    constructor();
    bind(element: Element): void;
    unbind(): void;
    drawFrame(imageData: Object): void;
}
export { SoftwareRenderer, GlRenderer, IRenderer };
