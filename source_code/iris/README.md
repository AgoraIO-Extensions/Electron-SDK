# Iris

Agora 跨平台 SDK 基础模块

## 开发环境

* [Git](https://git-scm.com/)

* 推荐安装 [CLion](https://www.jetbrains.com/clion/) 或 [VSCode](https://code.visualstudio.com/)

    * [CMake](https://cmake.org/) 构建项目
    * [ClangFormat](https://releases.llvm.org/10.0.0/tools/clang/docs/ClangFormat.html) 格式化代码
    * [RapidJson](https://github.com/Tencent/rapidjson) 解析 JSON
    * [GTest](https://github.com/google/googletest) 执行 UnitTest

## 快速开始

***Windows 请使用 Git Bash***

#### 1、克隆代码

```shell
git clone https://github.com/AgoraLibrary/iris.git

cd iris

git submodule update --init
```

#### 2、配置 Native RTC SDK

**Windows**

```shell
cd libs

curl -o SDK.zip https://download.agora.io/sdk/release/Agora_Native_SDK_for_Windows_v3_3_1_FULL.zip

unzip SDK.zip
```

**Macos**

```shell
cd libs

curl -o SDK.zip https://download.agora.io/sdk/release/Agora_Native_SDK_for_Mac_v3_3_1_FULL.zip

unzip SDK.zip
```

#### 3、运行

```shell
mkdir build

cd build

cmake ..
```

Windows 使用 ***Visual Studio*** 打开 ***iris.sln***，build 后会生成 `iris.dll` `iris.lib` `iris.pdb` 等

Macos 执行 `make` 命令后会生成 `iris.framework`

#### 4、UnitTest

上述步骤会生成 `IrisUnitTests` 可执行程序

## 如何使用

* 查看 [include](./include/iris) 目录, 入口头文件为 [iris_engine.h](rtc/cxx/include/iris_rtc_engine.h)
* 查看代码示例 [test](rtc/cxx/test) 目录以参考实现，
  
## 注意事项

* 上层框架使用 ApiType 和 Json 字符串与 Iris 通信，Iris 解析后与 Native RTC SDK 通信
* 句柄使用 `uint64_t` 解析，Iris 会转换成 `void *`，所以上层需要转成 Number 类型
* 所有参数名严格与 Native RTC SDK 对齐，关系到透传的 Json 字符串中的 key
