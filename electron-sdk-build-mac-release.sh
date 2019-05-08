cd ${WORKSPACE}/Electron-SDK
npm config set registry https://registry.npm.taobao.org/
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
npm install --verbose
npm run build:electron%ELECTRON_VERSION%
zip -r electron.zip build
