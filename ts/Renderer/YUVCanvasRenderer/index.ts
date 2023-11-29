import isEqual from 'lodash.isequal';

import { RenderModeType } from '../../Private/AgoraMediaBase';
import { CanvasOptions, ShareVideoFrame } from '../../Types';
import { IRenderer } from '../IRenderer';

const YUVBuffer = require('yuv-buffer');
const YUVCanvas = require('yuv-canvas');

export class YUVCanvasRenderer extends IRenderer {
  private canvasOptions?: CanvasOptions;
  private yuvCanvasSink?: any;

  public override bind(element: HTMLElement) {
    super.bind(element);
    this.yuvCanvasSink = YUVCanvas.attach(this.canvas, {
      webGL: false,
    });
  }

  public override unbind() {
    if (this.yuvCanvasSink && this.yuvCanvasSink?.loseContext) {
      this.yuvCanvasSink?.loseContext();
    }
    super.unbind();
  }

  public override drawFrame(frame: ShareVideoFrame) {
    if (!this.container || !this.yuvCanvasSink) {
      return;
    }

    let frameWidth = frame.width;
    let frameHeight = frame.height;

    let options: CanvasOptions = {
      frameWidth,
      frameHeight,
      rotation: frame.rotation ? frame.rotation : 0,
      contentMode: this.contentMode,
      clientWidth: this.container.clientWidth,
      clientHeight: this.container.clientHeight,
    };

    this.updateCanvas(options);

    let format = YUVBuffer.format({
      width: frameWidth,
      height: frameHeight,
      chromaWidth: frameWidth / 2,
      chromaHeight: frameHeight / 2,
      cropLeft: frame.yStride - frameWidth,
    });

    let yuvBufferFrame = YUVBuffer.frame(
      format,
      {
        bytes: frame.yBuffer,
        stride: frame.yStride,
      },
      {
        bytes: frame.uBuffer,
        stride: frame.yStride / 2,
      },
      {
        bytes: frame.vBuffer,
        stride: frame.yStride / 2,
      }
    );
    yuvBufferFrame.a = frame.alphaBuffer;
    this.yuvCanvasSink.drawFrame(yuvBufferFrame);
  }

  public override refreshCanvas() {
    if (this.canvasOptions) {
      this.zoom(
        this.canvasOptions.rotation === 90 ||
          this.canvasOptions.rotation === 270,
        this.canvasOptions.contentMode,
        this.canvasOptions.frameWidth,
        this.canvasOptions.frameHeight,
        this.canvasOptions.clientWidth,
        this.canvasOptions.clientHeight
      );
    }
  }

  private updateCanvas(options: CanvasOptions) {
    if (this.canvasOptions) {
      if (isEqual(this.canvasOptions, options)) {
        return;
      }
    }

    this.canvasOptions = Object.assign({}, options);

    if (this.canvas) {
      if (options.rotation === 0 || options.rotation === 180) {
        this.canvas.width = options.frameWidth;
        this.canvas.height = options.frameHeight;
        Object.assign(this.canvas.style, {
          'width': options.frameWidth + 'px',
          'height': options.frameHeight + 'px',
          'object-fit': 'cover',
        });
      } else if (options.rotation === 90 || options.rotation === 270) {
        this.canvas.height = options.frameWidth;
        this.canvas.width = options.frameHeight;
      } else {
        throw new Error(
          'Invalid value for rotation. Only support 0, 90, 180, 270'
        );
      }

      let transformItems = [];
      transformItems.push(`rotateZ(${options.rotation}deg)`);

      let scale = this.zoom(
        options.rotation === 90 || options.rotation === 270,
        options.contentMode,
        options.frameWidth,
        options.frameHeight,
        options.clientWidth,
        options.clientHeight
      );

      this.canvas.style.transform = `scale(${scale.toString()})`;

      if (transformItems.length > 0) {
        this.canvas.style.transform += ` ${transformItems.join(' ')}`;
      }
    }
  }

  private zoom(
    vertical: boolean,
    contentMode: RenderModeType,
    width: number,
    height: number,
    clientWidth: number,
    clientHeight: number
  ): number {
    let localRatio = clientWidth / clientHeight;
    let tempRatio = width / height;
    if (isNaN(localRatio) || isNaN(tempRatio)) {
      return 1;
    }

    if (contentMode === RenderModeType.RenderModeHidden) {
      if (vertical) {
        return clientHeight / clientWidth < width / height
          ? clientWidth / height
          : clientHeight / width;
      } else {
        return clientWidth / clientHeight > width / height
          ? clientWidth / width
          : clientHeight / height;
      }
    } else {
      if (vertical) {
        return clientHeight / clientWidth < width / height
          ? clientHeight / width
          : clientWidth / height;
      } else {
        return clientWidth / clientHeight > width / height
          ? clientHeight / height
          : clientWidth / width;
      }
    }
  }
}
