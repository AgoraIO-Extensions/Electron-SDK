# Agora-RTC-SDK-for-Electron [![npm package][npm-badge]][npm][![Mac Build Status][mac-build-badge]][mac-build][![Windows Build status][windows-build-badge]][windows-build]

> The Agora-RTC-SDK-for-Electron is an open-source wrapper for **[Electron](https://electronjs.org/)** developers. This SDK takes advantage of Node.js C++ Addons and Agora RTC SDKs on Windows/macOS.

*其他语言版本： [简体中文](README.zh.md)*

## Quick Start

**Attention to [Changelog](./CHANGELOG.md) for newest information**

You can directly install the sdk through npm:

``` bash
# install newest sdk and we will download prebuilt binary file for you
npm install agora-electron-sdk
```

``` javascript
import AgoraRtcEngine from 'agora-electron-sdk'
```
Switch prebuilt addon version in .npmrc (default to use 1.8.3)

``` bash
# range(1.8.3, <3.0.0) will download a prebuilt addon built with electron 1.8.3
AGORA_ELECTRON_DEPENDENT=2.0.0
# or
# range(>=3.0.0) will download a prebuilt addon built with electron 3.0.6
AGORA_ELECTRON_DEPENDENT=3.0.6
# or
# range(= 4.0.0) will download a prebuilt addon built with electron 4.0.0
AGORA_ELECTRON_DEPENDENT=4.0.0
```

## Resources

- [API Reference](https://agoraio.github.io/Electron-SDK/2_4_0/) - API Reference

- [e-Education Application](https://github.com/AgoraIO/ARD-eEducation-with-Electron) - A complete e-education Application based on this repo

- [Demo](https://github.com/AgoraIO-Community/Agora-Electron-Quickstart) - A quick start demo based on Vue/React and this repo

- [Doc Center](https://docs.agora.io/en/Video/API%20Reference/cpp/index.html) - Original API Reference for Agora Native SDK

- [Known Limitation for Screenshare](https://github.com/AgoraIO/Electron-SDK/blob/dev/2.4.0/LIMITATIONS.md)

## Prerequisites

- Node.js 6.9.1+

- Electron 1.8.3+

## How to develop

Assuming that you have [Node](https://nodejs.org/en/download/) installed and can use `npm` in command line.

- Run `npm install` to install dependency

- Usually it will trigger `npm run download`, or you can run it manually.

- If you want to debug with xcode/visual studio, run `npm run debug` to generate the project file and sdk for debug env.

**Find more scripts in [package.json](./package.json)**

**Notice:**

- Must create a developer account at [Agora.io](https://dashboard.agora.io/signin), when you want to use Agora APIs.

- For macOS, please always use the latest Xcode.

- For Windows, if Visual Studio or Electron version are not the same as in script, change the corresponding parameters in the script. Electron 1.8.3+ needs Visual Studio 2015 or above. And **you have to install a 32-bit electron by `npm install -D --arch=ia32 electron`**

- For more information about develop environment, visit [node-gyp](https://github.com/nodejs/node-gyp/blob/master/README.md) for help.

## Contributions Welcome

We are still opmizing our project, welcome for pr and issules.

## License

The MIT License (MIT).

[npm-badge]: https://img.shields.io/npm/v/agora-electron-sdk.png?style=flat-square
[npm]: https://www.npmjs.org/package/agora-electron-sdk
[mac-build-badge]: https://img.shields.io/travis/AgoraIO/Electron-SDK/dev/2.4.0.svg?style=flat-square
[mac-build]: https://travis-ci.org/AgoraIO/Electron-SDK
[windows-build-badge]: https://ci.appveyor.com/api/projects/status/github/AgoraIO/Electron-SDK?branch=dev/2.4.0&svg=true
[windows-build]:https://ci.appveyor.com/project/menthays/electron-sdk/branch/dev/2.4.0
