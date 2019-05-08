cd %WORKSPACE%\Electron-SDK
call npm config set registry https://registry.npm.taobao.org/
call npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
call npm install --verbose
call npm run build:electron%ELECTRON_VERSION%
7z a electron.zip build
