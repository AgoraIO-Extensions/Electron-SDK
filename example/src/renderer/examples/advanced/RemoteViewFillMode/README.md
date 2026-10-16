# Remote View Fill (Stretch) Render Mode in Electron

The [`Advanced -> RemoteViewFillMode`](./RemoteViewFillMode.tsx) example makes
remote videos stretch to completely fill their view, with no letterbox bars and
no cropping, at the cost of distorting the picture when the view and the video
have different aspect ratios. It is driven by a private parameter, there is no
public API change. The App ID comes from the example's Settings page; the
channel can be changed on the example page.

Built-in render modes cannot do this: `RenderModeHidden` fills the view by
cropping the long edge, `RenderModeFit` keeps the whole picture by adding bars.
This mode keeps the whole picture _and_ fills the view.

## Private Parameter

| Item       | Value                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| key        | `rtc.video.render.remote_view_fill_enable_uids`                                                                                         |
| scope      | Engine level, written with `RtcEngine.setParameters`                                                                                    |
| type       | string                                                                                                                                  |
| values     | `""` off (default) / `"*"` every remote user / `"11,12"` the listed uids                                                                |
| applies to | **Remote views only.** Local preview is never affected                                                                                  |
| priority   | **The parameter wins over the requested render mode.** While it is on, both `RenderModeHidden` and `RenderModeFit` still render as fill |

```ts
// turn it on for every remote user
engine.setParameters(
  JSON.stringify({ 'rtc.video.render.remote_view_fill_enable_uids': '*' })
);
// only for two remote users
engine.setParameters(
  JSON.stringify({ 'rtc.video.render.remote_view_fill_enable_uids': '11,12' })
);
// turn it off
engine.setParameters(
  JSON.stringify({ 'rtc.video.render.remote_view_fill_enable_uids': '' })
);
```

Matching looks at the uid only, there is no channel dimension. With
`joinChannelEx` the same uid can exist in more than one channel, and setting
`"11"` stretches uid 11 in **every** channel.

Do not write spaces when the value has to stay consistent with Android. Electron
trims each item, so `" 11 , 12"` matches both, while the Android native parser
does not trim the last item and would miss `12`.

## Behavior To Expect

**It takes effect immediately.** `callIrisApi` intercepts `setParameters` and
refreshes every renderer, so views that are already rendering switch over on the
spot. Rebinding the view or calling `setupRemoteVideo` again is not needed. This
differs from Android, where the parameter is read on the next
`setupRemoteVideo` / `setRemoteRenderMode` or when the remote track is
subscribed.

**It survives the engine.** The parsed value lives in a module level variable,
not on the engine instance, so it is kept across `leaveChannel` and even
`release`. The only way to clear it is to send an empty value. Android behaves
the opposite way and drops the parameter when the engine is destroyed.

**It does not fight mirror.** Fill writes `canvas.style.transform`, mirror
writes `parentElement.style.transform`. They are different elements and both
apply.

Two pre-existing behaviors show up on this page and are **not** caused by this
feature, so do not report them against it:

- Setting `mirrorMode` to `VideoMirrorModeAuto` reads back as `Disabled`.
  `RendererManager.presetRendererContext` does
  `context.mirrorMode = context.mirrorMode || this.defaultMirrorMode`, and
  `Auto` is `0`, which is falsy. There is no visible difference because the
  renderer only mirrors on `Enabled`.
- `RenderModeAdaptive` renders the same as `RenderModeFit`. The renderer only
  branches on `Hidden`, everything else takes the fit path.

## How To Judge The Result

Looking at the picture is not enough, so the page has a **read actual
transform** button that prints what every renderer wrote to its canvas.

Fill and the proportional modes express themselves differently, so the readout
prints both properties:

- **`objectFit=fill`** means fill is on. Fill gives the container box to the
  canvas, so it also prints `cssSize=100%x100%` and an empty transform. There is
  no scale factor to read, because the browser does the scaling.
- **A single value `scale(x)` with `objectFit=(none)`** means a proportional
  mode ran, so fill is off. That value should equal `container` divided by
  `canvas` on the axis the mode fits to. Use the printed `container=` and
  `canvas=` sizes as the baseline, not the nominal ratio of the tile.
