# Electron D3D11 Shared Texture PoC Design

## Objective

Prove that the existing Electron example can publish an Electron-composited WebGL/DOM frame through Agora without a GPU-to-CPU readback.

The PoC is intentionally limited to Windows, Electron 33+, D3D11, one BGRA/ARGB video track, and 1920x1080 at 30 fps. macOS, Linux, NV12 keyed-mutex support, multiple tracks, and production compatibility guarantees are out of scope.

## Existing Constraints

- The current example pins Electron 22.0.0 and uses `electron-webpack` 2.8.2.
- The RTC engine used by the existing examples is created in an Electron renderer process.
- Electron shared-texture offscreen paint events are delivered in the main process, and the returned NT handle is valid in that process.
- `ExternalVideoFrame` exposes `d3d11Texture2d`, but JavaScript cannot construct an `ID3D11Texture2D*`.
- `IrisApiEngine.callIrisApi` currently places an empty buffer in the D3D11 texture slot for `MediaEngine_pushVideoFrame_4e544e2`.
- Iris and the native RTC SDK already accept a Windows `ID3D11Texture2D*` external video frame.

These constraints mean the PoC cannot pass the Electron NT handle through ordinary renderer IPC into the existing renderer-owned RTC engine. The offscreen producer, the main-process RTC singleton, and the D3D11 bridge must live in the main process.

## Phase 0 Implementation Gates

Native frame submission does not begin until both gates below are closed with written evidence in the PoC notes:

1. **RTC texture ownership:** Confirm from the exact Iris/native SDK header, SDK owner, or a documented completion signal whether `pushVideoFrame` consumes the supplied `ID3D11Texture2D` during the call or retains it after return. A texture is never returned to the pool before the confirmed release point. If no ownership contract or release signal is available, the bounded texture-pool implementation is blocked rather than approximated with a delay or frame count.
2. **Electron producer synchronization:** Confirm against the exact Electron 33 patch release and a Windows startup probe that ARGB `OffscreenSharedTexture` is ready for D3D11 consumption when the `paint` event fires and remains valid until `texture.release()`. The PoC accepts only `ntHandle` ARGB/BGRA resources covered by that contract. It rejects NV12, keyed-mutex resources, unknown handle types, and unknown synchronization modes.

The startup probe enumerates DXGI adapters, attempts `OpenSharedResource1` on a device created for each adapter, records the successful adapter LUID, checks the resource descriptor, performs a copy into an owned texture, flushes the context, and waits on a bounded `D3D11_QUERY_EVENT`. Failure to identify exactly one compatible adapter or signal completion within the timeout prevents the session from starting.

## Selected Approach

Upgrade the existing example to Electron 33+ for Windows PoC use, while preserving existing renderer examples as much as the existing build toolchain permits.

Add a Windows-only Shared Texture PoC controller in the Electron main process. It creates an offscreen `BrowserWindow`, receives `OffscreenSharedTexture` frames, and submits their NT handles to a new N-API method. The native method opens the shared resource, copies it into an owned D3D11 texture, waits for GPU copy completion, publishes that texture through Iris, and then tells JavaScript that the Electron texture may be released.

One GPU-to-GPU copy is accepted. CPU pixel readback is not.

## Architecture

```text
Renderer control page
  | IPC: configure/start/stop/status
  v
Main-process SharedTexturePocController
  | owns offscreen BrowserWindow and PoC RTC engine
  | paint event: OffscreenSharedTexture + NT handle
  v
AgoraElectronBridge.PushSharedD3D11Texture
  | OpenSharedResource1
  | CopyResource into owned BGRA texture
  | D3D11_QUERY_EVENT completion
  v
Iris MediaEngine_pushVideoFrame
  | ExternalVideoFrame::VIDEO_BUFFER_TEXTURE
  | VIDEO_TEXTURE_ID3D11TEXTURE2D
  v
Agora encoder and remote receiver
```

The existing renderer-owned RTC engines remain unchanged. `createAgoraRtcEngine` is a singleton per JavaScript process, so the PoC controller owns the main process's RTC singleton; it is not described as a second instance in the same process. The shared handle never crosses an Electron process boundary.

