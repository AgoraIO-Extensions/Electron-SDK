set -e
set -x

npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
# Example 1
# npm config set AGORA_ELECTRON_SDK_PRE_BUILT false

rm -rf node_modules
rm -rf sdk
rm -rf tmp
# npm install --verbose
#
# Example 2
npm config set agora_electron_sdk_pre_built false
npm install --verbose
npm run totalBuild --verbose
npm run zipBuild
npm config delete agora_electron_sdk_pre_built
#
# Example 3
# npm run build  -- --prebuilt=false --electronVersion=5.0.8 --arch=x64
