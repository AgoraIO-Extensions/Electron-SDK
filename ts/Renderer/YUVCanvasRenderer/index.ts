import isEqual from 'lodash.isequal';

import { RenderModeType } from '../../Private/AgoraMediaBase';
import { CanvasOptions, ShareVideoFrame } from '../../Types';
import { IRenderer } from '../IRenderer';

const YUVBuffer = require('yuv-buffer');
const YUVCanvas = require('yuv-canvas');

export class YUVCanvasRenderer extends IRenderer {
  private _cacheCanvasOptions?: CanvasOptions;
  private _yuvCanvasSink?: any;
  private _videoFrame: ShareVideoFrame;

  constructor() {
    super();
    this._videoFrame = {
      rotation: 0,
      width: 0,
      height: 0,
      yStride: 0,
      yBuffer: new Uint8Array(0),
      uBuffer: new Uint8Array(0),
      vBuffer: new Uint8Array(0),
    };
  }

  public override bind(element: HTMLElement) {
    super.bind(element);
    this._yuvCanvasSink = YUVCanvas.attach(this.canvas, {
      webGL: false,
    });
  }

  public override unbind() {
    if (this._yuvCanvasSink && this._yuvCanvasSink?.loseContext) {
      this._yuvCanvasSink?.loseContext();
    }
    super.unbind();
  }

  public override drawFrame(frame: ShareVideoFrame) {
    if (!this.container || !this._yuvCanvasSink) {
      return;
    }

    let frameWidth = frame.width;
    let frameHeight = frame.height;

    if (
      this._videoFrame.yStride === 0 ||
      this._videoFrame.height === 0 ||
      this._videoFrame.yStride != frame.yStride ||
      this._videoFrame.height != frame.height
    ) {
      this._videoFrame.yBuffer = new Uint8Array(frame.yStride * frameHeight);
      this._videoFrame.uBuffer = new Uint8Array(
        (frame.yStride * frameHeight) / 4
      );
      this._videoFrame.vBuffer = new Uint8Array(
        (frame.yStride * frameHeight) / 4
      );
    }

    this._videoFrame.yBuffer.set(frame.yBuffer);
    this._videoFrame.uBuffer.set(frame.uBuffer);
    this._videoFrame.vBuffer.set(frame.vBuffer);

    this._videoFrame.width = frame.width;
    this._videoFrame.height = frame.height;
    this._videoFrame.yStride = frame.yStride;
    this._videoFrame.rotation = frame.rotation;

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
        bytes: this._videoFrame.yBuffer,
        stride: frame.yStride,
      },
      {
        bytes: this._videoFrame.uBuffer,
        stride: frame.yStride / 2,
      },
      {
        bytes: this._videoFrame.vBuffer,
        stride: frame.yStride / 2,
      }
    );
    this._yuvCanvasSink.drawFrame(yuvBufferFrame);
  }

  public override refreshCanvas() {
    if (this._cacheCanvasOptions) {
      this.zoom(
        this._cacheCanvasOptions.rotation === 90 ||
          this._cacheCanvasOptions.rotation === 270,
        this._cacheCanvasOptions.contentMode,
        this._cacheCanvasOptions.frameWidth,
        this._cacheCanvasOptions.frameHeight,
        this._cacheCanvasOptions.clientWidth,
        this._cacheCanvasOptions.clientHeight
      );
    }
  }

  private updateCanvas(
    options: CanvasOptions = {
      frameWidth: 0,
      frameHeight: 0,
      rotation: 0,
      contentMode: RenderModeType.RenderModeHidden,
      clientWidth: 0,
      clientHeight: 0,
    }
  ) {
    if (this._cacheCanvasOptions) {
      if (isEqual(this._cacheCanvasOptions, options)) {
        return;
      }
    }

    this._cacheCanvasOptions = Object.assign({}, options);

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
    contentMode: RenderModeType = RenderModeType.RenderModeFit,
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
