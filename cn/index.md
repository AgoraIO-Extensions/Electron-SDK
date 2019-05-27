Agora Electron SDK 基于 Agora SDK for macOS 和 Agora SDK for Windiws，使用 Node.js C++ 插件开发，是一个为 Electron 平台用户服务的开源 SDK。 通过声网全球部署的虚拟网络，提供可以灵活搭配的 API 组合，在各平台提供质量可靠的实时音视频通信。

* AgoraRtcEngine 接口类包含应用程序调用的主要方法
* Events 接口类用于向应用程序发表事件回调通知

### 频道管理

| 方法                                                         | 描述                                 |
| ------------------------------------------------------------ | ------------------------------------ |
| {@link AgoraRtcEngine.initialize initialize}                 | 初始化 AgoraRtcEngine 实例           |
| {@link AgoraRtcEngine.release release}                       | 释放 AgoraRtcEngine 实例             |
| {@link AgoraRtcEngine.setChannelProfile setChannelProfile}   | 设置频道模式                         |
| {@link AgoraRtcEngine.setClientRole setClientRole}           | 设置直播场景下的用户角色             |
| {@link AgoraRtcEngine.joinChannel joinChannel}               | 加入频道                             |
| {@link AgoraRtcEngine.leaveChannel leaveChannel}             | 离开频道                             |
| {@link AgoraRtcEngine.subscribe subscribe}                   | 订阅指定用户的流                     |
| {@link AgoraRtcEngine.renewToken renewToken}                 | 更新 Token                           |
| {@link AgoraRtcEngine.enableWebSdkInteroperability enableWebSdkInteroperability} | 打开与 Agora Web SDK 的互通          |
| {@link AgoraRtcEngine.getConnectionState getConnectionState} | 获取网络连接状态                     |
| {@link AgoraRtcEngine.on on}                                 | 监听 AgoraRtcEngine 运行时的事件     |
| {@link AgoraRtcEngine.off off}                               | 取消监听 AgoraRtcEngine 运行时的事件 |

### 音频管理

| 方法                                                         | 描述                       |
| ------------------------------------------------------------ | -------------------------- |
| {@link AgoraRtcEngine.enableAudio enableAudio}               | 启用音频模块               |
| {@link AgoraRtcEngine.disableAudio disableAudio}             | 关闭音频模块               |
| {@link AgoraRtcEngine.setAudioProfile setAudioProfile}       | 设置音频编码配置           |
| {@link AgoraRtcEngine.setHighQualityAudioParameters setHighQualityAudioParameters} | 设置高音质参数配置         |
| {@link AgoraRtcEngine.pauseAudio pauseAudio}                 |                            |
| {@link AgoraRtcEngine.muteLocalAudioStream muteLocalAudioStream} | 停止/恢复发送本地音频流    |
| {@link AgoraRtcEngine.muteRemoteAudioStream muteRemoteAudioStream} | 停止/恢复接收指定音频流    |
| {@link AgoraRtcEngine.muteAllRemoteAudioStreams muteAllRemoteAudioStreams} | 停止/恢复接收所有音频流    |
| {@link AgoraRtcEngine.setDefaultMuteAllRemoteAudioStreams setDefaultMuteAllRemoteAudioStreams} | 设置是否默认接收所有音频流 |

### 视频管理

| 方法                                                         | 描述                       |
| ------------------------------------------------------------ | -------------------------- |
| {@link AgoraRtcEngine.enableVideo enableVideo}               | 启用视频模块               |
| {@link AgoraRtcEngine.disableVideo disableVideo}             | 关闭视频模块               |
| {@link AgoraRtcEngine.setVideoEncoderConfiguration setVideoEncoderConfiguration} | 设置视频编码配置           |
| {@link AgoraRtcEngine.setupLocalVideo setupLocalVideo}       | 设置本地视图               |
| {@link AgoraRtcEngine.setupViewContentMode setupViewContentMode} |                            |
| {@link AgoraRtcEngine.setRenderMode setRenderMode}           | 设置视图显示模式           |
| {@link AgoraRtcEngine.startPreview startPreview}             | 开启视频预览               |
| {@link AgoraRtcEngine.stopPreview stopPreview}               | 停止视频预览               |
| {@link AgoraRtcEngine.enableLocalVideo enableLocalVideo}     | 开关本地视频采集           |
| {@link AgoraRtcEngine.muteLocalVideoStream muteLocalVideoStream} | 停止/恢复发送本地视频流    |
| {@link AgoraRtcEngine.muteRemoteVideoStream muteRemoteVideoStream} | 停止/恢复接收指定视频流    |
| {@link AgoraRtcEngine.muteAllRemoteVideoStreams muteAllRemoteVideoStreams} | 停止/恢复接收所有视频流    |
| {@link AgoraRtcEngine.setDefaultMuteAllRemoteVideoStreams setDefaultMuteAllRemoteVideoStreams} | 设置是否默认接收所有视频流 |

