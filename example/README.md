# Agora-Electron-API-Example

The Example project is an open-source demo that will show you different scenes on how to integrate Agora SDK APIs into your project.

Any scene of this project can run successfully alone.

## Quick Start

### 📋 Requirements

- Agora.io [Developer Account](https://dashboard.agora.io/signin/)
- [Node.js 22.12 or newer](https://nodejs.org/en/download/) with C++11 support
- [Yarn](https://yarnpkg.com/) package manager

### 🎉 Steps to run

First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID.

Then do the following:

```bash
git clone git@github.com:AgoraIO-Extensions/Electron-SDK.git
cd example
yarn
yarn start
```

#### Shared Texture PoC Runtime

Implementation status and Native RTC SDK requirements:
[English](../docs/shared-texture-poc/README.md) |
[简体中文](../docs/shared-texture-poc/README.zh-CN.md)

The Windows shared texture PoC is pinned to Electron `43.2.0`, whose Windows x64
runtime reports Node `24.18.0`, Chrome `150.0.7871.129`, and native modules ABI
`148`. Check the ABI before loading the addon:

```powershell
.\node_modules\.bin\electron.cmd -e "console.log(process.versions.modules)"
# Expected: 148
```

Install dependencies before creating the local SDK link. A later install can replace
the consumer-side link, so rerun the last command whenever dependencies are reinstalled:

```bash
# Repository root: register this worktree's SDK package.
yarn link

# Repository root: install the example, then link it to this worktree.
yarn --cwd example install
yarn --cwd example link agora-electron-sdk
```

Confirm that the consumer resolves this worktree instead of a published duplicate:

```bash
yarn jest example/src/main/__tests__/sharedTextureRuntime.test.js --runInBand
```

On Windows x64, rebuild the SDK addon and the example's native dependencies against
the pinned Electron runtime before starting or packaging the example:

```powershell
# Repository root
yarn build_windows_x64_release --runtime=electron --runtime-version=43.2.0
yarn --cwd example rebuild --arch=x64 --version=43.2.0
```

Do not continue if the ABI check is not exactly `148` or if the runtime test resolves
`agora-electron-sdk` outside this worktree.

Start the example, open `Advanced -> SharedTexturePoc`, and enter the same App ID,
channel, token, and numeric UID used by the other examples. `Start` creates one
main-process RTC engine and a hidden offscreen window for the packaged moving-color
scene; `Stop` drains the active submission, releases the Electron texture, leaves the
channel, and destroys both native objects. Use a second client in the same channel to
observe the published video.

The renderer page does not create an RTC engine. It sends validated configuration over
IPC to the main-process controller, which owns the offscreen texture lifetime.

#### (Optional) Build From Local SDK

```bash
# example path
rm -rf node_modules/agora-electron-sdk
# sdk path
cd .. && npm install --agora_electron_sdk_pre_built=false && yarn link
# example path
cd example && yarn link "agora-electron-sdk"
```

## 📖 Project structure

- **Basic demos:**

| Demo                                                                         | Description                                        | APIs                                                                                                                                               |
| ---------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [JoinChannelAudio](src/renderer/examples/basic/JoinChannelAudio/JoinChannelAudio.tsx) | basic demo to show audio call                      | getAudioDeviceManager, setAudioProfile,setRecordingDevice, adjustRecordingSignalVolume, adjustAudioMixingPlayoutVolume, adjustPlaybackSignalVolume |
| [JoinChannelVideo](src/renderer/examples/basic/JoinChannelVideo/JoinChannelVideo.tsx) | video demo with role selection in Editor Inspector | enableVideo, getVideoDeviceManager,setChannelProfile, joinChannelEx, setAudioProfile, setVideoEncoderConfiguration                                 |
| [StringUid](src/renderer/examples/basic/StringUid/StringUid.tsx)               | basic demo with string uid                         | joinChannelWithUserAccount                                                                                                                         |

- **Advanced demos:**

| Demo                                                                                                                                                                   | Description                     | APIs                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| [ScreenShare](./src/renderer/examples/advanced/ScreenShare/ScreenShare.tsx) | sharing application screen view | getScreenCaptureSources, startPrimaryScreenCapture, startSecondaryScreenCapture, joinChannelEx |
| [VideoEffect](./src/renderer/examples/advanced/VideoEffect/VideoEffect.tsx) | beauty 2.0 with videoeffectobject | enableExtension, createVideoEffectObject, addOrUpdateVideoEffect, setVideoEffectBoolParam, setVideoEffectIntParam, setVideoEffectFloatParam |
| ...                                                                                                                                                                    | ...                             | ...                                                                                            |

- **hooks demos:**

| Demo                                                                         | Description                                        | APIs                                                                                                                                               |
| ---------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [JoinChannelAudio](src/renderer/examples/hook/JoinChannelAudio/JoinChannelAudio.tsx) | basic demo to show audio call | getAudioDeviceManager, setAudioProfile,setRecordingDevice, adjustRecordingSignalVolume, adjustAudioMixingPlayoutVolume, adjustPlaybackSignalVolume |
| [JoinChannelVideo](src/renderer/examples/hook/JoinChannelVideo/JoinChannelVideo.tsx) | video demo with role selection in Editor Inspector | enableVideo, getVideoDeviceManager,setChannelProfile, joinChannelEx, setAudioProfile, setVideoEncoderConfiguration |
| [StringUid](src/renderer/examples/hook/StringUid/StringUid.tsx) | basic demo with string uid | joinChannelWithUserAccount |
| [JoinMultipleChannel](src/renderer/examples/hook/JoinMultipleChannel/JoinMultipleChannel.tsx) | Joins a channel with the connection ID | joinChannelEx, updateChannelMediaOptionsEx |
| [DeviceManager](src/renderer/examples/hook/DeviceManager/DeviceManager.tsx) | Management tool that can switch microphone and camera | getVideoDeviceManager, getAudioDeviceManager |
| [VirtualBackground](src/renderer/examples/hook/VirtualBackground/VirtualBackground.tsx) | Enables/Disables the virtual background (beta feature) | enableExtension, enableVirtualBackground |
| [AudioMixing](src/renderer/examples/hook/AudioMixing/AudioMixing.tsx) | Starts playing the music file | startAudioMixing, pauseAudioMixing, resumeAudioMixing |
| [TakeSnapshot](src/renderer/examples/hook/TakeSnapshot/TakeSnapshot.tsx) | Takes a snapshot of a video stream | takeSnapshot |
| [ScreenShare](src/renderer/examples/hook/ScreenShare/ScreenShare.tsx) | sharing application screen view | getScreenCaptureSources, startPrimaryScreenCapture, startSecondaryScreenCapture,joinChannelEx |

## 👏 Feedback

If you have any problems or suggestions regarding the sample projects, feel free to file an issue.

## 🚀 Reference

- You can find full API document at [Document Center](https://docs.agora.io/en/Video/API%20Reference/electron/index.html)
- You can file issues about this demo at [issue](https://github.com/AgoraIO-Extensions/Electron-SDK/issues)

## 🚀 Related resources

- Check our [FAQ](https://docs.agora.io/en/faq) to see if your issue has been recorded.
- Dive into [Agora SDK Samples](https://github.com/AgoraIO) to see more tutorials
- Take a look at [Agora Use Case](https://github.com/AgoraIO-usecase) for more complicated real use case
- Repositories managed by developer communities can be found at [Agora Community](https://github.com/AgoraIO-Community)
- If you encounter problems during integration, feel free to ask questions in [Stack Overflow](https://stackoverflow.com/questions/tagged/agora.io)

## 📄 License

The sample projects are under the MIT license.
