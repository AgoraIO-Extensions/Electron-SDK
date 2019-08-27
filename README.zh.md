<!-- PROJECT SHIELDS -->
[![Mac Build Status][build-shield]][build-url]
[![Windows Build Status][windows-build-shield]][windows-build-url]
[![Npm Package][npm-shield]][npm]
[![MIT License][license-shield]][license-url]

*Read this in other language: [English](README.md)*

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Agora RTC Electron SDK</h1>

  <p align="center">
    Agora RTC Electron SDK 将 Agora RTC SDK (windows & macos) 封装为 NodeJS C++ Addon，提供了更快捷的音视频通信应用的开发方式。
    <br />
    <a href="https://docs.agora.io/en/Video/API%20Reference/electron/index.html"><strong>前往文档 »</strong></a>
    <br />
    <br />
    <a href="https://github.com/AgoraIO-Community/Agora-Electron-Quickstart">示例应用</a>
    ·
    <a href="https://github.com/AgoraIO/Electron-SDK/issues">发现问题</a>
    ·
    <a href="#plugins">插件社区 :new:</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## 目录
* [快速开始](#快速开始)
  * [安装](#安装)
  * [使用](#使用)
* [相关资源](#相关资源)
* [插件社区](#插件社区)
* [贡献指南](#贡献指南)


<!-- GETTING STARTED -->
## 快速开始

### 安装
推荐使用 npm 安装:
``` bash
# 安装最新版本的sdk并自动下载预编译的NodeJS C++ Addon
npm install agora-electron-sdk
```

通常需要在 package.json 中指定你的应用所使用的 Electron 版本以及是否需要下载预编译好的NodeJS C++ Addon（推荐，如果禁用prebuilt则需要自行提供 node-gyp 环境）：
```
// package.json
{
...
  "agora_electron": {
    "electron_version": "5.0.8",
    "prebuilt": true
  }
...
}
```

**想要了解更多配置详情, 请访问 [wiki](https://github.com/AgoraIO/Electron-SDK/wiki/Installation-Configuration-in-package.json).**

### 使用
``` javascript
import AgoraRtcEngine from 'agora-electron-sdk'

const rtcEngine = new AgoraRtcEngine();
rtcEngine.initialize('<your agora app id>');
```

<!-- RESOURCES -->
## 相关资源

- [文档](https://docs.agora.io/en/Video/API%20Reference/electron/index.html) - 官方文档

- [在线小班课应用](https://github.com/AgoraIO/ARD-eEducation-with-Electron) - 基于此SDK的完整在线小班课解决方案

- [Demo](https://github.com/AgoraIO-Community/Agora-Electron-Quickstart) - 使用此SDK以及Vue/React写的简单 demo

- [Changelog](./CHANGELOG.md) - 关注这里以了解最新变动

<!-- Plugins -->
## 插件社区
最新版本中我们提供插件机制允许自行处理音视频数据，换言之，允许您编写插件来实现诸如美颜滤镜，人脸识别等非常酷的功能。

我们提供了一个官方插件示例：集成FaceUnity实现美颜滤镜

- [Agora-Electron-FaceUnity-Plugin](https://github.com/AgoraIO-Community/Agora-Electron-FaceUnity-Plugin)

想要进一步了解插件是如何运作的，或是如何编写您自己的插件, 请访问 [wiki](https://github.com/AgoraIO/Electron-SDK/wiki/How-plugins-work
).

<!-- CONTRIBUTING -->
## 贡献指南
开源社区的魅力之一就在于自由的学习，交流以及创造。我们热烈欢迎您提供任何形式的贡献。

1. Fork 此项目
2. 创建自己的分支 (`git checkout -b feature/AmazingFeature`)
3. 提交代码变动 (`git commit -m 'Add some AmazingFeature`)
4. 推到远端分支 (`git push origin feature/AmazingFeature`)
5. 新建一个PR

<!-- MARKDOWN LINKS & IMAGES -->
[build-shield]: https://img.shields.io/travis/AgoraIO-Usecase/eEducation/master.svg?style=flat-square
[build-url]: https://travis-ci.org/AgoraIO-Usecase/eEducation
[windows-build-shield]: https://ci.appveyor.com/api/projects/status/github/AgoraIO/Electron-SDK?branch=dev/2.9.0&svg=true
[windows-build-url]:https://ci.appveyor.com/project/menthays/electron-sdk/branch/dev/2.9.0
[npm-shield]: https://img.shields.io/npm/v/agora-electron-sdk/education
[npm]: https://npmjs.com/package/agora-electron-sdk/v/2.9.0
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit
