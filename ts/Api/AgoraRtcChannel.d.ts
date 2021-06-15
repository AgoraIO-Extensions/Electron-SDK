import {
  RtcStats,
  QUALITY_TYPE,
  RemoteVideoStats,
  RemoteAudioStats,
  REMOTE_AUDIO_STATE_REASON,
  REMOTE_VIDEO_STATE,
  REMOTE_VIDEO_STATE_REASON,
  REMOTE_AUDIO_STATE,
  CLIENT_ROLE_TYPE,
  CONNECTION_STATE_TYPE,
  CONNECTION_CHANGED_REASON_TYPE,
  Metadata,
  RTMP_STREAMING_EVENT,
  STREAM_PUBLISH_STATE,
  STREAM_SUBSCRIBE_STATE,
  CHANNEL_MEDIA_RELAY_EVENT,
  CHANNEL_MEDIA_RELAY_STATE,
  CHANNEL_MEDIA_RELAY_ERROR,
  INJECT_STREAM_STATUS,
} from "./types";
import { ChannelEvents } from '../Common/JSEvents';

declare interface AgoraRtcChannel {
  /** Occurs when a user joins a specified channel.
   * @param cb.uid The User ID.
   * @param cb.elapsed Time elapsed (ms) from the user calling the
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  on(
    evt: ChannelEvents.JOIN_CHANNEL_SUCCESS,
    cb: (channelId: string, uid: number, elapsed: number) => void
  ): this;
  /**
   * Reports a warning during SDK runtime.
   * @param cb.warn Warning code.
   * @param cb.msg The warning message.
   */
  on(
    evt: ChannelEvents.CHANNEL_WARNING,
    cb: (channelId: string, warn: number, msg: string) => void
  ): this;
  /** Reports an error during SDK runtime.
   * @param cb.err Error code.
   * @param cb.msg The error message.
   */
  on(
    evt: ChannelEvents.CHANNEL_ERROR,
    cb: (channelId: string, err: number, msg: string) => void
  ): this;
  /** Occurs when a user rejoins the channel after disconnection due to network
   * problems.
   * When a user loses connection with the server because of network problems,
   * the SDK automatically tries to reconnect and triggers this callback upon
   * reconnection.
   * @param cb.uid User ID of the user joining the channel.
   * @param cb.elapsed Time elapsed (ms) from the user calling the
   * {@link joinChannel}
   * method until the SDK triggers this callback.
   */
  on(
    evt: ChannelEvents.REJOIN_CHANNEL_SUCCESS,
    cb: (channelId: string, uid: number, elapsed: number) => void
  ): this;
  /** Occurs when the user leaves the channel.
   *
   * When the app calls the
   * {@link leaveChannel} method, the SDK uses
   * this callback to notify the app when the user leaves the channel.
   *
   * @param cb.stats The call statistics, see {@link RtcStats}
   */
  on(
    evt: ChannelEvents.LEAVE_CHANNEL,
    cb: (channelId: string, stats: RtcStats) => void
  ): this;
  /** Occurs when the user role switches in a live streaming.
   *
   * For example,
   * from a host to an audience or vice versa.
   *
   * This callback notifies the application of a user role switch when the
   * application calls the {@link setClientRole} method.
   *
   * @param cb.oldRole The old role, see {@link ClientRoleType}
   * @param cb.newRole The new role, see {@link ClientRoleType}
   */
  on(
    evt: ChannelEvents.CLIENT_ROLE_CHANGED,
    cb: (
      channelId: string,
      oldRole: CLIENT_ROLE_TYPE,
      newRole: CLIENT_ROLE_TYPE
    ) => void
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
    evt: ChannelEvents.USER_JOINED,
    cb: (channelId: string, uid: number, elapsed: number) => void
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
    evt: ChannelEvents.USER_OFFLINE,
    cb: (channelId: string, uid: number, reason: number) => void
  ): this;
  /** Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds
   * after its connection to the server is interrupted.
   *
   * The SDK triggers this callback when it cannot connect to the server 10
   * seconds after calling the {@link joinChannel} method, whether or not it
   * is in the channel.
   */
  on(evt: ChannelEvents.CONNECTION_LOST, cb: (channelId: string) => void): this;
  /** Occurs when the token expires.
   *
   * After a token(channel key) is specified by calling the {@link joinChannel}
   * method,
   * if the SDK losses connection with the Agora server due to network issues,
   * the token may expire after a certain period
   * of time and a new token may be required to reconnect to the server.
   *
   * This callback notifies the application to generate a new token and call
   * {@link joinChannel} to rejoin the channel with the new token.
   */
  on(evt: ChannelEvents.REQUEST_TOKEN, cb: (channelId: string) => void): this;
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
    evt: ChannelEvents.TOKEN_PRIVILEGE_WILL_EXPIRE,
    cb: (channelId: string, token: string) => void
  ): this;
  /** Reports the statistics of the AgoraRtcChannel once every two seconds.
   *
   * @param cb.stats AgoraRtcChannel's statistics, see {@link RtcStats}
   */
  on(evt: ChannelEvents.RTC_STATS, cb: (channelId: string, stats: RtcStats) => void): this;
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
    evt: ChannelEvents.NETWORK_QUALITY,
    cb: (
      channelId: string,
      uid: number,
      txquality: QUALITY_TYPE,
      rxquality: QUALITY_TYPE
    ) => void
  ): this;
  /** Reports the statistics of the video stream from each remote user/host.
   *
   * @param cb.stats Statistics of the received remote video streams. See
   * {@link RemoteVideoState}.
   */
  on(
    evt: ChannelEvents.REMOTE_VIDEO_STATS,
    cb: (channelId: string, stats: RemoteVideoStats) => void
  ): this;
  /** Reports the statistics of the audio stream from each remote user/host.
   *
   * @param cb.stats Statistics of the received remote audio streams. See
   * {@link RemoteAudioStats}.
   */
  on(
    evt: ChannelEvents.REMOTE_AUDIO_STATS,
    cb: (channelId: string, stats: RemoteAudioStats) => void
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
    evt: ChannelEvents.REMOTE_AUDIO_STATE_CHANGED,
    cb: (
      channelId: string,
      uid: number,
      state: REMOTE_AUDIO_STATE,
      reason: REMOTE_AUDIO_STATE_REASON,
      elapsed: number
    ) => void
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
  on(evt: ChannelEvents.ACTIVE_SPEAKER, cb: (channelId: string, uid: number) => void): this;
  /** Occurs when the video size or rotation of a specified user changes.
   * @param cb.uid User ID of the remote user or local user (0) whose video
   * size or
   * rotation changes.
   * @param cb.width New width (pixels) of the video.
   * @param cb.height New height (pixels) of the video.
   * @param cb.roation New height (pixels) of the video.
   */
  on(
    evt: ChannelEvents.VIDEO_SIZE_CHANGED,
    cb: (
      channelId: string,
      uid: number,
      width: number,
      height: number,
      rotation: number
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
    evt: ChannelEvents.REMOTE_VIDEO_STATE_CHANGED,
    cb: (
      channelId: string,
      uid: number,
      state: REMOTE_VIDEO_STATE,
      reason: REMOTE_VIDEO_STATE_REASON,
      elapsed: number
    ) => void
  ): this;
  /** Occurs when the local user receives the data stream from the remote
   * user within five seconds.
   *
   * The SDK triggers this callback when the local user receives the stream
   * message that the remote user sends by calling the
   * {@link sendStreamMessage} method.
   * @param cb.uid User ID of the remote user sending the message.
   * @param cb.streamId Stream ID.
   * @param cb.data The data received bt the local user.
   */
  on(
    evt: ChannelEvents.STREAM_MESSAGE,
    cb: (channelId: string, uid: number, streamId: number, data: string) => void
  ): this;

  //Todo
  on(evt: ChannelEvents.READY_TO_SEND_METADATA, cb: (metadata: Metadata) => void): this;
  //Todo
  on(evt: ChannelEvents.METADATA_RECEIVED, cb: (metadata: Metadata) => void): this;

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
    evt: ChannelEvents.STREAM_MESSAGE_ERROR,
    cb: (
      channelId: string,
      uid: number,
      streamId: number,
      code: number,
      missed: number,
      cached: number
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
    evt: ChannelEvents.CHANNEL_MEDIA_RELAY_STATE_CHANGED,
    cb: (
      channelId: string,
      state: CHANNEL_MEDIA_RELAY_STATE,
      code: CHANNEL_MEDIA_RELAY_ERROR
    ) => void
  ): this;
  /**
   * Reports events during the media stream relay.
   *
   * @param cb.event The event code. See {@link ChannelMediaRelayEvent}.
   */
  on(
    evt: ChannelEvents.CHANNEL_MEDIA_RELAY_EVENT,
    cb: (channelId: string, event: CHANNEL_MEDIA_RELAY_EVENT) => void
  ): this;

  on(evt: string, listener: Function): this;
  /**
   * Occurs when the state of the RTMP or RTMPS streaming changes.
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
    evt: ChannelEvents.RTMP_STREAMING_STATE_CHANGED,
    cb: (channelId: string, url: string, state: number, code: number) => void
  ): this;
  /** Occurs when the publisher's transcoding is updated. */
  on(evt: ChannelEvents.TRANSCODING_UPDATED, cb: (channelId: string) => void): this;
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
    evt: ChannelEvents.STREAM_INJECTED_STATUS,
    cb: (
      channelId: string,
      url: string,
      uid: number,
      status: INJECT_STREAM_STATUS
    ) => void
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
    evt: ChannelEvents.REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY,
    cb: (channelId: string, uid: number, isFallbackOrRecover: boolean) => void
  ): this;
  // on(evt: 'refreshRecordingServiceStatus', cb: () => void): this;
  /** Occurs when the connection state between the SDK and the server changes.
   * @param cb.state The connection state, see {@link ConnectionState}.
   * @param cb.reason The connection reason, see {@link ConnectionState}.
   */
  on(
    evt: ChannelEvents.CONNECTION_STATE_CHANGED,
    cb: (
      channelId: string,
      state: CONNECTION_STATE_TYPE,
      reason: CONNECTION_CHANGED_REASON_TYPE
    ) => void
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
    evt: ChannelEvents.AUDIO_PUBLISH_STATE_CHANGED,
    cb: (
      channelId: string,
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
    evt: ChannelEvents.VIDEO_PUBLISH_STATE_CHANGED,
    cb: (
      channelId: string,
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
    evt: ChannelEvents.AUDIO_SUBSCRIBE_STATE_CHANGED,
    cb: (
      channelId: string,
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
    evt: ChannelEvents.VIDEO_SUBSCRIBE_STATE_CHANGED,
    cb: (
      channelId: string,
      uid: number,
      oldState: STREAM_SUBSCRIBE_STATE,
      newState: STREAM_SUBSCRIBE_STATE,
      elapseSinceLastState: number
    ) => void
  ): this;

  on(
    evt: ChannelEvents.STREAM_MESSAGE,
    channelId: string,
    uid: number,
    streamId: number,
    buffer: string
  ): void;

  on(evt: ChannelEvents.METADATA_RECEIVED, cb: (metadata: Metadata) => void): this;

  on(evt: ChannelEvents.READY_TO_SEND_METADATA, cb: (metadata: Metadata) => void): this;

  /**
   * @TODO 3.4.2 doc
   * @param evt
   * @param cb
   */
  on(
    evt: ChannelEvents.RTMP_STREAMING_EVENT,
    cb: (url: string, eventCode: RTMP_STREAMING_EVENT) => void
  ): this;
}
