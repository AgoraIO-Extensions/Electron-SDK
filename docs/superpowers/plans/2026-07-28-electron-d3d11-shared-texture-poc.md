# Electron D3D11 Shared Texture PoC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Windows example to Electron 33 and prove that an Electron offscreen ARGB shared texture can be opened, copied entirely on the GPU, and published through Agora as a D3D11 external video frame.

**Architecture:** The existing renderer examples remain renderer-owned. A new renderer control page commands a main-process `SharedTexturePocController`; that controller owns the main-process RTC singleton and offscreen `BrowserWindow`. A serialized Windows N-API worker opens each NT handle, copies it into a bounded owned texture pool, waits for GPU completion, submits the texture through the existing Iris five-buffer ABI, and resolves a Promise so Electron releases the source texture exactly once.

**Tech Stack:** Electron 33, React 18, Electron IPC, Node-API, C++14, D3D11/DXGI, Iris RTC API, Jest, TypeScript, CMake.js, Visual Studio 2022.

---

## File Map

- `docs/poc/d3d11-shared-texture-evidence.md`: Phase 0 ownership/synchronization evidence and Windows run artifacts.
- `example/package.json`, `example/yarn.lock`: exact Electron 33 and local modified SDK resolution.
- `example/src/main/__tests__/sharedTextureRuntime.test.js`: exact runtime and local-addon resolution check.
- `CMakeLists.txt`: Windows D3D11/DXGI link dependencies.
- `source_code/agora_node_ext/d3d11_shared_texture_worker.{h,cpp}`: serialized queue, adapter probe, shared-resource open, GPU copy, completion query, Iris submission, and shutdown.
- `source_code/agora_node_ext/tests/shared_texture_request_test.cpp`: native validation tests.
- `source_code/agora_node_ext/tests/d3d11_shared_texture_worker_test.cpp`: worker state/ownership tests with injected fakes.
- `source_code/agora_node_ext/agora_electron_bridge.{h,cpp}`: Promise-based N-API parsing and worker lifecycle.
- `ts/Types.ts`: native bridge request/result types.
- `ts/Private/IAgoraMediaEngine.ts`: public Windows PoC API contract.
- `ts/Private/impl/IAgoraMediaEngineImpl.ts`: forwards the public method to the native Promise.
- `ts/Private/ti/IAgoraMediaEngine-ti.ts`: regenerated interface metadata.
- `ts/__tests__/MediaEngineInternal.test.ts`, `ts/__tests__/setup.ts`: public/native forwarding tests.
- `example/src/main/sharedTexturePocController.js`: main-process RTC/offscreen state machine and backpressure.
- `example/src/main/sharedTexturePocIpc.js`: IPC registration and cleanup.
- `example/src/main/sharedTextureScene.js`: deterministic offscreen WebGL/DOM scene.
- `example/src/main/index.js`: installs/removes the PoC controller.
- `example/src/main/__tests__/sharedTexturePocController.test.js`: state, queue, error, and release tests.
- `example/src/main/__tests__/sharedTexturePocIpc.test.js`: IPC registration and teardown tests.
- `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx`: control/status UI.
- `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.test.tsx`: renderer command/status tests.
- `example/src/renderer/examples/advanced/index.ts`: route registration.
- `example/README.md`: PoC prerequisites and Windows run procedure.

## Task 1: Close Phase 0 Contracts

**Files:**
- Create: `docs/poc/d3d11-shared-texture-evidence.md`
- Inspect: exact downloaded Electron 33 documentation/source and exact Iris/native Windows SDK headers

- [ ] **Step 1: Pin candidate runtime versions in the evidence file**

Record the exact Electron 33 patch, Electron ABI, Node ABI, Iris build, native RTC build, Windows SDK, and Visual Studio toolset. Do not write native submission code yet.

- [ ] **Step 2: Establish the Electron producer contract**

Capture the exact Electron 33 documentation/source statement for Windows ARGB `OffscreenSharedTexture`: handle type, process validity, readiness at `paint`, and validity through `texture.release()`. Record whether any fence/keyed mutex metadata exists. Mark NV12 and every unknown synchronization mode unsupported.

- [ ] **Step 3: Establish the RTC consumer contract**

Inspect the exact downloaded Windows SDK header and ask the RTC native owner if necessary. Record whether `pushVideoFrame` consumes `ID3D11Texture2D` synchronously or supplies a release/completion signal. State the precise pool release point.

- [ ] **Step 4: Verify both gates are closed**

