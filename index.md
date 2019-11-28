This Agora Electron SDK is developed upon the Native SDK for macOS and the Native SDK for Windows, with the Node.js C++ plug-in units. The Electron SDK supports all the functions of the Agora Native SDK. Agora provides ensured quality of experience (QoE) for worldwide Internet-based voice and video communications through a virtual global network optimized on all platforms.

* The `AgoraRtcEngine` class provides the main methods that can be invoked by your application.
* The `Events` class enables callbacks to your application.

## Methods

### Channel management

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.initialize initialize}                 | Initializes an `AgoraRtcEngine` instance.                      |
| {@link AgoraRtcEngine.release release}                       | Releases an `AgoraRtcEngine` instance.                         |
| {@link AgoraRtcEngine.setChannelProfile setChannelProfile}   | Sets the channel profile.                                    |
| {@link AgoraRtcEngine.setClientRole setClientRole}           | Sets the user role (Live Broadcast only).                    |
| {@link AgoraRtcEngine.joinChannel joinChannel}               | Allows a user to join a channel. |
| {@link AgoraRtcEngine.switchChannel switchChannel}|Switches to a different channel (Live Broadcast only).|
| {@link AgoraRtcEngine.leaveChannel leaveChannel}             | Allows a user to leave a channel.                            |
| {@link AgoraRtcEngine.subscribe subscribe}                   | Subscribes to the remote user and initializes the video sink |
| {@link AgoraRtcEngine.renewToken renewToken}                 | Renews the token.                                            |
| {@link AgoraRtcEngine.enableWebSdkInteroperability enableWebSdkInteroperability} | Enables interoperability with the Agora Web SDK.             |
| {@link AgoraRtcEngine.getConnectionState getConnectionState} | Gets the connection state of the app.                        |
| {@link AgoraRtcEngine.on on}                                 | Monitors the events during `AgoraRtcEngine` runtime.           |
| {@link AgoraRtcEngine.off off}                               | Stops monitoring the events during `AgoraRtcEngine` runtime.    |


### Audio management

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.enableAudio enableAudio}               | Enables the audio module.                                    |
| {@link AgoraRtcEngine.disableAudio disableAudio}             | Disables the audio module.                                   |
| {@link AgoraRtcEngine.setAudioProfile setAudioProfile}       | Sets the audio parameters and application scenarios.         |
| {@link AgoraRtcEngine.adjustRecordingSignalVolume adjustRecordingSignalVolume} | Adjusts the recording volume.                                |
| {@link AgoraRtcEngine.adjustPlaybackSignalVolume adjustPlaybackSignalVolume} | Adjusts the playback volume of the voice.                    |
| {@link AgoraRtcEngine.enableLocalAudio enableLocalAudio}     | Enables/disables the local audio capture.                    |
| {@link AgoraRtcEngine.muteLocalAudioStream muteLocalAudioStream} | Stops/Resumes sending the local audio stream.                |
| {@link AgoraRtcEngine.muteRemoteAudioStream muteRemoteAudioStream} | Stops/Resumes receiving a specified remote audio stream.      |
| {@link AgoraRtcEngine.muteAllRemoteAudioStreams muteAllRemoteAudioStreams} | Stops/Resumes receiving all remote audio streams.            |
| {@link AgoraRtcEngine.setDefaultMuteAllRemoteAudioStreams setDefaultMuteAllRemoteAudioStreams} | Sets whether to receive all remote audio streams by default. |



### Video management

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.enableVideo enableVideo}               | Enables the video module.                                    |
| {@link AgoraRtcEngine.disableVideo disableVideo}             | Disables the video module.                                   |
| {@link AgoraRtcEngine.setVideoEncoderConfiguration setVideoEncoderConfiguration} | Sets the video encoder configuration.                        |
| {@link AgoraRtcEngine.setupLocalVideo setupLocalVideo}       | Sets the local video view.                                   |
| {@link AgoraRtcEngine.setupViewContentMode setupViewContentMode} | Sets the view content mode.                                  |
| {@link AgoraRtcEngine.setRenderMode setRenderMode}           | Sets the view render mode.                                   |
| {@link AgoraRtcEngine.startPreview startPreview}             | Starts the local video preview.                              |
| {@link AgoraRtcEngine.stopPreview stopPreview}               | Stops the local video preview.                               |
| {@link AgoraRtcEngine.enableLocalVideo enableLocalVideo}     | Enables/Disables the local video capture.                    |
| {@link AgoraRtcEngine.muteLocalVideoStream muteLocalVideoStream} | Stops/Resumes sending the local video stream.                |
| {@link AgoraRtcEngine.muteRemoteVideoStream muteRemoteVideoStream} | Stops/Resumes receiving a specified remote video stream.     |
| {@link AgoraRtcEngine.muteAllRemoteVideoStreams muteAllRemoteVideoStreams} | Stops/Resumes receiving all remote video streams.            |
| {@link AgoraRtcEngine.setDefaultMuteAllRemoteVideoStreams setDefaultMuteAllRemoteVideoStreams} | Sets whether to receive all remote video streams by default. |

### Video sink

