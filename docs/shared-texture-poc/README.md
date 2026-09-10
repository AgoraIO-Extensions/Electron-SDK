# Electron Shared Texture Video Publishing PoC

[中文说明](./README.zh-CN.md)

## Status

This proof of concept publishes an Electron offscreen-rendered scene through a
platform-neutral Electron API. Electron sends the platform shared-texture
identity only to Iris. Iris opens and GPU-copies the Windows NT handle into an
Iris-owned `ID3D11Texture2D`, or wraps the macOS IOSurface in a
`CVPixelBufferRef`, before calling Native `pushVideoFrame`. Native no longer
receives the Electron NT handle or IOSurfaceID.

The capture window explicitly requests Electron's `argb` shared-texture output
and validates the actual `textureInfo.pixelFormat`. Windows accepts `bgra`;
macOS accepts `bgra` or `rgba`. `rgbaf16` remains intentionally unsupported and
is released and counted as an invalid frame instead of being converted or
mislabeled.

The validated environment is:

- Windows x64
- Electron `43.2.0`
- Electron Node `24.18.0`, native modules ABI `148`
- Agora Electron SDK `4.5.3-build.123-rc.2`
- CSD-79710 Native RTC development build `1289436`, based on `4.5.2.175`

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
   and its timer-driven 30/48/60 fps loop. The window explicitly sets
   `sharedTexturePixelFormat: 'argb'` and validates the actual paint output as
   BGRA on Windows or BGRA/RGBA on macOS.
4. Electron 43 supplies each frame as `details.texture`. Windows uses
   `texture.textureInfo.handle.ntHandle`; macOS uses
   `texture.textureInfo.handle.ioSurface`.
5. The native addon validates the frame metadata and sends the shared-texture
   identity to the handwritten Iris `MediaEngine_pushSharedTexture` API.
6. On Windows, Iris opens the NT handle, synchronizes with its keyed mutex, and
   GPU-copies it into an Iris-owned `ID3D11Texture2D`. On macOS, Iris looks up
   the IOSurface and creates a `CVPixelBufferRef` backed by that surface.
7. Iris calls Native `pushVideoFrame` with the converted D3D11 texture pointer
   or `ExternalVideoFrame.pixelBuffer`. The Iris call completes before Electron
   releases its borrowed texture.
8. Submission errors from both the Iris transport and RTC API result are
   propagated to JavaScript.
9. Stop and failure paths drain the active submission, release every Electron
   texture exactly once, leave the channel, release the engine, and destroy the
   offscreen window.

### Engine Process Examples

The Advanced menu now contains two mutually exclusive examples:

- `SharedTexturePoc` keeps the original behavior: the Electron main process
  creates, joins, and releases the RTC engine and submits each shared texture.
- `SharedTextureRendererPoc` creates, joins, and releases a separate RTC engine
  in the visible renderer process. The main process only owns the offscreen
  capture window, receives `paint`, forwards one frame at a time, and releases
  Electron's texture after the renderer acknowledges the RTC submission.

These are process-placement examples, not different pixel-format paths. Both
accept the same supported shared-texture formats, and Iris sets
`ExternalVideoFrame.format` to `VIDEO_PIXEL_DEFAULT` whenever it supplies
`pixelBuffer` to Native. That Native contract does not make a CVPixelBuffer or
platform texture transferable between Electron processes. The main-process
example has no main-to-renderer texture boundary; the renderer-owned Engine
example still crosses that boundary before Iris creates the CVPixelBuffer.

RTC engine objects are not shared between processes. The renderer example
therefore performs the complete engine lifecycle in the renderer. On Windows,
the main process sends its PID with the process-local NT handle; the renderer
addon calls `DuplicateHandle` before passing the duplicated handle to Iris.
On macOS, the main-process addon uses Metal to GPU-copy the borrowed
`IOSurfaceRef` into a short-lived global IOSurface; the renderer receives its
`IOSurfaceID` and calls `IOSurfaceLookup`. No process-local pointer is sent
through Electron IPC, and the copied surface is released after submission.
Both examples are retained so an integrator can choose Engine ownership
explicitly rather than treating the renderer path as a requirement.

The controller keeps at most one submission in flight and one latest pending
texture. Older pending frames are released instead of building an unbounded
queue. Frames can be submitted while the channel is joining as well as after
join succeeds.

