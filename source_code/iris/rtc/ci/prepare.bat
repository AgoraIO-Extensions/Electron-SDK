@echo off
set root_path=%~dp0..\..

set platforms=Android iOS Mac Windows

echo "%platforms%" | findstr "%1">nul
if %errorlevel% equ 0 (
    call:prepare %1 %2
) else (
    echo "the param1 should be one of [%platforms%]"
)

exit /b 0

:prepare
    set libs=%root_path%\third_party\agora\rtc\libs
    echo "prepare download %libs%"
    cd %libs%
    set version=%2
    set version=%version:.=_%
    echo %cd%
    set zip=Agora_Native_SDK_for_%1_v%version%_FULL.zip
    set url=https://download.agora.io/sdk/release/%zip%
    echo "start download %url%"
    powershell -command "& wget %url% -OutFile %zip%"
    powershell -command "& Expand-Archive -Path %zip% -DestinationPath %cd% -Force"
    rd %zip%
goto:eof