Expected evidence file values:

```text
Electron producer lifetime: CONFIRMED
RTC consumer lifetime: CONFIRMED
Owned texture release point: <documented event>
```

If either value is `UNKNOWN`, stop implementation and report the blocker. Do not replace the contract with a delay, frame-count heuristic, or assumed synchronous consumption.

- [ ] **Step 5: Commit the evidence**

```bash
git add -f docs/poc/d3d11-shared-texture-evidence.md
git commit -m "docs: record D3D11 texture lifetime contracts"
```

## Task 2: Upgrade the Example Runtime and Local SDK Wiring

**Files:**
- Modify: `example/package.json`
- Modify: `example/yarn.lock`
- Modify: `example/README.md`

- [ ] **Step 1: Add a failing runtime-version check**

Add a Windows PoC preflight script or Jest assertion requiring the exact selected Electron 33 patch and `process.versions.modules` value. It must fail against the current Electron 22 pin.

- [ ] **Step 2: Run the check and verify RED**

```bash
yarn jest example/src/main/__tests__/sharedTextureRuntime.test.js --runInBand --testPathIgnorePatterns=/build/
```

Expected: FAIL because `example/package.json` pins `electron: 22.0.0` and the example resolves the published SDK.

- [ ] **Step 3: Pin Electron 33 and the local SDK**

Set Electron to the exact Phase 0 patch. Replace the example's published `agora-electron-sdk` dependency with the agreed local worktree package mechanism (`file:..` or the repository's `yarn link` bootstrap), and upgrade only build dependencies proven incompatible with Electron 33.

- [ ] **Step 4: Regenerate the example lockfile**

```bash
yarn --cwd example install
```

Expected: the lockfile resolves the exact Electron patch and local SDK without a second published addon copy.

- [ ] **Step 5: Verify runtime check GREEN**

```bash
yarn jest example/src/main/__tests__/sharedTextureRuntime.test.js --runInBand --testPathIgnorePatterns=/build/
```

Expected: PASS.

- [ ] **Step 6: Document exact Windows addon rebuild commands**

Document and later execute:

```powershell
yarn install
yarn build:ts-interface
yarn build_windows_x64_release --runtime=electron --runtime-version=<exact-electron-version>
yarn --cwd example install
yarn example:prepare
```

- [ ] **Step 7: Commit the runtime upgrade**

```bash
git add example/package.json example/yarn.lock example/README.md <runtime-test-file>
git commit -m "chore(example): upgrade Windows PoC to Electron 33"
```

## Task 3: Define the Public Async Texture API

**Files:**
- Modify: `ts/Types.ts`
- Modify: `ts/Private/IAgoraMediaEngine.ts`
- Modify: `ts/Private/impl/IAgoraMediaEngineImpl.ts`
- Modify: `ts/Private/ti/IAgoraMediaEngine-ti.ts`
- Modify: `ts/__tests__/setup.ts`
- Modify: `ts/__tests__/MediaEngineInternal.test.ts`

- [ ] **Step 1: Write the failing forwarding test**

Add a test equivalent to:

```ts
test('pushSharedD3D11Texture forwards a validated request', async () => {
  const request = {
    frameId: 7,
    ntHandle: Buffer.alloc(8),
    width: 1920,
    height: 1080,
    timestampUs: 123_000,
    pixelFormat: 'bgra',
  };

  await expect(
    createAgoraRtcEngine().getMediaEngine().pushSharedD3D11Texture(request)
  ).resolves.toEqual({ frameId: 7, result: 0 });
  expect(pushSharedD3D11TextureMock).toHaveBeenCalledWith(request);
});
```

- [ ] **Step 2: Run and verify RED**

```bash
yarn jest ts/__tests__/MediaEngineInternal.test.ts --runInBand --testPathIgnorePatterns=/build/
```

Expected: FAIL because the method and native mock do not exist.

- [ ] **Step 3: Add narrow public types**

Define `SharedD3D11TextureFrame` and `SharedD3D11TextureResult`. The request accepts only `frameId`, `ntHandle`, width, height, timestamp, and `'bgra' | 'rgba'`; it does not expose a COM pointer.

- [ ] **Step 4: Add the public media-engine method**

Add:

```ts
abstract pushSharedD3D11Texture(
  frame: SharedD3D11TextureFrame
): Promise<SharedD3D11TextureResult>;
```

The implementation delegates directly to `AgoraElectronBridge.PushSharedD3D11Texture(frame)`.

- [ ] **Step 5: Regenerate interface metadata**