- **A two value `scale(a, b)`** is reported as `FILL (legacy two value scale)`.
  That is how fill used to be expressed, so an older build of the SDK still
  reads back that way. Whether the two values are equal only tells you if the
  distortion is visible, never whether fill is on.

Why fill stopped using a transform: a bitmap sized layout box gets centred by
the flex container at `(clientHeight - canvasHeight) / 2`, which is half a pixel
whenever that difference is odd. The layer is rasterised on that half pixel
grid, so after the transform and the clip the top row ends up only half covered
and blends with the black behind it, which reads as a one pixel dark line along
the top edge. It only shows at a device pixel ratio of 1. Owning the container
box puts the layout box at an integer offset and removes the transform. See
NMS-31709.

Fill and the built-in modes only look different when the view and the video have
different aspect ratios, so the page lets you switch the remote tile between
`16:9`, `4:3`, `21:9` and `1:1`. The default is `21:9`, which is the most
obvious with a normal 16:9 camera. The local tile is fixed at `1:1` as the
control group: the parameter must never stretch it.

**Remote tiles start at `RenderModeFit`, which is not the SDK default.** The SDK
default is `RenderModeHidden`, in Electron and in native alike:
`RendererManager` hardcodes `defaultRenderMode` to Hidden, and
`presetRendererContext` fills it in whenever a canvas carries no `renderMode`.
This page puts the dropdown value into the canvas instead, so what the dropdown
shows is what the renderer received.

Fit is chosen as the starting point because **Hidden already fills the view**, by
cropping the long edge. Starting from Hidden would make fill look like it
changed nothing, since both end up filled with no bars and only differ in
cropped-content versus distorted-content. Fit letterboxes, so turning fill on
visibly removes the bars.

The local tile deliberately keeps the SDK defaults and is left out of both
dropdowns: it is the control group, and the parameter only matches remote views.

## How The Render Mode Reaches The Renderer

Nothing here ever rebinds a view to change a render attribute, because rebinding
blanks the picture: unmounting pulls the last renderer out of its cache, which
stops and releases it, and the canvas the remount creates stays `display: none`
until the next frame lands. At the default 15 fps render loop that is a visible
black flash.

- **The dropdowns push through `setRemoteRenderMode`.** It resolves the renderer
  cache by key and calls `setContext` on the renderers already in it, so
  `updateRenderMode` / `updateMirrorMode` only rewrite the canvas transform and
  the parent's `rotateY`. The live renderer is updated in place. The same button
  is also exposed on its own, since this is the call an integrator uses on a view
  that is already rendering and the path the private parameter must win over.
- **The canvas still carries `renderMode` and `mirrorMode`,** but only so that
  binds start from what the UI shows. It matters for a remote user who joins
  after a dropdown was changed, and it keeps `renderMode` alive across
  `RtcSurfaceView`'s own click-to-mirror toggle, whose `updateRenderer` re-sends
  the canvas and would otherwise let `presetRendererContext` fall back to
  `defaultRenderMode`. The tile is keyed on uid alone so a dropdown change never
  becomes an unmount plus mount.
- **The push runs in the `setState` callback** rather than inline. React commits
  a child's `componentDidUpdate` before the parent's `setState` callback, so the
  push lands after `RtcSurfaceView.updateRenderer` has re-sent the canvas. That
  ordering matters: `updateRenderer` substitutes its own `isMirror` flag for
  `mirrorMode`, and the flag is derived once in the constructor as
  `canvas.mirrorMode === Disabled`, so it is inverted. Pushing last overrides it.

Changing the container shape does not rebind either: the size lives on a wrapper
element this page owns, and `updateRenderMode` recomputes the transform every
frame from `container.clientWidth/clientHeight`. Note that _every frame_ is also
the only time it recomputes — there is no `ResizeObserver` on the container — so
a shape change renders with the previous transform until the next frame, which
shows up as a short flash of bars at 15 fps. That is renderer behaviour, not
something this page controls.

## Suggested Checks

Join with at least one remote user publishing video.

