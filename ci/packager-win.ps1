$chooseExampleType=$args[0]
$example_sdk_mode=$args[1]
$electronVersion=$args[2]
$outterZipName="electronDemo.zip"

pushd example
yarn config set registry https://registry.npmmirror.com

function ChooseArch($type)
{
  # remove node_modules
  Remove-Item -Path node_modules -Recurse -Force -ErrorAction Ignore;
  if ($type -eq "ia32") {
    write-host("ChooseArch ia32")
    Copy-Item -Path ../ci/.npmrc_x32 -Destination ./.npmrc -Force
  } elseif ($type -eq "x64") {
    write-host("ChooseArch x64")
    Copy-Item -Path ../ci/.npmrc_x64 -Destination ./.npmrc -Force
  } else {
    write-host("not set arch type")
  }
}

if ($electronVersion -eq "switchEnv") {
    write-host("switchEnv")
    ChooseArch -type $chooseExampleType
    yarn install --no-lockfile
    popd
    return
}

function DistByArch($type)
{
  if ($type -eq "ia32") {
    write-host("distByArch x32")
    yarn dist:win32
  } elseif ($type -eq "x64") {
    write-host("distByArch x64")
    yarn dist:win64
  } else {
    write-host("not set arch type")
  }
}

function Package($archNum,$electronVersion,$example_sdk_mode){
  # remove zip
  Remove-Item -Path ../$outterZipName -Recurse -Force -ErrorAction Ignore;

  # remove dist
  Remove-Item -Path dist -Recurse -Force -ErrorAction Ignore;

  # choose arch
  ChooseArch -type $archNum

  if ($example_sdk_mode -eq 1) {
    yarn config set agora-electron-sdk-pre-built 0
  } else {
    npm config delete agora_electron_sdk_pre_built
    yarn config delete agora-electron-sdk-pre-built
  }

  if ([String]::IsNullOrEmpty($electronVersion))
  {
    Write-Host "安装example 依赖"
    yarn install --no-lockfile
  } else {
    Write-Host "选择了 electron_version:$electronVersion"
    yarn add --dev electron@$electronVersion --no-lockfile
  }

  if ($example_sdk_mode -eq 1) {
    Remove-Item -Path  node_modules/agora-electron-sdk/build -Recurse -Force -ErrorAction Ignore;
    Remove-Item -Path  node_modules/agora-electron-sdk/js -Recurse -Force -ErrorAction Ignore;
    Remove-Item -Path  node_modules/agora-electron-sdk/type -Recurse -Force -ErrorAction Ignore;
    # copy native sdk
    Copy-Item -Path ../Electron-*/* -Destination node_modules/agora-electron-sdk/ -Recurse -Force
  }

  # dist start
  DistByArch -type $archNum
  # move zip
  Copy-Item -Path dist/Agora-Electron-API-Example-*.zip -Destination ../$outterZipName -Recurse -Force
}

write-host("Package win:1")
Package -archNum $chooseExampleType -electronVersion $electronVersion -example_sdk_mode $example_sdk_mode
popd;

# switch -Regex ($chooseExampleType)
# {
#     1 {
#       write-host("Package win:1")
#       Package -archNum $args[1]
#       Break
#     }
#     2 {
#       write-host("Package win:2")
#       Package -archNum $args[1]
#       Break
#     }
#     3 {
#       write-host("Package win:3")
#       Package -archNum $args[1]
#       Break
#     }
#     4 {"It is four."; Break}
# }

echo "结束"
