//
//  Agora SDK
//
//  Copyright (c) 2018 Agora.io. All rights reserved.
//

#pragma once  // NOLINT(build/header_guard)

#include "AgoraBase.h"
#include "AgoraRefPtr.h"

namespace agora {
namespace rtc {

static const int kAdmMaxDeviceNameSize = 128;
static const int kAdmMaxGuidSize = 128;
static const int kIntervalInMillseconds = 200;


#if defined(_WIN32) || (!TARGET_OS_IPHONE) && defined(TARGET_OS_MAC)
/**
 * The struct of AudioDeviceInfo.
 *
 * @note
 * This struct applies to Windows and macOS only.
 */
struct AudioDeviceInfo {
  /**
   * The name of the device. The maximum name size is 128 bytes. The default value is 0.
   */
  char deviceName[kAdmMaxDeviceNameSize] = { 0 };
  /**
   * The ID of the device. The maximum size is 128 bytes. The default value is 0.
   */
  char deviceId[kAdmMaxGuidSize] = { 0 };
  /**
   * Determines whether the current device is selected for audio capturing or playback.
   * - true: Select the current device for audio capturing or playback.
   * - false: (Default) Do not select the current device for audio capturing or playback.
   */
  bool isCurrentSelected { false };
  /**
   * Determines whether the current device is the audio playout device.
   * - true: (Default) The current device is the playout device.
   * - false: The current device is not the playout device.
   */
  bool isPlayoutDevice { true };
};
#endif

/**
 * The IAudioDeviceManagerObserver class.
 */
class IAudioDeviceManagerObserver
{
public:
  virtual ~IAudioDeviceManagerObserver() {}

  /**
   * Reports the microphone volume.
   *
   * After successfully starting the microphone test, the SDK triggers this callback to report the microphone
   * volume. You can use this callback to test whether the microphone is working properly.
   *
   * @param volume The microphone volume. The value range is [0, 255].
   */
  virtual void onVolumeIndication(int volume) = 0;

  /**
   * Occurs when the device state changes, for example, when a device is added or removed.
   *
   * To get the current information of the connected audio devices, call getNumberOfPlayoutDevices() or
   * getNumberOfPlayoutDevices().
   */
  virtual void onDeviceStateChanged() = 0;
  /**
   * Occurs when the audio route changes.
   *
   * @param route The current audio route: AudioRoute.
   */
  virtual void onRoutingChanged(AudioRoute route) = 0;
};

/**
 * The INGAudioDeciceManager class.
 *
 * This class provides access to audio volume and audio route control, as well as device enumeration and
 * selection on the PC.
 */
class INGAudioDeviceManager : public RefCountInterface {
public:
  // Volume control
  /**
   * Sets the volume of the microphone.
   * @param volume The volume of the microphone. The value range is [0, 255].
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setMicrophoneVolume(unsigned int volume) = 0;
  /**
   * Gets the volume of the microphone.
   * @param volume The volume of the microphone.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getMicrophoneVolume(unsigned int& volume) = 0;
  /**
   * Sets the volume of the speaker.
   * @param volume The volume of the speaker. The value range is [2, 255].
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setSpeakerVolume(unsigned int volume) = 0;
  /**
   * Gets the volume of the speaker.
   * @param volume The volume of the speaker.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getSpeakerVolume(unsigned int& volume) = 0;
  /**
   * Captures or stops capturing the local audio with the microphone.
   * @param mute Determines whether to capture or stop capturing the local audio with the microphone.
   * - true: Stop capturing the local audio.
   * - false: (Default) Capture the local audio.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setMicrophoneMute(bool mute) = 0;
  /**
   * Gets the mute state of the microphone.
   * @param mute The mute state of the microphone.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getMicrophoneMute(bool& mute) = 0;
  /**
   * Plays or stops playing the remote audio with the speaker.
   * @param mute Determines whether to play or stop playing the remote audio.
   * - true: Stop playing the remote audio.
   * - false: (Default) Play the remote audio.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setSpeakerMute(bool mute) = 0;
  /**
   * Gets the mute state of the speaker.
   * @param mute A reference to the mute state of the speaker.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getSpeakerMute(bool& mute) = 0;

  /**
   * Get the playout parameters of audio device.
   * @param params A point to the struct AudioParameters.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getPlayoutAudioParameters(AudioParameters* params) const = 0;

  /**
   * Get the record parameters of audio device.
   * @param params A point to the struct AudioParameters.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getRecordAudioParameters(AudioParameters* params) const = 0;

#if defined(__ANDROID__) || (defined(TARGET_OS_IPHONE) && TARGET_OS_IPHONE)
  /**
   * Sets the default audio routing.
   *
   * This method allows apps to change the current audio route for the received audio.
   * Noted: In Low Level API, we don't support default audio routing, i.e.,
   * setDefaultAudioRouteToSpeakerphone. This can be done in RTC engine.
   *
   * @note
   * This method applies to Android and iOS only.
   *
   * @param route The default audio route: AudioRoute.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setDefaultAudioRouting(AudioRoute route) = 0;
  /**
   * Changes the current audio routing.
   *
   * @note
   * This method applies to Android and iOS only.
   *
   * @param route The audio route that you want to change to: AudioRoute.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int changeAudioRouting(AudioRoute route) = 0;
  /**
   * Gets the current audio routing.
   *
   * @note
   * This method applies to Android and iOS only.
   *
   * @param route A reference to the audio route: AudioRoute.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getCurrentRouting(AudioRoute& route) = 0;
#endif

#if defined(_WIN32) || (!TARGET_OS_IPHONE) && defined(TARGET_OS_MAC)
  /**
   * Gets the index numbers of all audio playout devices.
   *
   * @note
   * This method applies to Windows or macOS only.
   *
   * @return
   * - The index numbers of the audio playout devices, if the method call succeeds.
   * - < 0, if the method call fails.
   */
  virtual int getNumberOfPlayoutDevices() = 0;

