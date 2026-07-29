# Shared Texture PoC Advanced Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `SharedTexturePoc` with the existing Advanced example layout and Settings flow while preserving main-process RTC and texture ownership.

**Architecture:** The renderer uses the same screen/content/right-bar structure and channel join interaction as `BaseComponent`, but remains a thin IPC client. A small renderer model reads live shared `Config` values at join time. The main controller gains explicit cancellation for a join that is still starting so route unmount cannot strand a Promise or native resources.

**Tech Stack:** React 18, TypeScript, Electron IPC, existing Agora UI components/styles, Jest, JavaScript main-process controller.

---

## File Map

- `example/src/main/sharedTexturePocController.js`: own and cancel the pending join wait; keep cleanup idempotent.
- `example/src/main/__tests__/sharedTexturePocController.test.js`: prove concurrent start/stop settles and cleans exactly once.
- `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.ts`: build a start request from live Settings `Config` plus a temporary channel.
- `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts`: prove live Config and temporary channel behavior.
- `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx`: reproduce the Advanced shell and join lifecycle without creating an RTC engine.
- `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.test.tsx`: exercise UI state and unmount stop behavior with mocked IPC.

### Task 1: Cancel a controller that is still joining

**Files:**
- Modify: `example/src/main/sharedTexturePocController.js`
- Test: `example/src/main/__tests__/sharedTexturePocController.test.js`

- [ ] **Step 1: Write the failing cancellation regression**

Add a test that starts without firing `onJoinChannelSuccess`, calls `stop()`, and
asserts with `Promise.allSettled` that both operations settle, the start rejects
with a cancellation error, `engine.release`, `window.destroy`, and any texture
release each occur exactly once, and no extra cleanup happens.

- [ ] **Step 2: Run the focused controller test and verify RED**

Run:

```bash
yarn jest example/src/main/__tests__/sharedTexturePocController.test.js --runInBand
```

Expected: FAIL because the pending `start()` does not settle after `stop()`.

- [ ] **Step 3: Implement minimal pending-join cancellation**

Store a controller-owned reject callback for the active join wait. `stop()` invokes
it once when state is `starting`, then drains and cleans up. Clear the callback when
the join wait settles. Keep `cleanup()` idempotent so `start()`'s catch and `stop()`
cannot release the same engine/window twice.

- [ ] **Step 4: Run controller tests and verify GREEN**

Run the Step 2 command. Expected: all controller tests pass with no unhandled
rejection warning.

- [ ] **Step 5: Commit**

```bash
git add example/src/main/sharedTexturePocController.js example/src/main/__tests__/sharedTexturePocController.test.js
git commit -m "fix(example): cancel pending shared texture joins"
```

### Task 2: Build requests from Settings and a temporary channel

**Files:**
- Modify: `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.ts`
- Test: `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts`

- [ ] **Step 1: Write failing live-Config tests**

Replace the module-load snapshot assertion with tests that mutate `Config` after
module import, call `createSharedTexturePocConfig(channelId)`, and expect the newest
`appId`, `token`, and `uid` plus the supplied temporary channel. Retain IPC channel
mapping tests for start and stop.

- [ ] **Step 2: Run the model test and verify RED**

```bash
yarn jest example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts --runInBand
```

Expected: FAIL because the model currently exports a stale object and accepts a
complete duplicated form config.

- [ ] **Step 3: Implement the request builder**

Export `getInitialSharedTextureChannel()` and
`createSharedTexturePocConfig(channelId)`. Read `Config.channelId` only for the
initial page value; read `Config.appId`, `Config.token`, and `Config.uid` inside the
request builder. Keep `startSharedTexturePoc` and `stopSharedTexturePoc` as IPC-only
functions.

- [ ] **Step 4: Run the model test and verify GREEN**

Run the Step 2 command. Expected: all model tests pass.

- [ ] **Step 5: Commit**

```bash
git add example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.ts example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts
git commit -m "refactor(example): reuse Settings for shared texture PoC"
```

### Task 3: Align the renderer with the Advanced page shell

**Files:**
- Modify: `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx`
- Create: `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.test.tsx`

- [ ] **Step 1: Write failing component tests**

Render the component with mocked `ipcRenderer.invoke`. Assert it contains only the
channel input, uses `join Channel` / `leave Channel`, disables actions during
`joining` and `leaving`, submits live Settings values plus the edited channel,
restores `idle` after start failure, restores `joined` after stop failure, and calls
stop on unmount while joining or joined. Assert no renderer RTC engine factory is
imported or called.

- [ ] **Step 2: Run component tests and verify RED**

```bash
yarn jest example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.test.tsx --runInBand
```

Expected: FAIL because the current component renders four custom inputs and has only
idle/running state.

- [ ] **Step 3: Implement the standard shell and lifecycle**

Use `AgoraStyle.screen`, `AgoraStyle.content`, `AgoraStyle.rightBar`,
`LeftOutlined`, `AgoraDivider`, `AgoraTextInput`, and `AgoraButton`, following
`BaseComponent.render` and `renderChannel`. Keep state local to the component and
invoke only the model IPC functions. Add an unmount effect that requests stop when
the latest lifecycle state is not `idle`.

- [ ] **Step 4: Run component and focused example tests**

```bash
yarn jest example/src/renderer/examples/advanced/SharedTexturePoc example/src/main/__tests__/sharedTexturePocController.test.js example/src/main/__tests__/sharedTexturePocIpc.test.js --runInBand
```

Expected: all focused suites pass.

- [ ] **Step 5: Commit**

```bash
git add example/src/renderer/examples/advanced/SharedTexturePoc
git commit -m "feat(example): align shared texture PoC with Advanced pages"
```

### Task 4: Final verification and handoff

**Files:**
- Inspect: all files changed by Tasks 1-3

- [ ] **Step 1: Run source and focused Jest suites**

```bash
yarn jest ts/__tests__ --runInBand --testPathIgnorePatterns=/build/
yarn jest example/src/renderer/examples/advanced/SharedTexturePoc example/src/main/__tests__/sharedTexturePocController.test.js example/src/main/__tests__/sharedTexturePocIpc.test.js --runInBand
```

- [ ] **Step 2: Run typecheck and example compile**

```bash
yarn typecheck
yarn --cwd example compile
```

- [ ] **Step 3: Inspect repository scope**

```bash
git diff --check
git status --short
git log --oneline origin/codex/shared-texture-poc..HEAD
```

Expected: no generated artifacts staged, only the intentional local brainstorming
directory remains untracked, and all commands exit zero.

- [ ] **Step 4: Push the branch**

```bash
git push origin codex/shared-texture-poc
```
