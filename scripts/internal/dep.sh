#!/bin/bash
set -e
set +x
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)
PACKAGE_JSON_PATH="${PROJECT_ROOT}/package.json"
TERRA_CONFIG_PATH1="${PROJECT_ROOT}/scripts/terra/code_config.yaml"

if [ "$#" -lt 1 ]; then
    exit 1
fi
INPUT=$1

IRIS_MAC_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "macOS") | .iris_cdn[]')
IRIS_WINDOWS_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "Windows") | .iris_cdn[]')
DEP_VERSION=$(echo "$INPUT" | jq -r '.[] | select(.platform == "Windows") | .version')

if [ -z "$IRIS_MAC_DEPENDENCIES" ]; then
  echo "No iris mac native dependencies need to change."
else
  for DEP in $IRIS_MAC_DEPENDENCIES; do
    sed 's|"iris_sdk_mac": "\(.*\)"|"iris_sdk_mac": "'"$DEP"'"|g' $PACKAGE_JSON_PATH > tmp
    mv tmp package.json
    break
  done
fi

if [ -z "$IRIS_WINDOWS_DEPENDENCIES" ]; then
  echo "No iris windows native dependencies need to change."
else
  for DEP in $IRIS_WINDOWS_DEPENDENCIES; do
    sed 's|"iris_sdk_win": "\(.*\)"|"iris_sdk_win": "'"$DEP"'"|g' $PACKAGE_JSON_PATH > tmp
    mv tmp package.json
    break
  done
fi

if [ -z "$DEP_VERSION" ]; then
  echo "can not find dependencies version."
else
  echo "update dependencies version to $TERRA_CONFIG_PATH1"
  sed 's|rtc_[^/]*|rtc_'$DEP_VERSION'|g' $TERRA_CONFIG_PATH1 > tmp
  mv tmp $TERRA_CONFIG_PATH1
fi
