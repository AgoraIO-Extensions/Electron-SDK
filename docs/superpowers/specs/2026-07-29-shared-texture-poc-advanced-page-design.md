# Shared Texture PoC Advanced Page Alignment

## Goal

Make `SharedTexturePoc` behave and look like the existing Advanced examples
without creating a renderer-process RTC engine or duplicating Settings fields.

## Existing Pattern

Settings mutates the shared `Config` object with `appId`, `token`, `channelId`,
and `uid`. Advanced examples copy those values when their page instance is
created. Their standard layout uses `AgoraStyle.screen`, a content area, and a
collapsible `AgoraStyle.rightBar`. The right bar exposes a temporary channel
input and a `join Channel` / `leave Channel` action.

The PoC cannot inherit `BaseComponent`: its `componentDidMount` creates an RTC
engine in the renderer, while Electron shared textures and the PoC RTC engine
must remain owned by the main process.

## Design

`SharedTexturePoc` will reproduce the narrow Advanced page shell with the same
UI components and style classes, but it will continue to communicate only with
the main-process controller over IPC.

At component creation, the page copies only `Config.channelId` into editable page
state. Editing it is temporary and does not mutate Settings or `Config`.

When the user presses `join Channel`, the page reads `appId`, `token`, and `uid`
from the current shared `Config`, combines them with the page's temporary
`channelId`, and invokes `SHARED_TEXTURE_POC_START`. Reading the shared values at
join time prevents a stale module-load snapshot if Settings was saved after the
module was imported. While joined, the channel input is disabled and the button
becomes `leave Channel`; leave invokes `SHARED_TEXTURE_POC_STOP`.

The content area reports the PoC state and errors using existing example UI
components. It does not expose App ID, token, or UID inputs and does not create
an RTC engine. The existing main-process controller remains the sole owner of
the offscreen window, RTC engine, native submissions, and texture releases.

On unmount, the page requests stop if a join or start is active. The controller
will explicitly support cancellation while `start()` is awaiting the RTC join
callback: `stop()` rejects the pending join wait with a cancellation error,
drains any texture submission, and performs idempotent cleanup. The pending
`start()` must settle rather than waiting indefinitely. The controller remains
the authoritative cleanup boundary.

## Error Handling

IPC validation remains in the main process. Renderer state is one of `idle`,
`joining`, `joined`, or `leaving`, and duplicate clicks are disabled while an IPC
request is pending. A start failure returns the page to `idle`. A stop failure
returns it to `joined` so the user can retry, while displaying the error; the UI
does not claim that main-process resources were released without a successful
stop response.

## Tests

Focused renderer tests will prove that:

- join reads App ID, token, and UID from the current shared Settings `Config`;
- a temporary channel edit overrides only the submitted channel;
- the page model maps join and leave to the existing IPC channels;
- active or pending work requests stop during unmount.
- stopping the controller during `starting` settles both operations and performs
  cleanup without leaving a pending join promise.

Existing IPC behavior remains unchanged. Focused controller tests will cover the
new cancellation path. The final verification will run the focused example
suites, source Jest suite, TypeScript typecheck, example compile, and
`git diff --check`.
