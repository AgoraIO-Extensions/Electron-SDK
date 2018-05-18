# Agora-RTC-SDK-for-Electron

This tutorial enables you to quickly get started with creating an Agora account and using the Agora sample app to give you an overview on how to develop requests using the Node.js C++ Addons and the Agora RTC SDKs on [Windows](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_windows_audio?platform=Windows) / [MacOS](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_mac_audio?platform=macOS):

The sample is an open-source wrapper for [Electron](https://electronjs.org/) developers.


## Prerequisites
- Agora.io [Developer Account](https://dashboard.agora.io/signin/)
- [Node.js](https://nodejs.org/en/download/) 6.9.1+ with C++11 support
- [Electron](https://electronjs.org) 1.8.3+
- Agora RTC SDK for [Windows](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_windows_audio?platform=Windows) or [MacOS](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_mac_audio?platform=macOS) 2.1.0+
- MacOS 10.12+

## Quick Start
This section shows you how to prepare, build, and run the sample application.

### Create an Account and Obtain an App ID
In order to build and run the sample application you must obtain an App ID: 

1. Create a developer account at [agora.io](https://dashboard.agora.io/signin/). Once you finish the signup process, you will be redirected to the Dashboard.
2. Navigate in the Dashboard tree on the left to **Projects** > **Project List**.
3. Copy the App ID that you obtained from the Dashboard into a text file. You will use this when you launch the app.

### Update and Run the Sample Application 

1. Run the install command in your project directory.

	```
	npm install -g node-gyp
	```

2. Run the appropriate project file for your operating system:

	**Mac OS**
	
	The latest Xcode install will ensure you have C++11 support.
	
	```
	sh build.sh
	```
	**Windows**
	
	1. Update the `build.bat` script with the versions of Visual Studio and Electron installed on your machine.

		The sample file uses Visual Studio 2015 `msvs_version=2015` and Electron version 1.8.3 `target=1.8.3`. 
		
		**Note:** Electron 1.8.3+ requires Visual Studio 2015 or above.
	
		```
		node-gyp rebuild --target=1.8.3 --arch=ia32 --msvs_version=2015 --dist-url=https://atom.io/download/electron
		```

	2. In the command line, run the install command.
	
		```
		hope build.bat
		```


3. Once the build is complete, the sample app will run.


## Resources
* JavaScript API for Electron [reference doc](apis.md).
* Complete API documentation is available at the [Document Center](https://docs.agora.io/en/).
* You can file bugs about this sample [here](https://github.com/AgoraIO/Agora-RTC-SDK-for-Electron/issues).
* Learn how to [contribute code](contribuitions.md) to the sample project.


## License
This software is under the MIT License (MIT). [View the license](LICENSE.md).