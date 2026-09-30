# CSD-79409 Windows Native SDK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the shared-texture PoC Windows package with the CSD-79409 Native SDK and prove the packaged Native binaries came from that input archive.

**Architecture:** Preserve the existing dependency pipeline and replace only `agora_electron.native_sdk_win`. Validate both extraction layouts before editing, then bind the remote build and downloaded artifact to the pushed commit and input DLL manifest.

**Tech Stack:** Node.js, Yarn, ZIP, SHA-256, Jest, GitHub Actions, Electron 43.2

---

### Task 1: Validate the CSD-79409 archive

**Files:**

- Create temporarily: `/tmp/validate-csd-79409-layout.js`
- Create temporarily: `/tmp/csd-79409-native-sdk/`
- Reference: `scripts/downloadPrebuild.js`
- Reference: `scripts/synclib.js`
- Reference: `CMakeLists.txt`

- [ ] **Step 1: Download and fingerprint the archive**

Download the approved URL with redirects enabled into `/tmp/csd-79409-native-sdk/`, then record its byte size and `shasum -a 256` value.

- [ ] **Step 2: Verify ZIP integrity**

Run `unzip -t <zip>` and require exit code 0.

- [ ] **Step 3: Implement the temporary layout validator**

Create `/tmp/validate-csd-79409-layout.js` using the repository's installed ZIP parser. It must reject anything that violates the Archive Contract in the approved design, simulate `strip: 1` and `strip: 0` into separate temporary directories, and write `/tmp/csd-79409-native-sdk/manifest.json` containing the archive byte size, archive SHA-256, and every Native DLL/EXE normalized path, basename, byte size, and SHA-256.

- [ ] **Step 4: Run the layout validator**

Run `node /tmp/validate-csd-79409-layout.js <zip> /tmp/csd-79409-native-sdk/manifest.json` and require non-empty, complete, hash-consistent output for both extraction modes. The script must exit nonzero on every contract violation and the JSON file becomes the only input manifest used by Task 3.

### Task 2: Update and verify the dependency declaration

**Files:**

- Modify: `package.json:166`
- Test: seven existing SharedTexture Jest suites

- [ ] **Step 1: Verify the new URL assertion fails before editing**

Confirm `git branch --show-current` is exactly `dev/shared-texture-poc`. Then run a Node assertion that `require('./package.json').agora_electron.native_sdk_win` equals the approved CSD-79409 URL. Expected: FAIL against the old package.

- [ ] **Step 2: Replace the Windows Native SDK URL**

Change only `agora_electron.native_sdk_win` in `package.json`.

- [ ] **Step 3: Verify the URL assertion passes**

Rerun the same Node assertion. Expected: PASS.

- [ ] **Step 4: Verify the implementation diff**

Run `git diff --check` and inspect `git diff -- package.json`. Expected: one URL line changed and no other uncommitted implementation files.

- [ ] **Step 5: Run the focused test suite**

Run the exact seven-file Jest command from the approved design. Expected: 7 suites and 54 tests pass.

- [ ] **Step 6: Commit the dependency update**

Stage only `package.json`. Require `git diff --cached --name-only` to output exactly `package.json`, `git diff --cached --check` to pass, and the cached diff to contain only the single URL replacement. Commit as `chore: update Windows Native SDK for CSD-79409`.

### Task 3: Build and prove artifact provenance

**Files:**

- Workflow: `.github/workflows/build.yml`
- Download temporarily: `/tmp/electron-sdk-csd-79409-<run_id>/`
- Create temporarily: `/tmp/verify-csd-79409-artifact.js`

- [ ] **Step 1: Push the branch**

Run `git push origin dev/shared-texture-poc` and verify local HEAD equals `origin/dev/shared-texture-poc`.

- [ ] **Step 2: Trigger the build**

Run `gh workflow run build.yml --ref dev/shared-texture-poc`, identify the new run, and verify its `headSha` equals the dependency commit SHA.

- [ ] **Step 3: Monitor Windows x64**

Require `build-windows (x64)` to pass its SDK rebuild, Direct NT Handle contract, Shared Texture Runtime, Example build, and artifact upload steps.

- [ ] **Step 4: Download and test the artifact**

Download exactly `AgoraRtcNgExample-win-x64-<run_id>` into `/tmp/electron-sdk-csd-79409-<run_id>/`. Run integrity checks on the downloaded artifact archive and the contained `Agora-Electron-API-Example-*-win.zip`. Require these exact application entries: `resources/extraResources/sharedTextureScene.html`, `resources/extraResources/sharedTextureSceneWorker.js`, and the packaged `agora_node_ext.node` path discovered from the ZIP listing.

- [ ] **Step 5: Prove Native SDK provenance**

Create `/tmp/verify-csd-79409-artifact.js` and run it with the application ZIP and `/tmp/csd-79409-native-sdk/manifest.json`. The script must locate packaged Native DLL/EXE files, normalize them by basename, and compare the complete set against the JSON manifest. It must exit nonzero for missing or unexpected entries, duplicate basenames, size mismatch, or SHA-256 mismatch.

- [ ] **Step 6: Report delivery evidence**

Report the dependency commit, run URL, artifact name/link, input archive SHA-256 and size, Native manifest result, and the remaining requirement for real Windows cadence/device-loss soak testing.

## Failure Boundary

- If any Task 1 or Task 2 validation fails, stop without committing or pushing the dependency update.
- After pushing, if Actions provenance, the Windows build, artifact integrity, or Native provenance fails, do not deliver the package. Fix or revert the dependency commit, then rerun Tasks 1 through 3 before delivery.
