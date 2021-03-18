cd %WORKSPACE%\Electron-SDK
dir
call npm -v
call node -v
call npm config list
del /f/q/s node_modules
call npm config set registry https://registry.npm.taobao.org/
call npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
call npm install --verbose
call npm run switch:arch
call npm run sync:lib -- --liburl_win=%RTC_SDK_URL%
call npm run build:electron -- --electron_version=%ELECTRON_VERSION% --msvs_version=2019
call npm run build:ts
D:\SignatureTools\SignatureTools\signtool.exe sign /f "D:\SignatureTools\SignatureTools\agora.pfx" /p "31169323" /t "http://timestamp.comodoca.com/authenticode" "build/Release/VideoSource.exe"
D:\SignatureTools\SignatureTools\signtool.exe sign /f "D:\SignatureTools\SignatureTools\agora.pfx" /p "31169323" /t "http://timestamp.comodoca.com/authenticode" "build/Release/agora_node_ext.node"
7z a electron.zip build js
