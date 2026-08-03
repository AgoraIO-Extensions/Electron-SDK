# Direct NT Handle Development Package Design

## Goal

Produce a Windows x64 development package for native SDK integration testing. The package must use Electron's offscreen-rendering NT handle path and pass the original NT `HANDLE` value directly to Iris `pushVideoFrame`. The native SDK owns opening that handle as an `ID3D11Texture2D`.

## Scope

- Keep the current Advanced page and Settings-derived App ID, token, channel, and UID behavior.
- Keep the current main-process controller, IPC lifecycle, frame backpressure, texture release, custom video track publication, logging, and Windows x64 CI workflow.
- Switch external video input to texture mode with `setExternalVideoSource(true, true, 0)` and use the matching `false, true, 0` cleanup call.
- Change the shared-texture native submission path, its focused tests, and the English and Chinese PoC status documentation.
- Build and publish the existing Windows x64 Example ZIP artifact.

## Data Flow

1. Electron OSR emits a texture containing `textureInfo.handle.ntHandle`.
2. The main-process controller sends the handle metadata through `pushSharedD3D11Texture`.
3. The addon validates the request and decodes the eight handle bytes without changing the value.
4. The addon calls `MediaEngine_pushVideoFrame_4e544e2` with exactly five buffers. Slots 0-3 are null, slot 4 is the original NT `HANDLE` represented as a `void*`, and all five lengths are zero.
5. Before `CallIrisApi` returns, the native SDK opens or duplicates the borrowed handle with its D3D11 device and validates the resulting resource.
6. The complete Iris JSON contract is `frame.type=3`, `frame.format=17` (`VIDEO_TEXTURE_ID3D11TEXTURE2D`), `frame.stride=width`, `frame.height=height`, `frame.timestamp=0`, `frame.textureSliceIndex=0`, and `videoTrackId=0`. Electron's process-relative timestamp remains intentionally unused.
7. Electron's texture and original handle remain alive until the synchronous Iris call returns. The controller releases Electron's texture after the Promise-returning addon call settles; an SDK-owned COM reference created during the call may outlive Electron's texture.

No Addon-side D3D11 device, adapter enumeration, `OpenSharedResource1`, staging texture, CPU mapping, pixel allocation, keyed mutex, delayed-release heuristic, asynchronous native worker, or CPU fallback is introduced.

## Ownership

Electron owns the input `HANDLE`; neither the addon nor the native SDK closes it. Iris and the native SDK receive the unchanged borrowed handle value during `CallIrisApi`. Before that synchronous call returns, the native SDK must open or duplicate the handle and retain its own COM reference if consumption continues asynchronously. The resolved or rejected JavaScript Promise then permits the controller to call Electron `texture.release()` exactly once; the SDK-owned COM resource may outlive Electron's texture and is eventually released by the SDK.

## Compatibility Boundary

This is a Windows x64 PoC package. It intentionally exercises the direct D3D11 texture contract that the native team needs to validate. macOS builds remain unchanged but do not execute this Windows-only path.

## Failure Handling

The addon rejects malformed requests, including handle buffers whose size is not exactly eight bytes. It cannot validate the D3D11 resource before submission because opening the handle is intentionally delegated to the native SDK. `OpenSharedResource1`, invalid-handle, and resource-validation failures must become a negative RTC result before `CallIrisApi` returns. The addon preserves the Iris transport result and response string separately, rejects nonzero transport results, rejects empty or malformed RTC responses, and rejects negative RTC results. Failures are returned to JavaScript and the Electron texture is still released exactly once.

## Verification

- A small parameter-assembly seam is tested on Windows x64 with native-endian bytes for a `uintptr_t` value whose upper 32 bits are nonzero. A `static_assert` requires an eight-byte `uintptr_t`; the test asserts exactly five buffers, null slots 0-3, `reinterpret_cast<uintptr_t>(slot4)` equal to the original bits, slot 4 unequal to the address of the handle-byte storage, all lengths zero, and preservation of both Iris transport and RTC response results.
- Focused C++ tests assert the complete texture-frame JSON contract.
- Existing controller and TypeScript tests remain green.
- The Example compiles locally.
- Static verification confirms the importer contains none of `OpenSharedResource1`, D3D11 device creation, Adapter enumeration, `ReadTexturePixels`, staging creation, `CopyResource`, `Map`, or CPU pixel allocation.
- Windows packaging rebuilds the checkout's addon against Electron `43.2.0` ABI `148`, links the Example to this checkout, passes `sharedTextureRuntime.test.js`, builds the x64 ZIP, and uploads it successfully. The package must not resolve the published SDK dependency.
- The final handoff includes the exact commit, workflow run, and artifact link.
- CI packaging proves provenance, ABI compatibility, compilation, and artifact creation. Successful remote video rendering is intentionally delegated to the native team because this package exists to validate their updated texture-consumption implementation.
