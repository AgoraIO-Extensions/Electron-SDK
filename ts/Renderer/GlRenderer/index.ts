const createProgramFromSources =
  require("./webgl-utils").createProgramFromSources;

import { EventEmitter } from "events";
import { VideoFrame } from "../type";
import { IRenderer } from "../IRender";

const vertexShaderSource =
  "attribute vec2 a_position;" +
  "attribute vec2 a_texCoord;" +
  "uniform vec2 u_resolution;" +
  "varying vec2 v_texCoord;" +
  "void main() {" +
  "vec2 zeroToOne = a_position / u_resolution;" +
  "   vec2 zeroToTwo = zeroToOne * 2.0;" +
  "   vec2 clipSpace = zeroToTwo - 1.0;" +
  "   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);" +
  "v_texCoord = a_texCoord;" +
  "}";
const yuvShaderSource =
  "precision mediump float;" +
  "uniform sampler2D Ytex;" +
  "uniform sampler2D Utex,Vtex;" +
  "varying vec2 v_texCoord;" +
  "void main(void) {" +
  "  float nx,ny,r,g,b,y,u,v;" +
  "  mediump vec4 txl,ux,vx;" +
  "  nx=v_texCoord[0];" +
  "  ny=v_texCoord[1];" +
  "  y=texture2D(Ytex,vec2(nx,ny)).r;" +
  "  u=texture2D(Utex,vec2(nx,ny)).r;" +
  "  v=texture2D(Vtex,vec2(nx,ny)).r;" +
  "  y=1.1643*(y-0.0625);" +
  "  u=u-0.5;" +
  "  v=v-0.5;" +
  "  r=y+1.5958*v;" +
  "  g=y-0.39173*u-0.81290*v;" +
  "  b=y+2.017*u;" +
  "  gl_FragColor=vec4(r,g,b,1.0);" +
  "}";

type FailCallback = ((obj: { error: string }) => void) | undefined | null;

export class GlRenderer extends IRenderer {
  gl: WebGL2RenderingContext | undefined | null;
  handleContextLost: any;
  program: any;
  positionLocation: any;
  texCoordLocation: any;
  yTexture: WebGLTexture | undefined | null;
  uTexture: WebGLTexture | undefined | null;
  vTexture: WebGLTexture | undefined | null;
  texCoordBuffer: any;
  surfaceBuffer: any;

  parentElement: HTMLElement | undefined;
  container: HTMLElement | undefined;
  canvas: HTMLCanvasElement | undefined;
  renderImageCount = 0;
  initWidth = 0;
  initHeight = 0;
  initRotation = 0;
  clientWidth = 0;
  clientHeight = 0;
  contentMode = 0;
  event = new EventEmitter();
  firstFrameRender = false;
  lastImageWidth = 0;
  lastImageHeight = 0;
  lastImageRotation = 0;
  videoBuffer = {};

  observer?: ResizeObserver;

  failInitRenderCB: FailCallback;

  constructor(failCallback: FailCallback) {
    super();
    this.failInitRenderCB = failCallback;
  }

  bind(view: HTMLElement) {
    super.bind(view);

    // this.initCanvas(
    //   view,
    //   view.clientWidth,
    //   view.clientHeight,
    //   this.initRotation,
    //   console.warn
    // );
    // const ResizeObserver = window.ResizeObserver;
    // if (ResizeObserver) {
    //   this.observer = new ResizeObserver(() => {
    //     this.refreshCanvas && this.refreshCanvas();
    //   });
    //   this.observer.observe(view);
    // }
  }

  unbind() {
    this.observer && this.observer.unobserve && this.observer.disconnect();
    this.program = undefined;
    this.positionLocation = undefined;
    this.texCoordLocation = undefined;

    this.deleteTexture(this.yTexture);
    this.deleteTexture(this.uTexture);
    this.deleteTexture(this.vTexture);
    this.yTexture = undefined;
    this.uTexture = undefined;
    this.vTexture = undefined;

    this.deleteBuffer(this.texCoordBuffer);
    this.deleteBuffer(this.surfaceBuffer);
    this.texCoordBuffer = undefined;
    this.surfaceBuffer = undefined;

    this.gl = undefined;

    try {
      if (
        this.container &&
        this.canvas &&
        this.canvas.parentNode === this.container
      ) {
        this.container.removeChild(this.canvas);
      }
      if (
        this.parentElement &&
        this.container &&
        this.container.parentNode === this.parentElement
      ) {
        this.parentElement.removeChild(this.container);
      }
    } catch (e) {
      console.warn(e);
    }

    this.canvas = undefined;
    this.container = undefined;
    this.parentElement = undefined;
  }

  updateViewZoomLevel(rotation: number, width: number, height: number) {
    if (!this.parentElement || !this.canvas) {
      return;
    }
    this.clientWidth = this.parentElement.clientWidth;
    this.clientHeight = this.parentElement.clientHeight;

    try {
      if (this.contentMode === 0) {
        // Cover
        if (rotation === 0 || rotation === 180) {
          if (this.clientWidth / this.clientHeight > width / height) {
            this.canvas.style.zoom = this.clientWidth / width;
          } else {
            this.canvas.style.zoom = this.clientHeight / height;
          }
        } else {
          // 90, 270
          if (this.clientHeight / this.clientWidth > width / height) {
            this.canvas.style.zoom = this.clientHeight / width;
          } else {
            this.canvas.style.zoom = this.clientWidth / height;
          }
        }
        // Contain
      } else if (rotation === 0 || rotation === 180) {
        if (this.clientWidth / this.clientHeight > width / height) {
          this.canvas.style.zoom = this.clientHeight / height;
        } else {
          this.canvas.style.zoom = this.clientWidth / width;
        }
      } else {
        // 90, 270
        if (this.clientHeight / this.clientWidth > width / height) {
          this.canvas.style.zoom = this.clientWidth / height;
        } else {
          this.canvas.style.zoom = this.clientHeight / width;
        }
      }
    } catch (e) {
      console.log(`updateCanvas 00001 gone ${this.canvas}`);

      console.error(e);
      return false;
    }

    return true;
  }

  updateCanvas(rotation: number, width: number, height: number) {
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
    let gl = this.gl;
    if (!gl) {
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.surfaceBuffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Console.log('image rotation from ', this.imageRotation, ' to ', rotation);
    // 4 vertex, 1(x1,y1), 2(x2,y1), 3(x2,y2), 4(x1,y2)
    //  0: 1,2,4/4,2,3
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
    gl.bufferData(
      gl.ARRAY_BUFFER,
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
      gl.STATIC_DRAW
    );

    const resolutionLocation = gl.getUniformLocation(
      this.program,
      "u_resolution"
    );
    gl.uniform2f(resolutionLocation, width, height);
  }

  drawFrame(videoFrame: VideoFrame) {
    try {
      this.renderImage({
        width: videoFrame.width,
        height: videoFrame.height,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        rotation: videoFrame.rotation || 0,
        yplane: videoFrame.yBuffer,
        uplane: videoFrame.uBuffer,
        vplane: videoFrame.vBuffer,
      });
    } catch (error) {
      console.warn(error);
    }
    if (!this.gl) {
      this.failInitRenderCB && this.failInitRenderCB({ error: "test" });
      this.failInitRenderCB = null;
      return;
    }
  }

  refreshCanvas() {
    if (this.lastImageWidth) {
      this.updateViewZoomLevel(
        this.lastImageRotation,
        this.lastImageWidth,
        this.lastImageHeight
      );
    }
  }

  renderImage(image: {
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
      // Console.log('init canvas ' + image.width + "*" + image.height + " rotation " + image.rotation);
      this.initCanvas(view, image.width, image.height, image.rotation, (e) => {
        console.error(
          `init canvas ${image.width}*${image.height} rotation ${image.rotation} failed. ${e}`
        );
      });
      const ResizeObserver = window.ResizeObserver;
      if (ResizeObserver) {
        this.observer = new ResizeObserver(() => {
          this.refreshCanvas && this.refreshCanvas();
        });
        this.observer.observe(view);
      }
    }
    let gl = this.gl;
    if (!gl) {
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    const xWidth = image.width + image.left + image.right;
    const xHeight = image.height + image.top + image.bottom;
    gl.bufferData(
      gl.ARRAY_BUFFER,
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
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(this.texCoordLocation);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    this.uploadYuv(xWidth, xHeight, image.yplane, image.uplane, image.vplane);

    this.updateCanvas(image.rotation, image.width, image.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    this.renderImageCount += 1;

    if (!this.firstFrameRender) {
      this.firstFrameRender = true;
      this.event.emit("ready");
    }
  }

  uploadYuv(
    width: number,
    height: number,
    yplane: Uint8Array,
    uplane: Uint8Array,
    vplane: Uint8Array
  ) {
    let gl = this.gl;
    if (!gl || !this.yTexture || !this.uTexture || !this.vTexture) {
      return;
    }

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.yTexture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      width,
      height,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      yplane
    );

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.uTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      width / 2,
      height / 2,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      uplane
    );

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.vTexture);
    ("");
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      width / 2,
      height / 2,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      vplane
    );
  }

