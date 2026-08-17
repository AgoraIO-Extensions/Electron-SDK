# Electron Shared Texture 视频发布 PoC

[English](./README.md)

## 当前状态

这个 PoC 已经可以在 Windows 上把 Electron 离屏渲染的画面发布到 Agora
频道。这个临时开发包通过 Iris 的 `d3d11Texture2d` 槽位原样传递 Electron NT
Handle 数值，用于 Native RTC SDK 同事验证在 SDK 内部打开 Handle。远端画面是否正常是 Native SDK
联调的验收项，不是仓库编译本身已经证明的结果。

已验证的环境如下：

- Windows x64
- Electron `43.2.0`
- Electron Node `24.18.0`，原生模块 ABI `148`
- Agora Electron SDK `4.5.3-build.123-rc.2`
- Agora Native RTC SDK Core `4.5.3.123`

## 当前已经做到的部分

PoC 已经实现完整的视频发布流程：

1. `Advanced -> SharedTexturePoc` 页面通过 IPC 把频道参数发送到 Electron
   主进程。
2. 主进程创建 RTC Engine、启用外部视频源，并以主播身份发布自定义视频轨。
   这个 case 不发布摄像头和麦克风轨。
3. 离屏 `BrowserWindow` 使用 `offscreen.useSharedTexture: true` 承载真实 DOM
   canvas。页面调用 `transferControlToOffscreen()`，由独立 Worker 持有
   WebGL2、渲染资源以及基于 timer 的 30/60 fps 绘制循环。
4. Electron 43 通过 `details.texture` 提供每一帧，共享纹理的 Windows NT
   Handle 位于 `texture.textureInfo.handle.ntHandle`。
5. Node 原生扩展验证帧参数，把 8 字节 Handle 数据解码为完全相同的数值。
6. Addon 把原始 NT Handle 数值而不是其地址放入 Iris 第 5 个 buffer；Addon
   不创建 D3D11 Device，也不打开资源。
7. Native RTC SDK 在 Iris 同步调用返回前打开并验证 Handle；后续处理需要的
   COM 引用由 Native SDK 自己持有。
8. Iris 传输层错误和 RTC API 返回值都会传回 JavaScript，不再把 RTC
   失败误判为成功。
9. 停止或异常时会等待正在提交的帧结束，每个 Electron 纹理只释放一次，
   随后离开频道、释放 Engine 并销毁离屏窗口。

控制器同时只保留一个正在提交的帧和一个最新等待帧，不会形成无限队列。
如果等待期间又产生新帧，更旧的等待帧会立即释放。加入频道期间和加入成功后
都允许提交画面。

每个有效 compositor 帧的 `paint` 事件到达主进程时，都会调用
`getCurrentMonotonicTimeInMs()` 取得 Agora SDK 单调时间。这个毫秒值会作为 RTC
视频时间戳提交；Electron compositor 时间戳仍单独保留，只用于诊断。

本 PoC 不采集自定义音频，因此它本身不能证明 A/V 同步已经完成。Favorited 还需
使用同一个 Agora SDK 单调时钟设置 `AudioFrame.renderTimeMs`，并验证长时间漂移。
此前的 `timestamp = 0` 只是兼容措施，用于避免误传不相关的 Electron 时钟值而被
当作旧帧丢弃。

## Worker 拓扑与诊断

PoC 现在验证的是客户架构中能够进入 Electron compositor 的变体：

```text
DOM canvas -> transferControlToOffscreen -> Worker WebGL2
  -> Electron compositor -> shared-texture paint -> Native RTC
```

它不能捕获完全由 Worker 创建、没有 DOM canvas 或 `WebContents` 的独立
`OffscreenCanvas`，因为该 Surface 不会进入 Electron compositor。客户仍可让
Worker 持有 WebGL2，但需要从 Electron renderer 页面创建并 transfer canvas。

## 目标责任边界

