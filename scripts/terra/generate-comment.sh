#!/usr/bin/env bash
set -e
set -x

MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)

npm exec terra -- run \
    --config ${PROJECT_ROOT}/scripts/terra/comment_config.yaml  \
    --output-dir=${PROJECT_ROOT}/ts/Private

cd ${PROJECT_ROOT}

npm run lint -- --fix
