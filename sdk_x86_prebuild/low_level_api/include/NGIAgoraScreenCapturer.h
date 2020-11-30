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
class IScreenCaptureObserver;
/**
 * The IScreenCapturer class, which provides access to the screen capturer.
 */
class IScreenCapturer : public RefCountInterface {
 public:
#if defined(TARGET_OS_MAC) && !TARGET_OS_IPHONE
  /**
   * Initializes the screen capturer by specifying a display ID.
   *
   * @note
   * This method applies to macOS only.
   *
   * This method shares a whole or part of a screen specified by the display ID.
   * @param displayId The display ID of the screen to be shared. This parameter specifies which screen you want
   * to share.
   * @param regionRect The reference to the relative location of the region to the screen: Rectangle.
   * - If the specified region overruns the screen, only the region within the screen will be captured.
   * - If you set `width` or `height` as 0, the whole screen will be captured.
   * Note that the coordinate of rectangle is relative to the window and follow system specification
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_INVALID_STATE, probably because there is already an active screen sharing, call stopScreenCapture()
   *     first.
   *   - ERR_INVALID_ARGUMENT, if all the coordinates of `regionRect` are out of the specified display.
   */
  virtual int initWithDisplayId(view_t displayId, const Rectangle& regionRect) = 0;
#elif defined(_WIN32)
  /**
   * Initializes the screen capturer by specifying a screen Rect.
   *
   * @note
   * This method applies to Windows only.
   *
   * This method shares a whole or part of a screen specified by the screen Rect.
   * @param screenRect The reference to the Rect of the screen to be shared. This parameter specifies which screen you want
   * to share.
   * @param regionRect The reference to the relative location of the region to the screen: regionRect.
   * - If the specified region overruns the screen, only the region within the screen will be captured.
   * - If you set `width` or `height` as 0, the whole screen will be captured.
   * Note that the coordinate of rectangle is relative to the window and follow system specification
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_INVALID_STATE, probably because there is already an active screen sharing, call stopScreenCapture()
   *     first.
   *   - ERR_INVALID_ARGUMENT, if all the coordinates of `regionRect` are out of the specified screen.
   */
  virtual int initWithScreenRect(const Rectangle& screenRect,
                                 const Rectangle& regionRect) = 0;
#endif
  /**
   * Initializes the screen capturer by specifying a window ID.
   *
   * This method shares a whole or part of a window specified by the window ID.
   *
   * @note
   * This method applies to Windows and macOS only.
   * @param windowId The ID of the window to be shared. This parameter specifies which window you want
   * to share.
   * @param regionRect The reference to the relative location of the region to the window: regionRect.
   * - If the specified region overruns the window, only the region within the screen will be captured.
   * - If you set `width` or `height` as 0, the whole window will be captured.
   * Note that the coordinate of rectangle is relative to the window and follow system specification
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_INVALID_STATE, probably because there is already an active screen sharing, call stopScreenCapture()
   *     first.
   *   - ERR_INVALID_ARGUMENT if all the coordinates of `regionRect` are out of the specified window.
   */
  virtual int initWithWindowId(view_t windowId, const Rectangle& regionRect) = 0;

  /**
   * Sets the content hint for screen sharing.
   *
   * A content hint suggests the type of the content being shared, so that the SDK applies different
   * optimization algorithm to different types of content.
   * @param contentHint The content hint for screen capture: \ref rtc::VIDEO_CONTENT_HINT "VIDEO_CONTENT_HINT".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_NOT_READY: No screen or window is being shared.
   */
  virtual int setContentHint(VIDEO_CONTENT_HINT contentHint) = 0;

  /**
   * Updates the screen capture region.
   * @param regionRect The reference to the relative location of the region to the screen or window: Rectangle.
   * - If the specified region overruns the screen or window, the screen capturer captures only the region within it.
   * - If you set `width` or `height` as 0, the SDK shares the whole screen or window.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - No screen or window is being shared.
   */
  virtual int updateScreenCaptureRegion(const Rectangle& regionRect) = 0;

#if defined(__ANDROID__)
  /**
   * Initializes the screen capturer by specifying a result data which obtained from a succesful screen
   * capture request.
   *
   * This method shares the whole screen.
   *
   * @note
   * This method applies to Android only.
   * @param data The resulting data from {@link android.app.Activity#onActivityResult(int, int, 
   * android.content.Intent)}.
   * @param dimensions The reference to the captured screen's resolution in terms of width &times; height.
   * - If you set `width` or `height` as 0, the dimensions will be the screen's width &times; height.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_INVALID_ARGUMENT if data is null.
   */
  virtual int initWithMediaProjectionPermissionResultData(void* data,
                                                          const VideoDimensions& dimensions) = 0;
#endif

 protected:
  ~IScreenCapturer() {}
};

}  // namespace rtc
}  // namespace agora
