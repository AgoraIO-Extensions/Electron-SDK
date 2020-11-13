
// Copyright (c) 2019 Agora.io. All rights reserved

// This program is confidential and proprietary to Agora.io.
// And may not be copied, reproduced, modified, disclosed to others, published
// or used, in whole or in part, without the express prior written permission
// of Agora.io.

#pragma once  // NOLINT(build/header_guard)

#include "AgoraBase.h"
#include "AgoraRefPtr.h"
#include "NGIAgoraMediaNodeFactory.h"
#include "IAgoraService.h"

namespace agora {
namespace rtc {
class IVideoFilter;

enum VideoTrackType {
  LOCAL_VIDEO_TRACK,
  REMOTE_VIDEO_TRACK,
};

/**
 * The `IVideoTrack` class defines the behavior and status of a video track.
 */
class IVideoTrack : public RefCountInterface {
 public:
  /**
   * Adds a video filter to the video track.
   *
   * Add a video filter in either of the following ways:
   * - Use the \ref agora::rtc::IMediaNodeFactory "IMediaNodeFactory" object to create a built-in video filter.
   * - Use a customized video filter by implementing the \ref agora::rtc::IVideoFilter "IVideoFilter" class.
   *
   * To add multiple filters, call this method multiple times. The order of the added filters depends on when
   * the app successfully adds the filter.
   *
   * @param filter The video filter that you want to add to the video track.
   * @return
   * - `true`: The video filter is added successfully.
   * - `false`: The video filter fails to be added.
   */
  virtual bool addVideoFilter(agora_refptr<IVideoFilter> filter) = 0;
  /**
   * Removes the video filter added by `addVideoFilter` from the video track.
   *
   * @param filter The video filter that you want to remove: `IVideoFilter`.
   * @return
   * - `true`: The video filter is removed successfully.
   * - `false`: The video filter fails to be removed.
   */
  virtual bool removeVideoFilter(agora_refptr<IVideoFilter> filter) = 0;

  /**
   * Adds a video renderer to the video track.
   *
   * Add a video renderer in either of the following ways:
   * - Use the built-in video renderer by implementing the `IVideoRenderer` in the `IMediaNodeFactory` class.
   * - Use a customized video renderer by implementing the `IVideoSinkBase` class.
   *
   * @param videoRenderer The video renderer that you want to add: IVideoSinkBase.
   * @param position The position where the renderer is added.
   *
   * @return
   * - `true`: The video renderer is added successfully.
   * - `false`: The video renderer fails to be added.
   */
  virtual bool addRenderer(agora_refptr<IVideoSinkBase> videoRenderer, media::IVideoFrameObserver::VIDEO_OBSERVER_POSITION position = media::IVideoFrameObserver::POSITION_POST_FILTERS) = 0;
  /**
   * Removes the video renderer added by `addRenderer` from the video track.
   *
   * @param videoRenderer The video renderer that you want to remove: IVideoSinkBase.
   * @param position The position where the renderer is removed: #VIDEO_OBSERVER_POSITION.
   * @return
   * - `true`: The video renderer is removed successfully.
   * - `false`: The video renderer fails to be removed.
   */
  virtual bool removeRenderer(agora_refptr<IVideoSinkBase> videoRenderer, media::IVideoFrameObserver::VIDEO_OBSERVER_POSITION position = media::IVideoFrameObserver::POSITION_POST_FILTERS) = 0;
  /**
   * Get the track type of the video track
   * @return
   * - VideoTrackType
   */
  virtual VideoTrackType getType() = 0;

 protected:
  ~IVideoTrack() {}
};

/**
 * Statistics of the local video track.
 */
struct LocalVideoTrackStats {
  uint64_t number_of_streams = 0;
  uint64_t bytes_major_stream = 0;
  uint64_t bytes_minor_stream = 0;
  uint32_t frames_encoded = 0;
  uint32_t ssrc_major_stream = 0;
  uint32_t ssrc_minor_stream = 0;
  int input_frame_rate = 0;
  int encode_frame_rate = 0;
  int render_frame_rate = 0;
  int target_media_bitrate_bps = 0;
  int media_bitrate_bps = 0;
  int total_bitrate_bps = 0;  // Include FEC
  int width = 0;
  int height = 0;
  uint32_t encoder_type = 0;
};

/**
 * `ILocalVideoTrack` is the basic class for local video tracks, providing the main methods of local video tracks.
 * You can create a local video track by calling one of the following methods:
 * - `createCameraVideoTrack`
 * - `createScreenVideoTrack`
 * - `createMixedVideoTrack`
 * - `createCustomVideoTrack`
 * - `createMediaPlayerVideoTrack`
 *
 * After creating local video tracks, you can publish one or more local video tracks by calling \ref agora::rtc::ILocalUser::publishVideo "publishVideo".
 */
class ILocalVideoTrack : public IVideoTrack {
 public:
  /**
   * Enables or disables the local video track.
   *
   * Once the local video track is enabled, the SDK allows for local video capturing, processing, and encoding.
   *
   * @param enable Determines whether to enable the local video track.
   * - `true`: Enable the local video track.
   * - `false`: Disable the local video track.
   */
  virtual void setEnabled(bool enable) = 0;

