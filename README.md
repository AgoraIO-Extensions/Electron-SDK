# Agora-RTC-SDK-for-Electron [![npm package][npm-badge]][npm][![Mac Build Status](https://img.shields.io/travis/AgoraIO/Electron-SDK/dev/ts-support.svg?style=flat-square)](https://travis-ci.org/AgoraIO/Electron-SDK)[![Windows Build status](https://ci.appveyor.com/api/projects/status/github/AgoraIO/Electron-SDK?branch=dev/ts-support&svg=true)](https://ci.appveyor.com/project/menthays/electron-sdk/branch/dev/ts-support)

The Agora-RTC-SDK-for-Electron is an open-source wrapper for **[Electron](https://electronjs.org/)** developers. This SDK takes advantage of Node.js C++ Addons and Agora RTC SDKs on Windows/macOS.

## Quick Overview

**Attention to [Changelog](./CHANGELOG.md) for newest information**

You can directly install the sdk through npm:

``` bash
# install newest sdk and we will download built binary file for you
npm install agora-electron-sdk
```

``` javascript
// you can use require either
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
# range(>= 4.0.0) will download a prebuilt addon built with electron 4.0.0
AGORA_ELECTRON_DEPENDENT=4.0.0
```

Other resources:

[API Reference](./docs/apis.md)

[CDN for Built Binary File(Windows)](http://download.agora.io/sdk/release/Agora_RTC_Electron_SDK_for_Windows_v2_0_7.zip)

[CDN for Built Binary File(Mac)](http://download.agora.io/sdk/release/Agora_RTC_Electron_SDK_for_Mac_v2_0_7.zip)

[A complete solution for e-Edu](https://github.com/AgoraIO/ARD-eEducation-with-Electron)

[A quickstart demo](https://github.com/AgoraIO-Community/Agora-Electron-Quickstart)

## Developer Environment Requirements

- Node.js 6.9.1+

- Electron 1.8.3+

- Agora RTC SDK Windows/macOS 2.2.1+

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

## Contact Us

- You can find full APIs for Agora RTC SDK at [Document Center](https://docs.agora.io/en/)

## Contributions Welcome

We are still opmizing our project, welcome to help improve our Javascript Api Doc and test coverage, have a look at contribute code for detail.

- [JavaScript APIs for Electron](./docs/apis.md)

- [File an issue](https://github.com/AgoraIO/Agora-RTC-SDK-for-Electron/issues)

- [Contribute code](./docs/contribuitions.md)

## License

The MIT License (MIT).

[npm-badge]: https://img.shields.io/npm/v/agora-electron-sdk.png?style=flat-square
[npm]: https://www.npmjs.org/package/agora-electron-sdk
