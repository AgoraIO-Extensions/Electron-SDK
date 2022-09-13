# Agora RTC SDK for Electron

<div align="left">
    <a href="https://github.com/AgoraIO-Community/electron-agora-rtc-ng"><img src="https://img.shields.io/badge/Platform-macOS--x86--64%20%7C%20macOS--arm64%20%7C%20win--32%20%7C%20win--64-blue?logo=Electron&labelColor=fff" alt="Platform"/></a>
    <a href="https://www.npmjs.com/package/electron-agora-rtc-ng"><img alt="npm" src="https://img.shields.io/npm/v/electron-agora-rtc-ng?color=blue&style=flat-square&logo=npm"></a>
    <a href="https://www.npmjs.com/package/electron-agora-rtc-ng"><img alt="npm" src="https://img.shields.io/npm/dm/electron-agora-rtc-ng?color=blue&style=flat-square&logo=npm"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/agoraio-community/electron-agora-rtc-ng?color=blue&style=flat-square" alt="License"/></a>
    <a href="https://github.com/AgoraIO-Community/electron-agora-rtc-ng/issues"><img src="https://flat.badgen.net/github/label-issues/AgoraIO-Community/electron-agora-rtc-ng/help%20wanted/open" alt="License"/></a>

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
npm install electron-agora-rtc-ng
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
import createAgoraRtcEngine from "electron-agora-rtc-ng";

const rtcEngine = createAgoraRtcEngine();
rtcEngine.initialize({appId: "<your agora app id>"});
```

### When using without electron-webpack

When using directly within a web electron project with custom webpack configuration, you may see errors when compiling.
It's because you have not properly configured loader for node addon. A convenient way to skip the compile process is to
set `externals` property of your webpack config to `{"electron-agora-rtc-ng": "commonjs2 electron-agora-rtc-ng"}`

## 🔗 Links

- [Document](https://docs.agora.io/en/Video/API%20Reference/electron/index.html) - Official document

- [e-Education Application](https://github.com/AgoraIO/ARD-eEducation-with-Electron) - A complete e-education
  Application based on this repo

- [Demo](./example/) - A quick start demo based on Vue/React and this repo

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
$ git clone git@github.com:AgoraIO-Community/electron-agora-rtc-ng.git
$ cd electron-agora-rtc-ng
$ npm install #or yarn

# build macOS
$ npm install --agora_electron_sdk_pre_built=false

# build  32 bit architecture on Windows
$ npm install --verbose --agora_electron_sdk_pre_built=false  --agora_electron_sdk_arch=ia32

# build  64 bit architecture on Windows
$ npm install --verbose --agora_electron_sdk_pre_built=false  --agora_electron_sdk_arch=x64
```

## 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/AgoraIO-Community/electron-agora-rtc-ng/pulls)

Read our contributing guide and let's build a better antd together. :)

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
