cd ${WORKSPACE}/Electron-SDK
curl ${RTC_SDK_URL} -o NATIVE_SDK.zip
unzip NATIVE_SDK.zip

rm -rf ./sdk/lib/mac/*
mv ./Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcKit.framework ./sdk/lib/mac/.

npm config delete registry
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
rm -rf node_modules
npm install --verbose
npm run sync:lib
npm run build:electron -- --electron_version=${ELECTRON_VERSION} --msvs_version=2017
npm run build:ts
zip -r electron.zip build js
