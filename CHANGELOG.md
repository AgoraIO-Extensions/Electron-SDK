## Latest
#### :house: Internal
* Add Missing Api for 2.3.*
  * Add `getConnectionState` api
  * Add Event `remoteAudioStats`
* Add 2.4 Api
  * Add `setLogFileSize`
  * Add `setBeautyEffectOptions`
  * Add `setLocalVoiceChanger`
  * Add `setLocalVoiceReverbPreset`
  * Add `enableSoundPositionIndication`
  * Add `setRemoteVoicePosition`
  * Add `startLastmileProbeTest`
  * Add `stopLastmileProbeTest`
  * Add `setRemoteUserPriority`
  * Add `startEchoTestWithInterval`
  * Add `startAudioDeviceLoopbackTest`
  * Add `stopAudioDeviceLoopbackTest`
  * Add `setCameraCapturerConfiguration`
  * Add `videosourceStartScreenCaptureByScreen`
  * Add `videosourceStartScreenCaptureByWindow`
  * Add `videosourceUpdateScreenCaptureParameters`
  * Add `videosourceSetScreenCaptureContentHint`
* Add `release` Api
* Modify Api
  * `setVideoEncoderConfiguration` will recv a param with type `VideoEncoderConfiguration`
  * `LocalVideoStats` add three properties: `targetBitrate,targetFrameRate,qualityAdaptIndication`

* Notice that `videosourceStartScreenCaptureByScreen` need a param called `ScreenSymbol` which differs on Mac and Windows. And a method will be provided in future to get this param on the two platforms.

#### :memo: Documentation
* Add doc and type for the api above.

## 2.3.3-alpha.12 (March 19th, 2019)
#### :house: Internal
* Add Api
  * Add Event `groupAudioVolumeIndication` to provide all the speakers' volume as an array periodically

* Optimize type declaration in ts file.
* Revert frame handler for internal problem.

## 2.3.3-alpha.10 (Feb 13th, 2019)
#### :house: Internal
* Update native sdk (macos/windows) to 2.3.3 for optimization of screen sharing.
* Optimize robust for renderer operation
* Use enum as param for `setVideoProfile` & `videoSourceSetVideoProfile`
* Refactor and optimize command line tools

#### :bug: Bug Fix
* Fixed wrong strategy of stride and width in C++.
* Destroy renderer properly when useroffline emitted.

## 2.3.2-alpha (Jan 17th, 2019)
#### :house: Internal
* Upgrade Agora Native SDK to 2.3.2 (both OSX and Windows), visit Agora Official Website for API CHANGELOG.
* Support typescript (Use typescript to do refactor and generate d.ts for better develop experience).

## 2.0.8-rc.5 (Jan 7th, 2019)
#### :house: Internal
* Add `videoSourceSetLogFile` api (similiar to setLogFile)
* Support electron 4.0.0

#### :bug: Bug Fix
* Fixed overflow of uint32 uid.

## 2.0.8-rc.5-alpha (Nov 19th, 2018)
#### :house: Internal
* support multi version of prebuilt addon
  `In temp, you can switch prebuilt addon version by npm config or .npmrc, set agora_electron_dependent=<electron version in your app>, built with 1.8.3 for electron ranges from 1.8.3 to <3.0.0, and 3.0.6 for electron >= 3.0.0`
* more detail info when doing building or downloading

## 2.0.8-rc.4 (Nov 13rd, 2018)
#### :bug: Bug Fix
* Optimize resource release for webgl context.

#### :house: Internal
* Add Play Effect Related Api:
  * getEffectsVolume
  * setEffectsVolume
  * setVolumeOfEffect
  * playEffect
  * stopEffect
  * stopAllEffects
  * preloadEffect
  * unloadEffect
  * pauseEffect
  * pauseAllEffects
  * resumeEffect
  * resumeAllEffects

## 2.0.8-rc.3 (Nov 2nd, 2018)
#### :bug: Bug Fix
* Fixed webgl context related problems

#### :house: Internal
* New Api:
  * setRenderMode(mode) - Set default rendering mode, 1 to webGL, 2 to software rendering. Default to be webGL.

## 2.0.8-rc.2 (Nov 2nd, 2018)
#### :bug: Bug Fix
* Webgl render will cause some problem and will be fixed in next version, now we switch to use software rendering.

## 2.0.8-rc.1 (Oct 23th, 2018)
#### :house: Internal
* Update agora windows sdk to 2.0.8


## 2.0.7-rc.7 (Oct 23th, 2018)
#### :house: Internal
* Now canvas zoom will be re-calculated when the size of container changes.
* Update test demo with window sharing.

#### :bug: Bug fix
* Fixed a typo in implementation for getScreenWindowInfos (weight => height)

## 2.0.7-rc.7 (Sep 18th, 2018)
#### :house: Internal
* Add new api `getScreenWindowsInfo` to provide window info and id. You can use this to implement sharing windows (You can only share the whole screen before).
* Refactor renderer module. Now video source can be rendered without webgl.
* Optimize unit tests.
* Modify the build script for windows. (Use VS 2015 as msbuilder) 
* Add new api `enableLoopbackRecording` to enable loopback recording. Once enabled, the SDK collects all local sounds.


## 2.0.7-rc.6 (August 6, 2018)
#### :house: Internal
* Fixed a potential risk that will pend the promise.

#### :bug: Bug Fix
* Fixed a crash in ipc which will influnece screen sharing.

#### :memo: Documentation
* Now we provide complete [Javascript API Reference](./docs/apis.md)!


## 2.0.7-rc.3 (August 1, 2018)
#### :house: Internal
* Now we remove `build` folder and re-download everytime you run npm install.

## 2.0.7-rc.1 (July 26, 2018)
> Release for e-Education

#### :house: Internal
* Use 2.0.7 for Windows and 2.2.3 for Mac, which have done special optimization for e-Edu scenario. 

* Docs and unit-tests are nearly completed.

* Modify api:
  * setClientRole(CLIENT_ROLE_TYPE role, const char* permissionKey)

* Remove apis:
  * onStreamPublished
  * onStreamUnpublished
  * onTranscodingUpdated
  * onStreamInjectedStatus
  * addPublishStreamUrl
  * removePublishStreamUrl
  * setLiveTranscoding
  * addVideoWatermark
  * clearVideoWatermarks
  * addInjectStreamUrl
  * removeInjectStreamUrl
  * registerEventHandler
  * unregisterEventHandler
  * getEffectsVolume
  * setEffectsVolume
  * setVolumeOfEffect
  * playEffect
  * stopEffect
  * stopAllEffects
  * preloadEffect
  * unloadEffect
  * pauseEffect
  * pauseAllEffects
  * resumeEffect
  * resumeAllEffects
  * setLocalVoicePitch 
  * setLocalVoiceEqualization
  * setLocalVoiceReverb
  * enableLoopbackRecording


## 2.2.1-rc.1 (July 17, 2018)

#### :house: Internal

* Now we download built C++ addon instead of doing build when installing dependencies
* From now on we will use 2.2.1-rc.* as version label, and this will be a relatively stable version.

