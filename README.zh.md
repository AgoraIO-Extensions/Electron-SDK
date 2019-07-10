# Agora-RTC-SDK-for-Electron [![npm package][npm-badge]][npm][![Mac Build Status][mac-build-badge]][mac-build][![Windows Build status][windows-build-badge]][windows-build]

> Agora-RTC-SDK-for-Electron是基于 **[Electron](https://electronjs.org/)** 平台开发的开源声网SDK封装。

*Read this in other language: [English](README.md)*

## 使用指南

**您可以从[Changelog](./CHANGELOG.md)获取最新发版信息**

SDK安装支持直接通过npm：

```bash
#安装最新版本的sdk，执行时为自动下载预编译的二进制文件
npm install agora-electron-sdk
```

```javascript
import AgoraRtcEngine from 'agora-electron-sdk'
```

若您的electron版本高于3.0.0，您可能需要修改.npmrc以切换预编译版本(默认使用1.8.3)

```bash
#electron版本(1.8.3，<3.0.0)
AGORA_ELECTRON_DEPENDENT = 2.0.0

#electron版本(>= 3.0.0)
AGORA_ELECTRON_DEPENDENT = 3.0.6

#electron版本(= 4.0.0)
AGORA_ELECTRON_DEPENDENT = 4.0.0
```

其他资源：

[API参考](https://agoraio.github.io/Electron-SDK/2_4_0/) - API 说明

[在线教育解决方案](https://github.com/AgoraIO/ARD-eEducation-with-Electron) - 如何用本项目实现一个完整的在线教育应用

[基本Demo](https://github.com/AgoraIO-Community/Agora-Electron-Quickstart) - 演示如何使用Vue/React和本项目简单地实现的音视频通话

[原生API参考](https://docs.agora.io/cn/Video/API%20Reference/cpp/index.html) - 原生API参考


## 开发环境

 - Node.js 6.9.1+

 - Electron 1.8.3+

 - Agora RTC SDK Windows/macOS 2.2.1+

## 如何开发

以下步骤默认您已经安装了[NodeJS](https://nodejs.org/en/download/)，并且可以在命令行中正常执行`npm`。

 - 执行`npm install`来安装依赖项

 - 安装会自动触发`npm run download`，您也可以到对应目录手动执行。

 - 如果您想用xcode / visual studio调试，可以执行`npm run debug`来生成项目文件和带符号表的sdk文件。

**详细的脚本命令可以在[package.json](./package.json)中查看**

**注意：**

 - 如果要使用声网的SDK，必须首先在[Agora.io](https://dashboard.agora.io/signin)上创建账号。

 - 在开发macOS应用时，请尽量安装最新版本的xcode。

 - 在开发windows版本时，若Visual Studio或Electron版本与脚本中的不同，请更改脚本中的相应参数。 Electron 1.8.3+需要Visual Studio 2015或更高版本。请注意windows下 **您必须通过`npm install -D --arch = ia32 electron`** 安装32位的Electron，不然打包的程序在32位的windows上将无法运行。

 - 有关开发环境的更多信息，请访问[node-gyp](https://github.com/nodejs/node-gyp/blob/master/README.md)获取帮助。

## 如何贡献

我们在积极地维护我们的项目，如果您对这个项目有兴趣并想让它变得更好，欢迎一起参与共建或提出意见。

## Lisence(MIT)

[npm-badge]: https://img.shields.io/npm/v/agora-electron-sdk.png?style=flat-square
[npm]: https://www.npmjs.org/package/agora-electron-sdk
[mac-build-badge]: https://img.shields.io/travis/AgoraIO/Electron-SDK/dev/2.8.0.svg?style=flat-square
[mac-build]: https://travis-ci.org/AgoraIO/Electron-SDK
[windows-build-badge]: https://ci.appveyor.com/api/projects/status/github/AgoraIO/Electron-SDK?branch=dev/2.8.0&svg=true
[windows-build]:https://ci.appveyor.com/project/menthays/electron-sdk/branch/dev/2.8.0
