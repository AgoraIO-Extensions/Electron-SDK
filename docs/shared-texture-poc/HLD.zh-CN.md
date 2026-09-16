# Electron Shared Texture 视频发布 HLD

状态：PoC / 内部接口
范围：Electron 43.2，Windows D3D11，macOS IOSurface

## 1. 目标与边界

目标：把 Electron 离屏窗口的最终合成画面交给 Agora Native 编码器，桥接层不执行
GPU-to-CPU 像素回读。

本方案不修改 Chromium，也不让 Native 直接解析 Electron 的 NT Handle 或
IOSurfaceID。平台资源解析集中在 Iris：

- Windows：NT Handle -> `ID3D11Texture2D*`
- macOS：IOSurfaceID -> `CVPixelBufferRef`

不包含：音频采集、完整 A/V 同步验收、端到端零拷贝承诺、完整 Device Lost 自动
恢复、非 BGRA 输入。

## 2. 总体架构

```text
WebGL2 Worker
  -> OffscreenCanvas / BrowserWindow compositor
  -> Electron offscreen paint (OffscreenSharedTexture)
  -> AgoraElectronBridge.PushSharedTexture
  -> Iris MediaEngine_pushSharedTexture
  -> Iris platform resource import
  -> Native IMediaEngine::pushVideoFrame
  -> Agora encoder / network
```

职责划分：

| 层                | 职责                                                        |
| ----------------- | ----------------------------------------------------------- |
| Electron/Chromium | WebGL 绘制、窗口合成、输出共享纹理和实际格式                |
| Electron SDK      | 采集参数、Handle 元数据校验、进程间资源准备、生命周期和背压 |
| Iris              | 手写事件分发、平台 Handle 导入、构造 `ExternalVideoFrame`   |
| Native SDK        | 同步接收 D3D11 Texture/CVPixelBuffer，进入 Native 编码链路  |
| 业务方            | 场景编排、预览、音频、A/V 时钟映射、设备丢失后的业务恢复    |

## 3. 新增接口

### 3.1 Electron SDK

接口定义在手写的 `IAgoraElectronBridge`，不放入代码生成的 `IMediaEngine`：

```ts
PushSharedTexture(frame: SharedTextureFrame): Promise<SharedTextureResult>;

// 仅用于 macOS Renderer Engine 跨进程 case
CreateCrossProcessIOSurfaceCopy(
  nativeHandle: Buffer,
  pixelFormat: 'bgra'
): number;
ReleaseCrossProcessIOSurfaceCopy(crossProcessIOSurfaceId: number): void;
```

`SharedTextureFrame` 的关键字段：

| 字段                      | 含义                                          |
| ------------------------- | --------------------------------------------- |
| `frameId`                 | 单调递增帧号，用于结果匹配和拒绝旧帧          |
| `nativeHandle`            | Electron 提供的指针宽度 Handle：Windows ia32 为 4 字节，x64/macOS 为 8 字节 |
| `width`, `height`         | `textureInfo.codedSize`                       |
| `timestampUs`             | Electron compositor 时间戳，仅用于诊断        |
| `rtcTimestampMs`          | `getCurrentMonotonicTimeInMs()`，提交给 RTC   |
| `pixelFormat`             | Electron 实际输出的 `bgra`                    |
| `sourceProcessId`         | Windows 跨进程复制 Handle 时使用              |
| `crossProcessIOSurfaceId` | macOS Renderer Engine GPU Copy 的 ID          |

`PushSharedTexture` 同步完成 Iris/Native 调用，再返回已决议的 Promise。RTC 负值和
Iris 传输错误都会作为 Promise rejection 返回。

### 3.2 Iris

新增手写事件：

```text
MediaEngine_pushSharedTexture
```

传输约定：

- JSON：`format`、`width`、`height`、`timestamp`、`videoTrackId`
- `ApiParam.buffer[0]`：NT Handle 或 IOSurfaceID 数值
- `IMediaEngineWrapper::pushSharedTexture` 解析后调用
  `SharedTextureConverter::Push`

事件注册在手写 `IMediaEngineWrapper`，不会被 Iris wrapper 代码生成覆盖。

### 3.3 Native SDK

不新增 Native 公共方法，继续调用：

```cpp
IMediaEngine::pushVideoFrame(ExternalVideoFrame*, videoTrackId)
```

使用的 Native 字段：

| 平台    | `type`                 | `format`                        | 资源字段         |
| ------- | ---------------------- | ------------------------------- | ---------------- |
| Windows | `VIDEO_BUFFER_TEXTURE` | `VIDEO_TEXTURE_ID3D11TEXTURE2D` | `d3d11Texture2d` |
| macOS   | `VIDEO_BUFFER_TEXTURE` | `VIDEO_PIXEL_DEFAULT`           | `pixelBuffer`    |

macOS 只要设置 `pixelBuffer`，`format` 固定为 `VIDEO_PIXEL_DEFAULT`；Native 从
CVPixelBuffer 读取实际格式。

## 4. 平台实现

### 4.1 Windows

