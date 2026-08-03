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
3. 隐藏的离屏 `BrowserWindow` 使用 `offscreen.useSharedTexture: true`
   持续渲染动态测试画面。
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

RTC 帧时间戳目前固定传 `0`。Electron 提供的是相对采集进程的时间，而 RTC
链路需要自己的对齐时间基准。让 SDK 自动设置时间戳可以避免后续帧被当作旧帧
丢弃。

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
frame.timestamp = 0;

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
- `example/extraResources/sharedTextureScene.html`
- `source_code/agora_node_ext/agora_electron_bridge.cpp`
- `source_code/agora_node_ext/d3d11_shared_texture_importer.cpp`
- `source_code/agora_node_ext/shared_texture_request.cpp`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/AgoraMediaBase.h`
- `native/Agora_Native_SDK_for_Windows_FULL/sdk/high_level_api/include/IAgoraMediaEngine.h`

运行日志位于 `%LOCALAPPDATA%\Agora\electron`。
