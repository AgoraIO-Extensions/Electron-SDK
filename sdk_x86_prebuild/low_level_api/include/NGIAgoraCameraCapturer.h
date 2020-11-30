//
//  Agora SDK
//
//  Copyright (c) 2019 Agora.io. All rights reserved.
//

#pragma once  // NOLINT(build/header_guard)

#include "AgoraBase.h"
#include "AgoraRefPtr.h"

namespace agora {
namespace rtc {
class IVideoSinkBase;
class ICameraCaptureObserver;
/**
 * The ICameraCapturer class, which provides access to a camera capturer.
 */
class ICameraCapturer : public RefCountInterface {

 public:
  /**
   * The camera source.
   */
  enum CAMERA_SOURCE {
    /**
     * The camera source is the rear camera.
     */
    CAMERA_BACK,
    /**
     * The camera source is the front camera.
     */
    CAMERA_FRONT,
  };

  // Interface for receiving information about available camera devices.
  /**
   * The IDeviceInfo class, which manages the information of available cameras.
   */
  class IDeviceInfo {
   public:
    virtual ~IDeviceInfo() = default;

    /**
     * Releases the device.
     */
    virtual void release() = 0;

    /**
     * Gets the number of all available cameras.
     * @return
     * - The number of all available cameras.
     */
    virtual uint32_t NumberOfDevices() = 0;

    /**
     * Gets the name of a specified camera.
     * @param deviceNumber The index number of the device.
     * @param deviceNameUTF8 The name of the device.
     * @param deviceNameLength The length of the device name.
     * @param deviceUniqueIdUTF8 The unique ID of the device, if any.
     * @param deviceUniqueIdLength The length of the device ID, if any.
     * @param productUniqueIdUTF8 The unique ID of the product, if any.
     * @param productUniqueIdLength The length of the product ID, if any.
     * @return
     * The name of the device in the UTF8 format, if the method call succeeds.
     */
    virtual int32_t GetDeviceName(uint32_t deviceNumber, char* deviceNameUTF8,
                                  uint32_t deviceNameLength, char* deviceUniqueIdUTF8,
                                  uint32_t deviceUniqueIdLength, char* productUniqueIdUTF8 = 0,
                                  uint32_t productUniqueIdLength = 0) = 0;

    /**
     * Sets the capability number for a specified device.
     * @param deviceUniqueIdUTF8 The pointer to the ID of the device in the UTF8 format.
     * @return
     * The capability number of the device.
     */
    virtual int32_t NumberOfCapabilities(const char* deviceUniqueIdUTF8) = 0;
    /**
     * Gets the capability of a specified device.
     * @param deviceUniqueIdUTF8 The pointer to the ID of the device in the UTF8 format.
     * @param deviceCapabilityNumber The capability number of the device.
     * @param capability The reference to the video capability: VideoFormat.
     * @return
     * The capability number of the device.
     */

    virtual int32_t GetCapability(const char* deviceUniqueIdUTF8,
                                  const uint32_t deviceCapabilityNumber,
                                  VideoFormat& capability) = 0;
  };

 public:
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IPHONE)
  /**
   * Sets the camera source.
   *
   * @note
   * This method applies to Android and iOS only.
   *
   * @param source The camera source that you want to capture: #CAMERA_SOURCE.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setCameraSource(CAMERA_SOURCE source) = 0;
  /**
   * Gets the camera source.
   *
   * @note
   * This method applies to Android and iOS only.
   *
   * @return The camera source: #CAMERA_SOURCE.
   */
  virtual CAMERA_SOURCE getCameraSource() = 0;
#elif defined(_WIN32) || (defined(__APPLE__) && !TARGET_OS_IPHONE && TARGET_OS_MAC) || \
    (defined(__linux__) && !defined(__ANDROID__))

  /**
   * Creates a DeviceInfo object.
   *
   * @note
   * This method applies to Windows, macOS, and Linux only.
   * @return
   * - The pointer to IDeviceInfo, if the method call succeeds.
   * - The empty pointer NULL, if the method call fails.
   */
  virtual IDeviceInfo* createDeviceInfo() = 0;
  /**
   * Initializes the device with the device ID.
   *
   * @note
   * This method applies to Windows, macOS, and Linux only.
   *
   * @param deviceId The pointer to the device ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int initWithDeviceId(const char* deviceId) = 0;
  /**
   * Initializes the device with the device name.
   *
   * @note
   * This method applies to Windows, macOS, and Linux only.
   *
   * @param deviceName The pointer to the device name.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int initWithDeviceName(const char* deviceName) = 0;
#endif

  /**
   * Sets the format of the video captured by the camera.
   *
   * If you do not set the video capturing format, the SDK automatically chooses a proper format according to the video encoder configuration of the video track.
   *
   * @param capture_format The reference to the video format: VideoFormat.
   */
  virtual void setCaptureFormat(const VideoFormat& capture_format) = 0;
  /**
   * Gets the format of the video captured by the camera.
   * @return
   * VideoFormat.
   */
  virtual VideoFormat getCaptureFormat() = 0;

 protected:
  ~ICameraCapturer() {}
};

}  // namespace rtc
}  // namespace agora
