# CSD-79409 Windows Native SDK Package Update

## Goal

Build the shared-texture PoC Windows development package with the Native SDK supplied for CSD-79409.

## Scope

- Replace only `agora_electron.native_sdk_win` in the root `package.json`:
  - Old: `https://download.agora.io/sdk/release/Agora_Native_SDK_for_Windows_rel.v4.5.3.123_32922_FULL_20260728_1031_1227303.zip`
  - New: `https://download.agora.io/sdk/release/Agora_Native_SDK_for_Windows_rel.v3.0_jira_CSD_79409_release_4_5_3_123_20260803.32960_32960_FULL_20260803_1431_1236559.zip`
- Keep the Windows Iris package, macOS dependencies, download scripts, and shared-texture implementation unchanged.
- Use the existing `scripts/downloadPrebuild.js` and `scripts/synclib.js` dependency flow.

The implementation record must include the downloaded ZIP byte size and SHA-256. A checksum mismatch between validation and packaging invalidates the build.

## Archive Contract

The ZIP must contain exactly one top-level directory matching `*_Native_SDK_for_Windows_FULL`, with a non-empty `sdk/x86_64` directory. Define the expected Native runtime manifest as every non-empty `sdk/x86_64/*.dll` and `sdk/x86_64/*.exe` entry, recording each relative path, size, and SHA-256.

Both consumers must be validated independently:

- `scripts/downloadPrebuild.js` with `strip: 1` must see `sdk/x86_64/...`, match at least one DLL or EXE, and flatten every manifest entry into `build/Release`.
- `scripts/synclib.js` with `strip: 0` must preserve `<top-level>/sdk/x86_64/...` under `native`, so the `CMakeLists.txt` glob `native/*_Native_SDK_for_Windows_FULL/sdk/x86_64/*` resolves the complete manifest.

Missing directories, zero matched files, duplicate flattened names, or missing manifest entries are failures.

## Validation

1. Download the new URL with redirects enabled; record HTTP success, final size, and `shasum -a 256` output. Run `unzip -t` and derive the Native runtime manifest from `unzip -l`.
2. Create `/tmp/validate-csd-79409-layout.js` as a one-use Node script and run `node /tmp/validate-csd-79409-layout.js <zip>`. The script must use an archive parser to:

   - reject archives without exactly one `*_Native_SDK_for_Windows_FULL/` root;
   - build a non-empty manifest from non-empty `sdk/x86_64/*.dll|*.exe` entries;
   - reject duplicate manifest basenames before simulating the flattened `strip: 1` output;
   - extract to two `mkdtemp` directories using `strip: 1` and `strip: 0` respectively;
   - assert every manifest entry exists after each extraction, with the expected relative path, size, and SHA-256; and
   - exit nonzero on zero matches, missing files, duplicates, size mismatch, or hash mismatch.

   The temporary validation script and extraction directories must remain outside the repository and must not be committed.

3. Update `package.json`, assert `native_sdk_win` equals the approved URL, and run `git diff --check`. The implementation diff must contain only the single `package.json` URL replacement.
4. Run the complete focused suite below, expecting 7 suites and 54 tests to pass:

   ```bash
   yarn jest --runInBand --no-watchman \
     example/src/main/__tests__/sharedTexturePocController.test.js \
     example/src/main/__tests__/sharedTexturePocIpc.test.js \
     example/src/main/__tests__/sharedTexturePocTelemetry.test.js \
     example/src/main/__tests__/sharedTextureRuntime.test.js \
     example/src/main/__tests__/sharedTextureScene.test.js \
     example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePocView.test.tsx \
     example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts
   ```

5. Commit as `chore: update Windows Native SDK for CSD-79409` and run `git push origin dev/shared-texture-poc`.
6. Trigger `.github/workflows/build.yml` at ref `dev/shared-texture-poc`. Require the run `headSha` to equal the pushed commit SHA and `build-windows (x64)` to pass, including rebuild, Direct NT Handle contract, Shared Texture Runtime, Example build, and artifact upload.
7. Download `AgoraRtcNgExample-win-x64-<run_id>` and run a complete ZIP integrity check. Require `agora_node_ext.node`, `resources/extraResources/sharedTextureScene.html`, and `resources/extraResources/sharedTextureSceneWorker.js`.
8. Locate the packaged Native runtime DLL/EXE files and compare their names, sizes, and SHA-256 values against the input manifest. The delivered package is accepted only when every expected Native file matches, proving CSD-79409 provenance.

## Failure Handling

Do not commit or push the implementation if URL access, checksum consistency, archive integrity, layout simulation, local tests, or the single-line implementation-diff check fails.

After the verified commit is pushed, do not deliver the package if Actions provenance, build, artifact integrity, or Native file provenance fails. Fix or revert the dependency commit, then rerun the full validation and build before delivery.

If the archive layout is incompatible, do not modify the general download logic. Stop the URL-only change, document the exact structural difference, add an isolated compatibility test, and obtain approval for a separate implementation scope.