| Method                                                       | Description                                      |
| ------------------------------------------------------------ | ------------------------------------------------ |
| {@link AgoraRtcEngine.initRender initRender}                 | Initializes the video sink.                      |
| {@link AgoraRtcEngine.destroyRender destroyRender}           | Destroys the video sink.                         |
| {@link AgoraRtcEngine.resizeRender resizeRender}             | Resizes the rendered video.                      |
| {@link AgoraRtcEngine.setVideoRenderDimension setVideoRenderDimension} | Ses the pixels the rendered video.               |
| {@link AgoraRtcEngine.setVideoRenderFPS setVideoRenderFPS}   | Sets the frame rate of the rendered video.       |
| {@link AgoraRtcEngine.setVideoRenderHighFPS setVideoRenderHighFPS} | Sets the high frame rate of the rendered video.  |
| {@link AgoraRtcEngine.addVideoRenderToHighFPS addVideoRenderToHighFPS} | Adds the rendered video with high frame rate.    |
| {@link AgoraRtcEngine.removeVideoRenderFromHighFPS  removeVideoRenderFromHighFPS} | Removes the rendered video with high frame rate. |

### Video pre-process and post-process

| Method                                                       | Description                         |
| ------------------------------------------------------------ | ----------------------------------- |
| {@link AgoraRtcEngine.setBeautyEffectOptions setBeautyEffectOptions} | Sets the image enhancement options. |

### Screen sharing

| Method                                                   | Description         |
| ------------------------------------------------------------ | --------------------- |
| {@link AgoraRtcEngine.videoSourceInitialize videoSourceInitialize} | Initializes the video source object. |
| {@link AgoraRtcEngine.videoSourceRelease videoSourceRelease} | Releases the video source object. |
| {@link AgoraRtcEngine.getScreenDisplaysInfo getScreenDisplaysInfo} | Gets the display ID. |
| {@link AgoraRtcEngine.getScreenWindowsInfo getScreenWindowsInfo} | Gets the window ID. |
| {@link AgoraRtcEngine.startScreenCapturePreview startScreenCapturePreview} | Starts the sharing video preview. |
| {@link AgoraRtcEngine.stopScreenCapturePreview stopScreenCapturePreview} | Stops the sharing video preview. |
| {@link AgoraRtcEngine.videoSourceStartScreenCaptureByScreen videoSourceStartScreenCaptureByScreen} | Shares the whole or part of a screen by specifying the screen rect. |
| {@link AgoraRtcEngine.videoSourceStartScreenCaptureByWindow videoSourceStartScreenCaptureByWindow} | Shares the whole or part of a window by specifying the window ID. |
| {@link AgoraRtcEngine.videoSourceUpdateScreenCaptureRegion videoSourceUpdateScreenCaptureRegion} | Updates the screen sharing region. |
| {@link AgoraRtcEngine.videoSourceUpdateScreenCaptureParameters videoSourceUpdateScreenCaptureParameters} | Updates the screen sharing parameters. |
| {@link AgoraRtcEngine.videoSourceSetScreenCaptureContentHint videoSourceSetScreenCaptureContentHint} | Sets the content hint for screen sharing. |
| {@link AgoraRtcEngine.stopScreenCapture2 stopScreenCapture2} | Stops screen sharing. |

### Audio file playback and mixing

| Method                                                       | Description                                             |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| {@link AgoraRtcEngine.startAudioMixing startAudioMixing}     | Starts playing and mixing the music file.               |
| {@link AgoraRtcEngine.stopAudioMixing stopAudioMixing}       | Stops playing and mixing the music file.                |
| {@link AgoraRtcEngine.pauseAudioMixing pauseAudioMixing}     | Pauses playing and mixing the music file.               |
| {@link AgoraRtcEngine.resumeAudioMixing resumeAudioMixing}   | Resumes playing and mixing the music file.              |
| {@link AgoraRtcEngine.adjustAudioMixingVolume adjustAudioMixingVolume} | Adjusts the volume during audio mixing.                 |
| {@link AgoraRtcEngine.adjustAudioMixingPlayoutVolume adjustAudioMixingPlayoutVolume} | Adjusts the volume of audio mixing for local playback.  |
| {@link AgoraRtcEngine.adjustAudioMixingPublishVolume adjustAudioMixingPublishVolume} | Adjusts the volume of audio mixing for remote playback. |
|{@link AgoraRtcEngine.getAudioMixingPlayoutVolume getAudioMixingPlayoutVolume}|Adjusts the audio mixing volume for publishing (for remote users).|
|{@link AgoraRtcEngine.getAudioMixingPublishVolume getAudioMixingPublishVolume}|Retrieves the audio mixing volume for publishing.|
| {@link AgoraRtcEngine.getAudioMixingDuration getAudioMixingDuration} | Gets the duration (ms) of the music file.               |
| {@link AgoraRtcEngine.getAudioMixingCurrentPosition getAudioMixingCurrentPosition} | Gets the playback position (ms) of the music file.      |
| {@link AgoraRtcEngine.setAudioMixingPosition setAudioMixingPosition} | Sets the playback position of the music file.           |

### Audio effect playback

