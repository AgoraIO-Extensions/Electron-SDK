import { VideoFrame } from '../../Private/AgoraMediaBase';
import { RendererContext } from '../../Types';
import { IRenderer } from '../IRenderer';

const YUVBuffer = require('yuv-buffer');
const YUVCanvas = require('yuv-canvas');

export class YUVCanvasRenderer extends IRenderer {
  private frameSink?: any;

  public override bind(context: RendererContext) {
    super.bind(context);
    this.frameSink = YUVCanvas.attach(this.canvas, {
      webGL: false,
    });
  }

  public override drawFrame(
    uid: number,
    {
      width,
      height,
      yStride,
      uStride,
      vStride,
      yBuffer,
      uBuffer,
      vBuffer,
      rotation,
      alphaBuffer,
    }: VideoFrame
  ) {
    this.rotateCanvas({ width, height, rotation });
    this.updateRenderMode();

    if (!this.frameSink) return;

    const frame = YUVBuffer.frame(
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
    );
    if (
      alphaBuffer &&
      alphaBuffer.length > 0 &&
      alphaBuffer.length === width! * height!
    ) {
      frame.a =
        alphaBuffer instanceof Uint8Array
          ? alphaBuffer
          : new Uint8Array(alphaBuffer);
    }
    this.frameSink.drawFrame(frame);

    super.drawFrame(uid);
  }

  protected override rotateCanvas({ width, height, rotation }: VideoFrame) {
    super.rotateCanvas({ width, height, rotation });

    if (!this.canvas) return;
    this.canvas.style.transform += ` rotateZ(${rotation}deg)`;
  }
}
