import { IRtcEngine, ChannelMediaOptions } from './IAgoraRtcEngine'
import { VideoEncoderConfiguration, VideoCanvas, VideoStreamType, SpatialAudioParams, VideoMirrorModeType, ConnectionStateType, EncryptionConfig, WatermarkOptions, UserInfo, VideoSourceType, SimulcastStreamConfig, DataStreamConfig } from './AgoraBase'
import { RenderModeType } from './AgoraMediaBase'

/*
 * Contains connection information.
 */
export class RtcConnection {
/*
 * The channel name.
 */
  channelId?: string
  /*
   * The ID of the local user.
   */
  localUid?: number
}

/*
 * This interface class contains multi-channel methods.
 * Inherited from IRtcEngine .
 */
export abstract class IRtcEngineEx extends IRtcEngine {
/*
 * Joins a channel with the connection ID.
 * You can call this method multiple times to join more than one channels. If you are already in a channel, you cannot rejoin it with the same user ID.
 * If you want to join the same channel from different devices, ensure that the user IDs in all devices are different.
 * Ensure that the app ID you use to generate the token is the same with the app ID used when creating the IRtcEngine instance.
 *
 * @param options The channel media options. See ChannelMediaOptions .
 *
 * @param token The token generated on your server for authentication. See 
 *
 * @param connection 
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 * -2: The parameter is invalid. For example, the token is invalid, the uid parameter is not set to an integer, or the value of a member in the ChannelMediaOptions structure is invalid. You need to pass in a valid parameter and join the channel again.
 * -3: Failes to initialize the IRtcEngine object. You need to reinitialize the IRtcEngine object.
 * -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
 * -8: IRtcEngineThe internal state of the object is wrong. The typical cause is that you call this method to join the channel without calling stopEchoTest to stop the test after calling startEchoTest to start a call loop test. You need to call stopEchoTest before calling this method.
 * -17: The request to join the channel is rejected. The typical cause is that the user is in the channel. Agora recommends using the onConnectionStateChanged callback to get whether the user is in the channel. Do not call this method to join the channel unless you receive the ConnectionStateDisconnected(1) state.
 * -102: The channel name is invalid. You need to pass in a valid channel name inchannelId to rejoin the channel.
 * -121: The user ID is invalid. You need to pass in a valid user ID in uid to rejoin the channel.
 */
abstract joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions): number;

/*
 * Leaves a channel.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract leaveChannelEx(connection: RtcConnection): number;

/*
 * Updates the channel media options after joining the channel.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param options The channel media options. See ChannelMediaOptions .
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 * -2: The value of a member in the ChannelMediaOptions structure is invalid. For example, the token or the user ID is invalid. You need to fill in a valid parameter.
 * -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
 * -8: IRtcEngineThe internal state of the object is wrong. The possible reason is that the user is not in the channel. Agora recommends using the onConnectionStateChanged callback to get whether the user is in the channel. If you receive the ConnectionStateDisconnected (1) or ConnectionStateFailed (5) state, the user is not in the channel. You need to call joinChannelWithOptions to join a channel before calling this method.
 */
abstract updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): number;

/*
 * Sets the encoder configuration for the local video.
 * Each configuration profile corresponds to a set of video parameters, including the resolution, frame rate, and bitrate.
 * The config specified in this method is the maximum values under ideal network conditions. If the network condition is not good, the video engine cannot use the
 * config renders local video, which automatically reduces to an appropriate video parameter setting.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param config Video profile. See VideoEncoderConfiguration .
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract setVideoEncoderConfigurationEx(config: VideoEncoderConfiguration, connection: RtcConnection): number;

/*
 * Initializes the video view of a remote user.
 * This method initializes the video view of a remote stream on the local device. It affects only the video view that the local user sees. Call this method to bind the remote video stream to a video view and to set the rendering and mirror modes of the video view.
 * The application specifies the uid of the remote video in the VideoCanvas method before the remote user joins the channel.
 * If the remote uid is unknown to the application, set it after the application receives the onUserJoined callback. If the Video Recording function is enabled, the Video Recording Service joins the channel as a dummy client, causing other clients to also receive the onUserJoined callback. Do not bind the dummy client to the application view because the dummy client does not send any video streams.
 * To unbind the remote user from the view, set the view parameter to NULL.
 * Once the remote user leaves the channel, the SDK unbinds the remote user.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param canvas The remote video view settings. See VideoCanvas .
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract setupRemoteVideoEx(canvas: VideoCanvas, connection: RtcConnection): number;

/*
 * Stops or resumes receiving the audio stream of a specified user.
 * This method is used to stops or resumes receiving the audio stream of a specified user. You can call this method before or after joining a channel. If a user leaves a channel, the settings in this method become invalid.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param uid The ID of the specified user.
 *
 * @param mute Whether to stop receiving the audio stream of the specified user: true: Stop receiving the audio stream of the specified user.
 *  false: (Default) Resume receiving the audio stream of the specified user.
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): number;

/*
 * Stops or resumes receiving the video stream of a specified user.
 * This method is used to stops or resumes receiving the video stream of a specified user. You can call this method before or after joining a channel. If a user leaves a channel, the settings in this method become invalid.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param uid The user ID of the remote user.
 *
 * @param mute Whether to stop receiving the video stream of the specified user:
 *  true: Stop receiving the video stream of the specified user.
 *  false: (Default) Resume receiving the video stream of the specified user. 
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): number;

/* api_irtcengineex_setremotevideostreamtypeex */
abstract setRemoteVideoStreamTypeEx(uid: number, streamType: VideoStreamType, connection: RtcConnection): number;

