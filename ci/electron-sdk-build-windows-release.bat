dir

call npm -v
call node -v
call npm config list
if %1 == x86 (
    echo sdk_ia32
    call npm install --verbose --agora_electron_sdk_pre_built=false  --agora_electron_sdk_arch=ia32
)
if %1 == x64 (
    echo sdk_x64
    call npm install --verbose --agora_electron_sdk_pre_built=false  --agora_electron_sdk_arch=x64
)

set count=0
:loop
set /a count=%count%+1

C:\\SignatureTools\\signtool.exe sign /f "C:\\SignatureTools\\agora.pfx" /p "31169323" /t "http://timestamp.comodoca.com/authenticode" "build\\Release\\agora_node_ext.node"
if %count% equ 5 goto endloop
if %errorlevel% equ 1 (
    sleep 15
    goto loop
)
:endloop
if %count% equ 5 (
    echo "******sign error*******"
    exit 1
)

call npm run zipBuild
