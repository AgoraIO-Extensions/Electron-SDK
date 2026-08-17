# Electron Shared Texture Video Publishing PoC

[中文说明](./README.zh-CN.md)

## Status

This proof of concept publishes an Electron offscreen-rendered scene to an
Agora channel on Windows. This temporary development-package variant passes
Electron's original NT handle value through the `d3d11Texture2d` Iris slot so
the Native RTC SDK team can validate opening it internally. Remote rendering with that Native SDK is
the handoff acceptance test, not a result claimed by this repository build.

The validated environment is:

- Windows x64
- Electron `43.2.0`
- Electron Node `24.18.0`, native modules ABI `148`
- Agora Electron SDK `4.5.3-build.123-rc.2`
- Agora Native RTC SDK core `4.5.3.123`

## What Works Today

The PoC implements the complete publishing workflow:

1. The `Advanced -> SharedTexturePoc` page sends the channel configuration to
   the Electron main process through IPC.
2. The main process creates the RTC engine, enables an external video source,
   and joins as a broadcaster with a custom video track. Camera and microphone
   publishing are disabled for this case.
3. An offscreen `BrowserWindow` hosts a real DOM canvas with
   `offscreen.useSharedTexture: true`. The page calls
   `transferControlToOffscreen()` and a dedicated Worker owns WebGL2, rendering,
   and its timer-driven 30/60 fps loop.
4. Electron 43 supplies each frame as `details.texture`. The Windows NT handle
   is read from `texture.textureInfo.handle.ntHandle`.
5. The native addon validates the frame metadata and decodes the eight handle
   bytes without changing their value.
6. The addon places the original NT handle value, not its address, in Iris
   buffer slot 4. It does not create a D3D11 device or open the resource.
7. The Native RTC SDK opens and validates the handle synchronously before the
   Iris call returns. It owns any COM reference retained for later processing.
8. Submission errors from both the Iris transport and RTC API result are
   propagated to JavaScript.
9. Stop and failure paths drain the active submission, release every Electron
   texture exactly once, leave the channel, release the engine, and destroy the
   offscreen window.

The controller keeps at most one submission in flight and one latest pending
texture. Older pending frames are released instead of building an unbounded
queue. Frames can be submitted while the channel is joining as well as after
join succeeds.

Each valid compositor frame is now timestamped with
`getCurrentMonotonicTimeInMs()` when its `paint` event reaches the main process.
That Agora SDK monotonic value, in milliseconds, is submitted as the RTC video
timestamp. Electron's compositor timestamp remains separate and is used only
for diagnostics.

This PoC does not capture custom audio, so it does not by itself prove A/V
synchronization. Favorited must timestamp `AudioFrame.renderTimeMs` with the
same Agora SDK monotonic clock and validate long-running drift. The previous
`timestamp = 0` behavior was only a compatibility measure to avoid passing an
unrelated Electron clock value that could be rejected as old.

## Worker Topology And Diagnostics

The PoC now exercises the compositor-compatible version of the customer's
topology:

```text
DOM canvas -> transferControlToOffscreen -> Worker WebGL2
  -> Electron compositor -> shared-texture paint -> Native RTC
```

It does not capture a standalone Worker-created `OffscreenCanvas` that has no
DOM canvas or `WebContents`; such a surface never enters Electron's compositor.
The customer can retain Worker ownership of WebGL2, but must create and transfer
the canvas from an Electron renderer page.

## Hidden Capture Window And Background Frame Rate

The current design requires a dedicated offscreen `BrowserWindow` as the
compositor host. This is not a user-visible preview window. In production it is
created with `show: false`, remains alive for the capture session, and is kept
independent from the application's visible windows. Minimizing, covering, or
backgrounding the main UI must not minimize or destroy this capture window.

The production configuration uses all three controls below:

- `show: false` keeps the capture window hidden from creation without using a
  minimized visible window.
