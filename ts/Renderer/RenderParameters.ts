import { NativeParameterResult } from '../Types';
import { logInfo } from '../Utils';

/**
 * Private parameters of the rendering module: enable_video_element (CSD-80880), enable_r8
 * (NMS-32101).
 *
 * The app sets them with `setParameters`, which sends them to the native SDK unchanged like any
 * other key; the native SDK merges the sources by priority (config service 1, console 10,
 * setParameters 50, emergency config 90). This module does not intercept them and keeps no copy:
 * every time a renderer is created, the value in effect is read from the native SDK
 * (`getParameters(key, 'bool')`), so a change applies to the renderers created after it.
 *
 * When the read fails (old iris: -1009; key never set or native SDK without NMS-32133: -7) or
 * does not return a boolean, the default is used.
 */
export const ENABLE_VIDEO_ELEMENT =
  'electron.video.render.enable_video_element';
export const ENABLE_R8 = 'electron.video.render.enable_r8';

export type RenderParameterKey = typeof ENABLE_VIDEO_ELEMENT | typeof ENABLE_R8;
export type RenderParameterSource = 'native' | 'default';
export type RenderParameterReader = (
  key: RenderParameterKey
) => NativeParameterResult;

const DEFAULTS: Record<RenderParameterKey, boolean> = {
  [ENABLE_VIDEO_ELEMENT]: false,
  [ENABLE_R8]: true,
};

let reader: RenderParameterReader | undefined;

/** Registers how to read a parameter from the native SDK (engine initialize). Nothing is read here. */
export function setRenderParameterReader(read: RenderParameterReader): void {
  reader = read;
}

/** Forgets the reader (engine release). */
export function resetRenderParameters(): void {
  reader = undefined;
}

/**
 * Value in effect and where it came from, read from the native SDK on every call (one call per
 * renderer created). Without a reader (engine not initialized) the default is returned.
 */
export function getRenderParameter(key: RenderParameterKey): {
  value: boolean;
  source: RenderParameterSource;
} {
  if (!reader) return { value: DEFAULTS[key], source: 'default' };

  let ret: NativeParameterResult;
  try {
    ret = reader(key);
  } catch (e) {
    ret = { result: -1 };
  }
  const native = ret.result === 0 && typeof ret.value === 'boolean';
  const value = native ? (ret.value as boolean) : DEFAULTS[key];
  const source: RenderParameterSource = native ? 'native' : 'default';
  logInfo(
    'render parameter read',
    key,
    `result=${ret.result}`,
    `value=${value} (${source})`
  );
  return { value, source };
}

/** electron.video.render.enable_video_element: only native `true` turns it on. */
export function isVideoElementRendererEnabled(): boolean {
  return getRenderParameter(ENABLE_VIDEO_ELEMENT).value;
}

/** electron.video.render.enable_r8: only native `false` turns it off. */
export function isR8Enabled(): boolean {
  return getRenderParameter(ENABLE_R8).value;
}
