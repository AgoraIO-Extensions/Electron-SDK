import './extension/IAgoraRtcEngineExExtension';
import {
  ChannelMediaRelayConfiguration,
  ConnectionStateType,
  DataStreamConfig,
  EncryptionConfig,
  LiveTranscoding,
  SimulcastStreamConfig,
  SimulcastStreamMode,
  SpatialAudioParams,
  UserInfo,
  VideoCanvas,
  VideoEncoderConfiguration,
  VideoMirrorModeType,
  VideoOrientation,
  VideoStreamType,
  VideoSubscriptionOptions,
  WatermarkOptions,
} from './AgoraBase';
import { ContentInspectConfig, RenderModeType } from './AgoraMediaBase';
import {
  ChannelMediaOptions,
  IRtcEngine,
  ImageTrackOptions,
  LeaveChannelOptions,
  StreamFallbackOptions,
} from './IAgoraRtcEngine';

/**
 * Class containing connection information.
 */
export class RtcConnection {
  /**
   * Channel name.
   */
  channelId?: string;
  /**
   * Local user ID.
   */
  localUid?: number;
}

/**
 * Interface class that provides multi-channel methods.
 *
 * Inherits from IRtcEngine.
 */
export abstract class IRtcEngineEx extends IRtcEngine {
  /**
   * Joins a channel.
   *
   * Call this method to join multiple channels simultaneously. If you want to join the same channel on different devices, make sure the user IDs used on different devices are different. If you are already in a channel, you cannot join the same channel again with the same user ID.
   * Before joining a channel, make sure the App ID used to generate the Token is the same as the one used to initialize the engine with the initialize method. Otherwise, joining the channel with the Token will fail.
   *
   * @param token A dynamic key generated on the server for authentication. See [Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   *  (Recommended) If your project enables security mode (i.e., using APP ID + Token for authentication), this parameter is required.
   *  If your project only enables debug mode (i.e., using APP ID for authentication), you can join a channel without providing a Token. You will automatically leave the channel 24 hours after joining.
   *  If you need to join multiple channels simultaneously or switch channels frequently, Agora recommends using a wildcard Token to avoid requesting a new Token from the server each time. See [Using Wildcard Token](https://doc.shengwang.cn/doc/rtc/electron/best-practice/wildcard-token).
   * @param connection Connection information. See RtcConnection.
   * @param options Channel media options. See ChannelMediaOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: Invalid parameters. For example, invalid Token, uid is not an integer, or ChannelMediaOptions contains invalid values. Provide valid parameters and rejoin the channel.
   *  -3: IRtcEngine initialization failed. Reinitialize the IRtcEngine object.
   *  -7: IRtcEngine is not initialized. Initialize the IRtcEngine object before calling this method.
   *  -8: Internal state error in IRtcEngine. Possible cause: startEchoTest was called to start echo test but stopEchoTest was not called before joining the channel. Call stopEchoTest before this method.
   *  -17: Join channel rejected. Possible cause: the user is already in the channel. Use onConnectionStateChanged to check the connection state. Do not call this method again unless you receive ConnectionStateDisconnected (1).
   *  -102: Invalid channel name. Provide a valid channelId and rejoin the channel.
   *  -121: Invalid user ID. Provide a valid uid and rejoin the channel.
   */
  abstract joinChannelEx(
    token: string,
    connection: RtcConnection,
    options: ChannelMediaOptions
  ): number;

  /**
   * Sets channel options and leaves the channel.
   *
   * After calling this method, the SDK stops all audio and video interactions, leaves the current channel, and releases all session-related resources.
   * After successfully joining a channel using joinChannelEx, you must call this method to end the call, otherwise you cannot start a new one.
   *  This method is asynchronous. When the call returns, it does not mean the user has actually left the channel.
   *  If you call leaveChannel, it will leave both channels joined via joinChannel and joinChannelEx. If you call release immediately after this method, the SDK will not trigger the onLeaveChannel callback.
   *
   * @param connection Connection information. See RtcConnection.
   * @param options Options for leaving the channel. See LeaveChannelOptions. This parameter only supports setting the stopMicrophoneRecording member in LeaveChannelOptions. Other members are not effective.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract leaveChannelEx(
    connection: RtcConnection,
    options?: LeaveChannelOptions
  ): number;

  /**
   * Updates channel media options after joining the channel.
   *
   * @param options Channel media options. See ChannelMediaOptions.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: Invalid ChannelMediaOptions values. For example, using an invalid token or setting an invalid user role. You must provide valid parameters.
   *  -7: The IRtcEngine object is not initialized. You must initialize the IRtcEngine object before calling this method.
   *  -8: The internal state of the IRtcEngine object is incorrect. This may happen if the user is not in a channel. Use the onConnectionStateChanged callback to determine whether the user is in a channel. If you receive ConnectionStateDisconnected (1) or ConnectionStateFailed (5), the user is not in a channel. You must call joinChannel before using this method.
   */
  abstract updateChannelMediaOptionsEx(
    options: ChannelMediaOptions,
    connection: RtcConnection
  ): number;

