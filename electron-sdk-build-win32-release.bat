cd %WORKSPACE%\Electron-SDK

call del /F /S /Q Agora_Native_SDK_*
call curl %RTC_SDK_URL% -o NATIVE_SDK.zip
call 7z x NATIVE_SDK.zip

call del /F /S /Q sdk\dll
call del /F /S /Q sdk\include
call del /F /S /Q sdk\lib\win\*

call scripts\rename_sdk.bat

call move /y Agora_Native_SDK_for_Win_Full\sdk\dll\*.dll sdk\dll\.
call move /y Agora_Native_SDK_for_Win_Full\sdk\include\*.h sdk\include\.
call move /y Agora_Native_SDK_for_Win_Full\sdk\lib\*.lib sdk\lib\win\.

call npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
call npm install --verbose
call npm run sync:lib
call npm run build:electron -- --electron_version=%ELECTRON_VERSION% --msvs_version=2017
call npm run build:ts
7z a electron.zip build js
