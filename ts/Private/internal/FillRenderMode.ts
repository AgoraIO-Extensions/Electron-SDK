import { VideoSourceType } from '../AgoraMediaBase';

/**
 * CSD-80258：下行渲染 fill（拉伸）模式。
 *
 * 背景：公共枚举 RenderModeType 只有 RenderModeHidden(1, 等比裁剪) 与
 * RenderModeFit(2, 等比留边)，客户两者都不接受。需求要求**用私参打开，不改 API**，
 * 所以这里不往 RenderModeType 里加值（它由 terra 从原生头生成，加了也会被下次生成冲掉），
 * 而是用一个独立的私参开关。
 *
 * 私参名与语义与 Android（CSD-73004，fixVersion 4.3.2.249）保持一致，客户只需记一个开关：
 *
 *   setParameters('{"rtc.video.render.remote_view_fill_enable_uids": "*"}')      // 所有远端
 *   setParameters('{"rtc.video.render.remote_view_fill_enable_uids": "123,456"}') // 指定 uid
 *   setParameters('{"rtc.video.render.remote_view_fill_enable_uids": ""}')        // 关闭
 *
 * 为什么必须在 JS 层实现（而不是复用原生那套）：Electron 的渲染与原生渲染是**两套独立实现**。
 * setupLocalVideo / setupRemoteVideo / setupRemoteVideoEx / setLocalRenderMode /
 * setRemoteRenderMode 在 RtcEngineExInternal 里被完全拦截，只走
 * AgoraEnv.AgoraRendererManager，**不下发给原生**；真正决定裁剪还是留边的是
 * IRenderer.updateRenderMode() 里那个 canvas.style.transform。所以原生侧
 * CSD-73004 的 enableFillRenderMode / mode=20 分支对 Electron 完全不经过。
 * 本文件就是 Electron 这一侧的等价实现。
 *
 * 作用范围与 Android 一致：**只作用于远端视图**。本地预览（sourceType 非
 * VideoSourceRemote，RendererManager.presetRendererContext 会把 uid 置 0）不受影响。
 *
 * 生效模型：**私参下发时计算一次并推给各渲染器**，不在渲染路径上做解析。
 * 配置在这里被解析成 { matchAll, uids:Set }，之后每个 IRenderer 把"自己要不要 fill"
 * 缓存成一个布尔（见 IRenderer.refreshFillRenderMode）。所以逐帧的
 * updateRenderMode() 只读布尔，没有字符串切分、没有集合查找。
 */

/** 私参 key。与 Android 侧 CONFIGURABLE_KEY_VIDEO_RENDER_REMOTE_VIEW_FILL_ENABLE_UIDS 同名。 */
export const FILL_RENDER_MODE_UIDS_KEY =
  'rtc.video.render.remote_view_fill_enable_uids';

/** 通配符：所有远端 uid 都用 fill。 */
const MATCH_ALL = '*';

/** 配置原文，仅用于回读/排查（demo 的「SDK 内部状态」读的就是它）。 */
let rawValue: string | undefined;

/** 解析后的形态。设置时算一次，渲染路径不再碰字符串。 */
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

/**
 * 直接设置开关。传空串或 undefined 表示关闭。
 *
 * @returns 配置是否**发生了变化**。调用方据此决定要不要去推渲染器 —— 没变就不推，
 *          避免同一条私参被重复下发时无谓地重排所有 view。
 */
export function setFillRenderModeUids(value?: string): boolean {
  const before = rawValue;
  parseInto(value);
  return before !== rawValue;
}

/** 读回当前配置原文，用于 demo / 日志里确认私参真的被收到了。 */
export function getFillRenderModeUids(): string | undefined {
  return rawValue;
}

/**
 * 从 setParameters 的 JSON 里把本功能的 key 摘出来。
 *
 * 只认整条 JSON 里的这一个 key，其余一律不管；解析失败就当没设过，不抛异常 ——
 * 这里是"旁听"，不能因为私参格式不对而把用户原本的 setParameters 调用搞失败。
 *
 * @returns 配置是否发生了变化（没有这个 key、或值没变，都返回 false）。
 */
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
  } catch (_) {
    // 非法 JSON：原样放过，由原生侧去报它的错
  }
  return false;
}

/**
 * 这个渲染上下文该不该用 fill。
 *
 * 判定两件事：
 *   1. 是远端视图（sourceType === VideoSourceRemote）—— 与 Android 的作用范围一致；
 *   2. uid 命中配置（"*" 或逗号分隔列表）。
 *
 * 只在私参下发、以及 view 绑定/上下文变化时调用，不在逐帧路径上。
 *
 * uid 按字符串比较，与 Android 等价：Android 侧 configRemoteViewFillEnable 拿到的
 * userId 实际是 `std::to_string(uid)`（channel_proxy_handler.cpp 调
 * setRemoteTrackRenderer 时转的），即**数字 uid 的十进制字符串**，不是用户账号串。
 * 所以配置里写的就是数字 uid，两端一致。
 *
 * 与 Android 的一处已知差异（刻意不复刻对端缺陷）：Android 的 commons::split
 * 最后一个元素不 trim（str_utils.h 的实现问题），所以 "1, 2" 在 Android 上匹配不到 2；
 * 这里每项都 trim。对外仍建议不写空格，保证两端表现一致。
 */
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
