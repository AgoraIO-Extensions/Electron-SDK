# Worker OffscreenCanvas Shared Texture Observability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run the shared-texture test scene in a Worker-owned WebGL2 OffscreenCanvas and expose bounded, structured pacing, timestamp, RTC, and failure telemetry.

**Architecture:** Keep the existing NT-handle/native submission contract unchanged. Add a pure telemetry/protocol module, integrate it into the main-process controller with generation-safe cleanup, forward snapshots through owned IPC, and replace the scene with a DOM-canvas transfer host plus packaged Worker script.

**Tech Stack:** Electron 43.2, JavaScript main process, React/TypeScript Advanced page, Web Worker, OffscreenCanvas/WebGL2, Jest.

---

## File Structure

- `example/src/main/sharedTexturePocTelemetry.js`: versioned Worker-message parsing, bounded samples, quantiles, health reasons, and snapshots.
- `example/src/main/__tests__/sharedTexturePocTelemetry.test.js`: pure telemetry and parser tests.
- `example/src/main/sharedTexturePocController.js`: frame pacing, RTC stats, watchdog, generation-safe submission and terminal cleanup.
- `example/src/main/__tests__/sharedTexturePocController.test.js`: controller lifecycle, frame rate, failure, and timeout tests.
- `example/src/main/sharedTexturePocIpc.js`: start validation and status-listener ownership.
- `example/src/main/__tests__/sharedTexturePocIpc.test.js`: IPC config and subscription tests.
- `example/src/main/index.js`: GPU child-process forwarding and teardown.
- `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.ts`: options, status types, and IPC helpers.
- `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts`: option/status helper tests.
- `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx`: temporary 30/60 and window-state controls plus live status.
- `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePocView.test.tsx`: static rendering contract for controls and latest status.
- `example/extraResources/sharedTextureScene.html`: DOM canvas transfer and Worker diagnostic relay.
- `example/extraResources/sharedTextureSceneWorker.js`: Worker-owned WebGL2 scene and bounded diagnostics.
- `example/src/main/__tests__/sharedTextureScene.test.js`: static packaged-topology contract.
- `docs/shared-texture-poc/README.md` and `README.zh-CN.md`: topology, telemetry, failure boundary, and Windows runbook.

### Task 1: Telemetry And Worker Protocol

- [ ] Add failing tests for the fixed console prefix, version validation, malformed payload rejection, 600-sample FIFO eviction, quantiles, five clock fields, and degradation-reason clearing.
- [ ] Run `yarn jest example/src/main/__tests__/sharedTexturePocTelemetry.test.js --runInBand --watchman=false`; expect failure because the module does not exist.
- [ ] Implement `sharedTexturePocTelemetry.js` with `parseWorkerDiagnostic`, `createTelemetry`, bounded sample insertion, quantile calculation, reason add/clear, RTC stats updates, and immutable snapshots.
- [ ] Re-run the focused telemetry test; expect all tests to pass.
- [ ] Run `yarn jest example/src/main/__tests__/sharedTexturePocTelemetry.test.js example/src/main/__tests__/sharedTexturePocController.test.js example/src/main/__tests__/sharedTexturePocIpc.test.js example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts --runInBand --watchman=false`; expect success.

### Task 2: Controller Pacing, Stats, And Failure Lifecycle

- [ ] Extend controller tests first for `setFrameRate`/`getFrameRate`, hidden/visible/minimized setup, paint and submission metrics, RTC callbacks, 500 ms watchdog degradation/recovery, Worker terminal diagnostics, renderer loss, GPU loss, two-second drain timeout, and stale-generation late settlement. Include controller-level mappings for `unresponsive` adding and `responsive` clearing `renderer-unresponsive`, a valid paint clearing `gpu-process-gone`, and WebGL restoration plus a later valid paint jointly clearing `webgl-context-lost`.
- [ ] Run `yarn jest example/src/main/__tests__/sharedTexturePocController.test.js --runInBand --watchman=false`; confirm each new behavior fails for the intended missing implementation.
- [ ] Integrate telemetry into `SharedTexturePocController`; inject timer/clock functions for deterministic tests, assign a run generation, and emit five-second plus transition snapshots.
- [ ] Add listener ownership and idempotent terminal cleanup. Accept an injected `subscribeGpuProcessGone(listener)` registrar; register it per start and invoke its disposer on stop/failure so restart cannot duplicate it. Ensure a stale submission can release only its own texture and cannot mutate a later run.
- [ ] Re-run controller and telemetry tests; expect all tests to pass.

### Task 3: IPC, GPU Signal, And Advanced Controls

