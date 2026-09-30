# Worker OffscreenCanvas Shared Texture Observability Design

## Goal

Extend the Windows shared-texture PoC with the closest compositor-compatible
variant of the customer topology: a DOM canvas is transferred to a Worker,
WebGL2 renders into the resulting `OffscreenCanvas`, and Electron captures the
composited DOM surface as a shared D3D11 texture. Add enough telemetry to answer
the customer's timestamp, background pacing, and device-loss questions with
measured evidence.

## Scope

This phase proves the renderer/compositor topology and makes failure modes
observable. It does not claim production A/V synchronization, automatic GPU
recovery, or macOS texture transport.

It also does not prove that the customer's current standalone Worker-created
`OffscreenCanvas`, which has no DOM canvas or `WebContents`, can be captured.
That surface never enters Electron's compositor. The customer must adopt the
DOM canvas transfer path tested here while keeping WebGL2 ownership in its
Worker.

The existing RTC and NT-handle contract remains unchanged. The addon continues
to pass Electron's original handle value to Native, and RTC video timestamps
remain `0` until the common audio/video clock contract is agreed with Native.

## Architecture

The packaged scene retains a real DOM `<canvas>`, immediately transfers it with
`transferControlToOffscreen()`, and sends the `OffscreenCanvas` to a dedicated
Worker. The Worker owns the WebGL2 context and animation loop. Because the DOM
canvas remains attached to the document, Worker output is presented through the
renderer compositor and reaches Electron's offscreen `paint` event.

The main-process controller explicitly configures `webContents.setFrameRate()`
before loading the scene and verifies it with `getFrameRate()`. Start accepts
`frameRate` (`30` or `60`, default `30`) and `captureWindowState` (`hidden`,
`visible`, or `minimized`, default `hidden`). Visible/minimized modes exist only
for pacing experiments; production remains hidden.

The Worker emits a versioned diagnostic message once per second with frame
sequence, requested fps, `performance.timeOrigin` in epoch milliseconds,
current `performance.now()` in monotonic milliseconds, rolling draw interval
samples in milliseconds, and WebGL context state. The Worker retains at most
120 intervals and evicts the oldest sample first. It posts this object to the
page. The page writes one console line using the fixed
`AGORA_SHARED_TEXTURE_POC_V1 ` prefix followed by JSON. Worker `error` and
`messageerror` use the same protocol. The main process listens to
`webContents.console-message`, rejects malformed or unknown-version records,
and correlates valid records with paint telemetry.

The controller records paint count, submitted count, replaced pending frames,
invalid frames, submission failures, last Electron compositor timestamp in
microseconds, main-process `hrtime` in nanoseconds, `Date.now()` in epoch
milliseconds, paint intervals and submission latency in milliseconds, and the
maximum paint gap. Interval and latency distributions are rolling arrays capped
at 600 samples; snapshots report count, P50, P95, P99, and maximum. State resets
for every start and snapshots are emitted every five seconds plus every state
transition.

The existing RTC event handler also records `onLocalVideoStats` fields
`encodedFrameCount` and `sentFrameRate`, plus `onRtcStats.txVideoKBitRate`.
Acceptance compares successive five-second snapshots and requires these
counters/rates to remain nonzero and advance while Worker draw and paint counts
advance. The remote receiving client independently confirms decoded motion.

The controller observes `webContents.render-process-gone`, BrowserWindow
`unresponsive`/`responsive`, and a paint watchdog. The main-process integration
observes `app.child-process-gone`, filters `details.type === 'GPU'`, and forwards
the event to the active controller. These events mark the stream degraded and
emit structured telemetry. A renderer exit is terminal; a GPU exit and paint
timeout are degraded signals because Chromium may recover them. This phase does
not automatically recreate the BrowserWindow or rejoin RTC.

Health is derived from a set of active degradation reasons. The paint watchdog
threshold is 500 ms. `paint-timeout` clears on the next valid paint;
`renderer-unresponsive` clears only on BrowserWindow `responsive`;
`gpu-process-gone` clears on the first subsequent valid shared-texture paint;
and `webgl-context-lost` clears only after the Worker reports restoration and a
new valid paint arrives. Health returns to `healthy` only when the set is empty.

## Data Flow

```text
DOM canvas
  -> transferControlToOffscreen()
  -> Worker WebGL2 framebuffer
  -> renderer compositor
  -> Electron offscreen paint/details.texture
  -> existing latest-frame controller
  -> original NT handle through Iris slot 4
  -> Native RTC SDK and encoder
```

The main process sends snapshots over `SHARED_TEXTURE_POC_STATUS` to the
WebContents that invoked start. The IPC registration owns this subscription,
removes it on stop, sender destruction, or IPC disposal, and never broadcasts
credentials or handles. The Advanced page subscribes while mounted and shows
the latest counters and stream health.

## Error And Recovery Boundary

