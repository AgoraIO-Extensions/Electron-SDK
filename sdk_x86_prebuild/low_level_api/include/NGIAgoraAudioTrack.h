
// Copyright (c) 2018 Agora.io. All rights reserved

// This program is confidential and proprietary to Agora.io.
// And may not be copied, reproduced, modified, disclosed to others, published
// or used, in whole or in part, without the express prior written permission
// of Agora.io.

#pragma once  // NOLINT(build/header_guard)

#include "AgoraRefPtr.h"
#include "IAgoraService.h"
#include "NGIAgoraMediaNodeFactory.h"

// FIXME(Ender): use this class instead of AudioSendStream as local track
namespace agora {
namespace rtc {
class IAudioTrackStateObserver;

/**
 * This struct notifies the source of the properties of audio frames to be sent to a sink.
 */
struct AudioSinkWants {
  AudioSinkWants() = default;
  AudioSinkWants(const AudioSinkWants&) = default;
  ~AudioSinkWants() = default;

  /** The sample rate of the audio frame to be sent to the sink. */
  int samplesPerSec;

  /** The number of audio channels of the audio frame to be sent to the sink. */
  size_t channels;
};

/**
 * The IAudioTrack class.
 */
class IAudioTrack : public RefCountInterface {
public:
  /**
   * The position of the audio filter.
   */
  enum AudioFilterPosition {
    Default
  };

 public:
  /**
   * Adjusts the playback volume.
   * @param volume The playback volume. The value ranges between 0 and 100 (default).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int adjustPlayoutVolume(int volume) = 0;

  /**
   * Gets the current playback volume.
   * @param volume A pointer to the playback volume.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getPlayoutVolume(int* volume) = 0;

  /**
   * Adds an audio filter.
   *
   * By adding an audio filter, you can apply various audio effects to the audio, for example, voice change.
   * @param filter A pointer to the audio filter: IAudioFilter.
   * @param position The position of the audio filter: #AudioFilterPosition.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool addAudioFilter(agora_refptr<IAudioFilter> filter, AudioFilterPosition position) = 0;
  /**
   * Removes the audio filter added by callling `addAudioFilter`.
   *
   * @param filter The pointer to the audio filter that you want to remove: IAudioFilter.
   * @param position The position of the audio filter: #AudioFilterPosition.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool removeAudioFilter(agora_refptr<IAudioFilter> filter, AudioFilterPosition position) = 0;

  /**
   * Gets the audio filter by its name.
   *
   * @param name The name of the audio filter.
   * @return
   * - The pointer to the audio filter, if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<IAudioFilter> getAudioFilter(const char *name) const = 0;

  /**
   * Adds an audio sink to get PCM data from the audio track.
   *
   * @param sink The pointer to the audio sink: IAudioSinkBase.
   * @param wants The properties an audio frame should have when it is delivered to the sink. See AudioSinkWants.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool addAudioSink(agora_refptr<IAudioSinkBase> sink, const AudioSinkWants& wants) = 0;

  /**
   * Removes an audio sink.
   *
   * @param sink The pointer to the audio sink to be removed: IAudioSinkBase.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool removeAudioSink(agora_refptr<IAudioSinkBase> sink) = 0;
};

/**
 * `ILocalAudioTrack` is the basic class for local audio tracks, providing main methods of local audio tracks.
 *
 * You can create a local audio track by calling one of the following methods:
 * - `createLocalAudioTrack`
 * - `createCustomAudioTrack`
 * - `createMediaPlayerAudioTrack`
 * @if (!Linux)
 * You can also use the APIs in the \ref agora::rtc::INGAudioDeviceManager "IAudioDeviceManager" class if multiple recording devices are available in the system.
 * @endif
 *
 * After creating local audio tracks, you can publish one or more local audio
 * tracks by calling \ref agora::rtc::ILocalUser::publishAudio "publishAudio".
 */
class ILocalAudioTrack : public IAudioTrack {
 public:
  /**
   * Statistics of a local audio track.
   */
  struct LocalAudioTrackStats {
    /**
     * The source ID of the local audio track.
     */
    uint32_t source_id;
    uint32_t buffered_pcm_data_list_size;
    uint32_t missed_audio_frames;
    uint32_t sent_audio_frames;
    uint32_t pushed_audio_frames;
    uint32_t dropped_audio_frames;
    bool enabled;
  };

 public:
  /**
   * Enables or disables the local audio track.
   *
   * Once the local audio is enabled, the SDK allows for local audio capturing, processing, and encoding.
   *
   * @param enable Whether to enable the audio track:
   * - `true`: Enable the local audio track.
   * - `false`: Disable the local audio track.
   */
  virtual void setEnabled(bool enable) = 0;

  /**
   * Gets whether the local audio track is enabled.
   * @return Whether the local audio track is enabled:
   * - `true`: The local track is enabled.
   * - `false`: The local track is not enabled.
   */
  virtual bool isEnabled() const = 0;

  /**
   * Gets the state of the local audio.
   * @return The state of the local audio: #LOCAL_AUDIO_STREAM_STATE, if the method call succeeds.
   */
  virtual LOCAL_AUDIO_STREAM_STATE getState() = 0;

