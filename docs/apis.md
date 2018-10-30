<a name="AgoraRtcEngine"></a>

## AgoraRtcEngine
**Kind**: global class  

* [AgoraRtcEngine](#AgoraRtcEngine)
    * [.initRender(key, view)](#AgoraRtcEngine+initRender)
    * [.destroyRender(key, onFailure)](#AgoraRtcEngine+destroyRender)
    * [.initialize(appid)](#AgoraRtcEngine+initialize) ⇒ <code>int</code>
    * [.getVersion()](#AgoraRtcEngine+getVersion) ⇒ <code>string</code>
    * [.getErrorDescription(errorCode)](#AgoraRtcEngine+getErrorDescription) ⇒ <code>string</code>
    * [.joinChannel(token, channel, info, uid)](#AgoraRtcEngine+joinChannel) ⇒ <code>int</code>
    * [.leaveChannel()](#AgoraRtcEngine+leaveChannel) ⇒ <code>int</code>
    * [.setHighQualityAudioParameters(fullband, stereo, fullBitrate)](#AgoraRtcEngine+setHighQualityAudioParameters) ⇒ <code>int</code>
    * [.subscribe(uid, view)](#AgoraRtcEngine+subscribe) ⇒ <code>int</code>
    * [.setupLocalVideo(view)](#AgoraRtcEngine+setupLocalVideo) ⇒ <code>int</code>
    * [.setVideoRenderDimension(rendertype, uid, width, height)](#AgoraRtcEngine+setVideoRenderDimension)
    * [.setVideoRenderFPS(fps)](#AgoraRtcEngine+setVideoRenderFPS)
    * [.setVideoRenderHighFPS(fps)](#AgoraRtcEngine+setVideoRenderHighFPS)
    * [.addVideoRenderToHighFPS(uid)](#AgoraRtcEngine+addVideoRenderToHighFPS)
    * [.remoteVideoRenderFromHighFPS(uid)](#AgoraRtcEngine+remoteVideoRenderFromHighFPS)
    * [.setupViewContentMode(uid, mode)](#AgoraRtcEngine+setupViewContentMode) ⇒ <code>int</code>
    * [.renewToken(newtoken)](#AgoraRtcEngine+renewToken) ⇒ <code>int</code>
    * [.setChannelProfile(profile)](#AgoraRtcEngine+setChannelProfile) ⇒ <code>int</code>
    * [.setClientRole(role, permissionKey)](#AgoraRtcEngine+setClientRole) ⇒ <code>int</code>
    * [.startEchoTest()](#AgoraRtcEngine+startEchoTest) ⇒ <code>int</code>
    * [.stopEchoTest()](#AgoraRtcEngine+stopEchoTest) ⇒ <code>int</code>
    * [.enableLastmileTest()](#AgoraRtcEngine+enableLastmileTest) ⇒ <code>int</code>
    * [.disableLastmileTest()](#AgoraRtcEngine+disableLastmileTest) ⇒ <code>int</code>
    * [.enableVideo()](#AgoraRtcEngine+enableVideo) ⇒ <code>int</code>
    * [.disableVideo()](#AgoraRtcEngine+disableVideo) ⇒ <code>int</code>
    * [.startPreview()](#AgoraRtcEngine+startPreview) ⇒ <code>int</code>
    * [.stopPreview()](#AgoraRtcEngine+stopPreview) ⇒ <code>int</code>
    * [.setVideoProfile(profile, [swapWidthAndHeight])](#AgoraRtcEngine+setVideoProfile) ⇒ <code>int</code>
    * [.enableAudio()](#AgoraRtcEngine+enableAudio) ⇒ <code>int</code>
    * [.disableAudio()](#AgoraRtcEngine+disableAudio) ⇒ <code>int</code>
    * [.setAudioProfile(profile, scenario)](#AgoraRtcEngine+setAudioProfile) ⇒ <code>int</code>
    * [.setVideoQualityParameters(preferFrameRateOverImageQuality)](#AgoraRtcEngine+setVideoQualityParameters) ⇒ <code>int</code>
    * [.setEncryptionSecret(secret)](#AgoraRtcEngine+setEncryptionSecret) ⇒ <code>int</code>
    * [.muteLocalAudioStream(mute)](#AgoraRtcEngine+muteLocalAudioStream) ⇒ <code>int</code>
    * [.muteAllRemoteAudioStreams(mute)](#AgoraRtcEngine+muteAllRemoteAudioStreams) ⇒ <code>int</code>
    * [.muteRemoteAudioStream(uid, mute)](#AgoraRtcEngine+muteRemoteAudioStream) ⇒ <code>int</code>
    * [.muteLocalVideoStream(mute)](#AgoraRtcEngine+muteLocalVideoStream) ⇒ <code>int</code>
    * [.enableLocalVideo(enable)](#AgoraRtcEngine+enableLocalVideo) ⇒ <code>int</code>
    * [.muteAllRemoteVideoStreams(mute)](#AgoraRtcEngine+muteAllRemoteVideoStreams) ⇒ <code>int</code>
    * [.enableAudioVolumeIndication(interval, smooth)](#AgoraRtcEngine+enableAudioVolumeIndication) ⇒ <code>int</code>
    * [.muteRemoteVideoStream(uid, mute)](#AgoraRtcEngine+muteRemoteVideoStream) ⇒ <code>int</code>
    * [.setInEarMonitoringVolume(volume)](#AgoraRtcEngine+setInEarMonitoringVolume) ⇒ <code>int</code>
    * [.pauseAudio()](#AgoraRtcEngine+pauseAudio) ⇒ <code>int</code>
    * [.resumeAudio()](#AgoraRtcEngine+resumeAudio) ⇒ <code>int</code>
    * [.setLogFile(filepath)](#AgoraRtcEngine+setLogFile) ⇒ <code>int</code>
    * [.setLogFilter(filter)](#AgoraRtcEngine+setLogFilter) ⇒ <code>int</code>
    * [.enableDualStreamMode(enable)](#AgoraRtcEngine+enableDualStreamMode) ⇒ <code>int</code>
    * [.setRemoteVideoStreamType(uid, streamType)](#AgoraRtcEngine+setRemoteVideoStreamType) ⇒ <code>int</code>
    * [.setRemoteDefaultVideoStreamType(streamType)](#AgoraRtcEngine+setRemoteDefaultVideoStreamType) ⇒ <code>int</code>
    * [.enableWebSdkInteroperability(enable)](#AgoraRtcEngine+enableWebSdkInteroperability) ⇒ <code>int</code>
    * [.setLocalVideoMirrorMode(mirrortype)](#AgoraRtcEngine+setLocalVideoMirrorMode) ⇒ <code>int</code>
    * [.setExternalAudioSource(enabled, samplerate, channels)](#AgoraRtcEngine+setExternalAudioSource) ⇒ <code>int</code>
    * [.getVideoDevices()](#AgoraRtcEngine+getVideoDevices) ⇒ <code>array</code>
    * [.setVideoDevice(deviceid)](#AgoraRtcEngine+setVideoDevice) ⇒ <code>int</code>
    * [.getCurrentVideoDevice()](#AgoraRtcEngine+getCurrentVideoDevice) ⇒ <code>object</code>
    * [.startVideoDeviceTest()](#AgoraRtcEngine+startVideoDeviceTest) ⇒ <code>int</code>
    * [.stopVideoDeviceTest()](#AgoraRtcEngine+stopVideoDeviceTest) ⇒ <code>int</code>
    * [.getAudioPlaybackDevices()](#AgoraRtcEngine+getAudioPlaybackDevices) ⇒ <code>array</code>
    * [.setAudioPlaybackDevice(deviceid)](#AgoraRtcEngine+setAudioPlaybackDevice) ⇒ <code>int</code>
    * [.getCurrentAudioPlaybackDevice()](#AgoraRtcEngine+getCurrentAudioPlaybackDevice) ⇒ <code>object</code>
    * [.setAudioPlaybackVolume(volume)](#AgoraRtcEngine+setAudioPlaybackVolume) ⇒ <code>int</code>
    * [.getAudioPlaybackVolume()](#AgoraRtcEngine+getAudioPlaybackVolume) ⇒ <code>int</code>
    * [.getAudioRecordingDevices()](#AgoraRtcEngine+getAudioRecordingDevices) ⇒ <code>array</code>
    * [.setAudioRecordingDevice(deviceid)](#AgoraRtcEngine+setAudioRecordingDevice) ⇒ <code>int</code>
    * [.getCurrentAudioRecordingDevice()](#AgoraRtcEngine+getCurrentAudioRecordingDevice) ⇒ <code>object</code>
    * [.getAudioRecordingVolume()](#AgoraRtcEngine+getAudioRecordingVolume) ⇒ <code>int</code>
    * [.setAudioRecordingVolume(volume)](#AgoraRtcEngine+setAudioRecordingVolume) ⇒ <code>int</code>
    * [.startAudioPlaybackDeviceTest(filepath)](#AgoraRtcEngine+startAudioPlaybackDeviceTest) ⇒ <code>int</code>
    * [.stopAudioPlaybackDeviceTest()](#AgoraRtcEngine+stopAudioPlaybackDeviceTest) ⇒ <code>int</code>
    * [.enableLoopbackRecording([enable])](#AgoraRtcEngine+enableLoopbackRecording)
    * [.startAudioRecordingDeviceTest(indicateInterval)](#AgoraRtcEngine+startAudioRecordingDeviceTest) ⇒ <code>int</code>
    * [.stopAudioRecordingDeviceTest()](#AgoraRtcEngine+stopAudioRecordingDeviceTest) ⇒ <code>int</code>
    * [.getAudioPlaybackDeviceMute()](#AgoraRtcEngine+getAudioPlaybackDeviceMute) ⇒ <code>boolean</code>
    * [.setAudioPlaybackDeviceMute(mute)](#AgoraRtcEngine+setAudioPlaybackDeviceMute) ⇒ <code>int</code>
    * [.getAudioRecordingDeviceMute()](#AgoraRtcEngine+getAudioRecordingDeviceMute) ⇒ <code>boolean</code>
    * [.setAudioRecordingDeviceMute(mute)](#AgoraRtcEngine+setAudioRecordingDeviceMute) ⇒ <code>int</code>
    * [.videoSourceInitialize(appid)](#AgoraRtcEngine+videoSourceInitialize) ⇒ <code>int</code>
    * [.setupLocalVideoSource(view)](#AgoraRtcEngine+setupLocalVideoSource)
    * [.videoSourceEnableWebSdkInteroperability(enabled)](#AgoraRtcEngine+videoSourceEnableWebSdkInteroperability) ⇒ <code>int</code>
    * [.videoSourceJoin(token, cname, info, uid)](#AgoraRtcEngine+videoSourceJoin) ⇒ <code>int</code>
    * [.videoSourceLeave()](#AgoraRtcEngine+videoSourceLeave) ⇒ <code>int</code>
    * [.videoSourceRenewToken(token)](#AgoraRtcEngine+videoSourceRenewToken) ⇒ <code>int</code>
    * [.videoSourceSetChannelProfile(profile)](#AgoraRtcEngine+videoSourceSetChannelProfile) ⇒ <code>int</code>
    * [.videoSourceSetVideoProfile(profile, [swapWidthAndHeight])](#AgoraRtcEngine+videoSourceSetVideoProfile) ⇒ <code>int</code>
    * [.getScreenWindowsInfo()](#AgoraRtcEngine+getScreenWindowsInfo) ⇒ <code>array</code>
    * [.startScreenCapture2(wndid, captureFreq, rect, bitrate)](#AgoraRtcEngine+startScreenCapture2) ⇒ <code>int</code>
    * [.stopScreenCapture2()](#AgoraRtcEngine+stopScreenCapture2) ⇒ <code>int</code>
    * [.startScreenCapturePreview()](#AgoraRtcEngine+startScreenCapturePreview) ⇒ <code>int</code>
    * [.stopScreenCapturePreview()](#AgoraRtcEngine+stopScreenCapturePreview) ⇒ <code>int</code>
    * [.videoSourceEnableDualStreamMode(enable)](#AgoraRtcEngine+videoSourceEnableDualStreamMode) ⇒ <code>int</code>
    * [.videoSourceSetParameters(parameter)](#AgoraRtcEngine+videoSourceSetParameters) ⇒ <code>int</code>
    * [.videoSourceRelease()](#AgoraRtcEngine+videoSourceRelease) ⇒ <code>int</code>
    * [.startScreenCapture(windowId, captureFreq, rect, bitrate)](#AgoraRtcEngine+startScreenCapture) ⇒ <code>int</code>
    * [.stopScreenCapture()](#AgoraRtcEngine+stopScreenCapture) ⇒ <code>int</code>
    * [.updateScreenCaptureRegion(rect)](#AgoraRtcEngine+updateScreenCaptureRegion) ⇒ <code>int</code>
    * [.startAudioMixing(filepath, loopback, replace, cycle)](#AgoraRtcEngine+startAudioMixing) ⇒ <code>int</code>
    * [.stopAudioMixing()](#AgoraRtcEngine+stopAudioMixing) ⇒ <code>int</code>
    * [.pauseAudioMixing()](#AgoraRtcEngine+pauseAudioMixing) ⇒ <code>int</code>
    * [.resumeAudioMixing()](#AgoraRtcEngine+resumeAudioMixing) ⇒ <code>int</code>
    * [.adjustAudioMixingVolume(volume)](#AgoraRtcEngine+adjustAudioMixingVolume) ⇒ <code>int</code>
    * [.getAudioMixingDuration()](#AgoraRtcEngine+getAudioMixingDuration) ⇒ <code>int</code>
    * [.getAudioMixingCurrentPosition()](#AgoraRtcEngine+getAudioMixingCurrentPosition) ⇒ <code>int</code>
    * [.setAudioMixingPosition(position)](#AgoraRtcEngine+setAudioMixingPosition) ⇒ <code>int</code>
    * [.setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)](#AgoraRtcEngine+setRecordingAudioFrameParameters) ⇒ <code>int</code>
    * [.setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)](#AgoraRtcEngine+setPlaybackAudioFrameParameters) ⇒ <code>int</code>
    * [.setMixedAudioFrameParameters(sampleRate, samplesPerCall)](#AgoraRtcEngine+setMixedAudioFrameParameters) ⇒ <code>int</code>
    * [.createDataStream(reliable, ordered)](#AgoraRtcEngine+createDataStream) ⇒ <code>int</code>
    * [.sendStreamMessage(streamId, msg)](#AgoraRtcEngine+sendStreamMessage) ⇒ <code>int</code>
    * [.getCallId()](#AgoraRtcEngine+getCallId) ⇒ <code>string</code>
    * [.rate(callid, rating, desc)](#AgoraRtcEngine+rate) ⇒ <code>int</code>
    * [.complain(callid, desc)](#AgoraRtcEngine+complain) ⇒ <code>int</code>

<a name="AgoraRtcEngine+initRender"></a>

### agoraRtcEngine.initRender(key, view)
init renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key for the map that store the renderers, e.g, uid or `videosource` or `local` |
| view | <code>\*</code> | dom elements to render video |

<a name="AgoraRtcEngine+destroyRender"></a>

### agoraRtcEngine.destroyRender(key, onFailure)
destroy renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key for the map that store the renders, e.g, uid or `videosource` or `local` |
| onFailure | <code>function</code> | err callback for destroyRenderer |

<a name="AgoraRtcEngine+initialize"></a>

### agoraRtcEngine.initialize(appid) ⇒ <code>int</code>
initialize agora real-time-communicating engine with appid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| appid | <code>string</code> | agora appid |

<a name="AgoraRtcEngine+getVersion"></a>

### agoraRtcEngine.getVersion() ⇒ <code>string</code>
return current version and build of sdk

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>string</code> - version  
<a name="AgoraRtcEngine+getErrorDescription"></a>

### agoraRtcEngine.getErrorDescription(errorCode) ⇒ <code>string</code>
Get error description of the given errorCode

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>string</code> - error description  

| Param | Type | Description |
| --- | --- | --- |
| errorCode | <code>int</code> | error code |

<a name="AgoraRtcEngine+joinChannel"></a>

### agoraRtcEngine.joinChannel(token, channel, info, uid) ⇒ <code>int</code>
Join channel with token, channel, channel_info and uid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
**Requires**: <code>module:channel</code>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | token |
| channel | <code>string</code> | channel |
| info | <code>string</code> | channel info |
| uid | <code>int</code> | uid |

<a name="AgoraRtcEngine+leaveChannel"></a>

### agoraRtcEngine.leaveChannel() ⇒ <code>int</code>
Leave channel

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setHighQualityAudioParameters"></a>

### agoraRtcEngine.setHighQualityAudioParameters(fullband, stereo, fullBitrate) ⇒ <code>int</code>
This method sets high-quality audio preferences. Call this method and set all the three
modes before joining a channel. Do NOT call this method again after joining a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| fullband | <code>\*</code> | enable/disable fullband codec |
| stereo | <code>\*</code> | enable/disable stereo codec |
| fullBitrate | <code>\*</code> | enable/disable high bitrate mode |

<a name="AgoraRtcEngine+subscribe"></a>

### agoraRtcEngine.subscribe(uid, view) ⇒ <code>int</code>
subscribe remote uid and initialize corresponding renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>int</code> | remote uid |
| view | <code>\*</code> | dom where to initialize renderer |

<a name="AgoraRtcEngine+setupLocalVideo"></a>

### agoraRtcEngine.setupLocalVideo(view) ⇒ <code>int</code>
setup local video and corresponding renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>\*</code> | dom element where we will initialize our view |

<a name="AgoraRtcEngine+setVideoRenderDimension"></a>

### agoraRtcEngine.setVideoRenderDimension(rendertype, uid, width, height)
force set renderer dimension of video, this ONLY affects size of data sent to js layer, native video size is determined by setVideoProfile

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| rendertype | <code>\*</code> | type of renderer, 0 - local, 1 - remote, 2 - device test, 3 - video source |
| uid | <code>\*</code> | target uid |
| width | <code>\*</code> | target width |
| height | <code>\*</code> | target height |

<a name="AgoraRtcEngine+setVideoRenderFPS"></a>

### agoraRtcEngine.setVideoRenderFPS(fps)
force set renderer fps globally. This is mainly used to improve the performance for js rendering
once set, data will be forced to be sent with this fps. This can reduce cpu frequency of js rendering.
This applies to ALL views except ones added to High FPS stream.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| fps | <code>int</code> | frame/s |

<a name="AgoraRtcEngine+setVideoRenderHighFPS"></a>

### agoraRtcEngine.setVideoRenderHighFPS(fps)
force set renderer fps for high stream. High stream here MEANS uid streams which has been
added to high ones by calling addVideoRenderToHighFPS, note this has nothing to do with dual stream
high stream. This is often used when we want to set low fps for most of views, but high fps for one
or two special views, e.g. screenshare

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| fps | <code>int</code> | frame/s |

<a name="AgoraRtcEngine+addVideoRenderToHighFPS"></a>

### agoraRtcEngine.addVideoRenderToHighFPS(uid)
add stream to high fps stream by uid. fps of streams added to high fps stream will be
controlled by setVideoRenderHighFPS

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>\*</code> | stream uid |

<a name="AgoraRtcEngine+remoteVideoRenderFromHighFPS"></a>

### agoraRtcEngine.remoteVideoRenderFromHighFPS(uid)
remove stream from high fps stream by uid. fps of streams removed from high fps stream
will be controlled by setVideoRenderFPS

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>\*</code> | stream uid |

<a name="AgoraRtcEngine+setupViewContentMode"></a>

### agoraRtcEngine.setupViewContentMode(uid, mode) ⇒ <code>int</code>
setup view content mode

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 - success, -1 - fail  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>\*</code> | stream uid to operate |
| mode | <code>\*</code> | view content mode, 0 - fill, 1 - fit |

<a name="AgoraRtcEngine+renewToken"></a>

### agoraRtcEngine.renewToken(newtoken) ⇒ <code>int</code>
This method updates the Token.
The key expires after a certain period of time once the Token schema is enabled when:
The onError callback reports the ERR_TOKEN_EXPIRED(109) error, or
The onRequestToken callback reports the ERR_TOKEN_EXPIRED(109) error, or
The user receives the onTokenPrivilegeWillExpire callback.
The application should retrieve a new key and then call this method to renew it. Failure to do so will result in the SDK disconnecting from the server.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| newtoken | <code>\*</code> | new token to update |

<a name="AgoraRtcEngine+setChannelProfile"></a>

### agoraRtcEngine.setChannelProfile(profile) ⇒ <code>int</code>
0 (default) for communication, 1 for live broadcasting, 2 for in-game

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| profile | <code>int</code> | profile |

<a name="AgoraRtcEngine+setClientRole"></a>

### agoraRtcEngine.setClientRole(role, permissionKey) ⇒ <code>int</code>
In live broadcasting mode, set client role, 1 for anchor, 2 for audience

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| role | <code>Number</code> | client role |
| permissionKey | <code>string</code> | permission key |

<a name="AgoraRtcEngine+startEchoTest"></a>

### agoraRtcEngine.startEchoTest() ⇒ <code>int</code>
This method launches an audio call test to determine whether the audio devices
(for example, headset and speaker) and the network connection are working properly.
In the test, the user first speaks, and the recording is played back in 10 seconds.
If the user can hear the recording in 10 seconds, it indicates that the audio devices
and network connection work properly.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopEchoTest"></a>

### agoraRtcEngine.stopEchoTest() ⇒ <code>int</code>
This method stops an audio call test.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+enableLastmileTest"></a>

### agoraRtcEngine.enableLastmileTest() ⇒ <code>int</code>
This method tests the quality of the user’s network connection
and is disabled by default. Before users join a channel, they can call this
method to check the network quality. Calling this method consumes extra network
traffic, which may affect the communication quality. Call disableLastmileTest
to disable it immediately once users have received the onLastmileQuality
callback before they join the channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+disableLastmileTest"></a>

### agoraRtcEngine.disableLastmileTest() ⇒ <code>int</code>
This method disables the network connection quality test.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+enableVideo"></a>

### agoraRtcEngine.enableVideo() ⇒ <code>int</code>
Use before join channel to enable video communication, or you will only join with audio-enabled

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+disableVideo"></a>

### agoraRtcEngine.disableVideo() ⇒ <code>int</code>
Use to disable video and use pure audio communication

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+startPreview"></a>

### agoraRtcEngine.startPreview() ⇒ <code>int</code>
This method starts the local video preview. Before starting the preview,
always call setupLocalVideo to set up the preview window and configure the attributes,
and also call the enableVideo method to enable video. If startPreview is called to start
the local video preview before calling joinChannel to join a channel, the local preview
will still be in the started state after leaveChannel is called to leave the channel.
stopPreview can be called to close the local preview.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopPreview"></a>

### agoraRtcEngine.stopPreview() ⇒ <code>int</code>
This method stops the local video preview and closes the video.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setVideoProfile"></a>

### agoraRtcEngine.setVideoProfile(profile, [swapWidthAndHeight]) ⇒ <code>int</code>
**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| profile | <code>int</code> |  | enumeration values represent video profile |
| [swapWidthAndHeight] | <code>boolean</code> | <code>false</code> | Whether to swap width and height |

<a name="AgoraRtcEngine+enableAudio"></a>

### agoraRtcEngine.enableAudio() ⇒ <code>int</code>
This method enables the audio mode, which is enabled by default.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+disableAudio"></a>

### agoraRtcEngine.disableAudio() ⇒ <code>int</code>
This method disables the audio mode.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setAudioProfile"></a>

### agoraRtcEngine.setAudioProfile(profile, scenario) ⇒ <code>int</code>
Set audio profile (before join channel) depending on your scenario

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| profile | <code>Number</code> | audio profile |
| scenario | <code>Number</code> | audio scenario |

<a name="AgoraRtcEngine+setVideoQualityParameters"></a>

### agoraRtcEngine.setVideoQualityParameters(preferFrameRateOverImageQuality) ⇒ <code>int</code>
This method allows users to set video preferences.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| preferFrameRateOverImageQuality | <code>boolean</code> | enable/disable framerate over image quality |

<a name="AgoraRtcEngine+setEncryptionSecret"></a>

### agoraRtcEngine.setEncryptionSecret(secret) ⇒ <code>int</code>
Use setEncryptionSecret to specify an encryption password to enable built-in
encryption before joining a channel. All users in a channel must set the same encryption password.
The encryption password is automatically cleared once a user has left the channel.
If the encryption password is not specified or set to empty, the encryption function will be disabled.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | Encryption Password |

<a name="AgoraRtcEngine+muteLocalAudioStream"></a>

### agoraRtcEngine.muteLocalAudioStream(mute) ⇒ <code>int</code>
This method mutes/unmutes local audio. It enables/disables 
sending local audio streams to the network.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+muteAllRemoteAudioStreams"></a>

### agoraRtcEngine.muteAllRemoteAudioStreams(mute) ⇒ <code>int</code>
This method mutes/unmutes all remote users’ audio streams.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+muteRemoteAudioStream"></a>

### agoraRtcEngine.muteRemoteAudioStream(uid, mute) ⇒ <code>int</code>
This method mutes/unmutes a specified user’s audio stream.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>int</code> | user to mute/unmute |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+muteLocalVideoStream"></a>

### agoraRtcEngine.muteLocalVideoStream(mute) ⇒ <code>int</code>
This method mutes/unmutes video stream

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute video |

<a name="AgoraRtcEngine+enableLocalVideo"></a>

### agoraRtcEngine.enableLocalVideo(enable) ⇒ <code>int</code>
This method disables the local video, which is only applicable to
the scenario when the user only wants to watch the remote video without sending
any video stream to the other user. This method does not require a local camera.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>boolean</code> | enable/disable video |

<a name="AgoraRtcEngine+muteAllRemoteVideoStreams"></a>

### agoraRtcEngine.muteAllRemoteVideoStreams(mute) ⇒ <code>int</code>
This method mutes/unmutes all remote users’ video streams.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute video |

<a name="AgoraRtcEngine+enableAudioVolumeIndication"></a>

### agoraRtcEngine.enableAudioVolumeIndication(interval, smooth) ⇒ <code>int</code>
This method enables the SDK to regularly report to the application
on which user is talking and the volume of the speaker. Once the method is enabled,
the SDK returns the volume indications at the set time internal in the Audio Volume
Indication Callback (onAudioVolumeIndication) callback, regardless of whether anyone
is speaking in the channel

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>\*</code> | < 0 for disable, recommend to set > 200ms, < 10ms will not receive any callbacks |
| smooth | <code>\*</code> | Smoothing factor. The default value is 3 |

<a name="AgoraRtcEngine+muteRemoteVideoStream"></a>

### agoraRtcEngine.muteRemoteVideoStream(uid, mute) ⇒ <code>int</code>
This method mutes/unmutes a specified user’s video stream.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>int</code> | user to mute/unmute |
| mute | <code>boolean</code> | mute/unmute video |

<a name="AgoraRtcEngine+setInEarMonitoringVolume"></a>

### agoraRtcEngine.setInEarMonitoringVolume(volume) ⇒ <code>int</code>
This method sets the in ear monitoring volume.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>\*</code> | Volume of the in-ear monitor, ranging from 0 to 100. The default value is 100. |

<a name="AgoraRtcEngine+pauseAudio"></a>

### agoraRtcEngine.pauseAudio() ⇒ <code>int</code>
disable audio function in channel, which will be recovered when leave channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+resumeAudio"></a>

### agoraRtcEngine.resumeAudio() ⇒ <code>int</code>
resume audio function in channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setLogFile"></a>

### agoraRtcEngine.setLogFile(filepath) ⇒ <code>int</code>
set filepath of log

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | filepath of log |

<a name="AgoraRtcEngine+setLogFilter"></a>

### agoraRtcEngine.setLogFilter(filter) ⇒ <code>int</code>
set log level

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>int</code> | filter level LOG_FILTER_OFF = 0: Output no log. LOG_FILTER_DEBUG = 0x80f: Output all the API logs. LOG_FILTER_INFO = 0x0f: Output logs of the CRITICAL, ERROR, WARNING and INFO level. LOG_FILTER_WARNING = 0x0e: Output logs of the CRITICAL, ERROR and WARNING level. LOG_FILTER_ERROR = 0x0c: Output logs of the CRITICAL and ERROR level. LOG_FILTER_CRITICAL = 0x08: Output logs of the CRITICAL level. |

<a name="AgoraRtcEngine+enableDualStreamMode"></a>

### agoraRtcEngine.enableDualStreamMode(enable) ⇒ <code>int</code>
This method sets the stream mode (only applicable to live broadcast) to 
single- (default) or dual-stream mode.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>boolean</code> | enable/disable dual stream |

<a name="AgoraRtcEngine+setRemoteVideoStreamType"></a>

### agoraRtcEngine.setRemoteVideoStreamType(uid, streamType) ⇒ <code>int</code>
This method specifies the video-stream type of the remote user to be
received by the local user when the remote user sends dual streams.
If dual-stream mode is enabled by calling enableDualStreamMode, you will receive the
high-video stream by default. This method allows the application to adjust the
corresponding video-stream type according to the size of the video windows to save the bandwidth
and calculation resources.
If dual-stream mode is not enabled, you will receive the high-video stream by default.
The result after calling this method will be returned in onApiCallExecuted. The Agora SDK receives
the high-video stream by default to save the bandwidth. If needed, users can switch to the low-video
stream using this method.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>int</code> | User ID |
| streamType | <code>int</code> | 0 - high, 1 - low |

<a name="AgoraRtcEngine+setRemoteDefaultVideoStreamType"></a>

### agoraRtcEngine.setRemoteDefaultVideoStreamType(streamType) ⇒ <code>int</code>
This method sets the default remote video stream type to high or low.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| streamType | <code>int</code> | 0 - high, 1 - low |

<a name="AgoraRtcEngine+enableWebSdkInteroperability"></a>

### agoraRtcEngine.enableWebSdkInteroperability(enable) ⇒ <code>int</code>
This method enables interoperability with the Agora Web SDK.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>\*</code> | enable/disable interop |

<a name="AgoraRtcEngine+setLocalVideoMirrorMode"></a>

### agoraRtcEngine.setLocalVideoMirrorMode(mirrortype) ⇒ <code>int</code>
This method sets the local video mirror mode. Use this method before startPreview, 
or it does not take effect until you re-enable startPreview.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mirrortype | <code>\*</code> | mirror type 0: The default mirror mode, that is, the mode set by the SDK 1: Enable the mirror mode 2: Disable the mirror mode |

<a name="AgoraRtcEngine+setExternalAudioSource"></a>

### agoraRtcEngine.setExternalAudioSource(enabled, samplerate, channels) ⇒ <code>int</code>
This method sets the external audio source.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>boolean</code> | Enable the function of the external audio source: true/false. |
| samplerate | <code>int</code> | Sampling rate of the external audio source. |
| channels | <code>int</code> | Number of the external audio source channels (two channels maximum). |

<a name="AgoraRtcEngine+getVideoDevices"></a>

### agoraRtcEngine.getVideoDevices() ⇒ <code>array</code>
return list of video devices

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>array</code> - array of device object  
<a name="AgoraRtcEngine+setVideoDevice"></a>

### agoraRtcEngine.setVideoDevice(deviceid) ⇒ <code>int</code>
set video device to use via device id

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceid | <code>\*</code> | device id |

<a name="AgoraRtcEngine+getCurrentVideoDevice"></a>

### agoraRtcEngine.getCurrentVideoDevice() ⇒ <code>object</code>
get current using video device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>object</code> - video device object  
<a name="AgoraRtcEngine+startVideoDeviceTest"></a>

### agoraRtcEngine.startVideoDeviceTest() ⇒ <code>int</code>
This method tests whether the video-capture device works properly.
Before calling this method, ensure that you have already called enableVideo,
and the HWND window handle of the incoming parameter is valid.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopVideoDeviceTest"></a>

### agoraRtcEngine.stopVideoDeviceTest() ⇒ <code>int</code>
stop video device test

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+getAudioPlaybackDevices"></a>

### agoraRtcEngine.getAudioPlaybackDevices() ⇒ <code>array</code>
return list of audio playback devices

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>array</code> - array of device object  
<a name="AgoraRtcEngine+setAudioPlaybackDevice"></a>

### agoraRtcEngine.setAudioPlaybackDevice(deviceid) ⇒ <code>int</code>
set audio playback device to use via device id

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceid | <code>\*</code> | device id |

<a name="AgoraRtcEngine+getCurrentAudioPlaybackDevice"></a>

### agoraRtcEngine.getCurrentAudioPlaybackDevice() ⇒ <code>object</code>
get current using audio playback device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>object</code> - audio playback device object  
<a name="AgoraRtcEngine+setAudioPlaybackVolume"></a>

### agoraRtcEngine.setAudioPlaybackVolume(volume) ⇒ <code>int</code>
set device playback volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>int</code> | 0 - 255 |

<a name="AgoraRtcEngine+getAudioPlaybackVolume"></a>

### agoraRtcEngine.getAudioPlaybackVolume() ⇒ <code>int</code>
get device playback volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - volume  
<a name="AgoraRtcEngine+getAudioRecordingDevices"></a>

### agoraRtcEngine.getAudioRecordingDevices() ⇒ <code>array</code>
get audio recording devices

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>array</code> - array of recording devices  
<a name="AgoraRtcEngine+setAudioRecordingDevice"></a>

### agoraRtcEngine.setAudioRecordingDevice(deviceid) ⇒ <code>int</code>
set audio recording device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceid | <code>\*</code> | device id |

<a name="AgoraRtcEngine+getCurrentAudioRecordingDevice"></a>

### agoraRtcEngine.getCurrentAudioRecordingDevice() ⇒ <code>object</code>
get current selected audio recording device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>object</code> - audio recording device object  
<a name="AgoraRtcEngine+getAudioRecordingVolume"></a>

### agoraRtcEngine.getAudioRecordingVolume() ⇒ <code>int</code>
get audio recording volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - volume  
<a name="AgoraRtcEngine+setAudioRecordingVolume"></a>

### agoraRtcEngine.setAudioRecordingVolume(volume) ⇒ <code>int</code>
set audio recording device volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>\*</code> | 0 - 255 |

<a name="AgoraRtcEngine+startAudioPlaybackDeviceTest"></a>

### agoraRtcEngine.startAudioPlaybackDeviceTest(filepath) ⇒ <code>int</code>
This method checks whether the playback device works properly. The SDK plays an audio file
specified by the user. If the user can hear the sound, then the playback device works properly.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | filepath of sound file to play test |

<a name="AgoraRtcEngine+stopAudioPlaybackDeviceTest"></a>

### agoraRtcEngine.stopAudioPlaybackDeviceTest() ⇒ <code>int</code>
stop playback device test

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+enableLoopbackRecording"></a>

### agoraRtcEngine.enableLoopbackRecording([enable])
This method enables loopback recording. Once enabled, the SDK collects all local sounds.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [enable] | <code>boolean</code> | <code>false</code> | whether to enable loop back recording |

<a name="AgoraRtcEngine+startAudioRecordingDeviceTest"></a>

### agoraRtcEngine.startAudioRecordingDeviceTest(indicateInterval) ⇒ <code>int</code>
This method checks whether the microphone works properly. Once the test starts, the SDK uses
the onAudioVolumeIndication callback to notify the application about the volume information.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| indicateInterval | <code>\*</code> | in second |

<a name="AgoraRtcEngine+stopAudioRecordingDeviceTest"></a>

### agoraRtcEngine.stopAudioRecordingDeviceTest() ⇒ <code>int</code>
stop audio recording device test

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+getAudioPlaybackDeviceMute"></a>

### agoraRtcEngine.getAudioPlaybackDeviceMute() ⇒ <code>boolean</code>
check whether selected audio playback device is muted

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>boolean</code> - muted/unmuted  
<a name="AgoraRtcEngine+setAudioPlaybackDeviceMute"></a>

### agoraRtcEngine.setAudioPlaybackDeviceMute(mute) ⇒ <code>int</code>
set current audio playback device mute/unmute

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute |

<a name="AgoraRtcEngine+getAudioRecordingDeviceMute"></a>

### agoraRtcEngine.getAudioRecordingDeviceMute() ⇒ <code>boolean</code>
check whether selected audio recording device is muted

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>boolean</code> - muted/unmuted  
<a name="AgoraRtcEngine+setAudioRecordingDeviceMute"></a>

### agoraRtcEngine.setAudioRecordingDeviceMute(mute) ⇒ <code>int</code>
set current audio recording device mute/unmute

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute |

<a name="AgoraRtcEngine+videoSourceInitialize"></a>

### agoraRtcEngine.videoSourceInitialize(appid) ⇒ <code>int</code>
initialize agora real-time-communicating videosource with appid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| appid | <code>string</code> | agora appid |

<a name="AgoraRtcEngine+setupLocalVideoSource"></a>

### agoraRtcEngine.setupLocalVideoSource(view)
setup renderer for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>\*</code> | dom element where video source should be displayed |

<a name="AgoraRtcEngine+videoSourceEnableWebSdkInteroperability"></a>

### agoraRtcEngine.videoSourceEnableWebSdkInteroperability(enabled) ⇒ <code>int</code>
Set it to true to enable videosource web interoperability

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>Boolean</code> | enalbe/disable web interoperability |

<a name="AgoraRtcEngine+videoSourceJoin"></a>

### agoraRtcEngine.videoSourceJoin(token, cname, info, uid) ⇒ <code>int</code>
let video source join channel with token, channel, channel_info and uid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
**Requires**: <code>module:channel</code>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | token |
| cname | <code>string</code> | channel |
| info | <code>string</code> | channel info |
| uid | <code>int</code> | uid |

<a name="AgoraRtcEngine+videoSourceLeave"></a>

### agoraRtcEngine.videoSourceLeave() ⇒ <code>int</code>
let video source Leave channel

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+videoSourceRenewToken"></a>

### agoraRtcEngine.videoSourceRenewToken(token) ⇒ <code>int</code>
This method updates the Token for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | new token to update |

<a name="AgoraRtcEngine+videoSourceSetChannelProfile"></a>

### agoraRtcEngine.videoSourceSetChannelProfile(profile) ⇒ <code>int</code>
0 (default) for communication, 1 for live broadcasting, 2 for in-game

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| profile | <code>int</code> | profile |

<a name="AgoraRtcEngine+videoSourceSetVideoProfile"></a>

### agoraRtcEngine.videoSourceSetVideoProfile(profile, [swapWidthAndHeight]) ⇒ <code>int</code>
set video profile for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| profile | <code>int</code> |  | enumeration values represent video profile |
| [swapWidthAndHeight] | <code>boolean</code> | <code>false</code> | Whether to swap width and height |

<a name="AgoraRtcEngine+getScreenWindowsInfo"></a>

### agoraRtcEngine.getScreenWindowsInfo() ⇒ <code>array</code>
get list of all system window ids and relevant infos, the window id can be used for screen share

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>array</code> - list of window infos  
<a name="AgoraRtcEngine+startScreenCapture2"></a>

### agoraRtcEngine.startScreenCapture2(wndid, captureFreq, rect, bitrate) ⇒ <code>int</code>
start video source screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| wndid | <code>\*</code> | windows id to capture |
| captureFreq | <code>\*</code> | fps of video source screencapture, 1 - 15 |
| rect | <code>\*</code> | null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen) |
| bitrate | <code>\*</code> | bitrate of video source screencapture |

<a name="AgoraRtcEngine+stopScreenCapture2"></a>

### agoraRtcEngine.stopScreenCapture2() ⇒ <code>int</code>
stop video source screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+startScreenCapturePreview"></a>

### agoraRtcEngine.startScreenCapturePreview() ⇒ <code>int</code>
start video source preview

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopScreenCapturePreview"></a>

### agoraRtcEngine.stopScreenCapturePreview() ⇒ <code>int</code>
stop video source preview

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+videoSourceEnableDualStreamMode"></a>

### agoraRtcEngine.videoSourceEnableDualStreamMode(enable) ⇒ <code>int</code>
enable dual stream mode for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>\*</code> | whether dual stream mode is enabled |

<a name="AgoraRtcEngine+videoSourceSetParameters"></a>

### agoraRtcEngine.videoSourceSetParameters(parameter) ⇒ <code>int</code>
setParameters for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| parameter | <code>\*</code> | parameter to set |

<a name="AgoraRtcEngine+videoSourceRelease"></a>

### agoraRtcEngine.videoSourceRelease() ⇒ <code>int</code>
release video source object

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+startScreenCapture"></a>

### agoraRtcEngine.startScreenCapture(windowId, captureFreq, rect, bitrate) ⇒ <code>int</code>
start screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| windowId | <code>\*</code> | windows id to capture |
| captureFreq | <code>\*</code> | fps of screencapture, 1 - 15 |
| rect | <code>\*</code> | null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen) |
| bitrate | <code>\*</code> | bitrate of screencapture |

<a name="AgoraRtcEngine+stopScreenCapture"></a>

### agoraRtcEngine.stopScreenCapture() ⇒ <code>int</code>
stop screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+updateScreenCaptureRegion"></a>

### agoraRtcEngine.updateScreenCaptureRegion(rect) ⇒ <code>int</code>
This method updates the screen capture region.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| rect | <code>\*</code> | {x: 0, y: 0, width: 0, height: 0} |

<a name="AgoraRtcEngine+startAudioMixing"></a>

### agoraRtcEngine.startAudioMixing(filepath, loopback, replace, cycle) ⇒ <code>int</code>
This method mixes the specified local audio file with the audio stream
from the microphone; or, it replaces the microphone’s audio stream with the specified
local audio file. You can choose whether the other user can hear the local audio playback
and specify the number of loop playbacks. This API also supports online music playback.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | Name and path of the local audio file to be mixed.             Supported audio formats: mp3, aac, m4a, 3gp, and wav. |
| loopback | <code>boolean</code> | true - local loopback, false - remote loopback |
| replace | <code>boolean</code> | whether audio file replace microphone audio |
| cycle | <code>int</code> | number of loop playbacks, -1 for infinite |

<a name="AgoraRtcEngine+stopAudioMixing"></a>

### agoraRtcEngine.stopAudioMixing() ⇒ <code>int</code>
This method stops audio mixing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+pauseAudioMixing"></a>

### agoraRtcEngine.pauseAudioMixing() ⇒ <code>int</code>
This method pauses audio mixing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+resumeAudioMixing"></a>

### agoraRtcEngine.resumeAudioMixing() ⇒ <code>int</code>
This method resumes audio mixing from pausing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+adjustAudioMixingVolume"></a>

### agoraRtcEngine.adjustAudioMixingVolume(volume) ⇒ <code>int</code>
This method adjusts the volume during audio mixing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>int</code> | Volume ranging from 0 to 100. By default, 100 is the original volume. |

<a name="AgoraRtcEngine+getAudioMixingDuration"></a>

### agoraRtcEngine.getAudioMixingDuration() ⇒ <code>int</code>
This method gets the duration (ms) of the audio mixing. Call this API when you are in 
a channel. A return value of 0 means that this method call has failed.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - duration of audio mixing  
<a name="AgoraRtcEngine+getAudioMixingCurrentPosition"></a>

### agoraRtcEngine.getAudioMixingCurrentPosition() ⇒ <code>int</code>
This method gets the playback position (ms) of the audio. Call this API 
when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - current playback position  
<a name="AgoraRtcEngine+setAudioMixingPosition"></a>

### agoraRtcEngine.setAudioMixingPosition(position) ⇒ <code>int</code>
This method drags the playback progress bar of the audio mixing file to where 
you want to play instead of playing it from the beginning.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>int</code> | Integer. The position of the audio mixing file in ms |

<a name="AgoraRtcEngine+setRecordingAudioFrameParameters"></a>

### agoraRtcEngine.setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) ⇒ <code>int</code>
This method sets the format of the callback data in onRecordAudioFrame.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| sampleRate | <code>\*</code> | It specifies the sampling rate in the callback data returned by onRecordAudioFrame,  which can set be as 8000, 16000, 32000, 44100 or 48000. |
| channel | <code>\*</code> | 1 - mono, 2 - dual |
| mode | <code>\*</code> | 0 - read only mode, 1 - write-only mode, 2 - read and white mode |
| samplesPerCall | <code>\*</code> | It specifies the sampling points in the called data returned in onRecordAudioFrame,  for example, it is usually set as 1024 for stream pushing. |

<a name="AgoraRtcEngine+setPlaybackAudioFrameParameters"></a>

### agoraRtcEngine.setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) ⇒ <code>int</code>
This method sets the format of the callback data in onPlaybackAudioFrame.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| sampleRate | <code>\*</code> | Specifies the sampling rate in the callback data returned by onPlaybackAudioFrame,  which can set be as 8000, 16000, 32000, 44100, or 48000. |
| channel | <code>\*</code> | 1 - mono, 2 - dual |
| mode | <code>\*</code> | 0 - read only mode, 1 - write-only mode, 2 - read and white mode |
| samplesPerCall | <code>\*</code> | It specifies the sampling points in the called data returned in onRecordAudioFrame,  for example, it is usually set as 1024 for stream pushing. |

<a name="AgoraRtcEngine+setMixedAudioFrameParameters"></a>

### agoraRtcEngine.setMixedAudioFrameParameters(sampleRate, samplesPerCall) ⇒ <code>int</code>
This method sets the format of the callback data in onMixedAudioFrame.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| sampleRate | <code>\*</code> | Specifies the sampling rate in the callback data returned by onMixedAudioFrame, which can set be as 8000, 16000, 32000, 44100, or 48000. |
| samplesPerCall | <code>\*</code> | Specifies the sampling points in the called data returned in onMixedAudioFrame, for example, it is usually set as 1024 for stream pushing. |

<a name="AgoraRtcEngine+createDataStream"></a>

### agoraRtcEngine.createDataStream(reliable, ordered) ⇒ <code>int</code>
This method creates a data stream. Each user can only have up to five data channels at the same time.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - <0 for failure, > 0 for stream id of data  

| Param | Type | Description |
| --- | --- | --- |
| reliable | <code>boolean</code> | true - The recipients will receive data from the sender within 5 seconds. If the recipient does not receive the sent data within 5 seconds, the data channel will report an error to the application.                     false - The recipients may not receive any data, while it will not report any error upon data missing. |
| ordered | <code>boolean</code> | true - The recipients will receive data in the order of the sender.                    false - The recipients will not receive data in the order of the sender. |

<a name="AgoraRtcEngine+sendStreamMessage"></a>

### agoraRtcEngine.sendStreamMessage(streamId, msg) ⇒ <code>int</code>
This method sends data stream messages to all users in a channel.
Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
The API controls the data channel transfer rate. Each client can send up to 6 kB of data per second.
Each user can have up to five data channels simultaneously.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>int</code> | Stream ID from createDataStream |
| msg | <code>string</code> | Data to be sent |

<a name="AgoraRtcEngine+getCallId"></a>

### agoraRtcEngine.getCallId() ⇒ <code>string</code>
When a user joins a channel on a client using joinChannelByToken,
a CallId is generated to identify the call from the client. Some methods such
as rate and complain need to be called after the call ends in order to submit
feedback to the SDK. These methods require assigned values of the CallId parameters.
To use these feedback methods, call the getCallId method to retrieve the CallId during the call,
and then pass the value as an argument in the feedback methods after the call ends.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>string</code> - Current call ID.  
<a name="AgoraRtcEngine+rate"></a>

### agoraRtcEngine.rate(callid, rating, desc) ⇒ <code>int</code>
This method lets the user rate the call. It is usually called after the call ends.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| callid | <code>string</code> | Call ID retrieved from the getCallId method. |
| rating | <code>int</code> | Rating for the call between 1 (lowest score) to 10 (highest score). |
| desc | <code>\*</code> | A given description for the call with a length less than 800 bytes. |

<a name="AgoraRtcEngine+complain"></a>

### agoraRtcEngine.complain(callid, desc) ⇒ <code>int</code>
This method allows the user to complain about the call quality. It is usually
called after the call ends.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>int</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| callid | <code>string</code> | Call ID retrieved from the getCallId method. |
| desc | <code>string</code> | A given description of the call with a length less than 800 bytes. |

