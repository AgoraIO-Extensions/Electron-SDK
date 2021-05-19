#!/bin/bash -e

root_path="$(
  cd "$(dirname "$0")" || exit
  pwd
)/../.."

platforms=(
  Android
  iOS
  Mac
  Windows
)

prepare() {
  libs="$root_path/third_party/agora/rtc/libs"
  echo "prepare download $libs"
  cd "$libs" || exit
  version="${2//\./_}"
  zip="Agora_Native_SDK_for_$1_v${version}_FULL.zip"
  url="https://download.agora.io/sdk/release/$zip"
  echo "start download $url"
  curl -O "$url"
  unzip "$zip" "Agora_Native_SDK_for_$1_FULL/libs/*"
  rm "$zip"
  if [ "$1" == "iOS" ]; then
    sh "$root_path/ci/to-framework.sh" "$libs/Agora_Native_SDK_for_$1_FULL"
  fi
}

if [[ "${platforms[*]}" =~ $1 ]]; then
  prepare "$1" "$2"
else
  echo "the param1 should be one of [${platforms[*]}]"
fi
