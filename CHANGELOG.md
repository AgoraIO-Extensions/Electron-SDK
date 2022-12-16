## [4.0.1-xhs.3](https://github.com/AgoraIO-Extensions/Electron-SDK/compare/v4.0.1-xhs.2...v4.0.1-xhs.3) (2022-12-16)

## [4.0.1-xhs.2](https://github.com/AgoraIO-Extensions/Electron-SDK/compare/v4.0.1-xhs.1...v4.0.1-xhs.2) (2022-11-21)


### Bug Fixes

* add memeset _result in the construct function ([#910](https://github.com/AgoraIO-Extensions/Electron-SDK/issues/910)) ([3f5baa0](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/3f5baa02ae99e9e233ae5a6f57d151cc27b3ab42))
* add minus system version 10.10 for macOS ([#911](https://github.com/AgoraIO-Extensions/Electron-SDK/issues/911)) ([e97f7df](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/e97f7dfa9db8e8335ab7b25ce2314a2550823b90))
* issue of `LocalVideoTranscoder` for `SecondaryCameraSource` ([be2ecda](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/be2ecda1f6987011153b1746fa9a702520567381))


### Features

* support 4.0.1.3 ([a4c74ab](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/a4c74ab4a10c073685e5681075a820cb7f29f4f8))

## [4.0.1-xhs.1](https://github.com/AgoraIO-Extensions/Electron-SDK/compare/v4.0.1-rc.1...v4.0.1-xhs.1) (2022-10-21)


### Bug Fixes

* `deviceCapabilityNumber` issue ([7d6c0c3](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/7d6c0c37bd6b9577d66a70e4b9aee2818446daed))


### Features

* support 4.0.1  ([#894](https://github.com/AgoraIO-Extensions/Electron-SDK/issues/894)) ([b6e22ee](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/b6e22ee97ddb9e2dc164e9c0e058912da0d56420))

## [4.0.1-rc.1](https://github.com/AgoraIO-Extensions/Electron-SDK/compare/v4.0.0...v4.0.1-rc.1) (2022-10-21)


### Bug Fixes

* `deviceCapabilityNumber` issue ([58a38ae](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/58a38ae9046750f35a90a55fe72f4f4dbacbb1b4))
* `getPlaybackDeviceInfo` and `getRecordingDeviceInfo` issue ([6517c6c](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/6517c6cd96539e4556ca01f3b10376c3ccdab50a))
* `LocalTranscoderConfiguration` json parse issue #EP-172 ([45cbfe3](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/45cbfe3c04a493a3e888afde6f4bdff898e4ea5d)), closes [#EP-172](https://github.com/AgoraIO-Extensions/Electron-SDK/issues/EP-172)
* add `setDualStreamMode` method ([9f18cfc](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/9f18cfcdefbea4cb7a3c1948d0e6a0c911a5016a))
* the event which named contains `Ex` not triggered issue (such as `onTokenPrivilegeWillExpire`) ([#892](https://github.com/AgoraIO-Extensions/Electron-SDK/issues/892)) ([abe8b55](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/abe8b55f09c8af23cb9f578c0643d176852cbe11))

# [4.0.0](https://github.com/AgoraIO-Extensions/Electron-SDK/compare/v4.0.0-rc.3...v4.0.0) (2022-09-28)


### Bug Fixes

* set windows msvc link as MT ([341c9ee](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/341c9ee600d5230ac40dd8c6b0226dfaaf96354e))
* some AudioFrameObserver & VideoFrameObserver issue ([58063be](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/58063be50f8156e24118b707dfe14fd28f03f405))


### Features

* complete,hook ([#881](https://github.com/AgoraIO-Extensions/Electron-SDK/issues/881)) ([a9f679b](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/a9f679b73bb6896e84106a3284e49c86b8ba4927))


### Reverts

* iris url ([60492eb](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/60492ebccb79929a0ff206f013ffd24ba2b2e106))

# [4.0.0-rc.3](https://github.com/AgoraIO-Extensions/Electron-SDK/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2022-09-14)


### Bug Fixes

* npm install failed ([8b04ff4](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/8b04ff49a6d7b2b5d54188bb7628bb095f629736))

# [4.0.0-rc.2](https://github.com/AgoraIO-Extensions/Electron-SDK/compare/v4.0.0-rc.1...v4.0.0-rc.2) (2022-09-13)


### Bug Fixes

* cross-env-shell error ([cfdf132](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/cfdf132fe983f897919c32d4513c89249d2f2826))

# 4.0.0-rc.1 (2022-09-13)


### Bug Fixes

* build error on windows x64 ([9331172](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/9331172b2ba2db5bf72323a23b7a2ac5b7ebeeb5))
* download addon version issue ([19d542c](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/19d542c7d9ceba9226ac25ad4f6a4c361d47f31b))
* setPlayerOptionInInt setPlayerOptionInString this issue ([268ad3b](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/268ad3ba051b15309248151e7be49a35962d8b2b))
* some issue about AgoraRendererManager ([3415871](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/3415871b0d5a2e93086e8e88ce50d296ab994fff))
* **fix localaccesspointconfiguration:** fix LocalAccessPointConfiguration ([bf9814f](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/bf9814f0316bde140a7338ecd553da50e9738208))


### Features

* support native 4.0.0-rc.1 ([352a5bb](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/352a5bb654fdd1ce317ebb5d1c0e5e23ecc9f330))
* **add ci for changelog:** use husky conventional-changelog-cli @commitlint/config-conventional ([e1facd9](https://github.com/AgoraIO-Extensions/Electron-SDK/commit/e1facd9244b6eb18e503493f9cc14af99f09938b))

# [4.0.0-beta.3](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/compare/v4.0.0-beta.2...v4.0.0-beta.3) (2022-07-19)


### Bug Fixes

* build error on windows x64 ([9331172](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/9331172b2ba2db5bf72323a23b7a2ac5b7ebeeb5))
* some issue about AgoraRendererManager ([3415871](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/3415871b0d5a2e93086e8e88ce50d296ab994fff))

# [4.0.0-beta.2](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2022-07-13)


### Bug Fixes

* download addon version issue ([19d542c](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/19d542c7d9ceba9226ac25ad4f6a4c361d47f31b))

# 4.0.0-beta.1 (2022-07-11)


### Bug Fixes

* **fix localaccesspointconfiguration:** fix LocalAccessPointConfiguration ([bf9814f](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/bf9814f0316bde140a7338ecd553da50e9738208))


### Features

* **add ci for changelog:** use husky conventional-changelog-cli @commitlint/config-conventional ([e1facd9](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/e1facd9244b6eb18e503493f9cc14af99f09938b))

## 3.8.201-alpha.706 (2022-07-05)


### Bug Fixes

* **fix localaccesspointconfiguration:** fix LocalAccessPointConfiguration ([bf9814f](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/bf9814f0316bde140a7338ecd553da50e9738208))


### Features

* **add ci for changelog:** use husky conventional-changelog-cli @commitlint/config-conventional ([e1facd9](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/e1facd9244b6eb18e503493f9cc14af99f09938b))



## 3.8.201-alpha.705 (2022-07-05)


### Features

* **add ci for changelog:** use husky conventional-changelog-cli @commitlint/config-conventional ([e1facd9](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/e1facd9244b6eb18e503493f9cc14af99f09938b))



## 3.8.201-alpha.629 (2022-06-30)


### Features

* **add ci for changelog:** use husky conventional-changelog-cli @commitlint/config-conventional ([e1facd9](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/e1facd9244b6eb18e503493f9cc14af99f09938b))



## 3.8.201-alpha.629 (2022-06-30)


### Features

* **add ci for changelog:** use husky conventional-changelog-cli @commitlint/config-conventional ([e1facd9](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/commit/e1facd9244b6eb18e503493f9cc14af99f09938b))



