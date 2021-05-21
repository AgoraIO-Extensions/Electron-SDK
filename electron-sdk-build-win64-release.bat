cd %WORKSPACE%\Electron-SDK
dir
call npm -v
call node -v
call npm config list
del /f/q/s node_modules
call npm config set registry https://registry.npm.taobao.org/
call npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
call npm install --verbose
call npm run switch:arch -- --arch=x64
call npm run sync:lib --  --arch=x64
call npm run build:electron -- --electron_version=5.0.8 --msvs_version=2019 --arch=x64
call npm run build:ts
7z a electron.zip build js