### 视频渲染

| 方法                                                         | 描述 |
| ------------------------------------------------------------ | ---- |
| {@link AgoraRtcEngine.initRender initRender}                 |      |
| {@link AgoraRtcEngine.destroyRender destroyRender}           |      |
| {@link AgoraRtcEngine.resizeRender resizeRender}             |      |
| {@link AgoraRtcEngine.setVideoRenderDimension setVideoRenderDimension} |      |
| {@link AgoraRtcEngine.setVideoRenderFPS setVideoRenderFPS}   |      |
| {@link AgoraRtcEngine.setVideoRenderHighFPS setVideoRenderHighFPS} |      |
| {@link AgoraRtcEngine.addVideoRenderToHighFPS addVideoRenderToHighFPS} |      |
| {@link AgoraRtcEngine.removeVideoRenderFromHighFPS  removeVideoRenderFromHighFPS} |      |

### 视频前处理及后处理

| 方法                                                         | 描述             |
| ------------------------------------------------------------ | ---------------- |
| {@link AgoraRtcEngine.setBeautyEffectOptions setBeautyEffectOptions} | 设置美颜设置选项 |

### 屏幕共享

| 方法                                                         | 描述                  |
| ------------------------------------------------------------ | --------------------- |
| {@link AgoraRtcEngine.getScreenDisplaysInfo getScreenDisplaysInfo} | 获取屏幕 Display Info |
| {@link AgoraRtcEngine.getScreenWindowsInfo getScreenWindowsInfo} | 获取屏幕 Window Info  |
| {@link AgoraRtcEngine.startScreenCapture startScreenCapture} | 开始屏幕共享          |
| {@link AgoraRtcEngine.stopScreenCapture stopScreenCapture}   | 停止屏幕共享          |
| {@link AgoraRtcEngine.startScreenCapturePreview startScreenCapturePreview} | 开始屏幕共享预览      |
| {@link AgoraRtcEngine.stopScreenCapturePreview stopScreenCapturePreview} | 停止屏幕共享预览      |
| {@link AgoraRtcEngine.updateScreenCaptureRegion updateScreenCaptureRegion} | 更新屏幕共享区域      |

### 音乐文件播放管理

| 方法                                                         | 描述                       |
| ------------------------------------------------------------ | -------------------------- |
| {@link AgoraRtcEngine.startAudioMixing startAudioMixing}     | 开始播放音乐文件           |
| {@link AgoraRtcEngine.stopAudioMixing stopAudioMixing}       | 停止播放音乐文件           |
| {@link AgoraRtcEngine.pauseAudioMixing pauseAudioMixing}     | 暂停播放音乐文件           |
| {@link AgoraRtcEngine.resumeAudioMixing resumeAudioMixing}   | 恢复播放音乐文件           |
| {@link AgoraRtcEngine.adjustAudioMixingVolume adjustAudioMixingVolume} | 调节音乐文件的播放音量     |
| {@link AgoraRtcEngine.adjustAudioMixingPlayoutVolume adjustAudioMixingPlayoutVolume} | 调节音乐文件的本地播放音量 |
| {@link AgoraRtcEngine.adjustAudioMixingPublishVolume adjustAudioMixingPublishVolume} | 调节音乐文件的远端播放音量 |
| {@link AgoraRtcEngine.getAudioMixingDuration getAudioMixingDuration} | 获取音乐文件的播放时长     |
| {@link AgoraRtcEngine.getAudioMixingCurrentPosition getAudioMixingCurrentPosition} | 获取音乐文件的播放进度     |
| {@link AgoraRtcEngine.setAudioMixingPosition setAudioMixingPosition} | 设置音乐文件的播放位置     |

### 音效文件播放管理

| 方法                                                       | 描述                           |
| ---------------------------------------------------------- | ------------------------------ |
| {@link AgoraRtcEngine.getEffectsVolume getEffectsVolume}   | 获取音效文件的播放音量         |
| {@link AgoraRtcEngine.setEffectsVolume setEffectsVolume}   | 设置音效文件的播放音量         |
| {@link AgoraRtcEngine.setVolumeOfEffect setVolumeOfEffect} | 设置单个音效文件的播放音量     |
| {@link AgoraRtcEngine.playEffect playEffect}               | 播放指定的音效文件             |
| {@link AgoraRtcEngine.stopEffect stopEffect}               | 停止播放指定的音效文件         |
| {@link AgoraRtcEngine.preloadEffect preloadEffect}         | 将音效文件预加载至内存         |
| {@link AgoraRtcEngine.unloadEffect unloadEffect}           | 从内存释放某个预加载的音效文件 |
| {@link AgoraRtcEngine.pauseEffect pauseEffect}             | 暂停播放指定的音效文件         |
| {@link AgoraRtcEngine.pauseAllEffects pauseAllEffects}     | 暂停播放所有音效文件           |
| {@link AgoraRtcEngine.resumeEffect resumeEffect}           | 恢复播放指定的音效文件         |
| {@link AgoraRtcEngine.resumeAllEffects resumeAllEffects}   | 恢复播放所有音效文件           |

### 变声与混响

| 方法                                                         | 描述                       |
| ------------------------------------------------------------ | -------------------------- |
| {@link AgoraRtcEngine.setLocalVoiceChanger setLocalVoiceChanger} | 设置本地语音变声           |
| {@link AgoraRtcEngine.setLocalVoiceReverbPreset setLocalVoiceReverbPreset} | 设置预设的本地语音混响效果 |
| {@link AgoraRtcEngine.setLocalVoicePitch setLocalVoicePitch} | 设置本地语音音调           |
| {@link AgoraRtcEngine.setLocalVoiceEqualization setLocalVoiceEqualization} | 设置本地语音音效均衡       |
| {@link AgoraRtcEngine.setLocalVoiceReverb setLocalVoiceReverb} | 设置本地语音混响           |

### 听声辨位

| 方法                                                         | 描述                          |
| ------------------------------------------------------------ | ----------------------------- |
| {@link AgoraRtcEngine.enableSoundPositionIndication enableSoundPositionIndication} | 开启/关闭远端用户的语音立体声 |
| {@link AgoraRtcEngine.setRemoteVoicePosition setRemoteVoicePosition} | 设置远端用户的语音位置        |

### CDN 推流

| 方法                                                         | 描述             |
| ------------------------------------------------------------ | ---------------- |
| {@link AgoraRtcEngine.setLiveTranscoding setLiveTranscoding} | 设置直播转码配置 |
| {@link AgoraRtcEngine.addPublishStreamUrl addPublishStreamUrl} | 增加旁路推流地址 |
| {@link AgoraRtcEngine.removePublishStreamUrl removePublishStreamUrl} | 删除旁路推流地址 |

### 音量提示

| 方法                                                         | 描述               |
| ------------------------------------------------------------ | ------------------ |
| {@link AgoraRtcEngine.enableAudioVolumeIndication enableAudioVolumeIndication} | 启用说话者音量提示 |

### 耳返控制

| 方法                                                         | 描述         |
| ------------------------------------------------------------ | ------------ |
| {@link AgoraRtcEngine.setInEarMonitoringVolume setInEarMonitoringVolume} | 设置耳返音量 |

### 视频双流模式

| 方法                                                         | 描述                     |
| ------------------------------------------------------------ | ------------------------ |
| {@link AgoraRtcEngine.enableDualStreamMode enableDualStreamMode} | 开启视频双流模式         |
| {@link AgoraRtcEngine.setRemoteVideoStreamType setRemoteVideoStreamType} | 设置订阅的视频流类型     |
| {@link AgoraRtcEngine.setRemoteDefaultVideoStreamType setRemoteDefaultVideoStreamType} | 设置默认订阅的视频流类型 |

