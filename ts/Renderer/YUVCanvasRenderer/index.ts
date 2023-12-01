import { VideoFrame } from '../../Private/AgoraMediaBase';
import { IRenderer } from '../IRenderer';

const YUVBuffer = require('yuv-buffer');
const YUVCanvas = require('yuv-canvas');

export class YUVCanvasRenderer extends IRenderer {
  private frameSink?: any;

  public override bind(element: HTMLElement) {
    super.bind(element);
    this.frameSink = YUVCanvas.attach(this.canvas, {
      webGL: false,
    });
  }

  public override drawFrame({
    width,
    height,
    yStride,
    uStride,
    vStride,
    yBuffer,
    uBuffer,
    vBuffer,
    rotation,
  }: VideoFrame) {
    this.rotateCanvas({ width, height, rotation });
    this.updateRenderMode();

    if (!this.frameSink) return;
    this.frameSink.drawFrame(
      YUVBuffer.frame(
        YUVBuffer.format({
          width,
          height,
          chromaWidth: width! / 2,
          chromaHeight: height! / 2,
          cropLeft: yStride! - width!,
        }),
        {
          bytes: yBuffer,
          stride: yStride,
        },
        {
          bytes: uBuffer,
          stride: uStride,
        },
        {
          bytes: vBuffer,
          stride: vStride,
        }
      )
    );
  }

  protected override rotateCanvas({ width, height, rotation }: VideoFrame) {
    if (!this.canvas) return;

    if (rotation === 0 || rotation === 180) {
      this.canvas.width = width!;
      this.canvas.height = height!;
    } else if (rotation === 90 || rotation === 270) {
      this.canvas.height = height!;
      this.canvas.width = width!;
    } else {
      throw new Error(
        `Invalid rotation: ${rotation}, only 0, 90, 180, 270 are supported`
      );
    }
    this.canvas.style.transform += ` rotateZ(${rotation}deg)`;
  }
}
