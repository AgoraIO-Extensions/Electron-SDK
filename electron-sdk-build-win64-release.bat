dir
echo receive:ELECTRON_VERSION:%1
call npm -v
call node -v
call npm config list
call npm install --verbose --agora_electron_sdk_pre_built=false --agora_electron_version=%1 --agora_electron_sdk_arch=x64
C:\\SignatureTools\\signtool.exe sign /f "C:\\SignatureTools\\agora.pfx" /p "31169323" /t "http://timestamp.comodoca.com/authenticode" "build/Release/VideoSource.exe"
C:\\SignatureTools\\signtool.exe sign /f "C:\\SignatureTools\\agora.pfx" /p "31169323" /t "http://timestamp.comodoca.com/authenticode" "build/Release/agora_node_ext.node"
if %errorlevel% NEQ 0 (
    echo "***** singtool Error *****"
    exit 1
)
call npm run zipBuild
