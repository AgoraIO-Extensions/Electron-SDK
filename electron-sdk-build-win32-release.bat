cd %WORKSPACE%\Electron-SDK
call curl %RTC_SDK_URL% -o NATIVE_SDK.zip


call del /F /S /Q Agora_Native_SDK_for_Win_FULL
call 7z e NATIVE_SDK.zip -oAgora_Native_SDK_for_Win_FULL

call del /F /S /Q sdk/dll
call del /F /S /Q sdk/include
call del /F /S /Q sdk/lib/win/*

call move /y ./Agora_Native_SDK_for_Win_FULL/sdk/dll ./sdk/.
call move /y ./Agora_Native_SDK_for_Win_FULL/sdk/include ./sdk/.
call move /y ./Agora_Native_SDK_for_Win_FULL/sdk/lib/* ./sdk/lib/win/.

call npm config set registry https://registry.npm.taobao.org/
call npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
call npm install --verbose
call npm run build:electron -- --electron_version=%ELECTRON_VERSION% --msvs_version=2017
call npm run build:ts
7z a electron.zip build js
