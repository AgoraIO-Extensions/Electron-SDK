Agora Electron SDK 基于 Agora SDK for macOS 和 Agora SDK for Windiws，使用 Node.js C++ 插件开发，是一个为 Electron 平台用户服务的开源 SDK。 通过声网全球部署的虚拟网络，提供可以灵活搭配的 API 组合，在各平台提供质量可靠的实时音视频通信。

* AgoraRtcEngine 接口类包含应用程序调用的主要方法
* Events 接口类用于向应用程序发表事件回调通知

### 频道管理

| 方法                                 | 描述                                 |
| ------------------------------------ | ------------------------------------ |
| {@link initialize}                   | 初始化 AgoraRtcEngine 实例           |
| {@link release}                      | 释放 AgoraRtcEngine 实例             |
| {@link setChannelProfile}            | 设置频道模式                         |
| {@link setClientRole}                | 设置直播场景下的用户角色             |
| {@link joinChannel}                  | 加入频道                             |
| {@link leaveChanenl}                 | 离开频道                             |
| {@link subscribe}                    | 订阅指定用户的流                     |
| {@link renewToken}                   | 更新 Token                           |
| {@link enableWebSdkInteroperability} | 打开与 Agora Web SDK 的互通          |
| {@link getConnectionState}           | 获取网络连接状态                     |
| {@link on}                           | 监听 AgoraRtcEngine 运行时的事件     |
| {@link off}                          | 取消监听 AgoraRtcEngine 运行时的事件 |

### 音频管理

| 方法                                        | 描述                       |
| ------------------------------------------- | -------------------------- |
| {@link enableAudio}                         | 启用音频模块               |
| {@link disableAudio}                        | 关闭音频模块               |
| {@link setAudioProfile}                     | 设置音频编码配置           |
| {@link setHighQualityAudioParameters}       | 设置高音质参数配置         |
| {@link muteLocalAudioStream}                | 停止/恢复发送本地音频流    |
| {@link muteRemoteAudioStream}               | 停止/恢复接收指定音频流    |
| {@link muteAllRemoteAudioStreams}           | 停止/恢复接收所有音频流    |
| {@link setDefaultMuteAllRemoteAudioStreams} | 设置是否默认接收所有音频流 |
| {@link pauseAudio}                          |                            |

### 视频管理

| 方法                                        | 描述                       |
| ------------------------------------------- | -------------------------- |
| {@link enableVideo}                         | 启用视频模块               |
| {@link disableVideo}                        | 关闭视频模块               |
| {@link setVideoEncoderConfiguration}        | 设置视频编码配置           |
| {@link setupLocalVideo}                     | 设置本地视图               |
| {@link setupViewContentMode}                |                            |
| {@link setRenderMode}                       | 设置视图显示模式           |
| {@link startPreview}                        | 开启视频预览               |
| {@link stopPreview}                         | 停止视频预览               |
| {@link enableLocalVideo}                    | 开关本地视频采集           |
| {@link muteLocalVideoStream}                | 停止/恢复发送本地视频流    |
| {@link muteRemoteVideoStream}               | 停止/恢复接收指定视频流    |
| {@link muteAllRemoteVideoStreams}           | 停止/恢复接收所有视频流    |
| {@link setDefaultmuteAllRemoteVideoStreams} | 设置是否默认接收所有视频流 |

### 视频渲染

| 方法                                 | 描述 |
| ------------------------------------ | ---- |
| {@link initRender}                   |      |
| {@link destroyRender}                |      |
| {@link resizeRender}                 |      |
| {@link setVideoRenderDimension}      |      |
| {@link setVideoRenderFPS}            |      |
| {@link setVideoRenderHighFPS}        |      |
| {@link addVideoRenderToHighFPS}      |      |
| {@link remoteVideoRenderFromHighFPS} |      |

### 视频前处理及后处理

| 方法                           | 描述             |
| ------------------------------ | ---------------- |
| {@link setBeautyEffectOptions} | 设置美颜设置选项 |

### 屏幕共享

