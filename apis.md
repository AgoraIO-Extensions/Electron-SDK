# Agora JavaScript SDK API Reference

The [`AgoraSDK.js`](js/AgoraSdk.js) file enables usage of the JavaScript Agora SDK API. The [`AgoraRender.js`](js/AgoraRender.js) and [`webgl-utils.js`](js/webgl-utils.js) files are used to render the video. You must include **all three** JavaScript files in your project.

The `AgoraRtcEngine` Class enables the SDK functionality. It also contains one event emitter, so the client can listen for events.

## Quick Start

### Create the `AgoraRtcEngine`

To create an `AgoraRtcEngine` instance:

1. Declare `AgoraRtcEngine` as a constant using the `AgoraSdk` library.

2. Create a new engine using `AgoraRtcEngine`:

	``` Javascript
	const AgoraRtcEngine = require("AgoraSdk");
	var engine = new AgoraRtcEngine();
	```

### App Initialization

Initialize the app using the Agora `appid` prior to invoking other API functions.

```
initialize(appid, onSuccess, onFailed)
```

Once the app is initialized, start adding Agora [API methods](#api-methods) or [event listeners](event-listeners).


## API Methods

- [General Methods](#general-methods)
- [Logging and Testing Methods](#logging-and-testing-methods)
- [Client, Channel, and Stream Methods](#client,-channel,-and-stream-methods)
- [Video Control Methods](#video-control-methods)
- [Video Stream Methods](#video-stream-methods)
- [Video Device Methods](#video-device-methods)
- [Video Source Methods](#video-source-methods)
- [Screen Capture Methods](#screen-capture-methods)
- [Audio Control Methods](#audio-control-methods)
- [Audio Recording Methods](#audio-recording-methods)
- [Audio Mixing Methods](#audio-mixing-methods)
- [Audio Playback Methods](#audio-playback-methods)

### General Methods

These methods handle general API communication with the Agora SDK.

Method|Description
----- | -----
`getVersion()`|Retrieve the current SDK version.
`getErrorDescription(errorCode)`|Retrieve the error code description.
`rate(callid, rating, desc)`|Rate the call.
`complain(callid, desc)`|Complain about the call.
`setEncryptionSecret(secret)`|Set the encryption as secret.
`getCallId()`|Retrieve the current call ID.
`subscribe(uid, view)`|Subscribe the user to the view (bind the user's video to the view), after a user with `uid` joins the channel.
	
### Logging and Testing Methods

These methods are used to set logging preferences and to test call connectivity.

Method|Description
----- | -----
`setLogFile(filepath)`|Set the file path for logging.
`setLogFilter(filter)`|Set a filter for logging.
`startEchoTest()`|Start the echo test.
`stopEchoTest()`|Stop the echo test.
`enableLastmileTest()`|Enable the last mile test.
`disableLastmileTest()`|Disable the last mile test.


### Client, Channel, and Stream Methods

These methods manage the client, channel. and streams.

Method|Description
----- | -----
`setClientRole(role, permissionKey)`|Set the client's role.
`joinChannel(key, name, chan_info, uid)`|Join a channel matching the supplied parameters.
`leaveChannel()`|Leave the current channel.
`renewChannelKey(newKey)`|Update the channel key.
`setChannelProfile(profile)`|Set the channel profile.
`createDataStream(reliable, ordered)`|Create a data stream.
`sendStreamMessage(streamId, msg)`|Send a message to a specific stream.
`enableWebSdkInteroprability(enable)`|Enable/disable web SDK interoperability.

### Video Control Methods

These methods manage the video source and video previews.

Method|Description
----- | -----
`setupLocalVideoSource(view)`|When a video source is used to share screen, bind the video source video to the view.
`setupLocalVideo(view)`|Bind the local video to the view.
`setupLocalDevTest(view)`|Bind the dev test video to the view.
`enableVideo()`|Enable video.
`disableVideo()`|Disable video.
`startPreview()`|Start video preview.
`stopPreview()`|Stop video preview.
`setVideoProfile(profile, swapWidthAndHeight)`|Set the video profile.
`enableLocalVideo(enable)`|Enable/disable the local video.

### Video Stream Methods

These methods manage video streams.

Method|Description
----- | -----
`muteLocalVideoStream(mute)`|Mute/unmute the local video stream.
`muteAllRemoteVideoStreams(mute)`|Mute/unmute all remote videos.
`muteRemoteVideoStream(uid, mute)`|Mute/unmute the users video with `uid`.
`setRemoteVideoStreamType(uid, streamType)`|Set the type of remote video stream.
`setRemoteDefaultVideoStreamType(streamType)`|Set the type of the default remote video stream.
`setVideoQualityParameters(perferFrameRateOverImageQuality)`|Set the video quality.

### Video Device Methods

These methods manage the video devices.

Method|Description
----- | -----
`getVideoDevices()`|Retrieve a list of video devices.
`setVideoDevice(deviceId)`|Set the device to be used.
`getCurrentVideoDevice()`|Retrieve the current video device.
`startVideoDeviceTest()`|Start a video device test.
`stopVideoDeviceTest()`|Stop a video device test.

### Video Source Methods

These methods manage the video source.

Method|Description
----- | -----
`videoSourceInitialize()`|Initialize the video source context.
`videoSourceJoin(token, cname, chanInfo, uid)`|Direct the video source to join channel.
`videoSourceRenewToken(token)`|Direct the video source to renew the token.
`videoSourceSetChannelProfile(profile)`|Set the channel profile for the video source.
`videoSourceSetVideoProfile(profile, swapWidthAndHeight)`|Set the video profile for the video source.

### Screen Capture Methods

These methods manage the screen capture video.

Method|Description
----- | -----
`startScreenCapture(windowId, captureFreq, rect, bitrate)`|Start a screen capture.
`startScreenCapture2(wndid, captureFreq, rect, bitrate)`|Direct the video source to start a screen capture.
`stopScreenCapture2()`|Direct the video source to stop a screen capture.
`updateScreenCapturRegion(rect)`|Direct a video source to update the screen capture area.
`videoSourceRelease()`|Stop the video source.
`startScreenCapturePreview()`|Start the screen capture video preview.
`stopScreenCapturePreview()`|Stop the screen capture video preview.
`stopScreenCapture()`|Stop the screen capture.

### Audio Control Methods

These methods manage audio settings and controls.

Method|Description
----- | -----
`enableAudio()`|Enable audio.
`disableAudio()`|Disable audio.
`pauseAudio()`|Pause audio.
`resumeAudio()`|Resume audio.
`setAudioProfile(profile, scenario)`|Set up the audio profile.
`muteLocalAudioStream(mute)`|Mute/unmute the local audio.
`muteAllRemoteAudioStreams(mute)`|Mute/unmute all remote audio.
`muteRemoteAudioStream(uid, mute)`|Mute/unmute the user's audio with a `uid`.
`setLocalVoicePitch(pitch)`|Set the local voice pitch.
`setInEarMonitoringVolume(volume)`|Set the in-ear monitoring volume.

### Audio Recording Methods

Method|Description
----- | -----
`startAudioRecording(filePath)`|Start audio recording.
`stopAudioRecording()`|Stop the audio recording.
`startRecordingService(recordingKey)`|Start a recording service.
`stopRecordingService(recordingKey)`|Stop a recording service.
`refreshRecordingServiceStatus()`|Refresh the status of the recording service.
`enableDualStreamMode(enable)`|Enable dual stream mode.
`setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)`|Set the audio recording parameters.
`getAudioRecordingVolume()`|Retrieve the audio recording volume.
`setAudioRecordingVolume(volume)`|Set the audio recording volume.
`getAudioRecordingDevices()`|Retrieve the list of audio recording devices.
`setAudioRecordingDevice(deviceid)`|Set the device for audio recording.
`getCurrentAudioRecordingDevice()`|Retrieve the current device for audio recording.
`stopAudioRecordingDeviceTest()`|Stop the audio recording device test.
`startAudioRecordingDeviceTest(indicationInterval)`|Start the audio recording device test with a time interval.
`adjustRecordingSignalVoluem(volume)`|Adjust the volume of the recording signal.
`getAudioRecordingDeviceMute()`|Check if the audio recording device is muted.
`setAudioRecordingDeviceMute(mute)`|Mute/unmute the audio recording device.

### Audio Mixing Methods

These methods manage audio mixing capabilities.

Method|Description
----- | -----
`startAudioMixing(filepath, loopback, replace, cycle)`|Start audio mixing.
`stopAudioMixing()`|Stop audio mixing.
`pauseAudioMixing()`|Pause audio mixing.
`resumeAudioMixing()`|Resume audio mixing.
`adjustAudioMixingVolume(volume)`|Adjust the audio mix volume.
`getAudioMixingDuration()`|Retrieve the duration of the audio mix.
`getAudioMixingCurrentPosition()`|Get the current audio mix position.
`setAudioMixingPosition(position)`|Set the position of the audio mix.
`setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)`|Set the playback parameters of the audio.
`setMixedAudioFrameParaemters(sampelRate, samplesPerCall)`|Set the parameters of the audio mix.

### Audio Playback Methods

These methods manage audio playback.

Method|Description
----- | -----
`adjustPlaybackSignalVolume(volume)`|Adjust the volume of the playback signal.
`setHighQualityAudioParameters(fullband, stereo, fullBitrate)`|Set the quality of the audio.
`getAudioPlaybackDevices()`|Retrieve the list of playback devices.
`setAudioPlaybackDevice(deviceid)`|Set the playback device.
`getCurrentAudioPlaybackDevice()`|Retrieve the current playback device.
`setAudioPlaybackVolume(voluem)`|Set the volume of the audio playback.
`getAudioPlaybackVolume()`|Retrieve the volume of the audio playback.
`startAudioPlaybackDeviceTest(filepath)`|Start the  audio playback device test.
`stopAudioPlaybackDeviceTest()`|Stop the audio playback device test.
`getAudioPlaybackDeviceMute()`|Check if the audio playback device is muted.
`setAudioPlaybackDeviceMute(mute)`|Mute/unmute the audio playback device.

## Event Listeners

- [General Event Listeners](#general-event-listeners)
- [Channel and Stream Event Listeners](#channel-and-stream-event-listeners)
- [Audio Event Listeners](#audio-event-listeners)
- [Video Event Listeners](#video-event-listeners)
- [User Event Listeners](#user-event-listeners)
- [Connection Event Listeners](#connection-event-listeners)
- [Statistic Event Listeners](#statistic-event-listeners)

### General Event Listeners

These are general listeners to check for errors, call quality, and client changes.

Listener Name|Callback Parameters|Description
----- | ----- | -----
`warning`|`warn`, `msg`|Triggers when a warning occurs.
`error`|`err`, `msg`|Triggers when an error occurs.
`apicallexecuted`|`api`, `err`|Triggers when an API call is executed.
`networkquality`|`uid`, `txquality`, `rxquality`|Triggers when the network quality changes.
`lastmilequality`|`quality`|Triggers when the last mile quality changes.
`mediaenginestartcallsuccess`||Triggers when a media engine starts a call successfully.
`clientrolechanged`|`oldrole`, `newrole`|Triggers when a client's role changes.

### Channel and Stream Event Listeners

These listeners detect changes in a channel or stream.

Listener Name|Callback Parameters|Description
----- | ----- | -----
`joinedchannel`|`channel`, `uid`, `elapsed`|Triggers when a user joins a channel.
`rejoinedchannel`|`channel`, `uid`, `elapsed`|Triggers when a user rejoins a channel.
`leavechannel`||Triggers when the current user leaves a channel.
`requestchannelkey`||Triggers when a channel key is requested.
`addstream`|`uid`, `elapsed`|Triggers when a stream is added.
`removestream`|`uid`, `reason`|Triggers when a stream is removed.
`streammessage`||Triggers when a message is streamed.
`streammessageerror`||Triggers when a message stream error occurs.

### Audio Event Listeners

These listeners detect audio event changes.

Listener Name|Callback Parameters|Description
----- | ----- | -----
`audioquality`|`uid`, `quality`, `delay`, `lost`|Triggers when the audio quality changes.
`audiovolumeindication`|`uid`, `volume`, `speakerNumber`, `totalVolume`|Triggers when the audio volume indicator changes.
`audiodevicestatechanged`|`deviceId`, `deviceType`, `deviceState`|Triggers when the audio device's state changes.
`audiomixingfinished`||Triggers when an audio mix has finished.
`remoteaudiomixingbegin`||Triggers when a remove audio mix begins.
`remoteaudiomixingend`||Triggers when an audio mix ends.
`audioeffectfinished`||Triggers when an audio effect finishes.
`firstlocalaudioframe`|`elapsed`|Triggers when the first local audio frame elapses.
`firstremoteaudioframe`|`uid`, `elapsed`|Triggers when the first remote audio frame elapses.
`audiodevicevolumechanged`|`deviceType`, `volume`, `muted`|Triggers when the audio device volume changes.
`activespeaker`|`uid`|Triggers when the active speaker changes.

### Video Event Listeners

These listeners detect changes to the video.

Listener Name|Callback Parameters|Description
----- | ----- | -----
`videodevicestatechagned`|`deviceId`, `deviceType`, `deviceState`|Triggers when a video device state changes.
`firstlocalvideoframe`|`width`, `height`, `elapsed`|Triggers when the first local video frame elapses.
`videosizechagned`|`uid`, `width`, `height`, `rotation`|Triggers when the video size changes.
`firstremotevideoframe`|`uid`, `width`, `height`, `elapsed`|Triggers when the first remote video frame elapses.
`videosourcejoinedsuccess`|`uid`|Triggers when a joining a video source succeeds.
`videosourcerequestnewtoken`||Triggers when a new video source token is requested.
`videosourceleavechannel`||Triggers when a video source leaves a channel.


### User Event Listeners

These event listeners detect changes to user information.

Listener Name|Callback Parameters|Description
----- | ----- | -----
`userjoined`|`uid`, `elapsed`|Triggers when a user joins.
`usermuteaudio`|`uid`, `muted`|Triggers when a user mutes the audio.
`usermutevideo`|`uid`, `muted`|Triggers when a user mutes the video.
`userenablevideo`|`uid`, `enabled`|Triggers when a user enables video.
`userenablelocalvideo`|`uid`, `enabled`|Triggers when a user enables local video.

### Connection Event Listeners

These event listeners detect connection changes.

Listener Name|Callback Parameters|Description
----- | ----- | -----
`cameraready`||Triggers when the camera is ready.
`videostopped`||Triggers when the video is stopped.
`connectionlost`||Triggers when the connection is lost.
`connectioninterrupted`||Triggers when the connection is interrupted.
`connectionbanned`||Triggers when the connection has been banned.
`refreshrecordingservicestatus`||Triggers when the recording service status has been refreshed.

### Statistic Event Listeners

These event listeners detect statistical changes.

Listener Name|Callback Parameters|Description
----- | ----- | -----
`rtcstats`||Triggers when the RTC statistics change.
`localvideostats`||Triggers when the local video statistics change.
`remotevideostats`||Triggers when the remote video statistics change.