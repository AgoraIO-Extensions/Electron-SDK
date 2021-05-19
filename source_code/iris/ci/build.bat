@echo off
set root_path=%~dp0..
set sdk_type=%1
set sdk_version=%2
set build_platform=%3

if "%sdk_type%" == "ALL" (
    call %root_path%\ci\build.bat RTC %sdk_version% %build_platform%
) else if "%sdk_type%" == "RTC" (
    if "%build_platform%" == "ALL" (
        call %root_path%\ci\build.bat %sdk_type% %sdk_version% Windows
    ) else if "%build_platform%" == "Windows" (
        echo "start build windows --------------------"
        call %root_path%\rtc\ci\build-windows.bat %sdk_version%
    ) else (
        echo "not support platform %build_platform%"
    )
) else (
    echo "not support sdk type %sdk_type%"
)