- `backgroundThrottling: false` disables normal renderer background throttling.
- `webContents.setFrameRate(30 | 60)` sets the target compositor cadence, while
  the Worker runs its own timer-driven WebGL2 draw loop at the same target rate.

The `visible` and `minimized` capture-window modes in the PoC exist only for
comparison testing. The production recommendation is the dedicated
`show: false` mode; the capture window should not follow the main window's
visibility or minimized state.

These settings request continued background rendering, but they are not a hard
real-time or cross-platform frame-rate guarantee. Acceptance must measure each
stage separately: Worker draw intervals, Electron shared-texture `paint`
intervals, Native submissions, and RTC sent/encoded frame rate. The PoC reports
these metrics and marks health degraded after a paint gap longer than 500 ms.
Windows D3D11 is the currently implemented path. macOS background pacing and
IOSurface/Metal transport require separate validation.

## Target Ownership Boundary

- Favorited renders the final Studio frame into the full-window canvas, and
  owns source capture, scene composition, window/process orchestration,
  preview, A/V clock mapping, and renderer/WebGL/stream recovery.
- The platform-neutral Agora Electron API accepts the compositor texture and
  exposes the Agora monotonic clock needed by Favorited's A/V mapping.
- Agora owns Windows NT-handle/D3D11 interop and eventual macOS IOSurface/Metal
  interop. Before Electron releases the source texture, Agora must synchronously
  consume it or retain/GPU-copy it into an Agora-owned resource.
- Agora owns native texture-import, stale-handle, D3D11 device-loss, and SDK
  resource recovery, and reports actionable failures to Favorited. Favorited
  writes no platform-specific native interop code.

The Advanced page allows temporary selection of 30 or 60 fps and the three
measurement modes described above. The controller calls
`webContents.setFrameRate()` and verifies `getFrameRate()`; the Worker
independently uses a timer-driven target cadence.

Every five seconds and on health transitions, status includes:

- Worker frame sequence, draw intervals, `performance.timeOrigin`, and
  `performance.now()`
- Electron compositor timestamp in microseconds and main-process epoch and
  monotonic timestamps
- Paint, submission, replacement, invalid-frame, failure, and drain-timeout
  counts, plus rolling P50/P95/P99/max intervals
- RTC `encodedFrameCount`, `sentFrameRate`, and `txVideoKBitRate`

Telemetry records both the Electron compositor timestamp in microseconds and
the submitted Agora monotonic timestamp in milliseconds. A/V synchronization
is not proved until custom audio uses the same clock and a long-running test
measures drift.

Health becomes degraded after a 500 ms paint gap, renderer unresponsiveness,
GPU child-process exit, or WebGL context loss. A later valid paint clears paint
and GPU degradation. WebGL degradation clears only after both context restoration
and a valid paint. Renderer exit or a terminal Worker error stops the run,
drains an already-returned submission for up to two seconds, releases textures,
leaves RTC, and reports `failed`.

The two-second bound cannot interrupt Native code blocked synchronously inside
`CallIrisApi`, because that call runs before JavaScript receives a Promise.
Recovering that case requires a cancellable Native API or moving the blocking
call off the Electron main thread.

## Verification Performed

The development package is required to pass:

- The repository build under Node `24.18.0`
- SharedTexture-related Jest tests
- The native `shared_texture_request` CTest
- Windows x64 packaging with the Example resolved to this checkout's addon,
  rebuilt for Electron `43.2.0` ABI `148`

The earlier CPU-readback implementation passed a real-channel smoke test. That
result does not prove that the direct-texture Native SDK path works. The native
team must verify increasing encoded-frame counters, bitrate, and moving remote
video with this package.

## Direct Texture Path

Every submitted frame follows this path:

```text
Electron NT handle
  -> unchanged handle value in Iris buffer slot 4
  -> Native SDK OpenSharedResource1
  -> Native-owned ID3D11Texture2D
  -> RTC SDK
  -> encoder
```

