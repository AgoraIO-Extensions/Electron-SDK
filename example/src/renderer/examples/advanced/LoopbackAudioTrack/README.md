# Loopback Audio Tracks in Electron

[Advanced -> LoopbackAudioTrack](./LoopbackAudioTrack.tsx) demonstrates independent
loopback audio tracks on Windows and macOS: source selection, capture control,
channel publication, publish volume, and concurrent per-track level indications.
The page shows audio tracks on the left and channel/creation controls on the right.

## Run the Example

With the example dependencies installed, run from the repository root:

```sh
cd example
npm run start
```

Use an installed or locally linked Electron SDK package that includes this branch's
loopback APIs and matching Native/Iris libraries. See the [example setup guide](../../../../../README.md)
for installation and local SDK linking.

1. Open Setting, enter the App ID, channel ID, token if required, and UID, then Save.
2. Open Advanced -> LoopbackAudioTrack. The channel ID remains editable on this page;
   App ID, token, and UID come from the shared [configuration](../../../config/agora.config.ts).
3. Choose a Type, configure its target, and select the creation options below.
4. Create tracks before or after joining a channel. Use the per-track controls or
   Publish All / Unpublish All to change publication.

## Capture Configuration

| Type                      | Target and options                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| System audio              | Capture system audio. Optional Excluded applications and Excluded PIDs remain expanded and accept comma-separated values. |
| System excluding this app | Exclude this application automatically. Additional exclusion inputs are disabled in this demo.                            |
| Application name          | Select a source or enter Application name directly. Wait for application audio is checked by default.                     |
| Process ID                | Select a source PID or enter a positive integer from 1 to 4294967294 directly.                                            |

Application and process modes show a scrollable source list. Refresh calls
`getLoopbackRecordingSources` with the selected Audio output and Running apps
flags. Application names and PIDs are capture targets; a window title is display
text. A source with multiple PIDs produces a selectable entry for each PID in
Process ID mode. The text/numeric target field is always available in its mode.
Use the exact application name, including case and any executable extension.

Initial publish volume defaults to 100; the range is 0-400, where 0 mutes the
track's published audio. Configuration edits apply to newly created tracks.
To change an existing track's type, target, exclusions, or waiting policy,
destroy it and create another track.

### Creation Options

Both options above Create track are checked by default:

- **Auto-start capture:** Create the track disabled, register its observer, then
  start capture. Uncheck to leave it in Created · Not started until Start capture.
- **Publish on creation:** Publish the new track only when already in a channel
  and not leaving. Otherwise skip publication; joining later does not publish
  skipped tracks automatically.

These options are independent: a track can capture outside a channel, or be
published while capture is paused. Observer-registration failure prevents
automatic capture. Failure to enable level indications reports an error but does
not prevent capture once the observer is registered.

## Track and Channel Controls

- **Start / Pause / Resume capture** controls capture and target waiting while
  retaining the track ID, observer, and publication setting. The capture label
  follows `onAudioTrackStateChanged`; it can show capturing, waiting, stopped,
  or failed. Capture controls are disabled for a failed track; destroy and recreate
  it to make another attempt in this demo.
- **Publish / Unpublish** changes one track's publication. Publish All includes
  every current track; when all are published, the button becomes Unpublish All.
  Status labels are Published / Not published, with a Published count above the
  list. Remote audio reception must be checked on a receiving client.
- **Publish volume** changes one track's gain without changing capture or
  publication. Capture, publication, and volume remain independent.
- **Level interval** defaults to 100 ms and applies to every registered track.
  Set it to 0 to stop level indications while retaining capture-state observation.
- **Destroy** unpublishes the track if needed, stops capture if enabled, disables
  level indications, unregisters its observer, then destroys the track. A failed
  unpublish, capture-stop, unregister, or destroy call leaves the track visible.

Joining uses the shared UID and starts without publishing microphone, camera,
or loopback tracks; remote audio subscription is also disabled in this demo.
Joining does not publish existing tracks. Leaving clears their publication flags
while retaining the local tracks and their capture settings. The page releases
its tracks, observer registrations, and engine when unmounted.

## SDK Calls

