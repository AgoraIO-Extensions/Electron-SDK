import SoftwareRenderer from './SoftwareRenderer';
interface IRenderer {
    bind(element: HTMLElement): void;
    unbind(): void;
    drawFrame(imageData: {
        header: any;
        yUint8Array: any;
        uUint8Array: any;
        vUint8Array: any;
    }): void;
    setContentMode(mode: number): void;
}
declare class GlRenderer implements IRenderer {
    self: any;
    constructor();
    bind(element: HTMLElement): void;
    unbind(): void;
    drawFrame(imageData: {
        header: any;
        yUint8Array: any;
        uUint8Array: any;
        vUint8Array: any;
    }): void;
    setContentMode(mode: number): void;
}
export { SoftwareRenderer, GlRenderer, IRenderer };
