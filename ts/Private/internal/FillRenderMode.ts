import { VideoSourceType } from '../AgoraMediaBase';

export const FILL_RENDER_MODE_UIDS_KEY =
  'rtc.video.render.remote_view_fill_enable_uids';

const MATCH_ALL = '*';

let rawValue: string | undefined;
let matchAll = false;
let enabledUids: Set<string> = new Set();

function parseInto(value?: string): void {
  rawValue = value === undefined ? undefined : String(value).trim();
  matchAll = rawValue === MATCH_ALL;
  if (!rawValue || matchAll) {
    enabledUids = new Set();
    return;
  }
  enabledUids = new Set(
    rawValue
      .split(',')
      .map((it) => it.trim())
      .filter((it) => it.length > 0)
  );
}

export function setFillRenderModeUids(value?: string): boolean {
  const before = rawValue;
  parseInto(value);
  return before !== rawValue;
}

/**
 * Drop the parameter, so a released engine does not leak it into the next one.
 *
 * This state is module scoped rather than engine scoped, so without an explicit
 * reset it would outlive `release()` and a freshly initialized engine would come
 * up with fill still on. Android keeps the same parameter in the native engine's
 * configuration, where it dies with the engine, so releasing there goes back to
 * the proportional render mode. Called from `RtcEngineExInternal.release()` to
 * match that.
 *
 * Deliberately not called on `leaveChannel`: both platforms keep the parameter
 * across leave and rejoin, and the renderer rebuilt on rejoin picks it up again
 * through `refreshFillRenderMode()`.
 */
export function resetFillRenderMode(): void {
  parseInto(undefined);
}

export function getFillRenderModeUids(): string | undefined {
  return rawValue;
}

export function parseFillRenderModeFromParameters(
  parameters?: string
): boolean {
  if (!parameters || typeof parameters !== 'string') return false;
  if (parameters.indexOf(FILL_RENDER_MODE_UIDS_KEY) === -1) return false;
  try {
    const parsed = JSON.parse(parameters);
    if (
      parsed &&
      typeof parsed === 'object' &&
      FILL_RENDER_MODE_UIDS_KEY in parsed
    ) {
      return setFillRenderModeUids(parsed[FILL_RENDER_MODE_UIDS_KEY]);
    }
  } catch (_) {}
  return false;
}

export function isFillRenderModeEnabled(context?: {
  uid?: number;
  sourceType?: VideoSourceType;
}): boolean {
  if (!context) return false;
  if (context.sourceType !== VideoSourceType.VideoSourceRemote) return false;
  if (matchAll) return true;
  if (enabledUids.size === 0) return false;
  if (context.uid === undefined) return false;
  return enabledUids.has(String(context.uid));
}
