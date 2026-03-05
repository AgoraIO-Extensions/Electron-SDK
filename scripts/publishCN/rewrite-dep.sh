#!/bin/bash
set -e
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)
. ${PROJECT_ROOT}/scripts/publishCN/common.sh

change_file=${PROJECT_ROOT}/package.json
sed "s/${old_name}/${new_name}/g" ${change_file} >tmp && mv tmp ${change_file}
sed "s/${old_description}/${new_description}/g" ${change_file} >tmp && mv tmp ${change_file}
sed "s/${old_yarn_link}/${new_yarn_link}/g" ${change_file} >tmp && mv tmp ${change_file}
sed "s/${old_repository}/${new_repository}/g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/tsconfig.json
sed "s/${old_package_name}/${new_package_name}/g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/.github/workflows/publish.yml
sed "s/${old_package_name}/${new_package_name}/g" ${change_file} >tmp && mv tmp ${change_file}

change_comment_file=${PROJECT_ROOT}/scripts/terra/comment_config.yaml
sed "s/ng_json_template_en/ng_json_template_cn/g" ${change_comment_file} > tmp && mv tmp ${change_comment_file}
echo "${change_comment_file} rewritten successfully"