Each valid compositor frame uses `getCurrentMonotonicTimeInMs()` from the
engine that submits it. The main-process example stamps at `paint`; the renderer
example stamps immediately after receiving the forwarded frame and before
`PushSharedTexture`. That Agora SDK monotonic value, in milliseconds, is
submitted as the RTC video timestamp and returned in telemetry. Electron's
compositor timestamp remains separate and is used only for diagnostics.

This PoC does not capture custom audio, so it does not by itself prove A/V
synchronization. Favorited must timestamp `AudioFrame.renderTimeMs` with the
same Agora SDK monotonic clock and validate long-running drift. The previous
`timestamp = 0` behavior was only a compatibility measure to avoid passing an
unrelated Electron clock value that could be rejected as old.

## macOS IOSurface Adaptation

### Process And API Boundary

The macOS path keeps pointer interop out of the customer renderer. The Worker
and renderer only draw WebGL content. Electron's GPU process produces the
compositor IOSurface, then the offscreen `paint` event delivers a process-local
`IOSurfaceRef` Buffer to the Electron main/browser process. The renderer-owned
Engine example receives only the numeric `IOSurfaceID`, never that reference.

```text
Worker WebGL2
  -> Electron GPU process / compositor
  -> main-process webContents paint event
  -> texture.textureInfo.handle.ioSurface
  -> AgoraElectronBridge.PushSharedTexture
  -> addon IOSurfaceGetID
  -> Iris MediaEngine_pushSharedTexture
  -> Iris IOSurfaceLookup + CVPixelBufferCreateWithIOSurface
  -> Native ExternalVideoFrame.pixelBuffer
  -> RTC encoder
```

`PushSharedTexture`, `CreateSharedIOSurface`, and `ReleaseSharedIOSurface` are hand-written Electron native-addon
APIs declared on `IAgoraElectronBridge`. They are intentionally not added to generated
`IMediaEngine` files, so Electron code generation cannot remove them. Iris also
registers `MediaEngine_pushSharedTexture` in its handwritten
`IMediaEngineWrapper`, outside generated wrapper files. The
main-process example calls `PushSharedTexture` directly. The renderer example
uses `CreateSharedIOSurface` in main on macOS, then calls `PushSharedTexture` in the
renderer on both platforms.

The `IOSurfaceRef` pointer is borrowed and valid only in the process where
Electron delivered it. The PoC never sends that pointer through Electron IPC.
The addon, which is loaded in the same main process, immediately converts it to
a numeric `IOSurfaceID` for Iris. For the renderer example, it creates the
global Metal copy described above. The ID is an Electron-to-Iris transport
detail and is never assigned to a Native video-frame field.

### Frame Metadata And Submission

The addon validates every macOS frame before calling Iris:

- The native-handle Buffer must contain one 64-bit `IOSurfaceRef` value for
  same-process submission. Cross-process renderer submission supplies the
  separately resolved `ioSurfaceId`.
- `IOSurfaceGetWidth()` and `IOSurfaceGetHeight()` must match Electron's
  `textureInfo.codedSize`.
- Iris verifies the IOSurface dimensions, creates a surface-backed
  `CVPixelBufferRef`, and checks that Electron's BGRA/RGBA metadata matches
  `kCVPixelFormatType_32BGRA`/`kCVPixelFormatType_32RGBA`.
- Because macOS does not register a CVPixelBuffer description for 32-bit RGBA
  by default, Iris registers that public CoreVideo format description once
  before wrapping the first RGBA IOSurface.
- Iris submits `VIDEO_BUFFER_TEXTURE + VIDEO_PIXEL_DEFAULT`; Native reads the
  actual pixel format from the `CVPixelBufferRef`.
- RGBAF16, NV12, P010, and multi-plane input are not enabled. Iris performs no
  implicit format conversion, and mismatched or unsupported frames fail before
  Native submission.
- `timestamp` uses `getCurrentMonotonicTimeInMs()`. Electron's compositor
  timestamp remains diagnostic metadata and is never used as the RTC clock.
- The IOSurface path supplies no CPU pixel buffer and performs no Electron-side
  `readPixels`, staging-buffer readback, or full-frame memory copy.
