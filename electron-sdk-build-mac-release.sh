npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
rm -rf node_modules
rm -rf sdk
rm -rf tmp
npm install --verbose
# clear synclib buildFor mac/window
$(npm bin)/gulp totalBuild --electronVersion ${ELECTRON_VERSION} --arch=${ELECTRON_ARCH}
zip -ry electron.zip build js