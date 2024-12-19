#!/bin/bash
set -e
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)
. ${PROJECT_ROOT}/scripts/publishCN/common.sh

change_file=${PROJECT_ROOT}/package.json
sed "s/${old_name}/${new_name}/g" ${change_file} >tmp && mv tmp ${change_file}
sed "s/${old_description}/${new_description}/g" ${change_file} >tmp && mv tmp ${change_file}
sed "s/${old_yarn_link}/${new_yarn_link}/g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/tsconfig.json
sed "s/${old_package_name}/${new_package_name}/g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/.github/workflows/publish.yml
sed "s/${old_package_name}/${new_package_name}/g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/ci/packager-mac.sh
sed "s#${old_node_modules}#${new_node_modules}#g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/ci/packager-win.ps1
sed "s#${old_node_modules}#${new_node_modules}#g" ${change_file} >tmp && mv tmp ${change_file}
