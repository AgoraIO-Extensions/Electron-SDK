AgoraSDK.js provide JS SDK API. It relies on AgoraRender.js and webgl-utils.js to render video, three JS files mute be included.

==============================================================================================
Class AgoraRtcEngine provide SDK functionalities, and also it's one event emitter, client could listen on interested event.

To create AgoraRtcEngine instance : 
	const AgoraRtcEngine = require("AgoraSdk");
	var engine = new AgoraRtcEngine(); 

APIs:
    initialize(appid, onSuccess, onFailed)
		To initialize the AgoraRtcEngine instance with supplied appid. AgoraRtcEngine instance must be initialized before other functions invoked.
		
	getVersion()
		To get current SDK version.
		
	getErrorDescription(errorCode)
		To get description of errorCode.
		
	joinChannel(key, name, chan_info, uid)
		To join channel with supplied information.
		
	leaveChannel()
		To leave current channel
	
	subscribe(uid, view)
		After user with uid joined channel, subscribe used to bind user's video to the view.
		
	setupLocalVideoSource(view)
		When video source is used to share screen, uses setupLocalVideoSource to bind video source's video to the view for the preview.
		
	setupLocalVideo(view)
		Used to bind local video to the view.
		
	setupLocalDevTest(view)
		Used to bind dev test video to the view
		
	renewChannelKey(newKey)
		To update key.
		
	setChannelProfile(profile)
		to setup channel profile.
		
	setClientRole(role, permissionKey)
		To setup client's role based on parameters.
		
	startEchoTest()
		To start Echo test.
		
	stopEchoTest()
		To stop Echo test.
		
	enableLastmileTest()
		To enable last mile test.
		
	disableLastmileTest()
		To disable last mile test.
		
	enableVideo()
		Enable video.
		
	disableVideo()
		Disable video
	
	startPreview()
		Start preview.
		
	stopPreview()
		stop preview
		
	setVideoProfile(profile, swapWidthAndHeight)
		Setup video profile.
		
	enableAudio()
		Enable audio.
		
	disableAudio()
		Disable audio.
		
	setAudioProfile(profile, scenario)
		Setup audio profile.
		
	getCallId()
		Get current call id.
		
	rate(callid, rating, desc)
		To rate SDK.
		
	complain(callid, desc)
		To complain SDK.
		
	setEncryptionSecret(secret)
		To set encryption secret.
		
	createDataStream(reliable, ordered)
	
	sendStreamMessage(streamId, msg)
	
	muteLocalAudioStream(mute)
		Mute/unmute local audio.
		
	muteAllRemoteAudioStreams(mute)
		Mute/unmute all remote audios.
		
	muteRemoteAudioStream(uid, mute)
		Mute/unmute the user's audio with uid.
		
	muteLocalVideoStream(mute)
		Mute/unmute local video stream.
		
	enableLocalVideo(enable)
		Enable/disable local video
		
	muteAllRemoteVideoStreams(mute)
		Mute/unmute all remote videos.
		
	muteRemoteVideoStream(uid, mute)
		Mute/unmute the users video with uid.
		
	setRemoteVideoStreamType(uid, streamType)
	
	setRemoteDefaultVideoStreamType(streamType)
	
	startAudioRecording(filePath)
		Start audio recording.
		
	stopAudioRecording()
		Stop audio recording.
		
	startAudioMixing(filepath, loopback, replace, cycle)
		Start audio mixing
		
	stopAudioMixing()
		Stop audio mixing.
		
	pauseAudioMixing()
		Pause audio mixing.
		
	resumeAudioMixing()
		Resume audio mixing.
		
	adjustAudioMixingVolume(volume)
		Adjust audio mixing volume.
		
	getAudioMixingDuration()
		Get audio mixing duration.
		
	getAudioMixingCurrentPosition()
		Get audio mixing current position.
		
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
	
	videoSourceInitialize()
		If video source is needed, this API is used to initialize video source context.
		
	videoSourceJoin(token, cname, chanInfo, uid)
		To ask video source to join channel
	
	videoSourceRenewToken(token)
		To ask video source to renew token
		
	videoSourceSetChannelProfile(profile)
		To set video source's channel profile
		
	videoSourceSetVideoProfile(profile, swapWidthAndHeight)
		To set video source's video profile.
		
	startScreenCapture2(wndid, captureFreq, rect, bitrate)
		To ask video source to start screen capture.
		
	stopScreenCapture2()
		To ask video source to stop screen capture.
		
	updateScreenCapturRegion(rect)
		To ask video source to update screen capture area.
		
	videoSourceRelease()
		To stop video source process.
		
	startScreenCapturePreview()
		To start preview screen capture video
		
	stopScreenCapturePreview()
		To stop preview screen capture video
		
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
	