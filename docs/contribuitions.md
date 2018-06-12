# Contribute your code

## Source code structures

1. **[js](apis.md)**: JavaScript APIs for Electron developers.
2. __tests\_\_: Unit test for Js Api.
3. **[agora\_node\_ext](agora_node_ext.md)**: Node.js C++ addon which wraps functionalities of Agora RTC SDK for Windows/macOS.
4. **[video_source](video_source.md)**: **agora_node_ext** implement multiple video sources functionality by using multiple processes. Video source provides the ancillary facilities.
5. **[common](common.md)**: Utilities that used by **agora_node_ext** and **video_source**
6. **sdk**: Agora RTC SDK for Windows/macOS, used to build Node.js C++ addons.

Welcome to help us following the guideline below.

- [Javacript contribution guideline](#js)

- [C++ contribution guideline](#cplus)

<h2 id="js"> Javascript contribution guideline </h2>

We are improving our api doc and test coverage at present. Welcome for any advice or pr help.  

If you are interested with this, following some easy step to commit a pr.

- Add comment for some api in AgoraSdk.js (conforms to the JSDoc specification)

- Add the corresponding test case for the previous api.



<h2 id="cplus"> C+\+ contribution guideline </h2>

### Generate Project

#### 1. macOS

Run `npm run generate` to generate project file under '/build' and open it by Xcode

#### 2. Windows

Run `npm run generate` to generate project file under '/build' and open it by Visual Studio 2015

Read the introduction for each module and start your develop!