```text
textureInfo.handle.ntHandle
  -> Electron Addon 校验/必要时 DuplicateHandle
  -> Iris 枚举 DXGI Adapter
  -> ID3D11Device1::OpenSharedResource1
  -> 校验尺寸、Mip、Array、Sample 和 BGRA DXGI Format
  -> ExternalVideoFrame.d3d11Texture2d
  -> Native pushVideoFrame
```

最新实现不创建 Iris 中间纹理，也不执行 `CopyResource`。`OpenSharedResource1` 返回
指向同一 GPU 资源的 COM 接口；Iris 在同步 `pushVideoFrame` 返回前持有该引用。

Windows 只接受 `DXGI_FORMAT_B8G8R8A8_UNORM/TYPELESS`。直传纹理不带 Iris 自建
keyed mutex，Native 不应等待未定义的 key。

### 4.2 macOS

```text
textureInfo.handle.ioSurface
  -> Electron Addon: IOSurfaceGetID
  -> Iris: IOSurfaceLookup
  -> CVPixelBufferCreateWithIOSurface
  -> ExternalVideoFrame.pixelBuffer + VIDEO_PIXEL_DEFAULT
  -> Native pushVideoFrame
```

主进程 case 中，CVPixelBuffer 是原 IOSurface 的视图，不复制像素。Iris 校验
IOSurface 宽高以及 BGRA FourCC。

## 5. Engine 进程模型

两个 demo 区分 Engine 归属，不区分像素格式：

| Case                       | Engine        | 跨进程处理                         |
| -------------------------- | ------------- | ---------------------------------- |
| `SharedTexturePoc`         | Electron Main | 无 Main -> Renderer 纹理传递       |
| `SharedTextureRendererPoc` | 可见 Renderer | Main 捕获后逐帧 IPC，Renderer 提交 |

Renderer Engine case：

- Windows：Main 发送 Handle 数值和 PID；Renderer Addon 调用 `DuplicateHandle`。
  复制的是内核 Handle，不是纹理像素。
- macOS：原 `IOSurfaceRef` 不能作为进程内指针直接传递。Main 使用 Metal blit 到
  短生命周期 global IOSurface，把 ID 发给 Renderer；收到提交结果后释放。

#### 为什么不直接传原始 IOSurfaceID

`IOSurfaceGetID()` 返回非零 ID，只能证明 Surface 有身份，不能证明其他进程已经获得
访问权。只有 global IOSurface 才明确支持任意进程按 ID 执行 `IOSurfaceLookup`；更
安全、稳定的跨进程契约是通过 Mach/XPC 转移 IOSurface 对应的 send right。

Electron Shared Texture OSR 是 experimental API。不同 Electron/Chromium、macOS 和
GPU backend 组合可能改变 compositor IOSurface 的创建属性、格式、纹理池和生命周期；
Electron 没有承诺原始 Surface 一定是 global。因此直接发送原始 ID 只能作为指定
版本组合下的实测优化，不能作为跨版本契约。

若目标版本实测 Renderer 能 lookup 原始 ID，并且 Main 在提交完成前持续持有
Electron Texture，则可省去 Metal Copy。正式无 Copy 方案应选择以下之一：

- Engine 与 `paint` 保持在 Main 进程；
- Electron SDK 使用原生 Mach/XPC 通道传递 IOSurface 权限。

RTC Engine 对象不跨进程共享。时间戳必须由实际提交帧的 Engine 生成。

## 6. 性能与拷贝

| 阶段                       | CPU 像素拷贝 | 显式 GPU 拷贝   | 说明                                      |
| -------------------------- | ------------ | --------------- | ----------------------------------------- |
| Electron `paint` -> Addon  | 无           | 无              | 只传 Handle 和元数据                      |
| Windows Main Engine        | 无           | 无              | `OpenSharedResource1` 后直传 Texture 指针 |
| Windows Renderer Engine    | 无           | 无              | `DuplicateHandle` 不复制 GPU 内容         |
| macOS Main Engine          | 无           | 无              | IOSurface-backed CVPixelBuffer 视图       |
| macOS Renderer Engine      | 无           | **1 次/提交帧** | Metal blit 到跨进程 IOSurface，并等待完成 |
| Iris -> Native             | 无           | 无              | 同步传资源指针                            |
| Windows raw-handle preview | 无           | **1 次/帧**     | 仅诊断；默认关闭                          |

结论：桥接链路没有 `readPixels`、staging texture、`Map` 或整帧 CPU 内存复制。
但不能宣称端到端零拷贝：Chromium compositor 内部和 Native 编码器内部可能执行
GPU 合成、颜色转换或复制，具体由实现和硬件决定。

Worker 以发送目标的 2 倍帧率绘制会增加 WebGL 渲染负载，但不提高 compositor、
RTC encoder 或 macOS Renderer 跨进程 Copy 的目标帧率。

## 7. 生命周期、同步与背压

- Electron 的 Texture/Handle 是借用资源，不能缓存为永久资源。
- Controller 同时只允许 1 帧提交中，并保留 1 个最新等待帧；更旧等待帧立即释放。
- `texture.release()` 在同步 Iris/Native 调用完成后执行，每个 Texture 只释放一次。
- Windows 跨进程复制的 Handle 在调用结束后关闭；原 Electron Handle 不由 Iris/
  Native 关闭。
