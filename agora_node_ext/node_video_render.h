/*
 * Copyright (c) 2017 Agora.io
 * All rights reserved.
 * Proprietry and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2017
 */

#ifndef AGORA_NODE_VIDEO_RENDER_H
#define AGORA_NODE_VIDEO_RENDER_H

#include "IAgoraMediaEngine.h"

namespace agora {
namespace rtc {
class NodeVideoFrameObserver : public media::IVideoFrameObserver {
public:
  virtual ~NodeVideoFrameObserver() = default;
  virtual bool onCaptureVideoFrame(
      agora::media::IVideoFrameObserver::VideoFrame &videoFrame) override;
  virtual bool onSecondaryCameraCaptureVideoFrame(
      agora::media::IVideoFrameObserver::VideoFrame &videoFrame) override;

//   virtual bool onTertiaryCameraCaptureVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;
//   virtual bool onQuaternaryCameraCaptureVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;

  virtual bool onScreenCaptureVideoFrame(
      agora::media::IVideoFrameObserver::VideoFrame &videoFrame) override;
  virtual bool onSecondaryScreenCaptureVideoFrame(
      agora::media::IVideoFrameObserver::VideoFrame &videoFrame) override;

  virtual bool onMediaPlayerVideoFrame(VideoFrame &videoFrame,
                                       int mediaPlayerId) override;

  virtual bool onRenderVideoFrame(
      const char *channelId, rtc::uid_t remoteUid,
      agora::media::IVideoFrameObserver::VideoFrame &videoFrame) override;
  virtual bool onTranscodedVideoFrame(
      agora::media::IVideoFrameObserver::VideoFrame &videoFrame) override;

  
  virtual bool onPreEncodeVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;

  virtual bool onPreEncodeScreenVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;
  
  virtual bool onSecondaryPreEncodeCameraVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;

//   virtual bool onTertiaryPreEncodeCameraVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;

//   virtual bool onQuaternaryPreEncodeCameraVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;

  virtual bool onSecondaryPreEncodeScreenVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;
  // virtual agora::media::IVideoFrameObserver::VIDEO_FRAME_PROCESS_MODE
  // getVideoFrameProcessMode() override;
};
} // namespace rtc
} // namespace agora

#endif
