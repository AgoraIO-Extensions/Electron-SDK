/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-28 13:34:48
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 15:59:03
 */

const YUVBuffer = require("yuv-buffer");
const YUVCanvas = require("yuv-canvas");
const isEqual = require("lodash.isequal");

import { CanvasOptions, CONTENT_MODE, VideoFrame } from "./type";
import { IRenderer } from "./IRender";
import { logWarn } from "../Utils";

export class YUVCanvasRenderer implements IRenderer {
  private _cacheCanvasOptions?: CanvasOptions;
  private _yuvCanvasSink?: any;
  private _contentMode: CONTENT_MODE;
  private _mirror: boolean;
  private _canvas?: HTMLCanvasElement;
  private _customeElement?: Element;
  private _container?: Element;
  private _isWebGL: boolean;
  private _videoFrame: VideoFrame;

  constructor(isWebGL: boolean) {
    this._contentMode = CONTENT_MODE.CROPPED;
    this._isWebGL = isWebGL;
    this._mirror = false;
    this._videoFrame = {
      mirror: false,
      rotation: 0,
      width: 0,
      height: 0,
      yStride: 0,
      yBuffer: new Uint8Array(0),
      uBuffer: new Uint8Array(0),
      vBuffer: new Uint8Array(0),
    };
  }

  bind(element: Element) {
    this._customeElement = element;
    let container = document.createElement("div");
    Object.assign(container.style, {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
    this._container = container;
    this._customeElement.appendChild(this._container);
    this._canvas = document.createElement("canvas");
    this._container.appendChild(this._canvas);

    logWarn(`current render is webGL ${this._isWebGL}`);
    this._yuvCanvasSink = YUVCanvas.attach(this._canvas, {
      webGL: this._isWebGL,
    });
  }

  unbind() {
    this._canvas && this._container?.removeChild(this._canvas);
    this._container && this._customeElement?.removeChild(this._container);
    this._isWebGL && this._yuvCanvasSink?.loseContext();
    this._yuvCanvasSink = undefined;
    this._canvas && (this._canvas = undefined);
    this._container && (this._container = undefined);
  }

  zoom(
    vertical: boolean,
    contentMode: CONTENT_MODE = CONTENT_MODE.CROPPED,
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

    if (contentMode === CONTENT_MODE.CROPPED) {
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

  updateCanvas(
    options: CanvasOptions = {
      frameWidth: 0,
      frameHeight: 0,
      rotation: 0,
      mirror: false,
      contentMode: 0,
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

    if (this._canvas) {
      if (options.rotation === 0 || options.rotation === 180) {
        this._canvas.width = options.frameWidth;
        this._canvas.height = options.frameHeight;
        Object.assign(this._canvas.style, {
          width: options.frameWidth + "px",
          height: options.frameHeight + "px",
          "object-fit": "cover",
        });
      } else if (options.rotation === 90 || options.rotation === 270) {
        this._canvas.height = options.frameWidth;
        this._canvas.width = options.frameHeight;
      } else {
        throw new Error(
          "Invalid value for rotation. Only support 0, 90, 180, 270"
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

      this._canvas.style.zoom = scale.toString();

      if (this._mirror) {
        transformItems.push("rotateY(180deg)");
      }

      if (transformItems.length > 0) {
        let transform = `${transformItems.join(" ")}`;
        this._canvas.style.transform = transform;
      }
    }
  }

  drawFrame(frame: VideoFrame) {
    if (!this._container || !this._yuvCanvasSink) {
      return;
    }

    let frameWidth = frame.yStride
    let frameHeight = frame.height

    if (
      this._videoFrame.width === 0 ||
      this._videoFrame.height === 0 ||
      this._videoFrame.width != frame.width ||
      this._videoFrame.height != frame.height
    ) {
      logWarn(`YUVCanvasRenderer new Uint8Array before width ${this._videoFrame.width}, height ${this._videoFrame.height}, current: width ${frameWidth} height ${frameHeight}`);
      this._videoFrame.yBuffer = new Uint8Array(frameWidth * frameHeight);
      this._videoFrame.uBuffer = new Uint8Array((frameWidth * frameHeight) / 4);
      this._videoFrame.vBuffer = new Uint8Array((frameWidth * frameHeight) / 4);
    }

    this._videoFrame.yBuffer.set(frame.yBuffer);
    this._videoFrame.uBuffer.set(frame.uBuffer);
    this._videoFrame.vBuffer.set(frame.vBuffer);

    this._videoFrame.width = frame.width;
    this._videoFrame.height = frame.height;
    this._videoFrame.mirror = frame.mirror;
    this._videoFrame.rotation = frame.rotation;

    let options: CanvasOptions = {
      frameWidth: frame.width,
      frameHeight: frame.height,
      rotation: frame.rotation ? frame.rotation : 0,
      mirror: frame.mirror ? frame.mirror : false,
      contentMode: this._contentMode,
      clientWidth: this._container.clientWidth,
      clientHeight: this._container.clientHeight,
    };

    this.updateCanvas(options);

    let format = YUVBuffer.format({
      width: frameWidth,
      height: frameHeight,
      chromaWidth: frameWidth / 2,
      chromaHeight: frameHeight / 2,
    });

    let y = YUVBuffer.lumaPlane(format, this._videoFrame.yBuffer);
    let u = YUVBuffer.chromaPlane(format, this._videoFrame.uBuffer);
    let v = YUVBuffer.chromaPlane(format, this._videoFrame.vBuffer);
    let yuvBufferFrame = YUVBuffer.frame(format, y, u, v);
    this._yuvCanvasSink.drawFrame(yuvBufferFrame);
  }

  setContentMode(
    mode: CONTENT_MODE = CONTENT_MODE.CROPPED,
    mirror: boolean = false
  ) {
    this._contentMode = mode;
    this._mirror = mirror;
  }

  equalsElement(element: Element) {
    return this._customeElement ? false : this._customeElement === element;
  }

  refreshCanvas() {
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
}
