const EventEmitter = require('events').EventEmitter;
const isEqual = require('lodash.isequal');
const YUVBuffer = require('yuv-buffer');
const YUVCanvas = require('yuv-canvas');

class Renderer {
  constructor() {
    this.cacheCanvasOpts = {};
    this.yuv = {};
    this.event = new EventEmitter();
    this.ready = false;
    this.contentMode = 0;
    this.container = {};
    this.canvas = {};
    this.element = {};
  }

  _calcZoom(vertical = false, contentMode = 0, width, height, clientWidth, clientHeight) {
    let localRatio = clientWidth / clientHeight;
    let tempRatio = width / height;

    if (isNaN(localRatio) || isNaN(tempRatio)) {
      return 1
    }

    if (!contentMode) {
      if (vertical) {
        return localRatio > tempRatio ?
          clientHeight / height : clientWidth / width
      } else {
        return localRatio < tempRatio ?
          clientHeight / height : clientWidth / width
      }
    } else {
      if (vertical) {
        return localRatio < tempRatio ?
          clientHeight / height : clientWidth / width
      } else {
        return localRatio > tempRatio ?
          clientHeight / height : clientWidth / width
      }
    }
  }

  bind(element) {
    // record element
    this.element = element;
    // create container
    let container = document.createElement('div');
    Object.assign(container.style, {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    });
    this.container = container;
    element.appendChild(this.container);

    // create canvas
    this.canvas = document.createElement('canvas')
    this.container.appendChild(this.canvas)
    this.yuv = YUVCanvas.attach(this.canvas, { webGL: false });
  }

  unbind() {
    this.container && this.container.removeChild(this.canvas);
    this.element && this.element.removeChild(this.container);
    this.yuv = null;
    this.element = null;
    this.canvas = null;
    this.view = null;
  }
  refreshCanvas() {
    // Not implemented for software renderer
  }
  updateCanvas(options = {
    width: 0,
    height: 0,
    rotation: 0,
    mirrorView: false,
    contentMode: 0,
    clientWidth: 0,
    clientHeight: 0,
  }) {
    // check if display options changed
    if (isEqual(this.cacheCanvasOpts, options)) {
      return;
    }

    this.cacheCanvasOpts = Object.assign({}, options);

    // check for rotation
    if (options.rotation === 0 || options.rotation === 180) {
      this.canvas.width = options.width;
      this.canvas.height = options.height;
    } else if (options.rotation === 90 || options.rotation === 270) {
      this.canvas.height = options.width;
      this.canvas.width = options.height;
    } else {
      throw new Error('Invalid value for rotation. Only support 0, 90, 180, 270')
    }
    let transformItems = []
    
    transformItems.push(`rotateZ(${options.rotation}deg)`)
    
    let scale = this._calcZoom(
      options.rotation === 90 || options.rotation === 270,
      options.contentMode,
      options.width,
      options.height,
      options.clientWidth,
      options.clientHeight
    );
    
    // transformItems.push(`scale(${scale})`)
    this.canvas.style.zoom = scale;

    // check for mirror
    if (options.mirrorView) {
      // this.canvas.style.transform = 'rotateY(180deg)';
      transformItems.push('rotateY(180deg)')
    }
    
    if(transformItems.length > 0) {
      let transform = `${transformItems.join(' ')}`
      this.canvas.style.transform = transform
    }
  }

  drawFrame(imageData={header, yUint8Array, uUint8Array, vUint8Array}) {
    if (!this.ready) {
      this.ready = true;
      this.event.emit('ready');
    }
    let dv = new DataView(imageData.header);
    // let format = dv.getUint8(0);
    let mirror = dv.getUint8(1);
    let contentWidth = dv.getUint16(2);
    let contentHeight = dv.getUint16(4);
    let left = dv.getUint16(6);
    let top = dv.getUint16(8);
    let right = dv.getUint16(10);
    let bottom = dv.getUint16(12);
    let rotation = dv.getUint16(14);
    // let ts = dv.getUint32(16);
    let width = contentWidth + left + right;
    let height = contentHeight + top + bottom;

    this.updateCanvas({
      width, height, rotation,
      mirrorView: mirror,
      contentMode: this.contentMode,
      clientWidth: this.container.clientWidth,
      clientHeight: this.container.clientHeight,
    })

    let format = YUVBuffer.format({
      width,
      height,
      chromaWidth: width/2,
      chromaHeight: height/2
    })

    let y = YUVBuffer.lumaPlane(format, imageData.yUint8Array);
    let u = YUVBuffer.chromaPlane(format, imageData.uUint8Array);
    let v = YUVBuffer.chromaPlane(format, imageData.vUint8Array);
    let frame = YUVBuffer.frame(format, y, u, v);

    this.yuv.drawFrame(frame);
  }

  setContentMode(mode = 0) {
    this.contentMode = mode;
  }

}

export default Renderer;
