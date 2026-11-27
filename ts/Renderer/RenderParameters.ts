import { NativeParameterResult } from '../Types';
import { logInfo } from '../Utils';

/**
 * Private parameters of the rendering module (CSD-80880).
 *
 * The app sets them with `setParameters`, which sends them to the native SDK unchanged like any
 * other key; the native SDK merges the sources by priority (config service 1, console 10,
 * setParameters 50, emergency config 90). This module does not intercept them: the first time
 * the rendering module needs a switch it reads the value in effect from the native SDK
 * (`getParameters(key, 'bool')`) and keeps it until the engine is released.
 *
 * When the read fails (old iris: -1009; key never set or native SDK without NMS-32133: -7) or
 * does not return a boolean, the default is used, and also kept.
 */
export const ENABLE_VIDEO_ELEMENT =
  'electron.video.render.enable_video_element';

export type RenderParameterKey = typeof ENABLE_VIDEO_ELEMENT;
export type RenderParameterSource = 'native' | 'default';
export type RenderParameterReader = (
  key: RenderParameterKey
) => NativeParameterResult;

const DEFAULTS: Record<RenderParameterKey, boolean> = {
  [ENABLE_VIDEO_ELEMENT]: false,
};

interface Cached {
  value: boolean;
  source: RenderParameterSource;
  /** Return code of the native read. */
  result: number;
}

let reader: RenderParameterReader | undefined;
const cache: Partial<Record<RenderParameterKey, Cached>> = {};

/**
 * Registers how to read a parameter from the native SDK (engine initialize). Nothing is read
 * here; values cached by a previous engine are dropped.
 */
export function setRenderParameterReader(read: RenderParameterReader): void {
  reader = read;
  clearCache();
}

/** Forgets the reader and the cached values (engine release). */
export function resetRenderParameters(): void {
  reader = undefined;
  clearCache();
}

function clearCache(): void {
  for (const key of Object.keys(cache) as RenderParameterKey[]) {
    delete cache[key];
  }
}

/**
 * Value in effect and where it came from. The first call after initialize reads the native SDK;
 * later calls return the cached value. Without a reader (engine not initialized) the default is
 * returned and nothing is cached.
 */
export function getRenderParameter(key: RenderParameterKey): {
  value: boolean;
  source: RenderParameterSource;
} {
  const hit = cache[key];
  if (hit) return { value: hit.value, source: hit.source };
  if (!reader) return { value: DEFAULTS[key], source: 'default' };

  let ret: NativeParameterResult;
  try {
    ret = reader(key);
  } catch (e) {
    ret = { result: -1 };
  }
  const entry: Cached =
    ret.result === 0 && typeof ret.value === 'boolean'
      ? { value: ret.value, source: 'native', result: ret.result }
      : { value: DEFAULTS[key], source: 'default', result: ret.result };
  cache[key] = entry;
  logInfo(
    'render parameter read',
    key,
    `result=${entry.result}`,
    `value=${entry.value} (${entry.source})`
  );
  return { value: entry.value, source: entry.source };
}

/** electron.video.render.enable_video_element: only native `true` turns it on. */
export function isVideoElementRendererEnabled(): boolean {
  return getRenderParameter(ENABLE_VIDEO_ELEMENT).value;
}
