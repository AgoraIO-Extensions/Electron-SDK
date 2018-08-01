# Agora-RTC-SDK-for-Electron

The Agora-RTC-SDK-for-Electron is an open-source wrapper for **[Electron](https://electronjs.org/)** developers. This SDK takes advantage of Node.js C++ Addons and Agora RTC SDKs on Windows/macOS.

## :heart_eyes: Important 

v2.2.1-rc.2 has been released! Now node-gyp build environment are not neccessary any more, we will download built C++ addon from our cdn instead.

## Developer Environment Requirements

- Node.js 6.9.1+

- Electron 1.8.3+

- Agora RTC SDK Windows/macOS 2.2.1+

## How to use

```sh
npm install agora-electron-sdk
```

```javascript
const AgoraRtcEngine = require('agora-electron-sdk')
```

And a newly provided quickstart boilerplate: [Agora-Electron-Quickstart](https://github.com/AgoraIO-Community/Agora-Electron-Quickstart)

## How to develop

Assuming that you have [Node](https://nodejs.org/en/download/) installed and can use `npm` in command line.

- run `npm install` to install dependency

- <del>Usually npm will trigger building automatically, or you can build mannually by running `npm run build:electron` or `npm run build:node`, the former one is for releasing and using in electron runtime while the latter is for developing and testing in node runtime.</del> Now we will download built C++ addon after dependencies installed.

- If you want to debug with xcode/visual studio, run `npm run debug` to generate the project file and sdk for debug env.

**Notice:**

- Must create a developer account at [Agora.io](https://dashboard.agora.io/signin), when you want to use Agora APIs.

- For macOS, please always use the latest Xcode.

- For Windows, if Visual Studio or Electron version are not the same as in script, change the corresponding parameters in the script. Electron 1.8.3+ needs Visual Studio 2015 or above.

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
