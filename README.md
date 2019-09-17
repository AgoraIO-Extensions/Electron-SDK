<!-- PROJECT SHIELDS -->
[![Mac Build Status][build-shield]][build-url]
[![Windows Build Status][windows-build-shield]][windows-build-url]
[![Npm Package][npm-shield]][npm]
[![MIT License][license-shield]][license-url]

*其他语言版本： [简体中文](README.zh.md)*

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Agora RTC Electron SDK</h1>

  <p align="center">
    Agora RTC Electron SDK uses Agora RTC SDK (windows & macos) as NodeJS C++ addon for rapid RTC application development
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
* [Getting Started](#getting-started)
  * [Installation](#installation)
  * [Usage](#usage)
* [Resources](#resources)
* [Plugins](#plugins)
* [Contributing](#contributing)


<!-- GETTING STARTED -->
## Getting Started

### Installation
Recommend to install through npm:
``` bash
# install newest sdk and download prebuilt binary file automatically
npm install agora-electron-sdk
```

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

### Usage
``` javascript
import AgoraRtcEngine from 'agora-electron-sdk'

const rtcEngine = new AgoraRtcEngine();
rtcEngine.initialize('<your agora app id>');
```

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

For more detail about how plugins work and how to write your own plugins, visit [wiki](https://github.com/AgoraIO/Electron-SDK/wiki/How-plugins-work
).

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
[windows-build-url]:https://ci.appveyor.com/project/menthays/electron-sdk/branch/dev/2.9.0
[npm-shield]: https://img.shields.io/npm/v/agora-electron-sdk/latest
[npm]: https://npmjs.com/package/agora-electron-sdk/v/2.9.0-hotfix.1
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit
