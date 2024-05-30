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
    super.drawFrame();
  }

  protected override rotateCanvas({ width, height, rotation }: VideoFrame) {
    super.rotateCanvas({ width, height, rotation });

    if (!this.canvas) return;
    this.canvas.style.transform += ` rotateZ(${rotation}deg)`;
  }
}
