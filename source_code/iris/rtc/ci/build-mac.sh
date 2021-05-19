#!/bin/bash -e

shell_path=$(
  cd "$(dirname "$0")" || exit
  pwd
)
root_path="$shell_path/../.."

build() {
  cd "$root_path" || exit
  mkdir -p ./build/mac/"$1"
  cd ./build/mac/"$1" || exit
  cmake \
    -G Xcode \
    -DCMAKE_TOOLCHAIN_FILE="$root_path"/ios.toolchain.cmake \
    -DPLATFORM="$1" \
    -DCMAKE_BUILD_TYPE="$2" \
    "$root_path"
  cmake --build . --config "$2"
}

if [ "$1" == "build" ]; then
  build "$2" "$3"
else
  sh "$shell_path/prepare.sh" Mac "$1"
  echo "start build MAC ----------"
  build MAC Debug
  build MAC Release
  echo "start build MAC_ARM64 ----------"
  build MAC_ARM64 Debug
  build MAC_ARM64 Release
  #build MAC_CATALYST
  #build MAC_CATALYST_ARM64
fi
