# D3D11 shared-texture Phase 0 evidence

Research date: 2026-07-28; RTC owner confirmation updated 2026-07-29

This is a gate document, not an implementation specification. No native submission or
texture-pool code may be written until both lifetime contracts below are confirmed.

## Gate result

- Electron producer lifetime: **UNKNOWN**
- RTC consumer lifetime: **CONFIRMED**
- Owned texture release point: **`pushVideoFrame` return**
- Phase 0 result: **BLOCKED**

Neither a delay nor a frame-count heuristic is an acceptable substitute for either
contract.

## Exact PoC candidate matrix

| Component | Exact candidate |
| --- | --- |
| Electron | `33.4.11` (release date 2025-04-26) |
| Electron native-module ABI | `130` (`process.versions.modules`) |
| Bundled Node | `20.18.3` |
| Node-API target | Use the addon's existing Node-API surface; ABI/load validation must run under Electron module ABI `130` |
| Iris Windows SDK | `iris_4.5.3.123-build.2_DCG_Windows_Video_Standalone_20260728_0241_311014.zip`; Iris build `4.5.3.123-build.2`, package build `311014` |
| Native Windows RTC SDK | `Agora_Native_SDK_for_Windows_rel.v4.5.3.123_32922_FULL_20260728_1031_1227303.zip`; RTC build `4.5.3.123_32922`, package build `1227303` |
| Windows SDK | `10.0.22621.0` (candidate pin; availability and compilation are not verified on this macOS host) |
| Visual Studio toolset | Visual Studio 2022 `v143`, MSVC `14.38.33130` (candidate pin; availability and compilation are not verified on this macOS host) |

Electron release metadata is from the official releases feed,
<https://releases.electronjs.org/releases.json>, entry `33.4.11`, which reports Node
`20.18.3`, modules ABI `130`, Chrome `130.0.6723.191`, and Windows x64 availability.
`npm view electron@33 version --json` shows `33.4.11` is the final Electron 33 patch.

The SDK candidates are the exact URLs in repository `package.json` under
`agora_electron` (lines 162-166 at research HEAD):

- <https://download.agora.io/sdk/release/iris_4.5.3.123-build.2_DCG_Windows_Video_Standalone_20260728_0241_311014.zip>
  (SHA-256 `8208c105b854ee3b9f82377a99dbc1d159b78cf8496d0847ddb223d7029d076d`)
- <https://download.agora.io/sdk/release/Agora_Native_SDK_for_Windows_rel.v4.5.3.123_32922_FULL_20260728_1031_1227303.zip>
  (SHA-256 `ad14c2e3d232ba1402a940eb49df033cff55b5813a9b4be5e74868ff4575145e`)

The toolchain values above are exact candidates for the PoC, not claims about how the
downloaded prebuilt DLLs were compiled. The archives do not disclose their Windows SDK
or MSVC compiler versions. A Windows preflight must record installed versions before
later build work starts.

## Electron 33.4.11 producer contract

Official source tag: <https://github.com/electron/electron/tree/v33.4.11>.
The downloaded tag archive had SHA-256
`34a7324e1b19644aad0e1fac3c78aef97df64a4cd4d552d95b8cc0fe98cb0d01`.

### Confirmed facts

