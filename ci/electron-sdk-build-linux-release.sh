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

# 安装依赖
npm install

# 执行完整构建
npm run totalBuild

# 打包构建产物
npm run zipBuild

# 清理配置
npm config delete agora_electron_sdk_pre_built
