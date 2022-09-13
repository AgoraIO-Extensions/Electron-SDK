# Agora-Electron-API-Example

The Example project is an open-source demo that will show you different scenes on how to integrate Agora SDK APIs into your project.

Any scene of this project can run successfully alone.

## Quick Start

### 📋 Requirements

- Agora.io [Developer Account](https://dashboard.agora.io/signin/)
- [Node.js 14](https://nodejs.org/en/download/) with C++11 support
- [Yarn](https://yarnpkg.com/) package manager

### 🎉 Steps to run

First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID.

Then do the following:

```bash
git clone git@github.com:AgoraIO-Community/electron-agora-rtc-ng.git
cd example
yarn
yarn dev
```

#### (Optional) Build From Local SDK

```bash
# example path
rm -rf node_modules/electron-agora-rtc-ng
# sdk path
cd .. && npm install --agora_electron_sdk_pre_built=false && yarn link
# example path
cd example && yarn link "electron-agora-rtc-ng"
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
| ...                                                                                                                                                                    | ...                             | ...                                                                                            |

## 👏 Feedback

If you have any problems or suggestions regarding the sample projects, feel free to file an issue.

## 🚀 Reference

- You can find full API document at [Document Center](https://docs.agora.io/en/Video/API%20Reference/electron/index.html)
- You can file issues about this demo at [issue](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/issues)

## 🚀 Related resources

- Check our [FAQ](https://docs.agora.io/en/faq) to see if your issue has been recorded.
- Dive into [Agora SDK Samples](https://github.com/AgoraIO) to see more tutorials
- Take a look at [Agora Use Case](https://github.com/AgoraIO-usecase) for more complicated real use case
- Repositories managed by developer communities can be found at [Agora Community](https://github.com/AgoraIO-Community)
- If you encounter problems during integration, feel free to ask questions in [Stack Overflow](https://stackoverflow.com/questions/tagged/agora.io)

## 📄 License

The sample projects are under the MIT license.
