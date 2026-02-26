> ⚠️ **Note**: To provide you with better and higher quality technical support services, we will no longer provide technical support through GitHub issues. If you need help, please contact us directly through [Agora Support](https://www.agora.io/en/customer-support/).

> NOTE: These sdk and samples only for the Agora Video 4.x APIs. For examples using previous releases please see the following branches:
>
> - [3.x](https://github.com/AgoraIO-Extensions/Electron-SDK/tree/3.x)

# Agora RTC SDK for Electron

<div align="left">
    <a href="https://github.com/AgoraIO-Extensions/Electron-SDK"><img src="https://img.shields.io/badge/Platform-macOS--x86--64%20%7C%20macOS--arm64%20%7C%20win--32%20%7C%20win--64-blue?logo=Electron&labelColor=fff" alt="Platform"/></a>
    <a href="https://www.npmjs.com/package/agora-electron-sdk"><img alt="npm" src="https://img.shields.io/npm/v/agora-electron-sdk?color=blue&style=flat-square&logo=npm"></a>
    <a href="https://www.npmjs.com/package/agora-electron-sdk"><img alt="npm" src="https://img.shields.io/npm/dm/agora-electron-sdk?color=blue&style=flat-square&logo=npm"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/agoraio-extensions/electron-sdk?color=blue&style=flat-square" alt="License"/></a>
    <a href="https://github.com/AgoraIO-Extensions/Electron-SDK/issues"><img src="https://flat.badgen.net/github/label-issues/AgoraIO-Extensions/Electron-SDK/help%20wanted/open" alt="License"/></a>
</div>

## ✨ Features

- 📦 Newly designed middle-tier API and Native C++ SDK.
- 🛡 Written in TypeScript with predictable static types.

## 🖥 Environment Support

- 🌈 Support macOS x86-64 and arm64 ([Electron 11+](https://www.electronjs.org/zh/blog/apple-silicon))
- ⚙️ Support Windows ia32 and x64
- [Electron](https://www.electronjs.org/): 4.x ~ latest

| [<img src="https://simpleicons.org/icons/macos.svg" alt="Chrome" width="48px" height="24px" />]()<br>macOS | [<img src="https://simpleicons.org/icons/windows.svg" alt="Safari" width="24px" height="24px" />]()<br>Windows | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| x86 \| arm64                                                                                               | ia32 \| x64                                                                                                    | 4.0.0 ~ Latest                                                                                                                                                                                                       |

## 📦 Install

In newest version you can define installation configuration in package.json (or .npmrc, while package.json has a higher
priority), usually you can just provide "prebuilt", and "arch".

```json
// package.json
{
  ...
  "agora_electron": {
    "prebuilt": true,
    "arch": "x64"
  }
  ...
}


// .npmrc
agora_electron_sdk_pre_built=true // defalut value is true
agora_electron_sdk_arch=x64 // only support windows:
```

Properties detail:

- **prebuilt** whether to automatically download prebuilt NodeJS C++ Addon or build locally(which need to provide
  development env)
- **arch**: If not set, the script will automatically choose the arch. **only support windows**
- **platform** darwin or win32

```bash
## Automatic platform and architecture selection
npm install agora-electron-sdk
```

or

```bash
## or select 32 bit architecture on Windows
npm install --agora_electron_sdk_arch=ia32

## or select 64 bit architecture on Windows
npm install --agora_electron_sdk_arch=x64
```

## 🔨 Usage

```javascript
import createAgoraRtcEngine from 'agora-electron-sdk';

const rtcEngine = createAgoraRtcEngine();
rtcEngine.initialize({ appId: '<your agora app id>' });
```

### When using without electron-webpack

When using directly within a web electron project with custom webpack configuration, you may see errors when compiling.
It's because you have not properly configured loader for node addon. A convenient way to skip the compile process is to
set `externals` property of your webpack config to `{"agora-electron-sdk": "commonjs2 agora-electron-sdk"}`

## 🔗 Links

- [Document](https://docs.agora.io/en/video-call-4.x/API%20Reference/electron_ng/API/rtc_api_overview_ng.html) - Official document

- [Demo](./example/) - A quick start demo based on React and this repo

- [Changelog](./CHANGELOG.md) - Attention to newest information

- [Release Notes](https://docs.agora.io/en/video-call-4.x/release_electron_ng?platform=Electron) - Attention to newest
  information

## ⌨️ Development

### Build From Source Code

You will need to build **Agora RTC Electron SDK** from source if you want to work on a new feature/bug fix, try out the
latest features which are not released yet, or maintain your own fork with patches that cannot be merged to the core.

### Prerequisites

#### Windows

- Python 2.7
- Visual Studio Code C++ Desktop Develop Framework

#### MacOS

- Python 2.7
- XCode

### Clone locally:

```bash
$ git clone git@github.com:AgoraIO-Extensions/Electron-SDK.git
$ cd Electron-SDK
$ npm install #or yarn

# build macOS
$ npm install --agora_electron_sdk_pre_built=false

# build  32 bit architecture on Windows
$ npm install --agora_electron_sdk_pre_built=false  --agora_electron_sdk_arch=ia32

# build  64 bit architecture on Windows
$ npm install --agora_electron_sdk_pre_built=false  --agora_electron_sdk_arch=x64
```

## 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/AgoraIO-Extensions/Electron-SDK/pulls)

Read our contributing guide and let's build a better antd together. :)

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