| Method                                                     | Description                                             |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| {@link AgoraRtcEngine.getEffectsVolume getEffectsVolume}   | Gets the volume of the audio effects.                   |
| {@link AgoraRtcEngine.setEffectsVolume setEffectsVolume}   | Sets the volume of the audio effects.                   |
| {@link AgoraRtcEngine.setVolumeOfEffect setVolumeOfEffect} | Sets the volume of the audio effect.                    |
| {@link AgoraRtcEngine.playEffect playEffect}               | Plays a specified audio effect.                         |
| {@link AgoraRtcEngine.stopEffect stopEffect}               | Stops playing a specified audio effect.                 |
| {@link AgoraRtcEngine.preloadEffect preloadEffect}         | Preloads a specified audio effect file into the memory. |
| {@link AgoraRtcEngine.unloadEffect unloadEffect}           | Releases a specified audio effect from the memory.      |
| {@link AgoraRtcEngine.pauseEffect pauseEffect}             | Pauses a specified audio effect.                        |
| {@link AgoraRtcEngine.pauseAllEffects pauseAllEffects}     | Pauses all audio effects.                               |
| {@link AgoraRtcEngine.resumeEffect resumeEffect}           | Resumes playing a specified audio effect.               |
| {@link AgoraRtcEngine.resumeAllEffects resumeAllEffects}   | Resumes playing all audio effects.                      |

### Voice changer and reverberation

| Method                                                       | Description                                       |
| ------------------------------------------------------------ | ------------------------------------------------- |
| {@link AgoraRtcEngine.setLocalVoiceChanger setLocalVoiceChanger} | Sets the local voice changer option.              |
| {@link AgoraRtcEngine.setLocalVoiceReverbPreset setLocalVoiceReverbPreset} | Sets the preset local voice reverberation effect. |
| {@link AgoraRtcEngine.setLocalVoicePitch setLocalVoicePitch} | Changes the voice pitch of the local speaker.     |
| {@link AgoraRtcEngine.setLocalVoiceEqualization setLocalVoiceEqualization} | Sets the local voice equalization effect.         |
| {@link AgoraRtcEngine.setLocalVoiceReverb setLocalVoiceReverb} | Sets the local voice reverberation.               |

### Sound position indication

| Method                                                       | Description                                        |
| ------------------------------------------------------------ | -------------------------------------------------- |
| {@link AgoraRtcEngine.enableSoundPositionIndication enableSoundPositionIndication} | Enables/Disables stereo panning for remote users.  |
| {@link AgoraRtcEngine.setRemoteVoicePosition setRemoteVoicePosition} | Sets the sound position and gain of a remote user. |

### CDN publisher 

> This group of methods apply to Live Broadcast only.

| Method                                                       | Description                                   |
| ------------------------------------------------------------ | --------------------------------------------- |
| {@link AgoraRtcEngine.setLiveTranscoding setLiveTranscoding} | Sets the video layout and audio for CDN live. |
| {@link AgoraRtcEngine.addPublishStreamUrl addPublishStreamUrl} | Adds a CDN stream address.                    |
| {@link AgoraRtcEngine.removePublishStreamUrl removePublishStreamUrl} | Removes a CDN stream address.                 |

### Channel Media Relay

> This group of methods apply to Live Broadcast only.

| Method                                                       | Description                                    |
| ------------------------------------------------------------ | ---------------------------------------------- |
| {@link AgoraRtcEngine.startChannelMediaRelay startChannelMediaRelay} | Starts to relay media streams across channels. |
| {@link AgoraRtcEngine.updateChannelMediaRelay updateChannelMediaRelay} | Updates the channels for media stream relay.   |
| {@link AgoraRtcEngine.stopChannelMediaRelay stopChannelMediaRelay} | Stops the media stream relay.                  |


### Audio volume indication

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.enableAudioVolumeIndication enableAudioVolumeIndication} | Reports on which users are speaking and the speakers' volume. |

### In-ear monitoring

| Method                                                       | Description                            |
| ------------------------------------------------------------ | -------------------------------------- |
| {@link AgoraRtcEngine.setInEarMonitoringVolume setInEarMonitoringVolume} | Sets the volume of the in-ear monitor. |

### Dual video stream mode

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.enableDualStreamMode enableDualStreamMode} | Sets the stream mode to single-stream (default) or dual-stream mode. |
| {@link AgoraRtcEngine.setRemoteVideoStreamType setRemoteVideoStreamType} | Sets the remote user’s video stream type received by the local user when the remote user sends dual streams. |
| {@link AgoraRtcEngine.setRemoteDefaultVideoStreamType setRemoteDefaultVideoStreamType} | Sets the default video-stream type for the video received by the local user when the remote user sends dual streams. |

### Stream fallback

> This group of methods apply to Live Broadcast only.

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.setLocalPublishFallbackOption setLocalPublishFallbackOption} | Sets the fallback option for the published video stream under unreliable network conditions. |
| {@link AgoraRtcEngine.setRemoteSubscribeFallbackOption setRemoteSubscribeFallbackOption} | Sets the fallback option for the remote stream under unreliable network conditions. |
| {@link AgoraRtcEngine.setRemoteUserPriority setRemoteUserPriority} | Prioritizes a remote user's stream.                          |

### Pre-call network test

| Method                                                       | Description                                   |
| ------------------------------------------------------------ | --------------------------------------------- |
| {@link AgoraRtcEngine.startEchoTestWithInterval startEchoTestWithInterval} | Starts an audio call test.|
| {@link AgoraRtcEngine.stopEchoTest stopEchoTest}             | Stops the audio call test.                    |
| {@link AgoraRtcEngine.enableLastmileTest enableLastmileTest} | Enables the network connection quality test.  |
| {@link AgoraRtcEngine.disableLastmileTest disableLastmileTest} | Disables the network connection quality test. |
| {@link AgoraRtcEngine.startLastmileProbeTest startLastmileProbeTest} | Starts the last-mile network probe test.      |
| {@link AgoraRtcEngine.stopLastmileProbeTest stopLastmileProbeTest} | Stops the last-mile network probe test.       |


### Encryption

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.setEncryptionSecret setEncryptionSecret} | Enables built-in encryption with an encryption password before joining a channel. |
| {@link AgoraRtcEngine.setEncryptionMode setEncryptionMode}|Sets the built-in encryption mode.|

### Inject an online media stream

> This group of methods apply to Live Broadcast only.

| Method                                                       | Description                                            |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| {@link AgoraRtcEngine.addInjectStreamUrl addInjectStreamUrl} | Adds an online media stream to a live broadcast.       |
| {@link AgoraRtcEngine.removeInjectStreamUrl removeInjectStreamUrl} | Removes the online media stream from a live broadcast. |

### Device management

| Method                                                   | Description              |
| ------------------------------------------------------------ | -------------------------- |
| {@link AgoraRtcEngine.setAudioPlaybackDevice setAudioPlaybackDevice} | Sets the audio playback device using the device ID. |
| {@link AgoraRtcEngine.getAudioPlaybackDevices getAudioPlaybackDevices} | Gets the audio playback device using the device ID. |
| {@link AgoraRtcEngine.setAudioRecordingDevice setAudioRecordingDevice} | Sets the audio recording device using the device ID. |
| {@link AgoraRtcEngine.getAudioRecordingDevices getAudioRecordingDevices} | Gets the audio recording device using the device ID. |
| {@link AgoraRtcEngine.setVideoDevice setVideoDevice}         | Sets the device with the device ID. |
| {@link AgoraRtcEngine.getVideoDevices getVideoDevices}       | Gets the video-capture device that is in use. |
| {@link AgoraRtcEngine.setAudioPlaybackDeviceMute setAudioPlaybackDeviceMute} | Mutes/Unmutes the audio playback device. |
| {@link AgoraRtcEngine.getAudioPlaybackDeviceMute getAudioPlaybackDeviceMute} | Gets the mute state of the audio playback device. |
| {@link AgoraRtcEngine.setAudioRecordingDeviceMute setAudioRecordingDeviceMute} | Mutes/Unmutes the audio recording device. |
| {@link AgoraRtcEngine.getAudioRecordingDeviceMute getAudioRecordingDeviceMute} | Gets the mute state of the audio recording device. |
| {@link AgoraRtcEngine.getPlaybackDeviceInfo getPlaybackDeviceInfo} | Gets the information of the audio playback device. |
| {@link AgoraRtcEngine.getRecordingDeviceInfo getRecordingDeviceInfo} | Gets the information of the recording device. |
| {@link AgoraRtcEngine.getCurrentAudioPlaybackDevice getCurrentAudioPlaybackDevice} | Gets the current audio playback device. |
| {@link AgoraRtcEngine.getCurrentAudioRecordingDevice getCurrentAudioRecordingDevice} | Gets the current audio recording device. |
| {@link AgoraRtcEngine.getCurrentVideoDevice getCurrentVideoDevice} | Gets the current video device. |
| {@link AgoraRtcEngine.startAudioDeviceLoopbackTest startAudioDeviceLoopbackTest} | Starts the audio device loopback test. |
| {@link AgoraRtcEngine.stopAudioDeviceLoopbackTest stopAudioDeviceLoopbackTest} | Stops the audio device loopback test. |
| {@link AgoraRtcEngine.startAudioPlaybackDeviceTest startAudioPlaybackDeviceTest} | Starts the audio playback device test. |
| {@link AgoraRtcEngine.stopAudioPlaybackDeviceTest stopAudioPlaybackDeviceTest} | Stops the audio playback device test. |
| {@link AgoraRtcEngine.startAudioRecordingDeviceTest startAudioRecordingDeviceTest} | Starts the recording device test. |
| {@link AgoraRtcEngine.stopAudioRecordingDeviceTest stopAudioRecordingDeviceTest} | Stops the recording device test. |
| {@link AgoraRtcEngine.startVideoDeviceTest startVideoDeviceTest} | Starts the video playback device test. |
| {@link AgoraRtcEngine.stopVideoDeviceTest stopVideoDeviceTest} | Stops the video playback device test. |
| {@link AgoraRtcEngine.setAudioPlaybackVolume setAudioPlaybackVolume} | Sets the volume of the audio playback device. |
| {@link AgoraRtcEngine.getAudioPlaybackVolume getAudioPlaybackVolume} | Gets the volume of the audio playback device. |
| {@link AgoraRtcEngine.setAudioRecordingVolume setAudioRecordingVolume} | Sets the volume of the recording device. |
| {@link AgoraRtcEngine.getAudioRecordingVolume getAudioRecordingVolume} | Gets the volume of the recording device. |

### Stream message

| Method                                                     | Description                 |
| ---------------------------------------------------------- | --------------------------- |
| {@link AgoraRtcEngine.createDataStream createDataStream}   | Creates a data stream.      |
| {@link AgoraRtcEngine.sendStreamMessage sendStreamMessage} | Sends data stream messages. |

### Miscellaneous audio control

| Method                                                       | Description                 |
| ------------------------------------------------------------ | --------------------------- |
| {@link AgoraRtcEngine.enableLoopbackRecording enableLoopbackRecording} | Enables loopback recording. |

### Miscellaneous video control

| Method                                                       | Description                             |
| ------------------------------------------------------------ | --------------------------------------- |
| {@link AgoraRtcEngine.setLocalVideoMirrorMode setLocalVideoMirrorMode} | Sets the local video mirror mode.       |
| {@link AgoraRtcEngine.setCameraCapturerConfiguration setCameraCapturerConfiguration} | Sets the camera capturer configuration. |

