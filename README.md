# Agora-RTC-SDK-for-Electron

The Agora-RTC-SDK-for-Electron is an open-source wrapper for **[Electron](https://electronjs.org/)** developers. This SDK takes advantage of Node.js C++ Addons and Agora RTC SDKs on Windows/macOS.

## Developer Environment Requirements

- Node.js 6.9.1+

- Electron 1.8.3+

- Agora RTC SDK Windows/macOS 2.2.1+

## Building

Assuming that you have [Node](https://nodejs.org/en/download/) installed and can use `npm` in command line.

- run `npm install` to install dependency

- Usually npm will trigger building automatically, or you can build mannually by running `npm run build:electron` or `npm run build:node`, the former one is for releasing and using in electron runtime while the latter is for developing and testing in node runtime.

- If you want to debug with xcode/visual studio, run `npm run generate` to generate the project file.

**Notice:**

- Must create a developer account at [Agora.io](https://dashboard.agora.io/signin), when you want to use Agora APIs.

- For macOS, please always use the latest Xcode.

- For Windows, if Visual Studio or Electron version are not the same as in script, change the corresponding parameters in the script. Electron 1.8.3+ needs Visual Studio 2015 or above.

- For more information about develop environment, visit [node-gyp](https://github.com/nodejs/node-gyp/blob/master/README.md) for help.

## Contact Us

- You can find full APIs for Agora RTC SDK at [Document Center](https://docs.agora.io/en/)

## Contributions Welcome

We are still opmizing our project, welcome to help improve our Javascript Api Doc and test coverage, have a look at contribute code for detail.

- [JavaScript APIs for Electron](./docs/apis.md)

- [File an issue](https://github.com/AgoraIO/Agora-RTC-SDK-for-Electron/issues)

- [Contribute code](./docs/contribuitions.md)

## License

The MIT License (MIT).
