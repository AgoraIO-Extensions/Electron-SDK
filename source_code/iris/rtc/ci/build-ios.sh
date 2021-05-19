#!/bin/bash -e

shell_path=$(
  cd "$(dirname "$0")" || exit
  pwd
)
root_path="$shell_path/../.."

build() {
  cd "$root_path" || exit
  mkdir -p ./build/ios/"$1"
  cd ./build/ios/"$1" || exit
  if [[ "$1" == "OS64COMBINED" ]]; then
    archs="armv7;arm64"
  fi
  cmake \
    -G Xcode \
    -DCMAKE_TOOLCHAIN_FILE="$root_path"/ios.toolchain.cmake \
    -DPLATFORM="$1" \
    -DARCHS="$archs" \
    -DDEPLOYMENT_TARGET="9.0" \
    -DCMAKE_BUILD_TYPE="$2" \
    "$root_path"
  cmake --build . --config "$2"
  unset archs
}

if [ "$1" == "build" ]; then
  build "$2" "$3"
else
  sh "$shell_path/prepare.sh" iOS "$1"
  #build OS64
  echo "start build OS64COMBINED ----------"
  build OS64COMBINED Debug
  build OS64COMBINED Release
  #build SIMULATOR
  echo "start build SIMULATOR64 ----------"
  build SIMULATOR64 Debug
  build SIMULATOR64 Release
  #build SIMULATORARM64
fi
