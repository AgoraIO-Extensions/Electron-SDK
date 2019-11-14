cd ${WORKSPACE}/Electron-SDK
npm config set registry https://registry.npm.taobao.org/
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
rm -rf node_modules
npm install --verbose
npm run sync:lib -- --liburl_mac=${RTC_SDK_URL}
npm run build:electron -- --electron_version=${ELECTRON_VERSION} --msvs_version=2017
npm run build:ts
zip -r electron.zip build js
