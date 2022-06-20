$chooseExampleType=$args[0]
$outterZipName="electronDemo.zip"


function ChooseArch($type)
{
  if($type -eq 1){
    write-host("ChooseArch x32")
    Copy-Item -Path ../.npmrc_x32 -Destination ./.npmrc -Force
  } elseif($type -eq 2){
    write-host("ChooseArch x64")
    Copy-Item -Path ../.npmrc_x64 -Destination ./.npmrc -Force
  }else {
    write-host("not set arch type")
  }
}

function DistByArch($type)
{
  
  if($type -eq 1){
    write-host("distByArch x32")
    yarn dist:win32
  } elseif($type -eq 2){
    write-host("distByArch x64")
    yarn dist:win64
  }else {
    write-host("not set arch type")
  }
}
function Package($archNum){
  # remove zip
  Remove-Item -Path $outterZipName -Recurse -Force -ErrorAction Ignore;
  pushd Agora-Electron-API-Example
  # choose arch
  ChooseArch -type $archNum
  # remove node_modules
  Remove-Item -Path node_modules -Recurse -Force -ErrorAction Ignore;
  
  # remove dist
  Remove-Item -Path dist -Recurse -Force -ErrorAction Ignore;
  yarn
  # copy native sdk
  Copy-Item -Path ../Electron-*/* -Destination src/node_modules/electron-agora-rtc-ng/ -Recurse -Force
  # dist start
  DistByArch -type $archNum
  # move zip
  Copy-Item -Path dist/ElectronReact-*.zip -Destination ../$outterZipName -Recurse -Force
  popd;
}

switch -Regex ($chooseExampleType)
{
    1 {
      write-host("Package win:1")
      Package -archNum $args[1]
      Break
    }
    2 {
      write-host("Package win:2")
      Package -archNum $args[1]
      Break
    }
    3 {
      write-host("Package win:3")
      Package -archNum $args[1]
      Break
    }
    4 {"It is four."; Break}
}


echo "结束"

# IF "%chooseExampleType%"=="0" (
#   cd Agora-Electron-Premium
#   echo 当前工作路径: %cd%

#   @REM del /f/q/s node_modules
#   @REM call yarn --verbose
  
#   xcopy %cd%/Electron-*  node_modules/electron-agora-rtc-ng/ /s /e /y
#   @REM call yarn dist:zip

#   @REM pushd dist
#   @REM 7z a %cd%/../../../%outterZipName% win-unpacked
#   @REM popd
#   @REM popd
# ) ELSE IF "%chooseExampleType%"=="1" (
#   echo 1
# ) ELSE IF "%chooseExampleType%"=="2" (
  
#   echo 2
# ) ELSE (
  
#   echo default
# )