/*
 * Sets the 2D position (the position on the horizontal plane) of the remote user's voice.
 * This method sets the voice position and volume of a remote user.
 * When the local user calls this method to set the voice position of a remote user, the voice difference between the left and right channels allows the local user to track the real-time position of the remote user, creating a sense of space. This method applies to massive multiplayer online games, such as Battle Royale games. For the best voice positioning, Agora recommends using a wired headset.
 * Call this method after joining a channel.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param uid The user ID of the remote user.
 *
 * @param pan The voice position of the remote user. The value ranges from -1.0 to 1.0:
 *  -1.0: The remote voice comes from the left.
 *  0.0: (Default) The remote voice comes from the front.
 *  1.0: The remote voice comes from the right.
 *
 * @param gain The volume of the remote user. The value ranges from 0.0 to 100.0. The default value is 100.0 (the original volume of the remote user). The smaller the value, the lower the volume.
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract setRemoteVoicePositionEx(uid: number, pan: number, gain: number, connection: RtcConnection): number;

/* api_irtcengineex_setremoteuserspatialaudioparamsex */
abstract setRemoteUserSpatialAudioParamsEx(uid: number, params: SpatialAudioParams, connection: RtcConnection): number;

/* api_irtcengineex_setremoterendermodeex */
abstract setRemoteRenderModeEx(uid: number, renderMode: RenderModeType, mirrorMode: VideoMirrorModeType, connection: RtcConnection): number;

/*
 * Enables loopback audio capture.
 * If you enable loopback audio capture, the output of the sound card is mixed into the audio stream sent to the other end.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param enabled Sets whether to enable loopback audio capture:
 *  true: Enable loopback audio capture.
 *  false: (Default) Disable loopback audio capture.
 *
 * @param deviceName The device name.
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract enableLoopbackRecordingEx(connection: RtcConnection, enabled: boolean, deviceName?: string): number;

/*
 * Gets the current connection state of the SDK.
 * You can call this method either before or after joining a channel.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @returns
 * The current connection state.  ConnectionStateType
 */
abstract getConnectionStateEx(connection: RtcConnection): ConnectionStateType;

/* api_irtcengineex_enableencryptionex */
abstract enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): number;

/*
 * Sends data stream messages.
 * After calling createDataStreamEx , you can call this method to send data stream messages to all users in the channel.
 * The SDK has the following restrictions on this method:
 * Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
 * Each client can send up to 6 KB of data per second.
 * Each user can have up to five data streams simultaneously. A successful method call triggers the onStreamMessage callback on the remote client, from which the remote user gets the stream message. 
 * A failed method call triggers the onStreamMessageError callback on the remote client. Ensure that you call createDataStreamEx to create a data channel before calling this method.
 * This method applies only to the `COMMUNICATION` profile or to the hosts in the `LIVE_BROADCASTING` profile. If an audience in the `LIVE_BROADCASTING` profile calls this method, the audience may be switched to a host.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param streamId The data stream ID. You can get the data stream ID by calling createDataStreamEx.
 *
 * @param data The data to be sent.
 *
 * @param length The length of the data.
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract sendStreamMessageEx(streamId: number, data: Uint8Array, length: number, connection: RtcConnection): number;

/*
 * Adds a watermark image to the local video.
 * This method adds a PNG watermark image to the local video in the live streaming. Once the watermark image is added, all the audience in the channel (CDN audience included), and the capturing device can see and capture it. Agora supports adding only one watermark image onto the local video, and the newly watermark image replaces the previous one.
 * The watermark coordinatesare dependent on the settings in the setVideoEncoderConfigurationEx method:
 * If the orientation mode of the encoding video ( OrientationMode ) is fixed landscape mode or the adaptive landscape mode, the watermark uses the landscape orientation.
 * If the orientation mode of the encoding video (OrientationMode) is fixed portrait mode or the adaptive portrait mode, the watermark uses the portrait orientation.
 * When setting the watermark position, the region must be less than thesetVideoEncoderConfigurationEx dimensions set in the method; otherwise, the watermark image will be cropped. 
 * Ensure that you have called enableVideo before calling this method.
 * This method supports adding a watermark image in the PNG file format only. Supported pixel formats of the PNG image are RGBA, RGB, Palette, Gray, and Alpha_gray.
 * If the dimensions of the PNG image differ from your settings in this method, the image will be cropped or zoomed to conform to your settings.
 * If you have enabled the local video preview by calling the startPreview method, you can use the visibleInPreview member to set whether or not the watermark is visible in the preview.
 * If you have enabled the mirror mode for the local video, the watermark on the local video is also mirrored. To avoid mirroring the watermark, Agora recommends that you do not use the mirror and watermark functions for the local video at the same time. You can implement the watermark function in your application layer.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param options The options of the watermark image to be added. 
 *
 * @param watermarkUrl The local file path of the watermark image to be added. This method supports adding a watermark image from the local absolute or relative file path.
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract addVideoWatermarkEx(watermarkUrl: string, options: WatermarkOptions, connection: RtcConnection): number;

/*
 * Removes the watermark image from the video stream.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 */