### Raw-handle preview diagnostic

While `SharedTexturePoc` is running, the addon also opens a native Windows
window titled `Raw Electron NT Handle Preview`. Before calling Iris, the addon
opens the same frame's NT handle with `OpenSharedResource1`, copies it into the
preview swap chain with GPU `CopySubresourceRegion`, waits for that copy, and
displays it. This preview bypasses Iris, the RTC SDK, the encoder, and the
network entirely:

- A moving preview with frozen remote video isolates the problem to the Native
  RTC SDK or a later stage.
- A frozen preview means the Worker, Electron compositor, or exported handle
  content still needs investigation.

The preview adds one GPU copy and a synchronization wait. It is a content
diagnostic, not a zero-copy performance measurement, and it does not replace
the unchanged original handle sent to RTC.

The following items are intentionally not claimed by this PoC:

- End-to-end zero-copy encoding
- GPU-only BGRA/RGBA-to-NV12 conversion
- D3D11 device, adapter, or texture-pool reuse across frames
- NV12, P010, multi-plane, or non-Windows shared-texture support
- An automated remote-client video-content assertion

The Electron `HANDLE` is borrowed. Neither the addon nor the Native SDK may
close it. Before synchronous `CallIrisApi` returns, the Native SDK must open or
duplicate the handle and retain its own COM reference if processing continues
asynchronously. The JavaScript controller then releases Electron's texture
exactly once; the SDK eventually releases only its own resource.

## Temporary Native SDK Contract

The bundled Native SDK headers contain the intended API shape:

- `ExternalVideoFrame::VIDEO_BUFFER_TEXTURE` (`3`)
- `VIDEO_TEXTURE_ID3D11TEXTURE2D` (`17`)
- `ExternalVideoFrame::d3d11Texture2d`
- `ExternalVideoFrame::textureSliceIndex`

The previously bundled Native SDK returned RTC error `-2` for this path. This
development package intentionally enables `useTexture=true` and temporarily
uses the existing `d3d11Texture2d` transport slot for the NT handle value.

## Required Native RTC SDK Changes

For this package, Native interprets `d3d11Texture2d` as an NT handle value and
opens it before returning from `pushVideoFrame`:

```cpp
ExternalVideoFrame frame;
frame.type = ExternalVideoFrame::VIDEO_BUFFER_TEXTURE;
frame.format = VIDEO_TEXTURE_ID3D11TEXTURE2D;
HANDLE nt_handle = reinterpret_cast<HANDLE>(frame.d3d11Texture2d);
ComPtr<ID3D11Texture2D> opened_texture;
HRESULT hr = device1->OpenSharedResource1(
    nt_handle, IID_PPV_ARGS(&opened_texture));
frame.textureSliceIndex = 0;
frame.stride = width;
frame.height = height;
frame.timestamp = rtc_timestamp_ms;

media_engine->pushVideoFrame(&frame, video_track_id);
```

The Native RTC SDK must provide all of the following behavior:

1. Support `setExternalVideoSource(true, true, VIDEO_FRAME)` on Windows.
2. Treat `d3d11Texture2d` as the original NT handle value for this temporary
   package, not as a pointer to a `HANDLE` variable or an `ID3D11Texture2D*`.
3. Define the accepted DXGI formats. BGRA must work for the Electron path;
   RGBA must either be supported or rejected explicitly so the addon can use a
   GPU conversion step.
4. Keep pixel processing on the GPU, including color conversion, scaling, and
   transfer into a hardware encoder input surface.
5. Match the texture's DXGI adapter or define a cross-adapter fallback and
   report adapter mismatch as a specific error.
6. Handle D3D11 device loss and texture-size changes without retaining stale
   resources.
7. Return the actual RTC submission result, with `0` meaning the texture was
   accepted under the documented lifetime contract.
