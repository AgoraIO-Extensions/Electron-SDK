cd ${WORKSPACE}/Electron-SDK
npm install --verbose
node ./scripts/build.js --runtime=electron --electron_version=${ELECTRON_VERSION}
zip -r Electron-${PLATFORM}-${SDK_VERSION}-${ELECTRON_VERSION}.zip build