| 方法                              | 描述                  |
| --------------------------------- | --------------------- |
| {@link getScreenDisplaysInfo}     | 获取屏幕 Display Info |
| {@link getScreenWindowsInfo}      | 获取屏幕 Window Info  |
| {@link startScreenCapture}        | 开始屏幕共享          |
| {@link stopScreenCapture}         | 停止屏幕共享          |
| {@link startScreenCapturePreview} | 开始屏幕共享预览      |
| {@link stopScreenCapturePreview}  | 停止屏幕共享预览      |
| {@link updateScreenCaptureRegion} | 更新屏幕共享区域      |

### 音乐文件播放管理

| 方法                                   | 描述                       |
| -------------------------------------- | -------------------------- |
| {@link startAudioMixing}               | 开始播放音乐文件           |
| {@link stopAudioMixing}                | 停止播放音乐文件           |
| {@link pauseAudioMixing}               | 暂停播放音乐文件           |
| {@link resumeAudioMixing}              | 恢复播放音乐文件           |
| {@link adjustAudioMixingVolume}        | 调节音乐文件的播放音量     |
| {@link adjustAudioMixingPlayoutVolume} | 调节音乐文件的本地播放音量 |
| {@link adjustAudioMixingPublishVolume} | 调节音乐文件的远端播放音量 |
| {@link getAudioMxingDuration}          | 获取音乐文件的播放时长     |
| {@link getAudioMixingCurrentPosition}  | 获取音乐文件的播放进度     |
| {@link setAudioMixingPosition}         | 设置音乐文件的播放位置     |

### 音效文件播放管理

| 方法                      | 描述                           |
| ------------------------- | ------------------------------ |
| {@link getEffectsVolume}  | 获取音效文件的播放音量         |
| {@link setEffectsVolume}  | 设置音效文件的播放音量         |
| {@link setVolumeOfEffect} | 设置单个音效文件的播放音量     |
| {@link playEffect}        | 播放指定的音效文件             |
| {@link stopEffect}        | 停止播放指定的音效文件         |
| {@link preloadEffect}     | 将音效文件预加载至内存         |
| {@link unloadEffect}      | 从内存释放某个预加载的音效文件 |
| {@link pauseEffect}       | 暂停播放指定的音效文件         |
| {@link pauseAllEffects}   | 暂停播放所有音效文件           |
| {@link resumeEffect}      | 恢复播放指定的音效文件         |
| {@link resumeAllEffects}  | 恢复播放所有音效文件           |

### 变声与混响

| 方法                              | 描述                       |
| --------------------------------- | -------------------------- |
| {@link setLocalVoiceChanger}      | 设置本地语音变声           |
| {@link setLocalVoiceReverbPreset} | 设置预设的本地语音混响效果 |
| {@link setLocalVoicePitch}        | 设置本地语音音调           |
| {@link setLocalVoiceEqualization} | 设置本地语音音效均衡       |
| {@link setLocalVoiceReverb}       | 设置本地语音混响           |

### 听声辨位

| 方法                                  | 描述                          |
| ------------------------------------- | ----------------------------- |
| {@link enableSoundPositionIndication} | 开启/关闭远端用户的语音立体声 |
| {@link setRemoteVoicePosition}        | 设置远端用户的语音位置        |

### CDN 推流

| 方法                           | 描述             |
| ------------------------------ | ---------------- |
| {@link setLiveTranscoding}     | 设置直播转码配置 |
| {@link addPublishStreamUrl}    | 增加旁路推流地址 |
| {@link removePublishStreamUrl} | 删除旁路推流地址 |

### 音量提示

| 方法                                | 描述               |
| ----------------------------------- | ------------------ |
| {@link enableAudioVolumeIndication} | 启用说话者音量提示 |

### 耳返控制

| 方法                             | 描述         |
| -------------------------------- | ------------ |
| {@link setInEarMonitoringVolume} | 设置耳返音量 |

### 视频双流模式