  /**
   * Gets the statistics of the local audio track: LocalAudioTrackStats.
   * @return The statistics of the local audio: LocalAudioTrackStats, if the method call succeeds.
   */
  virtual LocalAudioTrackStats GetStats() = 0;

  /**
   * Adjusts the audio volume for publishing.
   *
   * @param volume The volume for publishing. The value ranges between 0 and 100 (default).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int adjustPublishVolume(int volume) = 0;

  /**
   * Gets the current volume for publishing.
   * @param volume A pointer to the publishing volume.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getPublishVolume(int* volume) = 0;

  /**
   * Enables or disables local playback.
   * @param enable Whether to enable local playback:
   * - `true`: Enable local playback.
   * - `false`: Disable local playback.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableLocalPlayback(bool enable) = 0;
  /**
   * Enables or disables in-ear monitor.
   * @param enable Whether to enable in-ear monitor:
   * - `true`: Enable in-ear monitor.
   * - `false`: Do not enable in-ear monitor.
   * @param includeAudioFilter Whether to add an audio filter to the in-ear monitor.
   * - `true`: Add an audio filter.
   * - `false`: Do not add an audio filter.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableEarMonitor(bool enable, bool includeAudioFilter) = 0;

 protected:
  ~ILocalAudioTrack() = default;
};

/**
 * Statistics of a remote audio track.
 */
struct RemoteAudioTrackStats {
  /**
   * The user ID of the remote user who sends the audio track.
   */
  uid_t uid;
  /**
   * The audio quality of the remote audio track: #QUALITY_TYPE.
   */
  int quality;
  /**
   * The network delay (ms) from the sender to the receiver.
   */
  int network_transport_delay;
  /**
   * The delay (ms) from the receiver to the jitter buffer.
   */
  uint32_t jitter_buffer_delay;
  /**
   * The audio frame loss rate in the reported interval.
   */
  int audio_loss_rate;
  /**
   * The number of audio channels.
   */
  int num_channels;
  /**
   * The sample rate (Hz) of the received audio track in the reported interval.
   */
  int received_sample_rate;
  /**
   * The average bitrate (Kbps) of the received audio track in the reported interval.
   * */
  int received_bitrate;
  /**
   * The total freeze time (ms) of the remote audio track after the remote user joins the channel.
   * In a session, audio freeze occurs when the audio frame loss rate reaches 4%.
   * The total audio freeze time = The audio freeze number × 2 seconds.
   */
  int total_frozen_time;
  /**
   * The total audio freeze time as a percentage (%) of the total time when the audio is available.
   * */
  int frozen_rate;
  /**
   * The number of audio bytes received.
   */
  int64_t received_bytes;
  /**
   * The average packet waiting time in the jitter buffer (ms)
   */
  int mean_waiting_time;
  /**
   * The samples of expanded speech.
   */
  size_t expanded_speech_samples;
  /**
   * The samples of expanded noise.
   */
  size_t expanded_noise_samples;
  /**
   * The timestamps of since last report.
   */
  uint32_t timestamps_since_last_report;
  /**
   * The min sequence number.
   */
  uint16_t min_sequence_number;
  /**
   * The max sequence number.
   */
  uint16_t max_sequence_number;

  RemoteAudioTrackStats() :
    uid(0),
    quality(0),
    network_transport_delay(0),
    jitter_buffer_delay(0),
    audio_loss_rate(0),
    num_channels(0),
    received_sample_rate(0),
    received_bitrate(0),
    total_frozen_time(0),
    frozen_rate(0),
    received_bytes(0),
    mean_waiting_time(0),
    expanded_speech_samples(0),
    expanded_noise_samples(0),
    timestamps_since_last_report(0),
    min_sequence_number(0xFFFF),
    max_sequence_number(0) { }
};

/**
 * The IRemoteAudioTrack class.
 */
class IRemoteAudioTrack : public IAudioTrack {
 public:
  /**
   * Gets the statistics of the remote audio track.
   * @param stats A reference to the statistics of the remote audio track: RemoteAudioTrackStats.
   * @return
   * - `true`: Success.
   * - `false`: Failure.
   */
  virtual bool getStatistics(RemoteAudioTrackStats& stats) = 0;

  /**
   * Gets the state of the remote audio.
   * @return The state of the remote audio: #REMOTE_AUDIO_STATE, if the method call succeeds.
   */
  virtual REMOTE_AUDIO_STATE getState() = 0;

  /**
   * Registers an `IMediaPacketReceiver` object.
   *
   * You need to implement the `IMediaPacketReceiver` class in this method. Once you successfully register
   * the media packet receiver, the SDK triggers the `onMediaPacketReceived` callback when it receives an
   * audio packet.
   *
   * @param packetReceiver The pointer to the `IMediaPacketReceiver` object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int registerMediaPacketReceiver(IMediaPacketReceiver* packetReceiver) = 0;

  /**
   * Releases the `IMediaPacketReceiver` object.
   * @param packetReceiver The pointer to the `IMediaPacketReceiver` object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int unregisterMediaPacketReceiver(IMediaPacketReceiver* packetReceiver) = 0;
};

}  // namespace rtc
}  // namespace agora
