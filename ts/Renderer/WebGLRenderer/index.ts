import { RenderModeType } from '../../Private/AgoraMediaBase';
import { ShareVideoFrame } from '../../Types';
import { logError, logWarn } from '../../Utils';
import { IRenderer } from '../IRenderer';

export type WebGLFallback = (renderer: WebGLRenderer, error: Error) => void;

const createProgramFromSources =
  require('./webgl-utils').createProgramFromSources;

const vertexShaderSource =
  'attribute vec2 a_position;' +
  'attribute vec2 a_texCoord;' +
  'uniform vec2 u_resolution;' +
  'varying vec2 v_texCoord;' +
  'void main() {' +
  'vec2 zeroToOne = a_position / u_resolution;' +
  '   vec2 zeroToTwo = zeroToOne * 2.0;' +
  '   vec2 clipSpace = zeroToTwo - 1.0;' +
  '   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
  'v_texCoord = a_texCoord;' +
  '}';
const yuvShaderSource =
  'precision mediump float;' +
  'uniform sampler2D Ytex;' +
  'uniform sampler2D Utex;' +
  'uniform sampler2D Vtex;' +
  'varying vec2 v_texCoord;' +
  'void main(void) {' +
  '  float nx,ny,r,g,b,y,u,v;' +
  '  mediump vec4 txl,ux,vx;' +
  '  nx=v_texCoord[0];' +
  '  ny=v_texCoord[1];' +
  '  y=texture2D(Ytex,vec2(nx,ny)).r;' +
  '  u=texture2D(Utex,vec2(nx,ny)).r;' +
  '  v=texture2D(Vtex,vec2(nx,ny)).r;' +
  '  y=1.1643*(y-0.0625);' +
  '  u=u-0.5;' +
  '  v=v-0.5;' +
  '  r=y+1.5958*v;' +
  '  g=y-0.39173*u-0.81290*v;' +
  '  b=y+2.017*u;' +
  '  gl_FragColor=vec4(r,g,b,1.0);' +
  '}';

export class WebGLRenderer extends IRenderer {
  gl?: WebGLRenderingContext | WebGL2RenderingContext | null;
  program?: WebGLProgram;
  positionLocation?: number;
  texCoordLocation?: number;
  yTexture: WebGLTexture | null;
  uTexture: WebGLTexture | null;
  vTexture: WebGLTexture | null;
  texCoordBuffer: WebGLBuffer | null;
  surfaceBuffer: WebGLBuffer | null;

  initWidth = 0;
  initHeight = 0;
  initRotation = 0;
  clientWidth = 0;
  clientHeight = 0;
  lastImageWidth = 0;
  lastImageHeight = 0;
  lastImageRotation = 0;
  videoBuffer = {};

  observer?: ResizeObserver;

  fallback?: WebGLFallback;

  constructor(fallback?: WebGLFallback) {
    super();
    this.gl = undefined;
    this.yTexture = null;
    this.uTexture = null;
    this.vTexture = null;
    this.texCoordBuffer = null;
    this.surfaceBuffer = null;
    this.fallback = fallback;
  }

  public override bind(view: HTMLElement) {
    super.bind(view);

    const ResizeObserver = window.ResizeObserver;
    if (ResizeObserver) {
      this.observer = new ResizeObserver(this.refreshCanvas);
      this.observer.observe(view);
    }

    // context list after toggle resolution on electron 12.0.6
    this.canvas?.addEventListener(
      'webglcontextlost',
      this.handleContextLost,
      false
    );
    this.canvas?.addEventListener(
      'webglcontextrestored',
      this.handleContextRestored,
      false
    );
  }

  public override unbind() {
    if (this.parentElement) {
      this.observer?.unobserve(this.parentElement);
    }
    this.observer?.disconnect();
    this.observer = undefined;

    this.canvas?.removeEventListener(
      'webglcontextlost',
      this.handleContextLost,
      false
    );
    this.canvas?.removeEventListener(
      'webglcontextrestored',
      this.handleContextRestored,
      false
    );

    this.releaseTextures();
    this.gl = undefined;

    super.unbind();
  }

