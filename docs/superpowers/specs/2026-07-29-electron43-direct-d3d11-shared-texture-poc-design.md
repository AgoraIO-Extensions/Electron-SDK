# Electron 43 Direct D3D11 Shared Texture PoC Design

## Goal

Prove on Windows x64 that Electron 43.2 offscreen shared textures can be published by
the Agora Electron SDK without copying pixel data to the CPU or to a second GPU
texture.

## Scope

The PoC is Windows-only, uses D3D11, and accepts Electron BGRA/RGBA shared textures.
App ID, channel, token, and UID use the existing example configuration form. The PoC
does not change existing renderer-owned examples and does not add a production-general
cross-platform texture API.

## Confirmed contracts

Electron's Chromium capture path waits for the Skia GPU completion callback before it
delivers the shared handle to Electron's `paint` event. Electron keeps the cloned
handle valid until `texture.release()`.

RTC accepts `ExternalVideoFrame.d3d11Texture2d`, does not require keyed mutex
synchronization, and stops accessing the texture when synchronous `pushVideoFrame`
returns. These contracts make a direct import valid; see
`docs/poc/d3d11-shared-texture-evidence.md`.

## Architecture

The main process owns one hidden offscreen `BrowserWindow`, the shared-texture `paint`
objects, and a single RTC engine for the PoC. The renderer supplies the same App ID,
channel, token, and UID fields used by the existing examples through a narrow IPC
controller interface.

On each accepted `paint` event, the main process calls a Windows-only experimental
Promise-returning bridge API:

```ts
pushSharedD3D11Texture(
  frame: SharedD3D11TextureFrame
): Promise<SharedD3D11TextureResult>
```

```ts
interface SharedD3D11TextureFrame {
  frameId: number;
  ntHandle: Buffer;
  width: number;
  height: number;
  timestampUs: number;
  pixelFormat: 'bgra' | 'rgba';
}
```

Electron's `textureInfo.timestamp` is expressed in microseconds and stays in that unit
at the JS/native request boundary. The Iris `ExternalVideoFrame.timestamp` field is
milliseconds, so the bridge serializes `Math.floor(timestampUs / 1000)` and tests the
conversion explicitly.

The native bridge copies every N-API value before native work starts. On Windows it
opens the NT handle with `ID3D11Device1::OpenSharedResource1`, validates the successful
adapter and descriptor, and invokes Iris synchronously with `texture.Get()` in the
fifth buffer slot. It then resolves with the RTC result. The controller calls Electron
`texture.release()` exactly once in `finally`.

The bridge rejects non-Windows calls with `ERR_PLATFORM_UNSUPPORTED`. It rejects invalid
handles, zero or mismatched dimensions, unsupported DXGI formats, no compatible
adapter, multiple compatible adapters, device removal, and nonzero Iris results with
stable error codes and useful diagnostics including adapter LUID where available.

## Backpressure and lifecycle

Only one submission is in flight. While it is running, the controller keeps at most the
latest pending frame; replacing a pending frame releases the old Electron texture
immediately. This bounds ownership without a native worker or texture pool and favors
fresh video. Stop prevents new submissions, releases the pending frame, awaits the
in-flight call, leaves the channel, releases RTC, and destroys the offscreen window.

The controller owns a frame-ID release ledger so success, failure, replacement, stop,
and window destruction cannot call `release()` more than once.

The window uses `show: false` plus `webPreferences.offscreen.useSharedTexture: true`
and `webPreferences.backgroundThrottling: false`. Its `paint` handler retains the complete Electron
texture object, reads the Windows `texture.textureInfo.ntHandle`, coded width/height,
pixel format, and timestamp, and does not release it until native submission settles.

RTC startup is ordered: initialize the engine, enable video, call
`setExternalVideoSource(true, true, VideoFrame)`, join as broadcaster with the default
video track enabled (`publishCameraTrack: true`, because the external source replaces
the camera source) and custom-track publication disabled, wait for
`onJoinChannelSuccess`, then accept paint frames. Frames emitted before join success or
after failure/stop are released without submission. The direct path uses track ID `0`.

## Explicit non-goals

- No `CopyResource`, owned texture pool, staging texture, map/readback, keyed mutex,
  D3D query, fence, fixed delay, or native three-frame worker.
- No NV12 support or silent CPU fallback.
- No claim of Windows success based on macOS tests.
- No attempt to share the PoC RTC engine with an already running example.

## Verification

macOS source tests cover API forwarding, request validation boundaries, controller
state/backpressure, IPC validation, and exactly-once release. Windows x64 verifies the
Electron 43.2/ABI 148 native build and load, shared-resource open, LUID and descriptor
checks, remote rendering, error paths, handle/resource stability, and D3D debug-layer
cleanup. A PIX capture must show direct shared-resource submission with no CPU
staging/readback or extra GPU copy.
