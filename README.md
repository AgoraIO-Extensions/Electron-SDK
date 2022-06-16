<!-- PROJECT SHIELDS -->

[![Mac Build Status][build-shield]][build-url]
[![Windows Build Status][windows-build-shield]][windows-build-url]
[![Npm Package][npm-shield]][npm]
[![MIT License][license-shield]][license-url]

_其他语言版本： [简体中文](README.zh.md)_

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Agora RTC Electron SDK</h1>

  <p align="center">
    Agora RTC Electron SDK uses Agora RTC SDK (Windows & macOS) as NodeJS C++ addon for rapid RTC application development
    <br />
    <a href="https://docs.agora.io/en/Video/API%20Reference/electron/index.html"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/AgoraIO-Community/electron-agora-rtc-ng/tree/main/example">View Demo</a>
    ·
    <a href="https://github.com/AgoraIO-Community/electron-agora-rtc-ng/issues">Report Bug</a>
    ·
    <a href="#plugins">Plugins :new:</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Resources](#resources)
- [Plugins](#plugins)
- [Contributing](#contributing)

<!-- GETTING STARTED -->

## Getting Started

### Installation

Recommend to install through npm:

```bash
# install newest sdk and download prebuilt binary file automatically
npm install electron-agora-rtc-ng@alpha
```

**For more detail of configuration, visit [wiki](https://github.com/AgoraIO/Electron-SDK/wiki/Installation-Configuration-in-package.json).**

#### Build From Source Code

You will need to build **Agora RTC Electron SDK** from source if you want to work on a new feature/bug fix, try out the latest features which are not released yet, or maintain your own fork with patches that cannot be merged to the core.

##### Prerequisites

###### Windows

- Python 2.7
- Visual Studio Code C++ Desktop Develop Framework
  - VisualStudio.Component.CoreEditor
  - VisualStudio.Workload.CoreEditor
  - VisualStudio.Component.NuGet
  - VisualStudio.Component.Roslyn.Compiler
  - VisualStudio.Component.Roslyn. - LanguageServices
  - Net.Component.4.8.SDK
  - Net.Component.4.7.2.TargetingPack
  - Net.ComponentGroup.DevelopmentPrerequisites
  - Component.MSBuild
  - VisualStudio.Component.TextTemplating
  - Net.Component.4.6.TargetingPack
  - VisualStudio.Component.DiagnosticTools
  - VisualStudio.Component.AppInsights.Tools
  - VisualStudio.Component.IntelliCode
  - VisualStudio.Component.VSSDK
  - VisualStudio.ComponentGroup.
  - VisualStudioExtension.Prerequisites
  - VisualStudio.Workload.VisualStudioExtension

###### MacOS

- Python 2.7
- XCode

##### Building the source

###### Installing the fork

You just to install `electron-agora-rtc-ng` from your fork. For example, to install the master branch from the official repo, run the following:

```sh
# mac
npm install electron-agora-rtc-ng 
# win32
npm install electron-agora-rtc-ng --agora_electron_sdk_arch=x64
# win32
npm install electron-agora-rtc-ng --agora_electron_sdk_arch=ia32
```

Alternatively, you can clone the repo to your `node_modules` directory and run `npm install --verbose --agora_electron_sdk_pre_built=false` inside the cloned repo.

### Additional notes

Building from source can take a long time, especially for the first build, as it needs to download ~200 MB of artifacts and compile the native code. Every time you update the `Agora RTC Electron SDK` version from your repo, the build directory may get deleted, and all the files are re-downloaded.

### Usage

```javascript
import creteAgoraRtcEngine from 'electron-agora-rtc-ng';

const rtcEngine = creteAgoraRtcEngine();
rtcEngine.initialize({ appId: "<your agora app id>" });
```

### When using without electron-webpack

When using directly within a web electron project with custom webpack configuration, you may see errors when compiling. It's because you have not properly configured loader for node addon. A convenient way to skip the compile process is to set `externals` property of your webpack config to `{"electron-agora-rtc-ng": "commonjs2 electron-agora-rtc-ng"}`

<!-- RESOURCES -->

## Resources

- [Document](https://docs.agora.io/en/Video/API%20Reference/electron/index.html) - Official document

- [e-Education Application](https://github.com/AgoraIO/ARD-eEducation-with-Electron) - A complete e-education Application based on this repo

- [Demo](https://github.com/AgoraIO-Community/Agora-Electron-Quickstart) - A quick start demo based on Vue/React and this repo

- [Changelog](./CHANGELOG.md) - Attention to newest information

<!-- Plugins -->

## Plugins

In newest version we have supported plugins for customize videoFrame and audioFrame data. In other words, you can integrate cool features like video filter, face recognition with your own plugins in C++.

We have already implement an official plugin for video filter based on FaceUnity:

- [Agora-Electron-FaceUnity-Plugin](https://github.com/AgoraIO-Community/Agora-Electron-FaceUnity-Plugin)

For more detail about how plugins work and how to write your own plugins, visit [wiki](https://github.com/AgoraIO/Electron-SDK/wiki/How-plugins-work).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- MARKDOWN LINKS & IMAGES -->

[build-shield]: https://img.shields.io/travis/AgoraIO-Usecase/eEducation/master.svg?style=flat-square
[build-url]: https://travis-ci.org/AgoraIO-Usecase/eEducation
[windows-build-shield]: https://ci.appveyor.com/api/projects/status/github/AgoraIO/Electron-SDK?branch=dev/2.9.0&svg=true
[windows-build-url]: https://ci.appveyor.com/project/menthays/electron-sdk/branch/dev/2.9.0
[npm-shield]: https://img.shields.io/npm/v/electron-agora-rtc-ng/latest
[npm]: https://npmjs.com/package/electron-agora-rtc-ng/v/2.9.0-hotfix.2
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit
