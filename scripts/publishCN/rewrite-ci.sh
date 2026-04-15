#!/bin/bash
set -e
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)
. ${PROJECT_ROOT}/scripts/publishCN/common.sh

CI_ROOT=${PROJECT_ROOT}/ci

change_file=${PROJECT_ROOT}/scripts/checkElectron.js
sed "s#download.agora.io#download.shengwang.cn#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/scripts/downloadPrebuild.js
sed "s#download.agora.io#download.shengwang.cn#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/.github/workflows/publish.yml
sed "s#download.agora.io#download.shengwang.cn#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/ci/build/build_all_platforms.groovy
sed "s#electron_sdk_branch#shengwang_electron_sdk_branch#g" ${change_file} >tmp && mv tmp ${change_file}
sed "s#ELECTRON/build_mac#shengwang_electron/build_mac#g" ${change_file} >tmp && mv tmp ${change_file}
sed "s#ELECTRON/build_windows#shengwang_electron/build_windows#g" ${change_file} >tmp && mv tmp ${change_file}
sed "s#ELECTRON/build_linux#shengwang_electron/build_linux#g" ${change_file} >tmp && mv tmp ${change_file}
sed "s#value: 'electron-sdk'#value: 'shengwang-electron-sdk'#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/ci/build/build_mac.groovy
sed "s#electron_sdk_branch#shengwang_electron_sdk_branch#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/ci/build/build_windows.groovy
sed "s#electron_sdk_branch#shengwang_electron_sdk_branch#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/ci/build/build_linux.groovy
if [ -f ${change_file} ]; then
  sed "s#electron_sdk_branch#shengwang_electron_sdk_branch#g" ${change_file} >tmp && mv tmp ${change_file}
fi
