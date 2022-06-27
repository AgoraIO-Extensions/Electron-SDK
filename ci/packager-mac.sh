
outterZipName="electronDemo.zip"

example_sdk_mode=${1:-1}

example_electron_version=${2:-'18.2.3'}

echo example_sdk_mode: $example_sdk_mode 
echo example_electron_version: $example_electron_version

packExample() {
  rm $outterZipName
  pushd $1
  echo 当前工作路径:$(pwd)
  rm -rf node_modules dist

  if [ -n "$2" ]
  then
      echo 选择了 electron_version:$2
      yarn add electron@$2            
  else
      echo 安装example 依赖
      yarn
  fi

  if [ "$3" -eq 1 ]
  then
    rm -rf node_modules/electron-agora-rtc-ng/build
    cp -P -R ../Electron-*/* node_modules/electron-agora-rtc-ng/
  fi
  yarn dist:mac

  pushd dist/mac
  zip -ry $(pwd)/../../../${outterZipName} ElectronReact.app
  popd
  popd
}

packExample example $example_electron_version $example_sdk_mode
