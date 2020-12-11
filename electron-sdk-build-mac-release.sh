cd ${WORKSPACE}/Electron-SDK
curl ${RTC_SDK_URL} -o NATIVE_SDK.zip
unzip NATIVE_SDK.zip

rm -rf ./sdk/lib/mac/*
mv ./Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcKit.framework ./sdk/lib/mac/.
mv ./Agora_Native_SDK_for_Mac_FULL/libs/Agorafdkaac.framework ./sdk/lib/mac/.
mv ./Agora_Native_SDK_for_Mac_FULL/libs/Agoraffmpeg.framework ./sdk/lib/mac/.
mv ./Agora_Native_SDK_for_Mac_FULL/libs/AgoraSoundTouch.framework ./sdk/lib/mac/.

npm config delete registry
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
rm -rf node_modules
rm -rf sdk
rm -rf tmp
npm install --verbose
npm run sync:lib
npm run build:electron -- --electron_version=${ELECTRON_VERSION} --msvs_version=2017
npm run build:ts
zip -ry electron.zip build js
