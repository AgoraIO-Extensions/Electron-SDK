# D3D11 shared-texture Phase 0 evidence

Research date: 2026-07-28; contracts closed 2026-07-29

This document records the two lifetime contracts required by the Windows PoC.

## Gate result

- Electron producer lifetime: **CONFIRMED**
- RTC consumer lifetime: **CONFIRMED**
- Electron texture release point: **after synchronous `pushVideoFrame` returns**
- Phase 0 result: **READY**

No delay, frame-count heuristic, keyed mutex, GPU fence, copy texture, or owned
texture pool is required by the confirmed direct path.

## Exact PoC matrix

| Component | Exact candidate |
| --- | --- |
| Electron | `43.2.0` |
| Electron native-module ABI | `148` (`process.versions.modules`) |
| Bundled Node | `24.18.0` |
| Bundled Chrome | `150.0.7871.129` |
| Iris Windows SDK | `iris_4.5.3.123-build.2_DCG_Windows_Video_Standalone_20260728_0241_311014.zip` |
| Native Windows RTC SDK | `Agora_Native_SDK_for_Windows_rel.v4.5.3.123_32922_FULL_20260728_1031_1227303.zip` |
| Windows SDK | `10.0.22621.0` candidate; verify on the Windows PoC host |
| Visual Studio | VS 2022 `v143`; verify the installed MSVC version on the Windows PoC host |

Electron metadata comes from the official Electron 43.2.0 release. The SDK archive
names are pinned by this repository's `package.json`. macOS source tests do not prove
Windows compilation or runtime compatibility.

## Electron 43.2 producer contract

Official source tag: <https://github.com/electron/electron/tree/v43.2.0>.

1. `OffScreenVideoConsumer` starts Chromium capture with
   `media::VideoCaptureBufferType::kGpuMemoryBuffer` and
   `kPreferMappableSharedImage` in
   [`osr_video_consumer.cc`](https://github.com/electron/electron/blob/v43.2.0/shell/browser/osr/osr_video_consumer.cc#L80-L86).
2. The Windows converter exports the cloned GpuMemoryBuffer handle as `ntHandle` in
   [`osr_converter.cc`](https://github.com/electron/electron/blob/v43.2.0/shell/common/gin_converters/osr_converter.cc).
   The JS `texture` object and `release()` remain main-process-owned.
3. Chromium creates the copy request with
   `populates_mappable_shared_image=true` in
   [`frame_sink_video_capturer_impl.cc`](https://source.chromium.org/chromium/chromium/src/+/150.0.7871.129:components/viz/service/frame_sinks/video_capture/frame_sink_video_capturer_impl.cc).
4. `CopyOutputRGBAInTexture` sets `should_wait_for_gpu_work`. `FlushSurface` installs
   `ReadbackContextTexture::OnMailboxReady` as the Skia finished callback; the result
   is not sent before that callback. See
   [`skia_output_surface_impl_on_gpu.cc`](https://source.chromium.org/chromium/chromium/src/+/150.0.7871.129:components/viz/service/display_embedder/skia_output_surface_impl_on_gpu.cc)
   and
   [`skia_render_copy_results.cc`](https://source.chromium.org/chromium/chromium/src/+/150.0.7871.129:components/viz/service/display_embedder/skia_render_copy_results.cc).
5. `OnMailboxReady` calls `SendResult`; only afterward does `DidCopyFrame` clone the
   handle and deliver `OnFrameCaptured`, which reaches Electron's `paint` event.
6. The exact bundled Skia revision is
   `bee4c917220040e147f14964635ff92ce6c5a3f6`. `GrFlushInfo` documents that its
   finished callback runs after all GPU work issued by the flush has finished.

Therefore the shared texture is ready for an external D3D11 reader when Electron
emits `paint`. Electron retains the cloned handle until the consumer invokes
`texture.release()`.

Electron issue <https://github.com/electron/electron/issues/52517> requests that this
synchronization contract be stated in the public documentation. The documentation gap
does not change the source-proven ordering above.

## RTC consumer contract

The exact RTC owner confirmed:

- `ExternalVideoFrame.d3d11Texture2d` accepts an `ID3D11Texture2D*`.
- RTC does not require `D3D11_RESOURCE_MISC_SHARED_KEYEDMUTEX` or an
  `IDXGIKeyedMutex` handshake.
- `pushVideoFrame` consumes the pointer synchronously. After the call returns, RTC no
  longer accesses the texture, and the caller may overwrite or release it immediately.

The existing Iris ABI uses five buffer slots for `pushVideoFrame`; slot five carries
`d3d11Texture2d`. The PoC must pass the opened texture pointer in slot five and keep
the COM reference alive only through the synchronous Iris call.

## Approved direct path

```text
Electron paint
  -> copy the NT handle value while the texture object is alive
  -> ID3D11Device1::OpenSharedResource1
  -> validate adapter LUID, dimensions, and BGRA/RGBA DXGI format
  -> frame.d3d11Texture2d = ID3D11Texture2D*
  -> synchronous Iris pushVideoFrame
  -> return
  -> release COM reference
  -> texture.release() exactly once
```

The importer must use a D3D11 device on the adapter compatible with the shared
resource. Ambiguous or missing adapter matches, descriptor mismatches, unsupported
formats, or Iris failures are explicit errors; there is no silent CPU fallback.

## Verification boundary

macOS can verify TypeScript contracts, controller behavior, validation code that is
platform-neutral, formatting, and existing regressions. Windows x64 must separately
verify Electron ABI 148 addon loading, `OpenSharedResource1`, adapter LUID, descriptor
validation, successful remote video, exactly-once release, D3D debug-layer shutdown,
and absence of CPU staging/readback.
