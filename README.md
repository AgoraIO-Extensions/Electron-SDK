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
    <a href="https://github.com/AgoraIO-Community/Agora-Electron-Quickstart">View Demo</a>
    ·
    <a href="https://github.com/AgoraIO/Electron-SDK/issues">Report Bug</a>
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
npm install agora-electron-sdk@alpha
```

Prebuilt c++ addon supported electron version 1.8.3, 3.0.6, 4.2.8, 5.0.8, 6.1.5, 7.1.2, 9.0.0, 10.0.0, 11.2.0, 11.0.0, 12.0.0
Usually you have to specify electron version of your application and whether to download prebuilt c++ addon or do node-gyp building locally by configuration in package.json:

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
  - VisualStudio.Component.Roslyn.  - LanguageServices
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
  - VisualStudio.ComponentGroup.  - VisualStudioExtension.Prerequisites
  - VisualStudio.Workload.VisualStudioExtension

###### MacOS

- Python 2.7
- XCode

##### Building the source

###### Installing the fork

You just to install `agora-electron-sdk` from your fork. For example, to install the master branch from the official repo, run the following:

```sh
npm install --save github:AgoraIO/Electron-SDK#dev/electron_iris --verbose --agora_electron_sdk_pre_built=false --agora_electron_version=${Electron_Version}
```

Alternatively, you can clone the repo to your `node_modules` directory and run `npm install --verbose --agora_electron_sdk_pre_built=false --agora_electron_version=${Electron_Version}` inside the cloned repo.

### Additional notes

Building from source can take a long time, especially for the first build, as it needs to download ~200 MB of artifacts and compile the native code. Every time you update the `Agora RTC Electron SDK` version from your repo, the build directory may get deleted, and all the files are re-downloaded.

### Usage

```javascript
import AgoraRtcEngine from "agora-electron-sdk";

const rtcEngine = new AgoraRtcEngine();
rtcEngine.initialize("<your agora app id>");
```

### When using without electron-webpack

When using directly within a web electron project with custom webpack configuration, you may see errors when compiling. It's because you have not properly configured loader for node addon. A convenient way to skip the compile process is to set `externals` property of your webpack config to `{"agora-electron-sdk": "commonjs2 agora-electron-sdk"}`

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
[npm-shield]: https://img.shields.io/npm/v/agora-electron-sdk/latest
[npm]: https://npmjs.com/package/agora-electron-sdk/v/2.9.0-hotfix.2
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit
