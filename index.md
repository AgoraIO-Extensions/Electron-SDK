This Agora Electron SDK is developed upon the Native SDK for macOS and the Native SDK for Windows, with the Node.js C++ plug-in units. The Electron SDK supports all the functions of the Agora Native SDK. Agora provides ensured quality of experience (QoE) for worldwide Internet-based voice and video communications through a virtual global network optimized on all platforms.

* The AgoraRtcEngine calss provides the main methods that can be invoked by your application.
* The Events class enables callbacks to your application.

## Methods

### Channel management

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.initialize initialize}                 | Initializes an AgoraRtcEngine instance.                      |
| {@link AgoraRtcEngine.release release}                       | Releases an AgoraRtcEngine instance.                         |
| {@link AgoraRtcEngine.setChannelProfile setChannelProfile}   | Sets the channel profile.                                    |
| {@link AgoraRtcEngine.setClientRole setClientRole}           | Sets the user role (Live Broadcast only).                    |
| {@link AgoraRtcEngine.joinChannel joinChannel}               | Allows a user to join a channel. |
| {@link AgoraRtcEngine.switchChannel switchChannel}|Switches to a different channel (Live Broadcast only).|
| {@link AgoraRtcEngine.leaveChannel leaveChannel}             | Allows a user to leave a channel.                            |
| {@link AgoraRtcEngine.subscribe subscribe}                   | Subscribes to the remote user and initializes the video sink |
| {@link AgoraRtcEngine.renewToken renewToken}                 | Renews the token.                                            |
| {@link AgoraRtcEngine.enableWebSdkInteroperability enableWebSdkInteroperability} | Enables interoperability with the Agora Web SDK.             |
| {@link AgoraRtcEngine.getConnectionState getConnectionState} | Gets the connection state of the app.                        |
| {@link AgoraRtcEngine.on on}                                 | Monitors the events during AgoraRtcEngine runtime            |
| {@link AgoraRtcEngine.off off}                               | Stops monitoring the events during AgoraRtcEngine runtime    |

### User information management

| Method                                                       | Description                                               |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| {@link AgoraRtcEngine.registerLocalUserAccount registerLocalUserAccount} | Registers the local user account.                         |
| {@link AgoraRtcEngine.joinChannelWithUserAccount joinChannelWithUserAccount} | Joins the channel with a user account.                    |
| {@link AgoraRtcEngine.getUserInfoByUid getUserInfoByUid}     | Gets the user information by passing in the user ID.      |
| {@link AgoraRtcEngine.getUserInfoByUserAccount getUserInfoByUserAccount} | Gets the user information by passing in the user account. |

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
| {@link AgoraRtcEngine.muteRemoteAudioStream muteRemoteAudioStream} | Stops/Resumes receving a specified remote audio stream.      |
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
| {@link videosourceStartScreenCaptureByWindow videosourceStartScreenCaptureByWindow} | Shares the whole or part of a window by specifying the window ID. |
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

### CDN publisher (live Broadcast only)

| Method                                                       | Description                                   |
| ------------------------------------------------------------ | --------------------------------------------- |
| {@link AgoraRtcEngine.setLiveTranscoding setLiveTranscoding} | Sets the video layout and audio for CDN live. |
| {@link AgoraRtcEngine.addPublishStreamUrl addPublishStreamUrl} | Adds a CDN stream address.                    |
| {@link AgoraRtcEngine.removePublishStreamUrl removePublishStreamUrl} | Removes a CDN stream address.                 |

### Channel Media Relay

| Method                                                       | Description                                        |
| ------------------------------------------------------------ | -------------------------------------------------- |
| {@link AgoraRtcEngine.startChannelMediaRelay startChannelMediaRelay} | EStarts to relay media streams across channels. |
| {@link AgoraRtcEngine.updateChannelMediaRelay updateChannelMediaRelay} | Updates the channels for media stream relay.|
| {@link AgoraRtcEngine.stopChannelMediaRelay stopChannelMediaRelay} | Stops the media stream relay.|


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
| {@link AgoraRtcEngine.enableDualStreamMode enableDualStreamMode} | Sets the stream mode to single- (default) or dual-stream mode. |
| {@link AgoraRtcEngine.setRemoteVideoStreamType setRemoteVideoStreamType} | Sets the remote user’s video stream type received by the local user when the remote user sends dual streams. |
| {@link AgoraRtcEngine.setRemoteDefaultVideoStreamType setRemoteDefaultVideoStreamType} | Sets the default video-stream type for the video received by the local user when the remote user sends dual streams. |

### Stream fallback

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

### External audio data (push-mode only)

| Method                                                       | Description                           |
| ------------------------------------------------------------ | ------------------------------------- |
| {@link AgoraRtcEngine.setExternalAudioSource setExternalAudioSource} | Configures the external audio source. |

### Raw audio data

| Method                                                       | Description                      |
| ------------------------------------------------------------ | -------------------------------- |
| {@link AgoraRtcEngine.setRecordingAudioFrameParameters setRecordingAudioFrameParameters} | Sets the audio recording format. |
| {@link AgoraRtcEngine.setPlaybackAudioFrameParameters setPlaybackAudioFrameParameters} | Sets the audio playback format.  |
| {@link AgoraRtcEngine.setMixedAudioFrameParameters setMixeAudioFrameParameters} | Sets the mixed audio format.     |

### Encryption

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {@link AgoraRtcEngine.setEncryptionSecret setEncryptionSecret} | Enables built-in encryption with an encryption password before joining a channel. |
| {@link AgoraRtcEngine.setEncryptionMode setEncryptionMode}|Sets the built-in encryption mode.|

### Inject an online media stream

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
| warning                          | Occurs when a warning occurs.                                |
| error                            | Occurs when an error occurs.                                 |
| joinedChannel                    | Occurs when a user joins a channel.                          |
| rejoinedChannel                  | Occurs when a user rejoins a channel.                        |
| leaveChannel                     | Occurs when a user leaves a channel.                         |
| clientRoleChanged                | Occurs when the user role in a Live Broadcast changes.       |
| userJoined                       | Occurs when a remote user joins a channel.                   |
| connectionStateChanged           | Occurs when the network connection state changes.            |
| connectionLost                   | Occurs when the network connection state changes.            |
| apiCallExecuted                  | Occurs when an API method is executed.                       |
| tokenPrivilegeWillExpire         | Occurs when the token expires in 30 seconds.                 |
| requestChannelKey                | Occurs when the Channel Key expires.                         |
| localUserRegistered              | Occurs when the local user successfully registers a user account. |
| userInfoUpdated                  | Occurs when the SDK gets the user ID and user account of the remote user. |
| microphoneEnabled                | Occurs when the state of the microphone changes.             |
| groupAudioVolumeIndication       | Occurs when the state of the microphone changes.             |
| activeSpeaker                    | Reports which user is the loudest speaker.                   |
| rtcStats                         | Reports the statistics of AgoraRtcEngine.                    |
| localVideoStats                  | Reports the statistics of the uploading local video stream.  |
| remoteVideoStats                 | Reports the statistics of the video stream from each remote user/host. |
| localAudioStats| Reports the statistics of the local audio stream.|
| remoteAudioStats                 | Reports the statistics of the audio stream from each remote user/host. |
| remoteVideoTransportStats        | Reports the transport-layer statistics of each remote video stream. |
| remoteAudioTransportStats        | Reports the transport-layer statistics of each remote audio stream. |
| audioDeviceStateChanged          | Occurs when the audio device state changes.                  |
| videoDeviceStateChanged          | Occurs when the video device state changes.                  |
| audioMixingStateChanged          | Occurs when the state of the local user's audio mixing file changes. |
| remoteAudioMixingBegin           | Occurs when a remote user starts audio mixing.               |
| remoteAudioMixingEnd             | Occurs when a remote user finishes audio mixing.             |
| audioEffectFinished              | Occurs when the audio effect file playback finishes.         |
| networkQuality                   | Reports the network quality of each user.                    |
| lastmileQuality                  | Reports the last-mile network quality of the local user before the user joins a channel. |
| lastmileProbeResult              | Reports the last-mile network probe result.                  |
| firstLocalAudioFrame             | Occurs when the first local audio frame is sent.             |
| firstRemoteAudioFrame            | Occurs when the first remote audio frame is received.        |
| firstRemoteAudioDecoded          | Occurs when the engine receives the first audio frame from a specified remote user.|
| firstLocalVideoFrame             | Occurs when the first local video frame is sent.             |
| firstRemoteVideoFrame            | Occurs when the first remote video frame is rendered.        |
| videoSizeChanged                 | Occurs when the video size or rotation information of a specified remote user changes. |
| addStream                        | Occurs when the SDK decodes the first remote audio frame for playback. |
| removeStream                     | Occurs when the remote user leaves the channel.              |
| userMuteAudio                    | Occurs when a remote user stops/resumes sending the audio stream. |
| userMuteVideo                    | Occurs when a remote user stops/resumes sending the video stream. |
| userEnableVideo                  | Occurs when a remote user enables/disables the video module. |
| userEnableLocalVideo             | Occurs when a remote user enables/disables the local video capture. |
| cameraReady                      | Occurs when the camera turns on and is ready to capture the video. |
| videoStopped                     | Occurs when the video stops playing.                         |
| streamMessage                    | Occurs when the local user receives a remote data stream within five seconds. |
| streamMessageError               | Occurs when the local user fails to receive the remote data stream. |
| audioDeviceVolumeChanged         | Occurs when the volume of the playback, microphone, or application changes. |
|localAudioStateChanged|Occurs when the local audio state changes.|
|remoteAudioStateChanged|Occurs when the remote audio state changes.|
|localVideoStateChanged| Occurs when the local video state changes.|
| remoteVideoStateChanged          | Occurs when the remote video stream state changes.           |
| cameraFocusAreaChanged           | Occurs when the camera focus area changes.                   |
| cameraExposureAreaChanged        | Occurs when the camera exposure area changes.                |
| streamPublished                  | Adds a CDN stream address.                                   |
| streamUnpublished                | Removes a CDN stream address.                                |
| transcodingUpdated               | Occurs when the publisher's transcoding settings are updated. |
| streamInjectStatus               | Reports the status of the injected online media stream.      |
|channelMediaRelayState|Occurs when the state of the media stream relay changes.|
|channelMediaRelayEvent| Reports events during the media stream relay.|
| localPublishFallbackToAudioOnly  | Occurs:<br><li>When the published media stream falls back to an audio-only stream due to poor network conditions.</li><br><li>When the published media stream switches back to the video after the network conditions improve.</li> |
| remoteSubscribeFallbackToAudioOnly | Occurs:<br/><li>When the remote media stream falls back to audio-only due to poor network conditions.</li><br><li>When the remote media stream switches back to the video after the network conditions improve.</li> |
| videoSourceJoinedSuccess         | Occurs when a user joins a channel. (The second instance)    |
| videoSourceRequestNewToken       | Occurs when the token expires. (The second instance)         |
| videoSourceLeaveChannel          | Occurs when a user leaves a channel. (The second instance)   |

<a name = "error"></a>

## Error codes and warning codes

Reports an error code or a warning code during SDK runtime:

* **Error Code**: In most cases, the SDK cannot fix the issue and resume running. The SDK requires the application to take action or informs the user about the issue.
* **Warning Code**: In most cases, the application can ignore the warning reported by the SDK because the SDK can usually fix the issue and resume running.

### Error codes

<table>
<colgroup>
<col/>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>Error code</strong></td>
<td><strong>Enumerator</strong></td>
<td><strong>Description</strong></td>
</tr>
<tr><td>ERR_OK</td>
<td>0</td>
<td>No error occurs.</td>
</tr>
<tr><td>ERR_FAILED</td>
<td>1</td>
<td> A general error occurs (no specified reason).</td>
</tr>
<tr><td>ERR_INVALID_ARGUMENT</td>
<td>2</td>
<td>An invalid parameter is used. For example, the specific channel name includes illegal characters.</td>
</tr>
<tr><td>ERR_NOT_READY</td>
<td>3</td>
<td>The SDK module is not ready. </td>
</tr>
<tr><td>ERR_NOT_SUPPORTED</td>
<td>4</td>
<td> The SDK does not support this function.</td>
</tr>
<tr><td>ERR_REFUSED</td>
<td>5</td>
<td> The request is rejected. This is for internal SDK use only, and it does not return to the application through any method or callback.</td>
</tr>
<tr><td>ERR_BUFFER_TOO_SMALL</td>
<td>6</td>
<td>The buffer size is not big enough to store the returned data.</td>
</tr>
<tr><td>ERR_NOT_INITIALIZED</td>
<td>7</td>
<td>The SDK is not initialized before calling this method.</td>
</tr>
<tr><td>ERR_NO_PERMISSION</td>
<td>9</td>
<td>No permission exists. This is for internal SDK use only, and it does not return to the application through any method or callback.</td>
</tr>
<tr><td>ERR_TIMEDOUT</td>
<td>10</td>
<td>An API method timeout occurs. Some API methods require the SDK to return the execution result, and this error occurs if the request takes too long (more than 10 seconds) for the SDK to process.</td>
</tr>
<tr><td>ERR_CANCELED</td>
<td>11</td>
<td>The request is canceled. This is for internal SDK use only, and it does not return to the application through any method or callback.</td>
</tr>
<tr><td>ERR_TOO_OFTEN</td>
<td>12</td>
<td>The method is called too often. This is for internal SDK use only, and it does not return to the application through any method or callback.</td>
</tr>
<tr><td>ERR_BIND_SOCKET</td>
<td>13</td>
<td>The SDK fails to bind to the network socket. This is for internal SDK use only, and it does not return to the application through any method or callback.</td>
</tr>
<tr><td>ERR_NET_DOWN</td>
<td>14</td>
<td>The network is unavailable. This is for internal SDK use only, and it does not return to the application through any method or callback.</td>
</tr>
<tr><td>ERR_NET_NOBUFS</td>
<td>15</td>
<td>No network buffers are available. This is for internal SDK internal use only, and it does not return to the application through any method or callback.</td>
</tr>
<tr><td>ERR_JOIN_CHANNEL_REJECTED</td>
<td>17</td>
<td> The request to join the channel is rejected. This error usually occurs when the user is already in the channel, and still calls the method to join the channel.</td>
</tr>
<tr><td>ERR_LEAVE_CHANNEL_REJECTED</td>
<td>18</td>
<td>The request to leave the channel is rejected. This error usually occurs when the user has left the channel and still calls the method to leave the channel.</td>
</tr>
<tr><td>ERR_ALREADY_IN_USE</td>
<td>19</td>
<td>Resources are occupied and cannot be reused.</td>
</tr>
<tr><td>ERR_ABORTED</td>
<td>20</td>
<td>The SDK gives up the request due to too many requests.</td>
</tr>
<tr><td>ERR_INIT_NET_ENGINE</td>
<td>21</td>
<td>In Windows, specific firewall settings can cause the SDK to fail to initialize and crash.</td>
</tr>
<tr><td>ERR_INVALID_VENDOR_KEY</td>
<td>101</td>
<td>The specified App ID is invalid. </td>
</tr>
<tr><td>ERR_INVALID_CHANNEL_NAME</td>
<td>102</td>
<td>The specified channel name is invalid.</td>
</tr>
<tr><td>ERR_NOT_IN_CHANNEL</td>
<td>113</td>
<td>The user is not in the channel.</td>
</tr>
<tr><td>ERR_SIZE_TOO_LARGE</td>
<td>114</td>
<td>The size of the sent data is over 1024 bytes.</td>
</tr>
<tr><td>ERR_BITRATE_LIMIT</td>
<td>115</td>
<td>The bitrate of the sent data exceeds the limit of 6 Kbps.</td>
</tr>
<tr><td>ERR_SET_CLIENT_ROLE_NOT_AUTHORIZED</td>
<td>119</td>
<td>Switching roles fail.</td>
</tr>
<tr><td>ERR_LOAD_MEDIA_ENGINE</td>
<td>1001</td>
<td>Fails to load the media engine.</td>
</tr>
<tr><td>ERR_START_CALL</td>
<td>1002</td>
<td>Fails to start the call after enabling the media engine.</td>
</tr>
<tr><td>ERR_ADM_GENERAL_ERROR</td>
<td>1005</td>
<td>A general error occurs in the Audio Device Module (no specified reason).</td>
</tr>
<tr><td>ERR_ADM_JAVA_RESOURCE</td>
<td>1006</td>
<td> Audio Device Module: An error occurs in using the Java resources.</td>
</tr>
<tr><td>ERR_ADM_SAMPLE_RATE</td>
<td>1007</td>
<td>Audio Device Module: An error occurs in setting the sampling frequency.</td>
</tr>
<tr><td>ERR_ADM_INIT_PLAYOUT</td>
<td>1008</td>
<td>Audio Device Module: An error occurs in initializing the playback device.</td>
</tr>
<tr><td>ERR_ADM_START_PLAYOUT</td>
<td>1009</td>
<td>Audio Device Module: An error occurs in starting the playback device.</td>
</tr>
<tr><td>ERR_ADM_STOP_PLAYOUT</td>
<td>1010</td>
<td>Audio Device Module: An error occurs in stopping the playback device.</td>
</tr>
<tr><td>ERR_ADM_INIT_RECORDING</td>
<td>1011</td>
<td>Audio Device Module: An error occurs in initializing the recording device.</td>
</tr>
<tr><td>ERR_ADM_START_RECORDING</td>
<td>1012</td>
<td>Audio Device Module: An error occurs in starting the recording device.</td>
</tr>
<tr><td>ERR_ADM_STOP_RECORDING</td>
<td>1013</td>
<td>Audio Device Module: An error occurs in stopping the recording device.</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_PLAYOUT_ERROR</td>
<td>1015</td>
<td>Audio Device Module: A playback error occurs.</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_RECORDING_ERROR</td>
<td>1017</td>
<td>Audio Device Module: A recording error occurs.</td>
</tr>
<tr><td>ERR_ADM_RECORD_AUDIO_FAILED</td>
<td>1018</td>
<td>Audio Device Module: Fails to record.</td>
</tr>
<tr><td>ERR_ADM_INIT_LOOPBACK</td>
<td>1022</td>
<td>Audio Device Module: An error occurs in initializing the loopback device.</td>
</tr>
<tr><td>ERR_ADM_START_LOOPBACK</td>
<td>1023</td>
<td>Audio Device Module: An error occurs in starting the loopback device.</td>
</tr>
<tr><td>ERR_ADM_NO_PERMISSION</td>
<td>1027</td>
<td>Audio Device Module: No recording permission exists. </td>
</tr>
</tbody>
</table>


