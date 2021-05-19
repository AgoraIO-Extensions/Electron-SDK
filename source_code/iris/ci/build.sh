#!/bin/bash -e

root_path="$(
  cd "$(dirname "$0")" || exit
  pwd
)/.."
sdk_type=$1
sdk_version=$2
build_platform=$3

if [ "$sdk_type" == "ALL" ]; then
  sh "$root_path/ci/build.sh" RTC "$sdk_version" "$build_platform"
elif [ "$sdk_type" == "RTC" ]; then
  if [ "$build_platform" == "ALL" ]; then
    sh "$root_path/ci/build.sh" "$sdk_type" "$sdk_version" Android
    sh "$root_path/ci/build.sh" "$sdk_type" "$sdk_version" iOS
    sh "$root_path/ci/build.sh" "$sdk_type" "$sdk_version" Mac
  elif [ "$build_platform" == "Android" ]; then
    echo "start build android --------------------"
    sh "$root_path/rtc/ci/build-android.sh" "$sdk_version"
  elif [ "$build_platform" == "iOS" ]; then
    echo "start build ios --------------------"
    sh "$root_path/rtc/ci/build-ios.sh" "$sdk_version"
  elif [ "$build_platform" == "Mac" ]; then
    echo "start build mac --------------------"
    sh "$root_path/rtc/ci/build-mac.sh" "$sdk_version"
  else
    echo "not support platform $build_platform"
  fi
else
  echo "not support sdk type $sdk_type"
fi
