dir

call npm -v
call node -v
call npm config list
call npm config set agora_electron_sdk_pre_built false
if %1 == ia32 (
    echo sdk_ia32
    call npm install --agora_electron_sdk_arch=ia32 --registry https://registry.npmmirror.com
    call npm run totalBuild --agora_electron_sdk_arch=ia32
)
if %1 == x64 (
    echo sdk_x64
    call npm install --agora_electron_sdk_arch=x64 --registry https://registry.npmmirror.com
    call npm run totalBuild --agora_electron_sdk_arch=x64
)
call npm config delete agora_electron_sdk_pre_built

echo Skip local signtool signing. Windows package signing is handled by Jenkins CodeSign after Artifactory upload.

call npm run zipBuild
