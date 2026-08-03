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

- For this temporary Native SDK build, the Iris slot mapped to
  `ExternalVideoFrame.d3d11Texture2d` accepts the original NT handle value.
- RTC does not require `D3D11_RESOURCE_MISC_SHARED_KEYEDMUTEX` or an
  `IDXGIKeyedMutex` handshake.
- `pushVideoFrame` must open or duplicate the borrowed handle synchronously. After the
  call returns, Electron may release its texture; any later RTC access uses the Native
  SDK's own COM reference.

The existing Iris ABI uses five buffer slots for `pushVideoFrame`; slot five carries
`d3d11Texture2d`. The PoC passes the unchanged NT handle value in slot five, not the
address of a `HANDLE` variable. Native must open or duplicate it before the synchronous
Iris call returns and own any retained COM reference.

## Approved direct path

```text
Electron paint
  -> copy the NT handle value while the texture object is alive
  -> frame.d3d11Texture2d = unchanged NT handle value
  -> synchronous Iris pushVideoFrame
  -> Native ID3D11Device1::OpenSharedResource1
  -> Native validates adapter, dimensions, and BGRA/RGBA DXGI format
  -> Native retains its own ID3D11Texture2D COM reference if needed
  -> return
  -> texture.release() exactly once
```

The Native SDK must use a D3D11 device on an adapter compatible with the shared
resource. Handle-open failures, descriptor mismatches, unsupported formats, or Iris
failures are explicit synchronous errors; there is no silent CPU fallback. Native owns
and eventually releases every COM reference it retains.

## Verification boundary

macOS can verify TypeScript contracts, controller behavior, validation code that is
platform-neutral, formatting, and existing regressions. Windows x64 must separately
verify Electron ABI 148 addon loading, handle-bit preservation, Native-side
`OpenSharedResource1`, successful remote video, exactly-once release, D3D debug-layer shutdown,
and absence of CPU staging/readback.

## Implementation status (2026-07-29)

The implementation is complete through the platform-independent boundary:

- TypeScript exposes `pushSharedD3D11Texture` and forwards only the structured frame.
- The native bridge validates the request and decodes the eight handle bytes without
  changing their value.
- The native importer, not TypeScript, constructs the five-slot Iris buffer array and
  places the NT handle value in slot five for the synchronous call.
- The example packages `extraResources/sharedTextureScene.html`; its renderer page only
  controls a main-process RTC/controller singleton through validated IPC.
- The controller permits one native submission in flight, keeps only the latest pending
  texture, and releases every Electron texture exactly once after submission or drop.

Fresh macOS verification passed: 6 source Jest suites / 48 tests, 3 focused example
suites / 11 tests, `yarn typecheck`, the platform-neutral C++ validation/JSON executable,
`yarn --cwd example compile`, and `git diff --check`. The compile emitted the existing
dynamic `keyv` dependency warning. These results do not validate `_WIN32` compilation.

The PoC remains pending on a Windows x64 host for ABI 148 addon loading, MSVC/Windows
SDK compilation, a remote-receiver smoke test, PIX capture, adapter/descriptor logging,
handle-count observation, device-removal status, and D3D debug-layer shutdown output.