- [ ] Add failing IPC/model tests for defaults (`30`, `hidden`), allowed values, status sender ownership, sender destruction, stop/dispose cleanup, and status subscribe/unsubscribe helpers. Add a failing pure-view server-render test for both option controls and the latest health/counter values.
- [ ] Run `yarn jest example/src/main/__tests__/sharedTexturePocIpc.test.js example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePocView.test.tsx --runInBand --watchman=false`; expect failures for missing options/status behavior.
- [ ] Implement IPC validation and `SHARED_TEXTURE_POC_STATUS` routing without transmitting credentials or texture handles.
- [ ] Provide `subscribeGpuProcessGone` from main. Each controller run registers one filtered `app.child-process-gone` listener and its stop/terminal cleanup removes it.
- [ ] Add compact 30/60 and hidden/visible/minimized controls to the existing Advanced right bar and show the latest health/counters in a pure `SharedTexturePocView` using existing UI components; keep mounted IPC subscription in the wrapper and route it through the tested helper.
- [ ] Re-run the exact IPC/model/view Jest command above and `yarn typecheck`; expect success.

### Task 4: Worker WebGL2 Scene

- [ ] Add a failing static scene test requiring a DOM canvas transfer, a separately packaged Worker, Worker-only `getContext('webgl2')`, the versioned diagnostic prefix, 120-sample cap, context loss/restoration, and error/messageerror forwarding.
- [ ] Run `yarn jest example/src/main/__tests__/sharedTextureScene.test.js --runInBand --watchman=false`; expect failure against the current main-thread 2D scene.
- [ ] Replace the scene host and create `sharedTextureSceneWorker.js`. Use a simple shader and moving color pattern, a timer-driven target cadence, resize messages, full WebGL resource recreation, and one-second diagnostics.
- [ ] Re-run `yarn jest example/src/main/__tests__/sharedTexturePocTelemetry.test.js example/src/main/__tests__/sharedTexturePocController.test.js example/src/main/__tests__/sharedTexturePocIpc.test.js example/src/main/__tests__/sharedTextureRuntime.test.js example/src/main/__tests__/sharedTextureScene.test.js example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePocView.test.tsx --runInBand --watchman=false`; expect success.
- [ ] Run `node --check example/extraResources/sharedTextureSceneWorker.js`; expect exit 0 so the unbundled packaged Worker has an executable JavaScript syntax check.
- [ ] Run `yarn example compile`; expect both main and renderer bundles to compile.

### Task 5: Documentation And Final Verification

- [ ] Update English and Chinese READMEs with the exact supported topology, timestamp `0` boundary, telemetry fields, health transitions, Native synchronous-block limitation, run instructions, and Windows acceptance matrix.
- [ ] Run `git diff --check` and `yarn eslint example/src/main/sharedTexturePocTelemetry.js example/src/main/sharedTexturePocController.js example/src/main/sharedTexturePocIpc.js example/src/main/index.js example/src/main/__tests__/sharedTexturePocTelemetry.test.js example/src/main/__tests__/sharedTexturePocController.test.js example/src/main/__tests__/sharedTexturePocIpc.test.js example/src/main/__tests__/sharedTextureScene.test.js example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.ts example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePocView.test.tsx`; expect exit 0.
- [ ] Run the exact seven-file SharedTexture Jest command from Task 4, `node --check example/extraResources/sharedTextureSceneWorker.js`, `yarn typecheck`, and `yarn example compile` from clean command invocations; record exact totals.
- [ ] Verify `example/package.json` packages both resources through `extraResources/**`, then run the Windows x64 Actions workflow. Download the produced ZIP and run `unzip -l <artifact.zip> | rg 'sharedTextureScene\.(html|js)'`; require one HTML and one Worker entry before claiming package-content acceptance.
- [ ] Inspect `git status` and stage only planned files; leave `example/src/renderer/examples/advanced/SharedTexturePoc/image.png` untouched.
- [ ] Commit the implementation with a scoped Conventional Commit message.

## Windows Runtime Acceptance Gate

CI can prove compilation and ZIP contents but not compositor cadence or GPU recovery. Until the following results exist, report only “implementation complete; Windows runtime acceptance pending”:

- Run hidden, visible, and minimized at 30 and 60 fps for ten minutes per combination. For `T = 1000 / fps`, require `abs(P50 - T) / T <= 0.10`, `P99 < 3 * T`, and no unexplained gap above 500 ms.
- Record Worker `performance.timeOrigin`/`performance.now`, Electron compositor microseconds, main-process `Date.now`/`hrtime`, and submitted RTC timestamp `0`. Native-assigned time is unverified unless Native logs its source, unit, and assignment point.
- Require Worker draw, paint, submission, `encodedFrameCount`, `sentFrameRate`, and `txVideoKBitRate` to advance while a receiver shows motion.
- Inject `WEBGL_lose_context`; require draw/paint to stop and then resume after restoration and a valid paint.
- Invoke `forcefullyCrashRenderer()`; require failed state and bounded asynchronous cleanup when Native calls return.
- Exercise the Native synchronous handle/device error hook and require the failure counter to advance with exactly-once texture release.
- Inspect the Windows x64 ZIP for both scene resources.
- Do not claim real D3D device-loss recovery without separately observing `DXGI_ERROR_DEVICE_REMOVED` or `DXGI_ERROR_DEVICE_RESET`.