abstract clearVideoWatermarkEx(connection: RtcConnection): number;

/*
 * Agora supports reporting and analyzing customized messages.
 * Agora supports reporting and analyzing customized messages. This function is in the beta stage with a free trial. The ability provided in its beta test version is reporting a maximum of 10 message pieces within 6 seconds, with each message piece not exceeding 256 bytes and each string not exceeding 100 bytes. To try out this function, contact and discuss the format of customized messages with us.
 */
abstract sendCustomReportMessageEx(id: string, category: string, event: string, label: string, value: number, connection: RtcConnection): number;

/* api_irtcengineex_enableaudiovolumeindicationex */
abstract enableAudioVolumeIndicationEx(interval: number, smooth: number, reportVad: boolean, connection: RtcConnection): number;

/* api_irtcengineex_getuserinfobyuseraccountex */
abstract getUserInfoByUserAccountEx(userAccount: string, connection: RtcConnection): UserInfo;

/* api_irtcengineex_getuserinfobyuidex */
abstract getUserInfoByUidEx(uid: number, connection: RtcConnection): UserInfo;

/* api_irtcengineex_setvideoprofileex */
abstract setVideoProfileEx(width: number, height: number, frameRate: number, bitrate: number): number;

/* api_irtcengineex_enabledualstreammodeex */
abstract enableDualStreamModeEx(sourceType: VideoSourceType, enabled: boolean, streamConfig: SimulcastStreamConfig, connection: RtcConnection): number;

/*
 * Publishes the local stream to a specified CDN live streaming URL.
 * After calling this method, you can push media streams in RTMP or RTMPS protocol to the CDN according to RtcConnection . The SDK triggers the onRtmpStreamingStateChanged callback on the local client to report the state of adding a local stream to the CDN. Call this method after joining a channel.
 * Ensure that the Media Push function is enabled.
 * This method takes effect only when you are a host in live interactive streaming.
 * This method adds only one streaming URL to the CDN each time it is called. To push multiple URLs, call this method multiple times.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param transcodingEnabled Whether to enable transcoding. Transcoding in a CDN live streaming converts the audio and video streams before pushing them to the CDN server. It applies to scenarios where a channel has multiple broadcasters and composite layout is needed.
 *  true: Enable transcoding.
 *  false: Disable transcoding. If you set this parameter as true, ensurethat you call the setLiveTranscoding method before calling this method. 
 *
 * @param url The Media Push URL in the RTMP or RTMPS format. The maximum length of this parameter is 1024 bytes. The URL address must not contain special characters, such as Chinese language characters.
 *
 * @returns
 * 0: Success.
 * < 0: Failure.
 * -2: Invalid parameter, usually an empty URL or a string with a length of 0.
 * -7: The engine is not initialized when streaming.
 */
abstract addPublishStreamUrlEx(url: string, transcodingEnabled: boolean, connection: RtcConnection): number;

/*
 * Creates a data stream.
 * Creates a data stream. Each user can create up to five data streams in a single channel.
 * Compared with createDataStreamEx , this method does not support data reliability. If a data packet is not received five seconds after it was sent, the SDK directly discards the data.
 *
 * @param connection The connection information. See RtcConnection .
 *
 * @param config The configurations for the data stream. See DataStreamConfig .
 *
 * @returns
 * ID of the created data stream, if the method call succeeds.
 * < 0: Failure.
 */
abstract createDataStreamEx(config: DataStreamConfig, connection: RtcConnection): number;
}