  /**
   * Sets the video encoder configuration.
   *
   * Each video encoder configuration corresponds to a set of video parameters, including the
   * resolution, frame rate, bitrate, and video orientation.
   *
   * The parameters specified in this method are the maximum values under ideal network conditions. If
   * the video engine cannot render the video using the specified parameters due to poor network
   * conditions, the parameters further down the list are considered until a successful configuration
   * is found.
   *
   * @param config The reference to the video encoder configuration.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setVideoEncoderConfiguration(const VideoEncoderConfiguration& config) = 0;

  /**
   * Enables or disables the simulcast stream mode.
   *
   * @param enabled Determines whether to enable or disable the simulcast stream mode.
   * - `true`: Enable the simulcast stream mode.
   * - `false`: Disable the simulcast stream mode.
   * @param config The reference to the configurations for the simulcast stream mode. The parameters further down the list are considered until a successful configuration "SimulcastStreamConfig".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableSimulcastStream(bool enabled, const SimulcastStreamConfig& config) = 0;

  /**
   * Gets the state of the local video.
   *
   * @return The current state of the local video.
   */
  virtual LOCAL_VIDEO_STREAM_STATE getState() = 0;

  /**
   * Gets the statistics of the local video track.
   *
   * @param[out] stats The reference to the statistics of the local video track.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool getStatistics(LocalVideoTrackStats& stats) = 0;

  virtual VideoTrackType getType() { return LOCAL_VIDEO_TRACK; }

 protected:
  ~ILocalVideoTrack() {}
};
/**
 * The struct of RemoteVideoTrackStats.
 */
struct RemoteVideoTrackStats {
	/**
	 The ID of the remote user.
	 */
	uid_t uid;
	/**
    * The time delay (ms).
    */
	int delay;
	/**
	 * The width of the remote video.
	 */
	int width;
	/**
    * The height of the remote video.
    */
	int height;
	/**
    * The bitrate received in the reported interval.
    */
	int receivedBitrate;
	/** The decoder output frame rate (fps) of the remote video.
	 */
	int decoderOutputFrameRate;
	/** The render output frame rate (fps) of the remote video.
	 */
	int rendererOutputFrameRate;
	/** The video frame loss rate (%) of the remote video stream in the reported interval.
	 */
	int frameLossRate;
	/** Packet loss rate (%) of the remote video stream after using the anti-packet-loss method.
	 */
	int packetLossRate;
   /**
    * The remote video stream type: #REMOTE_VIDEO_STREAM_TYPE.
    */
	REMOTE_VIDEO_STREAM_TYPE rxStreamType;
	/**
	 The total freeze time (ms) of the remote video stream after the remote user joins the channel.
	 In a video session where the frame rate is set to no less than 5 fps, video freeze occurs when
	 the time interval between two adjacent renderable video frames is more than 500 ms.
	 */
	int totalFrozenTime;
	/**
	 The total video freeze time as a percentage (%) of the total time when the video is available.
	 */
	int frozenRate;
	/**
	 The total video decoded frames.
	 */
	uint32_t totalDecodedFrames;
};

/**
 * The IRemoteVideoTrack class.
 */
class IRemoteVideoTrack : public IVideoTrack {
 public:

  /**
   * Gets the statistics of the remote video track.
   * @param[out] stats The reference to the statistics of the remote video track.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool getStatistics(RemoteVideoTrackStats& stats) = 0;
  /**
   * Gets the state of the remote video track.
   * @return The state of the remote video track.
   */
  virtual REMOTE_VIDEO_STATE getState() = 0;
  /**
   * Gets the information of the remote video track.
   * @param[out] info The reference to the information of the remote video track.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool getTrackInfo(VideoTrackInfo& info) = 0;
  /**
   * Registers an \ref agora::rtc::IVideoEncodedImageReceiver "IVideoEncodedImageReceiver" object.
   *
   * You need to implement the `IVideoEncodedImageReceiver` class in this method. Once you successfully register
   * the encoded image receiver, the SDK triggers the \ref agora::rtc::IVideoEncodedImageReceiver::OnEncodedVideoImageReceived "onEncodedVideoImageReceived" callback when it receives the
   * encoded video image.
   *
   * @param videoReceiver The pointer to the `IVideoEncodedImageReceiver` object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int registerVideoEncodedImageReceiver(IVideoEncodedImageReceiver* videoReceiver) = 0;
  /**
   * Releases the \ref agora::rtc::IVideoEncodedImageReceiver "IVideoEncodedImageReceiver" object.
   * @param videoReceiver The pointer to the `IVideoEncodedImageReceiver` object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int unregisterVideoEncodedImageReceiver(IVideoEncodedImageReceiver* videoReceiver) = 0;

  /**
   * Registers an \ref agora::rtc::IMediaPacketReceiver "IMediaPacketReceiver" object.
   *
   * You need to implement the `IMediaPacketReceiver` class in this method. Once you successfully register
   * the media packet receiver, the SDK triggers the \ref agora::rtc::IMediaPacketReceiver::onMediaPacketReceived "onMediaPacketReceived" callback when it receives the
   * video packet.
   *
   * @param videoReceiver The pointer to the `IMediaPacketReceiver` object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int registerMediaPacketReceiver(IMediaPacketReceiver* videoReceiver) = 0;
  /**
   * Releases the \ref agora::rtc::IMediaPacketReceiver "IMediaPacketReceiver" object.
   * @param videoReceiver The pointer to the `IMediaPacketReceiver` object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int unregisterMediaPacketReceiver(IMediaPacketReceiver* videoReceiver) = 0;

  virtual VideoTrackType getType() { return REMOTE_VIDEO_TRACK; }

 protected:
  ~IRemoteVideoTrack() {}
};

}  // namespace rtc
}  // namespace agora
