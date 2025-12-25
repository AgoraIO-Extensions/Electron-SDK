#!/bin/bash
set -e
set -x

# 配置镜像源以加速下载
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/

# 清理之前的构建产物
rm -rf node_modules
rm -rf sdk
rm -rf tmp

# 设置预构建选项为false以进行本地构建
npm config set agora_electron_sdk_pre_built false

echo "arch: $1"

if [ "$1" = "x64" ]; then
    # 安装依赖
    npm install --agora_electron_sdk_arch=x64
    npm run totalBuild --agora_electron_sdk_arch=x64
elif [ "$1" = "arm64" ]; then
    # 安装依赖
    npm install --agora_electron_sdk_arch=arm64
    npm run totalBuild --agora_electron_sdk_arch=arm64
fi
# 打包构建产物
npm run zipBuild

# 清理配置
npm config delete agora_electron_sdk_pre_built