- macOS Iris 在 Native 返回前持有 CVPixelBuffer；Renderer case 同时持有 global
  IOSurface，收到结果后释放。
- Native 若异步消费，必须在 `pushVideoFrame` 返回前 retain 或复制资源。
- Stop 会释放等待帧并有界等待正在提交的帧，避免无限阻塞。

## 8. 格式、时钟与帧率

- BrowserWindow 请求 `sharedTexturePixelFormat: 'argb'`，以 `paint` 返回的实际
  `textureInfo.pixelFormat` 为准。
- Windows 和 macOS 均只支持 BGRA；其它格式明确拒绝，不做隐式转换。
- 视频时间戳使用 Agora Engine 的 `getCurrentMonotonicTimeInMs()`；Electron
  compositor 时间戳只用于诊断。
- 30/48/60 fps 配置 Electron compositor 和 RTC encoder；Worker 使用独立 timer，
  以目标帧率的 2 倍绘制，最高 120 fps，降低两个时钟错拍造成的重复画面。Worker
  绘制帧率不是实际发送帧率。
- `backgroundThrottling: false` 和 `show: false` 是目标配置，不构成后台帧率保证；
  hidden/minimized/background 仍需目标机器实测。

## 9. 测试验收

### 9.1 测试场景和验收标准

| 测试项     | 适用性   | 测试内容                                                                                                  | 通过标准                                                                                                                          |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 功能测试   | 适用     | Windows/macOS 分别运行 Main Engine 和 Renderer Engine case，覆盖 30/48/60 fps                             | `PushSharedTexture` 返回 0；远端画面持续运动；编码帧、发送帧率和码率持续更新                                                      |
| 格式与参数 | 适用     | Windows/macOS BGRA；覆盖非法 Handle、尺寸、格式、时间戳、旧帧及 Iris/RTC 失败                             | 合法帧正常提交；非法输入明确失败且不进入 Native；非 BGRA 输入被拒绝；无崩溃或资源泄漏                                             |
| 生命周期   | 适用     | 覆盖 pending 替换、stop/restart、join/load 失败和迟到结果                                                 | 同时最多持有 1 个 in-flight 和 1 个 pending；每个 Texture 只释放一次；停止后不提交旧帧                                            |
| 性能测试   | 摸底测试 | hidden/visible/minimized 分别以 30/48/60 fps 运行至少 10 分钟，记录 CPU/GPU/内存/显存及各阶段帧率         | 无 CPU 像素回读；Copy 次数符合第 6 节；令 `T=1000/fps`，要求 `abs(P50-T)/T<=10%`、`P99<3T`，且无无法解释的 500 ms 以上 paint 间隔 |
| 压力与恢复 | 适用     | 循环 start/stop、join/leave、resize，并注入 WebGL context loss、Renderer/GPU Process crash 和 Device Lost | 无崩溃、死锁、重复释放或持续资源增长；可恢复故障回到 `healthy`，不可恢复故障进入 `failed` 并完成有界清理                          |
| 兼容性测试 | 适用     | Electron 43.2；Windows ia32/x64 D3D11 覆盖 NVIDIA 独显、AMD 独显和 Intel 集显；macOS 覆盖 arm64/x86_64    | 各 GPU/架构组合均可加载 Addon 并持续发布远端动态画面；未测试的 Electron/OS/GPU 组合不声明兼容                                     |
| 回归测试   | 适用     | Addon 加载和打包，以及摄像头、内置屏幕共享、其它外部视频源和远端订阅                                      | 既有 API、回调和发布/订阅行为不变；现有 case 可正常加入、离开频道                                                                 |

### 9.2 自动化与实验室测试

现有自动化覆盖：

- SharedTexture 相关 Jest：配置、IPC、队列、生命周期、遥测和故障状态。
- 原生 `shared_texture_request` CTest：请求校验、Iris 事件参数和 macOS IOSurface
  路径。

实验室测试使用真实 Windows/macOS 设备，测量 30/48/60 fps 下的 CPU、GPU、内存、
显存、后台帧率及 Native 编码和发送表现。Mock 与独立 pacing benchmark 不能替代
真实设备的性能验收。

## 10. 关键代码

- Electron 类型/API：`ts/Types.ts`
- Electron N-API：`source_code/agora_node_ext/agora_electron_bridge.cpp`
- Windows 传输：`source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- macOS 传输：`source_code/agora_node_ext/iosurface_shared_texture_importer.cpp`
- macOS 跨进程 Copy：`source_code/agora_node_ext/iosurface_shared_texture_copy.mm`
- 帧队列与生命周期：`example/src/main/sharedTexturePocController.js`
- 帧率遥测：`example/src/main/sharedTexturePocTelemetry.js`
- 帧率基准：`example/scripts/sharedTexturePacingBenchmark.js`
- Renderer Engine IPC：`example/src/main/sharedTextureRendererPocIpc.js`
- Iris Event：`src/dcg/src/impl/IMediaEngine_Wrapper.cc`
- Iris 平台导入：`src/dcg/src/impl/SharedTextureConverter.cc`
