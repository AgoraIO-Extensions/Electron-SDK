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

- A **two value** `scale(a, b)` is only written by the fill branch, so it means
  fill is on.
- A **single value** `scale(x)` means the proportional branch ran, so fill is
  off.
- Whether the two values are **equal** only tells you if the distortion is
  visible. When the view and the video have the same aspect ratio, fill is on
  and still produces something like `scale(2.15, 2.15)`. **Do not judge by the
  two numbers being different.**

Each printed value should equal `container` divided by `canvas` on the matching
axis. Use the printed `container=` and `canvas=` sizes as the baseline, not the
nominal ratio of the tile.

Fill and the built-in modes only look different when the view and the video have
different aspect ratios, so the page lets you switch the remote tile between
`16:9`, `4:3`, `21:9` and `1:1`. The default is `21:9`, which is the most
obvious with a normal 16:9 camera. The local tile is fixed at `1:1` as the
control group: the parameter must never stretch it.

## Suggested Checks

Join with at least one remote user publishing video.

| Check             | Action                                                       | Expected                                                             |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| Default off       | Join without touching the parameter                          | Every tile is a single value `scale(x)`                              |
| Every remote user | `enable all (*)`                                             | Each remote tile becomes a two value scale, local stays single value |
| Specific uid      | Pick a uid, `append uid`, `apply fill uids`                  | Only that uid stretches, the others fall back                        |
| Takes effect live | With a remote already rendering, press `enable all (*)`      | It switches on the spot, no rebinding                                |
| Turns off live    | `disable ("")`                                               | It goes back to the requested render mode on the spot                |
| Parameter wins    | While fill is on, switch `renderMode` between Hidden and Fit | The picture does not change                                          |
| Mirror coexists   | While fill is on, switch `mirrorMode` to Enabled             | It mirrors and the two scale values stay the same                    |
| View ratios       | Switch the remote container shape through all four values    | Every shape fills, and each axis matches `container / canvas`        |
| Bad input         | Apply `99999`, `&#@`, `,`, `abc`                             | Nothing stretches, nothing else breaks, no crash                     |
| Equal ratios      | Set the shape to match the remote video ratio                | Still a two value scale, the two numbers are just equal              |
| Remote rejoins    | Have the remote leave and come back                          | It is still stretched without resending the parameter                |

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
