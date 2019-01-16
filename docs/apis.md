<a name="AgoraRtcEngine"></a>

## AgoraRtcEngine
**Kind**: global class  

* [AgoraRtcEngine](#AgoraRtcEngine)
    * [.setRenderMode(mode)](#AgoraRtcEngine+setRenderMode)
    * [.initRender(key, view)](#AgoraRtcEngine+initRender)
    * [.destroyRender(key, onFailure)](#AgoraRtcEngine+destroyRender)
    * [.initialize(appid)](#AgoraRtcEngine+initialize) ⇒ <code>number</code>
    * [.getVersion()](#AgoraRtcEngine+getVersion) ⇒ <code>string</code>
    * [.getErrorDescription(errorCode)](#AgoraRtcEngine+getErrorDescription) ⇒ <code>string</code>
    * [.joinChannel(token, channel, info, uid)](#AgoraRtcEngine+joinChannel) ⇒ <code>number</code>
    * [.leaveChannel()](#AgoraRtcEngine+leaveChannel) ⇒ <code>number</code>
    * [.setHighQualityAudioParameters(fullband, stereo, fullBitrate)](#AgoraRtcEngine+setHighQualityAudioParameters) ⇒ <code>number</code>
    * [.subscribe(uid, view)](#AgoraRtcEngine+subscribe) ⇒ <code>number</code>
    * [.setupLocalVideo(view)](#AgoraRtcEngine+setupLocalVideo) ⇒ <code>number</code>
    * [.setVideoRenderDimension(rendertype, uid, width, height)](#AgoraRtcEngine+setVideoRenderDimension)
    * [.setVideoRenderFPS(fps)](#AgoraRtcEngine+setVideoRenderFPS)
    * [.setVideoRenderHighFPS(fps)](#AgoraRtcEngine+setVideoRenderHighFPS)
    * [.addVideoRenderToHighFPS(uid)](#AgoraRtcEngine+addVideoRenderToHighFPS)
    * [.remoteVideoRenderFromHighFPS(uid)](#AgoraRtcEngine+remoteVideoRenderFromHighFPS)
    * [.setupViewContentMode(uid, mode)](#AgoraRtcEngine+setupViewContentMode) ⇒ <code>number</code>
    * [.renewToken(newtoken)](#AgoraRtcEngine+renewToken) ⇒ <code>number</code>
    * [.setChannelProfile(profile)](#AgoraRtcEngine+setChannelProfile) ⇒ <code>number</code>
    * [.setClientRole(role, permissionKey)](#AgoraRtcEngine+setClientRole) ⇒ <code>number</code>
    * [.startEchoTest()](#AgoraRtcEngine+startEchoTest) ⇒ <code>number</code>
    * [.stopEchoTest()](#AgoraRtcEngine+stopEchoTest) ⇒ <code>number</code>
    * [.enableLastmileTest()](#AgoraRtcEngine+enableLastmileTest) ⇒ <code>number</code>
    * [.disableLastmileTest()](#AgoraRtcEngine+disableLastmileTest) ⇒ <code>number</code>
    * [.enableVideo()](#AgoraRtcEngine+enableVideo) ⇒ <code>number</code>
    * [.disableVideo()](#AgoraRtcEngine+disableVideo) ⇒ <code>number</code>
    * [.startPreview()](#AgoraRtcEngine+startPreview) ⇒ <code>number</code>
    * [.stopPreview()](#AgoraRtcEngine+stopPreview) ⇒ <code>number</code>
    * [.setVideoProfile(profile, [swapWidthAndHeight])](#AgoraRtcEngine+setVideoProfile) ⇒ <code>number</code>
    * [.setVideoEncoderConfiguration(config)](#AgoraRtcEngine+setVideoEncoderConfiguration) ⇒ <code>number</code>
    * [.enableAudio()](#AgoraRtcEngine+enableAudio) ⇒ <code>number</code>
    * [.disableAudio()](#AgoraRtcEngine+disableAudio) ⇒ <code>number</code>
    * [.setAudioProfile(profile, scenario)](#AgoraRtcEngine+setAudioProfile) ⇒ <code>number</code>
    * [.setVideoQualityParameters(preferFrameRateOverImageQuality)](#AgoraRtcEngine+setVideoQualityParameters) ⇒ <code>number</code>
    * [.setEncryptionSecret(secret)](#AgoraRtcEngine+setEncryptionSecret) ⇒ <code>number</code>
    * [.muteLocalAudioStream(mute)](#AgoraRtcEngine+muteLocalAudioStream) ⇒ <code>number</code>
    * [.muteAllRemoteAudioStreams(mute)](#AgoraRtcEngine+muteAllRemoteAudioStreams) ⇒ <code>number</code>
    * [.setDefaultMuteAllRemoteAudioStreams(mute)](#AgoraRtcEngine+setDefaultMuteAllRemoteAudioStreams) ⇒ <code>number</code>
    * [.muteRemoteAudioStream(uid, mute)](#AgoraRtcEngine+muteRemoteAudioStream) ⇒ <code>number</code>
    * [.muteLocalVideoStream(mute)](#AgoraRtcEngine+muteLocalVideoStream) ⇒ <code>number</code>
    * [.enableLocalVideo(enable)](#AgoraRtcEngine+enableLocalVideo) ⇒ <code>number</code>
    * [.muteAllRemoteVideoStreams(mute)](#AgoraRtcEngine+muteAllRemoteVideoStreams) ⇒ <code>number</code>
    * [.setDefaultMuteAllRemoteVideoStreams(mute)](#AgoraRtcEngine+setDefaultMuteAllRemoteVideoStreams) ⇒ <code>number</code>
    * [.enableAudioVolumeIndication(interval, smooth)](#AgoraRtcEngine+enableAudioVolumeIndication) ⇒ <code>number</code>
    * [.muteRemoteVideoStream(uid, mute)](#AgoraRtcEngine+muteRemoteVideoStream) ⇒ <code>number</code>
    * [.setInEarMonitoringVolume(volume)](#AgoraRtcEngine+setInEarMonitoringVolume) ⇒ <code>number</code>
    * [.pauseAudio()](#AgoraRtcEngine+pauseAudio) ⇒ <code>number</code>
    * [.resumeAudio()](#AgoraRtcEngine+resumeAudio) ⇒ <code>number</code>
    * [.setLogFile(filepath)](#AgoraRtcEngine+setLogFile) ⇒ <code>number</code>
    * [.videoSourceSetLogFile(filepath)](#AgoraRtcEngine+videoSourceSetLogFile) ⇒ <code>number</code>
    * [.setLogFilter(filter)](#AgoraRtcEngine+setLogFilter) ⇒ <code>number</code>
    * [.enableDualStreamMode(enable)](#AgoraRtcEngine+enableDualStreamMode) ⇒ <code>number</code>
    * [.setRemoteVideoStreamType(uid, streamType)](#AgoraRtcEngine+setRemoteVideoStreamType) ⇒ <code>number</code>
    * [.setRemoteDefaultVideoStreamType(streamType)](#AgoraRtcEngine+setRemoteDefaultVideoStreamType) ⇒ <code>number</code>
    * [.enableWebSdkInteroperability(enable)](#AgoraRtcEngine+enableWebSdkInteroperability) ⇒ <code>number</code>
    * [.setLocalVideoMirrorMode(mirrortype)](#AgoraRtcEngine+setLocalVideoMirrorMode) ⇒ <code>number</code>
    * [.setLocalVoicePitch(pitch)](#AgoraRtcEngine+setLocalVoicePitch) ⇒ <code>number</code>
    * [.setLocalVoiceEqualization(bandFrequency, bandGain)](#AgoraRtcEngine+setLocalVoiceEqualization) ⇒ <code>number</code>
    * [.setLocalVoiceReverb(reverbKey, value)](#AgoraRtcEngine+setLocalVoiceReverb) ⇒ <code>number</code>
    * [.setLocalPublishFallbackOption(option)](#AgoraRtcEngine+setLocalPublishFallbackOption) ⇒ <code>number</code>
    * [.setRemoteSubscribeFallbackOption(option)](#AgoraRtcEngine+setRemoteSubscribeFallbackOption) ⇒ <code>number</code>
    * [.setExternalAudioSource(enabled, samplerate, channels)](#AgoraRtcEngine+setExternalAudioSource) ⇒ <code>number</code>
    * [.getVideoDevices()](#AgoraRtcEngine+getVideoDevices) ⇒ <code>Array</code>
    * [.setVideoDevice(deviceId)](#AgoraRtcEngine+setVideoDevice) ⇒ <code>number</code>
    * [.getCurrentVideoDevice()](#AgoraRtcEngine+getCurrentVideoDevice) ⇒ <code>Object</code>
    * [.startVideoDeviceTest()](#AgoraRtcEngine+startVideoDeviceTest) ⇒ <code>number</code>
    * [.stopVideoDeviceTest()](#AgoraRtcEngine+stopVideoDeviceTest) ⇒ <code>number</code>
    * [.getAudioPlaybackDevices()](#AgoraRtcEngine+getAudioPlaybackDevices) ⇒ <code>Array</code>
    * [.setAudioPlaybackDevice(deviceId)](#AgoraRtcEngine+setAudioPlaybackDevice) ⇒ <code>number</code>
    * [.getPlaybackDeviceInfo(deviceId, deviceName)](#AgoraRtcEngine+getPlaybackDeviceInfo) ⇒ <code>number</code>
    * [.getCurrentAudioPlaybackDevice()](#AgoraRtcEngine+getCurrentAudioPlaybackDevice) ⇒ <code>Object</code>
    * [.setAudioPlaybackVolume(volume)](#AgoraRtcEngine+setAudioPlaybackVolume) ⇒ <code>number</code>
    * [.getAudioPlaybackVolume()](#AgoraRtcEngine+getAudioPlaybackVolume) ⇒ <code>number</code>
    * [.getAudioRecordingDevices()](#AgoraRtcEngine+getAudioRecordingDevices) ⇒ <code>Array</code>
    * [.setAudioRecordingDevice(deviceId)](#AgoraRtcEngine+setAudioRecordingDevice) ⇒ <code>number</code>
    * [.getRecordingDeviceInfo(deviceId, deviceName)](#AgoraRtcEngine+getRecordingDeviceInfo) ⇒ <code>number</code>
    * [.getCurrentAudioRecordingDevice()](#AgoraRtcEngine+getCurrentAudioRecordingDevice) ⇒ <code>Object</code>
    * [.getAudioRecordingVolume()](#AgoraRtcEngine+getAudioRecordingVolume) ⇒ <code>number</code>
    * [.setAudioRecordingVolume(volume)](#AgoraRtcEngine+setAudioRecordingVolume) ⇒ <code>number</code>
    * [.startAudioPlaybackDeviceTest(filepath)](#AgoraRtcEngine+startAudioPlaybackDeviceTest) ⇒ <code>number</code>
    * [.stopAudioPlaybackDeviceTest()](#AgoraRtcEngine+stopAudioPlaybackDeviceTest) ⇒ <code>number</code>
    * [.enableLoopbackRecording([enable])](#AgoraRtcEngine+enableLoopbackRecording) ⇒ <code>number</code>
    * [.startAudioRecordingDeviceTest(indicateInterval)](#AgoraRtcEngine+startAudioRecordingDeviceTest) ⇒ <code>number</code>
    * [.stopAudioRecordingDeviceTest()](#AgoraRtcEngine+stopAudioRecordingDeviceTest) ⇒ <code>number</code>
    * [.getAudioPlaybackDeviceMute()](#AgoraRtcEngine+getAudioPlaybackDeviceMute) ⇒ <code>boolean</code>
    * [.setAudioPlaybackDeviceMute(mute)](#AgoraRtcEngine+setAudioPlaybackDeviceMute) ⇒ <code>number</code>
    * [.getAudioRecordingDeviceMute()](#AgoraRtcEngine+getAudioRecordingDeviceMute) ⇒ <code>boolean</code>
    * [.setAudioRecordingDeviceMute(mute)](#AgoraRtcEngine+setAudioRecordingDeviceMute) ⇒ <code>number</code>
    * [.videoSourceInitialize(appId)](#AgoraRtcEngine+videoSourceInitialize) ⇒ <code>number</code>
    * [.setupLocalVideoSource(view)](#AgoraRtcEngine+setupLocalVideoSource)
    * [.videoSourceEnableWebSdkInteroperability(enabled)](#AgoraRtcEngine+videoSourceEnableWebSdkInteroperability) ⇒ <code>number</code>
    * [.videoSourceJoin(token, cname, info, uid)](#AgoraRtcEngine+videoSourceJoin) ⇒ <code>number</code>
    * [.videoSourceLeave()](#AgoraRtcEngine+videoSourceLeave) ⇒ <code>number</code>
    * [.videoSourceRenewToken(token)](#AgoraRtcEngine+videoSourceRenewToken) ⇒ <code>number</code>
    * [.videoSourceSetChannelProfile(profile)](#AgoraRtcEngine+videoSourceSetChannelProfile) ⇒ <code>number</code>
    * [.videoSourceSetVideoProfile(profile, [swapWidthAndHeight])](#AgoraRtcEngine+videoSourceSetVideoProfile) ⇒ <code>number</code>
    * [.getScreenWindowsInfo()](#AgoraRtcEngine+getScreenWindowsInfo) ⇒ <code>Array</code>
    * [.startScreenCapture2(wndid, captureFreq, rect, bitrate)](#AgoraRtcEngine+startScreenCapture2) ⇒ <code>number</code>
    * [.stopScreenCapture2()](#AgoraRtcEngine+stopScreenCapture2) ⇒ <code>number</code>
    * [.startScreenCapturePreview()](#AgoraRtcEngine+startScreenCapturePreview) ⇒ <code>number</code>
    * [.stopScreenCapturePreview()](#AgoraRtcEngine+stopScreenCapturePreview) ⇒ <code>number</code>
    * [.videoSourceEnableDualStreamMode(enable)](#AgoraRtcEngine+videoSourceEnableDualStreamMode) ⇒ <code>number</code>
    * [.videoSourceSetParameters(parameter)](#AgoraRtcEngine+videoSourceSetParameters) ⇒ <code>number</code>
    * [.videoSourceRelease()](#AgoraRtcEngine+videoSourceRelease) ⇒ <code>number</code>
    * [.startScreenCapture(windowId, captureFreq, rect, bitrate)](#AgoraRtcEngine+startScreenCapture) ⇒ <code>number</code>
    * [.stopScreenCapture()](#AgoraRtcEngine+stopScreenCapture) ⇒ <code>number</code>
    * [.updateScreenCaptureRegion(rect)](#AgoraRtcEngine+updateScreenCaptureRegion) ⇒ <code>number</code>
    * [.startAudioMixing(filepath, loopback, replace, cycle)](#AgoraRtcEngine+startAudioMixing) ⇒ <code>number</code>
    * [.stopAudioMixing()](#AgoraRtcEngine+stopAudioMixing) ⇒ <code>number</code>
    * [.pauseAudioMixing()](#AgoraRtcEngine+pauseAudioMixing) ⇒ <code>number</code>
    * [.resumeAudioMixing()](#AgoraRtcEngine+resumeAudioMixing) ⇒ <code>number</code>
    * [.adjustAudioMixingVolume(volume)](#AgoraRtcEngine+adjustAudioMixingVolume) ⇒ <code>number</code>
    * [.adjustAudioMixingPlayoutVolume(volume)](#AgoraRtcEngine+adjustAudioMixingPlayoutVolume) ⇒ <code>number</code>
    * [.adjustAudioMixingPublishVolume(volume)](#AgoraRtcEngine+adjustAudioMixingPublishVolume) ⇒ <code>number</code>
    * [.getAudioMixingDuration()](#AgoraRtcEngine+getAudioMixingDuration) ⇒ <code>number</code>
    * [.getAudioMixingCurrentPosition()](#AgoraRtcEngine+getAudioMixingCurrentPosition) ⇒ <code>number</code>
    * [.setAudioMixingPosition(position)](#AgoraRtcEngine+setAudioMixingPosition) ⇒ <code>number</code>
    * [.addPublishStreamUrl(url, transcodingEnabled)](#AgoraRtcEngine+addPublishStreamUrl) ⇒ <code>number</code>
    * [.removePublishStreamUrl(url)](#AgoraRtcEngine+removePublishStreamUrl) ⇒ <code>number</code>
    * [.setLiveTranscoding(transcoding)](#AgoraRtcEngine+setLiveTranscoding) ⇒ <code>number</code>
    * [.addInjectStreamUrl(url, config)](#AgoraRtcEngine+addInjectStreamUrl) ⇒ <code>number</code>
    * [.removeInjectStreamUrl(url)](#AgoraRtcEngine+removeInjectStreamUrl) ⇒ <code>number</code>
    * [.setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)](#AgoraRtcEngine+setRecordingAudioFrameParameters) ⇒ <code>number</code>
    * [.setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)](#AgoraRtcEngine+setPlaybackAudioFrameParameters) ⇒ <code>number</code>
    * [.setMixedAudioFrameParameters(sampleRate, samplesPerCall)](#AgoraRtcEngine+setMixedAudioFrameParameters) ⇒ <code>number</code>
    * [.createDataStream(reliable, ordered)](#AgoraRtcEngine+createDataStream) ⇒ <code>number</code>
    * [.sendStreamMessage(streamId, msg)](#AgoraRtcEngine+sendStreamMessage) ⇒ <code>number</code>
    * [.getEffectsVolume()](#AgoraRtcEngine+getEffectsVolume) ⇒ <code>number</code>
    * [.setEffectsVolume(volume)](#AgoraRtcEngine+setEffectsVolume) ⇒ <code>number</code>
    * [.setVolumeOfEffect(soundId, volume)](#AgoraRtcEngine+setVolumeOfEffect) ⇒ <code>number</code>
    * [.playEffect(soundId, filePath, loopcount, pitch, pan, gain, publish)](#AgoraRtcEngine+playEffect) ⇒ <code>number</code>
    * [.stopEffect(soundId)](#AgoraRtcEngine+stopEffect) ⇒ <code>number</code>
    * [.preloadEffect(soundId, filePath)](#AgoraRtcEngine+preloadEffect) ⇒ <code>number</code>
    * [.unloadEffect(soundId)](#AgoraRtcEngine+unloadEffect) ⇒ <code>number</code>
    * [.pauseEffect(soundId)](#AgoraRtcEngine+pauseEffect) ⇒ <code>number</code>
    * [.pauseAllEffects()](#AgoraRtcEngine+pauseAllEffects) ⇒ <code>number</code>
    * [.resumeEffect(soundId)](#AgoraRtcEngine+resumeEffect) ⇒ <code>number</code>
    * [.resumeAllEffects()](#AgoraRtcEngine+resumeAllEffects) ⇒ <code>number</code>
    * [.getCallId()](#AgoraRtcEngine+getCallId) ⇒ <code>string</code>
    * [.rate(callId, rating, desc)](#AgoraRtcEngine+rate) ⇒ <code>number</code>
    * [.complain(callId, desc)](#AgoraRtcEngine+complain) ⇒ <code>number</code>

<a name="AgoraRtcEngine+setRenderMode"></a>

### agoraRtcEngine.setRenderMode(mode)
Decide whether to use webgl or software rending

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| mode | <code>1</code> \| <code>2</code> | <code>1</code> | 1 for old webgl rendering, 2 for software rendering |

<a name="AgoraRtcEngine+initRender"></a>

### agoraRtcEngine.initRender(key, view)
init renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> \| <code>number</code> | key for the map that store the renderers, e.g, uid or `videosource` or `local` |
| view | <code>\*</code> | dom elements to render video |

<a name="AgoraRtcEngine+destroyRender"></a>

### agoraRtcEngine.destroyRender(key, onFailure)
destroy renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> \| <code>number</code> | key for the map that store the renders, e.g, uid or `videosource` or `local` |
| onFailure | <code>function</code> | err callback for destroyRenderer |

<a name="AgoraRtcEngine+initialize"></a>

### agoraRtcEngine.initialize(appid) ⇒ <code>number</code>
initialize agora real-time-communicating engine with appid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

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
| errorCode | <code>number</code> | error code |

<a name="AgoraRtcEngine+joinChannel"></a>

### agoraRtcEngine.joinChannel(token, channel, info, uid) ⇒ <code>number</code>
Join channel with token, channel, channel_info and uid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
**Requires**: <code>module:channel</code>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | token |
| channel | <code>string</code> | channel |
| info | <code>string</code> | channel info |
| uid | <code>number</code> | uid |

<a name="AgoraRtcEngine+leaveChannel"></a>

### agoraRtcEngine.leaveChannel() ⇒ <code>number</code>
Leave channel

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setHighQualityAudioParameters"></a>

### agoraRtcEngine.setHighQualityAudioParameters(fullband, stereo, fullBitrate) ⇒ <code>number</code>
This method sets high-quality audio preferences. Call this method and set all the three
modes before joining a channel. Do NOT call this method again after joining a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| fullband | <code>boolean</code> | enable/disable fullband codec |
| stereo | <code>boolean</code> | enable/disable stereo codec |
| fullBitrate | <code>boolean</code> | enable/disable high bitrate mode |

<a name="AgoraRtcEngine+subscribe"></a>

### agoraRtcEngine.subscribe(uid, view) ⇒ <code>number</code>
subscribe remote uid and initialize corresponding renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | remote uid |
| view | <code>Element</code> | dom where to initialize renderer |

<a name="AgoraRtcEngine+setupLocalVideo"></a>

### agoraRtcEngine.setupLocalVideo(view) ⇒ <code>number</code>
setup local video and corresponding renderer

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>Element</code> | dom element where we will initialize our view |

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
| fps | <code>number</code> | frame/s |

<a name="AgoraRtcEngine+setVideoRenderHighFPS"></a>

### agoraRtcEngine.setVideoRenderHighFPS(fps)
force set renderer fps for high stream. High stream here MEANS uid streams which has been
added to high ones by calling addVideoRenderToHighFPS, note this has nothing to do with dual stream
high stream. This is often used when we want to set low fps for most of views, but high fps for one
or two special views, e.g. screenshare

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| fps | <code>number</code> | frame/s |

<a name="AgoraRtcEngine+addVideoRenderToHighFPS"></a>

### agoraRtcEngine.addVideoRenderToHighFPS(uid)
add stream to high fps stream by uid. fps of streams added to high fps stream will be
controlled by setVideoRenderHighFPS

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | stream uid |

<a name="AgoraRtcEngine+remoteVideoRenderFromHighFPS"></a>

### agoraRtcEngine.remoteVideoRenderFromHighFPS(uid)
remove stream from high fps stream by uid. fps of streams removed from high fps stream
will be controlled by setVideoRenderFPS

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | stream uid |

<a name="AgoraRtcEngine+setupViewContentMode"></a>

### agoraRtcEngine.setupViewContentMode(uid, mode) ⇒ <code>number</code>
setup view content mode

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 - success, -1 - fail  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | stream uid to operate |
| mode | <code>0</code> \| <code>1</code> | view content mode, 0 - fill, 1 - fit |

<a name="AgoraRtcEngine+renewToken"></a>

### agoraRtcEngine.renewToken(newtoken) ⇒ <code>number</code>
This method updates the Token.
The key expires after a certain period of time once the Token schema is enabled when:
The onError callback reports the ERR_TOKEN_EXPIRED(109) error, or
The onRequestToken callback reports the ERR_TOKEN_EXPIRED(109) error, or
The user receives the onTokenPrivilegeWillExpire callback.
The application should retrieve a new key and then call this method to renew it. Failure to do so will result in the SDK disconnecting from the server.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| newtoken | <code>string</code> | new token to update |

<a name="AgoraRtcEngine+setChannelProfile"></a>

### agoraRtcEngine.setChannelProfile(profile) ⇒ <code>number</code>
0 (default) for communication, 1 for live broadcasting, 2 for in-game

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| profile | <code>number</code> | profile enum |

<a name="AgoraRtcEngine+setClientRole"></a>

### agoraRtcEngine.setClientRole(role, permissionKey) ⇒ <code>number</code>
In live broadcasting mode, set client role, 1 for anchor, 2 for audience

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| role | <code>ClientRoleType</code> | client role |
| permissionKey | <code>string</code> | permission key |

<a name="AgoraRtcEngine+startEchoTest"></a>

### agoraRtcEngine.startEchoTest() ⇒ <code>number</code>
This method launches an audio call test to determine whether the audio devices
(for example, headset and speaker) and the network connection are working properly.
In the test, the user first speaks, and the recording is played back in 10 seconds.
If the user can hear the recording in 10 seconds, it indicates that the audio devices
and network connection work properly.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopEchoTest"></a>

### agoraRtcEngine.stopEchoTest() ⇒ <code>number</code>
This method stops an audio call test.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+enableLastmileTest"></a>

### agoraRtcEngine.enableLastmileTest() ⇒ <code>number</code>
This method tests the quality of the user’s network connection
and is disabled by default. Before users join a channel, they can call this
method to check the network quality. Calling this method consumes extra network
traffic, which may affect the communication quality. Call disableLastmileTest
to disable it immediately once users have received the onLastmileQuality
callback before they join the channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+disableLastmileTest"></a>

### agoraRtcEngine.disableLastmileTest() ⇒ <code>number</code>
This method disables the network connection quality test.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+enableVideo"></a>

### agoraRtcEngine.enableVideo() ⇒ <code>number</code>
Use before join channel to enable video communication, or you will only join with audio-enabled

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+disableVideo"></a>

### agoraRtcEngine.disableVideo() ⇒ <code>number</code>
Use to disable video and use pure audio communication

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+startPreview"></a>

### agoraRtcEngine.startPreview() ⇒ <code>number</code>
This method starts the local video preview. Before starting the preview,
always call setupLocalVideo to set up the preview window and configure the attributes,
and also call the enableVideo method to enable video. If startPreview is called to start
the local video preview before calling joinChannel to join a channel, the local preview
will still be in the started state after leaveChannel is called to leave the channel.
stopPreview can be called to close the local preview.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopPreview"></a>

### agoraRtcEngine.stopPreview() ⇒ <code>number</code>
This method stops the local video preview and closes the video.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setVideoProfile"></a>

### agoraRtcEngine.setVideoProfile(profile, [swapWidthAndHeight]) ⇒ <code>number</code>
**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| profile | <code>number</code> |  | enumeration values represent video profile |
| [swapWidthAndHeight] | <code>boolean</code> | <code>false</code> | Whether to swap width and height |

<a name="AgoraRtcEngine+setVideoEncoderConfiguration"></a>

### agoraRtcEngine.setVideoEncoderConfiguration(config) ⇒ <code>number</code>
**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | encoder config of video |
| config.width | <code>number</code> | width of video |
| config.height | <code>number</code> | height of video |
| config.fps | <code>number</code> | valid values, 1, 7, 10, 15, 24, 30, 60 |
| config.bitrate | <code>number</code> | 0 - standard(recommended), 1 - compatible |
| config.minbitrate | <code>number</code> | by default -1, changing this value is NOT recommended |
| config.orientation | <code>number</code> | 0 - auto adapt to capture source, 1 - Landscape(Horizontal), 2 - Portrait(Vertical) |

<a name="AgoraRtcEngine+enableAudio"></a>

### agoraRtcEngine.enableAudio() ⇒ <code>number</code>
This method enables the audio mode, which is enabled by default.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+disableAudio"></a>

### agoraRtcEngine.disableAudio() ⇒ <code>number</code>
This method disables the audio mode.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setAudioProfile"></a>

### agoraRtcEngine.setAudioProfile(profile, scenario) ⇒ <code>number</code>
Set audio profile (before join channel) depending on your scenario

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| profile | <code>number</code> | 0: default, 1: speech standard, 2: music standard. 3: music standard stereo, 4: music high quality, 5: music high quality stereo |
| scenario | <code>number</code> | 0: default, 1: chatroom entertainment, 2: education, 3: game streaming, 4: showroom, 5: game chating |

<a name="AgoraRtcEngine+setVideoQualityParameters"></a>

### agoraRtcEngine.setVideoQualityParameters(preferFrameRateOverImageQuality) ⇒ <code>number</code>
This method allows users to set video preferences.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| preferFrameRateOverImageQuality | <code>boolean</code> | enable/disable framerate over image quality |

<a name="AgoraRtcEngine+setEncryptionSecret"></a>

### agoraRtcEngine.setEncryptionSecret(secret) ⇒ <code>number</code>
Use setEncryptionSecret to specify an encryption password to enable built-in
encryption before joining a channel. All users in a channel must set the same encryption password.
The encryption password is automatically cleared once a user has left the channel.
If the encryption password is not specified or set to empty, the encryption function will be disabled.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | Encryption Password |

<a name="AgoraRtcEngine+muteLocalAudioStream"></a>

### agoraRtcEngine.muteLocalAudioStream(mute) ⇒ <code>number</code>
This method mutes/unmutes local audio. It enables/disables
sending local audio streams to the network.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+muteAllRemoteAudioStreams"></a>

### agoraRtcEngine.muteAllRemoteAudioStreams(mute) ⇒ <code>number</code>
This method mutes/unmutes all remote users’ audio streams.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+setDefaultMuteAllRemoteAudioStreams"></a>

### agoraRtcEngine.setDefaultMuteAllRemoteAudioStreams(mute) ⇒ <code>number</code>
Stops receiving all remote users' audio streams by default.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+muteRemoteAudioStream"></a>

### agoraRtcEngine.muteRemoteAudioStream(uid, mute) ⇒ <code>number</code>
This method mutes/unmutes a specified user’s audio stream.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | user to mute/unmute |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+muteLocalVideoStream"></a>

### agoraRtcEngine.muteLocalVideoStream(mute) ⇒ <code>number</code>
This method mutes/unmutes video stream

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute video |

<a name="AgoraRtcEngine+enableLocalVideo"></a>

### agoraRtcEngine.enableLocalVideo(enable) ⇒ <code>number</code>
This method disables the local video, which is only applicable to
the scenario when the user only wants to watch the remote video without sending
any video stream to the other user. This method does not require a local camera.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>boolean</code> | enable/disable video |

<a name="AgoraRtcEngine+muteAllRemoteVideoStreams"></a>

### agoraRtcEngine.muteAllRemoteVideoStreams(mute) ⇒ <code>number</code>
This method mutes/unmutes all remote users’ video streams.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute video |

<a name="AgoraRtcEngine+setDefaultMuteAllRemoteVideoStreams"></a>

### agoraRtcEngine.setDefaultMuteAllRemoteVideoStreams(mute) ⇒ <code>number</code>
Stops receiving all remote users’ video streams.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute audio |

<a name="AgoraRtcEngine+enableAudioVolumeIndication"></a>

### agoraRtcEngine.enableAudioVolumeIndication(interval, smooth) ⇒ <code>number</code>
This method enables the SDK to regularly report to the application
on which user is talking and the volume of the speaker. Once the method is enabled,
the SDK returns the volume indications at the set time internal in the Audio Volume
Indication Callback (onAudioVolumeIndication) callback, regardless of whether anyone
is speaking in the channel

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>number</code> | < 0 for disable, recommend to set > 200ms, < 10ms will not receive any callbacks |
| smooth | <code>number</code> | Smoothing factor. The default value is 3 |

<a name="AgoraRtcEngine+muteRemoteVideoStream"></a>

### agoraRtcEngine.muteRemoteVideoStream(uid, mute) ⇒ <code>number</code>
This method mutes/unmutes a specified user’s video stream.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | user to mute/unmute |
| mute | <code>boolean</code> | mute/unmute video |

<a name="AgoraRtcEngine+setInEarMonitoringVolume"></a>

### agoraRtcEngine.setInEarMonitoringVolume(volume) ⇒ <code>number</code>
This method sets the in ear monitoring volume.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> | Volume of the in-ear monitor, ranging from 0 to 100. The default value is 100. |

<a name="AgoraRtcEngine+pauseAudio"></a>

### agoraRtcEngine.pauseAudio() ⇒ <code>number</code>
disable audio function in channel, which will be recovered when leave channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+resumeAudio"></a>

### agoraRtcEngine.resumeAudio() ⇒ <code>number</code>
resume audio function in channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+setLogFile"></a>

### agoraRtcEngine.setLogFile(filepath) ⇒ <code>number</code>
set filepath of log

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | filepath of log |

<a name="AgoraRtcEngine+videoSourceSetLogFile"></a>

### agoraRtcEngine.videoSourceSetLogFile(filepath) ⇒ <code>number</code>
set filepath of videosource log (Called After videosource initialized)

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | filepath of log |

<a name="AgoraRtcEngine+setLogFilter"></a>

### agoraRtcEngine.setLogFilter(filter) ⇒ <code>number</code>
set log level

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>number</code> | filter level LOG_FILTER_OFF = 0: Output no log. LOG_FILTER_DEBUG = 0x80f: Output all the API logs. LOG_FILTER_INFO = 0x0f: Output logs of the CRITICAL, ERROR, WARNING and INFO level. LOG_FILTER_WARNING = 0x0e: Output logs of the CRITICAL, ERROR and WARNING level. LOG_FILTER_ERROR = 0x0c: Output logs of the CRITICAL and ERROR level. LOG_FILTER_CRITICAL = 0x08: Output logs of the CRITICAL level. |

<a name="AgoraRtcEngine+enableDualStreamMode"></a>

### agoraRtcEngine.enableDualStreamMode(enable) ⇒ <code>number</code>
This method sets the stream mode (only applicable to live broadcast) to
single- (default) or dual-stream mode.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>boolean</code> | enable/disable dual stream |

<a name="AgoraRtcEngine+setRemoteVideoStreamType"></a>

### agoraRtcEngine.setRemoteVideoStreamType(uid, streamType) ⇒ <code>number</code>
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
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | User ID |
| streamType | <code>StreamType</code> | 0 - high, 1 - low |

<a name="AgoraRtcEngine+setRemoteDefaultVideoStreamType"></a>

### agoraRtcEngine.setRemoteDefaultVideoStreamType(streamType) ⇒ <code>number</code>
This method sets the default remote video stream type to high or low.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| streamType | <code>StreamType</code> | 0 - high, 1 - low |

<a name="AgoraRtcEngine+enableWebSdkInteroperability"></a>

### agoraRtcEngine.enableWebSdkInteroperability(enable) ⇒ <code>number</code>
This method enables interoperability with the Agora Web SDK.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>boolean</code> | enable/disable interop |

<a name="AgoraRtcEngine+setLocalVideoMirrorMode"></a>

### agoraRtcEngine.setLocalVideoMirrorMode(mirrortype) ⇒ <code>number</code>
This method sets the local video mirror mode. Use this method before startPreview,
or it does not take effect until you re-enable startPreview.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mirrortype | <code>number</code> | mirror type 0: The default mirror mode, that is, the mode set by the SDK 1: Enable the mirror mode 2: Disable the mirror mode |

<a name="AgoraRtcEngine+setLocalVoicePitch"></a>

### agoraRtcEngine.setLocalVoicePitch(pitch) ⇒ <code>number</code>
Changes the voice pitch of the local speaker.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>number</code> | The value ranges between 0.5 and 2.0. The lower the value, the lower the voice pitch. The default value is 1.0 (no change to the local voice pitch). |

<a name="AgoraRtcEngine+setLocalVoiceEqualization"></a>

### agoraRtcEngine.setLocalVoiceEqualization(bandFrequency, bandGain) ⇒ <code>number</code>
Sets the local voice equalization effect.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| bandFrequency | <code>number</code> | Sets the band frequency. The value ranges between 0 and 9, representing the respective 10-band center frequencies of the voice effects including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz. |
| bandGain | <code>number</code> | Sets the gain of each band in dB. The value ranges between -15 and 15. |

<a name="AgoraRtcEngine+setLocalVoiceReverb"></a>

### agoraRtcEngine.setLocalVoiceReverb(reverbKey, value) ⇒ <code>number</code>
Sets the local voice reverberation.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| reverbKey | <code>number</code> | Audio reverberation type. AUDIO_REVERB_DRY_LEVEL = 0, // (dB, [-20,10]), the level of the dry signal AUDIO_REVERB_WET_LEVEL = 1, // (dB, [-20,10]), the level of the early reflection signal (wet signal) AUDIO_REVERB_ROOM_SIZE = 2, // ([0,100]), the room size of the reflection AUDIO_REVERB_WET_DELAY = 3, // (ms, [0,200]), the length of the initial delay of the wet signal in ms AUDIO_REVERB_STRENGTH = 4, // ([0,100]), the strength of the reverberation |
| value | <code>number</code> | value Sets the value of the reverberation key. |

<a name="AgoraRtcEngine+setLocalPublishFallbackOption"></a>

### agoraRtcEngine.setLocalPublishFallbackOption(option) ⇒ <code>number</code>
Sets the fallback option for the locally published video stream based on the network conditions.
The default setting for option is #STREAM_FALLBACK_OPTION_DISABLED, where there is no fallback for the locally published video stream when the uplink network conditions are poor.
If *option* is set to #STREAM_FALLBACK_OPTION_AUDIO_ONLY, the SDK will:
- Disable the upstream video but enable audio only when the network conditions worsen and cannot support both video and audio.
- Re-enable the video when the network conditions improve.
When the locally published stream falls back to audio only or when the audio stream switches back to the video,
the \ref agora::rtc::IRtcEngineEventHandler::onLocalPublishFallbackToAudioOnly "onLocalPublishFallbackToAudioOnly" callback is triggered.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
**Note**: Agora does not recommend using this method for CDN live streaming, because the remote CDN live user will have a noticeable lag when the locally publish stream falls back to audio-only.  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>number</code> | Sets the fallback option for the locally published video stream. STREAM_FALLBACK_OPTION_DISABLED = 0 STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1 STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2 |

<a name="AgoraRtcEngine+setRemoteSubscribeFallbackOption"></a>

### agoraRtcEngine.setRemoteSubscribeFallbackOption(option) ⇒ <code>number</code>
Sets the fallback option for the remotely subscribed stream based on the network conditions.
The default setting for @p option is #STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW, where the remotely subscribed stream falls back to
the low-stream video (low resolution and low bitrate) under poor downlink network conditions.
If *option* is set to #STREAM_FALLBACK_OPTION_AUDIO_ONLY, the SDK automatically switches the video from a high-stream to a low-stream,
or disable the video when the downlink network conditions cannot support both audio and video to guarantee the quality of the audio.
The SDK monitors the network quality and restores the video stream when the network conditions improve.
Once the locally published stream falls back to audio only or the audio stream switches back to the video stream,
the \ref agora::rtc::IRtcEngineEventHandler::onRemoteSubscribeFallbackToAudioOnly "onRemoteSubscribeFallbackToAudioOnly" callback is triggered.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>number</code> | Sets the fallback option for the remotely subscribed stream. STREAM_FALLBACK_OPTION_DISABLED = 0 STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1 STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2 |

<a name="AgoraRtcEngine+setExternalAudioSource"></a>

### agoraRtcEngine.setExternalAudioSource(enabled, samplerate, channels) ⇒ <code>number</code>
This method sets the external audio source.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>boolean</code> | Enable the function of the external audio source: true/false. |
| samplerate | <code>number</code> | Sampling rate of the external audio source. |
| channels | <code>number</code> | Number of the external audio source channels (two channels maximum). |

<a name="AgoraRtcEngine+getVideoDevices"></a>

### agoraRtcEngine.getVideoDevices() ⇒ <code>Array</code>
return list of video devices

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>Array</code> - array of device object  
<a name="AgoraRtcEngine+setVideoDevice"></a>

### agoraRtcEngine.setVideoDevice(deviceId) ⇒ <code>number</code>
set video device to use via device id

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | device id |

<a name="AgoraRtcEngine+getCurrentVideoDevice"></a>

### agoraRtcEngine.getCurrentVideoDevice() ⇒ <code>Object</code>
get current using video device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>Object</code> - video device object  
<a name="AgoraRtcEngine+startVideoDeviceTest"></a>

### agoraRtcEngine.startVideoDeviceTest() ⇒ <code>number</code>
This method tests whether the video-capture device works properly.
Before calling this method, ensure that you have already called enableVideo,
and the HWND window handle of the incoming parameter is valid.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopVideoDeviceTest"></a>

### agoraRtcEngine.stopVideoDeviceTest() ⇒ <code>number</code>
stop video device test

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+getAudioPlaybackDevices"></a>

### agoraRtcEngine.getAudioPlaybackDevices() ⇒ <code>Array</code>
return list of audio playback devices

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>Array</code> - array of device object  
<a name="AgoraRtcEngine+setAudioPlaybackDevice"></a>

### agoraRtcEngine.setAudioPlaybackDevice(deviceId) ⇒ <code>number</code>
set audio playback device to use via device id

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | device id |

<a name="AgoraRtcEngine+getPlaybackDeviceInfo"></a>

### agoraRtcEngine.getPlaybackDeviceInfo(deviceId, deviceName) ⇒ <code>number</code>
Retrieves the audio playback device information associated with the device ID and device name

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | device id |
| deviceName | <code>string</code> | device name |

<a name="AgoraRtcEngine+getCurrentAudioPlaybackDevice"></a>

### agoraRtcEngine.getCurrentAudioPlaybackDevice() ⇒ <code>Object</code>
get current using audio playback device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>Object</code> - audio playback device object  
<a name="AgoraRtcEngine+setAudioPlaybackVolume"></a>

### agoraRtcEngine.setAudioPlaybackVolume(volume) ⇒ <code>number</code>
set device playback volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> | 0 - 255 |

<a name="AgoraRtcEngine+getAudioPlaybackVolume"></a>

### agoraRtcEngine.getAudioPlaybackVolume() ⇒ <code>number</code>
get device playback volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - volume  
<a name="AgoraRtcEngine+getAudioRecordingDevices"></a>

### agoraRtcEngine.getAudioRecordingDevices() ⇒ <code>Array</code>
get audio recording devices

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>Array</code> - array of recording devices  
<a name="AgoraRtcEngine+setAudioRecordingDevice"></a>

### agoraRtcEngine.setAudioRecordingDevice(deviceId) ⇒ <code>number</code>
set audio recording device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | device id |

<a name="AgoraRtcEngine+getRecordingDeviceInfo"></a>

### agoraRtcEngine.getRecordingDeviceInfo(deviceId, deviceName) ⇒ <code>number</code>
Retrieves the audio recording device information associated with the device ID and device name.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | device id |
| deviceName | <code>string</code> | device name |

<a name="AgoraRtcEngine+getCurrentAudioRecordingDevice"></a>

### agoraRtcEngine.getCurrentAudioRecordingDevice() ⇒ <code>Object</code>
get current selected audio recording device

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>Object</code> - audio recording device object  
<a name="AgoraRtcEngine+getAudioRecordingVolume"></a>

### agoraRtcEngine.getAudioRecordingVolume() ⇒ <code>number</code>
get audio recording volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - volume  
<a name="AgoraRtcEngine+setAudioRecordingVolume"></a>

### agoraRtcEngine.setAudioRecordingVolume(volume) ⇒ <code>number</code>
set audio recording device volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> | 0 - 255 |

<a name="AgoraRtcEngine+startAudioPlaybackDeviceTest"></a>

### agoraRtcEngine.startAudioPlaybackDeviceTest(filepath) ⇒ <code>number</code>
This method checks whether the playback device works properly. The SDK plays an audio file
specified by the user. If the user can hear the sound, then the playback device works properly.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | filepath of sound file to play test |

<a name="AgoraRtcEngine+stopAudioPlaybackDeviceTest"></a>

### agoraRtcEngine.stopAudioPlaybackDeviceTest() ⇒ <code>number</code>
stop playback device test

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+enableLoopbackRecording"></a>

### agoraRtcEngine.enableLoopbackRecording([enable]) ⇒ <code>number</code>
This method enables loopback recording. Once enabled, the SDK collects all local sounds.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [enable] | <code>boolean</code> | <code>false</code> | whether to enable loop back recording |

<a name="AgoraRtcEngine+startAudioRecordingDeviceTest"></a>

### agoraRtcEngine.startAudioRecordingDeviceTest(indicateInterval) ⇒ <code>number</code>
This method checks whether the microphone works properly. Once the test starts, the SDK uses
the onAudioVolumeIndication callback to notify the application about the volume information.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| indicateInterval | <code>number</code> | in second |

<a name="AgoraRtcEngine+stopAudioRecordingDeviceTest"></a>

### agoraRtcEngine.stopAudioRecordingDeviceTest() ⇒ <code>number</code>
stop audio recording device test

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+getAudioPlaybackDeviceMute"></a>

### agoraRtcEngine.getAudioPlaybackDeviceMute() ⇒ <code>boolean</code>
check whether selected audio playback device is muted

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>boolean</code> - muted/unmuted  
<a name="AgoraRtcEngine+setAudioPlaybackDeviceMute"></a>

### agoraRtcEngine.setAudioPlaybackDeviceMute(mute) ⇒ <code>number</code>
set current audio playback device mute/unmute

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute |

<a name="AgoraRtcEngine+getAudioRecordingDeviceMute"></a>

### agoraRtcEngine.getAudioRecordingDeviceMute() ⇒ <code>boolean</code>
check whether selected audio recording device is muted

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>boolean</code> - muted/unmuted  
<a name="AgoraRtcEngine+setAudioRecordingDeviceMute"></a>

### agoraRtcEngine.setAudioRecordingDeviceMute(mute) ⇒ <code>number</code>
set current audio recording device mute/unmute

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| mute | <code>boolean</code> | mute/unmute |

<a name="AgoraRtcEngine+videoSourceInitialize"></a>

### agoraRtcEngine.videoSourceInitialize(appId) ⇒ <code>number</code>
initialize agora real-time-communicating videosource with appid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| appId | <code>string</code> | agora appid |

<a name="AgoraRtcEngine+setupLocalVideoSource"></a>

### agoraRtcEngine.setupLocalVideoSource(view)
setup renderer for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>Element</code> | dom element where video source should be displayed |

<a name="AgoraRtcEngine+videoSourceEnableWebSdkInteroperability"></a>

### agoraRtcEngine.videoSourceEnableWebSdkInteroperability(enabled) ⇒ <code>number</code>
Set it to true to enable videosource web interoperability (After videosource initialized)

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>boolean</code> | enalbe/disable web interoperability |

<a name="AgoraRtcEngine+videoSourceJoin"></a>

### agoraRtcEngine.videoSourceJoin(token, cname, info, uid) ⇒ <code>number</code>
let video source join channel with token, channel, channel_info and uid

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | token |
| cname | <code>string</code> | channel |
| info | <code>string</code> | channel info |
| uid | <code>number</code> | uid |

<a name="AgoraRtcEngine+videoSourceLeave"></a>

### agoraRtcEngine.videoSourceLeave() ⇒ <code>number</code>
let video source Leave channel

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+videoSourceRenewToken"></a>

### agoraRtcEngine.videoSourceRenewToken(token) ⇒ <code>number</code>
This method updates the Token for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | new token to update |

<a name="AgoraRtcEngine+videoSourceSetChannelProfile"></a>

### agoraRtcEngine.videoSourceSetChannelProfile(profile) ⇒ <code>number</code>
0 (default) for communication, 1 for live broadcasting, 2 for in-game

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| profile | <code>number</code> | profile |

<a name="AgoraRtcEngine+videoSourceSetVideoProfile"></a>

### agoraRtcEngine.videoSourceSetVideoProfile(profile, [swapWidthAndHeight]) ⇒ <code>number</code>
set video profile for video source (must be called after startScreenCapture2)

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| profile | <code>number</code> |  | enumeration values represent video profile |
| [swapWidthAndHeight] | <code>boolean</code> | <code>false</code> | Whether to swap width and height |

<a name="AgoraRtcEngine+getScreenWindowsInfo"></a>

### agoraRtcEngine.getScreenWindowsInfo() ⇒ <code>Array</code>
get list of all system window ids and relevant infos, the window id can be used for screen share

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>Array</code> - list of window infos  
<a name="AgoraRtcEngine+startScreenCapture2"></a>

### agoraRtcEngine.startScreenCapture2(wndid, captureFreq, rect, bitrate) ⇒ <code>number</code>
start video source screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| wndid | <code>number</code> | windows id to capture |
| captureFreq | <code>number</code> | fps of video source screencapture, 1 - 15 |
| rect | <code>\*</code> | null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen) |
| bitrate | <code>number</code> | bitrate of video source screencapture |

<a name="AgoraRtcEngine+stopScreenCapture2"></a>

### agoraRtcEngine.stopScreenCapture2() ⇒ <code>number</code>
stop video source screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+startScreenCapturePreview"></a>

### agoraRtcEngine.startScreenCapturePreview() ⇒ <code>number</code>
start video source preview

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+stopScreenCapturePreview"></a>

### agoraRtcEngine.stopScreenCapturePreview() ⇒ <code>number</code>
stop video source preview

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+videoSourceEnableDualStreamMode"></a>

### agoraRtcEngine.videoSourceEnableDualStreamMode(enable) ⇒ <code>number</code>
enable dual stream mode for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>boolean</code> | whether dual stream mode is enabled |

<a name="AgoraRtcEngine+videoSourceSetParameters"></a>

### agoraRtcEngine.videoSourceSetParameters(parameter) ⇒ <code>number</code>
setParameters for video source

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| parameter | <code>string</code> | parameter to set |

<a name="AgoraRtcEngine+videoSourceRelease"></a>

### agoraRtcEngine.videoSourceRelease() ⇒ <code>number</code>
release video source object

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+startScreenCapture"></a>

### agoraRtcEngine.startScreenCapture(windowId, captureFreq, rect, bitrate) ⇒ <code>number</code>
start screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| windowId | <code>number</code> | windows id to capture |
| captureFreq | <code>number</code> | fps of screencapture, 1 - 15 |
| rect | <code>\*</code> | null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen) |
| bitrate | <code>number</code> | bitrate of screencapture |

<a name="AgoraRtcEngine+stopScreenCapture"></a>

### agoraRtcEngine.stopScreenCapture() ⇒ <code>number</code>
stop screen capture

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+updateScreenCaptureRegion"></a>

### agoraRtcEngine.updateScreenCaptureRegion(rect) ⇒ <code>number</code>
This method updates the screen capture region.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| rect | <code>\*</code> | {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen) |

<a name="AgoraRtcEngine+startAudioMixing"></a>

### agoraRtcEngine.startAudioMixing(filepath, loopback, replace, cycle) ⇒ <code>number</code>
This method mixes the specified local audio file with the audio stream
from the microphone; or, it replaces the microphone’s audio stream with the specified
local audio file. You can choose whether the other user can hear the local audio playback
and specify the number of loop playbacks. This API also supports online music playback.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | Name and path of the local audio file to be mixed.            Supported audio formats: mp3, aac, m4a, 3gp, and wav. |
| loopback | <code>boolean</code> | true - local loopback, false - remote loopback |
| replace | <code>boolean</code> | whether audio file replace microphone audio |
| cycle | <code>number</code> | number of loop playbacks, -1 for infinite |

<a name="AgoraRtcEngine+stopAudioMixing"></a>

### agoraRtcEngine.stopAudioMixing() ⇒ <code>number</code>
This method stops audio mixing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+pauseAudioMixing"></a>

### agoraRtcEngine.pauseAudioMixing() ⇒ <code>number</code>
This method pauses audio mixing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+resumeAudioMixing"></a>

### agoraRtcEngine.resumeAudioMixing() ⇒ <code>number</code>
This method resumes audio mixing from pausing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+adjustAudioMixingVolume"></a>

### agoraRtcEngine.adjustAudioMixingVolume(volume) ⇒ <code>number</code>
This method adjusts the volume during audio mixing. Call this API when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> | Volume ranging from 0 to 100. By default, 100 is the original volume. |

<a name="AgoraRtcEngine+adjustAudioMixingPlayoutVolume"></a>

### agoraRtcEngine.adjustAudioMixingPlayoutVolume(volume) ⇒ <code>number</code>
Adjusts the audio mixing volume for local playback.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> | Volume ranging from 0 to 100. By default, 100 is the original volume. |

<a name="AgoraRtcEngine+adjustAudioMixingPublishVolume"></a>

### agoraRtcEngine.adjustAudioMixingPublishVolume(volume) ⇒ <code>number</code>
Adjusts the audio mixing volume for publishing (for remote users).

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> | Volume ranging from 0 to 100. By default, 100 is the original volume. |

<a name="AgoraRtcEngine+getAudioMixingDuration"></a>

### agoraRtcEngine.getAudioMixingDuration() ⇒ <code>number</code>
This method gets the duration (ms) of the audio mixing. Call this API when you are in
a channel. A return value of 0 means that this method call has failed.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - duration of audio mixing  
<a name="AgoraRtcEngine+getAudioMixingCurrentPosition"></a>

### agoraRtcEngine.getAudioMixingCurrentPosition() ⇒ <code>number</code>
This method gets the playback position (ms) of the audio. Call this API
when you are in a channel.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - current playback position  
<a name="AgoraRtcEngine+setAudioMixingPosition"></a>

### agoraRtcEngine.setAudioMixingPosition(position) ⇒ <code>number</code>
This method drags the playback progress bar of the audio mixing file to where
you want to play instead of playing it from the beginning.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>number</code> | Integer. The position of the audio mixing file in ms |

<a name="AgoraRtcEngine+addPublishStreamUrl"></a>

### agoraRtcEngine.addPublishStreamUrl(url, transcodingEnabled) ⇒ <code>number</code>
Adds a stream RTMP URL address, to which the host publishes the stream. (CDN live only.)
Invoke onStreamPublished when successful

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
**Note**: - Ensure that the user joins the channel before calling this method.
- This method adds only one stream RTMP URL address each time it is called.
- The RTMP URL address must not contain special characters, such as Chinese language characters.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Pointer to the RTMP URL address, to which the host publishes the stream |
| transcodingEnabled | <code>bool</code> | Sets whether transcoding is enabled/disabled |

<a name="AgoraRtcEngine+removePublishStreamUrl"></a>

### agoraRtcEngine.removePublishStreamUrl(url) ⇒ <code>number</code>
Removes a stream RTMP URL address. (CDN live only.)

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
**Note**: - This method removes only one RTMP URL address each time it is called.
- The RTMP URL address must not contain special characters, such as Chinese language characters.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Pointer to the RTMP URL address to be removed. |

<a name="AgoraRtcEngine+setLiveTranscoding"></a>

### agoraRtcEngine.setLiveTranscoding(transcoding) ⇒ <code>number</code>
Sets the video layout and audio settings for CDN live. (CDN live only.)

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| transcoding | <code>TranscodingConfig</code> | transcoding Sets the CDN live audio/video transcoding settings. See LiveTranscoding. |

<a name="AgoraRtcEngine+addInjectStreamUrl"></a>

### agoraRtcEngine.addInjectStreamUrl(url, config) ⇒ <code>number</code>
Adds a voice or video stream HTTP/HTTPS URL address to a live broadcast.
- The \ref IRtcEngineEventHandler::onStreamInjectedStatus "onStreamInjectedStatus" callback returns
the inject stream status.
- The added stream HTTP/HTTPS URL address can be found in the channel with a @p uid of 666, and the
\ref IRtcEngineEventHandler::onUserJoined "onUserJoined" and \ref IRtcEngineEventHandler::onFirstRemoteVideoFrame "onFirstRemoteVideoFrame"
callbacks are triggered.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Pointer to the HTTP/HTTPS URL address to be added to the ongoing live broadcast. Valid protocols are RTMP, HLS, and FLV. - Supported FLV audio codec type: AAC. - Supported FLV video codec type: H264 (AVC). |
| config | <code>InjectStreamConfig</code> | Pointer to the InjectStreamConfig object that contains the configuration of the added voice or video stream |

<a name="AgoraRtcEngine+removeInjectStreamUrl"></a>

### agoraRtcEngine.removeInjectStreamUrl(url) ⇒ <code>number</code>
Removes the voice or video stream HTTP/HTTPS URL address from a live broadcast.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
**Note**: If this method is called successfully, the \ref IRtcEngineEventHandler::onUserOffline "onUserOffline" callback is triggered
and a stream uid of 666 is returned.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Pointer to the HTTP/HTTPS URL address of the added stream to be removed. |

<a name="AgoraRtcEngine+setRecordingAudioFrameParameters"></a>

### agoraRtcEngine.setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) ⇒ <code>number</code>
This method sets the format of the callback data in onRecordAudioFrame.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| sampleRate | <code>number</code> | It specifies the sampling rate in the callback data returned by onRecordAudioFrame, which can set be as 8000, 16000, 32000, 44100 or 48000. |
| channel | <code>number</code> | 1 - mono, 2 - dual |
| mode | <code>number</code> | 0 - read only mode, 1 - write-only mode, 2 - read and white mode |
| samplesPerCall | <code>number</code> | It specifies the sampling points in the called data returned in onRecordAudioFrame, for example, it is usually set as 1024 for stream pushing. |

<a name="AgoraRtcEngine+setPlaybackAudioFrameParameters"></a>

### agoraRtcEngine.setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) ⇒ <code>number</code>
This method sets the format of the callback data in onPlaybackAudioFrame.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| sampleRate | <code>number</code> | Specifies the sampling rate in the callback data returned by onPlaybackAudioFrame, which can set be as 8000, 16000, 32000, 44100, or 48000. |
| channel | <code>number</code> | 1 - mono, 2 - dual |
| mode | <code>number</code> | 0 - read only mode, 1 - write-only mode, 2 - read and white mode |
| samplesPerCall | <code>number</code> | It specifies the sampling points in the called data returned in onRecordAudioFrame, for example, it is usually set as 1024 for stream pushing. |

<a name="AgoraRtcEngine+setMixedAudioFrameParameters"></a>

### agoraRtcEngine.setMixedAudioFrameParameters(sampleRate, samplesPerCall) ⇒ <code>number</code>
This method sets the format of the callback data in onMixedAudioFrame.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| sampleRate | <code>number</code> | Specifies the sampling rate in the callback data returned by onMixedAudioFrame, which can set be as 8000, 16000, 32000, 44100, or 48000. |
| samplesPerCall | <code>number</code> | Specifies the sampling points in the called data returned in onMixedAudioFrame, for example, it is usually set as 1024 for stream pushing. |

<a name="AgoraRtcEngine+createDataStream"></a>

### agoraRtcEngine.createDataStream(reliable, ordered) ⇒ <code>number</code>
This method creates a data stream. Each user can only have up to five data channels at the same time.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - <0 for failure, > 0 for stream id of data  

| Param | Type | Description |
| --- | --- | --- |
| reliable | <code>boolean</code> | true - The recipients will receive data from the sender within 5 seconds. If the recipient does not receive the sent data within 5 seconds, the data channel will report an error to the application. false - The recipients may not receive any data, while it will not report any error upon data missing. |
| ordered | <code>boolean</code> | true - The recipients will receive data in the order of the sender. false - The recipients will not receive data in the order of the sender. |

<a name="AgoraRtcEngine+sendStreamMessage"></a>

### agoraRtcEngine.sendStreamMessage(streamId, msg) ⇒ <code>number</code>
This method sends data stream messages to all users in a channel.
Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
The API controls the data channel transfer rate. Each client can send up to 6 kB of data per second.
Each user can have up to five data channels simultaneously.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>number</code> | Stream ID from createDataStream |
| msg | <code>string</code> | Data to be sent |

<a name="AgoraRtcEngine+getEffectsVolume"></a>

### agoraRtcEngine.getEffectsVolume() ⇒ <code>number</code>
get effects volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - volume  
<a name="AgoraRtcEngine+setEffectsVolume"></a>

### agoraRtcEngine.setEffectsVolume(volume) ⇒ <code>number</code>
set effects volume

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> | [0.0, 100.0] |

<a name="AgoraRtcEngine+setVolumeOfEffect"></a>

### agoraRtcEngine.setVolumeOfEffect(soundId, volume) ⇒ <code>number</code>
set effect volume of a sound id

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| soundId | <code>number</code> | soundId |
| volume | <code>number</code> | [0.0, 100.0] |

<a name="AgoraRtcEngine+playEffect"></a>

### agoraRtcEngine.playEffect(soundId, filePath, loopcount, pitch, pan, gain, publish) ⇒ <code>number</code>
play effect

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| soundId | <code>number</code> | soundId |
| filePath | <code>string</code> | filepath |
| loopcount | <code>number</code> | 0: once, 1: twice, -1: infinite |
| pitch | <code>number</code> | [0.5, 2] |
| pan | <code>number</code> | [-1, 1] |
| gain | <code>number</code> | [0, 100] |
| publish | <code>boolean</code> | publish |

<a name="AgoraRtcEngine+stopEffect"></a>

### agoraRtcEngine.stopEffect(soundId) ⇒ <code>number</code>
stop effect via given sound id

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| soundId | <code>number</code> | soundId |

<a name="AgoraRtcEngine+preloadEffect"></a>

### agoraRtcEngine.preloadEffect(soundId, filePath) ⇒ <code>number</code>
preload effect

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| soundId | <code>number</code> | soundId |
| filePath | <code>string</code> | filepath |

<a name="AgoraRtcEngine+unloadEffect"></a>

### agoraRtcEngine.unloadEffect(soundId) ⇒ <code>number</code>
This method releases a specific preloaded audio effect from the memory.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| soundId | <code>number</code> | soundId |

<a name="AgoraRtcEngine+pauseEffect"></a>

### agoraRtcEngine.pauseEffect(soundId) ⇒ <code>number</code>
This method pauses a specific audio effect.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| soundId | <code>number</code> | soundId |

<a name="AgoraRtcEngine+pauseAllEffects"></a>

### agoraRtcEngine.pauseAllEffects() ⇒ <code>number</code>
This method pauses all the audio effects.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
<a name="AgoraRtcEngine+resumeEffect"></a>

### agoraRtcEngine.resumeEffect(soundId) ⇒ <code>number</code>
This method resumes playing a specific audio effect.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| soundId | <code>number</code> | sound id |

<a name="AgoraRtcEngine+resumeAllEffects"></a>

### agoraRtcEngine.resumeAllEffects() ⇒ <code>number</code>
This method resumes playing all the audio effects.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  
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

### agoraRtcEngine.rate(callId, rating, desc) ⇒ <code>number</code>
This method lets the user rate the call. It is usually called after the call ends.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| callId | <code>string</code> | Call ID retrieved from the getCallId method. |
| rating | <code>number</code> | Rating for the call between 1 (lowest score) to 10 (highest score). |
| desc | <code>string</code> | A given description for the call with a length less than 800 bytes. |

<a name="AgoraRtcEngine+complain"></a>

### agoraRtcEngine.complain(callId, desc) ⇒ <code>number</code>
This method allows the user to complain about the call quality. It is usually
called after the call ends.

**Kind**: instance method of [<code>AgoraRtcEngine</code>](#AgoraRtcEngine)  
**Returns**: <code>number</code> - 0 for success, <0 for failure  

| Param | Type | Description |
| --- | --- | --- |
| callId | <code>string</code> | Call ID retrieved from the getCallId method. |
| desc | <code>string</code> | A given description of the call with a length less than 800 bytes. |