## Components

### Electron 33 Upgrade

Pin the example to an exact Electron 33 patch release and update the lockfile. Build the modified `.node` addon against that exact Electron Windows x64 Node ABI, make the example resolve the local modified SDK rather than its currently published `agora-electron-sdk` dependency, and verify that the addon loads in the packaged and unpackaged Windows application. Keep the current example architecture unless an Electron 33 incompatibility requires a narrowly scoped build adjustment. Windows is the only required runtime target for this PoC; macOS example compatibility is not an acceptance criterion.

### Offscreen Producer

Create a hidden `BrowserWindow` with:

- `offscreen.useSharedTexture = true`
- `offscreen.sharedTexturePixelFormat = 'argb'`
- `backgroundThrottling = false`
- a 30 fps frame rate
- a deterministic WebGL/DOM test scene with a frame counter, timestamp, moving geometry, and color blocks

The paint handler validates `event.texture`, `widgetType`, dimensions, pixel format, and NT handle length. Every received texture must have exactly one terminal release path: submitted and completed, rejected, dropped, stopped, or failed.

### Main-Process Controller

The controller exposes IPC commands for:

- configuring App ID, token, channel, UID, width, height, and frame rate
- starting the PoC session
- stopping and releasing the session
- retrieving status and counters

Its state machine is `idle -> starting -> running -> stopping -> idle`, with `failed` as an observable terminal state that can be stopped back to `idle`. Repeated start or stop commands are rejected or treated idempotently as appropriate.

On start, the controller obtains the main-process RTC singleton, initializes it, enables video, calls `setExternalVideoSource(true, true, ExternalVideoSourceType.VideoFrame)` before joining, and joins with the default external video track enabled. The PoC uses track ID `0`; custom video tracks and multi-track publishing are out of scope. No frame is accepted before the join/external-source setup succeeds.

The renderer UI displays operational state, received frames, submitted frames, dropped frames, completed frames, pending frame IDs, released frame IDs, last error, adapter LUID, pixel format, and dimensions. It does not own GPU resources or the PoC RTC engine.

### Native D3D11 Bridge

Add `PushSharedD3D11Texture(options)` to `AgoraElectronBridge`. It returns a Promise that resolves with the submitted frame ID and RTC result or rejects with a categorized error. All N-API values are parsed and copied on the JavaScript thread before work is queued; the worker stores only native values, a copied HANDLE value, COM references, and a deferred/thread-safe completion reference.

One serialized GPU worker owns the D3D11 device, immediate context, completion queries, texture pool, and Iris submissions. It does not use the existing process-global `node_async_call` queue. The Windows implementation:

1. Validates the options object and verifies `ntHandle` is a Buffer of `sizeof(HANDLE)`.
2. Uses the startup-probed adapter LUID and compatible D3D11 device.
3. Calls `ID3D11Device1::OpenSharedResource1`.
4. Rejects unsupported dimensions, formats, adapters, or resource descriptors.
5. Acquires an owned BGRA texture from a three-entry pool.
6. Issues `CopyResource`, calls `Flush`, and waits for a `D3D11_QUERY_EVENT` with a bounded timeout and device-removed checks.
7. After completion, constructs the exact Iris JSON payload and five-slot buffer ABI used by `MediaEngine_pushVideoFrame_4e544e2`: raw buffer, EGL context, metadata, alpha, and `d3d11Texture2d`. The first four slots are explicit null/empty placeholders and slot five points at the owned `ID3D11Texture2D`.
8. Calls Iris `pushVideoFrame` with track ID `0` on the serialized worker only after external texture mode and channel join have succeeded.
9. Holds the owned texture until the Phase 0 RTC ownership contract's release point, then returns it to the pool.
10. Completes the Promise on the originating N-API environment so the matching Electron texture can be released exactly once.

The bridge has an explicit `running -> closing -> closed` lifecycle. Closing rejects new work, cancels queued frames, waits a bounded interval for executing GPU work, resolves or rejects every live deferred exactly once, releases every native COM reference, and deletes async-work/thread-safe-function handles before `_iris_api_engine` is reset. The main process performs this drain before destroying the offscreen window or allowing the N-API environment to close. If the environment is already closing, no JavaScript call is attempted; native resources are still released, and the window teardown owns final Electron texture destruction.