- Favorited 把 Studio 最终画面渲染到全窗口 canvas，并负责源采集、场景合成、
  窗口/进程编排、预览、A/V 时钟映射，以及 renderer/WebGL/推流恢复。
- 跨平台 Agora Electron API 接收 compositor 纹理，并向 Favorited 暴露完成
  A/V 映射所需的 Agora 单调时钟。
- Agora 负责 Windows NT Handle/D3D11 互操作，以及后续 macOS
  IOSurface/Metal 互操作。在 Electron 释放源纹理之前，Agora 必须同步消费它，
  或把它持有/GPU copy 到 Agora 自有资源。
- Agora 负责 Native 纹理导入、过期 Handle、D3D11 device loss 和 SDK 资源
  恢复，并向 Favorited 返回可处理的错误。Favorited 不编写平台相关 Native
  互操作代码。

Advanced 页面可以临时选择 30/60 fps，以及 hidden、visible、minimized 三种采集
窗口状态。主进程调用 `webContents.setFrameRate()` 并通过 `getFrameRate()` 回读；
Worker 独立使用 timer 控制目标绘制节奏。这些选项用于测量，不代表平台保证。

每五秒以及每次健康状态变化都会输出以下数据：

- Worker 帧序号、绘制间隔、`performance.timeOrigin` 和 `performance.now()`
- Electron compositor 微秒时间戳，以及主进程 epoch/monotonic 时间
- Paint、提交、替换等待帧、无效帧、提交失败和 drain timeout 计数，以及滚动
  P50/P95/P99/最大间隔
- RTC `encodedFrameCount`、`sentFrameRate` 和 `txVideoKBitRate`

遥测会同时记录 Electron compositor 的微秒时间戳，以及实际提交的 Agora 单调
毫秒时间戳。只有自定义音频也使用同一时钟，并通过长时间测试测量漂移后，才能
声称完成 A/V 同步验证。

超过 500 ms 没有 paint、renderer unresponsive、GPU 子进程退出或 WebGL context
loss 会进入 degraded。后续有效 paint 会清除 paint/GPU 原因；WebGL 必须先报告
context restored，再收到有效 paint 才会恢复。Renderer 退出或 Worker 终止错误会
停止本轮运行：最多等待已经返回的异步提交两秒，释放纹理、离开 RTC 并报告
`failed`。

这个两秒上限不能中断同步阻塞在 `CallIrisApi` 内部的 Native 代码，因为该调用在
JavaScript 拿到 Promise 前执行。要恢复这种故障，需要 Native 提供可取消接口，
或把阻塞调用移出 Electron 主线程。

## 已完成的验证

这个开发包必须通过：

- Node `24.18.0` 下的仓库构建
- SharedTexture 相关 Jest 测试
- 原生 `shared_texture_request` CTest
- Windows x64 打包，并证明 Example 使用当前 checkout 中针对 Electron
  `43.2.0`、ABI `148` 重编的 Addon

此前 CPU 回读版本通过过真实频道冒烟测试，但该结果不能证明 direct texture
Native SDK 链路可用。Native 同事需要用这个包验证编码帧、码率持续增长以及
远端动态画面。

## Direct Texture 链路

每一帧经过以下过程：

```text
Electron NT Handle
  -> Iris 第 5 个 buffer 中完全相同的 Handle 数值
  -> Native SDK OpenSharedResource1
  -> Native SDK 持有的 ID3D11Texture2D
  -> RTC SDK
  -> 编码器
```

### 原始 Handle 预览诊断

`SharedTexturePoc` 运行时还会打开标题为 `Raw Electron NT Handle Preview`
的 Windows 原生窗口。Addon 在调用 Iris 前直接对同一帧 NT Handle 执行
`OpenSharedResource1`，通过 GPU `CopySubresourceRegion` 复制到预览 swap chain，
等待复制完成后显示。这个预览完全绕过 Iris、RTC SDK、编码器和网络：

- 预览连续而远端冻结，说明 Electron 产生的 Handle 内容正常，问题位于 Native
  RTC SDK 或后续链路。
