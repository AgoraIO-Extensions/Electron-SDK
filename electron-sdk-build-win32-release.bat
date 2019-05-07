cd %WORKSPACE%\Electron-SDK
npm install --verbose
node .\scripts\build.js --runtime=electron --electron_version=%ELECTRON_VERSION%
7z a electron.zip build\ -r
