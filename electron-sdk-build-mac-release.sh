npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
rm -rf node_modules
rm -rf sdk
rm -rf tmp
npm install --verbose
npm run build
npm run buildJS
zip -ry electron.zip build js