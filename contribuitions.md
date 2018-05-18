# Contribute to the Agora Electron Wrapper Sample App

This tutorial enables you to generate project files for MacOS and/or Windows, which will allow you to contribute code to the Agora Electron Wrapper sample app.

## Prerequisites
- Agora.io Developer Account
- Node.js 6.9.1+ with C++11 support
- Electron 1.8.3+
- Agora RTC SDK Windows / MacOS 2.1.0+
- Xcode 9+ (MacOS development)
- Visual Studio 2015+ (Windows development)


## Quick Start

### MacOS

1. Run the `gen-mac.sh` command to generate the project files.

	```
	sh gen-mac.sh
	```
2. Open the resulting Xcode project and begin adding your code for contribution.

3. Reference the [Agora JavaScript Electron API](apis.md) document to apply available API functionality.

### Windows

1. Run the `gen-vs2015.bat` command to generate the project files.

	```
	hope gen-vs2015.bat
	```
2. Open the resulting Visual Studio project and begin adding your code for contribution.

3. Reference the [Agora JavaScript Electron API](apis.md) document to apply the available Agora API functionality.

## Folder and File Explanations

Folder name|Description
----- | -----
[`agora_node_ext`](agora_node_ext.md)|Node.js C++ add-on, that wraps the functionality for the Agora RTC SDK for [Windows](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_windows_audio?platform=Windows) and [MacOS](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_mac_audio?platform=macOS).
[`video_source`](video_source.md)|Applies `agora_node_ext` functionality to multiple video sources and ancillary facilities.
[`common`](common.md)|Common utilities used by `agora_node_ext` and `video_source`.


## Resources:

* Agora RTC API for [Windows](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_windows_audio?platform=Windows) / [macOS](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_mac_audio?platform=macOS) - for building Node.js C++ addons.
* Complete API documentation is available at the [Document Center](https://docs.agora.io/en/).