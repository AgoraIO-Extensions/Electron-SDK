import { VideoFrame } from '../../Private/AgoraMediaBase';
import { CodecConfigInfo, RendererType } from '../../Types';
import { getContextByCanvas } from '../../Utils';
import { IRenderer } from '../IRenderer';

export class WebCodecsRenderer extends IRenderer {
  gl?: WebGLRenderingContext | WebGL2RenderingContext | null;
  // eslint-disable-next-line auto-import/auto-import
  offscreenCanvas: OffscreenCanvas | undefined;

  constructor() {
    super();
    this.rendererType = RendererType.WEBCODECSRENDERER;
  }

  static vertexShaderSource = `
    attribute vec2 xy;
    varying highp vec2 uv;
    void main(void) {
      gl_Position = vec4(xy, 0.0, 1.0);
      // Map vertex coordinates (-1 to +1) to UV coordinates (0 to 1).
      // UV coordinates are Y-flipped relative to vertex coordinates.
      uv = vec2((1.0 + xy.x) / 2.0, (1.0 - xy.y) / 2.0);
    }
  `;
  static fragmentShaderSource = `
    varying highp vec2 uv;
    uniform sampler2D texture;
    void main(void) {
      gl_FragColor = texture2D(texture, uv);
    }
  `;

  bind(element: HTMLElement) {
    super.bind(element);
    if (!this.canvas) return;
    this.offscreenCanvas = this.canvas.transferControlToOffscreen();
    this.gl = getContextByCanvas(this.offscreenCanvas);
    if (!this.gl) return;
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    if (!vertexShader) return;
    this.gl.shaderSource(vertexShader, WebCodecsRenderer.vertexShaderSource);
    this.gl.compileShader(vertexShader);
    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(vertexShader);
    }
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    this.gl.shaderSource(
      fragmentShader,
      WebCodecsRenderer.fragmentShaderSource
    );
    this.gl.compileShader(fragmentShader);
    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(fragmentShader);
    }
    const shaderProgram = this.gl.createProgram();
    if (!shaderProgram) return;
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw this.gl.getProgramInfoLog(shaderProgram);
    }
    this.gl.useProgram(shaderProgram);
    // Vertex coordinates, clockwise from bottom-left.
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, -1.0, +1.0, +1.0, +1.0, +1.0, -1.0]),
      this.gl.STATIC_DRAW
    );
    const xyLocation = this.gl.getAttribLocation(shaderProgram, 'xy');
    this.gl.vertexAttribPointer(xyLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(xyLocation);
    // Create one texture to upload frames to.
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
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
  }

  drawFrame(frame: any, _codecConfig: CodecConfigInfo) {
    if (!this.offscreenCanvas || !frame) return;

    this.offscreenCanvas.width = _codecConfig.codedWidth!;
    this.offscreenCanvas.height = _codecConfig.codedHeight!;

    this.updateRenderMode();
    this.rotateCanvas({
      rotation: _codecConfig.rotation,
    });
    if (!this.gl) return;

    if (this.gl) {
      // Upload the frame.
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        frame
      );
      frame.close();
      // Configure and clear the drawing area.
      this.gl.viewport(
        0,
        0,
        this.gl.drawingBufferWidth,
        this.gl.drawingBufferHeight
      );
      this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      // Draw the frame.
      this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    }
    super.drawFrame();
    this.getFps();
  }

  protected override rotateCanvas({ rotation }: VideoFrame) {
    if (!this.offscreenCanvas || !this.canvas) return;
    this.canvas.style.transform += ` rotateZ(${rotation}deg)`;
  }
}
