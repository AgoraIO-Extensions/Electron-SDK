# Electron 43 Direct D3D11 Shared Texture PoC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Electron 43.2 Windows offscreen shared textures through Agora by opening the NT handle and synchronously passing the resulting `ID3D11Texture2D*` to Iris without a CPU or GPU copy.

**Architecture:** A main-process controller owns the offscreen window, Electron texture lifetime, and PoC RTC singleton. A narrow async TypeScript API reaches a Windows native direct importer that selects the compatible D3D11 adapter, validates the opened texture, invokes Iris synchronously, and returns before JavaScript releases the Electron texture.

**Tech Stack:** Electron 43.2.0, Node 24.18.0, React 18, Electron IPC, TypeScript, Node-API/C++14, D3D11/DXGI, Iris RTC API, Jest, CMake.js, Visual Studio 2022.

---

## File map

- `example/package.json`, `example/yarn.lock`: Electron 43.2.0 and local SDK wiring.
- `ts/Types.ts`, `ts/Private/IAgoraMediaEngine.ts`, `ts/Private/impl/IAgoraMediaEngineImpl.ts`: narrow public PoC API.
- `ts/Private/internal/IrisApiEngine.ts`: five-buffer request construction including D3D slot five.
- `source_code/agora_node_ext/shared_texture_request.{h,cpp}`: platform-neutral validation and stable errors.
- `source_code/agora_node_ext/d3d11_shared_texture_importer.{h,cpp}`: Windows adapter selection, open, descriptor validation, and synchronous Iris call.
- `source_code/agora_node_ext/agora_electron_bridge.{h,cpp}`: N-API Promise boundary and importer ownership.
- `example/src/main/sharedTexturePocController.js`: RTC/offscreen lifecycle, latest-only backpressure, and release ledger.
- `example/src/main/sharedTexturePocIpc.js`: validated renderer/main commands and status events.
- `example/extraResources/sharedTextureScene.html`: deterministic moving test scene packaged outside the main-process bundle.
- `example/src/renderer/examples/advanced/SharedTexturePoc/*`: existing-style configuration and controls.
- `docs/poc/d3d11-shared-texture-evidence.md`, `example/README.md`: contracts and Windows runbook.

### Task 1: Pin Electron 43.2 and local SDK wiring

**Files:**
- Create: `example/src/main/__tests__/sharedTextureRuntime.test.js`
- Modify: `example/package.json`
- Modify: `example/yarn.lock`
- Modify: `example/README.md`

- [ ] Write a test asserting `electron` is exactly `43.2.0` and `agora-electron-sdk` resolves to the repository worktree.
- [ ] Run `yarn jest example/src/main/__tests__/sharedTextureRuntime.test.js --runInBand --testPathIgnorePatterns=/build/`; expect RED against Electron 22 and the published SDK.
- [ ] Pin Electron 43.2.0, run root `yarn link`, run `yarn --cwd example link agora-electron-sdk`, and assert `require.resolve('agora-electron-sdk/package.json')` resolves inside this worktree rather than to a published duplicate.
- [ ] Run `yarn --cwd example install`, then rerun the focused test; expect GREEN.
- [ ] Document Windows x64 rebuild commands and the required Electron ABI `148` check.
- [ ] Commit with `chore(example): pin shared texture PoC runtime`.

### Task 2: Add the TypeScript shared-texture contract

**Files:**
- Modify: `ts/Types.ts`
- Modify: `ts/Private/IAgoraMediaEngine.ts`
- Modify: `ts/Private/impl/IAgoraMediaEngineImpl.ts`
- Modify: `ts/Private/internal/IrisApiEngine.ts`
- Modify: `ts/Private/ti/IAgoraMediaEngine-ti.ts`
- Modify: `ts/__tests__/setup.ts`
- Modify: `ts/__tests__/MediaEngineInternal.test.ts`

