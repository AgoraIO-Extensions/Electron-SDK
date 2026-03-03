#!/bin/bash
set -e
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)
. ${PROJECT_ROOT}/scripts/publishCN/common.sh

CI_ROOT=${PROJECT_ROOT}/ci

change_file=${CI_ROOT}/build/build_windows.groovy
sed "s#value: 'agora'#value: 'shengwang'#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${CI_ROOT}/build/build_mac.groovy
sed "s#value: 'agora'#value: 'shengwang'#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/scripts/checkElectron.js
sed "s#download.agora.io#download.shengwang.cn#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/scripts/downloadPrebuild.js
sed "s#download.agora.io#download.shengwang.cn#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/.github/workflows/publish.yml
sed "s#download.agora.io#download.shengwang.cn#g" ${change_file} >tmp && mv tmp ${change_file}