  public override drawFrame(videoFrame: ShareVideoFrame) {
    let error;
    try {
      this.renderImage({
        width: videoFrame.width,
        height: videoFrame.height,
        left: 0,
        top: 0,
        right: videoFrame.yStride - videoFrame.width,
        bottom: 0,
        rotation: videoFrame.rotation || 0,
        yplane: videoFrame.yBuffer,
        uplane: videoFrame.uBuffer,
        vplane: videoFrame.vBuffer,
      });
    } catch (err) {
      error = err;
    }
    if (!this.gl || error) {
      this.fallback?.call(
        null,
        this,
        new Error('webgl lost or webgl initialize failed')
      );
      return;
    }
  }

  public override refreshCanvas() {
    if (this.lastImageWidth) {
      this.updateViewZoomLevel(
        this.lastImageRotation,
        this.lastImageWidth,
        this.lastImageHeight
      );
    }
  }

  private renderImage(image: {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
    rotation: number;
    yplane: Uint8Array;
    uplane: Uint8Array;
    vplane: Uint8Array;
  }) {
    // Rotation, width, height, left, top, right, bottom, yplane, uplane, vplane

    if (
      image.width != this.initWidth ||
      image.height != this.initHeight ||
      image.rotation != this.initRotation
    ) {
      const view = this.parentElement!;
      this.unbind();

      this.initCanvas(view, image.width, image.height, image.rotation);
    }

    if (!this.gl || !this.program) {
      return;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const xWidth = image.width + image.left + image.right;
    const xHeight = image.height + image.top + image.bottom;
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        image.left / xWidth,
        image.bottom / xHeight,
        1 - image.right / xWidth,
        image.bottom / xHeight,
        image.left / xWidth,
        1 - image.top / xHeight,
        image.left / xWidth,
        1 - image.top / xHeight,
        1 - image.right / xWidth,
        image.bottom / xHeight,
        1 - image.right / xWidth,
        1 - image.top / xHeight,
      ]),
      this.gl.STATIC_DRAW
    );
    this.gl.enableVertexAttribArray(this.texCoordLocation!);
    this.gl.vertexAttribPointer(
      this.texCoordLocation!,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.uploadYuv(xWidth, xHeight, image.yplane, image.uplane, image.vplane);

    this.updateCanvas(image.rotation, image.width, image.height);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private uploadYuv(
    width: number,
    height: number,
    yplane: Uint8Array,
    uplane: Uint8Array,
    vplane: Uint8Array
  ) {
    if (!this.gl || !this.yTexture || !this.uTexture || !this.vTexture) {
      return;
    }

    this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.yTexture);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.LUMINANCE,
      width,
      height,
      0,
      this.gl.LUMINANCE,
      this.gl.UNSIGNED_BYTE,
      yplane
    );

    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.uTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.LUMINANCE,
      width / 2,
      height / 2,
      0,
      this.gl.LUMINANCE,
      this.gl.UNSIGNED_BYTE,
      uplane
    );

    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.vTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.LUMINANCE,
      width / 2,
      height / 2,
      0,
      this.gl.LUMINANCE,
      this.gl.UNSIGNED_BYTE,
      vplane
    );
  }

  private updateCanvas(rotation: number, width: number, height: number) {
    // if (this.canvasUpdated) {
    //   return;
    // }
    if (width || height) {
      this.lastImageWidth = width;
      this.lastImageHeight = height;
      this.lastImageRotation = rotation;
    } else {
      width = this.lastImageWidth;
      height = this.lastImageHeight;
      rotation = this.lastImageRotation;
    }
    if (!this.updateViewZoomLevel(rotation, width, height)) {
      return;
    }
    if (!this.gl) {
      return;
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceBuffer);
    this.gl.enableVertexAttribArray(this.positionLocation!);
    this.gl.vertexAttribPointer(
      this.positionLocation!,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    // 4 vertex, 1(x1,y1), 2(x2,y1), 3(x2,y2), 4(x1,y2)
    // 0: 1,2,4/4,2,3
    // 90: 2,3,1/1,3,4
    // 180: 3,4,2/2,4,1
    // 270: 4,1,3/3,1,2
    const p1 = { x: 0, y: 0 };
    const p2 = { x: width, y: 0 };
    const p3 = { x: width, y: height };
    const p4 = { x: 0, y: height };
    let pp1 = p1,
      pp2 = p2,
      pp3 = p3,
      pp4 = p4;

    switch (rotation) {
      case 0:
        break;
      case 90:
        pp1 = p2;
        pp2 = p3;
        pp3 = p4;
        pp4 = p1;
        break;
      case 180:
        pp1 = p3;
        pp2 = p4;
        pp3 = p1;
        pp4 = p2;
        break;
      case 270:
        pp1 = p4;
        pp2 = p1;
        pp3 = p2;
        pp4 = p3;
        break;
      default:
    }
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        pp1.x,
        pp1.y,
        pp2.x,
        pp2.y,
        pp4.x,
        pp4.y,
        pp4.x,
        pp4.y,
        pp2.x,
        pp2.y,
        pp3.x,
        pp3.y,
      ]),
      this.gl.STATIC_DRAW
    );

    const resolutionLocation = this.gl.getUniformLocation(
      this.program!,
      'u_resolution'
    );
    this.gl.uniform2f(resolutionLocation, width, height);
  }

  private updateViewZoomLevel(rotation: number, width: number, height: number) {
    if (!this.parentElement || !this.canvas) {
      return;
    }
    this.clientWidth = this.parentElement.clientWidth;
    this.clientHeight = this.parentElement.clientHeight;

    try {
      if (this.contentMode === RenderModeType.RenderModeHidden) {
        // Cover
        if (rotation === 0 || rotation === 180) {
          if (this.clientWidth / this.clientHeight > width / height) {
            this.canvas.style.transform = `scale(${this.clientWidth / width})`;
          } else {
            this.canvas.style.transform = `scale(${
              this.clientHeight / height
            })`;
          }
        } else {
          // 90, 270
          if (this.clientHeight / this.clientWidth > width / height) {
            this.canvas.style.transform = `scale(${this.clientHeight / width})`;
          } else {
            this.canvas.style.transform = `scale(${this.clientWidth / height})`;
          }
        }
        // Contain
      } else if (rotation === 0 || rotation === 180) {
        if (this.clientWidth / this.clientHeight > width / height) {
          this.canvas.style.transform = `scale(${this.clientHeight / height})`;
        } else {
          this.canvas.style.transform = `scale(${this.clientWidth / width})`;
        }
      } else {
        // 90, 270
        if (this.clientHeight / this.clientWidth > width / height) {
          this.canvas.style.transform = `scale(${this.clientWidth / height})`;
        } else {
          this.canvas.style.transform = `scale(${this.clientHeight / width})`;
        }
      }
    } catch (e) {
      logError('webgl updateViewZoomLevel', e);
      return false;
    }

    return true;
  }

  private initCanvas(
    view: HTMLElement,
    width: number,
    height: number,
    rotation: number
  ) {
    this.clientWidth = view.clientWidth;
    this.clientHeight = view.clientHeight;

    this.bind(view);

    if (this.canvas) {
      if (rotation == 0 || rotation == 180) {
        this.canvas.width = width;
        this.canvas.height = height;
      } else {
        this.canvas.width = height;
        this.canvas.height = width;
      }
    }
    this.initWidth = width;
    this.initHeight = height;
    this.initRotation = rotation;

    try {
      const getContext = (
        contextNames = ['webgl2', 'webgl', 'experimental-webgl']
      ): WebGLRenderingContext | WebGLRenderingContext | null => {
        for (let i = 0; i < contextNames.length; i++) {
          const contextName = contextNames[i]!;
          const context = this.canvas?.getContext(contextName, {
            depth: true,
            stencil: true,
            alpha: false,
            antialias: false,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: true,
          });
          if (context) {
            return context as WebGLRenderingContext | WebGLRenderingContext;
          }
        }
        return null;
      };
      // Try to grab the standard context. If it fails, fallback to experimental.
      this.gl ??= getContext();
    } catch (e) {
      logWarn('webgl create happen some warming', this.gl, this.canvas);
    }

    if (!this.gl) {
      this.fallback?.call(
        null,
        this,
        new Error('Browser not support! No WebGL detected.')
      );
      return;
    }

    // Set clear color to black, fully opaque
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // Near things obscure far things
    this.gl.depthFunc(this.gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT |
        this.gl.DEPTH_BUFFER_BIT |
        this.gl.STENCIL_BUFFER_BIT
    );

    // Setup GLSL program
    this.program = createProgramFromSources(this.gl, [
      vertexShaderSource,
      yuvShaderSource,
    ]) as WebGLProgram;
    this.gl.useProgram(this.program);

    this.initTextures();
  }

  private initTextures() {
    if (!this.gl) return;

    this.positionLocation = this.gl.getAttribLocation(
      this.program!,
      'a_position'
    );
    this.texCoordLocation = this.gl.getAttribLocation(
      this.program!,
      'a_texCoord'
    );

    this.surfaceBuffer = this.gl.createBuffer();
    this.texCoordBuffer = this.gl.createBuffer();

    const createTexture = (textureIndex: number) => {
      if (!this.gl) return null;

      // Create a texture.
      this.gl.activeTexture(textureIndex);
      const texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      // Set the parameters so we can render any size image.
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.NEAREST
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MAG_FILTER,
        this.gl.NEAREST
      );
      return texture;
    };

    this.yTexture = createTexture(this.gl.TEXTURE0);
    this.uTexture = createTexture(this.gl.TEXTURE1);
    this.vTexture = createTexture(this.gl.TEXTURE2);

    const y = this.gl.getUniformLocation(this.program!, 'Ytex');
    this.gl.uniform1i(y, 0); /* Bind Ytex to texture unit 0 */

    const u = this.gl.getUniformLocation(this.program!, 'Utex');
    this.gl.uniform1i(u, 1); /* Bind Utex to texture unit 1 */

    const v = this.gl.getUniformLocation(this.program!, 'Vtex');
    this.gl.uniform1i(v, 2); /* Bind Vtex to texture unit 2 */
  }

  private releaseTextures() {
    this.gl?.deleteProgram(this.program!);
    this.program = undefined;

    this.positionLocation = undefined;
    this.texCoordLocation = undefined;

    this.gl?.deleteTexture(this.yTexture);
    this.gl?.deleteTexture(this.uTexture);
    this.gl?.deleteTexture(this.vTexture);
    this.yTexture = null;
    this.uTexture = null;
    this.vTexture = null;

    this.gl?.deleteBuffer(this.texCoordBuffer);
    this.gl?.deleteBuffer(this.surfaceBuffer);
    this.texCoordBuffer = null;
    this.surfaceBuffer = null;
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    console.warn('webglcontextlost', event);

    this.releaseTextures();

    this.fallback?.call(
      null,
      this,
      new Error('Browser not support! No WebGL detected.')
    );
  };

  private handleContextRestored = (event: Event) => {
    event.preventDefault();
    console.warn('webglcontextrestored', event);

    // Setup GLSL program
    this.program = createProgramFromSources(this.gl, [
      vertexShaderSource,
      yuvShaderSource,
    ]) as WebGLProgram;
    this.gl?.useProgram(this.program);

    this.initTextures();
  };
}