- [ ] Add a failing test for `pushSharedD3D11Texture({frameId, ntHandle, width, height, timestampUs, pixelFormat})` forwarding and Promise result propagation.
- [ ] Run `yarn jest ts/__tests__/MediaEngineInternal.test.ts --runInBand --testPathIgnorePatterns=/build/`; expect RED because the API is absent.
- [ ] Add `SharedD3D11TextureFrame`, `SharedD3D11TextureResult`, and the async media-engine method, documenting it as experimental, Windows-only, and unsupported for non-D3D11 frames.
- [ ] Preserve Electron `timestampUs` as integer microseconds at the public/native boundary, serialize Iris `ExternalVideoFrame.timestamp` as `Math.floor(timestampUs / 1000)` milliseconds, and add cases for exact and sub-millisecond values.
- [ ] Construct the Iris JSON plus five-buffer ABI without serializing the native pointer into JSON; slot five is reserved for D3D.
- [ ] Run `yarn build:ts-interface`, the focused test, and `yarn jest ts/__tests__ --runInBand --testPathIgnorePatterns=/build/`; expect 6 suites/47 existing tests plus the new tests to pass.
- [ ] Commit with `feat: expose shared D3D11 texture submission`.

### Task 3: Add native validation and unsupported-platform behavior

**Files:**
- Create: `source_code/agora_node_ext/shared_texture_request.h`
- Create: `source_code/agora_node_ext/shared_texture_request.cpp`
- Create: `source_code/agora_node_ext/tests/shared_texture_request_test.cpp`
- Modify: `source_code/agora_node_ext/agora_electron_bridge.h`
- Modify: `source_code/agora_node_ext/agora_electron_bridge.cpp`
- Modify: `CMakeLists.txt`

- [ ] Write table-driven C++ tests for an 8-byte handle, positive bounded dimensions, nonnegative timestamp, monotonic frame ID, and `bgra`/`rgba` only.
- [ ] Add a non-Windows TypeScript/native test expecting rejected code `ERR_PLATFORM_UNSUPPORTED`.
- [ ] Run the focused targets; expect RED because parsing and bridge registration are absent.
- [ ] Implement validation independently of D3D headers and copy all N-API values on the JS thread.
- [ ] Register a Promise-returning bridge method; on non-Windows reject without compiling or linking D3D.
- [ ] Exclude native tests from the addon source glob and add a `BUILD_TESTING` target.
- [ ] Run the focused native target where supported plus the source Jest suite; expect GREEN.
- [ ] Commit with `feat: validate shared texture requests`.

### Task 4: Implement direct Windows D3D11 submission