### 直播音视频回退

| 方法                                                         | 描述                                 |
| ------------------------------------------------------------ | ------------------------------------ |
| {@link AgoraRtcEngine.setLocalPublishFallbackOption setLocalPublishFallbackOption} | 设置弱网条件下发布的音视频流回退选项 |
| {@link AgoraRtcEngine.setRemoteSubscribeFallbackOption setRemoteSubscribeFallbackOption} | 设置弱网条件下订阅的音视频流回退选项 |
| {@link AgoraRtcEngine.setRemoteUserPriority setRemoteUserPriority} | 设置用户媒体流的优先级               |

### 通话前网络测试

| 方法                                                         | 描述                                             |
| ------------------------------------------------------------ | ------------------------------------------------ |
| {@link AgoraRtcEngine.startEchoTest startEchoTest}           | 开始语音通话回路测试                             |
| {@link AgoraRtcEngine.startEchoTestWithInterval startEchoTestWithInterval} | 开始语音通话回路测试，并根据间隔时间返回测试结果 |
| {@link AgoraRtcEngine.stopEchoTest stopEchoTest}             | 停止语音通话回路测试                             |
| {@link AgoraRtcEngine.enableLastmileTest enableLastmileTest} | 启用网络测试                                     |
| {@link AgoraRtcEngine.disableLastmileTest disableLastmileTest} | 关闭网络测试                                     |
| {@link AgoraRtcEngine.startLastmileProbeTest startLastmileProbeTest} | 开始通话前网络质量探测                           |
| {@link AgoraRtcEngine.stopLastmileProbeTest stopLastmileProbeTest} | 停止通话前网络质量探测                           |

### 音频自采集（仅 Push 模式）

| 方法                                                         | 描述                 |
| ------------------------------------------------------------ | -------------------- |
| {@link AgoraRtcEngine.setExternalAudioSource setExternalAudioSource} | 设置外部音频采集参数 |

### 原始音频数据

| 方法                                                         | 描述                               |
| ------------------------------------------------------------ | ---------------------------------- |
| {@link AgoraRtcEngine.setRecordingAudioFrameParameters setRecordingAudioFrameParameters} | 设置录制的声音格式                 |
| {@link AgoraRtcEngine.setPlaybackAudioFrameParameters setPlaybackAudioFrameParameters} | 设置播放的声音格式                 |
| {@link AgoraRtcEngine.setMixedAudioFrameParameters setMixeAudioFrameParameters} | 设置录制与播放声音混音后的数据格式 |

### 加密

| 方法                                                         | 描述                         |
| ------------------------------------------------------------ | ---------------------------- |
| {@link AgoraRtcEngine.setEncryptionSecret setEncryptionSecret} | 启用内置加密，并设置加密密码 |

### 音频录制

| 方法                                                         | 描述         |
| ------------------------------------------------------------ | ------------ |
| {@link AgoraRtcEngine.setAudioRecordingVolume setAudioRecordingVolume} | 设置录音音量 |
| {@link AgoraRtcEngine.getAudioRecordingVolume getAudioRecordingVolume} | 获取录音音量 |

### 直播导入在线媒体流

| 方法                                                         | 描述                 |
| ------------------------------------------------------------ | -------------------- |
| {@link AgoraRtcEngine.addInjectStreamUrl addInjectStreamUrl} | 导入在线媒体流 URL   |
| {@link AgoraRtcEngine.removeInjectStreamUrl removeInjectStreamUrl} | 删除导入的在线媒体流 |

### 设备管理

