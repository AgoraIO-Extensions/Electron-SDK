# Electron Shared Texture Video Publishing PoC

[中文说明](./README.zh-CN.md)

## Status

This proof of concept publishes an Electron offscreen-rendered scene to an
Agora channel on Windows. It is functional and has been verified with a real
channel, but it is not a zero-CPU-copy implementation yet.

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
3. A hidden offscreen `BrowserWindow` renders a moving test scene with
   `offscreen.useSharedTexture: true`.
4. Electron 43 supplies each frame as `details.texture`. The Windows NT handle
   is read from `texture.textureInfo.handle.ntHandle`.
5. The native addon validates the frame metadata, finds the matching DXGI
   adapter, and opens the handle with `ID3D11Device1::OpenSharedResource1`.
6. The opened texture is validated for dimensions, DXGI format, and
   `D3D11_RESOURCE_MISC_SHARED_NTHANDLE`.
7. The texture is copied to a staging texture, mapped to CPU memory, and pushed
   to the RTC SDK as raw BGRA or RGBA video.
8. Submission errors from both the Iris transport and RTC API result are
   propagated to JavaScript.
9. Stop and failure paths drain the active submission, release every Electron
   texture exactly once, leave the channel, release the engine, and destroy the
   offscreen window.

The controller keeps at most one submission in flight and one latest pending
texture. Older pending frames are released instead of building an unbounded
queue. Frames can be submitted while the channel is joining as well as after
join succeeds.

RTC timestamps are currently sent as `0`. Electron timestamps are relative to
the capture process, while the RTC pipeline expects its own aligned time base.
Letting the SDK assign the timestamp prevents subsequent frames from being
discarded as old frames.

## Verification Performed

The current implementation has passed:

- The repository build under Node `24.18.0`
- SharedTexture-related Jest tests
- The native `shared_texture_request` CTest
- A real-channel publishing smoke test

The smoke test reached the `PUBLISHED` state, submitted 97 frames, reported
approximately 29-34 Kbps upstream video, and showed encoded frame count
progressing from 23 to 49 to 77 at `800x448`.

## What Is Not Implemented

The current path is not zero-copy and is not CPU-readback-free. Every submitted
frame currently follows this path:

```text
Electron NT handle
  -> ID3D11Texture2D
  -> D3D11 staging texture
  -> Map and row-by-row CPU copy
  -> raw BGRA/RGBA buffer
  -> RTC SDK
  -> encoder
```

The following items are intentionally not claimed by this PoC:

- Direct D3D11 texture input to the RTC encoder
- Direct Native RTC SDK consumption of Electron's NT handle
- End-to-end zero-copy encoding
- GPU-only BGRA/RGBA-to-NV12 conversion
- D3D11 device, adapter, or texture-pool reuse across frames
- NV12, P010, multi-plane, or non-Windows shared-texture support
- An automated remote-client video-content assertion

The per-frame adapter enumeration, D3D11 device creation, staging allocation,
GPU-to-CPU transfer, and CPU buffer allocation are suitable for validating the
pipeline, but not for the final high-performance implementation.

## Why the Current Native SDK Cannot Use the Texture

The bundled Native SDK headers contain the intended API shape:

- `ExternalVideoFrame::VIDEO_BUFFER_TEXTURE` (`3`)
- `VIDEO_TEXTURE_ID3D11TEXTURE2D` (`17`)
- `ExternalVideoFrame::d3d11Texture2d`
- `ExternalVideoFrame::textureSliceIndex`

However, the same `setExternalVideoSource` header documents that
`useTexture=true` is not currently supported. Runtime testing confirms the
gap: Iris correctly receives a non-null `d3d11Texture2d` pointer, but
`pushVideoFrame` returns RTC error `-2`. Calling the Iris high-performance C API
instead of the JSON API would remove bridge overhead, but it would still reach
the same unsupported Native RTC texture path.

## Required Native RTC SDK Changes

The preferred minimal change is to implement the existing
`ExternalVideoFrame` D3D11 contract. The Electron addon can continue opening
the NT handle and pass an in-process COM pointer:

```cpp
ExternalVideoFrame frame;
frame.type = ExternalVideoFrame::VIDEO_BUFFER_TEXTURE;
frame.format = VIDEO_TEXTURE_ID3D11TEXTURE2D;
frame.d3d11Texture2d = opened_texture.Get();
frame.textureSliceIndex = 0;
frame.stride = width;
frame.height = height;
frame.timestamp = 0;

media_engine->pushVideoFrame(&frame, video_track_id);
```

The Native RTC SDK must provide all of the following behavior:

1. Support `setExternalVideoSource(true, true, VIDEO_FRAME)` on Windows.
2. Accept `VIDEO_BUFFER_TEXTURE` with
   `VIDEO_TEXTURE_ID3D11TEXTURE2D` and a valid `ID3D11Texture2D*`.
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

### Lifetime and Synchronization Contract

This contract is required before the addon can safely call
`texture.release()`:

- The SDK must `AddRef` and own the `ID3D11Texture2D` for as long as it reads
  the resource, or synchronously enqueue/copy the frame into an SDK-owned
  texture before `pushVideoFrame` returns.
- If consumption is asynchronous and the source texture cannot be released on
  return, the SDK must provide a completion callback or release token.
- The contract must state when Chromium may reuse the source texture.
- The SDK must define GPU synchronization for Electron BGRA/RGBA shared
  textures, which do not expose a keyed mutex through this API.

A GPU-to-GPU `CopyResource` into an SDK-owned texture pool is an acceptable
first implementation. It is not strictly zero-copy, but it removes the costly
GPU-to-CPU-to-GPU round trip and gives the SDK a clear ownership boundary.

### Optional Direct-Handle API

Alternatively, the Native RTC SDK can accept the NT handle directly. Such an
API needs more than the handle value; it should also carry width, height, DXGI
format, texture slice, adapter LUID, timestamp, and a completion/release
contract. The SDK would then call `OpenSharedResource1` on a compatible D3D11
device internally.

Passing `ID3D11Texture2D*` through the already-declared field is the smaller API
change. Passing the NT handle makes device selection and ownership an SDK
responsibility but introduces a new Windows-specific public contract.

## Migration After Native Texture Support

Once the Native RTC SDK supports the contract above, the Electron integration
can be switched without changing the renderer or IPC workflow:

1. Change `setExternalVideoSource(true, false, ...)` to
   `setExternalVideoSource(true, true, ...)`.
2. Keep opening and validating the Electron NT handle in the addon, unless the
   SDK exposes the direct-handle API.
3. Submit `VIDEO_BUFFER_TEXTURE` and
   `VIDEO_TEXTURE_ID3D11TEXTURE2D` with the opened texture pointer.
4. Remove `ReadTexturePixels`, the staging texture, `Map`, and the raw pixel
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
- `example/extraResources/sharedTextureScene.html`
- `source_code/agora_node_ext/agora_electron_bridge.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- `source_code/agora_node_ext/shared_texture_request.cpp`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/AgoraMediaBase.h`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/IAgoraMediaEngine.h`

Runtime logs are written to `%LOCALAPPDATA%\Agora\electron`.
