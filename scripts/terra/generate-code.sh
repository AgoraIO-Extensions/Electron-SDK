#!/usr/bin/env bash
set -e
set -x

MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/../..)

# treated as a completely separate project (not even a workspace), create an empty yarn.lock file in it.
touch yarn.lock
rm -rf node_modules
rm -rf .terra
yarn
rm yarn.lock

npm exec terra -- run \
    --config ${PROJECT_ROOT}/scripts/terra/config/types_config.yaml  \
    --output-dir=${PROJECT_ROOT}/ts/Private

npm exec terra -- run \
    --config ${PROJECT_ROOT}/scripts/terra/config/impl_config.yaml  \
    --output-dir=${PROJECT_ROOT}/ts/Private

cd ${PROJECT_ROOT}

npm run build:ts-interface

npm run lint -- --fix
