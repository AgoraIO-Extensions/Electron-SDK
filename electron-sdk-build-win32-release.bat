cd %WORKSPACE%\Electron-SDK
npm config set registry https://registry.npm.taobao.org/
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
npm install --verbose
node .\scripts\build.js --runtime=electron --electron_version=%ELECTRON_VERSION%
7z a electron.zip build\ -r
