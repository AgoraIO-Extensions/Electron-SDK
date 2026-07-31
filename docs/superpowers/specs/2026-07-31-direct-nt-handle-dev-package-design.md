# Direct NT Handle Development Package Design

## Goal

Produce a Windows x64 development package for native SDK integration testing. The package must use Electron's offscreen-rendering NT handle path and pass the opened `ID3D11Texture2D*` directly to Iris `pushVideoFrame`.

## Scope

- Keep the current Advanced page and Settings-derived App ID, token, channel, and UID behavior.
- Keep the current main-process controller, IPC lifecycle, frame backpressure, texture release, custom video track publication, logging, and Windows x64 CI workflow.
- Switch external video input to texture mode with `setExternalVideoSource(true, true, 0)` and use the matching `false, true, 0` cleanup call.
- Change the shared-texture native submission path, its focused tests, and the English and Chinese PoC status documentation.
- Build and publish the existing Windows x64 Example ZIP artifact.

## Data Flow

1. Electron OSR emits a texture containing `textureInfo.handle.ntHandle`.
2. The main-process controller sends the handle metadata through `pushSharedD3D11Texture`.
3. The addon validates the request and opens the NT handle with `ID3D11Device1::OpenSharedResource1`.
4. The addon validates dimensions, pixel format, and `D3D11_RESOURCE_MISC_SHARED_NTHANDLE`.
5. The addon calls `MediaEngine_pushVideoFrame_4e544e2` with exactly five buffers. Slots 0-3 are null, slot 4 is the opened `ID3D11Texture2D*`, and all five lengths are zero.
6. The complete Iris JSON contract is `frame.type=3`, `frame.format=17` (`VIDEO_TEXTURE_ID3D11TEXTURE2D`), `frame.stride=width`, `frame.height=height`, `frame.timestamp=0`, `frame.textureSliceIndex=0`, and `videoTrackId=0`. Electron's process-relative timestamp remains intentionally unused.
7. The texture remains alive until the Iris call returns; the controller releases Electron's texture after the asynchronous addon operation settles.

No staging texture, CPU mapping, pixel allocation, keyed mutex, delayed-release heuristic, asynchronous native worker, or CPU fallback is introduced.

## Ownership

Electron owns the input `HANDLE`; the addon borrows it and never closes it. `OpenSharedResource1` creates an addon-owned COM reference. Iris consumes the `ID3D11Texture2D*` synchronously during `CallIrisApi`; the COM reference is released only after that call returns. The resolved or rejected JavaScript Promise then permits the controller to call Electron `texture.release()` exactly once. Validating any longer asynchronous Native SDK ownership contract is explicitly delegated to the native team using this package.

## Compatibility Boundary

This is a Windows x64 PoC package. It intentionally exercises the direct D3D11 texture contract that the native team needs to validate. macOS builds remain unchanged but do not execute this Windows-only path.

## Failure Handling

The addon rejects invalid handles, mismatched dimensions or formats, resources without `D3D11_RESOURCE_MISC_SHARED_NTHANDLE`, and ambiguous adapter matches. It preserves the Iris transport result and response string separately, rejects nonzero transport results, rejects empty or malformed RTC responses, and rejects negative RTC results. Failures are returned to JavaScript and the Electron texture is still released exactly once.

## Verification

- A small parameter-assembly seam is tested with a fake texture pointer and fake Iris caller: exactly five buffers, slots 0-3 null, slot 4 equal to the texture pointer, all lengths zero, synchronous pointer lifetime, and preservation of both Iris transport and RTC response results.
- Focused C++ tests assert the complete texture-frame JSON contract.
- Existing controller and TypeScript tests remain green.
- The Example compiles locally.
- Static verification confirms the importer contains `OpenSharedResource1` and contains none of `ReadTexturePixels`, staging creation, `CopyResource`, `Map`, or CPU pixel allocation.
- Windows packaging rebuilds the checkout's addon against Electron `43.2.0` ABI `148`, links the Example to this checkout, passes `sharedTextureRuntime.test.js`, builds the x64 ZIP, and uploads it successfully. The package must not resolve the published SDK dependency.
- The final handoff includes the exact commit, workflow run, and artifact link.
- CI packaging proves provenance, ABI compatibility, compilation, and artifact creation. Successful remote video rendering is intentionally delegated to the native team because this package exists to validate their updated texture-consumption implementation.
