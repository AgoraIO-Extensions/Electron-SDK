# Direct NT Handle Development Package Design

## Goal

Produce a Windows x64 development package for native SDK integration testing. The package must use Electron's offscreen-rendering NT handle path and pass the opened `ID3D11Texture2D*` directly to Iris `pushVideoFrame`.

## Scope

- Keep the current Advanced page and Settings-derived App ID, token, channel, and UID behavior.
- Keep the current main-process controller, IPC lifecycle, frame backpressure, texture release, custom video track configuration, logging, and Windows x64 CI workflow.
- Change only the shared-texture native submission path and its focused tests.
- Build and publish the existing Windows x64 Example ZIP artifact.

## Data Flow

1. Electron OSR emits a texture containing `textureInfo.handle.ntHandle`.
2. The main-process controller sends the handle metadata through `pushSharedD3D11Texture`.
3. The addon validates the request and opens the NT handle with `ID3D11Device1::OpenSharedResource1`.
4. The addon validates dimensions, pixel format, and `D3D11_RESOURCE_MISC_SHARED_NTHANDLE`.
5. The addon places the opened `ID3D11Texture2D*` in buffer index 4 for `MediaEngine_pushVideoFrame_4e544e2` and submits a texture frame (`type: 3`).
6. The texture remains alive until the Iris call returns; the controller releases Electron's texture after the asynchronous addon operation settles.

No staging texture, CPU mapping, or pixel copy is performed.

## Compatibility Boundary

This is a Windows x64 PoC package. It intentionally exercises the direct D3D11 texture contract that the native team needs to validate. macOS builds remain unchanged but do not execute this Windows-only path.

## Failure Handling

The addon rejects invalid handles, mismatched dimensions or formats, resources without `D3D11_RESOURCE_MISC_SHARED_NTHANDLE`, ambiguous adapter matches, and Iris transport failures. Failures are returned to JavaScript and the Electron texture is still released exactly once.

## Verification

- Focused C++ request/importer tests assert texture-frame JSON and direct buffer placement behavior where testable.
- Existing controller and TypeScript tests remain green.
- The Example compiles locally.
- GitHub Actions builds the Windows x64 ZIP and uploads it successfully.
- The final handoff includes the exact commit, workflow run, and artifact link.