```bash
yarn build:ts-interface
```

- [ ] **Step 6: Run focused and source suites GREEN**

```bash
yarn jest ts/__tests__/MediaEngineInternal.test.ts --runInBand --testPathIgnorePatterns=/build/
yarn jest ts/__tests__ --runInBand --testPathIgnorePatterns=/build/
```

Expected: focused test passes; all source suites pass.

- [ ] **Step 7: Commit the API contract**

```bash
git add ts/Types.ts ts/Private/IAgoraMediaEngine.ts ts/Private/impl/IAgoraMediaEngineImpl.ts ts/Private/ti/IAgoraMediaEngine-ti.ts ts/__tests__/setup.ts ts/__tests__/MediaEngineInternal.test.ts
git commit -m "feat: expose shared D3D11 texture submission"
```

## Task 4: Implement Native Argument Validation and Unsupported Platforms

**Files:**
- Modify: `source_code/agora_node_ext/agora_electron_bridge.h`
- Modify: `source_code/agora_node_ext/agora_electron_bridge.cpp`
- Create: `source_code/agora_node_ext/shared_texture_request.h`
- Create: `source_code/agora_node_ext/shared_texture_request.cpp`
- Create: `source_code/agora_node_ext/tests/shared_texture_request_test.cpp`
- Modify: `CMakeLists.txt`

- [ ] **Step 1: Write C++ validation tests first**

Create `shared_texture_request_test` covering wrong handle length, zero/oversized dimensions, unknown format, duplicate frame ID, and closing state. Keep parsing independent of D3D headers. Add `include(CTest)`, guard test targets with `BUILD_TESTING`, and exclude `source_code/agora_node_ext/tests/` from the addon source glob.

- [ ] **Step 2: Run and verify RED on Windows**

```powershell
cmake --build build --config Debug --target shared_texture_request_test
ctest --test-dir build -C Debug -R shared_texture_request --output-on-failure
```

Expected: FAIL because request parsing is absent.

- [ ] **Step 3: Implement request validation**

Copy every N-API value on the JS thread. Reject anything except an 8-byte Windows HANDLE buffer, positive bounded dimensions, monotonic unique frame IDs, nonnegative timestamps, and supported BGRA/RGBA labels.

- [ ] **Step 4: Register the Promise-returning N-API method**

Register `PushSharedD3D11Texture`. On non-Windows, return a rejected Promise with stable code `ERR_PLATFORM_UNSUPPORTED`; never include D3D headers.

- [ ] **Step 5: Link Windows graphics libraries only on Windows**

Add `d3d11`, `dxgi`, and required Windows runtime libraries to the Windows `target_link_libraries` branch.

- [ ] **Step 6: Run tests GREEN**

Run the native validation target on Windows and the TypeScript forwarding suite on macOS.

- [ ] **Step 7: Commit validation**

```bash
git add CMakeLists.txt source_code/agora_node_ext ts/__tests__
git commit -m "feat: validate shared D3D11 texture requests"
```

## Task 5: Implement the Serialized D3D11 Worker

**Files:**
- Create: `source_code/agora_node_ext/d3d11_shared_texture_worker.h`
- Create: `source_code/agora_node_ext/d3d11_shared_texture_worker.cpp`
- Create: `source_code/agora_node_ext/tests/d3d11_shared_texture_worker_test.cpp`
- Modify: `source_code/agora_node_ext/agora_electron_bridge.h`
- Modify: `source_code/agora_node_ext/agora_electron_bridge.cpp`
- Modify: `CMakeLists.txt`

- [ ] **Step 1: Write worker state-machine tests first**

Test with injected fake D3D/Iris operations: queue never exceeds three, oldest queued frame is dropped, executing frame is not dropped, each frame completes once, close rejects new frames, close cancels queued frames, and executing work completes or times out before resource destruction.

- [ ] **Step 2: Run and verify RED**

```powershell
cmake --build build --config Debug --target d3d11_shared_texture_worker_test
ctest --test-dir build -C Debug -R d3d11_shared_texture_worker --output-on-failure
```

Expected: FAIL because the worker is absent.

- [ ] **Step 3: Implement adapter startup probe**

Enumerate DXGI adapters, create a D3D11 device per hardware adapter, attempt `OpenSharedResource1`, require exactly one success, and record adapter description/LUID. Validate resource dimensions/format and reject keyed-mutex/unsupported descriptors.

- [ ] **Step 4: Implement GPU copy completion**

