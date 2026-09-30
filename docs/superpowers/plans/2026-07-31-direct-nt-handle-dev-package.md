# Direct NT Handle Development Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pass Electron's original Windows NT handle value unchanged to the native SDK and produce a verified Windows x64 Example package.

**Architecture:** Keep Electron's main-process texture ownership and the existing five-slot Iris call contract. The addon decodes the eight native-endian handle bytes into a Windows x64 `uintptr_t`, places that value directly in buffer slot 4, and delegates `OpenSharedResource1` plus resource ownership to the native SDK.

**Tech Stack:** Electron 43.2.0, Node-API/C++, Iris `CallIrisApi`, Jest, CMake/CTest, electron-builder, GitHub Actions.

---

### Task 1: Lock Handle-Value Semantics

**Files:**
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.h`
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- Test: `source_code/agora_node_ext/tests/shared_texture_request_test.cpp`

- [ ] **Step 1: Write the failing handle-bit regression**

Use a Windows x64 `uintptr_t` value with nonzero upper 32 bits, copy its native-endian bytes into `request.nt_handle`, and require the call-buffer builder to accept the request. Assert `reinterpret_cast<uintptr_t>(buffers[4])` equals the original value and differs from the address of `request.nt_handle`.

- [ ] **Step 2: Run the focused C++ test and verify RED**

Run:

```bash
/usr/bin/clang++ -std=c++11 source_code/agora_node_ext/d3d11_shared_texture_importer.cpp source_code/agora_node_ext/shared_texture_request.cpp source_code/agora_node_ext/tests/shared_texture_request_test.cpp -o /tmp/shared_texture_request_test
/tmp/shared_texture_request_test
```

Expected: compilation failure because `BuildSharedTextureCallBuffers` still accepts a texture pointer rather than a request.

- [ ] **Step 3: Implement the platform-neutral decoder and builder**

Add `static_assert(sizeof(uintptr_t) == 8)`, decode with `std::memcpy`, and return five buffers with the decoded value in slot 4. Never use `&request.nt_handle`, `request.nt_handle`, or the address of a local `HANDLE` as the slot value.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the same focused commands. Expected: `shared texture request validation passed`.

### Task 2: Preserve The Handle Through The Iris Call

**Files:**
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.h`
- Test: `source_code/agora_node_ext/tests/shared_texture_request_test.cpp`

- [ ] **Step 1: Write the failing fake-Iris regression**

Add a platform-neutral call seam whose fake caller can inspect JSON, buffers, lengths, and buffer count. Require the fake to observe the high-bit handle value in slot 4, return a nonzero transport value plus a known RTC response, and assert both values are preserved in `SharedTextureSubmissionResult`. Expected: compilation failure because the seam does not exist.

- [ ] **Step 2: Run the focused test and verify RED**

Run the two exact `clang++` commands from Task 1. Expected: compilation failure naming the missing call seam.

- [ ] **Step 3: Implement the minimal call seam**

Build the JSON and five-slot buffers from the request, call the injected synchronous callback, and retain both its transport result and RTC response. On Windows, adapt this seam to `ApiParam` and `IApiEngineBase::CallIrisApi` without changing the slot values.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the two exact `clang++` commands from Task 1. Expected: `shared texture request validation passed`.

### Task 3: Remove Addon-Side D3D11 Import

**Files:**
- Modify: `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- Modify: `CMakeLists.txt`

- [ ] **Step 1: Verify the obsolete import path is present**

Run:

```bash
rg -n "OpenSharedResource1|D3D11CreateDevice|EnumAdapters1|ValidateDescriptor|ComPtr|d3d11_1.h|dxgi1_2.h" source_code/agora_node_ext/d3d11_shared_texture_importer.cpp
```

Expected: matches prove the code targeted by this removal still exists.

- [ ] **Step 2: Submit the decoded handle directly**

Have `SubmitSharedD3D11Texture` invoke the tested call seam with the request. Preserve the JSON, five zero lengths, Iris transport result, and RTC response contract. Keep `adapterLuid` as an empty compatibility field.

- [ ] **Step 3: Delete obsolete D3D11 logic and dependencies**

Remove D3D/DXGI headers, DXGI factory creation, adapter enumeration, D3D11 device creation, `OpenSharedResource1`, descriptor validation, COM references, Adapter LUID formatting, and the CMake test target's `d3d11` and `dxgi` link dependencies.

- [ ] **Step 4: Verify static absence and focused tests**

Run:

```bash
if rg -n "OpenSharedResource1|D3D11CreateDevice|EnumAdapters1|ValidateDescriptor|ComPtr|d3d11_1.h|dxgi1_2.h" source_code/agora_node_ext/d3d11_shared_texture_importer.cpp; then exit 1; fi
yarn jest example/src/main/__tests__/sharedTexturePocController.test.js example/src/main/__tests__/sharedTexturePocIpc.test.js ts/__tests__/MediaEngineInternal.test.ts --runInBand --watchman=false
```

Expected: `rg` returns no matches and Jest passes.

### Task 4: Align Documentation And Verify The Demo

**Files:**
- Modify: `docs/shared-texture-poc/README.md`
- Modify: `docs/shared-texture-poc/README.zh-CN.md`
- Modify: `.github/workflows/build.yml`

- [ ] **Step 1: Correct the public PoC explanation**

Document that slot 4 contains the original handle value, not its address or an addon-opened texture pointer. State that Native must synchronously open/duplicate it before returning, must not close Electron's handle, and owns any retained COM reference.

- [ ] **Step 2: Run repository verification**

Run the focused `clang++` commands from Task 1, the exact Jest command from Task 3, `yarn typecheck`, and `yarn --cwd example compile`. Preserve the unrelated untracked Advanced-page image.

- [ ] **Step 3: Add Windows x64 CTest verification**

After `yarn build_windows_x64_release`, run these commands in `.github/workflows/build.yml` before packaging:

```powershell
cmake --build build --config Release --target shared_texture_request_test
ctest --test-dir build -C Release -R shared_texture_request --output-on-failure
```

- [ ] **Step 4: Commit, push, and verify the exact workflow run**

Commit only the implementation, tests, plan, workflow, and PoC documentation. Push `dev/shared-texture-poc`, dispatch `build.yml` for that branch with `gh workflow run build.yml --ref dev/shared-texture-poc`, identify the run whose `headSha` equals the pushed commit, wait for it with `gh run watch <run-id> --exit-status`, verify Windows x64 CTest, addon rebuild, runtime provenance, Demo packaging, and artifact upload all succeeded, then report the exact run and artifact URLs.
