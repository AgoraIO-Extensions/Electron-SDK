import { AudioDeviceInfo } from './IAgoraRtcEngine'

/*
 * 设备 ID 的最大长度。
 */
export enum MaxDeviceIdLengthType {
/*
 * TODO(doc)
 */
MaxDeviceIdLength = 512,
}

/*
 * 音频设备管理方法。
 */
export abstract class IAudioDeviceManager {
/*
 * 获取系统中所有的播放设备列表。
 *
 * @returns
 * 方法调用成功，返回 AudioDeviceInfo 数组，包含所有音频播放设备的设备 ID 和设备名称。
 * 方法调用失败: 返回空列表。
 */
abstract enumeratePlaybackDevices(): AudioDeviceInfo[];

/*
 * 获取系统中所有的音频采集设备列表。
 *
 * @returns
 * 方法调用成功，返回一个 AudioDeviceInfo 数组，包含所有音频采集设备的设备 ID 和设备名称。
 */
abstract enumerateRecordingDevices(): AudioDeviceInfo[];

/*
 * 指定播放设备。
 *
 * @param deviceId 通过 deviceID 指定播放设备。由 enumeratePlaybackDevices 获取。插拔设备不会影响 deviceId。
 *  最大长度为 MaxDeviceIdLengthType 。
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract setPlaybackDevice(deviceId: string): number;

/*
 * 获取当前音频播放设备。
 *
 * @returns
 * 当前音频播放设备。
 */
abstract getPlaybackDevice(): string;

/*
 *  获取音频播放设备信息。 
 *
 * @returns
 * AudioDeviceInfo 对象，包含音频播放设备的设备 ID 和设备名称。
 */
abstract getPlaybackDeviceInfo(): AudioDeviceInfo;

/*
 * TODO(doc)
 */
abstract setPlaybackDeviceVolume(volume: number): number;

/*
 * TODO(doc)
 */
abstract getPlaybackDeviceVolume(): number;

/*
 * 指定音频采集设备。
 *
 * @param deviceId 音频采集设备的 Device ID。可通过 enumerateRecordingDevices 获取。插拔设备不会影响 deviceId。
 *  最大长度为 MaxDeviceIdLengthType 。
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract setRecordingDevice(deviceId: string): number;

/*
 * 获取当前音频采集设备。
 *
 * @returns
 * 当前音频采集设备。
 */
abstract getRecordingDevice(): string;

/*
 *  获取音频采集设备信息。 
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。 AudioDeviceInfo 对象，包含音频采集设备的设备 ID 和设备名称。
 */
abstract getRecordingDeviceInfo(): AudioDeviceInfo;

/*
 * TODO(doc)
 */
abstract setRecordingDeviceVolume(volume: number): number;

/*
 * TODO(doc)
 */
abstract getRecordingDeviceVolume(): number;

/*
 * TODO(doc)
 */
abstract setPlaybackDeviceMute(mute: boolean): number;

/*
 * TODO(doc)
 */
abstract getPlaybackDeviceMute(): boolean;

/*
 * TODO(doc)
 */
abstract setRecordingDeviceMute(mute: boolean): number;

/*
 * TODO(doc)
 */
abstract getRecordingDeviceMute(): boolean;

/*
 * 启动音频播放设备测试。
 * 该方法测试音频播放设备是否能正常工作。启动测试后，SDK 播放指定的音频文件，测试者如果能听到声音，说明播放设备能正常工作。
 * 调用该方法后，SDK 会每隔 100 ms 触发一次 onAudioVolumeIndication 回调，报告 uid = 1 及播放设备的音量信息。
 * 该方法需要在加入频道前调用。
 *
 * @param testAudioFilePath 音频文件的绝对路径，路径字符串使用 UTF-8 编码格式。 支持文件格式: wav、mp3、m4a、aac。
 *  支持文件采样率: 8000、16000、32000、44100、48000。 
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract startPlaybackDeviceTest(testAudioFilePath: string): number;

/*
 * 停止音频播放设备测试。
 * 该方法停止音频播放设备测试。调用 startPlaybackDeviceTest 后，必须调用该方法停止测试。
 * 该方法需要在加入频道前调用。
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract stopPlaybackDeviceTest(): number;

/*
 * 启动音频采集设备测试。
 * 该方法测试音频采集设备是否能正常工作。调用该方法后，SDK 会按设置的时间间隔触发 onAudioVolumeIndication 回调，报告 uid = 0 及采集设备的音量信息。
 * 该方法需要在加入频道前调用。
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract startRecordingDeviceTest(indicationInterval: number): number;

/*
 * 停止音频采集设备测试。
 * 该方法停止音频采集设备测试。调用 startRecordingDeviceTest 后，必须调用该方法停止测试。
 * 该方法需要在加入频道前调用。
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract stopRecordingDeviceTest(): number;

/*
 * 开始音频设备回路测试。
 * 该方法测试音频采集和播放设备是否能正常工作。一旦测试开始，音频采集设备会采集本地音频，然后使用音频播放设备播放出来。SDK 会按设置的时间间隔触发两个 onAudioVolumeIndication 回调，分别报告音频采集设备（uid = 0）和音频播放设置（uid = 1）的音量信息。 该方法需要在加入频道前调用。
 * 该方法仅在本地进行音频设备测试，不涉及网络连接。
 *
 * @param indicationInterval SDK 触发 onAudioVolumeIndication 回调的时间间隔，单位为毫秒。建议设置到大于 200 毫秒。不得少于 10 毫秒，否则会收不到 onAudioVolumeIndication 回调。
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract startAudioDeviceLoopbackTest(indicationInterval: number): number;

/*
 * 停止音频设备回路测试。
 * 该方法需要在加入频道前调用。
 * 在调用 startAudioDeviceLoopbackTest 后，必须调用该方法停止音频设备回路测试。
 *
 * @returns
 * 0: 方法调用成功。
 * < 0: 方法调用失败。
 */
abstract stopAudioDeviceLoopbackTest(): number;

/*
 * 释放 IAudioDeviceManager 对象占用的所有资源。
 */
abstract release(): void;
}