- 预览本身也冻结，说明需要继续检查 Worker、Electron compositor 或 Handle
  导出内容。

预览路径会增加一次 GPU Copy 和同步等待，只用于内容诊断，不能用于衡量零拷贝
链路的性能，也不会替换 RTC 仍然接收的原始 Handle。

这个 PoC 当前不包含以下能力：

- 端到端零拷贝编码
- 在 GPU 上完成 BGRA/RGBA 到 NV12 的转换
- 跨帧复用 D3D11 Device、Adapter 或纹理池
- NV12、P010、多平面纹理或非 Windows 共享纹理支持
- 自动化远端画面内容校验

Electron `HANDLE` 只被借用，Addon 和 Native SDK 都不能关闭它。Native SDK
必须在同步 `CallIrisApi` 返回前打开或复制 Handle；如果后续异步处理，则持有
自己的 COM 引用。随后 JavaScript 控制器只调用一次 Electron
`texture.release()`，Native SDK 最终只释放自己持有的资源。

## 临时 Native SDK 契约

随包 Native SDK 的头文件已经预留了接口结构：

- `ExternalVideoFrame::VIDEO_BUFFER_TEXTURE`，值为 `3`
- `VIDEO_TEXTURE_ID3D11TEXTURE2D`，值为 `17`
- `ExternalVideoFrame::d3d11Texture2d`
- `ExternalVideoFrame::textureSliceIndex`

此前随包 Native SDK 在这条链路上返回 RTC 错误 `-2`。这个开发包会明确启用
`useTexture=true`，并临时复用 `d3d11Texture2d` 传输槽承载 NT Handle 数值。

## Native RTC SDK 需要修改的部分

这个开发包约定 Native 把 `d3d11Texture2d` 解释为 NT Handle 数值，并在
`pushVideoFrame` 返回前打开它：

```cpp
ExternalVideoFrame frame;
frame.type = ExternalVideoFrame::VIDEO_BUFFER_TEXTURE;
frame.format = VIDEO_TEXTURE_ID3D11TEXTURE2D;
HANDLE nt_handle = reinterpret_cast<HANDLE>(frame.d3d11Texture2d);
ComPtr<ID3D11Texture2D> opened_texture;
HRESULT hr = device1->OpenSharedResource1(
    nt_handle, IID_PPV_ARGS(&opened_texture));
frame.textureSliceIndex = 0;
frame.stride = width;
frame.height = height;
frame.timestamp = rtc_timestamp_ms;

media_engine->pushVideoFrame(&frame, video_track_id);
```

Native RTC SDK 必须实现以下行为：

1. Windows 支持 `setExternalVideoSource(true, true, VIDEO_FRAME)`。
2. 在这个临时包中，把 `d3d11Texture2d` 当作原始 NT Handle 数值，不能当作
   `HANDLE` 变量的地址，也不能当作 `ID3D11Texture2D*`。
3. 明确支持的 DXGI Format。Electron 链路至少需要 BGRA；RGBA 要么直接支持，
   要么明确拒绝，让 Electron Addon 在 GPU 上执行格式转换。
4. 色彩转换、缩放和向硬件编码输入 Surface 的传输全部保留在 GPU 上。
5. 使用纹理所属的 DXGI Adapter，或者定义跨 Adapter 回退方案，并为 Adapter
   不匹配返回明确错误。
6. 正确处理 D3D11 Device Lost 和纹理尺寸变化，不能继续持有失效资源。
7. 返回真实 RTC 提交结果；返回 `0` 表示 SDK 已按约定接受该纹理。
8. 把 `getCurrentMonotonicTimeInMs()` 取得的 `rtcTimestampMs` 原样设置为
   `ExternalVideoFrame::timestamp`。

### 生命周期与同步契约

在 Electron Addon 可以安全调用 `texture.release()` 之前，Native SDK 必须定义
清楚以下契约：

