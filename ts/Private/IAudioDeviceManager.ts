import './extension/IAudioDeviceManagerExtension';
import { AudioDeviceInfo } from './IAgoraRtcEngine';

/**
 * Maximum length of the device ID.
 */
export enum MaxDeviceIdLengthType {
  /**
   * The maximum length of the device ID is 512 characters.
   */
  MaxDeviceIdLength = 512,
}

/**
 * Audio device management methods.
 */
export abstract class IAudioDeviceManager {
  /**
   * Gets the list of all playback devices in the system.
   *
   * @returns
   * If the method call succeeds, returns an array of AudioDeviceInfo, containing the device ID and device name of all audio playback devices.
   *  If the method call fails: returns an empty list.
   */
  abstract enumeratePlaybackDevices(): AudioDeviceInfo[];

  /**
   * Gets the list of all audio recording devices in the system.
   *
   * @returns
   * If the method call succeeds, returns an array of AudioDeviceInfo, containing the device ID and device name of all audio recording devices.
   *  If the method call fails: returns an empty list.
   */
  abstract enumerateRecordingDevices(): AudioDeviceInfo[];

  /**
   * Specifies the playback device.
   *
   * This method changes the current audio route but does not change the system default audio route. For example, if the system default audio route is Speaker 1, and you call this method before joining a channel to set the current audio route to Speaker 2, the SDK will test Speaker 2 during device testing. After testing, when you join the channel, the SDK will still use the system default audio route, i.e., Speaker 1.
   *
   * @param deviceId Specifies the playback device. Obtained via enumeratePlaybackDevices. Plugging/unplugging devices does not affect deviceId.
   * Maximum length: MaxDeviceIdLengthType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlaybackDevice(deviceId: string): number;

  /**
   * Gets the current playback device.
   *
   * @returns
   * The current playback device.
   */
  abstract getPlaybackDevice(): string;

  /**
   * Gets playback device information.
   *
   * @returns
   * The AudioDeviceInfo object containing the device ID and name of the playback device.
   */
  abstract getPlaybackDeviceInfo(): AudioDeviceInfo;

  /**
   * Sets the playback device volume.
   *
   * (Windows only)
   *
   * @param volume Volume of the playback device. The value range is [0,255].
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlaybackDeviceVolume(volume: number): number;

  /**
   * Gets the playback device volume.
   *
   * @returns
   * Playback device volume. Value range: [0,255].
   */
  abstract getPlaybackDeviceVolume(): number;

  /**
   * Specifies the audio recording device.
   *
   * This method changes the current audio recording device without changing the system default audio recording device. Suppose the system default audio recording device is Microphone 1. If you call this method before joining a channel and set the current audio route to Bluetooth Headset 1, the SDK will test Bluetooth Headset 1 during device testing. After testing, when you join a channel, the SDK still uses the system default audio recording device, i.e., Microphone 1.
   *
   * @param deviceId The Device ID of the audio recording device. You can get it through enumerateRecordingDevices. Plugging or unplugging the device does not affect the deviceId.
   * Maximum length is MaxDeviceIdLengthType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRecordingDevice(deviceId: string): number;

  /**
   * Gets the current audio recording device.
   *
   * @returns
   * Current audio recording device.
   */
  abstract getRecordingDevice(): string;

  /**
   * Gets audio recording device information.
   *
   * @returns
   * AudioDeviceInfo object containing the device ID and device name of the recording device.
   */
  abstract getRecordingDeviceInfo(): AudioDeviceInfo;

  /**
   * Sets the volume of the audio recording device.
   *
   * (Windows and macOS only)
   *
   * @param volume Volume of the audio recording device. Range: [0,255]. 0 means mute, 255 means maximum volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRecordingDeviceVolume(volume: number): number;

  /**
   * Gets the volume of the recording device.
   *
   * (Windows only)
   *
   * @returns
   * Recording device volume. Value range: [0,255].
   */
  abstract getRecordingDeviceVolume(): number;

  /**
   * Specifies the loopback capture device.
   *
   * By default, the SDK uses the current playback device as the loopback capture device. To specify another audio device as the loopback capture device, call this method and set deviceId to the desired device.
   * This method changes the current recording device but does not change the system default recording device. For example, if the system default recording device is Microphone 1, and you call this method before joining a channel to set the current audio route to Sound Card 1, the SDK will test Sound Card 1 during device testing. After testing, when you join the channel, the SDK will still use the system default recording device, i.e., Microphone 1. (Windows and macOS only)
   * Applicable scenarios:
   * App A plays music through a Bluetooth headset; App B conducts a video conference through a speaker.
   *  If the loopback capture device is set to the Bluetooth headset, the SDK will publish the music from App A to the remote end.
   *  If the loopback capture device is set to the speaker, the SDK will not publish the music from App A to the remote end.
   *  If you switch from Bluetooth headset to wired headset for App A after setting the loopback device to Bluetooth headset, you need to call this method again to set the loopback device to the wired headset. The SDK will then continue to publish the music from App A to the remote end.
   *
   * @param deviceId Specifies the loopback capture device for the SDK. Obtained via enumeratePlaybackDevices. Plugging/unplugging devices does not affect deviceId.
   * Maximum length: MaxDeviceIdLengthType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLoopbackDevice(deviceId: string): number;

  /**
   * Gets the current loopback device.
   *
   * This method is applicable only to Windows and macOS.
   *
   * @returns
   * The ID of the current loopback device.
   */
  abstract getLoopbackDevice(): string;

  /**
   * Sets the playback device to mute.
   *
   * @param mute Whether to mute the playback device: true : Mute the playback device. false : Do not mute the playback device.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlaybackDeviceMute(mute: boolean): number;

  /**
   * Gets the mute status of the current playback device.
   *
   * @returns
   * true : The playback device is muted. false : The playback device is not muted.
   */
  abstract getPlaybackDeviceMute(): boolean;

