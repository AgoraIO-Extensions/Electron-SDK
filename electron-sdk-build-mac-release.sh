npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
# Example 1
npm config set AGORA_ELECTRON_SDK_PRE_BUILT false
npm config set AGORA_ELECTRON_VERSION $1

echo receive:ELECTRON_VERSION:$1

rm -rf node_modules
rm -rf sdk
rm -rf tmp
# npm install --verbose
#
# Example 2
npm install --verbose --agora_electron_sdk_pre_built=false --agora_electron_version=$1
npm run zipBuild
#
# Example 3
# npm run build  -- --prebuilt=false --electronVersion=5.0.8 --arch=x64