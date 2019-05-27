Agora Electron SDK 基于 Agora SDK for macOS 和 Agora SDK for Windows，使用 Node.js C++ 插件开发，是一个为 Electron 平台用户服务的开源 SDK。 通过声网全球部署的虚拟网络，提供可以灵活搭配的 API 组合，在各平台提供质量可靠的实时音视频通信。

* AgoraRtcEngine 接口类包含应用程序调用的主要方法
* Events 接口类用于向应用程序发表事件回调通知

## 方法类

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
| {@link AgoraRtcEngine.setProfile setProfile}       |      |
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

## 事件类

Agora Electron SDK 通过 {@link AgoraRtcEngine.on on} 方法监听上述方法触发的事件。

| 事件                             | 描述                                     |
| -------------------------------- | ---------------------------------------- |
| warning                          | 发生警告                                 |
| error                            | 发生错误                                 |
| joinedChannel                    | 已加入频道                               |
| rejoinedChannel                  | 已重新加入频道                           |
| leaveChannel                     | 已离开频道                               |
| clientRoleChanged                | 用户角色已改变                           |
| userJoined                       | 远端用户已加入频道                       |
| connectionStateChanged           | 网络连接状态已改变                       |
| connectionLost                   | 网络连接已丢失                           |
| connectionInterrupted            | 网络连接已中断                           |
| connectionBanned                 | 网络连接被禁止                           |
| apiCallExecuted                  | API 方法已执行                           |
| tokenPrivilegeWillExpire         | Token 即将过期                           |
| requestChannelKey                | Channel Key 已过期                       |
| microphoneEnabled                | 麦克风状态已改变                         |
| audioVolumeIndication            | 提示频道内谁正在说话以及说话者音量       |
| groupAudioVolumeIndication       |                                          |
| activeSpeaker                    | 监测到活跃用户                           |
| audioQuality                     | 报告通话中远端音频流的统计信息           |
| rtcStats                         | 报告当前通话统计信息                     |
| localVideoStats                  | 报告本地视频流统计信息                   |
| remoteVideoStats                 | 报告远端视频流统计信息                   |
| remoteAudioStats                 | 报告通话中远端音频流的统计信息           |
| remoteVideoTransportStats        | 报告远端视频传输统计信息                 |
| remoteAudioTransportStats        | 报告远端音频传输统计信息                 |
| audioDeviceStateChanged          | 音频设备状态发生改变                     |
| videoDeviceStateChanged          | 视频文件状态发生改变事件                 |
| audioMixingFinished              | 本地音乐文件播放已结束                   |
| audioMixingStateChanged          | 本地音乐文件播放状态已改变               |
| remoteAudioMixingBegin           | 远端音乐文件播放已开始                   |
| remoteAudioMixingEnd             | 远端音乐文件播放已结束                   |
| audioEffectFinished              | 本地音效文件播放已结束                   |
| networkQuality                   | 报告网络上下行质量                       |
| lastmileQuality                  | 报告通话前本地用户的网络质量             |
| lastmileProbeResult              | 报告通话前Last-mile 网络上下行质量       |
| firstLocalAudioFrame             | 已发送本地音频首帧                       |
| firstRemoteAudioFrame            | 已收到远端音频首帧                       |
| firstLocalVideoFrame             | 已发送本地视频首帧                       |
| firstRemoteVideoFrame            | 已显示远端视频首帧                       |
| videoSizeChanged                 | 本地或延段视频大小或旋转信息发生改变     |
| addStream                        |                                          |
| removeStream                     |                                          |
| userMuteAudio                    | 远端用户已暂停/重新发送音频流            |
| userMuteVideo                    | 远端用户已暂停/重新发送视频流            |
| userEnableVideo                  | 远端用户已启用/关闭视频功能              |
| userEnableLocalVideo             | 远端用户已暂停/重新采集视频流            |
| cameraReady                      | 摄像头已启用                             |
| videoStopped                     | 视频功能已停止                           |
| refreshRecordingServiceStatus    | 录制状态已更新                           |
| streamMessage                    | 接收到对方数据流小                       |
| streamMessageError               | 接收对方数据流消息发生错误               |
| mediaEngineStartCallSuccess      | 媒体引擎成功启动                         |
| audioDeviceVolumeChanged         | 音频设备播放音量已改变                   |
| remoteVideoStateChanged          | 远端视频状态已改变                       |
| cameraFocusAreaChanged           | 摄像头对焦区域已改变                     |
| cameraExposureAreaChanged        | 摄像头曝光区域已改变                     |
| streamPublished                  | 已添加旁路推流地址                       |
| streamUnpublished                | 已移除旁路推流地址                       |
| transcodingUpdated               | 旁路推流配置已更新                       |
| streamInjectStatus               | 导入在线媒体流状态                       |
| localPublishFallbackToAudioOnly  | 本地发布流已回退为音频流或恢复为音视频流 |
| remotePublishFallbackToAudioOnly | 远端订阅流已回退为音频流或恢复为音视频流 |
| videoSourceJoinedSuccess         | （第二个实例）已加入频道                 |
| videoSourceRequestNewToken       | （第二个实例）Token 已过期               |
| videoSourceLeaveChannel          | （第二个实例）已离开频道                 |