  deleteBuffer(buffer: any) {
    if (buffer && this.gl) {
      this.gl.deleteBuffer(buffer);
    }
  }

  deleteTexture(texture: any) {
    if (texture && this.gl) {
      this.gl.deleteTexture(texture);
    }
  }

  initCanvas(
    view: HTMLElement,
    width: number,
    height: number,
    rotation: number,
    onFailure: FailCallback
  ) {
    let gl = this.gl;
    this.clientWidth = view.clientWidth;
    this.clientHeight = view.clientHeight;

    this.parentElement = view;

    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.display = "flex";
    this.container.style.justifyContent = "center";
    this.container.style.alignItems = "center";
    this.parentElement.appendChild(this.container);

    this.canvas = document.createElement("canvas");
    if (rotation == 0 || rotation == 180) {
      this.canvas.width = width;
      this.canvas.height = height;
    } else {
      this.canvas.width = height;
      this.canvas.height = width;
    }
    this.initWidth = width;
    this.initHeight = height;
    this.initRotation = rotation;

    this.container.appendChild(this.canvas);
    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      this.gl = gl = this.canvas.getContext("webgl2", {
        preserveDrawingBuffer: true,
      });
      // context list after toggle resolution on electron 12.0.6
      let handleContextLost = () => {
        try {
          this.gl = null;
          this.canvas &&
            this.canvas.removeEventListener(
              "webglcontextlost",
              handleContextLost,
              false
            );
        } catch (error) {
          console.warn("webglcontextlost error", error);
        } finally {
          console.warn("webglcontextlost");
        }
      };
      this.canvas.addEventListener(
        "webglcontextlost",
        handleContextLost,
        false
      );
    } catch (e) {
      console.log(e);
    }
    if (!gl) {
      this.gl = undefined;
      onFailure &&
        onFailure({ error: "Browser not support! No WebGL detected." });
      return;
    }
    this.gl = gl;

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Setup GLSL program
    this.program = createProgramFromSources(gl, [
      vertexShaderSource,
      yuvShaderSource,
    ]);
    this.gl.useProgram(this.program);

    this.initTextures();
  }
  initTextures() {
    let gl = this.gl;
    if (!gl) {
      return;
    }
    let program = this.program;

    this.positionLocation = gl.getAttribLocation(program, "a_position");
    this.texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    this.surfaceBuffer = gl.createBuffer();
    this.texCoordBuffer = gl.createBuffer();

    // Create a texture.
    gl.activeTexture(gl.TEXTURE0);
    this.yTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.yTexture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.activeTexture(gl.TEXTURE1);
    this.uTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.uTexture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.activeTexture(gl.TEXTURE2);
    this.vTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.vTexture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const y = gl.getUniformLocation(program, "Ytex");
    gl.uniform1i(y, 0); /* Bind Ytex to texture unit 0 */

    const u = gl.getUniformLocation(program, "Utex");
    gl.uniform1i(u, 1); /* Bind Utex to texture unit 1 */

    const v = gl.getUniformLocation(program, "Vtex");
    gl.uniform1i(v, 2); /* Bind Vtex to texture unit 2 */
  }
}

export default GlRenderer;
