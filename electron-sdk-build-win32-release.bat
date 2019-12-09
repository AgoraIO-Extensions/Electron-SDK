cd %WORKSPACE%\Electron-SDK
call npm config set registry https://registry.npm.taobao.org/
call npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
call npm install --verbose
call npm run sync:lib -- --liburl_win=%RTC_SDK_URL%
call npm run build:electron -- --electron_version=%ELECTRON_VERSION% --msvs_version=2017
7z a electron.zip build