- The renderer-owned Engine example requires one Metal GPU copy into a global
  IOSurface because Electron's original compositor surface cannot be looked up
  directly from another process. The main-process Engine example remains the
  direct original-surface path.
- Global IOSurfaces are used only by this PoC bridge, are never cached, and are
  released as soon as renderer submission finishes. Production code should
  prefer a scoped Mach-port transport when that interop is available.

In a local Electron 43.2 test at 800 x 600 and 30 fps, 120 compositor frames
alternated between exactly two original IOSurface IDs. Retaining both original
surfaces with `CFRetain` for the entire test did not change that rotation or
create a third surface. This shows that Core Foundation reference counts keep
the objects alive but do not reserve them from Chromium; Electron's
`texture.release()` and compositor synchronization control reuse.

The two-surface observation is not a permanent platform contract. Resize,
device loss, context recreation, or Chromium changes may replace the pool. A
future no-copy renderer implementation could transfer a Mach right once for
each observed pool member and send only the current surface identity per frame,
but it must dynamically register new surfaces, retire old ones, and preserve
producer-consumer synchronization. Sending an ID through ordinary Electron IPC
remains insufficient.

The matching Native SDK contract accepts `ExternalVideoFrame.pixelBuffer` with
`VIDEO_BUFFER_TEXTURE` and `VIDEO_PIXEL_DEFAULT`, then reads BGRA/RGBA from the
CVPixelBuffer itself. Iris retains the CVPixelBuffer through the synchronous
`pushVideoFrame` call and releases it after Native returns. Only after the Iris
call succeeds or fails does the controller call `texture.release()`. The
controller allows one active submission and keeps only the latest pending
frame.

### Frame Rate, Background Operation, And Recovery

The selected 30, 48, or 60 fps value is applied to all three pacing stages:

- Worker WebGL draw loop
- Electron `webContents.setFrameRate()` compositor target
- RTC `setVideoEncoderConfiguration({ frameRate })` encoder target

`sentFrameRate` remains an observed RTC statistic rather than a hard guarantee;
network or device adaptation can reduce it. The hidden capture window uses
`show: false` and `backgroundThrottling: false`, but each target mode must still
be measured on supported macOS hardware.

Renderer termination, WebGL context loss, GPU-process exit, and paint gaps are
reported by the existing health state. No IOSurface ID is cached across frames,
so resumed `paint` events naturally provide current surfaces. Iris lookup or
conversion errors are returned as submission failures. Full recovery from an actual
macOS GPU reset remains an acceptance test.

### Verified Scope

The macOS implementation has been verified with:

- A universal `arm64`/`x86_64` Electron addon linked with
  `IOSurface.framework`.
- A matching universal Iris build whose `ExternalVideoFrame` serializer
  includes `pixelBuffer` and whose handwritten wrapper exposes
  `MediaEngine_pushSharedTexture`.
- Iris tests that create real BGRA and RGBA IOSurface-backed CVPixelBuffers and
  verify that the Native mock receives `ExternalVideoFrame.pixelBuffer`,
  `VIDEO_PIXEL_DEFAULT`, dimensions, timestamp, and track ID.
- An Electron native request test that verifies the new Iris event, platform
  handle slot, metadata, and synchronous RTC result propagation.

This evidence proves compilation and the Electron-to-Iris-to-Native API
boundary. It does not by itself claim remote visual correctness,
end-to-end zero-copy encoding, zero-copy operation across different Metal
devices, long-running A/V drift compliance, or GPU-reset recovery. Those remain
customer acceptance measurements.

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
- `webContents.setFrameRate(30 | 48 | 60)` sets the target compositor cadence, while
  the Worker runs its own timer-driven WebGL2 draw loop at the same target rate.
- `setVideoEncoderConfiguration({ frameRate })` applies the same target to the
  RTC encoder; without it, the SDK defaults to 15 fps and drops excess input
  frames before encoding.

The `visible` and `minimized` capture-window modes in the PoC exist only for
comparison testing. The production recommendation is the dedicated
`show: false` mode; the capture window should not follow the main window's
visibility or minimized state.

