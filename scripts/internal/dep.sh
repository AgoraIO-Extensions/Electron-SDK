#!/bin/bash
set -e
set +x
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/..)
PACKAGE_JSON_PATH="${PROJECT_ROOT}/package.json"
if [ "$#" -lt 1 ]; then
    exit 1
fi
INPUT=$1

MAC_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "macOS") | .cdn[]')
IRIS_MAC_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "macOS") | .iris_cdn[]')
WINDOWS_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "Windows") | .cdn[]')
IRIS_WINDOWS_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "Windows") | .iris_cdn[]')

if [ -z "$MAC_DEPENDENCIES" ]; then
  echo "No mac native dependencies need to change."
  exit 0
else
  sed "s/\"native_sdk_mac\": \"\(.*\)\"/\"native_sdk_mac\": \"$MAC_DEPENDENCIES\"/g" package.json > tmp
  mv tmp package.json
fi