8. Preserve the `rtcTimestampMs` value obtained from
   `getCurrentMonotonicTimeInMs()` as `ExternalVideoFrame::timestamp`.

### Lifetime and Synchronization Contract

This contract is required before the addon can safely call
`texture.release()`:

- The SDK must call `OpenSharedResource1` or duplicate the borrowed handle
  before `pushVideoFrame` returns and retain its own COM reference for as long
  as it reads the resource.
- The SDK must never close Electron's original handle.
- Open or validation failures must be returned synchronously as a negative RTC
  result so Electron does not treat the frame as accepted.
- The contract must state when Chromium may reuse the source texture.
- The SDK must define GPU synchronization for Electron BGRA/RGBA shared
  textures, which do not expose a keyed mutex through this API.

A GPU-to-GPU `CopyResource` into an SDK-owned texture pool is an acceptable
first implementation. It is not strictly zero-copy, but it removes the costly
GPU-to-CPU-to-GPU round trip and gives the SDK a clear ownership boundary.

### Direct-Handle Compatibility Boundary

This reuse of `d3d11Texture2d` is a temporary PoC agreement with the Native SDK
team, not the published meaning of that field. A production direct-handle API
should use a dedicated field and define width, height, DXGI format, texture
slice, adapter selection, synchronization, and completion semantics.

## Migration After Native Texture Support

This development package applies the following integration while keeping the
renderer and IPC workflow unchanged:

1. Use `setExternalVideoSource(true, true, ...)`.
2. Pass the Electron NT handle value unchanged in Iris buffer slot 4.
3. Open and validate that handle inside the Native SDK before the synchronous
   call returns.
4. Do not create `ReadTexturePixels`, a staging texture, `Map`, or a raw pixel
   vector.
5. Release the Electron texture according to the new Native SDK completion
   contract.

The frame backpressure, monotonically increasing frame IDs, error propagation,
channel configuration, and shutdown behavior can remain unchanged.

## Acceptance Criteria for Native Texture Support

Native texture support should not be considered complete until all of these
conditions pass:

- At least 300 consecutive D3D11 frames return success.
- Encoded frame counters and upstream bitrate continue increasing.
- A remote client displays motion rather than a single frozen frame.
- The publishing path contains no staging texture with `CPU_ACCESS_READ`,
  `Map`, or full-frame CPU pixel copy.
- Source textures are neither reused early nor leaked during sustained load.
- Resize, stop during join, repeated join/leave, and device-loss paths complete
  without crashes or stale frames.
- BGRA behavior, timestamp semantics, adapter selection, and texture lifetime
  are documented as supported API contracts.

## Relevant Files

- `example/src/main/sharedTexturePocController.js`
- `example/src/main/sharedTexturePocTelemetry.js`
- `example/extraResources/sharedTextureScene.html`
- `example/extraResources/sharedTextureSceneWorker.js`
- `source_code/agora_node_ext/agora_electron_bridge.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_preview.cpp`
- `source_code/agora_node_ext/shared_texture_request.cpp`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/AgoraMediaBase.h`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/IAgoraMediaEngine.h`

Runtime logs are written to `%LOCALAPPDATA%\Agora\electron`.

## Windows Measurement Matrix

Run hidden, visible, and minimized at both 30 and 60 fps for at least ten
minutes per combination. With `T = 1000 / fps`, require
`abs(P50 - T) / T <= 0.10`, `P99 < 3 * T`, and no unexplained gap above 500 ms.
Worker draw, paint, submission, encoded-frame, frame-rate, and bitrate metrics
must continue advancing while a receiver shows motion.

Use `WEBGL_lose_context` to verify context restoration and
`forcefullyCrashRenderer()` to verify bounded renderer cleanup. These tests and
a GPU child-process exit are not evidence of real D3D11 device removal. Do not
claim device-loss recovery until a test actually observes
`DXGI_ERROR_DEVICE_REMOVED` or `DXGI_ERROR_DEVICE_RESET`.
