cd ${WORKSPACE}/Electron-SDK
curl ${RTC_SDK_URL} -o NATIVE_SDK.zip
unzip NATIVE_SDK.zip

rm -rf ./sdk/lib/mac/*

mv ./Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcEngineKit.framework ./sdk/lib/mac/.

rm -rf node_modules
npm config delete registry
npm install --verbose
npm run sync:lib
npm run build:electron -- --electron_version=${ELECTRON_VERSION} --msvs_version=2017
npm run build:ts
zip -r electron.zip build js
