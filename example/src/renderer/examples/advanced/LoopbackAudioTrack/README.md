# Loopback Audio Tracks in Electron

The [`Advanced -> LoopbackAudioTrack`](./LoopbackAudioTrack.tsx)
example creates independent loopback audio tracks in the Electron renderer,
publishes them to an Agora channel, adjusts each track's publish volume, and
shows per-channel publish volume indications. It uses the App ID from the
example's Settings page; the channel can be changed on the example page.

These APIs are currently supported on Windows and macOS. They operate on
loopback tracks created with `IMediaEngine.createLoopbackAudioTrack`, not custom
PCM audio tracks. The older `enableLoopbackRecording` and
`enableLoopbackRecordingEx` calls remain for compatibility but are deprecated.
`updateLoopbackAudioTrackConfig` and the single-ID
`publishLoopbackAudioTrackId` field are removed.

## Electron API

| API                                                               | Behavior                                                                                                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `mediaEngine.createLoopbackAudioTrack(config)`                    | Create a track; returns its ID, or `0xffffffff` on failure.                                                                                 |
| `mediaEngine.destroyLoopbackAudioTrack(trackId)`                  | Destroy that track after stopping indication and unregistering its observer.                                                                |
| `mediaEngine.adjustLoopbackAudioPublishVolume(trackId, volume)`   | Set that track's publish volume from 0 to 400 (100 is original volume).                                                                     |
| `mediaEngine.registerAudioTrackObserver(trackId, observer)`       | Register a per-track volume observer.                                                                                                       |
| `mediaEngine.unregisterAudioTrackObserver(trackId, observer)`     | Unregister using the same observer object; no callbacks for that track after it returns successfully.                                       |
| `mediaEngine.enableAudioTrackVolumeIndication(trackId, interval)` | Start or change the callback interval in milliseconds; a positive value rounds up to a multiple of 50, and `interval <= 0` stops callbacks. |
| `ChannelMediaOptions.publishLoopbackAudioTrackIds`                | Explicit list of track IDs to publish or unpublish, represented in Electron as `{ trackIds: number[], trackCount: number }`.                |

`LoopbackAudioTrackConfig` accepts `loopbackType`, an initial `volume` (0-400),
and source-specific `deviceName`, `appName`, or `processId`. On Windows,
`deviceName` is ignored. On macOS, it selects a virtual device for the system
loopback modes; application and process modes ignore it. `appName` must match
the target application exactly, including case.

## Publishing Lifecycle

Create tracks before joining, or create them in the channel and explicitly
publish each newly created ID with `updateChannelMediaOptions`. The ID list
never means "publish every created track". Both the boolean switch and the
list must be set in the same options object. Even one track uses a one-element
list. To unpublish, use the same list with the switch set to `false`.

```ts
import {
  ClientRoleType,
  IAudioTrackObserver,
  LoopbackAudioTrackType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';

const engine = createAgoraRtcEngine();
engine.initialize({ appId });
engine.enableAudio();
const mediaEngine = engine.getMediaEngine();

const trackId = mediaEngine.createLoopbackAudioTrack({
  loopbackType: LoopbackAudioTrackType.LoopbackSystem,
  volume: 100,
});
if (trackId < 0 || trackId === 0xffffffff) {
  throw new Error(`createLoopbackAudioTrack failed: ${trackId}`);
}

const observer: IAudioTrackObserver = {
  onAudioTrackVolumeIndication(id, volumeInfo) {
    const count = Math.min(volumeInfo.channelCount ?? 0, 8);
    console.log(id, volumeInfo.levels?.slice(0, count));
  },
};
mediaEngine.registerAudioTrackObserver(trackId, observer);
mediaEngine.enableAudioTrackVolumeIndication(trackId, 100);

engine.joinChannel(token, channelId, uid, {
  clientRoleType: ClientRoleType.ClientRoleBroadcaster,
  publishMicrophoneTrack: false,
  publishLoopbackAudioTrack: true,
  publishLoopbackAudioTrackIds: { trackIds: [trackId], trackCount: 1 },
});

mediaEngine.adjustLoopbackAudioPublishVolume(trackId, 150);

// When finished, stop publication and callbacks before destroying the track.
engine.updateChannelMediaOptions({
  publishLoopbackAudioTrack: false,
  publishLoopbackAudioTrackIds: { trackIds: [trackId], trackCount: 1 },
});
mediaEngine.enableAudioTrackVolumeIndication(trackId, 0);
mediaEngine.unregisterAudioTrackObserver(trackId, observer);
mediaEngine.destroyLoopbackAudioTrack(trackId);
engine.leaveChannel();
engine.release();
```

Check every returned status in production code; `0` indicates success for
volume, observer, indication, channel-update, and destroy operations. The
example page checks each result and keeps the track visible if an operation
fails.

## Volume Callback

`AudioTrackVolumeInfo.channelCount` is the number of valid entries in
`levels`, at most `MAX_AUDIO_CHANNELS` (currently 8). Each valid entry is a
publish-channel level in `[0, 255]`. For mono capture, only `levels[0]` is
valid; the unused second channel may be `-1`. Read only the first
`channelCount` values. Native's `volumeInfo` pointer exists only during its
callback; Electron receives a serialized snapshot, not that pointer.

The Native API allows an observer to be registered on multiple tracks, but
the Iris wrapper in this development package currently has one active
`IAudioTrackObserver` registration slot per media engine. The Electron example
publishes multiple tracks and monitors one at a time; it unregisters before
switching the monitored track. It retains the same observer object until
unregistration returns.

## Run The Example

Build and link this checkout's Electron SDK and start `example` using the
repository's normal `yarn`/`yarn --cwd example start` workflow. Set the App ID
in Settings, open `Advanced -> LoopbackAudioTrack`, create one or more tracks,
then join a channel. The page can publish/unpublish each track, change its
publish volume, switch the monitored track, and destroy tracks independently.
System audio capture may require OS permissions and a supported loopback
device. Verify the remote audio and channel-level indications on the target
Windows/macOS build; a TypeScript build alone does not validate capture.
