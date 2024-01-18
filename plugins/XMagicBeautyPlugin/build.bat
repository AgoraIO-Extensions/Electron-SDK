@echo off

@REM build.bat Win32/x64 Debug/Release

set ROOT=%~dp0
set BUILD_ARCH=%1
set BUILD_TYPE=%2

echo "ROOT: %ROOT%"
echo "BUILD_ARCH: %BUILD_ARCH%"
echo "BUILD_TYPE: %BUILD_TYPE%"

if not exist %ROOT%\\build (mkdir %ROOT%\\build)
cd %ROOT%\\build

cmake ^
    -G "Visual Studio 16 2019" ^
    -A %BUILD_ARCH% ^
    -DCMAKE_BUILD_TYPE=%BUILD_TYPE% ^
    %ROOT%

cmake --build . --config %BUILD_TYPE%

if %errorlevel% NEQ 0 (
    echo "cmake build failed: %errorlevel%"
    exit 1
)