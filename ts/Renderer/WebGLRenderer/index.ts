import { VideoFrame } from '../../Private/AgoraMediaBase';
import { VideoColorRange, VideoColorSpace } from '../../Private/AgoraMediaBase';
import { RendererType } from '../../Types';
import { AgoraEnv, logWarn } from '../../Utils';
import { IRenderer } from '../IRenderer';

export type WebGLFallback = (renderer: WebGLRenderer, error: Error) => void;

const createProgramFromSources =
  require('./webgl-utils').createProgramFromSources;

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  uniform vec2 u_resolution;
  varying vec2 v_texCoord;
  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
  }`;

const yuvShaderSource = `
  precision mediump float;
  uniform sampler2D Ytex;
  uniform sampler2D Utex;
  uniform sampler2D Vtex;
  uniform sampler2D Atex;
  uniform bool hasAlpha;

  // Dynamic color space conversion parameters
  uniform float u_yOffset;
  uniform float u_yScale;
  uniform float u_rVCoeff;
  uniform float u_gUCoeff;
  uniform float u_gVCoeff;
  uniform float u_bUCoeff;

  varying vec2 v_texCoord;

  void main(void) {
    float nx = v_texCoord[0];
    float ny = v_texCoord[1];

    float y = texture2D(Ytex, vec2(nx, ny)).r;
    float u = texture2D(Utex, vec2(nx, ny)).r;
    float v = texture2D(Vtex, vec2(nx, ny)).r;
    float a;

    if (hasAlpha) {
      a = texture2D(Atex, vec2(nx, ny)).r;
    } else {
      a = 1.0;
    }

    // Apply dynamic color space conversion
    y = u_yScale * (y - u_yOffset);
    u = u - 0.5;
    v = v - 0.5;

    float r = y + u_rVCoeff * v;
    float g = y + u_gUCoeff * u + u_gVCoeff * v;
    float b = y + u_bUCoeff * u;

    gl_FragColor = vec4(r, g, b, a);
  }`;

// Color space conversion coefficients
interface ColorSpaceParams {
  yOffset: number;
  yScale: number;
  rVCoeff: number;
  gUCoeff: number;
  gVCoeff: number;
  bUCoeff: number;
}

export class WebGLRenderer extends IRenderer {
  gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  program: WebGLProgram | null;
  positionLocation?: number;
  texCoordLocation?: number;
  yTexture: WebGLTexture | null;
  uTexture: WebGLTexture | null;
  vTexture: WebGLTexture | null;
  aTexture: WebGLTexture | null;
  hasAlpha: WebGLUniformLocation | null;
  texCoordBuffer: WebGLBuffer | null;
  surfaceBuffer: WebGLBuffer | null;
  fallback?: WebGLFallback;

  // Color space uniform locations
  private colorSpaceUniforms: {
    yOffset?: WebGLUniformLocation | null;
    yScale?: WebGLUniformLocation | null;
    rVCoeff?: WebGLUniformLocation | null;
    gUCoeff?: WebGLUniformLocation | null;
    gVCoeff?: WebGLUniformLocation | null;
    bUCoeff?: WebGLUniformLocation | null;
  } = {};

  constructor(fallback?: WebGLFallback) {
    super();
    this.gl = null;
    this.rendererType = RendererType.WEBGL;
    this.program = null;
    this.yTexture = null;
    this.uTexture = null;
    this.vTexture = null;
    this.aTexture = null;
    this.hasAlpha = null;
    this.texCoordBuffer = null;
    this.surfaceBuffer = null;
    this.fallback = fallback;
  }

  public override bind(view: HTMLElement) {
    super.bind(view);

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

    const getContext = (
      contextNames = ['webgl2', 'webgl', 'experimental-webgl']
    ): WebGLRenderingContext | WebGLRenderingContext | null => {
      for (let i = 0; i < contextNames.length; i++) {
        const contextName = contextNames[i]!;
        const context = this.canvas?.getContext(contextName, {
          depth: true,
          stencil: true,
          alpha: true,
          antialias: false,
          premultipliedAlpha: true,
          preserveDrawingBuffer: !AgoraEnv.encodeAlpha,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        });
        if (context) {
          return context as WebGLRenderingContext | WebGLRenderingContext;
        }
      }
      return null;
    };
    this.gl ??= getContext();

    if (!this.gl) {
      this.fallback?.call(
        null,
        this,
        new Error('Browser not support! No WebGL detected.')
      );
      return;
    }

    // Set clear color to black, fully opaque
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // Near things obscure far things
    this.gl.depthFunc(this.gl.LEQUAL);
    // Enable blending
    this.gl.enable(this.gl.BLEND);
    // Set blending function
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
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

  public override unbind() {
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
    this.gl = null;

    super.unbind();
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
    alphaBuffer,
    colorSpace,
    colorRange,
  }: VideoFrame) {
    this.rotateCanvas({ width, height, rotation });
    this.updateRenderMode();

    if (!this.gl || !this.program) return;

    // Set color space conversion parameters based on frame properties
    this.setColorSpaceUniforms(colorSpace, colorRange);

    const left = 0,
      top = 0,
      right = yStride! - width!,
      bottom = 0;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const xWidth = width! + left + right;
    const xHeight = height! + top + bottom;
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        left / xWidth,
        bottom / xHeight,
        1 - right / xWidth,
        bottom / xHeight,
        left / xWidth,
        1 - top / xHeight,
        left / xWidth,
        1 - top / xHeight,
        1 - right / xWidth,
        bottom / xHeight,
        1 - right / xWidth,
        1 - top / xHeight,
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

    this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);

    type TextureInfo = {
      texture: WebGLTexture | null;
      stride: number;
      height: number;
      pixels: ArrayBufferView | null;
    };

    const activeTexture = (
      textureIndex: number,
      { texture, stride, height, pixels }: TextureInfo
    ) => {
      if (!this.gl) return;

      this.gl.activeTexture(textureIndex);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.LUMINANCE,
        stride,
        height,
        0,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        pixels
      );
    };

    const textures: Record<number, TextureInfo> = {
      [this.gl.TEXTURE0]: {
        texture: this.yTexture,
        stride: yStride!,
        height: height!,
        pixels: yBuffer!,
      },
      [this.gl.TEXTURE1]: {
        texture: this.uTexture,
        stride: uStride!,
        height: height! / 2,
        pixels: uBuffer!,
      },
      [this.gl.TEXTURE2]: {
        texture: this.vTexture,
        stride: vStride!,
        height: height! / 2,
        pixels: vBuffer!,
      },
    };
    if (alphaBuffer) {
      textures[this.gl.TEXTURE3] = {
        texture: this.aTexture,
        stride: width!,
        height: height!,
        pixels: alphaBuffer,
      };
      this.gl.uniform1i(this.hasAlpha, 1);
    } else {
      this.gl.uniform1i(this.hasAlpha, 0);
    }

    for (const textureIndex in textures) {
      if (textures.hasOwnProperty(textureIndex)) {
        activeTexture(+textureIndex, textures[textureIndex]!);
      }
    }

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    super.drawFrame();
  }

  protected override rotateCanvas({ width, height, rotation }: VideoFrame) {
    super.rotateCanvas({ width, height, rotation });

    if (!this.gl || !this.program) return;

    this.gl.viewport(0, 0, width!, height!);

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
    const p2 = { x: width!, y: 0 };
    const p3 = { x: width!, y: height! };
    const p4 = { x: 0, y: height! };
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
      this.program,
      'u_resolution'
    );
    this.gl.uniform2f(resolutionLocation, width!, height!);
  }

  private initTextures() {
    if (!this.gl || !this.program) return;

    this.positionLocation = this.gl.getAttribLocation(
      this.program,
      'a_position'
    );
    this.texCoordLocation = this.gl.getAttribLocation(
      this.program,
      'a_texCoord'
    );

    this.hasAlpha = this.gl.getUniformLocation(this.program, 'hasAlpha');

    // Get color space uniform locations
    this.colorSpaceUniforms.yOffset = this.gl.getUniformLocation(
      this.program,
      'u_yOffset'
    );
    this.colorSpaceUniforms.yScale = this.gl.getUniformLocation(
      this.program,
      'u_yScale'
    );
    this.colorSpaceUniforms.rVCoeff = this.gl.getUniformLocation(
      this.program,
      'u_rVCoeff'
    );
    this.colorSpaceUniforms.gUCoeff = this.gl.getUniformLocation(
      this.program,
      'u_gUCoeff'
    );
    this.colorSpaceUniforms.gVCoeff = this.gl.getUniformLocation(
      this.program,
      'u_gVCoeff'
    );
    this.colorSpaceUniforms.bUCoeff = this.gl.getUniformLocation(
      this.program,
      'u_bUCoeff'
    );

    this.surfaceBuffer = this.gl.createBuffer();
    this.texCoordBuffer = this.gl.createBuffer();

    const createTexture = (
      texture: number,
      textureIndex: number,
      textureName: string
    ) => {
      if (!this.gl || !this.program) return null;

      // Create a texture.
      this.gl.activeTexture(texture);
      const textureObj = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureObj);
      // Set the parameters so we can render any size
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

      this.gl.uniform1i(
        this.gl.getUniformLocation(this.program, textureName),
        textureIndex
      ); /* Bind Ytex to texture unit index */
      return textureObj;
    };

    this.yTexture = createTexture(this.gl.TEXTURE0, 0, 'Ytex');
    this.uTexture = createTexture(this.gl.TEXTURE1, 1, 'Utex');
    this.vTexture = createTexture(this.gl.TEXTURE2, 2, 'Vtex');
    this.aTexture = createTexture(this.gl.TEXTURE3, 3, 'Atex');

    // Set default color space parameters (BT.601 Limited Range)
    this.setColorSpaceUniforms();
  }

  private releaseTextures() {
    this.gl?.deleteProgram(this.program);
    this.program = null;

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
    logWarn('webglcontextlost', event);

    this.releaseTextures();

    this.fallback?.call(
      null,
      this,
      new Error('Browser not support! No WebGL detected.')
    );
  };

  private handleContextRestored = (event: Event) => {
    event.preventDefault();
    logWarn('webglcontextrestored', event);

    // Setup GLSL program
    this.program = createProgramFromSources(this.gl, [
      vertexShaderSource,
      yuvShaderSource,
    ]) as WebGLProgram;
    this.gl?.useProgram(this.program);

    this.initTextures();
  };

  /**
   * Get color space conversion parameters based on color space and range
   */
  private getColorSpaceParams(
    colorSpace?: VideoColorSpace,
    colorRange?: VideoColorRange
  ): ColorSpaceParams {
    // Default to BT.601 Limited if not specified
    const actualColorSpace = colorSpace ?? VideoColorSpace.VideoColorSpaceBT601;
    const actualColorRange =
      colorRange ?? VideoColorRange.VideoColorRangeLimited;

    // Y offset and scale based on range
    let yOffset: number;
    let yScale: number;

    if (actualColorRange === VideoColorRange.VideoColorRangeFull) {
      yOffset = 0.0;
      yScale = 1.0;
    } else {
      // Limited range: Y [16, 235] -> [0, 1]
      yOffset = 16.0 / 255.0; // 0.0625
      yScale = 255.0 / (235.0 - 16.0); // 1.1643
    }

    // Color space conversion coefficients
    let rVCoeff: number, gUCoeff: number, gVCoeff: number, bUCoeff: number;

    switch (actualColorSpace) {
      case VideoColorSpace.VideoColorSpaceBT709:
        if (actualColorRange === VideoColorRange.VideoColorRangeFull) {
          // BT.709 Full Range
          rVCoeff = 1.5748;
          gUCoeff = -0.1873;
          gVCoeff = -0.4681;
          bUCoeff = 1.8556;
        } else {
          // BT.709 Limited Range
          rVCoeff = 1.5748;
          gUCoeff = -0.1873;
          gVCoeff = -0.4681;
          bUCoeff = 1.8556;
        }
        break;

      case VideoColorSpace.VideoColorSpaceBT2020:
        if (actualColorRange === VideoColorRange.VideoColorRangeFull) {
          // BT.2020 Full Range
          rVCoeff = 1.7166;
          gUCoeff = -0.191;
          gVCoeff = -0.665;
          bUCoeff = 2.141;
        } else {
          // BT.2020 Limited Range
          rVCoeff = 1.7166;
          gUCoeff = -0.191;
          gVCoeff = -0.665;
          bUCoeff = 2.141;
        }
        break;

      case VideoColorSpace.VideoColorSpaceBT601:
      default:
        if (actualColorRange === VideoColorRange.VideoColorRangeFull) {
          // BT.601 Full Range
          rVCoeff = 1.402;
          gUCoeff = -0.3441;
          gVCoeff = -0.7141;
          bUCoeff = 1.772;
        } else {
          // BT.601 Limited Range (your original values)
          rVCoeff = 1.5958;
          gUCoeff = -0.39173;
          gVCoeff = -0.8129;
          bUCoeff = 2.017;
        }
        break;
    }

    return {
      yOffset,
      yScale,
      rVCoeff,
      gUCoeff,
      gVCoeff,
      bUCoeff,
    };
  }

  /**
   * Set color space uniform values in the shader
   */
  private setColorSpaceUniforms(
    colorSpace?: VideoColorSpace,
    colorRange?: VideoColorRange
  ): void {
    if (!this.gl || !this.program) return;

    const params = this.getColorSpaceParams(colorSpace, colorRange);

    if (this.colorSpaceUniforms.yOffset) {
      this.gl.uniform1f(this.colorSpaceUniforms.yOffset, params.yOffset);
    }
    if (this.colorSpaceUniforms.yScale) {
      this.gl.uniform1f(this.colorSpaceUniforms.yScale, params.yScale);
    }
    if (this.colorSpaceUniforms.rVCoeff) {
      this.gl.uniform1f(this.colorSpaceUniforms.rVCoeff, params.rVCoeff);
    }
    if (this.colorSpaceUniforms.gUCoeff) {
      this.gl.uniform1f(this.colorSpaceUniforms.gUCoeff, params.gUCoeff);
    }
    if (this.colorSpaceUniforms.gVCoeff) {
      this.gl.uniform1f(this.colorSpaceUniforms.gVCoeff, params.gVCoeff);
    }
    if (this.colorSpaceUniforms.bUCoeff) {
      this.gl.uniform1f(this.colorSpaceUniforms.bUCoeff, params.bUCoeff);
    }
  }
}
