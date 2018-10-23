# Agora-RTC-SDK-for-Electron

The Agora-RTC-SDK-for-Electron is an open-source wrapper for **[Electron](https://electronjs.org/)** developers. This SDK takes advantage of Node.js C++ Addons and Agora RTC SDKs on Windows/macOS.

## Quick Overview

**Attention to [Changelog](./CHANGELOG.md) for newest information**

You can directly install the sdk through npm:

``` bash
# install newest sdk and we will download built binary file for you
npm install agora-electron-sdk@2.0.8-rc.1
```

``` javascript
// you can use require either
import AgoraRtcEngine from 'agora-electron-sdk'
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