Copy into one of three owned textures, `Flush`, then poll `D3D11_QUERY_EVENT` with bounded sleep, timeout, and `GetDeviceRemovedReason` checks. Never use a staging resource or map/read operation.

- [ ] **Step 5: Implement Iris submission**

Build JSON for `MediaEngine_pushVideoFrame_4e544e2` and pass five buffer pointers in the established order, with slot five equal to `ownedTexture.Get()`. Use track ID `0`. Hold the texture until the Phase 0 release point.

- [ ] **Step 6: Implement Promise completion and shutdown**

Use a per-bridge serialized worker and N-API async completion mechanism. Resolve/reject on the originating environment. Implement `running -> closing -> closed`, bounded drain, exactly-once deferred completion, and finalizer-safe native cleanup.

- [ ] **Step 7: Run native tests GREEN and inspect D3D debug output**

```powershell
ctest --test-dir build -C Debug --output-on-failure
```

Expected: all native tests pass; no live PoC D3D objects after worker destruction.

- [ ] **Step 8: Commit the worker**

```bash
git add CMakeLists.txt source_code/agora_node_ext
git commit -m "feat: submit Electron shared textures through D3D11"
```

## Task 6: Build the Main-Process Controller with TDD

**Files:**
- Create: `example/src/main/sharedTexturePocController.js`
- Create: `example/src/main/__tests__/sharedTexturePocController.test.js`

- [ ] **Step 1: Write state and release tests first**

Cover `idle -> starting -> running -> stopping -> idle`, failed startup, duplicate start, idempotent stop, queue overflow, native resolve, native reject, window close, and app teardown. Every fake texture asserts `release` was called exactly once.

- [ ] **Step 2: Run and verify RED**

```bash
yarn jest example/src/main/__tests__/sharedTexturePocController.test.js --runInBand --testPathIgnorePatterns=/build/
```

Expected: FAIL because the controller is absent.

- [ ] **Step 3: Implement dependency-injected controller**

Inject `BrowserWindow`, RTC factory, clock, logger, and media engine so Jest does not load Electron or the native addon. Start order is initialize, enable video, `setExternalVideoSource(true, true, VideoFrame)`, join, then accept paint frames.

- [ ] **Step 4: Implement bounded frame ownership**

Assign monotonically increasing frame IDs. Track received, pending, submitted, completed, dropped, and released IDs. Drop the oldest queued frame at capacity three. Centralize `releaseOnce(frameId)`.

- [ ] **Step 5: Implement stop ordering**

Stop paint acceptance, drain/cancel native work, release all pending Electron textures, leave channel, disable external source, release RTC, destroy native worker, then close the offscreen window.

- [ ] **Step 6: Run controller tests GREEN**

```bash
yarn jest example/src/main/__tests__/sharedTexturePocController.test.js --runInBand --testPathIgnorePatterns=/build/
```

- [ ] **Step 7: Commit the controller**

```bash
git add example/src/main/sharedTexturePocController.js example/src/main/__tests__/sharedTexturePocController.test.js
git commit -m "feat(example): manage shared texture PoC lifecycle"
```

## Task 7: Add Offscreen Scene and IPC Integration

**Files:**
- Create: `example/src/main/sharedTextureScene.js`
- Create: `example/src/main/sharedTexturePocIpc.js`
- Modify: `example/src/main/index.js`
- Test: `example/src/main/__tests__/sharedTexturePocIpc.test.js`

- [ ] **Step 1: Write failing IPC lifecycle tests**

Verify handlers register once, validate sender/arguments, forward start/stop/status, unsubscribe on window close, and stop before `before-quit` completes.

- [ ] **Step 2: Run and verify RED**

```bash
yarn jest example/src/main/__tests__/sharedTexturePocIpc.test.js --runInBand --testPathIgnorePatterns=/build/
```

- [ ] **Step 3: Implement deterministic scene**

Export a data URL containing moving color bars, frame counter, and `performance.now()` timestamp. Do not use network assets.

- [ ] **Step 4: Create the offscreen window**

Use the exact supported Electron 33 options, ARGB format, 1920x1080, 30 fps, hardware acceleration, and no visible window. Reject a missing texture rather than silently taking `NativeImage` CPU fallback.

- [ ] **Step 5: Install IPC and teardown hooks**

Register handlers outside `did-finish-load`, retain one controller per main window, and remove handlers/stop the controller during close and `before-quit`.

- [ ] **Step 6: Run tests GREEN**

Run both main-process test files.