<a name = "error"></a>

## 错误码与警告码

Agora SDK 在调用 API 或运行时，可能会返回错误或警告代码：

* **错误代码**：意味着 SDK 遭遇不可恢复的错误，需要应用程序干预，例如打开摄像头失败会返回错误，应用程序需要提示用户不能使用摄像头。
* **警告代码**：意味着 SDK 遇到问题，但有可能恢复，警告代码仅起告知作用，一般情况下应用程序可以忽略警告代码。

### 错误代码

<table>
<colgroup>
<col/>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>错误代码</strong></td>
<td><strong>值</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>ERR_OK</td>
<td>0</td>
<td>没有错误。</td>
</tr>
<tr><td>ERR_FAILED</td>
<td>1</td>
<td>一般性的错误(没有明确归类的错误原因)。</td>
</tr>
<tr><td>ERR_INVALID_ARGUMENT</td>
<td>2</td>
<td>API 调用了无效的参数。例如指定的频道名含有非法字符。</td>
</tr>
<tr><td>ERR_NOT_READY</td>
<td>3</td>
<td>SDK 的模块没有准备好，例如某个 API 调用依赖于某个模块，但该模块尚未准备提供服务。</td>
</tr>
<tr><td>ERR_NOT_SUPPORTED</td>
<td>4</td>
<td>SDK 不支持该功能。</td>
</tr>
<tr><td>ERR_REFUSED</td>
<td>5</td>
<td>调用被拒绝。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_BUFFER_TOO_SMALL</td>
<td>6</td>
<td>传入的缓冲区大小不足以存放返回的数据。</td>
</tr>
<tr><td>ERR_NOT_INITIALIZED</td>
<td>7</td>
<td>SDK 尚未初始化，就调用其 API。</td>
</tr>
<tr><td>ERR_NO_PERMISSION</td>
<td>9</td>
<td>没有操作权限。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_TIMEDOUT</td>
<td>10</td>
<td>API 调用超时。有些 API 调用需要 SDK 返回结果，如果 SDK 处理时间过长，会出现此错误。</td>
</tr>
<tr><td>ERR_CANCELED</td>
<td>11</td>
<td>请求被取消。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_TOO_OFTEN</td>
<td>12</td>
<td>调用频率太高。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_BIND_SOCKET</td>
<td>13</td>
<td>SDK 内部绑定到网络 socket 失败。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_NET_DOWN</td>
<td>14</td>
<td>网络不可用。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_NET_NOBUFS</td>
<td>15</td>
<td>没有网络缓冲区可用。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_JOIN_CHANNEL_REJECTED</td>
<td>17</td>
<td>加入频道被拒绝。一般是因为用户已进入频道，再次调用加入频道的 API，例如 joinChannel，会返回此错误。</td>
</tr>
<tr><td>ERR_LEAVE_CHANNEL_REJECTED</td>
<td>18</td>
<td>离开频道失败。一般是因为用户已离开某频道，再次调用退出频道的API，例如 leaveChannel，会返回此错误。</td>
</tr>
<tr><td>ERR_ALREADY_IN_USE</td>
<td>19</td>
<td>资源已被占用，不能重复使用。</td>
</tr>
<tr><td>ERR_ABORTED</td>
<td>20</td>
<td>SDK 放弃请求，可能由于请求次数太多。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_INIT_NET_ENGINE</td>
<td>21</td>
<td>Windows 下特定的防火墙设置导致 SDK 初始化失败然后崩溃。</td>
</tr>
<tr><td>ERR_INVALID_VENDOR_KEY</td>
<td>101</td>
<td>指定的 App ID 无效。</td>
</tr>
<tr><td>ERR_INVALID_CHANNEL_NAME</td>
<td>102</td>
<td>指定的频道名无效。</td>
</tr>
<tr><td>ERR_NOT_IN_CHANNEL</td>
<td>113</td>
<td>用户不在频道内。</td>
</tr>
<tr><td>ERR_SIZE_TOO_LARGE</td>
<td>114</td>
<td>数据太大</td>
</tr>
<tr><td>ERR_BITRATE_LIMIT</td>
<td>115</td>
<td>码率受限</td>
</tr>
<tr><td>ERR_LOAD_MEDIA_ENGINE</td>
<td>1001</td>
<td>加载媒体引擎失败。</td>
</tr>
<tr><td>ERR_START_CALL</td>
<td>1002</td>
<td>启动媒体引擎开始通话失败。</td>
</tr>
<tr><td>ERR_ADM_GENERAL_ERROR</td>
<td>1005</td>
<td>音频设备模块出现一般性错误（没有明显归类的错误）。</td>
</tr>
<tr><td>ERR_ADM_JAVA_RESOURCE</td>
<td>1006</td>
<td>语音模块: 使用 java 资源出现错误。</td>
</tr>
<tr><td>ERR_ADM_SAMPLE_RATE</td>
<td>1007</td>
<td>语音模块: 设置的采样频率出现错误。</td>
</tr>
<tr><td>ERR_ADM_INIT_PLAYOUT</td>
<td>1008</td>
<td>语音模块: 初始化播放设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_START_PLAYOUT</td>
<td>1009</td>
<td>语音模块: 启动播放设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_STOP_PLAYOUT</td>
<td>1010</td>
<td>语音模块: 停止播放设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_INIT_RECORDING</td>
<td>1011</td>
<td>语音模块: 初始化录音设备时出现错误。</td>
</tr>
<tr><td>ERR_ADM_START_RECORDING</td>
<td>1012</td>
<td>语音模块: 启动录音设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_STOP_RECORDING</td>
<td>1013</td>
<td>语音模块: 停止录音设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_PLAYOUT_ERROR</td>
<td>1015</td>
<td>语音模块: 运行时播放出现错误。</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_RECORDING_ERROR</td>
<td>1017</td>
<td>语音模块: 运行时录音错误。</td>
</tr>
<tr><td>ERR_ADM_RECORD_AUDIO_FAILED</td>
<td>1018</td>
<td>语音模块: 录制失败</td>
</tr>
<tr><td>ERR_ADM_INIT_LOOPBACK</td>
<td>1022</td>
<td>语音模块: 初始化 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_START_LOOPBACK</td>
<td>1023</td>
<td>语音模块: 启动 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_NO_PERMISSION</td>
<td>1027</td>
<td>语音模块: 没有使用 ADM 的权限</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_PLAYOUT_ERROR</td>
<td>1015</td>
<td>语音模块: 运行时播放出现错误。</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_RECORDING_ERROR</td>
<td>1017</td>
<td>语音模块: 运行时录音错误。</td>
</tr>
<tr><td>ERR_ADM_RECORD_AUDIO_FAILED</td>
<td>1018</td>
<td>语音模块: 录制失败</td>
</tr>
<tr><td>ERR_ADM_INIT_LOOPBACK</td>
<td>1022</td>
<td>语音模块: 初始化 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_START_LOOPBACK</td>
<td>1023</td>
<td>语音模块: 启动 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_NO_PERMISSION</td>
<td>1027</td>
<td>语音模块: 没有使用 ADM 的权限</td>
</tr>
</tbody>
</table>