| 方法                                                         | 描述                       |
| ------------------------------------------------------------ | -------------------------- |
| {@link AgoraRtcEngine.setAudioPlaybackDevice setAudioPlaybackDevice} | 设置音频播放设备           |
| {@link AgoraRtcEngine.getAudioPlaybackDevices getAudioPlaybackDevices} | 获取音频播放设备           |
| {@link AgoraRtcEngine.setAudioRecordingDevice setAudioRecordingDevice} | 设置音频录制设备           |
| {@link AgoraRtcEngine.getAudioRecordingDevices getAudioRecordingDevices} | 获取音频录制设备           |
| {@link AgoraRtcEngine.setVideoDevice setVideoDevice}         | 设置视频设备               |
| {@link AgoraRtcEngine.getVideoDevices getVideoDevices}       | 获取视频设备               |
| {@link AgoraRtcEngine.setAudioPlaybackDeviceMute setAudioPlaybackDeviceMute} | 设置音频播放设备静音       |
| {@link AgoraRtcEngine.getAudioPlaybackDeviceMute getAudioPlaybackDeviceMute} | 获取音频播放设备静音状态   |
| {@link AgoraRtcEngine.setAudioRecordingDeviceMute setAudioRecordingDeviceMute} | 设置音频录制设备静音       |
| {@link AgoraRtcEngine.getAudioRecordingDeviceMute getAudioRecordingDeviceMute} | 获取音频录制 设备静音状态  |
| {@link AgoraRtcEngine.getPlaybackDeviceInfo getPlaybackDeviceInfo} | 获取播放设备 Info          |
| {@link AgoraRtcEngine.getRecordingDeviceInfo getRecordingDeviceInfo} | 获取录制设备 Info          |
| {@link AgoraRtcEngine.getCurrentAudioPlaybackDevice getCurrentAudioPlaybackDevice} | 获取当前正在播放的音频设备 |
| {@link AgoraRtcEngine.getCurrentAudioRecordingDevice getCurrentAudioRecordingDevice} | 获取当前正在录制的音频设备 |
| {@link AgoraRtcEngine.getCurrentVideoDevice getCurrentVideoDevice} | 获取当前的视频设备         |
| {@link AgoraRtcEngine.startAudioDeviceLoopbackTest startAudioDeviceLoopbackTest} | 开始音频设备回路测试       |
| {@link AgoraRtcEngine.stopAudioDeviceLoopbackTest stopAudioDeviceLoopbackTest} | 停止音频设备回路测试       |
| {@link AgoraRtcEngine.startAudioPlaybackDeviceTest startAudioPlaybackDeviceTest} | 开始音频播放设备测试       |
| {@link AgoraRtcEngine.stopAudioPlaybackDeviceTest stopAudioPlaybackDeviceTest} | 停止音频播放设备测试       |
| {@link AgoraRtcEngine.startAudioRecordingDeviceTest startAudioRecordingDeviceTest} | 开始音频录制设备测试       |
| {@link AgoraRtcEngine.stopAudioRecordingDeviceTest stopAudioRecordingDeviceTest} | 停止音频录制设备测试       |
| {@link AgoraRtcEngine.startVideoDeviceTest startVideoDeviceTest} | 开始视频设备测试           |
| {@link AgoraRtcEngine.stopVideoDeviceTest stopVideoDeviceTest} | 停止视频设备测试           |

### 流消息

| 方法                                                       | 描述       |
| ---------------------------------------------------------- | ---------- |
| {@link AgoraRtcEngine.createDataStream createDataStream}   | 创建数据流 |
| {@link AgoraRtcEngine.sendStreamMessage sendStreamMessage} | 发送数据流 |

### 其他音频控制

| 方法                                                         | 描述         |
| ------------------------------------------------------------ | ------------ |
| {@link AgoraRtcEngine.enableLoopbackRecording enableLoopbackRecording} | 开启声卡采集 |

### 其他视频控制

| 方法                                                         | 描述                 |
| ------------------------------------------------------------ | -------------------- |
| {@link AgoraRtcEngine.setLocalVideoMirrorMode setLocalVideoMirrorMode} | 设置本地视频镜像模式 |
| {@link AgoraRtcEngine.setCameraCapturerConfiguration setCameraCapturerConfiguration} | 设置摄像头的采集偏好 |

### 其他方法

| 方法                                                         | 描述               |
| ------------------------------------------------------------ | ------------------ |
| {@link AgoraRtcEngine.getCallId getCallId}                   | 获取通话 ID        |
| {@link AgoraRtcEngine.rate rate}                             | 给通话评分         |
| {@link AgoraRtcEngine.complain complain}                     | 投诉通话质量       |
| {@link AgoraRtcEngine.setLogFile setLogFile}                 | 设置日志文件       |
| {@link AgoraRtcEngine.getVersion getVersion}                 | 查询 SDK 版本号    |
| {@link AgoraRtcEngine.getErrorDescription getErrorDescription} | 获取警告或错误描述 |
| {@link AgoraRtcEngine.convertPath convertPath}               |                    |

