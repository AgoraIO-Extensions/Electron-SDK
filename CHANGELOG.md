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

