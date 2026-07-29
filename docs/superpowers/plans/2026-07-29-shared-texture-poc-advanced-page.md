# Shared Texture PoC Advanced Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `SharedTexturePoc` with the existing Advanced example layout and Settings flow while preserving main-process RTC and texture ownership.

**Architecture:** The renderer uses the same screen/content/right-bar structure and channel join interaction as `BaseComponent`, but remains a thin IPC client. A small renderer model reads live shared `Config` values at join time. The main controller gains explicit cancellation for a join that is still starting so route unmount cannot strand a Promise or native resources.

**Tech Stack:** React 18, TypeScript, Electron IPC, existing Agora UI components/styles, Jest, JavaScript main-process controller.

---

## File Map

- `example/src/main/sharedTexturePocController.js`: own and cancel the pending join wait; keep cleanup idempotent.
- `example/src/main/__tests__/sharedTexturePocController.test.js`: prove concurrent start/stop settles and cleans exactly once.
- `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.ts`: build a start request from live Settings `Config` plus a temporary channel and own the pure lifecycle transition rules.
- `example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts`: prove live Config, temporary channel, lifecycle transitions, and unmount-stop decisions without adding React test infrastructure.
- `example/src/renderer/examples/advanced/SharedTexturePoc/SharedTexturePoc.tsx`: reproduce the Advanced shell and join lifecycle without creating an RTC engine.

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
`appId`, `token`, and `uid` plus the supplied temporary channel. Add pure transition
tests for `idle -> joining -> joined -> leaving -> idle`, start failure to `idle`,
stop failure to `joined`, and `shouldStopOnUnmount` returning true only for active or
pending states. Retain IPC channel mapping tests for start and stop.

- [ ] **Step 2: Run the model test and verify RED**

```bash
yarn jest example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts --runInBand
```

Expected: FAIL because the model currently exports a stale object and accepts a
complete duplicated form config.

- [ ] **Step 3: Implement the request builder**

Export `getInitialSharedTextureChannel()`,
`createSharedTexturePocConfig(channelId)`, the lifecycle transition helpers, and
`shouldStopOnUnmount(state)`. Read `Config.channelId` only for the initial page value;
read `Config.appId`, `Config.token`, and `Config.uid` inside the request builder. Keep
`startSharedTexturePoc` and `stopSharedTexturePoc` as IPC-only functions.

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

- [ ] **Step 1: Extend the failing model test with component-facing behavior**

Before changing TSX, add model assertions that the button title is `join Channel` for
idle and `leave Channel` for joined, pending states disable the action, and ordinary
state transitions alone never request unmount cleanup. This keeps behavioral logic
testable with the repository's existing TypeScript Jest transform; the repository has
no TSX renderer or jsdom setup, so do not add a new test stack for this narrow page.

- [ ] **Step 2: Run the model test and verify RED**

```bash
yarn jest example/src/renderer/examples/advanced/SharedTexturePoc/sharedTexturePocModel.test.ts --runInBand
```

Expected: FAIL because the lifecycle presentation helpers do not exist.

- [ ] **Step 3: Implement the standard shell and lifecycle**

Use `AgoraStyle.screen`, `AgoraStyle.content`, `AgoraStyle.rightBar`,
`LeftOutlined`, `AgoraDivider`, `AgoraTextInput`, and `AgoraButton`, following
`BaseComponent.render` and `renderChannel`. Keep state local to the component and
invoke only the model IPC functions. Maintain the latest lifecycle state in a ref.
Install exactly one empty-dependency unmount effect (`useEffect(..., [])`) whose
cleanup consults that ref and calls stop only when `shouldStopOnUnmount` is true.
Normal lifecycle state transitions must not run effect cleanup. The example compile
is the structural verification for the TSX mapping.

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
