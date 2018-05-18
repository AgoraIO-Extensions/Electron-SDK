# Agora JavaScript SDK API Reference

The [`AgoraSDK.js`](js/AgoraSdk.js) file enables the JavaScript Agora SDK API. The [`AgoraRender.js`](js/AgoraRender.js) and [`webgl-utils.js`](js/webgl-utils.js) files are used to render the video. You must include **all three** JavaScript files in your project.

The `AgoraRtcEngine` Class enables the SDK functionality. It also contains one event emitter, so the client can listen for events.

## Quick Start

### Create the `AgoraRtcEngine`

To create an `AgoraRtcEngine` instance:

1. Declare `AgoraRtcEngine` as a constant using the `AgoraSdk` library.

2. Create a new engine using `AgoraRtcEngine`

	``` Javascript
	const AgoraRtcEngine = require("AgoraSdk");
	var engine = new AgoraRtcEngine();
	```

### App Initialization

Initialize the app using the Agora `appid`. The app must be initialized prior to invoking other API functions.

```
initialize(appid, onSuccess, onFailed)
```

Once the app is initialized, start adding Agora [API methods](#api-methods) or [event listeners](event-listeners)


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

- `getVersion()` - Get the current SDK version

- `getErrorDescription(errorCode)` - Get the error code description

- `rate(callid, rating, desc)` - Rate the call

- `complain(callid, desc)` - Complain about the call

- `setEncryptionSecret(secret)` - Set the encryption as secret

- `getCallId()` - Get current call id
	
### Logging and Testing Methods

- `setLogFile(filepath)` - Set the file path for logging

- `setLogFilter(filter)` - Set a filter for logging

- `startEchoTest()` - Start the Echo test

- `stopEchoTest()` - Stop the Echo test

- `enableLastmileTest()` - Enable the last mile test

- `disableLastmileTest()` - Disable the last mile test

### Client, Channel, and Stream Methods

- `setClientRole(role, permissionKey)` - Set the client's role

- `joinChannel(key, name, chan_info, uid)` - Join a channel matching the supplied parameters

- `leaveChannel()` - Leave the current channel

- `subscribe(uid, view)` - Subscribe the user to the view (bind the user's video to the view), after a user with a `uid` joins channel

- `renewChannelKey(newKey)` - Updates the channel key

- `setChannelProfile(profile)` - Set the channel profile

- `createDataStream(reliable, ordered)` - Create a data stream

- `sendStreamMessage(streamId, msg)` - Send a message to a specific stream

- `enableWebSdkInteroprability(enable)` - Enable/disable web SDK interoperability

### Video Control Methods

- `setupLocalVideoSource(view)` - When a video source is used to share screen, bind the video source video to the view

- `setupLocalVideo(view)` - Bind local video to the view

- `setupLocalDevTest(view)` - Bind the dev test video to the view

- `enableVideo()` - Enable video

- `disableVideo()` - Disable video

- `startPreview()` - Start video preview

- `stopPreview()` - Stop video preview

- `setVideoProfile(profile, swapWidthAndHeight)` - Set the video profile

- `enableLocalVideo(enable)` - Enable/disable the local video

### Video Stream Methods

- `muteLocalVideoStream(mute)` - Mute/unmute the local video stream

- `muteAllRemoteVideoStreams(mute)` - Mute/unmute all remote videos.

- `muteRemoteVideoStream(uid, mute)` - Mute/unmute the users video with `uid`

- `setRemoteVideoStreamType(uid, streamType)` - Set the type of remote video stream

- `setRemoteDefaultVideoStreamType(streamType)` - Set the type of the default remote video stream

- `setVideoQualityParameters(perferFrameRateOverImageQuality)` - Set the video quality

### Video Device Methods

- `getVideoDevices()` - Retrieves a list of video devices

- `setVideoDevice(deviceId)` - Sets the device to be used

- `getCurrentVideoDevice()` - Retrieves the current video device

- `startVideoDeviceTest()` - Start a video device test

- `stopVideoDeviceTest()` - Stop a video device test

### Video Source Methods

- `videoSourceInitialize()` - Initialize the video source context

- `videoSourceJoin(token, cname, chanInfo, uid)` - Ask the video source to join channel

- `videoSourceRenewToken(token)` - Ask video source to renew the token

- `videoSourceSetChannelProfile(profile)` - Set channel profile for the video source

- `videoSourceSetVideoProfile(profile, swapWidthAndHeight)` - Set the video profile for the video source

### Screen Capture Methods

- `startScreenCapture(windowId, captureFreq, rect, bitrate)` - Start a screen capture

- `startScreenCapture2(wndid, captureFreq, rect, bitrate)` - Ask the video source to start a screen capture

- `stopScreenCapture2()` - Ask the video source to stop a screen capture

- `updateScreenCapturRegion(rect)` - Ask a video source to update the screen capture area

- `videoSourceRelease()` - Stop the video source

- `startScreenCapturePreview()` - Start the screen capture video preview

- `stopScreenCapturePreview()` - Stop the screen capture video preview

- `stopScreenCapture()` - Stop the screen capture

### Audio Control Methods

- `enableAudio()` - Enable audio

- `disableAudio()` - Disable audio

- `pauseAudio()` - Pause audio

- `resumeAudio()` - Resume audio

- `setAudioProfile(profile, scenario)` - Set up the audio profile

- `muteLocalAudioStream(mute)` - Mute/unmute the local audio

- `muteAllRemoteAudioStreams(mute)` - Mute/unmute all remote audio

- `muteRemoteAudioStream(uid, mute)` - Mute/unmute the user's audio with a `uid`

- `setLocalVoicePitch(pitch)` - Set the local voice pitch

- `setInEarMonitoringVolume(volume)` - Set the in-ear monitoring volume

### Audio Recording Methods

- `startAudioRecording(filePath)` - Start audio recording

- `stopAudioRecording()` - Stop the audio recording

- `startRecordingService(recordingKey)` - Start a recording service

- `stopRecordingService(recordingKey)` - Stop a recording service

- `refreshRecordingServiceStatus()` - Refresh the status of the recording service

- `enableDualStreamMode(enable)` - Enable dual stream mode

- `setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)` - Set the audio recording parameters

- `getAudioRecordingVolume()` - Retrieve the audio recording volume

- `setAudioRecordingVolume(volume)` - Set the audio recording volume

- `getAudioRecordingDevices()` - Retrieve the list of audio recording devices

- `setAudioRecordingDevice(deviceid)` - Set the device for audio recording

- `getCurrentAudioRecordingDevice()` - Retrieve the current device for audio recording

- `stopAudioRecordingDeviceTest()` - Stop the audio recording device test

- `startAudioRecordingDeviceTest(indicationInterval)` - Start the audio recording device test with a time interval

- `adjustRecordingSignalVoluem(volume)` - Adjust the volume of the recording signal

- `getAudioRecordingDeviceMute()` - Check if the audio recording device is muted

- `setAudioRecordingDeviceMute(mute)` - Mute/unmute the audio recording device

### Audio Mixing Methods

- `startAudioMixing(filepath, loopback, replace, cycle)` - Start audio mixing

- `stopAudioMixing()` - Stop audio mixing

- `pauseAudioMixing()` - Pause audio mixing

- `resumeAudioMixing()` - Resume audio mixing

- `adjustAudioMixingVolume(volume)` - Adjust the audio mix volume

- `getAudioMixingDuration()` - Get the audio mix duration

- `getAudioMixingCurrentPosition()` - Get the audio mix current position

- `setAudioMixingPosition(position)` - Set the position of the audio mix

- `setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)` - Set the playback parameters of the audio

- `setMixedAudioFrameParaemters(sampelRate, samplesPerCall)` - Set the parameters of the audio mix

### Audio Playback Methods

- `adjustPlaybackSignalVolume(volume)` - Adjust the volume of the playback signal

- `setHighQualityAudioParameters(fullband, stereo, fullBitrate)` - Set the quality of the audio

- `getAudioPlaybackDevices()` - Retrieve the list of playback devices

- `setAudioPlaybackDevice(deviceid)` - Set the playback device

- `getCurrentAudioPlaybackDevice()` - Retrieve the current playback device

- `setAudioPlaybackVolume(voluem)` - Set the volume of the audio playback

- `getAudioPlaybackVolume()` - Retrieve the volume of the audio playback

- `startAudioPlaybackDeviceTest(filepath)` - Start the  audio playback device test

- `stopAudioPlaybackDeviceTest()` - Stop the audio playback device test

- `getAudioPlaybackDeviceMute()` - Check if the audio playback device is muted

- `setAudioPlaybackDeviceMute(mute)` - Mute/unmute the audio playback device

## Event Listeners

**Note:** Value options of event listeners (if any) are below the listener name.

- [General Event Listeners](#general-event-listeners)
- [Channel and Stream Event Listeners](#channel-and-stream-event-listeners)
- [Audio Event Listeners](#audio-event-listeners)
- [Video Event Listeners](#video-event-listeners)
- [User Event Listeners](#user-event-listeners)
- [Connection Event Listeners](#connection-event-listeners)
- [Statistic Event Listeners](#statistic-event-listeners)

### General Event Listeners

- `warning` : warn, msg

- `error` : err, msg

- `apicallexecuted` : api, err

- `networkquality` : uid, txquality, rxquality

- `lastmilequality` : quality

- `mediaenginestartcallsuccess`

- `clientrolechanged` : oldrole, newrole

### Channel and Stream Event Listeners

- `joinedchannel` : channel, uid, elapsed

- `rejoinedchannel` : channel, uid, elapsed

- `leavechannel`

- `requestchannelkey`

- `addstream` : uid, elapsed

- `removestream` : uid, reason

- `streammessage`

- `streammessageerror`

### Audio Event Listeners

- `audioquality` : uid, quality, delay, lost

- `audiovolumeindication` : uid, volume, speakerNumber, totalVolume

- `audiodevicestatechanged` : deviceId, deviceType, deviceState

- `audiomixingfinished`

- `remoteaudiomixingbegin`

- `remoteaudiomixingend`

- `audioeffectfinished`

- `firstlocalaudioframe` : elapsed

- `firstremoteaudioframe` : uid, elapsed

- `audiodevicevolumechanged` : deviceType, volume, muted

- `activespeaker` : uid

### Video Event Listeners

- `videodevicestatechagned` : deviceId, deviceType, deviceState

- `firstlocalvideoframe` : width, height, elapsed

- `videosizechagned` : uid, width, height, rotation

- `firstremotevideoframe` : uid, width, height, elapsed

- `videosourcejoinedsuccess` : uid

- `videosourcerequestnewtoken`

- `videosourceleavechannel`


### User Event Listeners

- `userjoined` : uid, elapsed

- `usermuteaudio` : uid, muted

- `usermutevideo` : uid, muted

- `userenablevideo` : uid, enabled

- `userenablelocalvideo` : uid, enabled

### Connection Event Listeners

- `cameraready`

- `videostopped`

- `connectionlost`

- `connectioninterrupted`

- `connectionbanned`

- `refreshrecordingservicestatus`

### Statistic Event Listeners

- `rtcstats`

- `localvideostats`

- `remotevideostats`