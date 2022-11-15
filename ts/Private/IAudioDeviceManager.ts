import './extension/IAudioDeviceManagerExtension';
import { AudioDeviceInfo } from './IAgoraRtcEngine';
/**
 * The maximum length of the device ID.
 */
export enum MaxDeviceIdLengthType {
  /**
   * The maximum length of the device ID is 512 bytes.
   */
  MaxDeviceIdLength = 512,
}

/**
 * Audio device management methods.
 */
export abstract class IAudioDeviceManager {
  /**
   * Enumerates the audio playback devices.
   *
   * @returns
   * Success: Returns an AudioDeviceInfo array, which includes all the audio playback devices.Failure: An empty array.
   */
  abstract enumeratePlaybackDevices(): AudioDeviceInfo[];

  /**
   * Enumerates the audio capture devices.
   *
   * @returns
   * Success: An AudioDeviceInfo array, which includes all the audio capture devices.Failure: An empty array.
   */
  abstract enumerateRecordingDevices(): AudioDeviceInfo[];

  /**
   * Sets the audio playback device.
   *
   * @param deviceId The ID of the specified audio playback device. You can get the device ID by calling enumeratePlaybackDevices . Connecting or disconnecting the audio device does not change the value of deviceId.The maximum length is MaxDeviceIdLengthType .
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract setPlaybackDevice(deviceId: string): number;

  /**
   * Retrieves the audio playback device associated with the device ID.
   *
   * @returns
   * The current audio playback device.
   */
  abstract getPlaybackDevice(): string;

  /**
   * Retrieves the audio playback device associated with the device ID.
   *
   * @returns
   * An AudioDeviceInfo object, which contains the ID and device name of the audio devices.
   */
  abstract getPlaybackDeviceInfo(): AudioDeviceInfo;

  /**
   * @ignore
   */
  abstract setPlaybackDeviceVolume(volume: number): number;

  /**
   * @ignore
   */
  abstract getPlaybackDeviceVolume(): number;

  /**
   * Sets the audio recording device.
   *
   * @param deviceId The ID of the audio recording device. You can get the device ID by calling enumerateRecordingDevices . Plugging or unplugging the audio device does not change the value of deviceId.The maximum length is MaxDeviceIdLengthType .
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract setRecordingDevice(deviceId: string): number;

  /**
   * Gets the current audio recording device.
   *
   * @returns
   * The current audio recording device.
   */
  abstract getRecordingDevice(): string;

  /**
   * Retrieves the volume of the audio recording device.
   *
   * @returns
   * An AudioDeviceInfo object, which includes the device ID and device name.
   */
  abstract getRecordingDeviceInfo(): AudioDeviceInfo;

  /**
   * @ignore
   */
  abstract setRecordingDeviceVolume(volume: number): number;

  /**
   * @ignore
   */
  abstract getRecordingDeviceVolume(): number;

  /**
   * @ignore
   */
  abstract setLoopbackDevice(deviceId: string): number;

  /**
   * @ignore
   */
  abstract getLoopbackDevice(): string;

  /**
   * @ignore
   */
  abstract setPlaybackDeviceMute(mute: boolean): number;

  /**
   * @ignore
   */
  abstract getPlaybackDeviceMute(): boolean;

  /**
   * @ignore
   */
  abstract setRecordingDeviceMute(mute: boolean): number;

  /**
   * @ignore
   */
  abstract getRecordingDeviceMute(): boolean;

  /**
   * Starts the audio playback device test.
   * This method tests whether the audio playback device works properly. Once a user starts the test, the SDK plays an audio file specified by the user. If the user can hear the audio, the playback device works properly.After calling this method, the SDK triggers the onAudioVolumeIndication callback every 100 ms, reporting uid = 1 and the volume information of the playback device.Ensure that you call this method before joining a channel.
   *
   * @param testAudioFilePath The path of the audio file. The data format is string in UTF-8.Supported file formats: wav, mp3, m4a, and aac.Supported file sample rates: 8000, 16000, 32000, 44100, and 48000 Hz.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract startPlaybackDeviceTest(testAudioFilePath: string): number;

  /**
   * Stops the audio playback device test.
   * This method stops the audio playback device test. You must call this method to stop the test after calling the startPlaybackDeviceTest method.Ensure that you call this method before joining a channel.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract stopPlaybackDeviceTest(): number;

  /**
   * Starts the audio capture device test.
   * This method tests whether the audio capture device works properly. After calling this method, the SDK triggers the onAudioVolumeIndication callback at the time interval set in this method, which reports uid = 0 and the volume information of the capturing device.Ensure that you call this method before joining a channel.
   *
   * @param indicationInterval The time interval (ms) at which the SDK triggers the onAudioVolumeIndication callback. Agora recommends a setting greater than 200 ms. This value must not be less than 10 ms; otherwise, you can not receive the onAudioVolumeIndication callback.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract startRecordingDeviceTest(indicationInterval: number): number;

  /**
   * Stops the audio capture device test.
   * This method stops the audio capture device test. You must call this method to stop the test after calling the startRecordingDeviceTest method.Ensure that you call this method before joining a channel.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract stopRecordingDeviceTest(): number;

  /**
   * Starts an audio device loopback test.
   * This method tests whether the local audio capture device and playback device are working properly. Once the test starts, the audio recording device records the local audio, and the audio playback device plays the captured audio. The SDK triggers two independent onAudioVolumeIndication callbacks at the time interval set in this method, which reports the volume information of the capture device (uid = 0) and the volume information of the playback device (uid = 1) respectively.Ensure that you call this method before joining a channel.This method tests local audio devices and does not report the network conditions.
   *
   * @param indicationInterval The time interval (ms) at which the SDK triggers the onAudioVolumeIndication callback. Agora recommends setting a value greater than 200 ms. This value must not be less than 10 ms; otherwise, you can not receive the onAudioVolumeIndication callback.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract startAudioDeviceLoopbackTest(indicationInterval: number): number;

  /**
   * Stops the audio device loopback test.
   * Ensure that you call this method before joining a channel.Ensure that you call this method to stop the loopback test after calling the startAudioDeviceLoopbackTest method.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract stopAudioDeviceLoopbackTest(): number;

  /**
   * Sets the audio playback device used by the SDK to follow the system default audio playback device.
   *
   * @param enable Whether to follow the system default audio playback device:true: Follow. The SDK immediately switches the audio playback device when the system default audio playback device changes.false: Do not follow. The SDK switches the audio playback device to the system default audio playback device only when the currently used audio playback device is disconnected.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract followSystemPlaybackDevice(enable: boolean): number;

  /**
   * Sets the audio recording device used by the SDK to follow the system default audio recording device.
   *
   * @param enable Whether to follow the system default audio recording device:true: Follow. The SDK immediately switches the audio recording device when the system default audio recording device changes.false: Do not follow. The SDK switches the audio recording device to the system default audio recording device only when the currently used audio recording device is disconnected.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract followSystemRecordingDevice(enable: boolean): number;

  /**
   * @ignore
   */
  abstract followSystemLoopbackDevice(enable: boolean): number;

  /**
   * Releases all the resources occupied by the IAudioDeviceManager object.
   */
  abstract release(): void;

  /**
   * @ignore
   */
  abstract getPlaybackDefaultDevice(): AudioDeviceInfo;

  /**
   * @ignore
   */
  abstract getRecordingDefaultDevice(): AudioDeviceInfo;
}