| 方法                                    | 描述                     |
| --------------------------------------- | ------------------------ |
| {@link enableDualStreamMode}            | 开启视频双流模式         |
| {@link setRemoteVideoStreamType}        | 设置订阅的视频流类型     |
| {@link setRemoteDefaultVideoStreamType} | 设置默认订阅的视频流类型 |

### 直播音视频回退

| 方法                                     | 描述                                 |
| ---------------------------------------- | ------------------------------------ |
| {@link setLocalPublishFallbackOption}    | 设置弱网条件下发布的音视频流回退选项 |
| {@link setRemoteSubscribeFallbackOption} | 设置弱网条件下订阅的音视频流回退选项 |
| {@link setRemoteUserPriority}            | 设置用户媒体流的优先级               |

### 通话前网络测试

| 方法                              | 描述                                             |
| --------------------------------- | ------------------------------------------------ |
| {@link startEchoTest}             | 开始语音通话回路测试                             |
| {@link startEchoTestWithInterval} | 开始语音通话回路测试，并根据间隔时间返回测试结果 |
| {@link stopEchoTest}              | 停止语音通话回路测试                             |
| {@link enableLastmileTest}        | 启用网络测试                                     |
| {@link disableLastmileTest}       | 关闭网络测试                                     |
| {@link startLastmileProbeTest}    | 开始通话前网络质量探测                           |
| {@link stopLastmileProbeTest}     | 停止通话前网络质量探测                           |

### 音频自采集（仅 Push 模式）

| 方法                           | 描述                 |
| ------------------------------ | -------------------- |
| {@link setExternalAudioSource} | 设置外部音频采集参数 |

### 原始音频数据

| 方法                                     | 描述                               |
| ---------------------------------------- | ---------------------------------- |
| {@link setRecordingAudioFrameParameters} | 设置录制的声音格式                 |
| {@link setPlaybackAudioFrameParameters}  | 设置播放的声音格式                 |
| {@link setMixedAudioFrameParameters}     | 设置录制与播放声音混音后的数据格式 |

### 加密

| 方法                        | 描述                         |
| --------------------------- | ---------------------------- |
| {@link setEncryptionSecret} | 启用内置加密，并设置加密密码 |

### 音频录制

| 方法                            | 描述         |
| ------------------------------- | ------------ |
| {@link setAudioRecordingVolume} | 设置录音音量 |
| {@link getAudioRecordingVolume} | 获取录音音量 |

### 直播导入在线媒体流

| 方法                          | 描述                 |
| ----------------------------- | -------------------- |
| {@link addInjectStreamUrl}    | 导入在线媒体流 URL   |
| {@link removeInjectStreamUrl} | 删除导入的在线媒体流 |

### 设备管理

| 方法                                   | 描述                       |
| -------------------------------------- | -------------------------- |
| {@link setAudioPlaybackDevice}         | 设置音频播放设备           |
| {@link getAudioPlaybackDevices}        | 获取音频播放设备           |
| {@link setAudioRecordingDevice}        | 设置音频录制设备           |
| {@link getAudioRecordingDevices}       | 获取音频录制设备           |
| {@link setVideoDevice}                 | 设置视频设备               |
| {@link getVideoDevices}                | 获取视频设备               |
| {@link setAudioPlaybackDeviceMute}     | 设置音频播放设备静音       |
| {@link getAudioPlaybackDeviceMute}     | 获取音频播放设备静音状态   |
| {@link setAudioRecordingDeviceMute}    | 设置音频录制设备静音       |
| {@link getAudioRecordingDeviceMute}    | 获取音频录制 设备静音状态  |
| {@link getPlaybackDeviceInfo}          | 获取播放设备 Info          |
| {@link getRecordingDeviceInfo}         | 获取录制设备 Info          |
| {@link getCurrentAudioPlaybackDevice}  | 获取当前正在播放的音频设备 |
| {@link getCurrentAudioRecordingDevice} | 获取当前正在录制的音频设备 |
| {@link getCurrentVideoDevice}          | 获取当前的视频设备         |
| {@link startAudioDeviceLoopbackTest}   | 开始音频设备回路测试       |
| {@link stopAudioDeviceLoopbackTest}    | 停止音频设备回路测试       |
| {@link startAudioPlaybackDeviceTest}   | 开始音频播放设备测试       |
| {@link stopAudioPlaybackDeviceTest}    | 停止音频播放设备测试       |
| {@link startAudioRecordingDeviceTest}  | 开始音频录制设备测试       |
| {@link stopAudioRecordingDeviceTest}   | 停止音频录制设备测试       |
| {@link startVideoDeviceTest}           | 开始视频设备测试           |
| {@link stopVideoDeviceTest}            | 停止视频设备测试           |

