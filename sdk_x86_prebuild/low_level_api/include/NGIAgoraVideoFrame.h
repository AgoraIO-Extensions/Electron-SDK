
// Copyright (c) 2020 Agora.io. All rights reserved

// This program is confidential and proprietary to Agora.io.
// And may not be copied, reproduced, modified, disclosed to others, published
// or used, in whole or in part, without the express prior written permission
// of Agora.io.

#pragma once  // NOLINT(build/header_guard)

#include "AgoraBase.h"
#include "AgoraRefPtr.h"

namespace agora {
namespace rtc {

/**
 * The IVideoFrame class defines the interface of video frame for 
 * passing video frame data into the sdk or fetching video frame data out
 * of the sdk.
 */
class IVideoFrame : public RefCountInterface {
 public:
  /**
   * Supported Video Frame Types:
   * kRawData means the frame data rests in memory while kTexture means
   * the frame data rests in GPU.
   */
  enum class Type {
    kRawData,
    kTexture,
  };

  /**
   * Supported Video Frame Formats
   */
  enum class Format {
    kUnknown,
    kI420,
    kI420A,
    kI422,
    kNV21,
    kNV12,
    kRGBA,
    kARGB,
    kBGRA
  };

  /**
   * Get the Type of the frame.
   * @return
   * - Type: The type of the frame.
   */
  virtual Type type() const = 0;

  /**
   * Get the Format of the frame.
   * @return
   * - Format: The format of the frame.
   */
  virtual Format format() const = 0;

  /**
   * Get the width of the frame in pixels
   *
   * @return
   * - int: The width of the frame in pixels
   */
  virtual int width() const = 0;

  /**
   * Get the height of the frame in pixels
   *
   * @return
   * - int: The height of the frame in pixels
   */
  virtual int height() const = 0;

  /**
   * Get the size of the frame in pixels
   *
   * @return
   * - int: The size of the frame in pixels
   */
  virtual int size() const = 0;

  /**
   * Get the rotation of the frame
   *
   * @return
   * - int: rotation angle as 0, 90, 180, or 270. The default value is 0.
   */
  virtual int rotation() const = 0;

  /**
   * Set the rotation of the frame
   * @param rotation roation angle as 0, 90, 180, or 270.
   */
  virtual void setRotation(int rotation) = 0;

  /**
   * Get the timestamp of the frame in microseconds
   * @return 
   * - int64_t: timestamp of the frame in microseconds
   */
  virtual int64_t timestampUs() const = 0;

  /**
   * Set the timestamp of the frame in microseconds
   * @param timestampUs timestamp of the frame in microseconds
   */
  virtual void setTimeStampUs(int64_t timestampUs) = 0;

  /**
   * Get the constant raw data pointer to the beginning of the contigorous memory of the frame
   * @return 
   * - const uint8_t*: constant pointer to the beginning of the unnderlying memory.
   */
  virtual const uint8_t* data() const = 0;

  /**
   * Get the mutable raw data pointer to the beginning of the contigorous memory of the frame.
   * User can modify the content of the frame's underlying memory pointed by the mutable pointer.
   * Access to memory within the scope of the frame's size is ensured to be valid.
   * @return 
   * - uint8_t*: mutable pointer to the beginning of the unnderlying memory.
   */
  virtual uint8_t* mutableData() = 0;

  /**
   * Resize the buffer to new width and height.
   * No reallocation happens if the new size is less than the frame's original size,
   * otherwise, a reallocation-and-copy happens.
   * @return 
   * - 0: if succeeds
   * - <0: failure
   */
  virtual int resize(int width, int height) = 0;

  // Reserved for future Texture data path.
  // Expect to change when hardware video frame path is established.
  struct TextureId {
    uintptr_t id_ = 0;
  };

  /**
   * Get the texture id of the underlying buffer if type id texture.
   * @return 
   * - TextureId: texture id of the buffer.
   */
  virtual TextureId textureId() const = 0;

  /**
   * Fill the underlying buffer with source buffer content pointed by src and with new format, width, height & rotation.
   * This function first tries to fill in-place with no copy and reallocation. When it fails, a copy or copy-plus-reallocation
   * may happen
   * @return 
   * - 0: if succeeds
   * - <0: failure
   */
  virtual int fill(Format format, int width, int height, int rotation, const uint8_t* src) = 0;

  /**
   * Fill the underlying buffer with new texture.
   * @return 
   * - 0: if succeeds
   * - <0: failure
   */
  virtual int fill(Format format, int width, int height, int rotation, TextureId textureId) = 0;

 protected:
  ~IVideoFrame() {}
};

}  // namespace rtc
}  // namespace agora