  /**
   * Gets the index numbers of all audio recording devices.
   *
   * @note
   * This method applies to Windows or macOS only.
   *
   * @return
   * - The index numbers of the audio recording devices, if the method call succeeds.
   * - < 0, if the method call fails.
   */
  virtual int getNumberOfRecordingDevices() = 0;
  /**
   * Gets the information of the current audio playout device.
   *
   * @note
   * This method applies to Windows or macOS only.
   *
   * @param index The index number of the current audio playout device.
   * @return
   * The information of the audio playout device: AudioDeviceInfo.
   */
  virtual AudioDeviceInfo getPlayoutDeviceInfo(int index) = 0;
  /**
   * Gets the information of the current recording device.
   *
   * @note
   * This method applies to Windows or macOS only.
   *
   * @param index The index number of the current recording device.
   * @return
   * The information of the recording device: AudioDeviceInfo.
   */
  virtual AudioDeviceInfo getRecordingDeviceInfo(int index) = 0;
  /**
   * Sets the audio playback device.
   *
   * @note
   * This method applies to Windows or macOS only.
   *
   * @param index The index number of the audio playout device that you want to set.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setPlayoutDevice(int index) = 0;
  /**
   * Sets the recording device.
   *
   * @note
   * This method applies to Windows or macOS only.
   *
   * @param index The index number of the recording device that you want to set.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRecordingDevice(int index) = 0;
#endif

#if defined(_WIN32)
  /**
   * Sets the volume of the app.
   *
   * @note
   * This method applies to Windows only.
   *
   * @param volume The volume of the app that you want to set. The value range is [0, 255].
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setApplicationVolume(unsigned int volume) = 0;
  /**
   * Gets the volume of the app.
   *
   * @note
   * This method applies to Windows only.
   *
   * @param volume The volume of the app. The value range is [0, 255].
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getApplicationVolume(unsigned int& volume) = 0;
  /**
   * Sets the mute state of the app.
   *
   * @note
   * This method applies to Windows only.
   *
   * @param mute Determines whether to set the app to the mute state.
   * - true: Set the app to the mute state.
   * - false: (Default) Do not set the app to the mute state.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setApplicationMuteState(bool mute) = 0;
  /**
   * Gets the mute state of the app.
   *
   * @note
   * This method applies to Windows only.
   *
   * @param mute A reference to the mute state of the app.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getApplicationMuteState(bool& mute) = 0;
#endif

  /**
   * Starts the microphone test.
   *
   * Once you successfully start the microphone test, the SDK reports the volume information of the microphone
   * at the `indicationInterval` in the onVolumeIndication() callback, regardless of whether anyone is speaking
   * in the channel.
   *
   * @param indicationInterval The time interval between two consecutive `onVolumeIndication` callbacks (ms). The default value is 200 ms.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int startMicrophoneTest(
      int indicationInterval = kIntervalInMillseconds) = 0;
  /**
   * Stops the microphone test.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopMicrophoneTest() = 0;

  /**
   * Registers an IAudioDeviceManagerObserver object.
   *
   * You need to implement the IAudioDeviceManageObserver class in this method, and register callbacks
   * according to your scenario.
   *
   * @param observer A pointer to the IAudioDeviceManagerObserver class.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int registerObserver(IAudioDeviceManagerObserver* observer) = 0;
  /**
   * Releases the IAudioDeviceManagerObserver object.
   * @param observer The pointer to the IAudioDeviceManagerObserver class registered using registerObserver().
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int unregisterObserver(IAudioDeviceManagerObserver* observer) = 0;

protected:
  ~INGAudioDeviceManager() = default;
};

} //namespace rtc
} // namespace agora