Non-Windows builds expose a stable unsupported result without including or linking D3D11 headers and libraries.

### Queue and Backpressure

The native/controller boundary permits at most three pending frames. When full, the oldest not-yet-submitted Electron frame is dropped and released. The queue never blocks Electron's main thread waiting for GPU work.

Stop drains or cancels queued work, completes all outstanding release callbacks while the N-API environment is live, leaves the channel, disables the external source, releases the main-process RTC singleton, destroys D3D resources, and finally destroys the offscreen window.

## Error Handling

Errors are categorized so the UI and logs identify the failing boundary:

- Electron shared texture unavailable
- invalid or unsupported handle metadata
- D3D11 device or adapter creation failure
- `OpenSharedResource1` failure
- unsupported texture format or dimensions
- GPU copy timeout or device removal
- Iris/RTC push failure
- RTC initialize, join, or leave failure

An empty shared texture may optionally report that the CPU `NativeImage` fallback exists, but the PoC does not silently switch to CPU frames because doing so would invalidate the performance result.

## Testing Strategy

### Automated Tests on macOS and Windows

- TypeScript tests cover IPC validation, state transitions, queue overflow, stop behavior, counter updates, and exactly-once release behavior.
- N-API-facing validation is separated from D3D execution where practical so malformed arguments and unsupported-platform behavior can be tested without a GPU.
- Existing TypeScript tests remain green. Generated `build/__tests__` output is excluded from the source-test invocation.
- A fake native Promise boundary verifies queued, executing, cancelled, resolved, rejected, and environment-closing paths without treating the fake as evidence of GPU correctness.

### Windows Integration Tests

- Electron 33 starts the upgraded example.
- The offscreen test scene consistently produces NT shared handles.
- `OpenSharedResource1` succeeds on the selected adapter.
- A remote receiver sees the moving scene with correct colors and timestamps.
- After a five-minute warmup, the PoC runs at 1920x1080, 30 fps for 30 measured minutes. Queue occupancy remains at or below three; owned pool textures remain at three; outstanding Electron frame IDs equal received minus released; process handle count changes by no more than 20; and process private memory plus GPU dedicated/shared usage has a fitted growth slope below 1 MiB/min over the final 20 minutes.
- Congestion drops old frames and releases every Electron texture once.
- The D3D11 debug layer reports no live PoC device, texture, query, or view objects after stop. PIX or an equivalent capture shows `OpenSharedResource1`, GPU copy, and RTC submission with no CPU staging/readback resource.
- CPU comparison uses the same machine, adapter, scene, resolution, frame rate, codec settings, and ten-minute sample window for shared texture and existing CPU BGRA paths. Report median process CPU, p95 frame interval, submitted FPS, dropped frames, and GPU utilization; the PoC must not claim a percentage improvement that was not measured.

## Acceptance Criteria

- The upgraded example builds and launches on Windows with Electron 33+.
- The modified native addon is rebuilt for and loads under the exact pinned Electron 33 Windows x64 ABI in both development and packaged runs.
- The Shared Texture PoC joins an Agora channel and publishes the offscreen test scene.
- The native path uses an NT handle, `OpenSharedResource1`, GPU `CopyResource`, and D3D11 texture `pushVideoFrame` without CPU pixel buffers.
- Start, stop, error, and congestion paths release all Electron textures exactly once.
- Queue depth never exceeds three.
- Existing renderer examples are not migrated to the main process.
- macOS-local automated tests and static checks pass; Windows-only compilation and runtime results are reported separately and are not claimed from macOS.

## Evidence Artifacts

The PoC handoff includes the exact Electron/Node ABI versions, adapter description and LUID, RTC texture ownership evidence, producer-synchronization evidence, startup-probe log, 30-minute counters sampled once per second, process/GPU memory series, process handle series, D3D11 debug-layer shutdown output, GPU capture summary, remote-receiver recording, and CPU-path comparison table.