### 定制方法

| 方法                                               | 描述 |
| -------------------------------------------------- | ---- |
| {@link AgoraRtcEngine.setParameters setParameters} |      |
| {@link AgoraRtcEngine.setBool setBool}             |      |
| {@link AgoraRtcEngine.setInt setInt}               |      |
| {@link AgoraRtcEngine.setNumber setNumber}         |      |
| {@link AgoraRtcEngine.setObject setObject}         |      |
| {@link AgoraRtcEngine.setString setString}         |      |
| {@link AgoraRtcEngine.setUInt setUInt}             |      |
| {@link AgoraRtcEngine.getArray getArray}           |      |
| {@link AgoraRtcEngine.getBool getBool}             |      |
| {@link AgoraRtcEngine.getInt getInt}               |      |
| {@link AgoraRtcEngine.getNumber getNumber}         |      |
| {@link AgoraRtcEngine.getObject getObject}         |      |
| {@link AgoraRtcEngine.getString getString}         |      |
| {@link AgoraRtcEngine.getUInt getUInt}             |      |

### 双实例方法

Agora Electron SDK 提供双实例的实现方法。第二个实例请调用下表中的方法实现对应功能。

| 方法                                                         | 描述                        |
| ------------------------------------------------------------ | --------------------------- |
| {@link AgoraRtcEngine.videoSourceInitialize videoSourceInitialize} | 初始化 AgoraRtcEngine 实例  |
| {@link AgoraRtcEngine.videoSourceRelease videoSourceRelease} | 释放 AgoraRtcEngine 实例    |
| {@link AgoraRtcEngine.videoSourceSetChannelProfile videoSourceSetChannelProfile} | 设置频道模式                |
| {@link AgoraRtcEngine.videoSourceJoin videoSourceJoin}       | 加入频道                    |
| {@link AgoraRtcEngine.videoSourceLeave videoSourceLeave}     | 离开频道                    |
| {@link AgoraRtcEngine.videoSourceRenewToken videoSourceRenewToken} | 更新 Token                  |
| {@link AgoraRtcEngine.videoSourceEnableWebSdkInteroperability videoSourceEnableWebSdkInteroperability} | 打开与 Agora Web SDK 的互通 |
| {@link AgoraRtcEngine.setupLocalVideoSource setupLocalVideoSource} | 设置本地视图                |
| {@link AgoraRtcEngine.videoSourceSetVideoProfile videoSourceSetVideoProfile} | 设置视频编码配置            |
| {@link AgoraRtcEngine.startScreenCapture2 startScreenCapture2} | 开始屏幕共享                |
| {@link AgoraRtcEngine.stopScreenCapture2 stopScreenCapture2} | 停止屏幕共享                |
| {@link AgoraRtcEngine.videoSourceUpdateScreenCaptureRegion videoSourceUpdateScreenCaptureRegion} | 更新屏幕共享区域            |
| {@link AgoraRtcEngine.videoSourceUpdateScreenCaptureParameters videoSourceUpdateScreenCaptureParameters} | 更新屏幕共享编码配置        |
| {@link AgoraRtcEngine.videoSourceSetScreenCaptureContentHint videoSourceSetScreenCaptureContentHint} | 设置屏幕共享内容类型        |
| {@link AgoraRtcEngine.videoSourceStartScreenCaptureByScreen videoSourceStartScreenCaptureByScreen} | 根据 Screen Rect 共享屏幕   |
| {@link videosourceStartScreenCaptureByWindow}                | 根据 Window 共享窗口        |
| {@link AgoraRtcEngine.videoSourceEnableDualStreamMode videoSourceEnableDualStreamMode} | 开启视频双流模式            |
| {@link AgoraRtcEngine.videoSourceSetLogFile videoSourceSetLogFile} | 设置日志文件                |
| {@link AgoraRtcEngine.videoSourceSetParameters videoSourceSetParameters} | 启用定制功能                |