| Check                       | Action                                                                   | Expected                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default off                 | Join without touching the parameter                                      | Every tile reports `objectFit=(none)` and a single value `scale(x)`                                                                                                                                                                                                                                                              |
| Every remote user           | `enable all (*)`                                                         | Each remote tile reports `objectFit=fill`, local stays `objectFit=(none)` with a single value scale                                                                                                                                                                                                                              |
| Specific uid                | Pick a uid, `append uid`, `apply fill uids`                              | Only that uid stretches, the others fall back                                                                                                                                                                                                                                                                                    |
| Takes effect live           | With a remote already rendering, press `enable all (*)`                  | It switches on the spot, no rebinding                                                                                                                                                                                                                                                                                            |
| Turns off live              | `disable ("")`                                                           | It goes back to the requested render mode on the spot                                                                                                                                                                                                                                                                            |
| Parameter wins              | While fill is on, switch `renderMode` between Hidden and Fit             | The picture does not change                                                                                                                                                                                                                                                                                                      |
| Parameter wins over the API | While fill is on, press `push renderMode/mirror via setRemoteRenderMode` | The picture does not change. This goes through the call an integrator uses on a view that is already rendering, which is the path the parameter has to override                                                                                                                                                                  |
| Mirror coexists             | While fill is on, switch `mirrorMode` to Enabled                         | It mirrors and the two scale values stay the same                                                                                                                                                                                                                                                                                |
| View ratios                 | Switch the remote container shape through all four values                | Every shape fills, and each axis matches `container / canvas`                                                                                                                                                                                                                                                                    |
| Bad input                   | Apply `99999`, `&#@`, `,`, `abc`                                         | Nothing stretches, nothing else breaks, no crash                                                                                                                                                                                                                                                                                 |
| Equal ratios                | Set the shape to match the remote video ratio                            | Still `objectFit=fill`; there is no scale factor to compare, which is the point of not judging by numbers                                                                                                                                                                                                                        |
| Remote rejoins              | Have the remote leave and come back                                      | It is still stretched without resending the parameter                                                                                                                                                                                                                                                                            |
| No rebind on mode change    | Switch `renderMode` back and forth between Fit and Hidden                | The picture changes mode without blanking. A black flash would mean the view is being rebound instead of updated in place                                                                                                                                                                                                        |
| Late joiner picks up the UI | Change `renderMode`, then have another remote user join                  | The new tile comes up on the mode the dropdown shows, not on Hidden                                                                                                                                                                                                                                                              |
| Leave and rejoin            | `leave Channel`, then `join Channel` again                               | The channel name and every selection survive, `applied` still shows the same value, and the remote comes back stretched without the parameter being sent again. The Electron side keeps it in a module level variable, so leaving does not clear it. This differs from Android, where it is cleared when the engine is destroyed |

## Run The Example

Set the App ID in Settings, then open `Advanced -> RemoteViewFillMode`. Join
with at least one remote user publishing video, otherwise there is nothing to
stretch.

The packaged example produced by the build job already carries this feature:
running bare `yarn` at the repository root goes through `scripts/bootstrap.js`,
which builds this checkout and runs `yarn example link agora-electron-sdk`, so
the example resolves `agora-electron-sdk` to the local build rather than to the
version pinned in `example/package.json`. Locally the same applies:

```bash
yarn                      # at the repository root, builds and links this checkout
yarn --cwd example start
```

**The pinned version only matters if the example is installed on its own.** A
standalone `yarn --cwd example install` pulls the published package, which does
not contain this feature, and then the parameter is silently inert and the page
keeps printing single value scales. That is indistinguishable from a broken
feature, so confirm the SDK actually carries it before trusting a negative
result:

```bash
ls example/node_modules/agora-electron-sdk/js/Private/internal/FillRenderMode.js
```

If the file is missing, either link this checkout as above or overlay the four
changed files, which is the path to use on a machine without a build toolchain:

```bash
yarn buildJS
cd example
for f in js/Private/internal/FillRenderMode.js \
         js/Private/internal/IrisApiEngine.js \
         js/Renderer/IRenderer.js \
         js/Renderer/RendererManager.js; do
  cp "../$f" "node_modules/agora-electron-sdk/$f"
done
yarn start
```

A TypeScript build alone does not validate rendering. The picture and the
transform readout have to be checked on a real run with a remote publisher.