- [ ] **Step 7: Commit integration**

```bash
git add example/src/main
git commit -m "feat(example): capture Electron offscreen shared textures"
```

## Task 8: Add the Existing-Example Control Page

**Files:**
- Create: `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx`
- Modify: `example/src/renderer/examples/advanced/index.ts`
- Modify: `example/README.md`

- [ ] **Step 1: Write a failing renderer behavior test**

Test configuration submission, Windows-only disabled state, start/stop command state, one status subscription, status counters, and visible categorized error.

- [ ] **Step 2: Run and verify RED**

Run the focused renderer test under the example/Jest configuration selected in Task 2.

- [ ] **Step 3: Implement the control page**

Reuse saved App ID/channel/token/UID values. Provide start/stop commands and compact operational status: state, dimensions/format, adapter LUID, received/submitted/completed/dropped, queue depth, pending/released IDs, and last error.

- [ ] **Step 4: Register the Advanced route**

Add `SharedTexturePoc` to `example/src/renderer/examples/advanced/index.ts`; do not modify unrelated examples.

- [ ] **Step 5: Run renderer tests and typecheck GREEN**

```bash
yarn typecheck
yarn eslint "example/src/renderer/examples/advanced/SharedTexturePoc/**/*.{ts,tsx}" example/src/renderer/examples/advanced/index.ts
```

- [ ] **Step 6: Commit the UI**

```bash
git add example/src/renderer/examples/advanced example/README.md
git commit -m "feat(example): add shared texture PoC controls"
```

## Task 9: Windows Build and Functional Verification

**Files:**
- Update: `docs/poc/d3d11-shared-texture-evidence.md`

- [ ] **Step 1: Build the exact Windows x64 Electron addon**

Run the commands documented in Task 2. Confirm `process.versions.electron`, `process.versions.modules`, and the loaded addon path point to this worktree.

- [ ] **Step 2: Run all automated checks**

```powershell
yarn jest ts/__tests__ example/src/main/__tests__ --runInBand --testPathIgnorePatterns=/build/
yarn typecheck
ctest --test-dir build -C Debug --output-on-failure
```

- [ ] **Step 3: Run the unpackaged PoC**

Verify startup probe, join, moving remote image, BGRA colors, monotonically increasing frame counter, and stop/restart.

- [ ] **Step 4: Run the packaged PoC**

Build with electron-builder and repeat addon-load and remote-image checks.

- [ ] **Step 5: Run the 30-minute resource test**

After five-minute warmup, sample once per second. Verify queue <= 3, pool = 3, handle delta <= 20, final-20-minute private/GPU memory growth < 1 MiB/min, received - released = outstanding, and no D3D debug live objects after stop.

- [ ] **Step 6: Capture GPU evidence**

Use PIX or equivalent to show shared-resource open and GPU copy with no staging/map/readback resource. Save a remote receiver recording.

- [ ] **Step 7: Compare CPU path**

Run ten-minute shared-texture and CPU BGRA samples under identical settings. Record median process CPU, p95 frame interval, submitted FPS, drops, and GPU utilization without inventing an unmeasured percentage claim.

- [ ] **Step 8: Commit verification evidence**

```bash
git add -f docs/poc/d3d11-shared-texture-evidence.md
git commit -m "test: verify D3D11 shared texture PoC on Windows"
```

## Task 10: Final Regression and Handoff

**Files:**
- Modify only if findings require scoped fixes

- [ ] **Step 1: Run macOS-source checks**

```bash
yarn jest ts/__tests__ example/src/main/__tests__ --runInBand --testPathIgnorePatterns=/build/
yarn typecheck
git diff --check origin/special/4.5.3.123_screenshare...HEAD
```

- [ ] **Step 2: Re-run Windows release checks**

Confirm exact Electron ABI addon load, native tests, unpackaged run, packaged run, and remote publishing.

- [ ] **Step 3: Inspect scope**

```bash
git status --short
git diff --stat origin/special/4.5.3.123_screenshare...HEAD
git log --oneline origin/special/4.5.3.123_screenshare..HEAD
```

Expected: only spec/evidence, Electron 33 example upgrade, public shared-texture API, Windows native bridge, controller, tests, and PoC UI.

- [ ] **Step 4: Request code review**

Use `superpowers:requesting-code-review` with the approved spec, this plan, Phase 0 evidence, and Windows verification artifacts.

- [ ] **Step 5: Prepare integration options**

Use `superpowers:finishing-a-development-branch`; do not merge or push without user direction.