### Miscellaneous methods

| Method                                                   | Description      |
| ------------------------------------------------------------ | ------------------ |
| {@link AgoraRtcEngine.getCallId getCallId}                   | Gets the current call ID. |
| {@link AgoraRtcEngine.rate rate}                             | Allows the user to rate the call and is called after the call ends. |
| {@link AgoraRtcEngine.complain complain}                     | Allows a user to complain about the call quality after a call ends. |
| {@link AgoraRtcEngine.setLogFile setLogFile}                 | Specifies an SDK output log file. |
| {@link AgoraRtcEngine.setLogFileSize setLogFileSize}         | Sets the log file size (KB). |
| {@link AgoraRtcEngine.setLogFile setLogFilter}               | Sets the output log level of the SDK. |
| {@link AgoraRtcEngine.getVersion getVersion}                 | Gets the SDK version number. |
| {@link AgoraRtcEngine.getErrorDescription getErrorDescription} | Gets the warning or error description. |

### Customized methods

| Method                                             | Description                                                  |
| -------------------------------------------------- | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.setParameters setParameters} | Provides the technical preview functionalities or special customizations by configuring the SDK with JSON options. |

### Methods for the second instance

Agora Electron SDK provides the methods for the second instance: 

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.videoSourceSetChannelProfile videoSourceSetChannelProfile} | Sets the channel profile.                                    |
| {@link AgoraRtcEngine.videoSourceJoin videoSourceJoin}       | Allows a user to join a channel.                             |
| {@link AgoraRtcEngine.videoSourceLeave videoSourceLeave}     | Allows a user to leave a channel.                            |
| {@link AgoraRtcEngine.videoSourceRenewToken videoSourceRenewToken} | Renews the Token.                                            |
| {@link AgoraRtcEngine.videoSourceEnableWebSdkInteroperability videoSourceEnableWebSdkInteroperability} | Enables interoperability with the Agora Web SDK.             |
| {@link AgoraRtcEngine.setupLocalVideoSource setupLocalVideoSource} | Sets the local video view.                                   |
| {@link AgoraRtcEngine.videoSourceSetVideoProfile videoSourceSetVideoProfile} | Sets the video encoder configuration.                        |
| {@link AgoraRtcEngine.videoSourceEnableDualStreamMode videoSourceEnableDualStreamMode} | Sets the stream mode to single- (default) or dual-stream mode (for live broadcast only). |
| {@link AgoraRtcEngine.videoSourceSetLogFile videoSourceSetLogFile} | Specifies an SDK output log file.                            |
| {@link AgoraRtcEngine.videoSourceSetParameters videoSourceSetParameters} | Provides the technical preview functionalities or special customizations by configuring the SDK with JSON options. |

## Events

Agora Electron SDK use the  {@link AgoraRtcEngine.on on} method to add listeners for the events above: 

