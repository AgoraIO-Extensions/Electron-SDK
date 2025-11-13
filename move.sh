#!/bin/bash

# 定义源路径和目标路径
SOURCE_PATH="/Users/guoxianzhe/agora/iris/build/mac/DCG/MAC/output/Release/AgoraRtcWrapper.framework"
TARGET_PATH="/Users/guoxianzhe/agora/Electron-SDK/build/Release"

# 输出操作信息
echo "开始复制 AgoraRtcWrapper.framework..."
echo "源路径: $SOURCE_PATH"
echo "目标路径: $TARGET_PATH"

# 检查源文件是否存在
if [ ! -d "$SOURCE_PATH" ]; then
    echo "错误: 源文件 $SOURCE_PATH 不存在!"
    exit 1
fi

# 确保目标目录存在
if [ ! -d "$TARGET_PATH" ]; then
    echo "目标目录不存在，正在创建..."
    mkdir -p "$TARGET_PATH"
fi

# 执行复制操作 (使用 -R 递归复制整个目录，-f 强制覆盖)
cp -Rf "$SOURCE_PATH" "$TARGET_PATH"

# 检查复制结果
if [ $? -eq 0 ]; then
    echo "✅ 复制成功!"
    echo "AgoraRtcWrapper.framework 已复制到 $TARGET_PATH"
else
    echo "❌ 复制失败!"
    exit 1
fi

# 设置执行权限
chmod -R 755 "$TARGET_PATH/AgoraRtcWrapper.framework"
echo "已设置框架文件权限"

echo "操作完成"


# 定义源路径和目标路径
SOURCE_PATH="/Users/guoxianzhe/agora/iris/build/mac/DCG/MAC/output/Release/AgoraRtcWrapper.framework"
TARGET_PATH="/Users/guoxianzhe/Downloads/agora-demo-app.app/Contents/Resources/Frameworks/FcrUIScene.framework/Versions/A/Resources/biagmeeting.app/Contents/Resources/app.asar.unpacked/node_modules/agora-electron-sdk/build/Release"

# 输出操作信息
echo "开始复制 AgoraRtcWrapper.framework..."
echo "源路径: $SOURCE_PATH"
echo "目标路径: $TARGET_PATH"

# 检查源文件是否存在
if [ ! -d "$SOURCE_PATH" ]; then
    echo "错误: 源文件 $SOURCE_PATH 不存在!"
    exit 1
fi

# 确保目标目录存在
if [ ! -d "$TARGET_PATH" ]; then
    echo "目标目录不存在，正在创建..."
    mkdir -p "$TARGET_PATH"
fi

# 执行复制操作 (使用 -R 递归复制整个目录，-f 强制覆盖)
cp -Rf "$SOURCE_PATH" "$TARGET_PATH"

# 检查复制结果
if [ $? -eq 0 ]; then
    echo "✅ 复制成功!"
    echo "AgoraRtcWrapper.framework 已复制到 $TARGET_PATH"
else
    echo "❌ 复制失败!"
    exit 1
fi

# 设置执行权限
chmod -R 755 "$TARGET_PATH/AgoraRtcWrapper.framework"
echo "已设置框架文件权限"

echo "操作完成"


# 定义源路径和目标路径
SOURCE_PATH="/Users/guoxianzhe/agora/Electron-SDK/js"
TARGET_PATH="/Users/guoxianzhe/Downloads/agora-demo-app.app/Contents/Resources/Frameworks/FcrUIScene.framework/Versions/A/Resources/biagmeeting.app/Contents/Resources/app.asar.unpacked/node_modules/agora-electron-sdk"

# 输出操作信息
echo "开始复制 js..."
echo "源路径: $SOURCE_PATH"
echo "目标路径: $TARGET_PATH"

# 检查源文件是否存在
if [ ! -d "$SOURCE_PATH" ]; then
    echo "错误: 源文件 $SOURCE_PATH 不存在!"
    exit 1
fi

# 确保目标目录存在
if [ ! -d "$TARGET_PATH" ]; then
    echo "目标目录不存在，正在创建..."
    mkdir -p "$TARGET_PATH"
fi

# 执行复制操作 (使用 -R 递归复制整个目录，-f 强制覆盖)
cp -Rf "$SOURCE_PATH" "$TARGET_PATH"

# 检查复制结果
if [ $? -eq 0 ]; then
    echo "✅ 复制成功!"
    echo "js 已复制到 $TARGET_PATH"
else
    echo "❌ 复制失败!"
    exit 1
fi

# 设置执行权限
chmod -R 755 "$TARGET_PATH"
echo "已设置 js 文件权限"

echo "操作完成"
