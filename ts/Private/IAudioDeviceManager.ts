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
   * Sets the volume of the audio recording device.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract setRecordingDeviceVolume(volume: number): number;

  /**
   * @ignore
   */
  abstract getRecordingDeviceVolume(): number;

  /**
   * Sets the loopback device.
   * The SDK uses the current playback device as the loopback device by default. If you want to specify another audio device as the loopback device, call this method, and set deviceId to the loopback device you want to specify.This method applies to Windows only.The scenarios where this method is applicable are as follows:Use app A to play music through a Bluetooth headset; when using app B for a video conference, play through the speakers.If the loopback device is set as the Bluetooth headset, the SDK publishes the music in app A to the remote end.If the loopback device is set as the speaker, the SDK does not publish the music in app A to the remote end.If you set the loopback device as the Bluetooth headset, and then use a wired headset to play the music in app A, you need to call this method again, set the loopback device as the wired headset, and the SDK continues to publish the music in app A to remote end.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract setLoopbackDevice(deviceId: string): number;

  /**
   * Gets the current loopback device.
   * This method applies to Windows only.
   *
   * @returns
   * The ID of the current loopback device.
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
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract followSystemPlaybackDevice(enable: boolean): number;

  /**
   * Sets the audio recording device used by the SDK to follow the system default audio recording device.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract followSystemRecordingDevice(enable: boolean): number;

  /**
   * Sets whether the loopback device follows the system default playback device.
   * This method applies to Windows only.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  abstract followSystemLoopbackDevice(enable: boolean): number;

  /**
   * Releases all the resources occupied by the IAudioDeviceManager object.
   */
  abstract release(): void;

  /**
   * Gets the default audio playback device.
   * This method is for Windows and macOS only.
   *
   * @returns
   * The details about the default audio playback device. See AudioDeviceInfo .
   */
  abstract getPlaybackDefaultDevice(): AudioDeviceInfo;

  /**
   * Gets the default audio capture device.
   * This method is for Windows and macOS only.
   *
   * @returns
   * The details about the default audio capture device. See AudioDeviceInfo .
   */
  abstract getRecordingDefaultDevice(): AudioDeviceInfo;
}
