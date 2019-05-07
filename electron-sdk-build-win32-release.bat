cd %WORKSPACE%\Electron-SDK
npm install --verbose
node .\scripts\build.js --runtime=electron --electron_version=%ELECTRON_VERSION%
zip -r electron.zip build
