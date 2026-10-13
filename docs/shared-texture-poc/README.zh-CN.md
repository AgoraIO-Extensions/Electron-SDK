# Electron Shared Texture 视频发布 PoC

[English](./README.md) | [高层设计](./HLD.zh-CN.md)

## 当前状态

这个 PoC 通过平台中立的 Electron API 发布离屏画面。Electron 只把平台共享纹理
标识交给 Iris。Iris 在调用 Native `pushVideoFrame` 前，将 Windows NT Handle
打开为 `ID3D11Texture2D` 并同步直传，或者把 macOS IOSurface 包装成
`CVPixelBufferRef`。Native 不再接收 Electron NT Handle 或 IOSurfaceID。

采集窗口显式请求 Electron 的 `argb` Shared Texture 输出，并验证实际
`textureInfo.pixelFormat`。Windows 和 macOS 均只接受 `bgra`；其它格式会被释放并
计入 invalid frame，不会自动转换或错误标记。

### 验证状态（2026-10-13）

Agora SDK 提供音视频采集、编码和 RTC 音画同步能力。本 PoC 聚焦将 Electron
compositor 纹理接入已有 RTC 链路。macOS 共享纹理链路已实现，构建和 API 集成
检查已通过。已记录的验证覆盖 universal addon 编译和 Electron → Iris → Native
API 边界，详见[已验证范围](#已验证范围)。

当前分支的依赖配置为 Agora Electron SDK `4.5.3-build.6-rc.4`、Iris
`4.5.3.6-build.5`（macOS artifact `32987`）和 Native macOS `4.5.3.6` build
`28999`（FAV artifact `1319956`）。这些是当前分支配置的包版本。
依赖变更以 `package.json` 为准，每次测试结果都应记录实际版本。

### 历史 Windows 验证基线

早期 Windows 验证使用以下环境：

- Windows ia32 和 x64
- Electron `43.2.0`
- Electron Node `24.18.0`，原生模块 ABI `148`
- Agora Electron SDK `4.5.3-build.123-rc.2`
- 基于 `4.5.2.175` 的 CSD-79710 Native RTC 开发包 `1289436`

## 当前已经做到的部分

PoC 已经实现完整的视频发布流程：

1. `Advanced -> SharedTexturePoc` 页面通过 IPC 把频道参数发送到 Electron
   主进程。
2. 主进程创建 RTC Engine、启用外部视频源，并以主播身份发布自定义视频轨。
   这个 case 不发布摄像头和麦克风轨。加入频道不会自动提交共享纹理，画面提交由
   独立的“开始/停止”按钮控制。
3. 离屏 `BrowserWindow` 使用 `offscreen.useSharedTexture: true` 承载真实 DOM
   canvas。页面调用 `transferControlToOffscreen()`，由独立 Worker 持有
   WebGL2、渲染资源以及基于 timer 的 30/48/60 fps 绘制循环。窗口显式设置
   `sharedTexturePixelFormat: 'argb'`，并验证 `paint` 实际输出在 Windows 和 macOS
   都必须是 BGRA。
4. Electron 43 通过 `details.texture` 提供每一帧。Windows 使用
   `texture.textureInfo.handle.ntHandle`，macOS 使用
   `texture.textureInfo.handle.ioSurface`。
5. Node 原生扩展验证帧参数，并把共享纹理标识交给手写的 Iris
   `MediaEngine_pushSharedTexture` API。
6. Windows 由 Iris 打开 NT Handle，并把得到的 `ID3D11Texture2D*` 同步直传；
   macOS 由 Iris lookup IOSurface 并创建 IOSurface-backed `CVPixelBufferRef`。
7. Iris 使用打开后的 D3D11 Texture 指针或 `ExternalVideoFrame.pixelBuffer`
   调用 Native `pushVideoFrame`。Iris 同步返回后 Electron 才释放借用纹理。
8. Iris 传输层错误和 RTC API 返回值都会传回 JavaScript，不再把 RTC
   失败误判为成功。
9. 停止或异常时会等待正在提交的帧结束，每个 Electron 纹理只释放一次，
   随后离开频道、释放 Engine 并销毁离屏窗口。

### Engine 所在进程示例

Advanced 菜单现在提供两个互斥运行的示例：

- `SharedTexturePoc` 保持原有行为：Electron 主进程创建、加入和释放 RTC Engine，
  并在主进程提交每个共享纹理。
- `SharedTextureRendererPoc` 在可见 Renderer 进程中创建、加入和释放独立 RTC
  Engine。主进程只持有离屏采集窗口、接收 `paint`、逐帧转发，并在 Renderer
  确认 RTC 提交完成后释放 Electron 纹理。

这两个示例区分的是 Engine 所在进程，不是两条不同的像素格式链路。它们接受相同
的 Shared Texture 格式；Iris 只要给 Native 设置了
`ExternalVideoFrame.pixelBuffer`，就会把 `format` 设置为
`VIDEO_PIXEL_DEFAULT`。这个 Native 契约不会让 CVPixelBuffer 或平台纹理自动具备
Electron 跨进程传递能力。主进程 Engine 示例不存在 Main 到 Renderer 的纹理边界；
Renderer Engine 示例仍需先跨越该边界，之后 Iris 才创建 CVPixelBuffer。

RTC Engine 对象不会跨进程共享，因此 Renderer 示例在 Renderer 中完成完整 Engine
生命周期。Windows 由主进程连同进程内 NT Handle 一起发送 PID，Renderer Addon
先调用 `DuplicateHandle`，再把复制后的 Handle 交给 Iris。macOS 由主进程 Addon
使用 Metal 把借用的 `IOSurfaceRef` GPU copy 到短生命周期的 global IOSurface，
Renderer 收到它的 `IOSurfaceID` 后调用 `IOSurfaceLookup`。Electron IPC 不会传递
任何仅在源进程有效的指针，提交完成后会立即释放这份 Surface。
两个示例都会保留，便于集成方明确选择 Engine 归属，而不是把 Renderer 链路误解为
必选架构。

控制器同时只保留一个正在提交的帧和一个最新等待帧，不会形成无限队列。
如果等待期间又产生新帧，更旧的等待帧会立即释放。加入频道后点击“开始”才会
提交画面；点击“停止”会阻止新帧提交，但不会离开频道或释放 RTC Engine。

每个有效 compositor 帧都使用实际提交该帧的 Engine 调用
`getCurrentMonotonicTimeInMs()`。主进程示例在 `paint` 时打时间戳；Renderer 示例
在收到转发帧后、调用 `PushSharedTexture` 前打时间戳。这个毫秒值会作为 RTC 视频
时间戳提交并回传到遥测；Electron compositor 时间戳仍单独保留，只用于诊断。

音频采集和 RTC 音画同步是 Agora SDK 的既有能力。当前示例演示共享纹理视频输入，
摄像头和麦克风发布保持关闭。SDK 暴露单调时钟用于外部音视频时间戳对齐，包括
`AudioFrame.renderTimeMs`。
此前的 `timestamp = 0` 只是兼容措施，用于避免误传不相关的 Electron 时钟值而被
当作旧帧丢弃。

## macOS IOSurface 适配

### 进程与 API 边界

macOS 链路不会要求客户 Renderer 解析平台指针。Worker 和 Renderer 只负责 WebGL
绘制；Electron GPU Process 产生 compositor IOSurface，随后离屏 `paint` 事件把
进程内 `IOSurfaceRef` Buffer 交给 Electron Main/Browser Process。Renderer Engine
示例只接收数值型 `IOSurfaceID`，不会获取这个引用。

```text
Worker WebGL2
  -> Electron GPU Process / compositor
  -> 主进程 webContents paint 事件
  -> texture.textureInfo.handle.ioSurface
  -> AgoraElectronBridge.PushSharedTexture
  -> Addon IOSurfaceGetID
  -> Iris MediaEngine_pushSharedTexture
  -> Iris IOSurfaceLookup + CVPixelBufferCreateWithIOSurface
  -> Native ExternalVideoFrame.pixelBuffer
  -> RTC encoder
```

`PushSharedTexture`、`CreateCrossProcessIOSurfaceCopy` 和
`ReleaseCrossProcessIOSurfaceCopy` 都是手写在 `IAgoraElectronBridge` 上的
Electron Native Addon API，不会加入生成的 `IMediaEngine` 文件，因此 Electron
codegen 不会删除它们。Iris 的 `MediaEngine_pushSharedTexture` 也注册在手写的
`IMediaEngineWrapper`，不进入生成文件。主进程示例直接调用 `PushSharedTexture`；Renderer 示例在
macOS 主进程调用 `CreateCrossProcessIOSurfaceCopy`，随后在两个平台的 Renderer 中
调用 `PushSharedTexture`。Create/Release API 只管理 macOS Main 到 Renderer 的 GPU
Copy，Native 不会收到它们产生的 IOSurfaceID。

`IOSurfaceRef` 指针只在 Electron 交付它的当前进程中有效，并且只被借用。PoC
不会通过 Electron IPC 传递这个指针。Addon 与 `paint` 回调位于同一个主进程，
因此会立即把它转换为交给 Iris 的数值型 `IOSurfaceID`。Renderer 示例则创建前述
global Metal copy。这个 ID 只用于 Electron 到 Iris 的传输，不会写入 Native
Video Frame 字段。

### 帧元数据与提交

Addon 会在调用 Iris 前验证每一帧 macOS 输入：

- 同进程提交时，Native Handle Buffer 必须包含一个 64 位 `IOSurfaceRef` 数值；
  跨进程 Renderer 提交则额外提供已经准备好的 `crossProcessIOSurfaceId`。
- `IOSurfaceGetWidth()` 和 `IOSurfaceGetHeight()` 必须与 Electron
  `textureInfo.codedSize` 一致。
- Iris 验证 IOSurface 宽高、创建 IOSurface-backed `CVPixelBufferRef`，并确认
  Electron 的 BGRA 元数据与实际 `kCVPixelFormatType_32BGRA` 一致。
- Iris 使用 `VIDEO_BUFFER_TEXTURE + VIDEO_PIXEL_DEFAULT` 提交，由 Native 从
  `CVPixelBufferRef` 读取实际像素格式。
- 非 BGRA 输入暂不启用。Iris 不做隐式格式转换；格式不匹配或不支持的帧会在提交
  Native 前失败。
- `timestamp` 使用 `getCurrentMonotonicTimeInMs()`；Electron compositor 时间戳
  只用于诊断，不能作为 RTC 时钟。
- IOSurface 链路不传 CPU 像素 Buffer，也不在 Electron 侧执行 `readPixels`、
  staging-buffer 回读或整帧内存复制。
- Renderer Engine 示例需要一次 Metal GPU copy，把 Electron 原始 compositor
  Surface 转成可跨进程 lookup 的 global IOSurface；主进程 Engine 示例仍直接使用
  原始 Surface，不需要这次 copy。
- Global IOSurface 仅供这个 PoC bridge 使用，不会跨帧缓存，并在 Renderer 提交完成
  后立即释放。生产实现应在具备对应互操作能力后优先采用受限的 Mach-port 传输。

本地 Electron 43.2、800 x 600、30 fps 实测中，连续 120 个 compositor 帧始终在
两个原始 IOSurface ID 之间交替。整个实验期间对这两个原始 Surface 执行
`CFRetain` 且不释放，也没有改变轮转模式或产生第三个 Surface。这说明 Core
Foundation 引用计数只能维持对象生命，不能阻止 Chromium 复用；真正控制复用的
是 Electron `texture.release()` 和 compositor 同步。

双 Surface 只是当前环境观测，不是永久平台契约。resize、设备丢失、Context
重建或 Chromium 改动都可能替换 Surface 池。未来无 copy 的 Renderer 实现可以为
每个已观测池成员传递一次 Mach right，逐帧只发送当前 Surface 身份，但必须动态
注册新 Surface、淘汰旧 Surface，并保持 producer-consumer 同步。仅通过普通
Electron IPC 发送 ID 仍然不足。

匹配的 Native SDK 契约支持
`ExternalVideoFrame.pixelBuffer + VIDEO_BUFFER_TEXTURE + VIDEO_PIXEL_DEFAULT`，
并从 CVPixelBuffer 自身读取 BGRA 格式。Iris 在同步 `pushVideoFrame` 调用期间
持有 CVPixelBuffer，并在 Native 返回后释放。调用成功或失败后，Controller 才调用
`texture.release()`。Controller 同时只允许一个提交中的帧，并且只保留一个最新等待帧。

### 帧率、后台运行与恢复

页面选择的 30、48 或 60 fps 会同时应用到三个阶段：

- Worker WebGL 绘制循环
- Electron `webContents.setFrameRate()` compositor 目标
- RTC `setVideoEncoderConfiguration({ frameRate })` encoder 目标

`sentFrameRate` 是 RTC 实际观测值，不是硬保证；网络或设备自适应仍可能降低它。
隐藏采集窗口使用 `show: false` 和 `backgroundThrottling: false`。

现有健康状态会报告 Renderer 退出、WebGL Context Loss、GPU Process 退出和 paint
间隔超时。IOSurface ID 不会跨帧缓存，因此 `paint` 恢复后会自然取得当前 Surface。
Iris lookup 或转换错误会返回为提交失败。

### 已验证范围

macOS 实现已经完成以下验证：

- Electron Addon 同时包含 `arm64`/`x86_64`，并链接 `IOSurface.framework`。
- 匹配的 Iris 双架构构建中，`ExternalVideoFrame` serializer 包含
  `pixelBuffer`，手写 Wrapper 暴露 `MediaEngine_pushSharedTexture`。
- Iris 测试创建真实 BGRA IOSurface-backed CVPixelBuffer，并验证 Native
  Mock 收到 `ExternalVideoFrame.pixelBuffer`、`VIDEO_PIXEL_DEFAULT`、宽高、时间戳和
  Track ID。
- Electron 原生请求测试验证新的 Iris Event、平台 Handle 槽位、帧元数据和 RTC
  结果同步透传。

已记录的检查覆盖编译及 Electron → Iris → Native API 边界。

## Worker 拓扑与诊断

PoC 现在验证的是客户架构中能够进入 Electron compositor 的变体：

```text
DOM canvas -> transferControlToOffscreen -> Worker WebGL2
  -> Electron compositor -> shared-texture paint -> Native RTC
```

它不能捕获完全由 Worker 创建、没有 DOM canvas 或 `WebContents` 的独立
`OffscreenCanvas`，因为该 Surface 不会进入 Electron compositor。从 Electron
renderer 页面创建 DOM canvas 并 transfer 到 Worker，即可保留 Worker 对 WebGL2
的持有方式。

## 隐藏采集窗口与后台帧率

当前方案需要一个专用的离屏 `BrowserWindow` 作为 compositor 宿主。它不是展示给
用户的预览窗口。生产环境中应从创建开始使用 `show: false`，在整个采集期间保持
存活，并与应用的可见窗口解耦。主界面被最小化、遮挡或切到后台时，不能连带最小化
或销毁这个采集窗口。

生产配置同时使用以下控制：

- `show: false`：采集窗口从创建起保持隐藏，不依赖把可见窗口最小化。
- `backgroundThrottling: false`：关闭 renderer 常规的后台节流。
- `webContents.setFrameRate(30 | 48 | 60)`：设置 compositor 和发送目标帧率；Worker
  使用独立 timer，以目标帧率的两倍绘制（最高 120 fps），降低两个独立时钟错拍时
  compositor 没有新画面的概率。Worker 超采样帧率不是实际发送帧率。
- `setVideoEncoderConfiguration({ frameRate })`：把相同目标设置给 RTC encoder；
  如果不设置，SDK 默认按 15 fps 编码，并在编码前丢弃多余输入帧。

PoC 中的 `visible` 和 `minimized` 采集窗口模式只用于对照测试。生产建议始终使用
独立的 `show: false` 模式，不让采集窗口跟随主窗口的显示或最小化状态。

这些配置用于请求持续后台渲染，但不构成硬实时或跨平台帧率保证。PoC 会输出
Worker 绘制间隔、Electron shared-texture `paint` 间隔、Native 提交和 RTC
发送/编码帧率，并在超过 500 ms 没有 `paint` 时把健康状态标记为 degraded。
Windows D3D11 与 macOS IOSurface 传输都已实现。

## SDK 既有能力与共享纹理接入

- Agora SDK 提供音视频采集、编码和 RTC 音画同步能力。
- 本示例将最终合成画面绘制到全窗口 canvas，并演示离屏窗口编排与共享纹理提交。
- 跨平台 Agora Electron API 接收 compositor 纹理，并暴露用于外部媒体源时间戳
  映射的 Agora 单调时钟。
- Iris 处理 Windows NT Handle/D3D11 和 macOS IOSurface/CVPixelBuffer 互操作。
  Native 只接收 `ID3D11Texture2D*` 或 `CVPixelBufferRef`，不接收 Electron
  shared handle。
- 纹理提交会把 SDK 错误返回到 JavaScript；平台相关 Native 互操作封装在 Electron
  API 内部。

Advanced 页面可以临时选择 30/48/60 fps 和上述三种测量模式。主进程调用
`webContents.setFrameRate()` 并通过 `getFrameRate()` 回读；Worker 独立使用 timer
以两倍目标帧率绘制，最高限制为 120 fps。

每五秒以及每次健康状态变化都会输出以下数据：

- Worker 帧序号、配置/实际绘制帧率、绘制间隔、`performance.timeOrigin` 和
  `performance.now()`
- Electron compositor 微秒时间戳，以及主进程 epoch/monotonic 时间
- Paint、提交、替换等待帧、无效帧、提交失败和 drain timeout 计数，以及滚动
  平均值、P50/P95/P99/最大间隔；页面直接显示 Worker draw FPS、Electron paint
  FPS、paint P95 gap 和 submission P95
- RTC `encodedFrameCount`、`sentFrameRate` 和 `txVideoKBitRate`

遥测会同时记录 Electron compositor 的微秒时间戳，以及实际提交的 Agora 单调
毫秒时间戳，用于时序诊断。

超过 500 ms 没有 paint、renderer unresponsive、GPU 子进程退出或 WebGL context
loss 会进入 degraded。后续有效 paint 会清除 paint/GPU 原因；WebGL 必须先报告
context restored，再收到有效 paint 才会恢复。Renderer 退出或 Worker 终止错误会
停止本轮运行：最多等待已经返回的异步提交两秒，释放纹理、离开 RTC 并报告
`failed`。

这个两秒上限不能中断同步阻塞在 `CallIrisApi` 内部的 Native 代码，因为该调用在
JavaScript 拿到 Promise 前执行。要恢复这种故障，需要 Native 提供可取消接口，
或把阻塞调用移出 Electron 主线程。

## 构建与集成验证要求

这个开发包必须通过：

- Node `24.18.0` 下的仓库构建
- SharedTexture 相关 Jest 测试
- 原生 `shared_texture_request` CTest
- Windows ia32 和 x64 打包，并证明 Example 使用当前 checkout 中针对 Electron
  `43.2.0`、ABI `148` 重编的 Addon
- macOS universal addon 使用能够序列化
  `ExternalVideoFrame.pixelBuffer` 的 Iris 成功编译

## Direct Texture 链路

每一帧经过以下过程：

```text
Electron NT Handle
  -> Iris MediaEngine_pushSharedTexture
  -> Iris OpenSharedResource1
  -> Iris 同步持有的 Electron ID3D11Texture2D
  -> Native ExternalVideoFrame.d3d11Texture2d
  -> RTC SDK
  -> 编码器
```

macOS 对应链路如下：

```text
Electron IOSurfaceRef
  -> Addon IOSurfaceGetID
  -> Iris MediaEngine_pushSharedTexture
  -> Iris IOSurfaceLookup + CVPixelBufferCreateWithIOSurface
  -> Native ExternalVideoFrame.pixelBuffer
  -> RTC SDK -> 编码器
```

### 原始 Handle 预览诊断

正式发送链路默认关闭原始 Handle 预览，因此不会产生额外 GPU Copy 或同步等待。
需要排查纹理内容时，可以在创建 `SharedTexturePocController` 时显式传入
`directHandlePreview: true`。此时 Addon 会打开标题为
`Raw Electron NT Handle Preview` 的 Windows 原生窗口，在调用 Iris 前直接对同一帧
NT Handle 执行 `OpenSharedResource1`，通过 GPU `CopySubresourceRegion` 复制到预览
swap chain，等待复制完成后显示。这个预览完全绕过 Iris、RTC SDK、编码器和网络：

- 预览连续而远端冻结，说明 Electron 产生的 Handle 内容正常，问题位于 Native
  RTC SDK 或后续链路。
- 预览本身也冻结，说明需要继续检查 Worker、Electron compositor 或 Handle
  导出内容。

预览路径会增加一次 GPU Copy 和同步等待，只能临时用于内容诊断，性能测试和客户
交付必须保持关闭。Iris 会独立打开并直接提交给 RTC 的 Handle 对应纹理。

Electron `HANDLE` 只被借用。Iris 打开但不关闭它，并在同步调用期间持有打开后的
Texture COM 引用，直接把该指针交给 Native。Native 返回后，JavaScript Controller
才释放 Electron Texture。macOS 上，Iris 通过 CVPixelBuffer
持有 lookup 后的 IOSurface，直到 Native `pushVideoFrame` 返回。

## Iris 导入契约

随包 Native SDK 头文件提供平台纹理输入字段：

- `ExternalVideoFrame::VIDEO_BUFFER_TEXTURE`，值为 `3`
- `VIDEO_TEXTURE_ID3D11TEXTURE2D`，值为 `17`
- `ExternalVideoFrame::d3d11Texture2d`
- `ExternalVideoFrame::textureSliceIndex`
- `ExternalVideoFrame::pixelBuffer`

Electron 包必须同时绑定包含 `MediaEngine_pushSharedTexture` 的 Iris 构建和匹配的
CSD-79710 Native 构建。旧 Iris Artifact 虽然能让 Electron Addon 编译通过，但因
缺少这个手写 Event，运行时会返回 `ERR_NOT_SUPPORTED`。

由 Iris 而不是 Native 解析 Electron 平台 Handle：

```cpp
ExternalVideoFrame frame;
frame.type = ExternalVideoFrame::VIDEO_BUFFER_TEXTURE;
frame.format = VIDEO_TEXTURE_ID3D11TEXTURE2D;
ComPtr<ID3D11Texture2D> iris_texture = OpenSharedTexture(nt_handle);
frame.d3d11Texture2d = iris_texture.Get();
frame.textureSliceIndex = 0;
frame.stride = width;
frame.height = height;
frame.timestamp = rtc_timestamp_ms;

media_engine->pushVideoFrame(&frame, video_track_id);
```

集成必须满足以下行为：

1. Windows 支持 `setExternalVideoSource(true, true, VIDEO_FRAME)`。
2. `d3d11Texture2d` 按公开语义接收 `ID3D11Texture2D*`；NT Handle 不跨越
   Iris 到 Native 的边界。
3. Windows 和 macOS 均只接受 BGRA；其它格式不在范围内，必须在提交 Native 前
   失败。
4. Iris 枚举 DXGI Adapter，直到 `OpenSharedResource1` 成功，并验证打开后纹理的
   宽高和 BGRA 格式。
5. 返回真实 RTC 提交结果；返回 `0` 表示 SDK 已按约定接受该纹理。
6. 把 `getCurrentMonotonicTimeInMs()` 取得的 `rtcTimestampMs` 原样设置为
   `ExternalVideoFrame::timestamp`。

### 生命周期与同步契约

在 Electron Addon 可以安全调用 `texture.release()` 之前，必须满足以下契约：

- Iris 在调用 Native 前打开借用的 Handle，并保持打开后的 COM 引用存活到同步
  `pushVideoFrame` 返回。
- Iris 和 Native 都不能关闭 Electron 原始 Handle。
- Native 在 `pushVideoFrame` 返回前 retain 或消费打开后的 D3D11
  Texture/CVPixelBuffer。
- 打开或资源验证失败必须在同步调用内返回负数 RTC 结果，不能把帧误报为接受。
- 契约必须明确 Chromium 从什么时候开始可以复用源纹理。
- Windows 直传纹理不带 Iris 自建 keyed mutex；Native 不应等待未定义的 key。

Windows 不再创建中间纹理或执行 `CopyResource`，而是同步传递打开后的 Electron
纹理指针。Native 若要异步消费，必须在返回前建立自己的资源所有权。macOS 创建
IOSurface-backed CVPixelBuffer，不把像素读回 CPU Buffer。Renderer Case 为跨进程
传递 IOSurface，仍保留已有的一次 Metal Copy。

## 相关文件

- `example/src/main/sharedTexturePocController.js`
- `example/src/main/sharedTexturePocTelemetry.js`
- `example/extraResources/sharedTextureScene.html`
- `example/extraResources/sharedTextureSceneWorker.js`
- `source_code/agora_node_ext/agora_electron_bridge.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_preview.cpp`
- `source_code/agora_node_ext/iosurface_shared_texture_importer.cpp`
- `source_code/agora_node_ext/shared_texture_request.cpp`
- Iris `src/dcg/src/impl/SharedTextureConverter.cc`
- Iris `src/dcg/src/impl/IMediaEngine_Wrapper.cc`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/AgoraMediaBase.h`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/IAgoraMediaEngine.h`

运行日志位于 `%LOCALAPPDATA%\Agora\electron`。
