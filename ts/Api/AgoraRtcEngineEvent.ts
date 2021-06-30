import { ApiTypeEngine } from "./internal/native_type";

import {
  RtcStats,
  QUALITY_TYPE,
  LocalVideoStats,
  LocalAudioStats,
  RemoteVideoStats,
  RemoteAudioStats,
  REMOTE_AUDIO_STATE_REASON,
  REMOTE_VIDEO_STATE,
  REMOTE_VIDEO_STATE_REASON,
  REMOTE_AUDIO_STATE,
  LastmileProbeResult,
  CLIENT_ROLE_TYPE,
  CONNECTION_STATE_TYPE,
  CONNECTION_CHANGED_REASON_TYPE,
  MEDIA_DEVICE_TYPE,
  UserInfo,
  Metadata,
  RTMP_STREAMING_EVENT,
  STREAM_PUBLISH_STATE,
  STREAM_SUBSCRIBE_STATE,
  AudioVolumeInfo,
  AUDIO_MIXING_REASON_TYPE,
  NETWORK_TYPE,
  CHANNEL_MEDIA_RELAY_EVENT,
  CHANNEL_MEDIA_RELAY_STATE,
  CHANNEL_MEDIA_RELAY_ERROR,
  INJECT_STREAM_STATUS,
  MEDIA_DEVICE_STATE_TYPE,
  RTMP_STREAM_PUBLISH_STATE,
  RTMP_STREAM_PUBLISH_ERROR,
  USER_OFFLINE_REASON_TYPE,
  AUDIO_MIXING_STATE_TYPE,
  LOCAL_VIDEO_STREAM_STATE,
  LOCAL_VIDEO_STREAM_ERROR,
  LOCAL_AUDIO_STREAM_STATE,
  LOCAL_AUDIO_STREAM_ERROR,
} from "./types";
import { EngineEvents, VideoSourceEvents } from "../Common/JSEvents";

import { AgoraRtcEngine } from "./AgoraRtcEngine";

/** The AgoraRtcEngine interface. */
declare module "./AgoraRtcEngine" {
  interface AgoraRtcEngine {
    /**
     * Occurs when an API method is executed.
     *
     * `api`: The method executed by the SDK.
     *
     * `err`: Error code that the SDK returns when the method call fails.
     */
    on(
      evt: EngineEvents.API_CALL_EXECUTED,
      cb: (api: string, err: number, result: string) => void
    ): this;
    on(
      evt: EngineEvents.API_ERROR,
      cb: (apiType: ApiTypeEngine, msg: string) => void
    ): this;
    /**
     * Reports a warning during SDK runtime.
     * @param cb.warn Warning code.
     * @param cb.msg The warning message.
     */
    on(
      evt: EngineEvents.WARNING,
      cb: (warn: number, msg: string) => void
    ): this;
    /** Reports an error during SDK runtime.
     * @param cb.err Error code.
     * @param cb.msg The error message.
     */
    on(evt: EngineEvents.ERROR, cb: (err: number, msg: string) => void): this;
    /** Occurs when a user joins a specified channel.
     * @param cb.channel The channel name.
     * @param cb.uid User ID of the user joining the channel.
     * @param cb.elapsed Time elapsed (ms) from the user calling the
     * {@link joinChannel}
     * method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.JOINED_CHANNEL,
      cb: (channel: string, uid: number, elapsed: number) => void
    ): this;
    /** Occurs when a user rejoins the channel after disconnection due to network
     * problems.
     * When a user loses connection with the server because of network problems,
     * the SDK automatically tries to reconnect and triggers this callback upon
     * reconnection.
     * @param cb.channel The channel name.
     * @param cb.uid User ID of the user joining the channel.
     * @param cb.elapsed Time elapsed (ms) from the user calling the
     * {@link joinChannel}
     * method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.REJOIN_CHANNEL_SUCCESS,
      cb: (channel: string, uid: number, elapsed: number) => void
    ): this;
    // on(evt: 'audioQuality', cb: (
    //   uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
    // ) => void): this;
    /**
     * @deprecated Deprecated. Use the `groupAudioVolumeIndication` callback
     * instead.
     */
    on(
      evt: EngineEvents.AUDIO_VOLUME_INDICATION,
      cb: (
        speakers: AudioVolumeInfo[],
        speakerNumber: number,
        totalVolume: number
      ) => void
    ): this;