  /**
   * Sets the video encoding configuration.
   *
   * Sets the encoding configuration for the local video. Each video encoding configuration corresponds to a set of video parameters, including resolution, frame rate, and bitrate. The config parameter of this method specifies the maximum values achievable under ideal network conditions. If the network condition is poor, the video engine may not use this config to render the local video and will automatically downgrade to a suitable video parameter configuration.
   *
   * @param config Video encoding configuration. See VideoEncoderConfiguration.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting tips.
   */
  abstract setVideoEncoderConfigurationEx(
    config: VideoEncoderConfiguration,
    connection: RtcConnection
  ): number;

  /**
   * Initializes the remote user view.
   *
   * This method binds a remote user to a display view and sets the rendering and mirror mode for the remote user's view as seen locally. It only affects the video display seen by the local user.
   * You need to specify the remote user's ID in VideoCanvas when calling this method. It is generally recommended to set this before joining the channel.
   * If the remote user's uid is not available before joining the channel, you can call this method upon receiving the onUserJoined callback. If video recording is enabled, the recording service joins the channel as a dummy client. Other clients will also receive its onUserJoined event, but the app should not bind a view to it (as it does not send video streams).
   * To unbind a view from a remote user, call this method and set view to null.
   * After leaving the channel, the SDK clears the binding between the remote user and the view.
   *  You must call this method after joinChannelEx.
   *  In Flutter, you do not need to call this method manually. Use AgoraVideoView to render local and remote views.
   *  If you want to update the rendering or mirror mode of the remote user's view during a call, use the setRemoteRenderModeEx method.
   *
   * @param canvas Video canvas information. See VideoCanvas.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setupRemoteVideoEx(
    canvas: VideoCanvas,
    connection: RtcConnection
  ): number;

  /**
   * Stops or resumes receiving the specified audio stream.
   *
   * This method stops or resumes receiving the audio stream from a specified remote user. You can call this method before or after joining a channel. The setting is reset after leaving the channel.
   *
   * @param uid The ID of the specified user.
   * @param mute Whether to stop receiving the specified audio stream: true : Stop receiving the specified audio stream. false : (Default) Continue receiving the specified audio stream.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract muteRemoteAudioStreamEx(
    uid: number,
    mute: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Stops or resumes receiving the specified video stream.
   *
   * This method stops or resumes receiving the video stream from a specified remote user. You can call this method before or after joining a channel. The setting is reset after leaving the channel.
   *
   * @param uid The ID of the remote user.
   * @param mute Whether to stop receiving the video stream from a remote user: true : Stop receiving. false : (Default) Resume receiving.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract muteRemoteVideoStreamEx(
    uid: number,
    mute: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Sets the video stream type to subscribe to.
   *
   * Depending on the sender's default behavior and the configuration of setDualStreamMode, the receiver's use of this method falls into the following cases:
   *  By default, the SDK enables the adaptive low stream mode (AutoSimulcastStream) on the sender side. That is, the sender only sends the high stream. Only receivers with host role can call this method to request the low stream. Once the sender receives the request, it starts sending the low stream automatically. At this point, all users in the channel can call this method to switch to low stream subscription mode.
   *  If the sender calls setDualStreamMode and sets mode to DisableSimulcastStream (never send low stream), then this method has no effect.
   *  If the sender calls setDualStreamMode and sets mode to EnableSimulcastStream (always send low stream), then both host and audience receivers can call this method to switch to low stream subscription mode. When receiving low video streams, the SDK dynamically adjusts the video stream size based on the size of the video window to save bandwidth and computing resources. The aspect ratio of the low stream is the same as that of the high stream. Based on the current aspect ratio of the high stream, the system automatically allocates resolution, frame rate, and bitrate for the low stream. If the sender has called setDualStreamModeEx and set mode to DisableSimulcastStream (never send low stream), then this method has no effect. You need to call setDualStreamModeEx again on the sender side to change the setting.
   *
   * @param uid User ID.
   * @param streamType Video stream type: VideoStreamType.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteVideoStreamTypeEx(
    uid: number,
    streamType: VideoStreamType,
    connection: RtcConnection
  ): number;

  /**
   * Stops or resumes publishing the local audio stream.
   *
   * After this method is successfully called, the remote client triggers the onUserMuteAudio and onRemoteAudioStateChanged callbacks. This method does not affect the audio capture state because the audio capture device is not disabled.
   *
   * @param mute Whether to stop publishing the local audio stream. true : Stop publishing. false : (Default) Publish.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteLocalAudioStreamEx(
    mute: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Stops or resumes publishing the local video stream.
   *
   * After this method is successfully called, the remote user receives the onUserMuteVideo callback.
   *  This method does not affect the video capture state and does not disable the camera.
   *
   * @param mute Whether to stop sending the local video stream. true : Stop sending the local video stream. false : (Default) Send the local video stream.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract muteLocalVideoStreamEx(
    mute: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Stops or resumes subscribing to all remote users' audio streams.
   *
   * After this method is successfully called, the local user stops or resumes subscribing to remote users' audio streams, including the streams of users who join the channel after this method is called.
   *  This method must be called after joining a channel.
   *  To disable subscribing to remote users' audio streams before joining a channel, set autoSubscribeAudio to false when calling joinChannel.
   *
   * @param mute Whether to stop subscribing to all remote users' audio streams: true : Stop subscribing to all remote users' audio streams. false : (Default) Subscribe to all remote users' audio streams.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteAllRemoteAudioStreamsEx(
    mute: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Stops or resumes subscribing to all remote users' video streams.
   *
   * After this method is successfully called, the local user stops or resumes subscribing to all remote users' video streams, including the streams of users who join the channel after this method is called.
   *
   * @param mute Whether to stop subscribing to all remote users' video streams. true : Stop subscribing to all users' video streams. false : (Default) Subscribe to all users' video streams.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteAllRemoteVideoStreamsEx(
    mute: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Sets the audio subscription blocklist.
   *
   * You can call this method to specify the audio streams you do not want to subscribe to.
   *  This method can be called before or after joining a channel.
   *  The audio subscription blocklist is not affected by muteRemoteAudioStream, muteAllRemoteAudioStreams, or autoSubscribeAudio in ChannelMediaOptions.
   *  After setting the blocklist, if you leave and rejoin the channel, the blocklist remains effective.
   *  If a user is in both the audio subscription blocklist and allowlist, only the blocklist takes effect.
   *
   * @param uidList List of user IDs in the audio subscription blocklist.
   * If you want to block the audio stream of a specific user, add that user's ID to this list. If you want to remove a user from the blocklist, call setSubscribeAudioBlocklist again with an updated list that excludes the user's uid.
   * @param uidNumber Number of users in the blocklist.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeAudioBlocklistEx(
    uidList: number[],
    uidNumber: number,
    connection: RtcConnection
  ): number;

  /**
   * Sets the audio subscription allowlist.
   *
   * You can call this method to specify the audio streams you want to subscribe to.
   *  This method can be called before or after joining a channel.
   *  The audio subscription allowlist is not affected by muteRemoteAudioStream, muteAllRemoteAudioStreams, or autoSubscribeAudio in ChannelMediaOptions.
   *  After setting the allowlist, if you leave and rejoin the channel, the allowlist remains effective.
   *  If a user is in both the audio subscription blocklist and allowlist, only the blocklist takes effect.
   *
   * @param uidList List of user IDs in the audio subscription allowlist.
   * If you want to subscribe to the audio stream of a specific user, add that user's ID to this list. If you want to remove a user from the allowlist, call setSubscribeAudioAllowlist again with an updated list that excludes the user's uid.
   * @param uidNumber Number of users in the allowlist.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeAudioAllowlistEx(
    uidList: number[],
    uidNumber: number,
    connection: RtcConnection
  ): number;

  /**
   * Sets the video subscription blocklist.
   *
   * You can call this method to specify the video streams you do not want to subscribe to.
   *  You can call this method either before or after joining a channel.
   *  The video subscription blocklist is not affected by muteRemoteVideoStream, muteAllRemoteVideoStreams, or autoSubscribeVideo in ChannelMediaOptions.
   *  After setting the blocklist, it remains effective even if you leave and rejoin the channel.
   *  If a user is in both the audio subscription allowlist and blocklist, only the blocklist takes effect.
   *
   * @param uidList The user ID list for the video subscription blocklist.
   * If you want to block the video stream from a specific user, add that user's ID to this list. If you want to remove a user from the blocklist, you need to call the setSubscribeVideoBlocklist method again to update the list so that it no longer includes the uid of the user you want to remove.
   * @param uidNumber The number of users in the blocklist.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeVideoBlocklistEx(
    uidList: number[],
    uidNumber: number,
    connection: RtcConnection
  ): number;

  /**
   * Sets the video subscription allowlist.
   *
   * You can call this method to specify the video streams you want to subscribe to.
   *  You can call this method either before or after joining a channel.
   *  The video subscription allowlist is not affected by muteRemoteVideoStream, muteAllRemoteVideoStreams, or autoSubscribeVideo in ChannelMediaOptions.
   *  After setting the allowlist, it remains effective even if you leave and rejoin the channel.
   *  If a user is in both the audio subscription allowlist and blocklist, only the blocklist takes effect.
   *
   * @param uidList The user ID list for the video subscription allowlist.
   * If you want to subscribe to the video stream of a specific user, add that user's ID to this list. If you want to remove a user from the allowlist, you need to call the setSubscribeVideoAllowlist method again to update the list so that it no longer includes the uid of the user you want to remove.
   * @param uidNumber The number of users in the allowlist.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeVideoAllowlistEx(
    uidList: number[],
    uidNumber: number,
    connection: RtcConnection
  ): number;

  /**
   * Sets the subscription options for the remote video stream.
   *
   * When the remote user sends dual streams, you can call this method to set the subscription options for the remote video stream.
   *
   * @param uid Remote user ID.
   * @param options Subscription settings for the video stream. See VideoSubscriptionOptions.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteVideoSubscriptionOptionsEx(
    uid: number,
    options: VideoSubscriptionOptions,
    connection: RtcConnection
  ): number;

  /**
   * Sets the 2D position of a remote user's voice, that is, the horizontal position.
   *
   * Sets the spatial position and volume of a remote user's voice to help the local user determine the direction of the sound.
   * By calling this method to set the position where the remote user's voice appears, the difference in sound between the left and right channels creates a sense of direction, allowing the user to determine the remote user's real-time position. In multiplayer online games, such as battle royale games, this method can effectively enhance the directional perception of game characters and simulate realistic scenarios.
   *  For the best listening experience, it is recommended that users wear wired headphones.
   *  This method must be called after joining the channel.
   *
   * @param uid The ID of the remote user.
   * @param pan Sets the spatial position of the remote user's voice. The range is [-1.0, 1.0]:
   *  -1.0: The sound appears on the left.
   *  (Default) 0.0: The sound appears in the center.
   *  1.0: The sound appears on the right.
   * @param gain Sets the volume of the remote user's voice. The range is [0.0, 100.0], and the default is 100.0, which represents the user's original volume. The smaller the value, the lower the volume.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteVoicePositionEx(
    uid: number,
    pan: number,
    gain: number,
    connection: RtcConnection
  ): number;

  /**
   * @ignore
   */
  abstract setRemoteUserSpatialAudioParamsEx(
    uid: number,
    params: SpatialAudioParams,
    connection: RtcConnection
  ): number;

