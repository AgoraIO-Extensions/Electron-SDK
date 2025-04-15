#!/bin/bash
set -e
set +x
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)
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
else
  for DEP in $MAC_DEPENDENCIES; do
    sed 's|"native_sdk_mac": "\(.*\)"|"native_sdk_mac": "'"$DEP"'"|g' $PACKAGE_JSON_PATH > tmp
    mv tmp package.json
    break
  done
fi

if [ -z "$IRIS_MAC_DEPENDENCIES" ]; then
  echo "No iris mac native dependencies need to change."
else
  for DEP in $IRIS_MAC_DEPENDENCIES; do
    if [[ "$DEP" == *Standalone* ]]; then
      sed 's|"iris_sdk_mac": "\(.*\)"|"iris_sdk_mac": "'"$DEP"'"|g' $PACKAGE_JSON_PATH > tmp
      mv tmp package.json
      break
    fi
  done
fi

if [ -z "$WINDOWS_DEPENDENCIES" ]; then
  echo "No windows native dependencies need to change."
else
  sed 's|"native_sdk_win": "\(.*\)"|"native_sdk_win": "'"$WINDOWS_DEPENDENCIES"'"|g' $PACKAGE_JSON_PATH > tmp
  mv tmp package.json
fi

if [ -z "$IRIS_WINDOWS_DEPENDENCIES" ]; then
  echo "No iris windows native dependencies need to change."
else
  for DEP in $IRIS_WINDOWS_DEPENDENCIES; do
    if [[ "$DEP" == *Standalone* ]]; then
      sed 's|"iris_sdk_win": "\(.*\)"|"iris_sdk_win": "'"$DEP"'"|g' $PACKAGE_JSON_PATH > tmp
      mv tmp package.json
      break
    fi
  done
fi
