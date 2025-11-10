import { VideoFrame } from '../../Private/AgoraMediaBase';
import { logInfo, logWarn } from '../../Utils';
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
  fallback?: WebGLFallback;
  frameCount: number = 0; // 用于跟踪渲染的帧数

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
          alpha: false,
          antialias: false,
          premultipliedAlpha: true,
          preserveDrawingBuffer: true,
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
    try {
      this.program = createProgramFromSources(this.gl, [
        vertexShaderSource,
        yuvShaderSource,
      ]) as WebGLProgram;
      this.gl.useProgram(this.program);
      logInfo(`[FPS_INFO][WEBGL] 着色器程序创建成功`);

      this.initTextures();
    } catch (error) {
      logInfo(`[FPS_INFO][WEBGL] 着色器程序创建失败:`, error);
    }
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
    this.gl = undefined;

    super.unbind();
  }

  // 跟踪帧参数变化
  private lastFrameParams = {
    width: 0,
    height: 0,
    yStride: 0,
    uStride: 0,
    vStride: 0,
    rotation: -1,
  };

  // 检查帧参数是否变化
  private checkFrameParamsChanged(frame: VideoFrame): boolean {
    const { width, height, yStride, uStride, vStride, rotation } = frame;

    const changed =
      width !== this.lastFrameParams.width ||
      height !== this.lastFrameParams.height ||
      yStride !== this.lastFrameParams.yStride ||
      uStride !== this.lastFrameParams.uStride ||
      vStride !== this.lastFrameParams.vStride ||
      rotation !== this.lastFrameParams.rotation;

    if (changed) {
      this.lastFrameParams = {
        width: width!,
        height: height!,
        yStride: yStride!,
        uStride: uStride!,
        vStride: vStride!,
        rotation: rotation!,
      };
    }

    return changed;
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
    }: VideoFrame
  ) {
    const startTime = performance.now();
    let lastTime = startTime;
    let currentTime;

    // 验证旋转值，只接受 0, 90, 180, 270
    if (
      rotation !== 0 &&
      rotation !== 90 &&
      rotation !== 180 &&
      rotation !== 270
    ) {
      logInfo(
        `[FPS_INFO][WEBGL][UID:${uid}] 警告: 无效的旋转值 ${rotation}，已修正为 0`
      );
      rotation = 0; // 将无效的旋转值重置为0
    }

    // 检查帧参数是否变化
    const frameParamsChanged = this.checkFrameParamsChanged({
      width,
      height,
      yStride,
      uStride,
      vStride,
      rotation,
    } as VideoFrame);

    logInfo(
      `[FPS_INFO][WEBGL][UID:${uid}] 开始渲染帧:`,
      '宽度:',
      width,
      '高度:',
      height,
      '旋转:',
      rotation,
      '参数变化:',
      frameParamsChanged
    );

    // 步骤1: 旋转画布 - 只在必要时执行
    const rotateCanvasStartTime = performance.now();
    if (frameParamsChanged) {
      logInfo(`[FPS_INFO][WEBGL][UID:${uid}] 旋转画布函数调用开始`);
      this.rotateCanvas({ width, height, rotation });
      logInfo(
        `[FPS_PERF][UID:${uid}] 旋转画布函数调用结束: ${(
          performance.now() - rotateCanvasStartTime
        ).toFixed(2)}ms`
      );
    }
    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤1-旋转画布: ${(
        currentTime - lastTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    // 步骤2: 更新渲染模式 - 只在必要时执行
    if (frameParamsChanged) {
      this.updateRenderMode();
    }
    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤2-更新渲染模式: ${(
        currentTime - lastTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    if (!this.gl || !this.program) {
      logInfo(`[FPS_INFO][WEBGL][UID:${uid}] 渲染失败: 上下文或程序未初始化`);
      return;
    }

    const left = 0,
      top = 0,
      right = yStride! - width!,
      bottom = 0;

    // 步骤3: 设置纹理坐标
    const xWidth = width! + left + right;
    const xHeight = height! + top + bottom;

    // 步骤3.1: 创建/更新纹理坐标
    const texCoordStartTime = performance.now();

    // 检查是否需要更新纹理坐标 - 使用帧参数变化或首次创建作为条件
    const texCoordsNeedUpdate = frameParamsChanged || !this.texCoordArray;

    if (texCoordsNeedUpdate) {
      // 绑定缓冲区 - 只在需要更新时绑定
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

      // 如果纹理尺寸变化或首次创建，才更新纹理坐标
      if (!this.texCoordArray) {
        this.texCoordArray = new Float32Array(12); // 6个顶点，每个顶点2个坐标
      }

      // 更新纹理坐标数据
      this.texCoordArray[0] = left / xWidth;
      this.texCoordArray[1] = bottom / xHeight;
      this.texCoordArray[2] = 1 - right / xWidth;
      this.texCoordArray[3] = bottom / xHeight;
      this.texCoordArray[4] = left / xWidth;
      this.texCoordArray[5] = 1 - top / xHeight;
      this.texCoordArray[6] = left / xWidth;
      this.texCoordArray[7] = 1 - top / xHeight;
      this.texCoordArray[8] = 1 - right / xWidth;
      this.texCoordArray[9] = bottom / xHeight;
      this.texCoordArray[10] = 1 - right / xWidth;
      this.texCoordArray[11] = 1 - top / xHeight;
    }

    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤3.1-创建/更新纹理坐标: ${(
        currentTime - texCoordStartTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    // 步骤3.2: 上传顶点数据
    if (texCoordsNeedUpdate) {
      // 只有在纹理坐标变化时才上传数据
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        this.texCoordArray,
        this.gl.STATIC_DRAW
      );

      // 步骤3.3: 设置顶点属性 - 只在更新纹理坐标时设置
      this.gl.enableVertexAttribArray(this.texCoordLocation!);
      this.gl.vertexAttribPointer(
        this.texCoordLocation!,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
    }
    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤3.2-3.3-上传顶点数据和设置属性: ${(
        currentTime - lastTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    // 步骤4: 设置像素存储模式 - 只在首次渲染或参数变化时设置
    if (frameParamsChanged || this.frameCount === 0) {
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
    }
    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤4-设置像素存储模式: ${(
        currentTime - lastTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    // 检查纹理尺寸是否变化
    const yTextureSizeChanged =
      this.lastYTexWidth !== xWidth || this.lastYTexHeight !== height;
    const uTextureSizeChanged =
      this.lastUTexWidth !== uStride || this.lastUTexHeight !== height! / 2;
    const vTextureSizeChanged =
      this.lastVTexWidth !== vStride || this.lastVTexHeight !== height! / 2;

    // 步骤5: 上传Y纹理
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.yTexture);

    if (yTextureSizeChanged) {
      // 如果尺寸变化，重新分配纹理
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.LUMINANCE,
        xWidth,
        height!,
        0,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        yBuffer!
      );
      // 缓存新的纹理尺寸
      this.lastYTexWidth = xWidth;
      this.lastYTexHeight = height!;
    } else {
      // 尺寸不变，使用texSubImage2D更新内容
      this.gl.texSubImage2D(
        this.gl.TEXTURE_2D,
        0,
        0,
        0, // xoffset, yoffset
        xWidth,
        height!,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        yBuffer!
      );
    }

    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤5-上传Y纹理: ${(
        currentTime - lastTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    // 步骤6: 上传U纹理
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.uTexture);

    if (uTextureSizeChanged) {
      // 如果尺寸变化，重新分配纹理
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.LUMINANCE,
        uStride!,
        height! / 2,
        0,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        uBuffer!
      );
      // 缓存新的纹理尺寸
      this.lastUTexWidth = uStride!;
      this.lastUTexHeight = height! / 2;
    } else {
      // 尺寸不变，使用texSubImage2D更新内容
      this.gl.texSubImage2D(
        this.gl.TEXTURE_2D,
        0,
        0,
        0, // xoffset, yoffset
        uStride!,
        height! / 2,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        uBuffer!
      );
    }

    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤6-上传U纹理: ${(
        currentTime - lastTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    // 步骤7: 上传V纹理
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.vTexture);

    if (vTextureSizeChanged) {
      // 如果尺寸变化，重新分配纹理
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.LUMINANCE,
        vStride!,
        height! / 2,
        0,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        vBuffer!
      );
      // 缓存新的纹理尺寸
      this.lastVTexWidth = vStride!;
      this.lastVTexHeight = height! / 2;
    } else {
      // 尺寸不变，使用texSubImage2D更新内容
      this.gl.texSubImage2D(
        this.gl.TEXTURE_2D,
        0,
        0,
        0, // xoffset, yoffset
        vStride!,
        height! / 2,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        vBuffer!
      );
    }

    currentTime = performance.now();
    logInfo(
      `[FPS_PERF][UID:${uid}] 步骤7-上传V纹理: ${(
        currentTime - lastTime
      ).toFixed(2)}ms`
    );
    lastTime = currentTime;

    try {
      // 步骤8: 绘制三角形
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      currentTime = performance.now();
      logInfo(
        `[FPS_PERF][UID:${uid}] 步骤8-绘制三角形: ${(
          currentTime - lastTime
        ).toFixed(2)}ms`
      );
      lastTime = currentTime;

      // 步骤9: 调用父类drawFrame
      super.drawFrame(uid);
      currentTime = performance.now();
      logInfo(
        `[FPS_PERF][UID:${uid}] 步骤9-调用父类drawFrame: ${(
          currentTime - lastTime
        ).toFixed(2)}ms`
      );

      // 总结
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      this.frameCount++;

      // 输出每个步骤的耗时占比
      logInfo(
        `[FPS_INFO][WEBGL][UID:${uid}] 渲染完成:`,
        '总耗时:',
        renderTime.toFixed(2) + 'ms',
        'YUV纹理大小:',
        `${xWidth}x${height!}`,
        '帧ID:',
        this.frameCount
      );

      // 性能分析总结
      logInfo(
        `[FPS_PERF_SUMMARY][UID:${uid}] 帧${this.frameCount} 性能分布:`,
        `总耗时=${renderTime.toFixed(2)}ms`,
        `纹理上传总耗时=${(
          currentTime -
          texCoordStartTime -
          (currentTime - lastTime)
        ).toFixed(2)}ms`
      );
    } catch (error) {
      logInfo(`[FPS_INFO][WEBGL][UID:${uid}] 渲染错误:`, error);
    }
  }

  // 缓存参数和缓冲区
  private lastRotation: number = -1;
  private lastWidth: number = 0;
  private lastHeight: number = 0;

  // 纹理尺寸缓存
  private lastYTexWidth: number = 0;
  private lastYTexHeight: number = 0;
  private lastUTexWidth: number = 0;
  private lastUTexHeight: number = 0;
  private lastVTexWidth: number = 0;
  private lastVTexHeight: number = 0;

  // 缓冲区
  private vertexBuffer: Float32Array | null = null;
  private texCoordArray: Float32Array | null = null;

  protected override rotateCanvas({ width, height, rotation }: VideoFrame) {
    // 只在尺寸或旋转角度变化时执行
    const sizeChanged = width !== this.lastWidth || height !== this.lastHeight;
    const rotationChanged = rotation !== this.lastRotation;

    if (!sizeChanged && !rotationChanged) {
      // 如果尺寸和旋转角度都没变，直接返回
      return;
    }

    // 更新缓存的参数
    this.lastWidth = width!;
    this.lastHeight = height!;
    this.lastRotation = rotation!;

    super.rotateCanvas({ width, height, rotation });

    if (!this.gl) return;

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

    // 创建或重用顶点缓冲区
    if (!this.vertexBuffer) {
      this.vertexBuffer = new Float32Array(12); // 6个顶点，每个顶点2个坐标
    }

    // 更新顶点数据
    this.vertexBuffer[0] = pp1.x;
    this.vertexBuffer[1] = pp1.y;
    this.vertexBuffer[2] = pp2.x;
    this.vertexBuffer[3] = pp2.y;
    this.vertexBuffer[4] = pp4.x;
    this.vertexBuffer[5] = pp4.y;
    this.vertexBuffer[6] = pp4.x;
    this.vertexBuffer[7] = pp4.y;
    this.vertexBuffer[8] = pp2.x;
    this.vertexBuffer[9] = pp2.y;
    this.vertexBuffer[10] = pp3.x;
    this.vertexBuffer[11] = pp3.y;

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertexBuffer,
      this.gl.STATIC_DRAW
    );

    const resolutionLocation = this.gl.getUniformLocation(
      this.program!,
      'u_resolution'
    );
    this.gl.uniform2f(resolutionLocation, width!, height!);
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
    logWarn(`[FPS_INFO][WEBGL]上下文丢失`, event);

    this.releaseTextures();

    this.fallback?.call(
      null,
      this,
      new Error('Browser not support! No WebGL detected.')
    );
  };

  private handleContextRestored = (event: Event) => {
    event.preventDefault();
    logWarn(`[FPS_INFO][WEBGL] 上下文恢复`, event);

    // Setup GLSL program
    this.program = createProgramFromSources(this.gl, [
      vertexShaderSource,
      yuvShaderSource,
    ]) as WebGLProgram;
    this.gl?.useProgram(this.program);

    this.initTextures();
  };
}
