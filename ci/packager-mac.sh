
outterZipName="electronDemo.zip"

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
  cp -P -R ../Electron-*/* node_modules/electron-agora-rtc-ng/
  yarn dist:mac

  pushd dist/mac
  zip -ry $(pwd)/../../../${outterZipName} ElectronReact.app
  popd
  popd
}

packExample example $1

# case $chooseExampleType in
# 1)
#   echo 'package mac: 1'
#   packExample Agora-Electron-API-Example
#   ;;
# 2)
#   echo 'package mac: 2'
#   packExample Agora-Electron-API-Example
#   ;;
# 3)
#   echo 'package mac:3 '
#   packExample Agora-Electron-API-Example
#   ;;
# 4)
#   echo '你选择了 4'
#   ;;
# *)
#   echo '你没有输入 1 到 4 之间的数字'
#   ;;
# esac
