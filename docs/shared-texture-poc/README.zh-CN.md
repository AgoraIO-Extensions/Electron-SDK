# Electron Shared Texture 视频发布 PoC

[English](./README.md)

## 当前状态

这个 PoC 已经可以在 Windows 上把 Electron 离屏渲染的画面发布到 Agora
频道。这个开发包版本恢复了直接传递 `ID3D11Texture2D*` 的链路，用于 Native
RTC SDK 同事验证新的 D3D11 纹理输入实现。远端画面是否正常是 Native SDK
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
5. Node 原生扩展验证帧参数，查找匹配的 DXGI Adapter，并通过
   `ID3D11Device1::OpenSharedResource1` 打开共享 Handle。
6. 打开纹理后会验证尺寸、DXGI Format 和
   `D3D11_RESOURCE_MISC_SHARED_NTHANDLE` 标记。
7. Addon 在同步 Iris 调用期间，把打开后的 `ID3D11Texture2D*` 放入第 5 个
   buffer，作为 D3D11 Texture Frame 推给 RTC SDK；不创建 staging texture，
   不执行 CPU Map 或整帧拷贝。
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
  -> ID3D11Texture2D
  -> Iris 第 5 个 buffer 中的 ID3D11Texture2D*
  -> RTC SDK
  -> 编码器
```

这个 PoC 当前不包含以下能力：

- Native RTC SDK 直接消费 Electron NT Handle
- 端到端零拷贝编码
- 在 GPU 上完成 BGRA/RGBA 到 NV12 的转换
- 跨帧复用 D3D11 Device、Adapter 或纹理池
- NV12、P010、多平面纹理或非 Windows 共享纹理支持
- 自动化远端画面内容校验

Addon 仍然会逐帧枚举 Adapter 并创建 D3D11 Device。这个开发包用于验证 Native
SDK 的纹理契约，不是最终的 Device 或 Texture Pool 性能优化版本。

Electron `HANDLE` 只被借用，Addon 不会关闭它。`OpenSharedResource1` 创建由
Addon 持有的 COM 引用，该引用覆盖同步 `CallIrisApi` 调用；调用返回后释放 COM
引用，随后 JavaScript 控制器只调用一次 Electron `texture.release()`。如果
Native SDK 异步消费纹理，必须在返回前自行持有或复制资源。

## 当前 Native SDK 为什么不能直接使用纹理

随包 Native SDK 的头文件已经预留了接口结构：

- `ExternalVideoFrame::VIDEO_BUFFER_TEXTURE`，值为 `3`
- `VIDEO_TEXTURE_ID3D11TEXTURE2D`，值为 `17`
- `ExternalVideoFrame::d3d11Texture2d`
- `ExternalVideoFrame::textureSliceIndex`

此前随包 Native SDK 在这条链路上返回 RTC 错误 `-2`。这个开发包会明确启用
`useTexture=true` 并恢复直接指针调用，供 Native 同事使用已经实现下面契约的
Native SDK 进行验证。

## Native RTC SDK 需要修改的部分

推荐的最小改动是实现现有 `ExternalVideoFrame` 的 Windows D3D11 契约。
Electron Addon 继续打开 NT Handle，然后向 SDK 传递同一进程内的 COM 指针：

```cpp
ExternalVideoFrame frame;
frame.type = ExternalVideoFrame::VIDEO_BUFFER_TEXTURE;
frame.format = VIDEO_TEXTURE_ID3D11TEXTURE2D;
frame.d3d11Texture2d = opened_texture.Get();
frame.textureSliceIndex = 0;
frame.stride = width;
frame.height = height;
frame.timestamp = 0;

media_engine->pushVideoFrame(&frame, video_track_id);
```

Native RTC SDK 必须实现以下行为：

1. Windows 支持 `setExternalVideoSource(true, true, VIDEO_FRAME)`。
2. `pushVideoFrame` 接受 `VIDEO_BUFFER_TEXTURE`、
   `VIDEO_TEXTURE_ID3D11TEXTURE2D` 和有效的 `ID3D11Texture2D*`。
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

- SDK 在读取资源期间必须对 `ID3D11Texture2D` 执行 `AddRef` 并持有它，或者在
  `pushVideoFrame` 返回前把内容同步排入或复制到 SDK 自己的纹理。
- 如果 SDK 异步消费纹理，并且方法返回时源纹理还不能释放，SDK 必须提供完成
  回调或 Release Token。
- 契约必须明确 Chromium 从什么时候开始可以复用源纹理。
- SDK 必须定义 Electron BGRA/RGBA 共享纹理的 GPU 同步方式；这个接口没有为
  这两种格式提供 keyed mutex。

第一阶段可以在 GPU 上 `CopyResource` 到 SDK 自己维护的纹理池。它不属于严格
意义上的完全零拷贝，但可以消除最昂贵的 GPU→CPU→GPU 往返，同时建立明确的
资源所有权边界。

### 可选的直接 Handle 接口

Native RTC SDK 也可以选择直接接收 NT Handle。这样的接口不能只有 Handle，
还应包含宽高、DXGI Format、Texture Slice、Adapter LUID、时间戳以及完成或释放
契约。SDK 随后在兼容的 D3D11 Device 上自行调用 `OpenSharedResource1`。

通过已经存在的 `d3d11Texture2d` 字段传 `ID3D11Texture2D*`，API 改动更小。
直接传 NT Handle 可以让 Device 选择和资源所有权全部归 RTC SDK 管理，但会
增加一个 Windows 专用的公开接口契约。

## Native 纹理支持完成后的迁移方式

这个开发包保持 Renderer 和 IPC 流程不变，并采用下面的 Electron 原生发送链路：

1. 使用 `setExternalVideoSource(true, true, ...)`。
2. 如果 SDK 没有提供直接 Handle API，Addon 继续负责打开并验证 Electron NT
   Handle。
3. 使用 `VIDEO_BUFFER_TEXTURE`、`VIDEO_TEXTURE_ID3D11TEXTURE2D` 和打开后的
   纹理指针提交帧。
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