### Warning codes

<table>
<colgroup>
<col/>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>Warning code</strong></td>
<td><strong>Enumerator</strong></td>
<td><strong>Description</strong></td>
</tr>
<tr><td>WARN_PENDING</td>
<td>20</td>
<td>The request is pending, usually due to some module not being ready, and the SDK postponed processing the request.</td>
</tr>
<tr><td>WARN_NO_AVAILABLE_CHANNEL</td>
<td>103</td>
<td>No channel resources are available. Maybe because the server cannot allocate any channel resource.</td>
</tr>
<tr><td>WARN_LOOKUP_CHANNEL_TIMEOUT</td>
<td>104</td>
<td>A timeout occurs when looking up the channel. When joining a channel, the SDK looks up the specified channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server.</td>
</tr>
<tr><td>WARN_LOOKUP_CHANNEL_REJECTED</td>
<td>105</td>
<td>The server rejects the request to look up the channel. The server cannot process this request or the request is illegal.</td>
</tr>
<tr><td>WARN_OPEN_CHANNEL_TIMEOUT</td>
<td>106</td>
<td> A timeout occurs when opening the channel. Once the specific channel is found, the SDK opens the channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server.</td>
</tr>
<tr><td>WARN_OPEN_CHANNEL_REJECTED</td>
<td>107</td>
<td>The server rejects the request to open the channel. The server cannot process this request or the request is illegal.</td>
</tr>
<tr><td>WARN_SET_CLIENT_ROLE_TIMEOUT</td>
<td>118</td>
<td>A timeout occurs when setting the client role in the live broadcast profile.</td>
</tr>
<tr><td>WARN_AUDIO_MIXING_OPEN_ERROR</td>
<td>701</td>
<td>An error occurs in opening the audio mixing file.</td>
</tr>
<tr><td>WARN_ADM_RUNTIME_PLAYOUT_WARNING</td>
<td>1014</td>
<td>Audio Device Module: a warning occurs in the playback device.</td>
</tr>
<tr><td>WARN_ADM_RUNTIME_RECORDING_WARNING</td>
<td>1016</td>
<td>Audio Device Module: a warning occurs in the recording device.</td>
</tr>
<tr><td>WARN_ADM_RECORD_AUDIO_SILENCE</td>
<td>1019</td>
<td>Audio Device Module: no valid audio data is collected.</td>
</tr>
<tr><td>WARN_ADM_PLAYOUT_MALFUNCTION</td>
<td>1020</td>
<td>Audio Device Module: the playback device fails.</td>
</tr>
<tr><td>WARN_ADM_RECORD_MALFUNCTION</td>
<td>1021</td>
<td>Audio Device Module: the recording device fails.</td>
</tr>
<tr><td>WARN_ADM_RECORD_MALFUNCTION</td>
<td>1031</td>
<td>Audio Device Module: the recorded audio voice is too low.</td>
</tr>
<tr><td>WARN_ADM_HOWLING</td>
<td>1051</td>
<td>Audio Device Module: howling is detected.</td>
</tr>
</tbody>
</table>