  /**
   * Sets the display mode of the remote view.
   *
   * After initializing the remote user view, you can call this method to update the rendering and mirror mode of the remote user view as displayed locally. This method only affects the video seen by the local user.
   *
   * @param uid Remote user ID.
   * @param renderMode Display mode of the remote view. See RenderModeType.
   * @param mirrorMode The mirror mode of the remote user view. See VideoMirrorModeType.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteRenderModeEx(
    uid: number,
    renderMode: RenderModeType,
    mirrorMode: VideoMirrorModeType,
    connection: RtcConnection
  ): number;

  /**
   * @ignore
   */
  abstract setRemoteRenderRotationEx(
    uid: number,
    rotation: VideoOrientation,
    connection: RtcConnection
  ): number;

  /**
   * Enables loopback recording.
   *
   * After enabling loopback recording, the sound played by the sound card will be mixed into the local audio stream and can be sent to the remote side.
   *  The default sound card on macOS does not support recording. If you need to use this feature, please enable a virtual sound card and set deviceName to the name of that virtual sound card. Agora recommends using its self-developed virtual sound card AgoraALD for recording.
   *  This method currently supports only one loopback recording stream.
   *
   * @param connection Connection information. See RtcConnection.
   * @param enabled Whether to enable loopback recording: true : Enable loopback recording. false : (Default) Disable loopback recording.
   * @param deviceName Electron for UnionTech OS SDK does not support this parameter.
   *  macOS: The device name of the virtual sound card. Default is empty, which means using the AgoraALD virtual sound card for recording.
   *  Windows: The device name of the sound card. Default is empty, which means using the built-in sound card of the device.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableLoopbackRecordingEx(
    connection: RtcConnection,
    enabled: boolean,
    deviceName?: string
  ): number;

  /**
   * @ignore
   */
  abstract adjustRecordingSignalVolumeEx(
    volume: number,
    connection: RtcConnection
  ): number;