| Event                            | Description                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| `warning`                          | Occurs when a warning occurs.                                |
| `error`                            | Occurs when an error occurs.                                 |
| `joinedChannel`                    | Occurs when a user joins a channel.                          |
| `rejoinedChannel`                  | Occurs when a user rejoins a channel.                        |
| `leaveChannel`                     | Occurs when a user leaves a channel.                         |
| `clientRoleChanged`                | Occurs when the user role in a Live Broadcast changes.       |
| `userJoined`                       | Occurs when a remote user joins a channel.                   |
| `connectionStateChanged`           | Occurs when the network connection state changes.            |
| `connectionLost`                   | Occurs when the network connection state changes.            |
| `apiCallExecuted`                  | Occurs when an API method is executed.                       |
| `tokenPrivilegeWillExpire`         | Occurs when the token expires in 30 seconds.                 |
| `requestChannelKey`                | Occurs when the Channel Key expires.                         |
| `localUserRegistered`              | Occurs when the local user successfully registers a user account. |
| `userInfoUpdated`                  | Occurs when the SDK gets the user ID and user account of the remote user. |
| `microphoneEnabled`                | Occurs when the state of the microphone changes.             |
| `groupAudioVolumeIndication`       | Occurs when the state of the microphone changes.             |
| `activeSpeaker`                    | Reports which user is the loudest speaker.                   |
| `rtcStats`                         | Reports the statistics of AgoraRtcEngine.                    |
| `localVideoStats`                  | Reports the statistics of the uploading local video stream.  |
| `remoteVideoStats`                 | Reports the statistics of the video stream from each remote user/host. |
| `localAudioStats`| Reports the statistics of the local audio stream.|
| `remoteAudioStats`                 | Reports the statistics of the audio stream from each remote user/host. |
| `remoteVideoTransportStats`        | Reports the transport-layer statistics of each remote video stream. |
| `remoteAudioTransportStats`        | Reports the transport-layer statistics of each remote audio stream. |
| `audioDeviceStateChanged`          | Occurs when the audio device state changes.                  |
| `videoDeviceStateChanged`          | Occurs when the video device state changes.                  |
| `audioMixingStateChanged`          | Occurs when the state of the local user's audio mixing file changes. |
| `remoteAudioMixingBegin`           | Occurs when a remote user starts audio mixing.               |
| `remoteAudioMixingEnd`             | Occurs when a remote user finishes audio mixing.             |
| `audioEffectFinished`              | Occurs when the audio effect file playback finishes.         |
| `networkQuality`                   | Reports the network quality of each user.                    |
| `lastmileQuality`                  | Reports the last-mile network quality of the local user before the user joins a channel. |
| `lastmileProbeResult`              | Reports the last-mile network probe result.                  |
| `firstLocalAudioFrame`             | Occurs when the first local audio frame is sent.             |
| `firstRemoteAudioFrame`            | Occurs when the first remote audio frame is received.        |
| `firstRemoteAudioDecoded`          | Occurs when the engine receives the first audio frame from a specified remote user.|
| `firstLocalVideoFrame`             | Occurs when the first local video frame is rendered.             |
| `firstRemoteVideoFrame`            | Occurs when the first remote video frame is rendered.        |
| `videoSizeChanged`                 | Occurs when the video size or rotation information of a specified remote user changes. |
| `addStream`                        | Occurs when the SDK decodes the first remote audio frame for playback. |
| `removeStream`                     | Occurs when the remote user leaves the channel.              |
| `userMuteAudio`                    | Occurs when a remote user stops/resumes sending the audio stream. |
| `userMuteVideo`                    | Occurs when a remote user stops/resumes sending the video stream. |
| `userEnableVideo`                  | Occurs when a remote user enables/disables the video module. |
| `userEnableLocalVideo`             | Occurs when a remote user enables/disables the local video capture. |
| `cameraReady`                      | Occurs when the camera turns on and is ready to capture the video. |
| `videoStopped`                     | Occurs when the video stops playing.                         |
| `streamMessage`                    | Occurs when the local user receives a remote data stream within five seconds. |
| `streamMessageError`               | Occurs when the local user fails to receive the remote data stream. |
| `audioDeviceVolumeChanged`         | Occurs when the volume of the playback, microphone, or application changes. |
|`localAudioStateChanged`|Occurs when the local audio state changes.|
|`remoteAudioStateChanged`|Occurs when the remote audio state changes.|
|`localVideoStateChanged`| Occurs when the local video state changes.|
| `remoteVideoStateChanged`          | Occurs when the remote video stream state changes.           |
| `cameraFocusAreaChanged`           | Occurs when the camera focus area changes.                   |
| `cameraExposureAreaChanged`        | Occurs when the camera exposure area changes.                |
| `streamPublished`                  | Adds a CDN stream address.                                   |
| `streamUnpublished`                | Removes a CDN stream address.                                |
| `transcodingUpdated`               | Occurs when the publisher's transcoding settings are updated. |
| `streamInjectStatus`               | Reports the status of the injected online media stream.      |
|`channelMediaRelayState`|Occurs when the state of the media stream relay changes.|
|`channelMediaRelayEvent`| Reports events during the media stream relay.|
| `localPublishFallbackToAudioOnly`  | Occurs:<br><li>When the published media stream falls back to an audio-only stream due to poor network conditions.</li><br><li>When the published media stream switches back to the video after the network conditions improve.</li> |
| `remoteSubscribeFallbackToAudioOnly` | Occurs:<br/><li>When the remote media stream falls back to audio-only due to poor network conditions.</li><br><li>When the remote media stream switches back to the video after the network conditions improve.</li> |
| `videoSourceJoinedSuccess`         | Occurs when a user joins a channel. (The second instance)    |
| `videoSourceRequestNewToken`       | Occurs when the token expires. (The second instance)         |
| `videoSourceLeaveChannel`          | Occurs when a user leaves a channel. (The second instance)   |


<a name = "warn"></a>
## Warning Codes

Warning codes occur when the SDK encounters an error that might be recovered automatically. These are only notifications, and can generally be ignored.

| Warn Code | Description                       |
| ------ | ------------------------------------------------------------ |
| 8      | The specified view is invalid.<br>Specify a view when using the video call function. |
| 16     | Failed to initialize the video function, possibly caused by a lack of resources.<br/>The users cannot see the video while the voice communication is not affected. |
| 20     | The request is pending, usually due to some module not being ready, and the SDK postponed processing the request. |
| 103    | No channel resources are available.<br>Maybe because the server cannot allocate any channel resource.  |
| 104    | A timeout occurs when looking up the channel.<br>When joining a channel, the SDK looks up the specified channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server.|
| 105    | **DEPRECATED** Please use `10` in `ConnectionChangeReason` instead. <br/>The server rejects the request to look up the channel. <br/>The server cannot process this request or the request is illegal. |
| 106    | A timeout occurs when opening the channel. <br/>Once the specific channel is found, the SDK opens the channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server. |
| 107    | The server rejects the request to open the channel. <br/>The server cannot process this request or the request is illegal. |
| 111    | A timeout occurs when switching to the live video.   |
| 118    | A timeout occurs when setting the client role in the live broadcast profile.     |
| 119    | The client role a the live broadcast profile is unauthorized.   |
| 121    | The ticket to open the channel is invalid.           |
| 122    | Try connecting to another server.                   |
| 701    | An error occurs in opening the audio mixing file.                    |
| 1014   | Audio Device Module: A warning occurs in the playback device.                   |
| 1016   | Audio Device Module: A warning occurs in the recording device.     |
| 1019   | Audio Device Module: No valid audio data is collected.                |
| 1020   | Audio Device Module: The playback device fails.                         |
| 1021   | Audio Device Module: The recording device fails.              |
| 1025   | The audio recording or playback is interrupted by system events. |
| 1031   | Audio Device Module: The recorded audio voice is too low.               |
| 1032   | Audio Device Module: The playback audio voice is too low.           |
| 1040   | Audio device module: An exception occurs with the audio drive. <br/>Solutions:<li>Disable or re-enable the audio device.</li><li>Re-enable your device.</li><li>Update the sound card drive.</li> |
| 1051   | Audio Device Module: Howling is detected.            |
| 1052   | Audio Device Module: The device is in the glitch state.                 |
| 1053   | Audio Device Module: The underlying audio settings have changed.      |
| 1323   | Audio device module: No available playback device. Solution: Plug in the audio device. |
| 1324   | Audio device module: The capture device is released improperly. <br>Solutions:<li>Disable or re-enable the audio device.</li><li>Re-enable your device.</li><li>Update the sound card drive.</li> |
| 1610   | Super-resolution warning: The original video dimensions of the remote user exceed 640 × 480. |
| 1611   | Super-resolution warning: Another user is using super resolution.               |
| 1612   | The device is not supported.                        |