**Files:**
- Create: `source_code/agora_node_ext/d3d11_shared_texture_importer.h`
- Create: `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- Create: `source_code/agora_node_ext/tests/d3d11_shared_texture_importer_test.cpp`
- Modify: `source_code/agora_node_ext/agora_electron_bridge.h`
- Modify: `source_code/agora_node_ext/agora_electron_bridge.cpp`
- Modify: `CMakeLists.txt`

- [ ] Write importer tests against injected D3D/Iris operations: no adapter, one adapter, ambiguous adapters, dimension mismatch, format mismatch, Iris failure, and COM lifetime through call return.
- [ ] Run the Windows test target; expect RED because the importer is absent.
- [ ] Enumerate hardware adapters, create D3D11 devices, call `ID3D11Device1::OpenSharedResource1`, and require exactly one compatible adapter; log description and LUID.
- [ ] Validate `D3D11_TEXTURE2D_DESC`: exact width/height, supported BGRA/RGBA DXGI format, and shareable resource flags. Do not require keyed mutex.
- [ ] Build the Iris `ApiParam` and pass `texture.Get()` as buffer slot five for the synchronous `pushVideoFrame` call.
- [ ] Resolve/reject the originating Promise only after the Iris call returns; release the COM reference afterward.
- [ ] Link `d3d11` and `dxgi` only in the Windows target.
- [ ] Run all native tests and inspect D3D debug shutdown output; expect GREEN and no live PoC objects.
- [ ] Commit with `feat: submit Electron shared textures directly`.

### Task 5: Build the main-process controller

**Files:**
- Create: `example/src/main/sharedTexturePocController.js`
- Create: `example/src/main/__tests__/sharedTexturePocController.test.js`
- Create: `example/extraResources/sharedTextureScene.html`

- [ ] Write dependency-injected tests for start/stop, failed join, one in-flight frame, latest-only replacement, native rejection, and exactly-once release on every path.
- [ ] Run the focused Jest file; expect RED because the controller is absent.
- [ ] Implement `idle -> starting -> running -> stopping -> idle`, owning one RTC engine and the explicit window options below; fail startup when shared-texture paint payloads are unavailable:

  ```js
  new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: { useSharedTexture: true },
      backgroundThrottling: false,
    },
  });
  ```

- [ ] Start RTC in this order: initialize, enable video, call `setExternalVideoSource(true, true, ExternalVideoSourceType.VideoFrame)`, join as broadcaster with the default video track enabled (`publishCameraTrack: true`) and custom publication disabled (`publishCustomVideoTrack: false`), wait for `onJoinChannelSuccess`, and only then mark the controller running and accept frames on track ID `0`. The external source replaces the camera source; do not create a custom track for this path.
- [ ] In `paint`, retain the complete Electron texture object; map `texture.textureInfo.ntHandle`, coded width/height, `pixelFormat`, and microsecond `timestamp` into the request. Release ordinary-image paint events, pre-join frames, unsupported formats, and failed-join frames without submission.
- [ ] Submit one frame at a time; retain only the newest pending frame and immediately release the frame it replaces.
- [ ] Wrap every native submission in `try/finally` and call the release ledger exactly once after Promise settlement.
- [ ] Stop accepting paint, release pending, await in-flight settlement, leave/release RTC, and destroy the window.
- [ ] Use a deterministic moving scene that exposes frame ordering and color-channel errors.
- [ ] Run the focused controller tests; expect GREEN.
- [ ] Commit with `feat(example): control shared texture publication`.

### Task 6: Add validated IPC and the example page

**Files:**
- Create: `example/src/main/sharedTexturePocIpc.js`
- Create: `example/src/main/__tests__/sharedTexturePocIpc.test.js`
- Modify: `example/src/main/index.js`
- Create: `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx`
- Create: `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.test.tsx`
- Modify: `example/src/renderer/examples/advanced/index.ts`

- [ ] Write failing IPC tests for App ID/channel/token/UID validation, duplicate start, stop, status delivery, and teardown.
- [ ] Write a failing renderer test that initializes fields from `Config.appId`, `Config.channelId`, `Config.token`, and `Config.uid` and sends them unchanged on Start.
- [ ] Register narrow start/stop/status IPC handlers in main and clean them up on app shutdown.
- [ ] Add the existing-style advanced example controls and live counters/errors; do not create a second renderer RTC engine.
- [ ] Run focused main/renderer tests and the example TypeScript build; expect GREEN.
- [ ] Commit with `feat(example): add shared texture PoC page`.

### Task 7: Verify and document the Windows PoC

**Files:**
- Modify: `example/README.md`
- Modify: `docs/poc/d3d11-shared-texture-evidence.md`

- [ ] On Windows x64, install VS 2022/v143 and Windows SDK 10.0.22621, then record exact detected versions.
- [ ] Rebuild the addon for Electron 43.2.0 and assert `process.versions.modules === '148'` before loading it.
- [ ] Run all native tests, source Jest tests, typecheck, and example compile; record exact results.
- [ ] Join with user-supplied App ID/channel/token/UID and verify the moving scene on a remote receiver.
- [ ] Record adapter description/LUID, opened descriptor, submitted/dropped/released counts, device-removal status, process handle trend, and D3D debug-layer shutdown output.
- [ ] Capture PIX evidence that the path contains `OpenSharedResource1` and synchronous RTC submission but no staging/readback, `CopyResource`, keyed mutex, or owned pool.
- [ ] Update the evidence document with measured results and any Windows-only limitations.
- [ ] Commit with `docs: record shared texture PoC results`.

### Task 8: Final regression and handoff

**Files:**
- Inspect: all files changed by Tasks 1-7

- [ ] Run `yarn jest ts/__tests__ --runInBand --testPathIgnorePatterns=/build/`, `yarn typecheck`, and the example compile on macOS; record results without claiming Windows validation.
- [ ] Run `git diff --check` and inspect `git diff --stat` plus the complete diff for accidental generated or unrelated files.
- [ ] On Windows, repeat the exact Task 7 build/runtime smoke commands after the final diff.
- [ ] Summarize confirmed behavior, test evidence, and residual platform risks.
- [ ] Commit any final documentation-only corrections with `docs: finalize shared texture PoC handoff`.
