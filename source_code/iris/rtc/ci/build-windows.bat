@echo off
set shell_path=%~dp0
set root_path=%shell_path%..\..

if "%1" == "build" (
    call:build %2 %3
) else (
    call %shell_path%\prepare.bat Windows %1
    echo "start build Wind32 ----------"
    call:build Win32 Debug
    call:build Win32 Release
    echo "start build x64 ----------"
    call:build x64 Debug
    call:build x64 Release
)

exit /b 0

:build
    cd %root_path%
    md .\build\windows\%~1
    cd .\build\windows\%~1
    cmake ^
        -G "Visual Studio 16 2019" ^
        -A %~1 ^
        -DCMAKE_BUILD_TYPE=%~2 ^
        %root_path%
    cmake --build . --config %~2
goto:eof
