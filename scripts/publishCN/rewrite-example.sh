#!/bin/bash
set -e
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)
. ${PROJECT_ROOT}/scripts/publishCN/common.sh

change_dir="${PROJECT_ROOT}/example/src"

find "$change_dir" -type f | while read -r file; do
  sed -i.bak "s/${old_package_name}/${new_package_name}/g" "$file"
  echo "Replaced in $file"
done

change_file=${PROJECT_ROOT}/example/package.json
sed "s/${old_package_name}/${new_package_name}/g" ${change_file} >tmp && mv tmp ${change_file}

change_file=${PROJECT_ROOT}/example/webpack.renderer.additions.js
sed "s/${old_package_name}/${new_package_name}/g" ${change_file} >tmp && mv tmp ${change_file}

find "$change_dir" -name "*.bak" -type f -delete

echo "All replacements completed successfully, and backup files have been deleted."