  /**
   * Mutes the current audio recording device.
   *
   * @param mute Whether to mute the audio recording device: true : The device is muted. false : The device is not muted.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRecordingDeviceMute(mute: boolean): number;

  /**
   * Gets the mute status of the current recording device.
   *
   * @returns
   * true : The recording device is muted. false : The recording device is not muted.
   */
  abstract getRecordingDeviceMute(): boolean;

  /**
   * Starts the audio playback device test.
   *
   * This method tests whether the local audio playback device is working properly. After the test starts, the SDK plays the specified audio file. If the tester can hear the sound, it indicates that the playback device is functioning correctly.
   * After calling this method, the SDK triggers the onAudioVolumeIndication callback every 100 ms to report the volume information of uid = 1 and the playback device.
   * The difference between this method and startEchoTest is that this method tests whether the local audio playback device is working properly, while the latter tests whether the audio/video devices and network are functioning correctly. You must call this method before joining a channel. After testing is complete, if you need to join a channel, make sure to call stopPlaybackDeviceTest to stop the device test first.
   *
   * @param testAudioFilePath The absolute path of the audio file. The path string must be encoded in UTF-8.
   *  Supported file formats: wav, mp3, m4a, aac.
   *  Supported sampling rates: 8000, 16000, 32000, 44100, 48000.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startPlaybackDeviceTest(testAudioFilePath: string): number;

  /**
   * Stops the audio playback device test.
   *
   * This method stops the audio playback device test. After calling startPlaybackDeviceTest, you must call this method to stop the test. You must call this method before joining a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopPlaybackDeviceTest(): number;

  /**
   * Starts the audio recording device test.
   *
   * This method tests whether the local audio recording device is working properly. After calling this method, the SDK triggers the onAudioVolumeIndication callback at the specified interval to report the volume information of uid = 0 and the recording device.
   * The difference between this method and startEchoTest is that this method tests whether the local audio recording device is working properly, while the latter tests whether the audio/video devices and network are functioning correctly. You must call this method before joining a channel. After testing is complete, if you need to join a channel, make sure to call stopRecordingDeviceTest to stop the device test first.
   *
   * @param indicationInterval The interval at which the SDK triggers the onAudioVolumeIndication callback, in milliseconds. The minimum value is 10; otherwise, the onAudioVolumeIndication callback will not be received and the SDK will return error code -2. Agora recommends setting this value to 100.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter settings. Please reset the parameters.
   */
  abstract startRecordingDeviceTest(indicationInterval: number): number;

  /**
   * Stops the audio recording device test.
   *
   * This method stops the audio recording device test. After calling startRecordingDeviceTest, you must call this method to stop the test. You must call this method before joining a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopRecordingDeviceTest(): number;

  /**
   * Starts the audio device loopback test.
   *
   * This method tests whether the audio recording and playback devices are working properly. Once the test starts, the recording device captures local audio and the playback device plays it back. The SDK triggers two onAudioVolumeIndication callbacks at the specified interval to report the volume levels of the recording device (uid = 0) and the playback device (uid = 1).
   *  This method can be called before or after joining a channel.
   *  This method is only available to hosts.
   *  This method only performs local audio device testing and does not involve network connections.
   *  After the test is complete, you must call stopAudioDeviceLoopbackTest to stop the loopback test.
   *
   * @param indicationInterval The interval at which the SDK triggers the onAudioVolumeIndication callback, in milliseconds. It is recommended to set it to greater than 200 ms. Must not be less than 10 ms, otherwise the onAudioVolumeIndication callback will not be received.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startAudioDeviceLoopbackTest(indicationInterval: number): number;

  /**
   * Stops the audio device loopback test.
   *
   * This method can be called before or after joining a channel.
   *  This method is only available to hosts.
   *  After calling startAudioDeviceLoopbackTest, you must call this method to stop the audio device loopback test.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopAudioDeviceLoopbackTest(): number;

  /**
   * Sets whether the SDK's playback device follows the system default playback device.
   *
   * @param enable Whether to follow the system default playback device: true : Follow. When the system default playback device changes, the SDK immediately switches the playback device. false : Do not follow. The SDK switches to the system default playback device only when the current playback device is removed.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract followSystemPlaybackDevice(enable: boolean): number;

  /**
   * Sets whether the SDK's recording device follows the system default recording device.
   *
   * @param enable Whether to follow the system default recording device: true : Follow. When the system default recording device changes, the SDK immediately switches the recording device. false : Do not follow. The SDK switches to the system default recording device only when the current recording device is removed.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract followSystemRecordingDevice(enable: boolean): number;

  /**
   * Sets whether the loopback device follows the system default playback device.
   *
   * This method is applicable only to Windows and macOS.
   *
   * @param enable Whether to follow the system default playback device: true : Follow. When the system default playback device changes, the SDK immediately switches the loopback device. false : Do not follow. The SDK switches to the system default playback device only when the current loopback device is removed.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract followSystemLoopbackDevice(enable: boolean): number;

  /**
   * Releases all resources occupied by the IAudioDeviceManager object.
   */
  abstract release(): void;

  /**
   * Gets the system default playback device.
   *
   * This method is applicable only to Windows and macOS.
   *
   * @returns
   * Information of the default playback device. See AudioDeviceInfo.
   */
  abstract getPlaybackDefaultDevice(): AudioDeviceInfo;

  /**
   * Gets the system default audio recording device.
   *
   * (Windows and macOS only)
   *
   * @returns
   * Information about the default recording device. See AudioDeviceInfo.
   */
  abstract getRecordingDefaultDevice(): AudioDeviceInfo;
}