    /** Occurs when the user leaves the channel. When the app calls the
     * {@link leaveChannel} method, the SDK uses
     * this callback to notify the app when the user leaves the channel.
     */
    on(evt: EngineEvents.LEAVE_CHANNEL, cb: (stats: RtcStats) => void): this;
    /** Reports the statistics of the AgoraRtcEngine once every two seconds.
     *
     * @param cb.stats AgoraRtcEngine's statistics, see {@link RtcStats}
     */
    on(evt: EngineEvents.RTC_STATS, cb: (stats: RtcStats) => void): this;
    /**
     * Reports the statistics of the local video streams.
     *
     * **Note**:
     *
     * If you have called the {@link enableDualStream} method, the
     * localVideoStats callback reports the statistics of the high-video
     * stream (high bitrate, and high-resolution video stream).
     *
     * - stats: The statistics of the local video stream. See
     * {@link LocalVideoStats}.
     */
    on(
      evt: EngineEvents.LOCAL_VIDEO_STATS,
      cb: (stats: LocalVideoStats) => void
    ): this;
    /**
     * Reports the statistics of the local audio streams.
     *
     * The SDK triggers this callback once every two seconds.
     *
     * - stats: The statistics of the local audio stream. See
     * {@link LocalAudioStats}.
     */
    on(
      evt: EngineEvents.LOCAL_AUDIO_STATS,
      cb: (stats: LocalAudioStats) => void
    ): this;
    /** Reports the statistics of the video stream from each remote user/host.
     *
     * @param cb.stats Statistics of the received remote video streams. See
     * {@link RemoteVideoState}.
     */
    on(
      evt: EngineEvents.REMOTE_VIDEO_STATS,
      cb: (stats: RemoteVideoStats) => void
    ): this;
    /** Reports the statistics of the audio stream from each remote user/host.
     *
     * @param cb.stats Statistics of the received remote audio streams. See
     * {@link RemoteAudioStats}.
     */
    on(
      evt: EngineEvents.REMOTE_AUDIO_STATS,
      cb: (stats: RemoteAudioStats) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use remoteVideoStats instead.
     *
     * Reports the transport-layer statistics of each remote video stream.
     *
     * This callback reports the transport-layer statistics, such as the packet
     * loss rate and time delay, once every two seconds
     * after the local user receives the video packet from a remote user.
     * - stats: The transport-layer statistics. See
     * {@link RemoteVideoTransportStats}.
     */
    on(
      evt: EngineEvents.REMOTE_VIDEO_TRANSPORT_STATS,
      cb: (uid: number, delay: number, lost: number, rxKBitRate: number) => void
    ): this;

    /**
     * @deprecated This callback is deprecated. Use remoteAudioStats instead.
     *
     * Reports the transport-layer statistics of each remote audio stream.
     *
     * @param cb.stats The transport-layer statistics. See
     * {@link RemoteAudioTransportStats}.
     */
    on(
      evt: EngineEvents.REMOTE_AUDIO_TRANSPORT_STATS,
      cb: (uid: number, delay: number, lost: number, rxKBitRate: number) => void
    ): this;

    /**
     * Occurs when the audio device state changes.
     * - deviceId: Pointer to the device ID.
     * - deviceType: Device type. See {@link MediaDeviceType}.
     * - deviceState: Device state：
     *
     *  - 1: The device is active
     *  - 2: The device is disabled.
     *  - 4: The device is not present.
     *  - 8: The device is unplugged.
     */
    on(
      evt: EngineEvents.AUDIO_DEVICE_STATE_CHANGED,
      cb: (
        deviceId: string,
        deviceType: MEDIA_DEVICE_TYPE,
        deviceState: MEDIA_DEVICE_STATE_TYPE
      ) => void
    ): this;

    on(evt: EngineEvents.AUDIO_MIXING_FINISHED, cb: () => void): this;
    /** Occurs when the state of the local user's audio mixing file changes.
     * - state: The state code.
     *  - 710: The audio mixing file is playing.
     *  - 711: The audio mixing file pauses playing.
     *  - 713: The audio mixing file stops playing.
     *  - 714: An exception occurs when playing the audio mixing file.
     *
     * - err: The error code.
     *  - 701: The SDK cannot open the audio mixing file.
     *  - 702: The SDK opens the audio mixing file too frequently.
     *  - 703: The audio mixing file playback is interrupted.
     *
     */
    on(
      evt: EngineEvents.AUDIO_MIXING_STATE_CHANGED,
      cb: (
        state: AUDIO_MIXING_STATE_TYPE,
        reason: AUDIO_MIXING_REASON_TYPE
      ) => void
    ): this;
    /** Occurs when a remote user starts audio mixing.
     * When a remote user calls {@link startAudioMixing} to play the background
     * music, the SDK reports this callback.
     */
    on(evt: EngineEvents.REMOTE_AUDIO_MIXING_BEGIN, cb: () => void): this;
    /** Occurs when a remote user finishes audio mixing. */
    on(evt: EngineEvents.REMOTE_AUDIO_MIXING_END, cb: () => void): this;
    /** Occurs when the local audio effect playback finishes. */
    on(
      evt: EngineEvents.AUDIO_EFFECT_FINISHED,
      cb: (soundId: number) => void
    ): this;
    /**
     * This callback is not work.
     *
     * Occurs when the video device state changes.
     * - deviceId: Pointer to the device ID.
     * - deviceType: Device type. See {@link MediaDeviceType}.
     * - deviceState: Device state：
     *
     *  - 1: The device is active.
     *  - 2: The device is disabled.
     *  - 4: The device is not present.
     *  - 8: The device is unplugged.
     */
    on(
      evt: EngineEvents.VIDEO_DEVICE_STATE_CHANGED,
      cb: (
        deviceId: string,
        deviceType: MEDIA_DEVICE_TYPE,
        deviceState: MEDIA_DEVICE_STATE_TYPE
      ) => void
    ): this;
    /**
     * Reports the last mile network quality of each user in the channel
     * once every two seconds.
     *
     * Last mile refers to the connection between the local device and Agora's
     * edge server.
     *
     * @param cb.uid User ID. The network quality of the user with this uid is
     * reported.
     * If uid is 0, the local network quality is reported.
     * @param cb.txquality Uplink transmission quality rating of the user in
     * terms of
     * the transmission bitrate, packet loss rate, average RTT (Round-Trip Time),
     * and jitter of the uplink network. See {@link AgoraNetworkQuality}.
     * @param cb.rxquality Downlink network quality rating of the user in terms
     * of the
     * packet loss rate, average RTT, and jitter of the downlink network.
     * See {@link AgoraNetworkQuality}.
     */
    on(
      evt: EngineEvents.NETWORK_QUALITY,
      cb: (
        uid: number,
        txquality: QUALITY_TYPE,
        rxquality: QUALITY_TYPE
      ) => void
    ): this;
    /** Reports the last mile network quality of the local user once every two
     * seconds before the user joins the channel.
     * - quality: The last mile network quality. See {@link AgoraNetworkQuality}.
     *
     * Last mile refers to the connection between the local device and Agora's
     * edge server. After the application calls the
     * {@link enableLastmileTest} method,
     * this callback reports once every two seconds the uplink and downlink last
     * mile network conditions of the local user before the user joins the
     * channel.
     */
    on(
      evt: EngineEvents.LASTMILE_QUALITY,
      cb: (quality: QUALITY_TYPE) => void
    ): this;
    /** Reports the last-mile network probe result.
     * - result: The uplink and downlink last-mile network probe test result.
     * See {@link LastmileProbeResult}.
     *
     * The SDK triggers this callback within 30 seconds after the app calls
     * the {@link startLastmileProbeTest} method.
     */
    on(
      evt: EngineEvents.LASTMILE_PROBE_RESULT,
      cb: (result: LastmileProbeResult) => void
    ): this;
    /** Occurs when the first local video frame is displayed/rendered on the
     * local video view.
     *
     * - width: Width (px) of the first local video frame.
     * - height: Height (px) of the first local video frame.
     * - elapsed: Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_LOCAL_VIDEO_FRAME,
      cb: (width: number, height: number, elapsed: number) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
     * callback instead.
     *
     * Occurs when the first remote video frame is received and decoded.
     * - uid: User ID of the remote user sending the video stream.
     * - elapsed: Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     * This callback is triggered in either of the following scenarios:
     * - The remote user joins the channel and sends the video stream.
     * - The remote user stops sending the video stream and re-sends it after
     * 15 seconds. Reasons for such an interruption include:
     *  - The remote user leaves the channel.
     *  - The remote user drops offline.
     *  - The remote user calls the {@link muteLocalVideoStream} method to stop
     * sending the video stream.
     *  - The remote user calls the {@link disableVideo} method to disable video.
     */
    on(
      evt: EngineEvents.FIRST_REMOTE_VIDEO_DECODED,
      cb: (uid: number, elapsed: number) => void
    ): this;
    /** Occurs when the video size or rotation of a specified user changes.
     * @param cb.uid User ID of the remote user or local user (0) whose video
     * size or
     * rotation changes.
     * @param cb.width New width (pixels) of the video.
     * @param cb.height New height (pixels) of the video.
     * @param cb.roation New height (pixels) of the video.
     */
    on(
      evt: EngineEvents.VIDEO_SIZE_CHANGED,
      cb: (uid: number, width: number, height: number, rotation: number) => void
    ): this;
    /** @deprecated This callback is deprecated, please use
     * `remoteVideoStateChanged` instead.
     *
     * Occurs when the first remote video frame is rendered.
     *
     * The SDK triggers this callback when the first frame of the remote video
     * is displayed in the user's video window.
     *
     * @param cb.uid User ID of the remote user sending the video stream.
     * @param cb.width Width (pixels) of the video frame.
     * @param cb.height Height (pixels) of the video stream.
     * @param cb.elapsed Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_REMOTE_VIDEO_FRAME,
      cb: (uid: number, width: number, height: number, elapsed: number) => void
    ): this;
    /** Occurs when the first remote video frame is decoded.
     * The SDK triggers this callback when the first frame of the remote video
     * is decoded.
     * - uid: User ID of the remote user sending the video stream.
     * - width: Width (pixels) of the video frame.
     * - height: Height (pixels) of the video stream.
     * - elapsed: Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_REMOTE_VIDEO_DECODED,
      cb: (uid: number, width: number, height: number, elapsed: number) => void
    ): this;
    /** Occurs when a user or host joins the channel.
     *
     * The SDK triggers this callback under one of the following circumstances:
     * - A remote user/host joins the channel by calling the {@link joinChannel}
     * method.
     * - A remote user switches the user role to the host by calling the
     * {@link setClientRole} method after joining the channel.
     * - A remote user/host rejoins the channel after a network interruption.
     * - The host injects an online media stream into the channel by calling
     * the {@link addInjectStreamUrl} method.
     *
     * @note In the `1` (live streaming) profile:
     * - The host receives this callback when another host joins the channel.
     * - The audience in the channel receives this callback when a new host
     * joins the channel.
     * - When a web application joins the channel, the SDK triggers this
     * callback as long as the web application publishes streams.
     *
     * @param cb.uid User ID of the user or host joining the channel.
     * @param cb.elapsed Time delay (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.USER_JOINED,
      cb: (uid: number, elapsed: number) => void
    ): this;
    /** Occurs when a remote user (Communication)/host (Live streaming) leaves
     * the channel.
     *
     * There are two reasons for users to become offline:
     * - Leave the channel: When the user/host leaves the channel, the user/host
     * sends a goodbye message. When this message is received, the SDK determines
     * that the user/host leaves the channel.
     * - Drop offline: When no data packet of the user or host is received for a
     * certain period of time, the SDK assumes that the user/host drops
     * offline. A poor network connection may lead to false detections, so we
     * recommend using the signaling system for reliable offline detection.
     *
     * @param cb.uid ID of the user or host who leaves the channel or goes
     * offline.
     * @param cb.reason Reason why the user goes offline:
     *  - The user left the current channel.
     *  - The SDK timed out and the user dropped offline because no data packet
     * was received within a certain period of time. If a user quits the call
     * and the message is not passed to the SDK (due to an unreliable channel),
     * the SDK assumes the user dropped offline.
     *  - (Live streaming only.) The client role switched from the host to the
     * audience.
     */
    on(
      evt: EngineEvents.USER_OFFLINE,
      cb: (uid: number, reason: USER_OFFLINE_REASON_TYPE) => void
    ): this;
    /** @deprecated This callback is deprecated, please use
     * `remoteAudioStateChanged` instead.
     *
     * Occurs when a remote user's audio stream is muted/unmuted.
     *
     * The SDK triggers this callback when the remote user stops or resumes
     * sending the audio stream by calling the {@link muteLocalAudioStream}
     * method.
     * - uid: User ID of the remote user.
     * - muted: Whether the remote user's audio stream is muted/unmuted:
     *  - true: Muted.
     *  - false: Unmuted.
     */
    on(
      evt: EngineEvents.USER_MUTE_AUDIO,
      cb: (uid: number, muted: boolean) => void
    ): this;

    /**
     * Occurs when a remote user's video stream playback pauses/resumes.
     *
     * The SDK triggers this callback when the remote user stops or resumes
     * sending the video stream by calling the {@link muteLocalVideoStream}
     * method.
     *
     * - uid: User ID of the remote user.
     * - muted: Whether the remote user's video stream playback is paused/resumed:
     *  - true: Paused.
     *  - false: Resumed.
     *
     * **Note**: This callback returns invalid when the number of users in a
     * channel exceeds 20.
     */
    on(
      evt: EngineEvents.USER_MUTE_VIDEO,
      cb: (uid: number, muted: boolean) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
     * callback instead.
     *
     * Occurs when a specific remote user enables/disables the video module.
     *
     * The SDK triggers this callback when the remote user enables or disables
     * the video module by calling the {@link enableVideo} or
     * {@link disableVideo} method.
     * - uid: User ID of the remote user.
     * - enabled: Whether the remote user enables/disables the video module:
     *  - true: Enable. The remote user can enter a video session.
     *  - false: Disable. The remote user can only enter a voice session, and
     * cannot send or receive any video stream.
     */
    on(
      evt: EngineEvents.USER_ENABLE_VIDEO,
      cb: (uid: number, enabled: boolean) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
     * callback instead.
     *
     * Occurs when a specified remote user enables/disables the local video
     * capturing function.
     *
     * The SDK triggers this callback when the remote user resumes or stops
     * capturing the video stream by calling the {@link enableLocalVideo} method.
     * - uid: User ID of the remote user.
     * - enabled: Whether the remote user enables/disables the local video
     * capturing function:
     *  - true: Enable. Other users in the channel can see the video of this
     * remote user.
     *  - false: Disable. Other users in the channel can no longer receive the
     * video stream from this remote user, while this remote user can still
     * receive the video streams from other users.
     */
    on(
      evt: EngineEvents.USER_ENABLE_LOCAL_VIDEO,
      cb: (uid: number, enabled: boolean) => void
    ): this;
    /**
     * @deprecated Replaced by the localVideoStateChanged callback.
     * Occurs when the camera turns on and is ready to capture the video.
     */
    on(evt: EngineEvents.CAMERA_READY, cb: () => void): this;
    /**
     * @deprecated Replaced by the localVideoStateChanged callback.
     * Occurs when the video stops playing.
     */
    on(evt: EngineEvents.VIDEO_STOPPED, cb: () => void): this;
    /** Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds
     * after its connection to the server is interrupted.
     *
     * The SDK triggers this callback when it cannot connect to the server 10
     * seconds after calling the {@link joinChannel} method, whether or not it
     * is in the channel.
     * - If the SDK fails to rejoin the channel 20 minutes after being
     * disconnected from Agora's edge server, the SDK stops rejoining the
     * channel.
     */
    on(evt: EngineEvents.CONNECTION_LOST, cb: () => void): this;

    on(evt: EngineEvents.CONNECTION_INTERRUPTED, cb: () => void): this;
    /**
     * @deprecated Replaced by the connectionStateChanged callback.
     * Occurs when your connection is banned by the Agora Server.
     */
    on(evt: EngineEvents.CONNECTION_BANNED, cb: () => void): this;
    // on(evt: 'refreshRecordingServiceStatus', cb: () => void): this;
    /** Occurs when the local user receives the data stream from the remote
     * user within five seconds.
     *
     * The SDK triggers this callback when the local user receives the stream
     * message that the remote user sends by calling the
     * {@link sendStreamMessage} method.
     * @param cb.uid User ID of the remote user sending the message.
     * @param cb.streamId Stream ID.
     * @param cb.msg The data received bt the local user.
     * @param cb.len Length of the data in bytes.
     */
    on(
      evt: EngineEvents.STREAM_MESSAGE,
      cb: (uid: number, streamId: number, data: string) => void
    ): this;

    on(
      evt: EngineEvents.METADATA_RECEIVED,
      cb: (metadata: Metadata) => void
    ): this;

    /** Occurs when the local user does not receive the data stream from the
     * remote user within five seconds.
     *
     * The SDK triggers this callback when the local user fails to receive the
     * stream message that the remote user sends by calling the
     * {@link sendStreamMessage} method.
     *
     * @param cb.uid User ID of the remote user sending the message.
     * @param cb.streamId Stream ID.
     * @param cb.err Error code.
     * @param cb.missed Number of the lost messages.
     * @param cb.cached Number of incoming cached messages when the data stream
     * is interrupted.
     */
    on(
      evt: EngineEvents.STREAM_MESSAGE_ERROR,
      cb: (
        uid: number,
        streamId: number,
        code: number,
        missed: number,
        cached: number
      ) => void
    ): this;
    /** Occurs when the media engine call starts. */
    on(evt: EngineEvents.MEDIA_ENGINE_START_CALL_SUCCESS, cb: () => void): this;
    /** Occurs when the token expires.
     *
     * After a token(channel key) is specified by calling the {@link joinChannel}
     * method,
     * if the SDK losses connection with the Agora server due to network issues,
     * the token may expire after a certain period
     * of time and a new token may be required to reconnect to the server.
     *
     * This callback notifies the application to generate a new token. Call
     * the {@link renewToken} method to renew the token
     */
    on(evt: EngineEvents.REQUEST_TOKEN, cb: () => void): this;
    /** Occurs when the engine sends the first local audio frame.
     *
     * @deprecated This callback is deprecated from v3.2.0. Use
     * the `firstLocalAudioFramePublished` instead.
     *
     * - elapsed: Time elapsed (ms) from the local user calling
     * {@link joinChannel} until the
     * SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_LOCAL_AUDIO_FRAME,
      cb: (elapsed: number) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Please use
     * `remoteAudioStateChanged` instead.
     *
     * Occurs when the engine receives the first audio frame from a specific
     * remote user.
     * - uid: User ID of the remote user.
     * - elapsed: Time elapsed (ms) from the local user calling
     * {@link joinChannel} until the
     * SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_REMOTE_AUDIO_FRAME,
      cb: (uid: number, elapsed: number) => void
    ): this;
    /** @deprecated This callback is deprecated, please use
     * `remoteAudioStateChanged` instead.
     *
     * Occurs when the engine receives the first audio frame from a specified
     * remote user.
     * @param cb.uid User ID of the remote user sending the audio stream.
     * @param cb.elapsed The time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_REMOTE_AUDIO_DECODED,
      cb: (uid: number, elapsed: number) => void
    ): this;
    /**
     * Reports which user is the loudest speaker.
     *
     * This callback returns the user ID of the user with the highest voice
     * volume during a period of time, instead of at the moment.
     *
     * @note To receive this callback, you need to call the
     * {@link enableAudioVolumeIndication} method.
     *
     * @param cb.uid User ID of the active speaker. A uid of 0 represents the
     * local user.
     * If the user enables the audio volume indication by calling the
     * {@link enableAudioVolumeIndication} method, this callback returns the uid
     * of the
     * active speaker detected by the audio volume detection module of the SDK.
     *
     */
    on(evt: EngineEvents.ACTIVE_SPEAKER, cb: (uid: number) => void): this;
    /** Occurs when the user role switches in a live streaming.
     *
     * For example,
     * from a host to an audience or vice versa.
     *
     * This callback notifies the application of a user role switch when the
     * application calls the {@link setClientRole} method.
     *
     * @param cb.oldRole The old role, see {@link CLIENT_ROLE_TYPE}
     * @param cb.newRole The new role, see {@link CLIENT_ROLE_TYPE}
     */
    on(
      evt: EngineEvents.CLIENT_ROLE_CHANGED,
      cb: (oldRole: CLIENT_ROLE_TYPE, newRole: CLIENT_ROLE_TYPE) => void
    ): this;
    /** Occurs when the volume of the playback device, microphone, or
     * application changes.
     * - deviceType: Device type. See {
     * @link AgoraRtcEngine.MediaDeviceType MediaDeviceType}.
     * - volume: Volume of the device. The value ranges between 0 and 255.
     * - muted:
     *  - true: Volume of the device. The value ranges between 0 and 255.
     *  - false: The audio device is not muted.
     */
    on(
      evt: EngineEvents.AUDIO_DEVICE_VOLUME_CHANGED,
      cb: (
        deviceType: MEDIA_DEVICE_TYPE,
        volume: number,
        muted: boolean
      ) => void
    ): this;
    /** Occurs when the remote video state changes.
     *
     * @param cb.uid ID of the user whose video state changes.
     * @param cb.state State of the remote video.
     * See {@link RemoteVideoState}.
     * @param cb.reason The reason of the remote video state change.
     * See {@link RemoteVideoStateReason}
     * @param cb.elapsed Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.REMOTE_VIDEO_STATE_CHANGED,
      cb: (
        uid: number,
        state: REMOTE_VIDEO_STATE,
        reason: REMOTE_VIDEO_STATE_REASON,
        elapsed: number
      ) => void
    ): this;
    /** Occurs when the camera focus area changes.
     * - x: x coordinate of the changed camera focus area.
     * - y: y coordinate of the changed camera focus area.
     * - width: Width of the changed camera focus area.
     * - height: Height of the changed camera focus area.
     */
    on(
      evt: EngineEvents.CAMERA_FOCUS_AREA_CHANGED,
      cb: (x: number, y: number, width: number, height: number) => void
    ): this;
    /** Occurs when the camera exposure area changes.
     * - x: x coordinate of the changed camera exposure area.
     * - y: y coordinate of the changed camera exposure area.
     * - width: Width of the changed camera exposure area.
     * - height: Height of the changed camera exposure area.
     */
    on(
      evt: EngineEvents.CAMERA_EXPOSURE_AREA_CHANGED,
      cb: (x: number, y: number, width: number, height: number) => void
    ): this;
    /** Occurs when the token expires in 30 seconds.
     *
     * The user becomes offline if the token used in the {@link joinChannel}
     * method expires. The SDK triggers this callback 30 seconds
     * before the token expires to remind the application to get a new token.
     * Upon receiving this callback, generate a new token
     * on the server and call the {@link renewToken} method to pass the new
     * token to the SDK.
     *
     * @param cb.token The token that expires in 30 seconds.
     */
    on(
      evt: EngineEvents.TOKEN_PRIVILEGE_WILL_EXPIRE,
      cb: (token: string) => void
    ): this;
    /** @deprecated This callback is deprecated. Please use
     * `rtmpStreamingStateChanged` instead.
     *
     * Reports the result of CDN live streaming.
     *
     * - url: The RTMP URL address.
     * - error: Error code:
     *  - 0: The publishing succeeds.
     *  - 1: The publishing fails.
     *  - 2: Invalid argument used. For example, you did not call
     * {@link setLiveTranscoding} to configure LiveTranscoding before
     * calling {@link addPublishStreamUrl}.
     *  - 10: The publishing timed out.
     *  - 19: The publishing timed out.
     *  - 130: You cannot publish an encrypted stream.
     */
    on(
      evt: EngineEvents.STREAM_PUBLISHED,
      cb: (url: string, error: number) => void
    ): this;
    /** @deprecated This callback is deprecated. Please use
     * `rtmpStreamingStateChanged` instead.
     *
     * This callback indicates whether you have successfully removed an RTMP
     * stream from the CDN.
     *
     * Reports the result of calling the {@link removePublishStreamUrl} method.
     * - url: The RTMP URL address.
     */
    on(evt: EngineEvents.STREAM_UNPUBLISHED, cb: (url: string) => void): this;
    /**
     * Occurs when the state of the RTMP streaming changes.
     *
     * The SDK triggers this callback to report the result of the local user
     * calling the {@link addPublishStreamUrl} and {@link removePublishStreamUrl}
     * method.
     *
     * This callback indicates the state of the RTMP streaming. When exceptions
     * occur, you can troubleshoot issues by referring to the detailed error
     * descriptions in the `code` parameter.
     * @param cb.url The RTMP URL address.
     * @param cb.state The RTMP streaming state:
     * - `0`: The RTMP streaming has not started or has ended. This state is also
     * triggered after you remove an RTMP address from the CDN by calling
     * {@link removePublishStreamUrl}.
     * - `1`: The SDK is connecting to Agora's streaming server and the RTMP
     * server. This state is triggered after you call the
     * {@link addPublishStreamUrl} method.
     * - `2`: The RTMP streaming publishes. The SDK successfully publishes the
     * RTMP streaming and returns this state.
     * - `3`: The RTMP streaming is recovering. When exceptions occur to the CDN,
     * or the streaming is interrupted, the SDK tries to resume RTMP streaming
     * and returns this state.
     *  - If the SDK successfully resumes the streaming, `2` returns.
     *  - If the streaming does not resume within 60 seconds or server errors
     * occur, `4` returns. You can also reconnect to the server by calling the
     * {@link removePublishStreamUrl} and then {@link addPublishStreamUrl}
     * method.
     * - `4`: The RTMP streaming fails. See the `code` parameter for the
     * detailed error information. You can also call the
     * {@link addPublishStreamUrl} method to publish the RTMP streaming again.
     * @param cb.code The detailed error information:
     * - `0`: The RTMP streaming publishes successfully.
     * - `1`: Invalid argument used.
     * - `2`: The RTMP streams is encrypted and cannot be published.
     * - `3`: Timeout for the RTMP streaming. Call the
     * {@link addPublishStreamUrl} to publish the stream again.
     * - `4`: An error occurs in Agora's streaming server. Call the
     * {@link addPublishStreamUrl} to publish the stream again.
     * - `5`: An error occurs in the RTMP server.
     * - `6`: The RTMP streaming publishes too frequently.
     * - `7`: The host publishes more than 10 URLs. Delete the unnecessary URLs
     * before adding new ones.
     * - `8`: The host manipulates other hosts' URLs. Check your app
     * logic.
     * - `9`: Agora's server fails to find the RTMP stream.
     * - `10`: The format of the stream's URL address is not supported. Check
     * whether the URL format is correct.
     */
    on(
      evt: EngineEvents.RTMP_STREAMING_STATE_CHANGED,
      cb: (
        url: string,
        state: RTMP_STREAM_PUBLISH_STATE,
        errCode: RTMP_STREAM_PUBLISH_ERROR
      ) => void
    ): this;
    /** Occurs when the publisher's transcoding is updated.
     *
     * When the LiveTranscoding class in the setLiveTranscoding method updates,
     * the SDK triggers the transcodingUpdated callback to report the update
     * information to the local host.
     *
     * **Note**: If you call the {@link setLiveTranscoding} method to set the
     * LiveTranscoding class for the first time, the SDK does not trigger the
     * transcodingUpdated callback.
     */
    on(evt: EngineEvents.TRANSCODING_UPDATED, cb: () => void): this;
    /** Occurs when a voice or video stream URL address is added to a live
     * broadcast.
     * - url: Pointer to the URL address of the externally injected stream.
     * - uid: User ID.
     * - status: State of the externally injected stream:
     *  - 0: The external video stream imported successfully.
     *  - 1: The external video stream already exists.
     *  - 2: The external video stream to be imported is unauthorized.
     *  - 3: Import external video stream timeout.
     *  - 4: Import external video stream failed.
     *  - 5: The external video stream stopped importing successfully.
     *  - 6: No external video stream is found.
     *  - 7: No external video stream is found.
     *  - 8: Stop importing external video stream timeout.
     *  - 9: Stop importing external video stream failed.
     *  - 10: The external video stream is corrupted.
     *
     */
    on(
      evt: EngineEvents.STREAM_INJECTED_STATUS,
      cb: (url: string, uid: number, status: number) => void
    ): this;
    /** Occurs when a voice or video stream URL address is added to a live
     * broadcast.
     *
     * @param cb.url The URL address of the externally injected stream.
     * @param cb.uid User ID.
     * @param cb.status State of the externally injected stream:
     *  - 0: The external video stream imported successfully.
     *  - 1: The external video stream already exists.
     *  - 2: The external video stream to be imported is unauthorized.
     *  - 3: Import external video stream timeout.
     *  - 4: Import external video stream failed.
     *  - 5: The external video stream stopped importing successfully.
     *  - 6: No external video stream is found.
     *  - 7: No external video stream is found.
     *  - 8: Stop importing external video stream timeout.
     *  - 9: Stop importing external video stream failed.
     *  - 10: The external video stream is corrupted.
     *
     */
    on(
      evt: EngineEvents.STREAM_INJECTED_STATUS,
      cb: (url: string, uid: number, status: INJECT_STREAM_STATUS) => void
    ): this;
    /** Occurs when the locally published media stream falls back to an
     * audio-only stream due to poor network conditions or switches back
     * to the video after the network conditions improve.
     *
     * If you call {@link setLocalPublishFallbackOption} and set option as
     * AUDIO_ONLY(2), the SDK triggers this callback when
     * the locally published stream falls back to audio-only mode due to poor
     * uplink conditions, or when the audio stream switches back to
     * the video after the uplink network condition improves.
     *
     * - isFallbackOrRecover: Whether the locally published stream falls back to
     * audio-only or switches back to the video:
     *  - true: The locally published stream falls back to audio-only due to poor
     * network conditions.
     *  - false: The locally published stream switches back to the video after
     * the network conditions improve.
     */
    on(
      evt: EngineEvents.LOCAL_PUBLISH_FALLBACK_TO_AUDIO_ONLY,
      cb: (isFallbackOrRecover: boolean) => void
    ): this;
    /** Occurs when the remote media stream falls back to audio-only stream due
     * to poor network conditions or switches back to the video stream after the
     * network conditions improve.
     *
     * If you call {@link setRemoteSubscribeFallbackOption} and set option as
     * AUDIO_ONLY(2), the SDK triggers this callback when
     * the remotely subscribed media stream falls back to audio-only mode due to
     * poor uplink conditions, or when the remotely subscribed media stream
     * switches back to the video after the uplink network condition improves.
     * @param cb.uid ID of the remote user sending the stream.
     * @param cb.isFallbackOrRecover Whether the remote media stream falls back
     * to audio-only or switches back to the video:
     *  - `true`: The remote media stream falls back to audio-only due to poor
     * network conditions.
     *  - `false`: The remote media stream switches back to the video stream
     * after the network conditions improved.
     */
    on(
      evt: EngineEvents.REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY,
      cb: (uid: number, isFallbackOrRecover: boolean) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the localAudioStateChanged
     * callback instead.
     *
     * Occurs when the microphone is enabled/disabled.
     * - enabled: Whether the microphone is enabled/disabled:
     *  - true: Enabled.
     *  - false: Disabled.
     */
    on(
      evt: EngineEvents.MICROPHONE_ENABLED,
      cb: (enabled: boolean) => void
    ): this;
    /** Occurs when the connection state between the SDK and the server changes.
     * @param cb.state The connection state, see {@link ConnectionState}.
     * @param cb.reason The connection reason, see {@link ConnectionState}.
     */
    on(
      evt: EngineEvents.CONNECTION_STATE_CHANGED,
      cb: (
        state: CONNECTION_STATE_TYPE,
        reason: CONNECTION_CHANGED_REASON_TYPE
      ) => void
    ): this;
    /** Occurs when the local user successfully registers a user account by
     * calling the {@link registerLocalUserAccount} method.
     * This callback reports the user ID and user account of the local user.
     * - uid: The ID of the local user.
     * - userAccount: The user account of the local user.
     */
    on(
      evt: EngineEvents.LOCAL_USER_REGISTERED,
      cb: (uid: number, userAccount: string) => void
    ): this;
    /** Occurs when the SDK gets the user ID and user account of the remote user.
     *
     * After a remote user joins the channel, the SDK gets the UID and user
     * account of the remote user, caches them in a mapping table
     * object (UserInfo), and triggers this callback on the local client.
     * - uid: The ID of the remote user.
     * - userInfo: The UserInfo Object that contains the user ID and user
     * account of the remote user.
     */
    on(
      evt: EngineEvents.USER_INFO_UPDATED,
      cb: (uid: number, userInfo: UserInfo) => void
    ): this;
    /**
     * Reserved callback.
     */
    on(
      evt: "uploadLogResult",
      cb: (requestId: string, success: boolean, reason: number) => void
    ): this;
    /**
     * Occurs when the local video state changes.
     *
     * This callback indicates the state of the local video stream, including
     * camera capturing and video encoding, and allows you to troubleshoot
     * issues when exceptions occur.
     *
     * @note Windows: For some device models, the SDK will not trigger this
     * callback when the state of the local video changes while the local video
     * capturing device is in use, so you have to make your own timeout judgment.
     *
     * @param cb.localVideoState The local video state:
     *  - 0: The local video is in the initial state.
     *  - 1: The local video capturer starts successfully. The SDK also reports
     * this state when you share a maximized window by calling
     * {@link startScreenCaptureByWindow}.
     *  - 2:  The first video frame is successfully encoded.
     *  - 3: The local video fails to start.
     *
     * @param cb.error The detailed error information of the local video:
     *  - 0: The local video is normal.
     *  - 1: No specified reason for the local video failure.
     *  - 2: No permission to use the local video device.
     *  - 3: The local video capturer is in use.
     *  - 4: The local video capture fails. Check whether the capturer is
     * working properly.
     *  - 5: The local video encoding fails.
     *  - 11: The shared window is minimized when you call
     * {@link startScreenCaptureByWindow} to share a window.
     *  - 12: The error code indicates that a window shared by the window ID has
     * been closed, or a full-screen window
     * shared by the window ID has exited full-screen mode.
     * After exiting full-screen mode, remote users cannot see the shared window.
     * To prevent remote users from seeing a
     * black screen, Agora recommends that you immediately stop screen sharing.
     * Common scenarios for reporting this error code:
     *   - When the local user closes the shared window, the SDK reports this
     * error code.
     *   - The local user shows some slides in full-screen mode first, and then
     * shares the windows of the slides. After
     * the user exits full-screen mode, the SDK reports this error code.
     *   - The local user watches web video or reads web document in full-screen
     * mode first, and then shares the window of
     * the web video or document. After the user exits full-screen mode, the
     * SDK reports this error code.
     */
    on(
      evt: EngineEvents.LOCAL_VIDEO_STATE_CHANGED,
      cb: (localVideoState: number, error: number) => void
    ): this;
    /**
     * Occurs when the local audio state changes.
     *
     * This callback indicates the state change of the local audio stream,
     * including the state of the audio recording and encoding, and allows you
     * to troubleshoot issues when exceptions occur.
     *
     * **Note**:
     * When the state is 3 in the `state` code, see the `error` code.
     *
     * - state State of the local audio:
     *  - 0: The local audio is in the initial state.
     *  - 1: The recording device starts successfully.
     *  - 2: The first audio frame encodes successfully.
     *  - 3: The local audio fails to start.
     *
     * - error The error information of the local audio:
     *  - 0: The local audio is normal.
     *  - 1: No specified reason for the local audio failure.
     *  - 2: No permission to use the local audio device.
     *  - 3: The microphone is in use.
     *  - 4: The local audio recording fails. Check whether the recording device
     * is working properly.
     *  - 5: The local audio encoding fails.
     */
    on(
      evt: EngineEvents.LOCAL_AUDIO_STATE_CHANGED,
      cb: (state: number, error: number) => void
    ): this;
    /**
     * Occurs when the remote audio state changes.
     *
     * This callback indicates the state change of the remote audio stream.
     *
     * @param cb.uid ID of the remote user whose audio state changes.
     *
     * @param cb.state State of the remote audio:
     * {@link RemoteAudioState}.
     *
     * @param cb.reason The reason of the remote audio state change:
     * {@link RemoteAudioStateReason}.
     *
     * @param cb.elapsed Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.REMOTE_AUDIO_STATE_CHANGED,
      cb: (
        uid: number,
        state: REMOTE_AUDIO_STATE,
        reason: REMOTE_AUDIO_STATE_REASON,
        elapsed: number
      ) => void
    ): this;
    /**
     * Occurs when the state of the media stream relay changes.
     *
     * The SDK reports the state of the current media relay and possible error
     * messages in this callback.
     *
     * @param cb.state The state code. See {@link ChannelMediaRelayState}.
     * @param cb.code The error code. See {@link ChannelMediaRelayError}.
     */
    on(
      evt: EngineEvents.CHANNEL_MEDIA_RELAY_STATE,
      cb: (
        state: CHANNEL_MEDIA_RELAY_STATE,
        code: CHANNEL_MEDIA_RELAY_ERROR
      ) => void
    ): this;
    /**
     * Reports events during the media stream relay.
     *
     * @param cb.code The event code. See {@link ChannelMediaRelayEvent}.
     */
    on(
      evt: EngineEvents.CHANNEL_MEDIA_RELAY_EVENT,
      cb: (code: CHANNEL_MEDIA_RELAY_EVENT) => void
    ): this;
    /** Receives the media metadata.
     *
     * After the sender sends the media metadata by calling the
     * {@link sendMetadata} method and the receiver receives the media metadata,
     * the SDK triggers this callback and reports the metadata to the receiver.
     *
     * @param cb.metadata The media metadata.
     */
    on(
      evt: EngineEvents.METADATA_RECEIVED,
      cb: (metadata: Metadata) => void
    ): this;
    /** Sends the media metadata successfully.
     *
     * After the sender sends the media metadata successfully by calling the
     * {@link sendMetadata} method, the SDK triggers this calback to reports the
     * media metadata to the sender.
     *
     * @param cb.metadata The media metadata.
     */
    on(
      evt: EngineEvents.READY_TO_SEND_METADATA,
      cb: (metadata: Metadata) => void
    ): this;
    /** Occurs when the first audio frame is published.
     *
     * @since v3.2.0
     *
     * The SDK triggers this callback under one of the following circumstances:
     * - The local client enables the audio module and calls {@link joinChannel}
     * successfully.
     * - The local client calls
     * {@link muteLocalAudioStream muteLocalAudioStream(true)} and
     * {@link muteLocalAudioStream muteLocalAudioStream(false)} in sequence.
     * - The local client calls {@link disableAudio} and {@link enableAudio}
     * in sequence.
     *
     * @param cb.elapsed The time elapsed (ms) from the local client calling
     * {@link joinChannel} until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_LOCAL_AUDIO_FRAME_PUBLISHED,
      cb: (elapsed: number) => void
    ): this;
    /** Occurs when the first video frame is published.
     *
     * @since v3.2.0
     *
     * The SDK triggers this callback under one of the following circumstances:
     * - The local client enables the video module and calls {@link joinChannel}
     * successfully.
     * - The local client calls
     * {@link muteLocalVideoStream muteLocalVideoStream(true)}and
     * {@link muteLocalVideoStream muteLocalVideoStream(false)} in sequence.
     * - The local client calls {@link disableVideo} and {@link enableVideo}
     * in sequence.
     *
     * @param cb.elapsed The time elapsed (ms) from the local client calling
     * {@link joinChannel} until the SDK triggers this callback.
     */
    on(
      evt: EngineEvents.FIRST_LOCAL_VIDEO_FRAME_PUBLISHED,
      cb: (elapsed: number) => void
    ): this;
    /** Reports events during the RTMP or RTMPS streaming.
     *
     * @since v3.2.0
     *
     * @param cb.url The RTMP or RTMPS streaming URL.
     * @param cb.eventCode The event code.
     */
    on(
      evt: EngineEvents.RTMP_STREAMING_EVENT,
      cb: (url: string, eventCode: RTMP_STREAMING_EVENT) => void
    ): this;

    /**
     * @TODO 3.4.2 doc
     * @param evt
     * @param cb
     */
    on(
      evt: EngineEvents.NETWORK_TYPE_CHANGED,
      cb: (type: NETWORK_TYPE) => void
    ): this;
    /** Occurs when the audio publishing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the publishing state change of the local audio
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.oldState The previous publishing state.
     * @param cb.newState The current publishing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: EngineEvents.AUDIO_PUBLISH_STATE_CHANGED,
      cb: (
        channel: string,
        oldState: STREAM_PUBLISH_STATE,
        newState: STREAM_PUBLISH_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;
    /** Occurs when the video publishing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the publishing state change of the local video
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.oldState The previous publishing state.
     * @param cb.newState The current publishing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: EngineEvents.VIDEO_PUBLISH_STATE_CHANGED,
      cb: (
        channel: string,
        oldState: STREAM_PUBLISH_STATE,
        newState: STREAM_PUBLISH_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;
    /** Occurs when the audio subscribing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the subscribing state change of a remote audio
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.uid The ID of the remote user.
     * @param cb.oldState The previous subscribing state.
     * @param cb.newState The current subscribing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: EngineEvents.AUDIO_SUBSCRIBE_STATE_CHANGED,
      cb: (
        channel: string,
        uid: number,
        oldState: STREAM_SUBSCRIBE_STATE,
        newState: STREAM_SUBSCRIBE_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;
    /** Occurs when the video subscribing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the subscribing state change of a remote video
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.uid The ID of the remote user.
     * @param cb.oldState The previous subscribing state.
     * @param cb.newState The current subscribing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: EngineEvents.VIDEO_SUBSCRIBE_STATE_CHANGED,
      cb: (
        channel: string,
        uid: number,
        oldState: STREAM_SUBSCRIBE_STATE,
        newState: STREAM_SUBSCRIBE_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;

    on(
      evt: EngineEvents.FIRST_REMOTE_VIDEO_FRAME,
      cb: (
        uid: number,
        channelId: string,
        width: number,
        height: number,
        elapsed: number
      ) => void
    ): this;

    /**
     * Occurs when an API method is executed.
     *
     * `api`: The method executed by the SDK.
     *
     * `err`: Error code that the SDK returns when the method call fails.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_API_CALL_EXECUTED,
      cb: (api: string, err: number, result: string) => void
    ): this;

    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_API_ERROR,
      cb: (apiType: ApiTypeEngine, msg: string) => void
    ): this;
    /**
     * Reports a warning during SDK runtime.
     * @param cb.warn Warning code.
     * @param cb.msg The warning message.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_WARNING,
      cb: (warn: number, msg: string) => void
    ): this;
    /** Reports an error during SDK runtime.
     * @param cb.err Error code.
     * @param cb.msg The error message.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_ERROR,
      cb: (err: number, msg: string) => void
    ): this;
    /** Occurs when a user rejoins the channel after disconnection due to network
     * problems.
     * When a user loses connection with the server because of network problems,
     * the SDK automatically tries to reconnect and triggers this callback upon
     * reconnection.
     * @param cb.channel The channel name.
     * @param cb.uid User ID of the user joining the channel.
     * @param cb.elapsed Time elapsed (ms) from the user calling the
     * {@link joinChannel}
     * method until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REJOIN_CHANNEL_SUCCESS,
      cb: (channel: string, uid: number, elapsed: number) => void
    ): this;

    /** Occurs when the user for sharing screen joined the channel.
     * - uid: The User ID.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_JOIN_CHANNEL_SUCCESS,
      cb: (channel: string, uid: number, elapsed: number) => void
    ): this;

    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LOCAL_AUDIO_STATS,
      cb: (stats: LocalAudioStats) => void
    ): this;

    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LOCAL_VIDEO_STATS,
      cb: (stats: LocalVideoStats) => void
    ): this;

    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_VIDEO_SIZE_CHANGED,
      cb: (uid: number, width: number, height: number, rotation: number) => void
    ): this;

    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_AUDIO_VOLUME_INDICATION,
      cb: (
        speakers: AudioVolumeInfo[],
        speakerNumber: number,
        totalVolume: number
      ) => void
    ): this;

    /** Occurs when the user leaves the channel. When the app calls the
     * {@link leaveChannel} method, the SDK uses
     * this callback to notify the app when the user leaves the channel.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LEAVE_CHANNEL,
      cb: (stats: RtcStats) => void
    ): this;
    /** Reports the statistics of the AgoraRtcEngine once every two seconds.
     *
     * @param cb.stats AgoraRtcEngine's statistics, see {@link RtcStats}
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_RTC_STATS,
      cb: (stats: RtcStats) => void
    ): this;

    /** Reports the statistics of the video stream from each remote user/host.
     *
     * @param cb.stats Statistics of the received remote video streams. See
     * {@link RemoteVideoState}.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REMOTE_VIDEO_STATS,
      cb: (stats: RemoteVideoStats) => void
    ): this;
    /** Reports the statistics of the audio stream from each remote user/host.
     *
     * @param cb.stats Statistics of the received remote audio streams. See
     * {@link RemoteAudioStats}.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REMOTE_AUDIO_STATS,
      cb: (stats: RemoteAudioStats) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use remoteVideoStats instead.
     *
     * Reports the transport-layer statistics of each remote video stream.
     *
     * This callback reports the transport-layer statistics, such as the packet
     * loss rate and time delay, once every two seconds
     * after the local user receives the video packet from a remote user.
     * - stats: The transport-layer statistics. See
     * {@link RemoteVideoTransportStats}.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REMOTE_VIDEO_TRANSPORT_STATS,
      cb: (uid: number, delay: number, lost: number, rxKBitRate: number) => void
    ): this;

    /**
     * @deprecated This callback is deprecated. Use remoteAudioStats instead.
     *
     * Reports the transport-layer statistics of each remote audio stream.
     *
     * @param cb.stats The transport-layer statistics. See
     * {@link RemoteAudioTransportStats}.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REMOTE_AUDIO_TRANSPORT_STATS,
      cb: (uid: number, delay: number, lost: number, rxKBitRate: number) => void
    ): this;

    /**
     * Occurs when the audio device state changes.
     * - deviceId: Pointer to the device ID.
     * - deviceType: Device type. See {@link MediaDeviceType}.
     * - deviceState: Device state：
     *
     *  - 1: The device is active
     *  - 2: The device is disabled.
     *  - 4: The device is not present.
     *  - 8: The device is unplugged.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_AUDIO_DEVICE_STATE_CHANGED,
      cb: (
        deviceId: string,
        deviceType: MEDIA_DEVICE_TYPE,
        deviceState: MEDIA_DEVICE_STATE_TYPE
      ) => void
    ): this;
    /** Occurs when the local audio effect playback finishes. */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_AUDIO_EFFECT_FINISHED,
      cb: (soundId: number) => void
    ): this;
    /**
     * This callback is not work.
     *
     * Occurs when the video device state changes.
     * - deviceId: Pointer to the device ID.
     * - deviceType: Device type. See {@link MediaDeviceType}.
     * - deviceState: Device state：
     *
     *  - 1: The device is active.
     *  - 2: The device is disabled.
     *  - 4: The device is not present.
     *  - 8: The device is unplugged.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_VIDEO_DEVICE_STATE_CHANGED,
      cb: (
        deviceId: string,
        deviceType: MEDIA_DEVICE_TYPE,
        deviceState: MEDIA_DEVICE_STATE_TYPE
      ) => void
    ): this;
    /**
     * Reports the last mile network quality of each user in the channel
     * once every two seconds.
     *
     * Last mile refers to the connection between the local device and Agora's
     * edge server.
     *
     * @param cb.uid User ID. The network quality of the user with this uid is
     * reported.
     * If uid is 0, the local network quality is reported.
     * @param cb.txquality Uplink transmission quality rating of the user in
     * terms of
     * the transmission bitrate, packet loss rate, average RTT (Round-Trip Time),
     * and jitter of the uplink network. See {@link AgoraNetworkQuality}.
     * @param cb.rxquality Downlink network quality rating of the user in terms
     * of the
     * packet loss rate, average RTT, and jitter of the downlink network.
     * See {@link AgoraNetworkQuality}.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_NETWORK_QUALITY,
      cb: (
        uid: number,
        txquality: QUALITY_TYPE,
        rxquality: QUALITY_TYPE
      ) => void
    ): this;

    /**
     * @TODO 3.4.2 doc
     * @param evt
     * @param cb
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_NETWORK_TYPE_CHANGED,
      cb: (type: NETWORK_TYPE) => void
    ): this;
    /** Reports the last mile network quality of the local user once every two
     * seconds before the user joins the channel.
     * - quality: The last mile network quality. See {@link AgoraNetworkQuality}.
     *
     * Last mile refers to the connection between the local device and Agora's
     * edge server. After the application calls the
     * {@link enableLastmileTest} method,
     * this callback reports once every two seconds the uplink and downlink last
     * mile network conditions of the local user before the user joins the
     * channel.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LASTMILE_QUALITY,
      cb: (quality: QUALITY_TYPE) => void
    ): this;
    /** Reports the last-mile network probe result.
     * - result: The uplink and downlink last-mile network probe test result.
     * See {@link LastmileProbeResult}.
     *
     * The SDK triggers this callback within 30 seconds after the app calls
     * the {@link startLastmileProbeTest} method.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LASTMILE_PROBE_RESULT,
      cb: (result: LastmileProbeResult) => void
    ): this;
    /** Occurs when the first local video frame is displayed/rendered on the
     * local video view.
     *
     * - width: Width (px) of the first local video frame.
     * - height: Height (px) of the first local video frame.
     * - elapsed: Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_LOCAL_VIDEO_FRAME,
      cb: (width: number, height: number, elapsed: number) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
     * callback instead.
     *
     * Occurs when the first remote video frame is received and decoded.
     * - uid: User ID of the remote user sending the video stream.
     * - elapsed: Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     * This callback is triggered in either of the following scenarios:
     * - The remote user joins the channel and sends the video stream.
     * - The remote user stops sending the video stream and re-sends it after
     * 15 seconds. Reasons for such an interruption include:
     *  - The remote user leaves the channel.
     *  - The remote user drops offline.
     *  - The remote user calls the {@link muteLocalVideoStream} method to stop
     * sending the video stream.
     *  - The remote user calls the {@link disableVideo} method to disable video.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_REMOTE_VIDEO_DECODED,
      cb: (uid: number, width: number, height: number, elapsed: number) => void
    ): this;
    /** @deprecated This callback is deprecated, please use
     * `remoteVideoStateChanged` instead.
     *
     * Occurs when the first remote video frame is rendered.
     *
     * The SDK triggers this callback when the first frame of the remote video
     * is displayed in the user's video window.
     *
     * @param cb.uid User ID of the remote user sending the video stream.
     * @param cb.width Width (pixels) of the video frame.
     * @param cb.height Height (pixels) of the video stream.
     * @param cb.elapsed Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_REMOTE_VIDEO_FRAME,
      cb: (uid: number, width: number, height: number, elapsed: number) => void
    ): this;
    /** Occurs when a user or host joins the channel.
     *
     * The SDK triggers this callback under one of the following circumstances:
     * - A remote user/host joins the channel by calling the {@link joinChannel}
     * method.
     * - A remote user switches the user role to the host by calling the
     * {@link setClientRole} method after joining the channel.
     * - A remote user/host rejoins the channel after a network interruption.
     * - The host injects an online media stream into the channel by calling
     * the {@link addInjectStreamUrl} method.
     *
     * @note In the `1` (live streaming) profile:
     * - The host receives this callback when another host joins the channel.
     * - The audience in the channel receives this callback when a new host
     * joins the channel.
     * - When a web application joins the channel, the SDK triggers this
     * callback as long as the web application publishes streams.
     *
     * @param cb.uid User ID of the user or host joining the channel.
     * @param cb.elapsed Time delay (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_USER_JOINED,
      cb: (uid: number, elapsed: number) => void
    ): this;
    /** Occurs when a remote user (Communication)/host (Live streaming) leaves
     * the channel.
     *
     * There are two reasons for users to become offline:
     * - Leave the channel: When the user/host leaves the channel, the user/host
     * sends a goodbye message. When this message is received, the SDK determines
     * that the user/host leaves the channel.
     * - Drop offline: When no data packet of the user or host is received for a
     * certain period of time, the SDK assumes that the user/host drops
     * offline. A poor network connection may lead to false detections, so we
     * recommend using the signaling system for reliable offline detection.
     *
     * @param cb.uid ID of the user or host who leaves the channel or goes
     * offline.
     * @param cb.reason Reason why the user goes offline:
     *  - The user left the current channel.
     *  - The SDK timed out and the user dropped offline because no data packet
     * was received within a certain period of time. If a user quits the call
     * and the message is not passed to the SDK (due to an unreliable channel),
     * the SDK assumes the user dropped offline.
     *  - (Live streaming only.) The client role switched from the host to the
     * audience.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_USER_OFFLINE,
      cb: (uid: number, reason: USER_OFFLINE_REASON_TYPE) => void
    ): this;

    /**
     * Occurs when a remote user's video stream playback pauses/resumes.
     *
     * The SDK triggers this callback when the remote user stops or resumes
     * sending the video stream by calling the {@link muteLocalVideoStream}
     * method.
     *
     * - uid: User ID of the remote user.
     * - muted: Whether the remote user's video stream playback is paused/resumed:
     *  - true: Paused.
     *  - false: Resumed.
     *
     * **Note**: This callback returns invalid when the number of users in a
     * channel exceeds 20.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_USER_MUTE_VIDEO,
      cb: (uid: number, muted: boolean) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
     * callback instead.
     *
     * Occurs when a specific remote user enables/disables the video module.
     *
     * The SDK triggers this callback when the remote user enables or disables
     * the video module by calling the {@link enableVideo} or
     * {@link disableVideo} method.
     * - uid: User ID of the remote user.
     * - enabled: Whether the remote user enables/disables the video module:
     *  - true: Enable. The remote user can enter a video session.
     *  - false: Disable. The remote user can only enter a voice session, and
     * cannot send or receive any video stream.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_USER_ENABLE_VIDEO,
      cb: (uid: number, enabled: boolean) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
     * callback instead.
     *
     * Occurs when a specified remote user enables/disables the local video
     * capturing function.
     *
     * The SDK triggers this callback when the remote user resumes or stops
     * capturing the video stream by calling the {@link enableLocalVideo} method.
     * - uid: User ID of the remote user.
     * - enabled: Whether the remote user enables/disables the local video
     * capturing function:
     *  - true: Enable. Other users in the channel can see the video of this
     * remote user.
     *  - false: Disable. Other users in the channel can no longer receive the
     * video stream from this remote user, while this remote user can still
     * receive the video streams from other users.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_USER_ENABLE_LOCAL_VIDEO,
      cb: (uid: number, enabled: boolean) => void
    ): this;
    /**
     * @deprecated Replaced by the localVideoStateChanged callback.
     * Occurs when the camera turns on and is ready to capture the video.
     */
    on(evt: VideoSourceEvents.VIDEO_SOURCE_CAMERA_READY, cb: () => void): this;
    /**
     * @deprecated Replaced by the localVideoStateChanged callback.
     * Occurs when the video stops playing.
     */
    on(evt: VideoSourceEvents.VIDEO_SOURCE_VIDEO_STOPPED, cb: () => void): this;
    /** Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds
     * after its connection to the server is interrupted.
     *
     * The SDK triggers this callback when it cannot connect to the server 10
     * seconds after calling the {@link joinChannel} method, whether or not it
     * is in the channel.
     * - If the SDK fails to rejoin the channel 20 minutes after being
     * disconnected from Agora's edge server, the SDK stops rejoining the
     * channel.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_CONNECTION_LOST,
      cb: () => void
    ): this;

    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_CONNECTION_INTERRUPTED,
      cb: () => void
    ): this;
    /**
     * @deprecated Replaced by the connectionStateChanged callback.
     * Occurs when your connection is banned by the Agora Server.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_CONNECTION_BANNED,
      cb: () => void
    ): this;

    /** Occurs when the media engine call starts. */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_MEDIA_ENGINE_START_CALL_SUCCESS,
      cb: () => void
    ): this;
    /** Occurs when the token expires.
     *
     * After a token(channel key) is specified by calling the {@link joinChannel}
     * method,
     * if the SDK losses connection with the Agora server due to network issues,
     * the token may expire after a certain period
     * of time and a new token may be required to reconnect to the server.
     *
     * This callback notifies the application to generate a new token. Call
     * the {@link renewToken} method to renew the token
     */
    on(evt: VideoSourceEvents.VIDEO_SOURCE_REQUEST_TOKEN, cb: () => void): this;
    /** Occurs when the engine sends the first local audio frame.
     *
     * @deprecated This callback is deprecated from v3.2.0. Use
     * the `firstLocalAudioFramePublished` instead.
     *
     * - elapsed: Time elapsed (ms) from the local user calling
     * {@link joinChannel} until the
     * SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_LOCAL_AUDIO_FRAME,
      cb: (elapsed: number) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Please use
     * `remoteAudioStateChanged` instead.
     *
     * Occurs when the engine receives the first audio frame from a specific
     * remote user.
     * - uid: User ID of the remote user.
     * - elapsed: Time elapsed (ms) from the local user calling
     * {@link joinChannel} until the
     * SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_REMOTE_AUDIO_FRAME,
      cb: (uid: number, elapsed: number) => void
    ): this;
    /** @deprecated This callback is deprecated, please use
     * `remoteAudioStateChanged` instead.
     *
     * Occurs when the engine receives the first audio frame from a specified
     * remote user.
     * @param cb.uid User ID of the remote user sending the audio stream.
     * @param cb.elapsed The time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_REMOTE_AUDIO_DECODED,
      cb: (uid: number, elapsed: number) => void
    ): this;
    /**
     * Reports which user is the loudest speaker.
     *
     * This callback returns the user ID of the user with the highest voice
     * volume during a period of time, instead of at the moment.
     *
     * @note To receive this callback, you need to call the
     * {@link enableAudioVolumeIndication} method.
     *
     * @param cb.uid User ID of the active speaker. A uid of 0 represents the
     * local user.
     * If the user enables the audio volume indication by calling the
     * {@link enableAudioVolumeIndication} method, this callback returns the uid
     * of the
     * active speaker detected by the audio volume detection module of the SDK.
     *
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_ACTIVE_SPEAKER,
      cb: (uid: number) => void
    ): this;
    /** Occurs when the user role switches in a live streaming.
     *
     * For example,
     * from a host to an audience or vice versa.
     *
     * This callback notifies the application of a user role switch when the
     * application calls the {@link setClientRole} method.
     *
     * @param cb.oldRole The old role, see {@link CLIENT_ROLE_TYPE}
     * @param cb.newRole The new role, see {@link CLIENT_ROLE_TYPE}
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_CLIENT_ROLE_CHANGED,
      cb: (oldRole: CLIENT_ROLE_TYPE, newRole: CLIENT_ROLE_TYPE) => void
    ): this;
    /** Occurs when the volume of the playback device, microphone, or
     * application changes.
     * - deviceType: Device type. See {
     * @link AgoraRtcEngine.MediaDeviceType MediaDeviceType}.
     * - volume: Volume of the device. The value ranges between 0 and 255.
     * - muted:
     *  - true: Volume of the device. The value ranges between 0 and 255.
     *  - false: The audio device is not muted.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_AUDIO_DEVICE_VOLUME_CHANGED,
      cb: (
        deviceType: MEDIA_DEVICE_TYPE,
        volume: number,
        muted: boolean
      ) => void
    ): this;

    /** Occurs when the remote video state changes.
     *
     * @param cb.uid ID of the user whose video state changes.
     * @param cb.state State of the remote video.
     * See {@link RemoteVideoState}.
     * @param cb.reason The reason of the remote video state change.
     * See {@link RemoteVideoStateReason}
     * @param cb.elapsed Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REMOTE_VIDEO_STATE_CHANGED,
      cb: (
        uid: number,
        state: REMOTE_VIDEO_STATE,
        reason: REMOTE_VIDEO_STATE_REASON,
        elapsed: number
      ) => void
    ): this;
    /** Occurs when the camera focus area changes.
     * - x: x coordinate of the changed camera focus area.
     * - y: y coordinate of the changed camera focus area.
     * - width: Width of the changed camera focus area.
     * - height: Height of the changed camera focus area.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_CAMERA_FOCUS_AREA_CHANGED,
      cb: (x: number, y: number, width: number, height: number) => void
    ): this;
    /** Occurs when the camera exposure area changes.
     * - x: x coordinate of the changed camera exposure area.
     * - y: y coordinate of the changed camera exposure area.
     * - width: Width of the changed camera exposure area.
     * - height: Height of the changed camera exposure area.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_CAMERA_EXPOSURE_AREA_CHANGED,
      cb: (x: number, y: number, width: number, height: number) => void
    ): this;
    /** Occurs when the token expires in 30 seconds.
     *
     * The user becomes offline if the token used in the {@link joinChannel}
     * method expires. The SDK triggers this callback 30 seconds
     * before the token expires to remind the application to get a new token.
     * Upon receiving this callback, generate a new token
     * on the server and call the {@link renewToken} method to pass the new
     * token to the SDK.
     *
     * @param cb.token The token that expires in 30 seconds.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_TOKEN_PRIVILEGE_WILL_EXPIRE,
      cb: (token: string) => void
    ): this;
    /** @deprecated This callback is deprecated. Please use
     * `rtmpStreamingStateChanged` instead.
     *
     * Reports the result of CDN live streaming.
     *
     * - url: The RTMP URL address.
     * - error: Error code:
     *  - 0: The publishing succeeds.
     *  - 1: The publishing fails.
     *  - 2: Invalid argument used. For example, you did not call
     * {@link setLiveTranscoding} to configure LiveTranscoding before
     * calling {@link addPublishStreamUrl}.
     *  - 10: The publishing timed out.
     *  - 19: The publishing timed out.
     *  - 130: You cannot publish an encrypted stream.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_STREAM_PUBLISHED,
      cb: (url: string, error: number) => void
    ): this;
    /** @deprecated This callback is deprecated. Please use
     * `rtmpStreamingStateChanged` instead.
     *
     * This callback indicates whether you have successfully removed an RTMP
     * stream from the CDN.
     *
     * Reports the result of calling the {@link removePublishStreamUrl} method.
     * - url: The RTMP URL address.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_STREAM_UNPUBLISHED,
      cb: (url: string) => void
    ): this;

    /** Occurs when a voice or video stream URL address is added to a live
     * broadcast.
     * - url: Pointer to the URL address of the externally injected stream.
     * - uid: User ID.
     * - status: State of the externally injected stream:
     *  - 0: The external video stream imported successfully.
     *  - 1: The external video stream already exists.
     *  - 2: The external video stream to be imported is unauthorized.
     *  - 3: Import external video stream timeout.
     *  - 4: Import external video stream failed.
     *  - 5: The external video stream stopped importing successfully.
     *  - 6: No external video stream is found.
     *  - 7: No external video stream is found.
     *  - 8: Stop importing external video stream timeout.
     *  - 9: Stop importing external video stream failed.
     *  - 10: The external video stream is corrupted.
     *
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_STREAM_INJECTED_STATUS,
      cb: (url: string, uid: number, status: number) => void
    ): this;
    /** Occurs when the locally published media stream falls back to an
     * audio-only stream due to poor network conditions or switches back
     * to the video after the network conditions improve.
     *
     * If you call {@link setLocalPublishFallbackOption} and set option as
     * AUDIO_ONLY(2), the SDK triggers this callback when
     * the locally published stream falls back to audio-only mode due to poor
     * uplink conditions, or when the audio stream switches back to
     * the video after the uplink network condition improves.
     *
     * - isFallbackOrRecover: Whether the locally published stream falls back to
     * audio-only or switches back to the video:
     *  - true: The locally published stream falls back to audio-only due to poor
     * network conditions.
     *  - false: The locally published stream switches back to the video after
     * the network conditions improve.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LOCAL_PUBLISH_FALLBACK_TO_AUDIO_ONLY,
      cb: (isFallbackOrRecover: boolean) => void
    ): this;
    /** Occurs when the remote media stream falls back to audio-only stream due
     * to poor network conditions or switches back to the video stream after the
     * network conditions improve.
     *
     * If you call {@link setRemoteSubscribeFallbackOption} and set option as
     * AUDIO_ONLY(2), the SDK triggers this callback when
     * the remotely subscribed media stream falls back to audio-only mode due to
     * poor uplink conditions, or when the remotely subscribed media stream
     * switches back to the video after the uplink network condition improves.
     * @param cb.uid ID of the remote user sending the stream.
     * @param cb.isFallbackOrRecover Whether the remote media stream falls back
     * to audio-only or switches back to the video:
     *  - `true`: The remote media stream falls back to audio-only due to poor
     * network conditions.
     *  - `false`: The remote media stream switches back to the video stream
     * after the network conditions improved.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY,
      cb: (uid: number, isFallbackOrRecover: boolean) => void
    ): this;
    /**
     * @deprecated This callback is deprecated. Use the localAudioStateChanged
     * callback instead.
     *
     * Occurs when the microphone is enabled/disabled.
     * - enabled: Whether the microphone is enabled/disabled:
     *  - true: Enabled.
     *  - false: Disabled.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_MICROPHONE_ENABLED,
      cb: (enabled: boolean) => void
    ): this;
    /** Occurs when the connection state between the SDK and the server changes.
     * @param cb.state The connection state, see {@link ConnectionState}.
     * @param cb.reason The connection reason, see {@link ConnectionState}.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_CONNECTION_STATE_CHANGED,
      cb: (
        state: CONNECTION_STATE_TYPE,
        reason: CONNECTION_CHANGED_REASON_TYPE
      ) => void
    ): this;
    /**
     * Occurs when the local video state changes.
     *
     * This callback indicates the state of the local video stream, including
     * camera capturing and video encoding, and allows you to troubleshoot
     * issues when exceptions occur.
     *
     * @note Windows: For some device models, the SDK will not trigger this
     * callback when the state of the local video changes while the local video
     * capturing device is in use, so you have to make your own timeout judgment.
     *
     * @param cb.localVideoState The local video state:
     *  - 0: The local video is in the initial state.
     *  - 1: The local video capturer starts successfully. The SDK also reports
     * this state when you share a maximized window by calling
     * {@link startScreenCaptureByWindow}.
     *  - 2:  The first video frame is successfully encoded.
     *  - 3: The local video fails to start.
     *
     * @param cb.error The detailed error information of the local video:
     *  - 0: The local video is normal.
     *  - 1: No specified reason for the local video failure.
     *  - 2: No permission to use the local video device.
     *  - 3: The local video capturer is in use.
     *  - 4: The local video capture fails. Check whether the capturer is
     * working properly.
     *  - 5: The local video encoding fails.
     *  - 11: The shared window is minimized when you call
     * {@link startScreenCaptureByWindow} to share a window.
     *  - 12: The error code indicates that a window shared by the window ID has
     * been closed, or a full-screen window
     * shared by the window ID has exited full-screen mode.
     * After exiting full-screen mode, remote users cannot see the shared window.
     * To prevent remote users from seeing a
     * black screen, Agora recommends that you immediately stop screen sharing.
     * Common scenarios for reporting this error code:
     *   - When the local user closes the shared window, the SDK reports this
     * error code.
     *   - The local user shows some slides in full-screen mode first, and then
     * shares the windows of the slides. After
     * the user exits full-screen mode, the SDK reports this error code.
     *   - The local user watches web video or reads web document in full-screen
     * mode first, and then shares the window of
     * the web video or document. After the user exits full-screen mode, the
     * SDK reports this error code.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LOCAL_VIDEO_STATE_CHANGED,
      cb: (
        localVideoState: LOCAL_VIDEO_STREAM_STATE,
        error: LOCAL_VIDEO_STREAM_ERROR
      ) => void
    ): this;
    /**
     * Occurs when the local audio state changes.
     *
     * This callback indicates the state change of the local audio stream,
     * including the state of the audio recording and encoding, and allows you
     * to troubleshoot issues when exceptions occur.
     *
     * **Note**:
     * When the state is 3 in the `state` code, see the `error` code.
     *
     * - state State of the local audio:
     *  - 0: The local audio is in the initial state.
     *  - 1: The recording device starts successfully.
     *  - 2: The first audio frame encodes successfully.
     *  - 3: The local audio fails to start.
     *
     * - error The error information of the local audio:
     *  - 0: The local audio is normal.
     *  - 1: No specified reason for the local audio failure.
     *  - 2: No permission to use the local audio device.
     *  - 3: The microphone is in use.
     *  - 4: The local audio recording fails. Check whether the recording device
     * is working properly.
     *  - 5: The local audio encoding fails.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_LOCAL_AUDIO_STATE_CHANGED,
      cb: (
        state: LOCAL_AUDIO_STREAM_STATE,
        error: LOCAL_AUDIO_STREAM_ERROR
      ) => void
    ): this;
    /**
     * Occurs when the remote audio state changes.
     *
     * This callback indicates the state change of the remote audio stream.
     *
     * @param cb.uid ID of the remote user whose audio state changes.
     *
     * @param cb.state State of the remote audio:
     * {@link RemoteAudioState}.
     *
     * @param cb.reason The reason of the remote audio state change:
     * {@link RemoteAudioStateReason}.
     *
     * @param cb.elapsed Time elapsed (ms) from the local user calling the
     * {@link joinChannel} method until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_REMOTE_AUDIO_STATE_CHANGED,
      cb: (
        uid: number,
        state: REMOTE_AUDIO_STATE,
        reason: REMOTE_AUDIO_STATE_REASON,
        elapsed: number
      ) => void
    ): this;
    /** Occurs when the first audio frame is published.
     *
     * @since v3.2.0
     *
     * The SDK triggers this callback under one of the following circumstances:
     * - The local client enables the audio module and calls {@link joinChannel}
     * successfully.
     * - The local client calls
     * {@link muteLocalAudioStream muteLocalAudioStream(true)} and
     * {@link muteLocalAudioStream muteLocalAudioStream(false)} in sequence.
     * - The local client calls {@link disableAudio} and {@link enableAudio}
     * in sequence.
     *
     * @param cb.elapsed The time elapsed (ms) from the local client calling
     * {@link joinChannel} until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_LOCAL_AUDIO_FRAME_PUBLISHED,
      cb: (elapsed: number) => void
    ): this;
    /** Occurs when the first video frame is published.
     *
     * @since v3.2.0
     *
     * The SDK triggers this callback under one of the following circumstances:
     * - The local client enables the video module and calls {@link joinChannel}
     * successfully.
     * - The local client calls
     * {@link muteLocalVideoStream muteLocalVideoStream(true)}and
     * {@link muteLocalVideoStream muteLocalVideoStream(false)} in sequence.
     * - The local client calls {@link disableVideo} and {@link enableVideo}
     * in sequence.
     *
     * @param cb.elapsed The time elapsed (ms) from the local client calling
     * {@link joinChannel} until the SDK triggers this callback.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_FIRST_LOCAL_VIDEO_FRAME_PUBLISHED,
      cb: (elapsed: number) => void
    ): this;
    /** Reports events during the RTMP or RTMPS streaming.
     *
     * @since v3.2.0
     *
     * @param cb.url The RTMP or RTMPS streaming URL.
     * @param cb.eventCode The event code.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_RTMP_STREAMING_EVENT,
      cb: (url: string, eventCode: RTMP_STREAMING_EVENT) => void
    ): this;
    /** Occurs when the audio publishing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the publishing state change of the local audio
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.oldState The previous publishing state.
     * @param cb.newState The current publishing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_AUDIO_PUBLISH_STATE_CHANGED,
      cb: (
        channel: string,
        oldState: STREAM_PUBLISH_STATE,
        newState: STREAM_PUBLISH_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;
    /** Occurs when the video publishing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the publishing state change of the local video
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.oldState The previous publishing state.
     * @param cb.newState The current publishing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_VIDEO_PUBLISH_STATE_CHANGED,
      cb: (
        channel: string,
        oldState: STREAM_PUBLISH_STATE,
        newState: STREAM_PUBLISH_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;
    /** Occurs when the audio subscribing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the subscribing state change of a remote audio
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.uid The ID of the remote user.
     * @param cb.oldState The previous subscribing state.
     * @param cb.newState The current subscribing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_AUDIO_SUBSCRIBE_STATE_CHANGED,
      cb: (
        channel: string,
        uid: number,
        oldState: STREAM_SUBSCRIBE_STATE,
        newState: STREAM_SUBSCRIBE_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;
    /** Occurs when the video subscribing state changes.
     *
     * @since v3.2.0
     *
     * This callback indicates the subscribing state change of a remote video
     * stream.
     *
     * @param cb.channel The channel name.
     * @param cb.uid The ID of the remote user.
     * @param cb.oldState The previous subscribing state.
     * @param cb.newState The current subscribing state.
     * @param cb.elapseSinceLastState The time elapsed (ms) from the previous state
     * to the current state.
     */
    on(
      evt: VideoSourceEvents.VIDEO_SOURCE_VIDEO_SUBSCRIBE_STATE_CHANGED,
      cb: (
        channel: string,
        uid: number,
        oldState: STREAM_SUBSCRIBE_STATE,
        newState: STREAM_SUBSCRIBE_STATE,
        elapseSinceLastState: number
      ) => void
    ): this;
  }
}
