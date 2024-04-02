import { AgoraEnvType } from './Types';

/**
 * @ignore
 */
export const TAG = '[Agora]: ';
/**
 * @ignore
 */
export const DEBUG_TAG = '[Agora Debug]: ';

/**
 * @ignore
 */
export const logWarn = (msg: string, ...optParams: any[]) => {
  if (!AgoraEnv.enableLogging) {
    return;
  }
  console.warn(`${TAG} ${msg}`, ...optParams);
};

/**
 * @ignore
 */
export const logError = (msg: string, ...optParams: any[]) => {
  if (!AgoraEnv.enableLogging) {
    return;
  }
  console.error(`${TAG} ${msg}`, ...optParams);
};

/**
 * @ignore
 */
export const logInfo = (msg: string, ...optParams: any[]) => {
  if (!AgoraEnv.enableLogging) {
    return;
  }
  console.info(`${TAG} ${msg}`, ...optParams);
};

/**
 * @ignore
 */
export const logDebug = (msg: string, ...optParams: any[]) => {
  if (!AgoraEnv.enableLogging || !AgoraEnv.enableDebugLogging) {
    return;
  }
  console.debug(`${DEBUG_TAG} ${msg}`, ...optParams);
};

/**
 * @ignore
 */
export const objsKeysToLowerCase = (array: Array<any>) => {
  array.forEach((obj) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        obj[key.toLocaleLowerCase()] = element;
      }
    }
  });
};

/**
 * @ignore
 */
export function classMix(...mixins: any[]): any {
  class MixClass {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(MixClass, mixin); // 拷贝静态属性
    copyProperties(MixClass.prototype, mixin.prototype); // 拷贝原型属性
  }

  return MixClass;
}

function copyProperties<T>(target: T, source: any) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      let desc = Object.getOwnPropertyDescriptor(source, key)!;
      Object.defineProperty(target, key, desc);
    }
  }
}

/**
 * @ignore
 */
export function isSupportWebGL(): boolean {
  let flag = false;
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  try {
    const getContext = (
      contextNames = ['webgl2', 'webgl', 'experimental-webgl']
    ): WebGLRenderingContext | WebGLRenderingContext | null => {
      for (let i = 0; i < contextNames.length; i++) {
        const contextName = contextNames[i]!;
        const context = canvas?.getContext(contextName);
        if (context) {
          return context as WebGLRenderingContext | WebGLRenderingContext;
        }
      }
      return null;
    };
    let gl = getContext();
    flag = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    gl = null;
    logInfo('Your browser support webGL');
  } catch (e) {
    logWarn('Your browser may not support webGL');
    flag = false;
  }
  return flag;
}

/**
 * @ignore
 */
export function getContextByCanvas(
  // eslint-disable-next-line auto-import/auto-import
  canvas: OffscreenCanvas
): WebGLRenderingContext | WebGL2RenderingContext | null {
  const contextNames = ['webgl2', 'webgl', 'experimental-webgl'];

  for (const contextName of contextNames) {
    //@ts-ignore
    const context = canvas.getContext(contextName, {
      depth: true,
      stencil: true,
      alpha: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'default',
      failIfMajorPerformanceCaveat: false,
    }) as WebGLRenderingContext | WebGL2RenderingContext | null;

    if (context) {
      return context;
    }
  }

  return null;
}

const AgoraNode = require('../build/Release/agora_node_ext');

/**
 * @ignore
 */
export const AgoraEnv: AgoraEnvType = {
  enableLogging: true,
  enableDebugLogging: false,
  enableWebCodecDecode: false,
  webEnvReady: true,
  AgoraElectronBridge: new AgoraNode.AgoraElectronBridge(),
};
