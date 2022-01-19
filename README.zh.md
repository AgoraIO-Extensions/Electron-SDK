<!-- PROJECT SHIELDS -->

[![Mac Build Status][build-shield]][build-url][![Windows Build Status][windows-build-shield]][windows-build-url][![Npm Package][npm-shield]][npm][![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Agora RTC Electron SDK</h1>
  <p align="center">
    Agora RTC Electron SDK 使用 Agora RTC SDK (Windows & macOS & Linux) 作为 NodeJS C++ 插件，用于快速 RTC 应用程序开发
    <br />
  </p>
</p>

## agora-electron-sdk

### 目录内关键资源简介

```
    - build: Electron  C++ Node Addon 插件
    - js： JavaScript 源码
    - types： Typescript 类型声明
    - package.json: NPM第三方库配置描述文件
```
### Linux SDK 编译
- DCG SDK 的头文件: ./iris/DCG/sdk/include/
- DCG SDK 的so: ./iris/DCG/sdk/*.so (可省略,但 cmake 配置)
- IRIS SDK 的头文件: ./iris/include/
- IRIS SDK 的so: ./iris/*.so


### SDK 使用

将`agora-electron-sdk` 放入前端工程 `project/node_modules` 下,然后调用相关 api

```javascript
import AgoraRtcEngine from 'agora-electron-sdk';

.
.
.

const rtcEngine = new AgoraRtcEngine();

rtcEngine.initialize({
  appId: APP_ID,
  areaCode: 1,
  logConfig: {
    filePath: "/home/parallels/projects/agora-electron-sdk/example/linux_e.log",
    fileSize: 1024,
    level: 1,
  },
});

```

### Example

agpra-electron-sdk（Linux mips 架构）的 Example 演示功能范围：

- 本地 Camera 采集 & 推送
- 音视频采集/播放 & 推送
- 屏幕共享采集 & 推送

#### 环境搭建

- 指定`libagora-ffmpeg.so`动态库搜索路径
  - 编辑配置文件/etc/ld.so.conf 来指定动态库的搜索路径
    - 例如：增加`/Users/jerry/Downloads/agora-electron-sdk/build/Release`
  - 运行`ldconfig`: 更新动态库搜索缓存

#### 运行

运行 `yarn dev` or `npm run dev`以此来打开 Example 演示

> 由于 linux mips 架构的独特性，Example 使用的第三方依赖对于 mips 架构的兼容性不够好
> yarn dev 偶见 javascript 的源码读取失败，多次执行 yarn dev 可正常运行 Demo

#### 场景验证

- 初始化引擎 Engine:
  - 点击`Initialize`
  - 点击`JoinChannel`
- 本地 Camera 采集 & 推送
  - 开启/销毁本地 Camera 渲染视图：点击`setViewForFirstCamera`
  - 开启/关闭本地 Camera：点击`Open FirstCamera` or `Close FirstCamera`
- 音视频采集/播放 & 推送(默认开启)
- UI:远端用户进入房间、远端用户退出房间（默认开启）
- 屏幕共享采集 & 推送
  - 开启/销毁本地 Camera 渲染视图：点击`setViewForFirstScreenShare`
  - 开启/关闭屏幕共享：点击`StartFirstScreenShare`


<!-- MARKDOWN LINKS & IMAGES -->

[build-shield]: https://img.shields.io/travis/AgoraIO-Usecase/eEducation/master.svg?style=flat-square
[build-url]: https://travis-ci.org/AgoraIO-Usecase/eEducation
[windows-build-shield]: https://ci.appveyor.com/api/projects/status/github/AgoraIO/Electron-SDK?branch=dev/2.9.0&svg=true
[windows-build-url]: https://ci.appveyor.com/project/menthays/electron-sdk/branch/dev/2.9.0
[npm-shield]: https://img.shields.io/npm/v/agora-electron-sdk/latest
[npm]: https://npmjs.com/package/agora-electron-sdk/v/2.9.0-hotfix.2
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit
