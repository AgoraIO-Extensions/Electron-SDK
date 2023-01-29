#!/bin/bash

path=$1
arch=$2

framework_suffix=".framework"
frameworks=$(ls "$path" | grep $framework_suffix)

pushd "$path" || exit
for framework in $frameworks; do
  binary_name=${framework%.*}
  for _arch in $(lipo -archs "$binary_name.framework/$binary_name"); do
    if [[ "$_arch" != "$arch" ]]; then
      lipo -remove "$_arch" "$binary_name.framework/$binary_name" -output "$binary_name.framework/Versions/A/$binary_name"
      echo "Removed arch $_arch from $binary_name.framework."
    fi
  done
done
popd || exit