- Worker WebGL context loss pauses drawing; restoration recreates all WebGL
  resources and resumes the loop.
- Worker initialization failure, unavailable WebGL2, Worker `error`, or Worker
  `messageerror` is terminal and follows the same drain, listener removal, RTC
  leave, and resource-release transition as renderer exit.
- A renderer crash or process exit enters a terminal failure transition. It
  cancels a pending join, rejects new paint, releases the pending texture,
  waits up to two seconds for the in-flight submission to settle, stops
  watchdog/snapshot timers, removes window/WebContents/app listeners,
  terminates the Worker by destroying the window, leaves RTC, and releases the
  engine. If the submission does not settle, the controller records a drain
  timeout and releases the Electron texture exactly once before continuing.
  This is safe only because the Native contract requires opening the borrowed
  handle and retaining its own COM reference synchronously before returning;
  a late Promise settlement therefore cannot require the Electron texture. The
  status snapshot remains `failed` until an explicit new start.
- Each start creates a monotonically increasing run generation and every
  submission callback captures it. A callback from an older generation may
  release its own texture once but cannot clear the current run's `inFlight`,
  mutate current counters, submit pending work, or change health. Tests cover
  timeout, restart, and late settlement in that order.
- The two-second drain bound applies only after `pushSharedD3D11Texture` has
  returned a Promise. Today the addon calls `CallIrisApi` synchronously before
  returning that Promise; if Native blocks inside `CallIrisApi`, JavaScript
  timers and cleanup cannot run. This PoC does not claim recovery from that
  failure. Production support requires moving the blocking call off the main
  thread or adding a cancellable Native API and testing that bridge directly.
- A paint timeout emits a degraded diagnostic and recovers automatically if a
  later paint arrives.
- A GPU child-process exit emits a degraded diagnostic and starts the paint
  watchdog; it is not treated as proof of D3D device loss.
- Native handle/device errors remain synchronous submission failures and are
  counted and logged by the controller.
- Automatic BrowserWindow recreation and RTC stream continuity are deferred
  until the failure signatures have been measured on Windows.

During a gap the PoC sends no synthetic black frames. Remote behavior should be
a frozen last frame or a gap according to RTC behavior, with diagnostics
showing the exact outage interval.

## Verification

Unit tests cover start-option validation, frame-rate configuration and readback,
bounded telemetry, frame replacement and submission failure counters, the
versioned Worker diagnostic parser, watchdog degradation/recovery, renderer and
GPU-process signals, status-listener ownership, and cleanup of timers and
textures. Static scene tests prove the DOM canvas is transferred and WebGL2 is
created only inside the Worker.

The local build verifies JavaScript/TypeScript and packaged resource inclusion.
Windows runtime acceptance requires all of the following:

- After Worker-ready, Worker draw, shared-texture paint, submission, encoded
  frame, and bitrate counters continue increasing and remote motion is visible.
- Run hidden, visible, and minimized modes at both 30 and 60 fps for at least
  ten minutes each. For target interval `T = 1000 / fps`, measured paint
  intervals must satisfy `abs(P50 - T) / T <= 0.10`, P99 must be below `3 * T`,
  and no unexplained gap may exceed 500 ms. Results are evidence, not an
  assumed cross-platform guarantee.
- Correlate Worker epoch/monotonic timestamps, Electron compositor microseconds,
  and main-process epoch/monotonic timestamps in one log. The submitted RTC
  timestamp is explicitly recorded as constant `0`. If Native exposes its
  SDK-assigned capture timestamp, Native must additionally log its clock source,
  unit, and assignment point; without that instrumentation the PoC does not
  claim a Native-clock correlation.
- Inject Worker WebGL loss with `WEBGL_lose_context`: drawing and paint stop,
  then both resume after restoration and WebGL resources are recreated.
- Call `webContents.forcefullyCrashRenderer()`: when Native calls return, the
  controller reaches failed, releases every texture, and leaves RTC within the
  bounded asynchronous drain period.
- Unit-test an in-flight submission that never settles: terminal cleanup records
  the two-second drain timeout, releases once, and completes.
- Exercise a Native test hook that returns a device/handle error and verify it
  is counted synchronously without leaking the Electron texture.
- Confirm both the HTML and Worker script are included in the final ZIP.

A real D3D11 device removal cannot be claimed unless a platform-level injection
actually produces `DXGI_ERROR_DEVICE_REMOVED` or `DXGI_ERROR_DEVICE_RESET`.
`forcefullyCrashRenderer()`, WebGL context loss, and GPU child exit are useful
but distinct failure tests. macOS pacing is a separate measurement, and macOS
shared-texture transport remains a separate IOSurface/Metal design.

## Deliverables

- Worker-based WebGL2 scene packaged with the Example.
- Configurable 30/60 fps compositor pacing.
- Structured telemetry snapshots available in logs and status events.
- Tests and bilingual documentation describing what is proved and what remains.