<a name = "error"></a>

## Error Codes

Error codes occur when the SDK encounters an error that cannot be recovered automatically without any application intervention. For example, the SDK returns an error if it fails to turn on the camera, and reminds the user not to use the camera.

| Error Code | Description                          |
| ------ | ------------------------------------------------------------ |
| 0      | No error occurs.                                                 |
| 1      | A general error occurs (no specified reason).                   |
| 2      | An invalid parameter is used. For example, the specific channel name includes illegal characters.        |
| 3      | The SDK module is not ready. <br/>Possible solutions:<li>Check the audio device.</li><li>Check the completeness of the application.</li><li>Re-initialize the RTC engine. </li> |
| 4      | The SDK does not support this function.       |
| 5      | The request is rejected.<br/>This is for internal SDK use only, and it does not return to the application through any method or callback.|
| 6      | The buffer size is not big enough to store the returned data.        |
| 7      | The SDK is not initialized before calling this method. |
| 9      | No permission exists. <br/>This is for internal SDK use only, and it does not return to the application through any method or callback. |
| 10     |  An API method timeout occurs.<br/>Some API methods require the SDK to return the execution result, and this error occurs if the request takes too long (more than 10 seconds) for the SDK to process. |
| 11     | The request is canceled.<br/>This is for internal SDK use only, and it does not return to the application through any method or callback.|
| 12     | The method is called too often. <br/>This is for internal SDK use only, and it does not return to the application through any method or callback.|
| 13     | The SDK fails to bind to the network socket.<br/>This is for internal SDK use only, and it does not return to the application through any method or callback. |
| 14     | The network is unavailable.<br/>This is for internal SDK use only, and it does not return to the application through any method or callback. |
| 15     | No network buffers are available. <br/>This is for internal SDK internal use only, and it does not return to the application through any method or callback. |
| 17     |  The request to join the channel is rejected.This error usually occurs when the user is already in the channel, and still calls the `joinChannel` method to join the channel.|
| 18     | The request to leave the channel is rejected.This error usually occurs:<li>When the user has left the channel and still calls `leaveChannel` to leave the channel. In this case, stop calling `leaveChannel`.</li><li>When the user has not joined the channel and still calls `leaveChannel` to leave the channel. In this case, no extra operation is needed.</li> |
| 19     | Resources are occupied and cannot be reused.                           |
| 20     | The SDK gives up the request due to too many requests.          |
| 21     | In Windows, specific firewall settings can cause the SDK to fail to initialize and crash.     |
| 22     | The application uses too much of the system resources and the SDK fails to allocate the resources. |
| 101    | The specified App ID is invalid.<br/>Please try to rejoin the channel with a valid App ID. |
| 102    | The specified channel name is invalid. <br/>Please try to rejoin the channel with a valid channel name.  |
| 109    | **DEPRECATED** Please use `9` in `ConnectionChangeReason` instead.<br/>The token expired due to one of the following reasons:<br/><li>Authorized Timestamp expired: The timestamp is represented by the number of seconds elapsed since 1/1/1970. The user can use the Token to access the Agora service within five minutes after the Token is generated. If the user does not access the Agora service after five minutes, this Token is no longer valid.</li><li>Call Expiration Timestamp expired: The timestamp is the exact time when a user can no longer use the Agora service (for example, when a user is forced to leave an ongoing call). When a value is set for the Call Expiration Timestamp, it does not mean that the token will expire, but that the user will be banned from the channel.</li> |
| 110    | **DEPRECATED** Please use `8` in `ConnectionChangeReason` instead.<br/>The token is invalid due to one of the following reasons:<br/><li>The App Certificate for the project is enabled in Console, but the user is still using the App ID. Once the App Certificate is enabled, the user must use a token.</li><li>The uid is mandatory, and users must set the same uid as the one set in the `joinChannel` method. </li> |
| 113    | The user is not in the channel when calling the `sendStreamMessage` method. |
| 114    | The size of the sent data is over 1024 bytes when the user calls the `sendStreamMessage` method. |
| 115    | The bitrate of the sent data exceeds the limit of 6 Kbps when the user calls the `sendStreamMessage` method.|
| 116    | Too many data streams (over 5 streams) are created when the user calls the `createDataStream` method.|
| 117    | The data stream transmission timed out.                    |
| 119    | Switching roles fail.<br/>Please try to rejoin the channel.                  |
| 120    | Decryption fails. The user may have used a different encryption password to join the channel. <br/>Check your settings or try rejoining the channel. |
| 123    | The client is banned by the server.                       |
| 124    | Incorrect watermark file parameter.                      |
| 125    | Incorrect watermark file path.      |
| 126    | Incorrect watermark file format.         |
| 127    | Incorrect watermark file information.          |
| 128    | Incorrect watermark file data format.             |
| 129    | An error occurs in reading the watermark file.                    |
| 130    | Encryption is enabled when the user calls the `addPublishStreamUrl` method (CDN live streaming does not support encrypted streams). |
| 134    | The User Account is invalid.                       |
| 151    | CDN related errors.<br/>Remove the original URL address and add a new one by calling the `removePublishStreamUrl` and `addPublishStreamUrl` methods. |
| 152    | The host publishes more than 10 URLs. <br/>Delete the unnecessary URLs before adding new ones. |
| 153    | The host manipulates other hosts' URLs. <br/>Check your app logic.|
| 154    | An error occurs in Agora's streaming server. <br/> Call the `addPublishStreamUrl` method to publish the streaming again.|
| 155    | The server fails to find the stream.          |
| 156    | The format of the RTMP stream URL is not supported. <br/>Check whether the URL format is correct.  |
| 1001   | Fails to load the media engine.                                  |
| 1002   | Fails to start the call after enabling the media engine.  |
| 1003   | **DEPRECATED** Please use `error (4)` in `localVideoStateChanged` instead.<br/>Fails to start the camera. |
| 1004   | Fails to start the video rendering module.                        |
| 1005   | Audio Device Module: A general error occurs (no specified reason). <br/>Check if the audio device is used by another application, or try rejoining the channel.|
| 1006   | Audio Device Module: An error occurs in using the Java resources.                   |
| 1007   | Audio Device Module: An error occurs in setting the sampling frequency.       |
| 1008   | Audio Device Module: An error occurs in initializing the playback device. |
| 1009   | Audio Device Module: An error occurs in starting the playback device. |
| 1010   | Audio Device Module: An error occurs in stopping the playback device.       |
| 1011   | Audio Device Module: An error occurs in initializing the recording device.|
| 1012   |  Audio Device Module: An error occurs in starting the recording device. |
| 1013   | Audio Device Module: An error occurs in stopping the recording device. |
| 1015   |  Audio Device Module: A playback error occurs. <br>Check your playback device and try rejoining the channel.|
| 1017   | Audio Device Module: A recording error occurs. |
| 1018   |  Audio Device Module: The recording fails.    |
| 1020   | Audio Device Module: Abnormal audio playback frequency.      |
| 1021   | Audio Device Module: Abnormal audio recording frequency.  |
| 1022   | Audio Device Module: An error occurs in initializing the loopback device.    |
| 1023   | Audio Device Module: An error occurs in starting the loopback device. |
| 1027   | Audio Device Module: No recording permission exists. <br/>Check if the recording permission is granted. |
| 1033   | Audio device module: The device is occupied.   |
| 1301   | Audio device module: An audio driver abnomality or a compatibility issue occurs. <br/>Solutions: Disable and restart the audio device, or reboot the device. |
| 1303   | Audio device module: A recording driver abnomality or a compatibility issue occurs. <br/>Solutions: Disable and restart the audio device, or reboot the device.|
| 1306   | Audio device module: A playout driver abnomality or a compatibility issue occurs. <br/>Solutions: Disable and restart the audio device, or reboot the device.|
| 1307   | Audio device module: No audio device is available. <br/>Solutions: Plug in a proper audio device.  |
| 1309   | Audio device module: An audio driver abnomality or a compatibility issue occurs.<br/>Solutions: Disable and restart the audio device, or reboot the device.|
| 1311   | Audio device module: Insufficient system memory or poor device performance.<br/>Solutions: reboot the device or replace the device. |
| 1314   | Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver.</li> |
| 1319   | Audio device module: Insufficient system memory or poor device performance. <br/>Solutions: reboot the device or replace the device. |
| 1320   | Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Replace the device.</li>|
| 1322   |  Audio device module: No audio sampling device is available. <br/>Solutions: Plug in a proper recording device. |
| 1323   | Audio device module: No audio playout device is available. <br/>Solutions: Plug in a proper playback device.|
| 1351   | Audio device module: An audio driver abnormality or a compatibility issue occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver.</li> |
| 1353   | Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver.</li>  |
| 1354   | Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver. |
| 1355   |Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver. |
| 1356   | Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver. |
| 1357   | Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver. |
| 1358   | Audio device module: An audio driver abnormality occurs. <br/>Solutions:<li>Disable and then re-enable the audio device.</li><li>reboot the device.</li><li>Upgrade your audio card driver. |
| 1359   | Audio Device Module: No recording device exists. |
| 1360   | Audio Device Module: No playback device exists.    |
| 1501   | Video Device Module: The camera is unauthorized. |
| 1502   | **DEPRECATED** Please use `error (3)` in  `localVideoStateChanged` instead.<br/> Video Device Module: The camera is in use. |
| 1600   | Video Device Module: An unknown error occurs.              |
| 1601   | Video Device Module: An error occurs in initializing the video encoder. <br/>The error is a serious error, please try to rejoin the channel.|
| 1602   | Video Device Module: An error occurs in encoding.<br/>The error is a serious error, please try to rejoin the channel. |
| 1603   | Video Device Module: An error occurs in setting the video encoder.     |
