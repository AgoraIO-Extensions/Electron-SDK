#!/bin/bash -e

shell_path=$(
  cd "$(dirname "$0")" || exit
  pwd
)
root_path="$shell_path/../.."

build() {
  cd "$root_path" || exit
  mkdir -p ./build/android/"$1"
  cd ./build/android/"$1" || exit
  cmake \
    -DANDROID_ABI="$1" \
    -DANDROID_NDK="$ANDROID_NDK" \
    -DCMAKE_TOOLCHAIN_FILE="$ANDROID_NDK"/build/cmake/android.toolchain.cmake \
    -DANDROID_TOOLCHAIN=clang \
    -DANDROID_PLATFORM=android-16 \
    -DCMAKE_BUILD_TYPE="$2" \
    "$root_path"
  cmake --build . --config "$2"
}

if [ "$1" == "build" ]; then
  build "$2" "$3"
else
  sh "$shell_path/prepare.sh" Android "$1"
  echo "start build arm64-v8a ----------"
  build arm64-v8a Debug
  build arm64-v8a Release
  echo "start build armeabi-v7a ----------"
  build armeabi-v7a Debug
  build armeabi-v7a Release
  echo "start build x86 ----------"
  build x86 Debug
  build x86 Release
  echo "start build x86_64 ----------"
  build x86_64 Debug
  build x86_64 Release
fi
