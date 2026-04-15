cd %cd%
dir /s /b /ad "%cd%\Agora_Native_SDK_for_Windows*"
for /f %%a in ('dir /s /b /ad "%cd%\Agora_Native_SDK_for_Windows*"') do (move /y "%%~a" "Agora_Native_SDK_for_Win_Full")
