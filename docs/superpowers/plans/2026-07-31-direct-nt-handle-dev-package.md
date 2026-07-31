# Direct NT Handle Development Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore direct Windows D3D11 texture submission and produce a Windows x64 Example package built from this checkout for native SDK validation.

**Architecture:** Keep the current Electron main-process UI and lifecycle. Replace only the importer's CPU readback with a tested Iris call-parameter seam that synchronously submits the opened texture pointer, switch external input to texture mode, and make CI prove that the packaged Example uses the locally rebuilt Electron ABI 148 addon.

**Tech Stack:** Electron 43.2.0, Node-API/C++, D3D11/DXGI, Iris `CallIrisApi`, Jest, CMake/CTest, electron-builder, GitHub Actions.

---

### Task 1: Lock the direct Iris texture contract

**Files:**
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.h`
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- Test: `source_code/agora_node_ext/tests/shared_texture_request_test.cpp`

- [ ] Add failing assertions for the complete JSON contract: `type=3`, `format=17`, dimensions, `timestamp=0`, `textureSliceIndex=0`, and `videoTrackId=0`.
- [ ] Add a failing fake-Iris test for exactly five buffers, null slots 0-3, texture pointer in slot 4, and zero lengths.
- [ ] Run the focused CMake test and confirm failure reflects the raw-frame implementation.
- [ ] Introduce the smallest parameter-assembly/call seam and make the focused test pass.
- [ ] Confirm the seam returns both the transport result and Iris response without changing bridge parsing.

### Task 2: Restore GPU texture submission

**Files:**
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`

- [ ] Remove `ReadTexturePixels`, staging texture creation, `CopyResource`, `Map`, row copies, and the CPU pixel vector.
- [ ] Submit `matches[0].texture.Get()` synchronously through the tested seam.
- [ ] Run focused C++ tests and static absence checks.
- [ ] Run the TypeScript/Jest shared-texture tests.

### Task 3: Enable texture input and align documentation

**Files:**
- Modify: `example/src/main/sharedTexturePocController.js`
- Test: `example/src/main/__tests__/sharedTexturePocController.test.js`
- Modify: `docs/shared-texture-poc/README.md`
- Modify: `docs/shared-texture-poc/README.zh-CN.md`

- [ ] Change controller tests to require `setExternalVideoSource(true, true, 0)` and matching cleanup.
- [ ] Run the controller test and confirm it fails on the current raw-frame flag.
- [ ] Change only the start/cleanup texture flags and make the test pass.
- [ ] Update both status documents to describe the direct D3D11 development package, its synchronous borrowed-handle/COM lifetime, and native-team runtime validation boundary.

### Task 4: Prove package provenance and build the Demo

**Files:**
- Modify if required: `.github/workflows/build.yml`
- Test: `example/src/main/__tests__/sharedTextureRuntime.test.js`

- [ ] Ensure Windows preparation rebuilds the checkout addon with `--runtime=electron --runtime-version=43.2.0`, links the checkout into Example, and runs the runtime-resolution assertion before packaging.
- [ ] Run `yarn typecheck`, focused Jest tests, and `yarn --cwd example compile` locally.
- [ ] Commit the implementation and documentation changes.
- [ ] Push `dev/shared-texture-poc` and dispatch `build.yml`.
- [ ] Wait for Windows x64 compilation, packaging, and artifact upload to succeed.
- [ ] Report the commit, workflow URL, and downloadable Windows ZIP artifact.