  /**
   * @ignore
   */
  abstract muteRecordingSignalEx(
    mute: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Adjusts the playback volume of a specified remote user.
   *
   * You can call this method during a call to adjust the playback volume of a specified remote user. To adjust the playback volume of multiple users, call this method multiple times.
   *
   * @param uid The ID of the remote user.
   * @param volume The volume, with a range of [0,400].
   *  0: Mute.
   *  100: (Default) Original volume.
   *  400: Four times the original volume, with overflow protection.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustUserPlaybackSignalVolumeEx(
    uid: number,
    volume: number,
    connection: RtcConnection
  ): number;

  /**
   * Gets the current network connection state.
   *
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * The current network connection state. See ConnectionStateType.
   */
  abstract getConnectionStateEx(connection: RtcConnection): ConnectionStateType;

  /**
   * Enables or disables built-in encryption.
   *
   * The SDK automatically disables encryption after the user leaves the channel. To re-enable encryption, you must call this method before the user joins the channel again.
   *  All users in the same channel must use the same encryption mode and key when calling this method.
   *  If built-in encryption is enabled, the RTMP streaming feature cannot be used.
   *
   * @param connection Connection information. See RtcConnection.
   * @param enabled Whether to enable built-in encryption: true : Enable built-in encryption. false : (Default) Disable built-in encryption.
   * @param config Configure the built-in encryption mode and key. See EncryptionConfig.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableEncryptionEx(
    connection: RtcConnection,
    enabled: boolean,
    config: EncryptionConfig
  ): number;

  /**
   * Creates a data stream.
   *
   * Within the lifecycle of IRtcEngine, each user can create up to 5 data streams. The data streams are destroyed when leaving the channel. To use them again, you need to recreate them.
   *
   * @param config Data stream configuration. See DataStreamConfig.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * ID of the created data stream: if the method call succeeds.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract createDataStreamEx(
    config: DataStreamConfig,
    connection: RtcConnection
  ): number;

  /**
   * Sends a data stream.
   *
   * After calling createDataStreamEx, you can use this method to send data stream messages to all users in the channel.
   * The SDK imposes the following restrictions on this method:
   *  Each client in the channel can have up to 5 data channels simultaneously, and the total sending bitrate shared by all data channels is limited to 30 KB/s.
   *  Each data channel can send up to 60 packets per second, with each packet up to 1 KB in size. If the method call succeeds, the remote end triggers the onStreamMessage callback, where the remote user can receive the message; if it fails, the remote end triggers the onStreamMessageError callback.
   *  This method must be called after joinChannelEx.
   *  Make sure to call createDataStreamEx to create the data channel before calling this method.
   *
   * @param streamId Data stream ID. You can get it via createDataStreamEx.
   * @param data The data to be sent.
   * @param length Length of the data.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract sendStreamMessageEx(
    streamId: number,
    data: Uint8Array,
    length: number,
    connection: RtcConnection
  ): number;

  /**
   * Adds a local video watermark.
   *
   * Deprecated Deprecated: This method is deprecated. Use addVideoWatermarkWithConfigEx instead. This method adds a PNG image as a watermark to the local live video stream. Users in the same live streaming channel, audience of the CDN live stream, and capture devices can see or capture the watermark image. Currently, only one watermark can be added to the live stream. A newly added watermark replaces the previous one.
   * The watermark coordinates depend on the settings in the setVideoEncoderConfigurationEx method:
   *  If the video orientation (OrientationMode) is fixed to landscape or adaptive landscape, landscape coordinates are used for the watermark.
   *  If the video orientation (OrientationMode) is fixed to portrait or adaptive portrait, portrait coordinates are used for the watermark.
   *  When setting the watermark coordinates, the image area of the watermark must not exceed the video dimensions set in the setVideoEncoderConfigurationEx method; otherwise, the excess part will be cropped.
   *  You must call this method after calling enableVideo.
   *  The image to be added must be in PNG format. This method supports all pixel formats of PNG images: RGBA, RGB, Palette, Gray, and Alpha_gray.
   *  If the size of the PNG image differs from the size you set in this method, the SDK will scale or crop the image to match the settings.
   *  If you have started the local video preview using startPreview, you can use the visibleInPreview parameter to set whether the watermark is visible during preview.
   *  If local video mirroring is enabled, the local watermark will also be mirrored. To prevent the watermark from being mirrored when viewed locally, we recommend not using both mirroring and watermark features simultaneously. Implement local watermarking at the application level.
   *
   * @param watermarkUrl The local path of the watermark image to be added. This method supports adding watermark images from absolute or relative local paths.
   * @param options Settings for the watermark image to be added. See WatermarkOptions.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract addVideoWatermarkEx(
    watermarkUrl: string,
    options: WatermarkOptions,
    connection: RtcConnection
  ): number;

  /**
   * Removes added video watermarks.
   *
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract clearVideoWatermarkEx(connection: RtcConnection): number;

  /**
   * Custom data reporting and analysis service.
   *
   * Agora provides custom data reporting and analysis services. This service is currently in a free beta phase. During the beta, you can report up to 10 data entries within 6 seconds. Each custom data entry must not exceed 256 bytes, and each string must not exceed 100 bytes. To try this service, [contact sales](https://www.shengwang.cn/contact-sales/) to enable it and agree on the custom data format.
   */
  abstract sendCustomReportMessageEx(
    id: string,
    category: string,
    event: string,
    label: string,
    value: number,
    connection: RtcConnection
  ): number;

  /**
   * Enables audio volume indication.
   *
   * This method allows the SDK to periodically report to the app the volume information of the local user who is sending streams and the remote users (up to 3) with the highest instantaneous volume.
   *
   * @param interval The time interval for the volume indication:
   *  ≤ 0: Disables the volume indication feature.
   *  > 0: Returns the interval for volume indication, in milliseconds. It is recommended to set it above 100 ms. Must not be less than 10 ms, otherwise the onAudioVolumeIndication callback will not be received.
   * @param smooth The smoothing factor that specifies the sensitivity of the volume indication. The range is [0,10], and the recommended value is 3. The larger the value, the more sensitive the fluctuation; the smaller the value, the smoother the fluctuation.
   * @param reportVad true : Enables the local voice detection feature. When enabled, the vad parameter in the onAudioVolumeIndication callback reports whether a human voice is detected locally. false : (Default) Disables the local voice detection feature. Except in scenarios where the engine automatically performs local voice detection, the vad parameter in the onAudioVolumeIndication callback does not report whether a human voice is detected locally.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableAudioVolumeIndicationEx(
    interval: number,
    smooth: number,
    reportVad: boolean,
    connection: RtcConnection
  ): number;

  /**
   * Starts pushing media streams without transcoding.
   *
   * Agora recommends using the more advanced server-side streaming feature. See [Implement Server-side Streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * Call this method to push live audio and video streams to a specified streaming URL. This method supports pushing to only one URL at a time. To push to multiple URLs, call this method multiple times.
   * After calling this method, the SDK triggers the onRtmpStreamingStateChanged callback locally to report the streaming status.
   *  Call this method after joining a channel.
   *  Only broadcasters in a live streaming scenario can call this method.
   *  If the streaming fails and you want to retry, you must call stopRtmpStream before calling this method again. Otherwise, the SDK will return the same error code as the previous failure.
   *
   * @param url The streaming URL. Must be in RTMP or RTMPS format. The maximum length is 1024 bytes. Special characters such as Chinese characters are not supported.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: The URL or transcoding parameter is incorrect. Check your URL or parameter settings.
   *  -7: The SDK is not initialized before calling this method.
   *  -19: The streaming URL is already in use. Use a different streaming URL.
   */
  abstract startRtmpStreamWithoutTranscodingEx(
    url: string,
    connection: RtcConnection
  ): number;

  /**
   * Starts pushing streams to a CDN and sets the transcoding configuration.
   *
   * Agora recommends using the more comprehensive server-side streaming feature. See [Implement server-side CDN streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * Call this method to push live audio and video streams to the specified CDN streaming URL and set the transcoding configuration. This method can only push media streams to one URL at a time. To push to multiple URLs, call this method multiple times.
   * After calling this method, the SDK triggers the onRtmpStreamingStateChanged callback locally to report the streaming status.
   *  Make sure the CDN streaming service is enabled.
   *  Call this method after joining a channel.
   *  Only hosts in a live streaming scenario can call this method.
   *  If the stream push fails and you want to retry, you must call stopRtmpStreamEx before calling this method again. Otherwise, the SDK returns the same error code as the previous failure.
   *
   * @param url The CDN streaming URL. Must be in RTMP or RTMPS format. The character length must not exceed 1024 bytes. Special characters such as Chinese characters are not supported.
   * @param transcoding The transcoding configuration for the CDN stream. See LiveTranscoding.
   * @param connection The connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: The URL or transcoding parameter is invalid. Check your URL or parameter settings.
   *  -7: The SDK is not initialized before calling this method.
   *  -19: The CDN streaming URL is already in use. Use a different URL.
   */
  abstract startRtmpStreamWithTranscodingEx(
    url: string,
    transcoding: LiveTranscoding,
    connection: RtcConnection
  ): number;

  /**
   * Updates the CDN transcoding configuration.
   *
   * Agora recommends using the more comprehensive server-side streaming feature. See [Implement server-side CDN streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * After enabling transcoding streaming, you can dynamically update the transcoding configuration based on your scenario. After the configuration is updated, the SDK triggers the onTranscodingUpdated callback.
   *
   * @param transcoding The transcoding configuration for the CDN stream. See LiveTranscoding.
   * @param connection The connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract updateRtmpTranscodingEx(
    transcoding: LiveTranscoding,
    connection: RtcConnection
  ): number;

  /**
   * Stops pushing streams to a CDN.
   *
   * Agora recommends using the more comprehensive server-side streaming feature. See [Implement server-side CDN streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * Call this method to stop the live stream on the specified CDN streaming URL. This method can only stop one URL at a time. To stop multiple URLs, call this method multiple times.
   * After calling this method, the SDK triggers the onRtmpStreamingStateChanged callback locally to report the streaming status.
   *
   * @param url The CDN streaming URL. Must be in RTMP or RTMPS format. The character length must not exceed 1024 bytes. Special characters such as Chinese characters are not supported.
   * @param connection The connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopRtmpStreamEx(url: string, connection: RtcConnection): number;

  /**
   * Starts or updates the media stream relay across channels.
   *
   * The first successful call to this method starts relaying media streams across channels. To relay streams to multiple destination channels or to leave a current relay channel, you can call this method again to add or remove destination channels. This feature supports relaying to up to six destination channels.
   * After a successful call, the SDK triggers the onChannelMediaRelayStateChanged callback to report the current relay state. Common states include:
   *  If the onChannelMediaRelayStateChanged callback reports RelayStateRunning (2) and RelayOk (0), it means the SDK has started relaying media streams between the source and destination channels.
   *  If the callback reports RelayStateFailure (3), it indicates an error occurred during the media stream relay.
   *  Call this method after successfully joining a channel.
   *  In a live streaming scenario, only users with the broadcaster role can call this method.
   *  To enable the media stream relay across channels, [contact technical support](https://ticket.shengwang.cn/).
   *  This feature does not support string-type UIDs.
   *
   * @param configuration Configuration for media stream relay across channels. See ChannelMediaRelayConfiguration.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -1: General error (not categorized).
   *  -2: Invalid parameter.
   *  -8: Internal state error, possibly due to the user not being a broadcaster.
   */
  abstract startOrUpdateChannelMediaRelayEx(
    configuration: ChannelMediaRelayConfiguration,
    connection: RtcConnection
  ): number;

  /**
   * @ignore
   */
  abstract startChannelMediaRelayEx(
    configuration: ChannelMediaRelayConfiguration,
    connection: RtcConnection
  ): number;

  /**
   * @ignore
   */
  abstract updateChannelMediaRelayEx(
    configuration: ChannelMediaRelayConfiguration,
    connection: RtcConnection
  ): number;

  /**
   * Stops the media stream relay across channels. Once stopped, the broadcaster leaves all destination channels.
   *
   * After a successful call, the SDK triggers the onChannelMediaRelayStateChanged callback. If it reports RelayStateIdle (0) and RelayOk (0), it indicates that the media stream relay has stopped. If the method call fails, the SDK triggers the onChannelMediaRelayStateChanged callback and reports the error code RelayErrorServerNoResponse (2) or RelayErrorServerConnectionLost (8). You can call the leaveChannel method to leave the channel, and the media stream relay will stop automatically.
   *
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -5: The method call is rejected. There is no ongoing media stream relay.
   */
  abstract stopChannelMediaRelayEx(connection: RtcConnection): number;

  /**
   * Pauses media stream forwarding to all destination channels.
   *
   * After starting media stream forwarding across channels, if you need to pause forwarding to all channels, you can call this method. To resume forwarding, call the resumeAllChannelMediaRelay method. You must call this method after calling startOrUpdateChannelMediaRelayEx to start cross-channel media stream forwarding.
   *
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -5: This method call was rejected. There is no ongoing cross-channel media stream forwarding.
   */
  abstract pauseAllChannelMediaRelayEx(connection: RtcConnection): number;

  /**
   * Resumes media stream forwarding to all destination channels.
   *
   * After calling the pauseAllChannelMediaRelayEx method, if you need to resume forwarding media streams to all destination channels, you can call this method. You must call this method after pauseAllChannelMediaRelayEx.
   *
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -5: This method call was rejected. There is no paused cross-channel media stream forwarding.
   */
  abstract resumeAllChannelMediaRelayEx(connection: RtcConnection): number;

  /**
   * @ignore
   */
  abstract getUserInfoByUserAccountEx(
    userAccount: string,
    connection: RtcConnection
  ): UserInfo;

  /**
   * @ignore
   */
  abstract getUserInfoByUidEx(uid: number, connection: RtcConnection): UserInfo;

  /**
   * Enables or disables dual-stream mode on the sender.
   *
   * Deprecated Deprecated: Deprecated since v4.2.0. Use setDualStreamModeEx instead. You can call this method on the sending side to enable or disable dual-stream mode. Dual-stream refers to high-quality and low-quality video streams:
   *  High-quality stream: High resolution and high frame rate video stream.
   *  Low-quality stream: Low resolution and low frame rate video stream. After enabling dual-stream mode, you can call setRemoteVideoStreamType on the receiving side to choose whether to receive the high-quality or low-quality video stream. This method applies to all types of streams sent by the sender, including but not limited to camera-captured video streams, screen sharing streams, and custom captured video streams.
   *
   * @param enabled Whether to enable dual-stream mode: true : Enable dual-stream mode. false : (Default) Disable dual-stream mode.
   * @param streamConfig Configuration of the low-quality video stream. See SimulcastStreamConfig. If mode is set to DisableSimulcastStream, then streamConfig will not take effect.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableDualStreamModeEx(
    enabled: boolean,
    streamConfig: SimulcastStreamConfig,
    connection: RtcConnection
  ): number;

  /**
   * Sets the dual-stream mode on the sender side.
   *
   * By default, the SDK enables the adaptive low stream mode (AutoSimulcastStream) on the sender side. That is, the sender does not proactively send the low stream. A receiver with host role can call setRemoteVideoStreamTypeEx to request the low stream. Once the sender receives the request, it starts sending the low stream automatically.
   *  If you want to change this behavior, you can call this method and set mode to DisableSimulcastStream (never send low stream) or EnableSimulcastStream (always send low stream).
   *  If you want to revert to the default behavior after making changes, call this method again and set mode to AutoSimulcastStream. The differences and relationships between this method and enableDualStreamModeEx are as follows:
   *  Calling this method and setting mode to DisableSimulcastStream has the same effect as enableDualStreamModeEx(false).
   *  Calling this method and setting mode to EnableSimulcastStream has the same effect as enableDualStreamModeEx(true).
   *  Both methods can be called before or after joining a channel. If both are used, the settings of the method called later take precedence.
   *
   * @param mode Mode for sending video streams. See SimulcastStreamMode.
   * @param streamConfig Configuration for the low video stream. See SimulcastStreamConfig. When mode is set to DisableSimulcastStream, setting streamConfig has no effect.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setDualStreamModeEx(
    mode: SimulcastStreamMode,
    streamConfig: SimulcastStreamConfig,
    connection: RtcConnection
  ): number;

  /**
   * @ignore
   */
  abstract setHighPriorityUserListEx(
    uidList: number[],
    uidNum: number,
    option: StreamFallbackOptions,
    connection: RtcConnection
  ): number;

  /**
   * Takes a video snapshot using the connection ID.
   *
   * This method captures a snapshot of the specified user's video stream, generates a JPG image, and saves it to the specified path.
   *  This method is asynchronous. When the call returns, the SDK has not actually taken the snapshot.
   *  When used to capture a local video snapshot, it captures the video stream specified in ChannelMediaOptions.
   *  If the video has been pre-processed, such as with watermarking or beautification, the snapshot will include the effects of the pre-processing.
   *
   * @param connection Connection information. See RtcConnection.
   * @param uid User ID. Set to 0 to capture a snapshot of the local user's video.
   * @param filePath Make sure the directory exists and is writable. The local path to save the snapshot, including file name and format. For example:
   *  Windows: C:\Users\<user_name>\AppData\Local\Agora\<process_name>\example.jpg
   *  macOS: ～/Library/Logs/example.jpg
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract takeSnapshotEx(
    connection: RtcConnection,
    uid: number,
    filePath: string
  ): number;

  /**
   * Enables/disables local snapshot upload.
   *
   * This method allows capturing and uploading snapshots for multiple video streams. After enabling local snapshot upload, the SDK captures and uploads snapshots of the video sent by the local user based on the module type and frequency you set in ContentInspectConfig. After capturing, the Agora server sends a callback notification to your server via HTTPS request and uploads all snapshots to the third-party cloud storage you specify. Before calling this method, make sure you have [contacted technical support](https://ticket.shengwang.cn/) to enable the local snapshot upload service.
   *
   * @param enabled Whether to enable local snapshot upload: true : Enable local snapshot upload. false : Disable local snapshot upload.
   * @param config Local snapshot upload configuration. See ContentInspectConfig.
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableContentInspectEx(
    enabled: boolean,
    config: ContentInspectConfig,
    connection: RtcConnection
  ): number;

  /**
   * Starts video frame rendering tracing.
   *
   * After this method is successfully called, the SDK uses the time of this call as the starting point and reports video frame rendering information via the onVideoRenderingTracingResult callback.
   *  If you do not call this method, the SDK starts tracing video rendering events automatically using the time of the joinChannel call as the starting point. You can call this method at an appropriate time based on your business scenario to customize the tracing.
   *  After leaving the current channel, the SDK automatically resets the time to the next joinChannel call.
   *
   * @param connection Connection information. See RtcConnection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startMediaRenderingTracingEx(connection: RtcConnection): number;

  /**
   * Gets the call ID using the connection ID.
   *
   * Each time the client joins a channel, a corresponding callId is generated to identify the call session. You can call this method to get the callId and then pass it to methods such as rate and complain.
   *
   * @param connection Connection information. See RtcConnection.
   */
  abstract getCallIdEx(connection: RtcConnection): string;

  /**
   * Preloads the specified sound effect into the channel.
   *
   * Since Available since v4.6.2. Each time you call this method, only one sound effect file can be preloaded into memory. To preload multiple sound effects, call this method multiple times. After preloading, you can call playEffect to play the preloaded sound effect, or playAllEffects to play all preloaded sound effects.
   *  To ensure smooth user experience, the size of the sound effect file should not exceed the limit.
   *  Agora recommends calling this method before joining a channel.
   *  If you call preloadEffectEx before playEffectEx, the file resource will not be closed after playEffectEx is executed. The next call to playEffectEx will start playback from the beginning.
   *  If you do not call preloadEffectEx before playEffectEx, the file resource will be destroyed after playEffectEx is executed. The next call to playEffectEx will attempt to reopen the file and play from the beginning.
   *
   * @param connection Connection information. See RtcConnection.
   * @param soundId Sound effect ID.
   * @param filePath Absolute path of the local file or URL of the online file. Supported audio formats include: mp3, mp4, m4a, aac, 3gp, mkv, and wav.
   * @param startPos Start position (in milliseconds) for playing the sound effect file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract preloadEffectEx(
    connection: RtcConnection,
    soundId: number,
    filePath: string,
    startPos?: number
  ): number;

  /**
   * Plays the specified sound effect in the channel.
   *
   * Since Available since v4.6.2. You can call this method to play a specified sound effect to all users in the channel. Each call to this method can only play one sound effect. To play multiple sound effects simultaneously, use different soundId and filePath values and call this method multiple times. You can also set whether to publish the sound effect in the channel.
   *  Agora recommends not playing more than three sound effects simultaneously.
   *  The sound effect ID and file path in this method must match those in the preloadEffectEx method.
   *  If you call preloadEffectEx before calling playEffectEx, the file resource will not be closed after playEffectEx is executed. The next call to playEffectEx will start playback from the beginning.
   *  If you do not call preloadEffectEx before calling playEffectEx, the file resource will be destroyed after playEffectEx is executed. The next call to playEffectEx will attempt to reopen the file and play from the beginning.
   *
   * @param connection RtcConnection object. See RtcConnection.
   * @param soundId Sound effect ID.
   * @param filePath Absolute path of the local file or URL of the online file. Supported audio formats include mp3, mp4, m4a, aac, 3gp, mkv, and wav.
   * @param loopCount Number of times the sound effect is played: -1 : Loops indefinitely until stopEffect or stopAllEffects is called. 0 : Plays once. 1 : Plays twice.
   * @param pitch Pitch of the sound effect. The range is 0.5 to 2.0. The default value is 1.0 (original pitch). The smaller the value, the lower the pitch.
   * @param pan Spatial position of the sound effect. The range is -1.0 to 1.0: -1.0 : The sound effect comes from the user's left. 0.0 : The sound effect comes from the front. 1.0 : The sound effect comes from the user's right.
   * @param gain Volume of the sound effect. The range is 0 to 100. The default value is 100 (original volume). The smaller the value, the lower the volume.
   * @param publish Whether to publish the sound effect in the channel: true : Publishes the sound effect in the channel. false : (Default) Does not publish the sound effect in the channel.
   * @param startPos Start position (in milliseconds) for playing the sound effect file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract playEffectEx(
    connection: RtcConnection,
    soundId: number,
    filePath: string,
    loopCount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish?: boolean,
    startPos?: number
  ): number;

  /**
   * @ignore
   */
  abstract enableVideoImageSourceEx(
    enable: boolean,
    options: ImageTrackOptions,
    connection: RtcConnection
  ): number;
}