The page initializes the RTC engine, obtains `mediaEngine` with
`getMediaEngine()`, registers channel callbacks, and enables audio before use.

| Operation                                  | API                                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Join channel                               | `engine.joinChannel(token, channelId, uid, options)`                                            |
| Leave channel                              | `engine.leaveChannel()`                                                                         |
| Enumerate sources                          | `engine.getLoopbackRecordingSources({ flags })`                                                 |
| Create without capture                     | `mediaEngine.createLoopbackAudioTrack(config, false)`                                           |
| Register capture-state and level callbacks | `mediaEngine.registerAudioTrackObserver(trackId, observer)`                                     |
| Configure level interval                   | `mediaEngine.enableAudioTrackVolumeIndication(trackId, interval)`                               |
| Start / pause capture                      | `mediaEngine.enableLoopbackAudioTrack(trackId, enabled)`                                        |
| Publish / unpublish                        | `engine.updateChannelMediaOptions({ publishLoopbackAudioTrack, publishLoopbackAudioTrackIds })` |
| Set publish volume                         | `mediaEngine.adjustLoopbackAudioPublishVolume(trackId, volume)`                                 |
| Unregister callbacks                       | `mediaEngine.unregisterAudioTrackObserver(trackId, observer)`                                   |
| Destroy                                    | `mediaEngine.destroyLoopbackAudioTrack(trackId)`                                                |

Creation returns a track ID; 0 is valid and `0xffffffff` indicates failure. The
demo also rejects negative or non-integer IDs. The other listed operations that
return a numeric status use 0 for success; source enumeration returns an array.
Omitting the second argument to `createLoopbackAudioTrack` requests capture
immediately. This demo explicitly passes `false` so observation is registered
before capture starts.

### Publication IDs

After `onJoinChannelSuccess`, publish explicit track IDs with both fields in the
same options object:

```ts
const ids = [trackIdA, trackIdB];
engine.updateChannelMediaOptions({
  publishLoopbackAudioTrack: true,
  publishLoopbackAudioTrackIds: {
    trackIds: ids,
    trackCount: ids.length,
  },
});
```

Use `false` with the same ID list to unpublish. A single track uses a one-element
list. The demo does not send an empty list or rely on it to mean all tracks.
Exclusion arrays likewise include their corresponding counts:
`excludedAppNames` / `excludedAppCount` and
`excludedProcessIds` / `excludedProcessCount`.

### Observation and Levels

The demo registers the same `IAudioTrackObserver` separately for every track and
routes both callbacks by `trackId`. Multiple tracks are observed concurrently;
unregistering one does not affect the others. Keep the same observer object
until the corresponding unregistration returns successfully.

`onAudioTrackVolumeIndication` receives an Electron snapshot of
`AudioTrackVolumeInfo`. Read only the first `channelCount` entries in `levels`,
up to 8. Levels are in the range 0-255; mono uses only the first entry and unused
entries may be -1. The page displays valid channel levels and clears the meters
when capture is paused, waiting, stopped, or failed.

Positive indication intervals round up to a multiple of 50 ms; for example,
75 becomes 100. The SDK disables indications at intervals of 0 or less; the
page accepts non-negative integers. Interval updates are applied per track;
if one fails, that track retains its previous effective interval.

## Platform and Compatibility Notes

- Capture requires a supported OS, SDK capture backend, and applicable platform
  permissions. Application-name waiting is supported on Windows and macOS 14.2+
  with CATap; it is ignored for other capture types/backends, including SCK.
- Exclusion support differs by platform. On Windows, only the first PID takes
  effect when a PID list is provided; otherwise only the first application name
  takes effect. macOS supports multiple exclusions. The demo forwards the entered
  lists and counts rather than normalizing these platform differences.
- The page does not expose virtual-device selection. Its loopback APIs operate on
  tracks created by `createLoopbackAudioTrack`, not custom PCM tracks.
- `enableLoopbackRecording` and `enableLoopbackRecordingEx` are deprecated.
  `updateLoopbackAudioTrackConfig` and the single-ID `publishLoopbackAudioTrackId`
  field are removed; use the per-track volume API and the explicit ID-list field.