These settings request continued background rendering, but they are not a hard
real-time or cross-platform frame-rate guarantee. Acceptance must measure each
stage separately: Worker draw intervals, Electron shared-texture `paint`
intervals, Native submissions, and RTC sent/encoded frame rate. The PoC reports
these metrics and marks health degraded after a paint gap longer than 500 ms.
Windows D3D11 and macOS IOSurface transport are implemented. macOS background
pacing and remote publishing still require platform validation.

## Target Ownership Boundary

- Favorited renders the final Studio frame into the full-window canvas, and
  owns source capture, scene composition, window/process orchestration,
  preview, A/V clock mapping, and renderer/WebGL/stream recovery.
- The platform-neutral Agora Electron API accepts the compositor texture and
  exposes the Agora monotonic clock needed by Favorited's A/V mapping.
- Iris owns Windows NT-handle/D3D11 and macOS IOSurface/CVPixelBuffer interop.
  Native receives only `ID3D11Texture2D*` or `CVPixelBufferRef`, never the
  Electron shared handle.
- Agora owns texture-import, stale-handle, D3D11 device-loss, and SDK
  resource recovery, and reports actionable failures to Favorited. Favorited
  writes no platform-specific native interop code.

The Advanced page allows temporary selection of 30, 48, or 60 fps and the three
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
- macOS universal addon compilation against an Iris build that serializes
  `ExternalVideoFrame.pixelBuffer`

The earlier CPU-readback implementation passed a real-channel smoke test. That
result does not prove that the direct-texture Native SDK path works. The native
team must verify increasing encoded-frame counters, bitrate, and moving remote
video with this package.

## Direct Texture Path

Every submitted frame follows this path:

```text
Electron NT handle
  -> Iris MediaEngine_pushSharedTexture
  -> Iris OpenSharedResource1 + keyed-mutex GPU CopyResource
  -> Iris-owned ID3D11Texture2D
  -> Native ExternalVideoFrame.d3d11Texture2d
  -> RTC SDK
  -> encoder
```

On macOS the corresponding path is:

```text
Electron IOSurfaceRef
  -> addon IOSurfaceGetID
  -> Iris MediaEngine_pushSharedTexture
  -> Iris IOSurfaceLookup + CVPixelBufferCreateWithIOSurface
  -> Native ExternalVideoFrame.pixelBuffer
  -> RTC SDK -> encoder
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
diagnostic, not a zero-copy performance measurement. Iris independently opens
and converts the submitted handle for RTC.

The following items are intentionally not claimed by this PoC:

- End-to-end zero-copy encoding
- GPU-only BGRA/RGBA-to-NV12 conversion
- Full D3D11 device-loss recovery
- NV12, P010, or multi-plane shared-texture support
- An automated remote-client video-content assertion

The Electron `HANDLE` is borrowed. Iris opens it without closing it, copies the
content into an Iris-owned keyed-mutex texture, and passes that texture's COM
pointer to Native. The JavaScript controller releases Electron's texture only
after the synchronous Iris call returns. On macOS, Iris retains the looked-up
IOSurface through CVPixelBuffer creation and keeps the CVPixelBuffer alive until
Native `pushVideoFrame` returns.

## Iris Conversion Contract

The bundled Native SDK headers expose the converted-resource inputs:

- `ExternalVideoFrame::VIDEO_BUFFER_TEXTURE` (`3`)
- `VIDEO_TEXTURE_ID3D11TEXTURE2D` (`17`)
- `ExternalVideoFrame::d3d11Texture2d`
- `ExternalVideoFrame::textureSliceIndex`
- `ExternalVideoFrame::pixelBuffer`

The Electron package must bundle an Iris build that contains
`MediaEngine_pushSharedTexture` together with the matching CSD-79710 Native
build. An older Iris artifact will compile the Electron addon but return
`ERR_NOT_SUPPORTED` at runtime because the handwritten event is absent.

Iris, not Native, resolves Electron's platform handles:

```cpp
ExternalVideoFrame frame;
frame.type = ExternalVideoFrame::VIDEO_BUFFER_TEXTURE;
frame.format = VIDEO_TEXTURE_ID3D11TEXTURE2D;
ComPtr<ID3D11Texture2D> iris_texture = OpenAndGpuCopy(nt_handle);
frame.d3d11Texture2d = iris_texture.Get();
frame.textureSliceIndex = 0;
frame.stride = width;
frame.height = height;
frame.timestamp = rtc_timestamp_ms;

