AgoraSDK.js provide JS SDK API. It relies on AgoraRender.js and webgl-utils.js to render video, three JS files mute be included.

Class AgoraRtcEngine provide SDK functionalities, and also it's one event emitter, client could listen on interested event.

To create AgoraRtcEngine instance :

	const AgoraRtcEngine = require("AgoraSdk");
	var engine = new AgoraRtcEngine();

APIs:

	To initialize the AgoraRtcEngine instance with supplied appid. AgoraRtcEngine instance must be initialized before other functions invoked.

	```
	initialize(appid, onSuccess, onFailed)
	```

	To get current SDK version.
	
	```
	getVersion()
	```
	To get description of errorCode.
  ```
	getErrorDescription(errorCode)
	```


	To join channel with supplied information.
	```
	joinChannel(key, name, chan_info, uid)
	```

	To leave current channel
	```
	leaveChannel()
	```

	After user with uid joined channel, subscribe used to bind user's video to the view.
	```
	subscribe(uid, view)
	```

	When video source is used to share screen, uses setupLocalVideoSource to bind video source's video to the view for the preview.
	```
	setupLocalVideoSource(view)
	```

	Used to bind local video to the view.
	```
	setupLocalVideo(view)
	```

	Used to bind dev test video to the view
	```
	setupLocalDevTest(view)
	```

	To update key.
	```
	renewChannelKey(newKey)
	```

	To setup channel profile
	```
	setChannelProfile(profile)
	```

	To setup client's role based on parameters.
	```
	setClientRole(role, permissionKey)
	```

	To start Echo test.
	```
	startEchoTest()
	```

	To stop Echo test.
	```
	stopEchoTest()
	```

	To enable last mile test.
	```
	enableLastmileTest()
	```

	To disable last mile test.
	```
	disableLastmileTest()
	```

	Enable video.
	```
	enableVideo()
	```

	Disable video
	```
	disableVideo()
	```

	Start video preview.
	```
	startPreview()
	```

	Stop video preview.
	```
	stopPreview()
	```

	Setup video profile.
	```
	setVideoProfile(profile, swapWidthAndHeight)
	```

	Enable audio.
	```
	enableAudio()
	```

	Disable audio.
	```
	disableAudio()
	```
	Setup audio profile.
	```
	setAudioProfile(profile, scenario)
	```

	Get current call id.
	```
	getCallId()
	```

	To rate SDK.
	```
	rate(callid, rating, desc)
	```

	To complain about the SDK.
	```
	complain(callid, desc)
	```

	To set encryption secret.
	```
	setEncryptionSecret(secret)
	```

	createDataStream(reliable, ordered)

	sendStreamMessage(streamId, msg)

	Mute/unmute local audio.
	```
	muteLocalAudioStream(mute)
	```

	Mute/unmute all remote audios.
	```
	muteAllRemoteAudioStreams(mute)
	```

	Mute/unmute the user's audio with uid.
	```
	muteRemoteAudioStream(uid, mute)
	```

	Mute/unmute local video stream.
	```
	muteLocalVideoStream(mute)
	```

	Enable/disable local video
	```
	enableLocalVideo(enable)
	```

	Mute/unmute all remote videos.
	```
	muteAllRemoteVideoStreams(mute)
	```

	Mute/unmute the users video with uid.
	```
	muteRemoteVideoStream(uid, mute)
	```

	setRemoteVideoStreamType(uid, streamType)

	setRemoteDefaultVideoStreamType(streamType)

	Start audio recording.
	```
	startAudioRecording(filePath)
	```

	Stop audio recording.
	```
	stopAudioRecording()
	```

	Start audio mixing
	```
	startAudioMixing(filepath, loopback, replace, cycle)
	```

	Stop audio mixing.
	```
	stopAudioMixing()
	```

	Pause audio mixing.
	```
	pauseAudioMixing()
	```

	Resume audio mixing.
	```
	resumeAudioMixing()
		```

	Adjust audio mixing volume.
	```
	adjustAudioMixingVolume(volume)
	```

	Get audio mixing duration.
	```
	getAudioMixingDuration()
	```

	Get audio mixing current position.
	```
	getAudioMixingCurrentPosition()
	```

	setAudioMixingPosition(position)

	setLocalVoicePitch(pitch)

	setInEarMonitoringVolume(volume)

	pauseAudio()

	resumeAudio()

	stopScreenCapture()

	setLogFile(filepath)

	setLogFilter(filter)

	startRecordingService(recordingKey)

	stopRecordingService(recordingKey)

	refreshRecordingServiceStatus()

	enableDualStreamMode(enable)

	setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)

	setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall)

	setMixedAudioFrameParaemters(sampelRate, samplesPerCall)

	adjustRecordingSignalVoluem(volume)

	adjustPlaybackSignalVolume(volume)

	setHighQualityAudioParameters(fullband, stereo, fullBitrate)

	enableWebSdkInteroprability(enable)

	setVideoQualityParameters(perferFrameRateOverImageQuality)

	startScreenCapture(windowId, captureFreq, rect, bitrate)

	If video source is needed, this API is used to initialize video source context.
	```
	videoSourceInitialize()
	```

	To ask video source to join channel
	```
	videoSourceJoin(token, cname, chanInfo, uid)
	```

	To ask video source to renew token
	```
	videoSourceRenewToken(token)
	```

	To set video source's channel profile
	```
	videoSourceSetChannelProfile(profile)
	```

	To set video source's video profile.
	```
	videoSourceSetVideoProfile(profile, swapWidthAndHeight)
	```

	To ask video source to start screen capture.
	```
	startScreenCapture2(wndid, captureFreq, rect, bitrate)
	```

	To ask video source to stop screen capture.
	```
	stopScreenCapture2()
	```

	To ask video source to update screen capture area.
	```
	updateScreenCapturRegion(rect)
	```

	To stop video source process.
	```
	videoSourceRelease()
	```

	To start preview screen capture video
	```
	startScreenCapturePreview()
	```

	To stop preview screen capture video
	```
	stopScreenCapturePreview()
	```

	getVideoDevices()

	setVideoDevice(deviceId)

	getCurrentVideoDevice()

	startVideoDeviceTest()

	stopVideoDeviceTest()

	getAudioPlaybackDevices()

	setAudioPlaybackDevice(deviceid)

	getCurrentAudioPlaybackDevice()

	setAudioPlaybackVolume(voluem)

	getAudioPlaybackVolume()

	getAudioRecordingDevices()

	setAudioRecordingDevice(deviceid)

	getCurrentAudioRecordingDevice()

	getAudioRecordingVolume()

	setAudioRecordingVolume(volume)

	startAudioPlaybackDeviceTest(filepath)

	stopAudioPlaybackDeviceTest()

	startAudioRecordingDeviceTest(indicationInterval)

	stopAudioRecordingDeviceTest()

	getAudioPlaybackDeviceMute()

	setAudioPlaybackDeviceMute(mute)

	getAudioRecordingDeviceMute()

	setAudioRecordingDeviceMute(mute)


Events:
	joinedchannel : channel, uid, elapsed

	rejoinedchannel : channel, uid, elapsed

	warning : warn, msg

	error : err, msg

	audioquality : uid, quality, delay, lost

	audiovolumeindication : uid, volume, speakerNumber, totalVolume

	leavechannel

	audiodevicestatechanged : deviceId, deviceType, deviceState

	audiomixingfinished

	apicallexecuted : api, err

	remoteaudiomixingbegin

	remoteaudiomixingend

	audioeffectfinished

	videodevicestatechagned : deviceId, deviceType, deviceState

	networkquality : uid, txquality, rxquality

	lastmilequality : quality

	firstlocalvideoframe : width, height, elapsed

	addstream : uid, elapsed

	videosizechagned : uid, width, height, rotation

	firstremotevideoframe : uid, width, height, elapsed

	userjoined : uid, elapsed

	removestream : uid, reason

	usermuteaudio : uid, muted

	usermutevideo : uid, muted

	userenablevideo : uid, enabled

	userenablelocalvideo : uid, enabled

	cameraready

	videostopped

	connectionlost

	connectioninterrupted

	connectionbanned

	refreshrecordingservicestatus

	streammessage

	streammessageerror

	mediaenginestartcallsuccess

	requestchannelkey

	firstlocalaudioframe : elapsed

	firstremoteaudioframe  uid, elapsed

	activespeaker : uid

	clientrolechanged : oldrole, newrole

	audiodevicevolumechanged : deviceType, volume, muted

	videosourcejoinedsuccess : uid

	videosourcerequestnewtoken

	videosourceleavechannel

	rtcstats

	localvideostats

	remotevideostats