### 警告代码

<table>
<colgroup>
<col/>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>警告代码</strong></td>
<td><strong>值</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>WARN_PENDING</td>
<td>20</td>
<td>请求处于待定状态。一般是由于某个模块还没准备好，请求被延迟处理。</td>
</tr>
<tr><td>WARN_NO_AVAILABLE_CHANNEL</td>
<td>103</td>
<td>没有可用的频道资源。可能是因为服务端没法分配频道资源。</td>
</tr>
<tr><td>WARN_LOOKUP_CHANNEL_TIMEOUT</td>
<td>104</td>
<td>查找频道超时。在加入频道时SDK先要查找指定的频道，出现该警告一般是因为网络太差，连接不到服务器。</td>
</tr>
<tr><td>WARN_LOOKUP_CHANNEL_REJECTED</td>
<td>105</td>
<td>查找频道请求被服务器拒绝。服务器可能没有办法处理这个请求或请求是非法的。</td>
</tr>
<tr><td>WARN_OPEN_CHANNEL_TIMEOUT</td>
<td>106</td>
<td>打开频道超时。查找到指定频道后，SDK 接着打开该频道，超时一般是因为网络太差，连接不到服务器。</td>
</tr>
<tr><td>WARN_OPEN_CHANNEL_REJECTED</td>
<td>107</td>
<td>打开频道请求被服务器拒绝。服务器可能没有办法处理该请求或该请求是非法的。</td>
</tr>
<tr><td>WARN_SET_CLIENT_ROLE_TIMEOUT</td>
<td>118</td>
<td>设置用户角色超时。服务器可能没有办法处理该请求或该请求是非法的。</td>
</tr>
<tr><td>WARN_SET_CLIENT_ROLE_NOT_AUTHORIZED</td>
<td>119</td>
<td>用户没有权限进行该操作</td>
</tr>
<tr><td>WARN_AUDIO_MIXING_OPEN_ERROR</td>
<td>701</td>
<td>调用 startAudioMixing() 时传入了不正确或不完整的文件</td>
</tr>
<tr><td>WARN_ADM_RUNTIME_PLAYOUT_WARNING</td>
<td>1014</td>
<td>音频设备模块: 运行时播放设备出现警告。</td>
</tr>
<tr><td>WARN_ADM_RUNTIME_RECORDING_WARNING</td>
<td>1016</td>
<td>音频设备模块: 运行时录音设备出现警告。</td>
</tr>
<tr><td>WARN_ADM_RECORD_AUDIO_SILENCE</td>
<td>1019</td>
<td>音频设备模块: 没有采集到有效的声音数据。</td>
</tr>
<tr><td>WARN_ADM_PLAYOUT_MALFUNCTION</td>
<td>1020</td>
<td>音频设备模块: 播放设备出现故障。</td>
</tr>
<tr><td>WARN_ADM_RECORD_MALFUNCTION</td>
<td>1021</td>
<td>音频设备模块: 录制设备出现故障。</td>
</tr>
<tr><td>WARN_ADM_RECORD_MALFUNCTION</td>
<td>1031</td>
<td>音频设备模块: 录制声音过小</td>
</tr>
<tr><td>WARN_ADM_HOWLING</td>
<td>1051</td>
<td>音频设备模块: 检测到啸叫。</td>
</tr>
</tbody>
</table>