media_engine->pushVideoFrame(&frame, video_track_id);
```

The integration must provide all of the following behavior:

1. Support `setExternalVideoSource(true, true, VIDEO_FRAME)` on Windows.
2. Treat `d3d11Texture2d` as `ID3D11Texture2D*`; the NT handle never crosses the
   Iris-to-Native boundary.
3. Accept BGRA on Windows and BGRA/RGBA on macOS. RGBAF16 is explicitly out of
   scope and must fail before Native submission.
4. Keep pixel processing on the GPU, including color conversion, scaling, and
   transfer into a hardware encoder input surface.
5. Iris probes DXGI adapters until `OpenSharedResource1` succeeds and creates
   its output texture on that device.
6. Handle D3D11 device loss and texture-size changes without retaining stale
   resources.
7. Return the actual RTC submission result, with `0` meaning the texture was
   accepted under the documented lifetime contract.
8. Preserve the `rtcTimestampMs` value obtained from
   `getCurrentMonotonicTimeInMs()` as `ExternalVideoFrame::timestamp`.

### Lifetime and Synchronization Contract

This contract is required before the addon can safely call
`texture.release()`:

- Iris opens and GPU-copies the borrowed handle before calling Native.
- Neither Iris nor Native closes Electron's original handle.
- Native retains or consumes the converted D3D11 texture/CVPixelBuffer before
  `pushVideoFrame` returns.
- Open or validation failures must be returned synchronously as a negative RTC
  result so Electron does not treat the frame as accepted.
- The contract must state when Chromium may reuse the source texture.
- Iris acquires the source and destination keyed mutexes around the Windows GPU
  copy; Native must honor the converted texture's synchronization contract.

A Windows GPU-to-GPU `CopyResource` is intentional: it establishes ownership
without staging, `Map`, or GPU-to-CPU readback. macOS creates a CVPixelBuffer
view over the IOSurface without reading pixels into a CPU buffer. The renderer
case still has its existing Metal copy for cross-process IOSurface transport.

## Acceptance Criteria for Shared Texture Support

Shared-texture support should not be considered complete until all of these
conditions pass:

- At least 300 consecutive D3D11 frames return success.
- Encoded frame counters and upstream bitrate continue increasing.
- A remote client displays motion rather than a single frozen frame.
- The publishing path contains no staging texture with `CPU_ACCESS_READ`,
  `Map`, or full-frame CPU pixel copy.
- Source textures are neither reused early nor leaked during sustained load.
- Resize, stop during join, repeated join/leave, and device-loss paths complete
  without crashes or stale frames.
- BGRA/RGBA behavior, timestamp semantics, adapter selection, and texture
  lifetime are documented as supported API contracts.

## Relevant Files

- `example/src/main/sharedTexturePocController.js`
- `example/src/main/sharedTexturePocTelemetry.js`
- `example/extraResources/sharedTextureScene.html`
- `example/extraResources/sharedTextureSceneWorker.js`
- `source_code/agora_node_ext/agora_electron_bridge.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_preview.cpp`
- `source_code/agora_node_ext/iosurface_shared_texture_importer.cpp`
- `source_code/agora_node_ext/shared_texture_request.cpp`
- Iris `src/dcg/src/impl/SharedTextureConverter.cc`
- Iris `src/dcg/src/impl/IMediaEngine_Wrapper.cc`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/AgoraMediaBase.h`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/IAgoraMediaEngine.h`

Runtime logs are written to `%LOCALAPPDATA%\Agora\electron`.

## Windows Measurement Matrix

Run hidden, visible, and minimized at 30, 48, and 60 fps for at least ten
minutes per combination. With `T = 1000 / fps`, require
`abs(P50 - T) / T <= 0.10`, `P99 < 3 * T`, and no unexplained gap above 500 ms.
Worker draw, paint, submission, encoded-frame, frame-rate, and bitrate metrics
must continue advancing while a receiver shows motion.

Use `WEBGL_lose_context` to verify context restoration and
`forcefullyCrashRenderer()` to verify bounded renderer cleanup. These tests and
a GPU child-process exit are not evidence of real D3D11 device removal. Do not
claim device-loss recovery until a test actually observes
`DXGI_ERROR_DEVICE_REMOVED` or `DXGI_ERROR_DEVICE_RESET`.