1. **Windows handle type is an NT shared D3D11 texture handle.** The public C++ type
   calls it a Windows `HANDLE` to a shared D3D11 texture
   ([`osr_paint_event.h` lines 95-98](https://github.com/electron/electron/blob/v33.4.11/shell/browser/osr/osr_paint_event.h#L95-L98)).
   Electron's Chromium patch creates it with
   `D3D11_RESOURCE_MISC_SHARED_NTHANDLE`
   ([patch lines 26-34](https://github.com/electron/electron/blob/v33.4.11/patches/chromium/osr_shared_texture_remove_keyed_mutex_on_win_dxgi.patch#L26-L34)).
   Therefore the accepted Windows importer is `ID3D11Device1::OpenSharedResource1`,
   not legacy `OpenSharedResource`.

2. **ARGB/ABGR resources deliberately have no keyed mutex.** The same official patch
   selects the mutex-free usage for `PIXEL_FORMAT_ARGB` and `PIXEL_FORMAT_ABGR` and
   states Chromium no longer writes after the copy request returns
   ([lines 55-69](https://github.com/electron/electron/blob/v33.4.11/patches/chromium/osr_shared_texture_remove_keyed_mutex_on_win_dxgi.patch#L55-L69)).
   The handle must therefore not be treated as an `IDXGIKeyedMutex` resource.

3. **The handle remains alive beyond the paint callback until release.** Electron clones
   the `GpuMemoryBufferHandle`, stores the clone together with the frame callback, and
   transfers that holder to JavaScript
   ([`osr_video_consumer.cc` lines 74-119](https://github.com/electron/electron/blob/v33.4.11/shell/browser/osr/osr_video_consumer.cc#L74-L119)).
   The public docs require `texture.release()` once the consumer is done
   ([`offscreen-shared-texture.md` lines 22-24](https://github.com/electron/electron/blob/v33.4.11/docs/api/structures/offscreen-shared-texture.md#L22-L24)).

4. **Process validity is explicit at the JS-object boundary.** The `texture` object and
   its `release` function must remain in the main process; `textureInfo` may cross IPC
   ([`web-contents.md` lines 895-916](https://github.com/electron/electron/blob/v33.4.11/docs/api/web-contents.md#L895-L916)).
   The PoC keeps the offscreen producer and native importer in the main process. It must
   not send the `texture` object through IPC.

5. **No synchronization metadata is exposed.** The complete documented Windows texture
   payload contains pixel/rect/timestamp metadata and only `sharedTextureHandle`; it has
   no fence, sync token, keyed-mutex key, or completion primitive
   ([`offscreen-shared-texture.md` lines 3-24](https://github.com/electron/electron/blob/v33.4.11/docs/api/structures/offscreen-shared-texture.md#L3-L24)).
   Source conversion likewise serializes only that handle on Windows
   ([`osr_converter.cc` lines 99-134](https://github.com/electron/electron/blob/v33.4.11/shell/common/gin_converters/osr_converter.cc#L99-L134)).

### Unknown that blocks the producer gate

Electron 33.4.11 documentation and the examined source do **not** state an external
D3D11 consumer contract that the resource is ready for reading when JavaScript receives
the `paint` event. The patch's statement that Chromium will not write after its copy
request is useful implementation evidence, but it does not specify the cross-device GPU
visibility/ordering guarantee for `OpenSharedResource1` followed immediately by
`CopyResource`. No fence is delivered, and no keyed mutex exists for ARGB/ABGR.

Consequently, "ready at paint" cannot be inferred from event timing or from successful
opening of the handle. It requires an Electron/Chromium owner statement for v33.4.11 or
a documented API synchronization guarantee. A startup probe can validate compatibility,
format, and handle opening, but cannot establish this lifetime/synchronization contract.

Only `bgra`/`rgba` corresponding to the ARGB/ABGR mutex-free path is a candidate. **NV12
is unsupported. Keyed-mutex resources are unsupported. Every other or unknown
synchronization mode is unsupported.**

## RTC 4.5.3.123 consumer contract

The exact downloaded archive was extracted and these shipped headers were inspected:

- `Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/IAgoraMediaEngine.h`
- `Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/AgoraMediaBase.h`
- `iris_4.5.3.123-build.2_DCG_Windows/x64/include/iris_rtc_c_api.h`

### Confirmed facts

1. `AgoraMediaBase.h` lines 518-521 define
   `VIDEO_TEXTURE_ID3D11TEXTURE2D = 17` and support
   `DXGI_FORMAT_B8G8R8A8_UNORM`, `DXGI_FORMAT_B8G8R8A8_TYPELESS`, and NV12.
   Lines 939-947 define `d3d11Texture2d` only as an `ID3D11Texture2D` pointer and a
   texture-array slice index.

2. `IAgoraMediaEngine.h` lines 263-271 declares
   `int pushVideoFrame(base::ExternalVideoFrame* frame, unsigned int videoTrackId = 0)`.
   Its comment documents only the frame argument, track ID, and integer success/failure
   result. It does not say that the texture is consumed synchronously, retained, copied,
   reference-counted, or released after return.

3. The Iris C header exposes only synchronous-looking `CallIrisApi(ApiParam*)` at lines
   17-18, but its signature is not a texture-lifetime contract and supplies no
   per-frame completion/release callback.

4. Repository `ts/Private/internal/IrisApiEngine.ts` lines 576-589 constructs five
   buffers for `MediaEngine_pushVideoFrame_4e544e2`; the current fifth D3D slot is empty.
   The candidate Iris source at
   `/Users/guoxianzhe/agora/iris/src/dcg/src/iris_rtc_api_engine.cc:173-184` maps
   `buffers[4]` to `ExternalVideoFrame.d3d11Texture2d`. This proves pointer routing,
   not ownership duration.

### Native owner confirmation

The shipped headers do not document the texture lifetime, so the project owner obtained
an explicit confirmation from the native RTC owner on 2026-07-29. The question and
answer were:

> Q: After `pushVideoFrame` returns, does the SDK stop accessing the supplied
> `ID3D11Texture2D*`, allowing the caller to overwrite or release it immediately?
>
> A: Yes.

The same owner also confirmed that RTC does not require keyed-mutex locking for this
path and reads the texture directly. Therefore the RTC contract for native RTC
`4.5.3.123_32922` through Iris `4.5.3.123-build.2` is synchronous: after
`pushVideoFrame` returns, the caller may overwrite or release the texture. No delay,
later-frame heuristic, or encoder callback is required.

This closes the RTC consumer gate. It does not close the independent Electron producer
read-readiness gate.

## Required unblock evidence

1. Electron/Chromium owner or official v33.4.11 documentation confirming D3D11 read
   readiness at `paint` for mutex-free ARGB/ABGR `OffscreenSharedTexture`, including the
   ordering primitive relied upon.
2. After that statement exists, update the Electron gate and Phase 0 result at the top;
   only then may native submission proceed under the strict production gate.