- SDK 必须在 `pushVideoFrame` 返回前调用 `OpenSharedResource1` 或复制借用的
  Handle，并在读取期间持有自己的 COM 引用。
- SDK 不能关闭 Electron 的原始 Handle。
- 打开或资源验证失败必须在同步调用内返回负数 RTC 结果，不能把帧误报为接受。
- 契约必须明确 Chromium 从什么时候开始可以复用源纹理。
- SDK 必须定义 Electron BGRA/RGBA 共享纹理的 GPU 同步方式；这个接口没有为
  这两种格式提供 keyed mutex。

第一阶段可以在 GPU 上 `CopyResource` 到 SDK 自己维护的纹理池。它不属于严格
意义上的完全零拷贝，但可以消除最昂贵的 GPU→CPU→GPU 往返，同时建立明确的
资源所有权边界。

### 直接 Handle 的兼容边界

复用 `d3d11Texture2d` 是 Electron 与 Native 团队之间的临时 PoC 约定，不是
该字段公开语义的永久修改。正式的直接 Handle API 应使用独立字段，并定义宽高、
DXGI Format、Texture Slice、Adapter 选择、同步和完成语义。

## Native 纹理支持完成后的迁移方式

这个开发包保持 Renderer 和 IPC 流程不变，并采用下面的 Electron 原生发送链路：

1. 使用 `setExternalVideoSource(true, true, ...)`。
2. 在 Iris 第 5 个 buffer 中原样传递 Electron NT Handle 数值。
3. Native SDK 在同步调用返回前打开并验证 Handle。
4. 不包含 `ReadTexturePixels`、staging texture、`Map` 或 CPU 像素 Vector。
5. 按 Native SDK 新定义的完成契约释放 Electron 纹理。

现有的帧背压、递增 Frame ID、错误透传、频道发布配置和停止清理逻辑可以保留。

## Native 纹理能力验收标准

以下条件全部满足后，才能认为 Native 纹理输入已经完成：

- 连续提交至少 300 个 D3D11 帧并全部返回成功。
- 编码帧计数和上行码率持续增长。
- 远端看到持续运动的画面，而不是停留在第一帧。
- 发送链路中不存在带 `CPU_ACCESS_READ` 的 staging texture、`Map` 或整帧 CPU
  像素复制。
- 持续运行时，源纹理不会被提前复用，也不会泄漏。
- Resize、加入期间停止、重复加入离开和 Device Lost 场景不崩溃、不残留旧帧。
- BGRA 行为、时间戳、Adapter 选择和纹理生命周期成为明确的 SDK 接口契约。

## 相关文件

- `example/src/main/sharedTexturePocController.js`
- `example/src/main/sharedTexturePocTelemetry.js`
- `example/extraResources/sharedTextureScene.html`
- `example/extraResources/sharedTextureSceneWorker.js`
- `source_code/agora_node_ext/agora_electron_bridge.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_preview.cpp`
- `source_code/agora_node_ext/shared_texture_request.cpp`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/AgoraMediaBase.h`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/IAgoraMediaEngine.h`

运行日志位于 `%LOCALAPPDATA%\Agora\electron`。

## Windows 测量矩阵

hidden、visible、minimized 分别在 30 和 60 fps 下至少运行十分钟。令
`T = 1000 / fps`，要求 `abs(P50 - T) / T <= 0.10`、`P99 < 3 * T`，且不存在
超过 500 ms 的无法解释停顿。Worker draw、paint、submission、编码帧、发送帧率
和码率必须持续增长，同时远端画面保持运动。

使用 `WEBGL_lose_context` 验证 context 恢复，使用
`forcefullyCrashRenderer()` 验证 renderer 的有界清理。这些测试和 GPU 子进程
退出都不能证明真实 D3D11 device removal。只有实际观察到
`DXGI_ERROR_DEVICE_REMOVED` 或 `DXGI_ERROR_DEVICE_RESET`，才能声称验证了
device-loss 恢复。
