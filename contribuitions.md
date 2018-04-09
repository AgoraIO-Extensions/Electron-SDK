# Contribute your code

## Source code structures:

1. **[js](apis.md)**: JavaScript APIs for Electron developers.
- **[agora_node_ext](agora_node_ext.md)**: Node.js C++ addon which wraps functionalities of Agora RTC SDK for Windows/macOS.
- **[video_source](video_source.md)**: **agora_node_ext** implement multiple video sources functionality by using multiple processes. Video source provides the ancillary facilities.
- **[common](common.md)**: Utilities that used by **agora_node_ext** and **video_source**
- **sdk**: Agora RTC SDK for Windows/macOS, used to build Node.js C++ addons.


## Generate Project

#### 1. macOS

Run `gen-mac.sh` to generate project file and open it by Xcode

#### 2. Windows

Run 'gen-vs2015.bat' to generate project file and open it by Visual Studio 2015


## Enjoy real-time world
