## 2.0.7-rc.1 (July 26, 2018)
> Release for e-Education

#### :house: Internal
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