### 流消息

| 方法                      | 描述       |
| ------------------------- | ---------- |
| {@link createDataStream}  | 创建数据流 |
| {@link sendStreamMessage} | 发送数据流 |

### 其他音频控制

| 方法                            | 描述         |
| ------------------------------- | ------------ |
| {@link enableLoopbackRecording} | 开启声卡采集 |

### 其他视频控制

| 方法                                   | 描述                 |
| -------------------------------------- | -------------------- |
| {@link setLocalVideoMirrorMode}        | 设置本地视频镜像模式 |
| {@link setCameraCapturerConfiguration} | 设置摄像头的采集偏好 |

### 其他方法

| 方法                        | 描述               |
| --------------------------- | ------------------ |
| {@link getCallId}           | 获取通话 ID        |
| {@link rate}                | 给通话评分         |
| {@link complain}            | 投诉通话质量       |
| {@link setLogFile}          | 设置日志文件       |
| {@link getVersion}          | 查询 SDK 版本号    |
| {@link getErrorDescription} | 获取警告或错误描述 |
| {@link convertPath}         |                    |

### 定制方法

| 方法                  | 描述 |
| --------------------- | ---- |
| {@link setParameters} |      |
| {@link setBool}       |      |
| {@link setInt}        |      |
| {@link setNumber}     |      |
| {@link setObject}     |      |
| {@link setString}     |      |
| {@link setUInt}       |      |
| {@link getArray}      |      |
| {@link getBool}       |      |
| {@link getInt}        |      |
| {@link getInt}        |      |
| {@link getNumber}     |      |
| {@link getObject}     |      |
| {@link getString}     |      |
| {@link getUInt}       |      |

### 双实例方法

Agora Electron SDK 提供双实例的实现方法。第二个实例请调用下表中的方法实现对应功能。

| 方法                                              | 描述                        |
| ------------------------------------------------- | --------------------------- |
| {@link videoSourceInitialize}                     | 初始化 AgoraRtcEngine 实例  |
| {@link videoSourceRelease}                        | 释放 AgoraRtcEngine 实例    |
| {@link videoSourceSetChannelProfile}              | 设置频道模式                |
| {@link videoSourceJoin}                           | 加入频道                    |
| {@link videoSourceLeave}                          | 离开频道                    |
| {@link RenewToken}                                | 更新 Token                  |
| {@link videoSourceEnableWebSdkInteroperability}   | 打开与 Agora Web SDK 的互通 |
| {@link setupLocalVideoSource}                     | 设置本地视图                |
| {@link videoSourceSetVideoProfile}                | 设置视频编码配置            |
| {@link startScreenCapture1}                       | 开始屏幕共享                |
| {@link stopScreenCapture1}                        | 停止屏幕共享                |
| {@link videoSourceUpdateScreenCaptureRegion}      | 更新屏幕共享区域            |
| {@link videosourceUpdateScreenCaptureParameters}  | 更新屏幕共享编码配置        |
| {@link videosourceSetScreenCaptureContentHint}    | 设置屏幕共享内容类型        |
| {@link videosourceStartScreenCaptureByScreenRect} | 根据 Screen Rect 共享屏幕   |
| {@link videosourceStartScreenCaptureByWindow}     | 根据 Window 共享窗口        |
| {@link videoSourceEnableDualStreamMode}           | 开启视频双流模式            |
| {@link videoSourceSetLogFile}                     | 设置日志文件                |
| {@link videoSourceSetParameters}                  | 启用定制功能                |

