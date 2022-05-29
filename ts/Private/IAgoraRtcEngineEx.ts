import { IRtcEngineEventHandler, LocalVideoStats, RemoteVideoStats, IRtcEngine, ChannelMediaOptions } from './IAgoraRtcEngine'
import { AudioVolumeInfo, RtcStats, VideoSourceType, LocalVideoStreamState, LocalVideoStreamError, RemoteVideoState, RemoteVideoStateReason, UserOfflineReasonType, LocalAudioStats, RemoteAudioStats, LocalAudioStreamState, LocalAudioStreamError, RemoteAudioState, RemoteAudioStateReason, ClientRoleType, ClientRoleChangeFailedReason, ConnectionStateType, ConnectionChangedReasonType, NetworkType, EncryptionErrorType, UploadErrorReason, VideoEncoderConfiguration, VideoCanvas, VideoStreamType, SpatialAudioParams, VideoMirrorModeType, EncryptionConfig, DataStreamConfig, WatermarkOptions, UserInfo, SimulcastStreamConfig } from './AgoraBase'
import { ContentInspectResult, RenderModeType } from './AgoraMediaBase'

export class RtcConnection {
  channelId?: string
  localUid?: number
  static fromJSON (json: any): RtcConnection {
    const obj = new RtcConnection()
    obj.channelId = json.channelId
    obj.localUid = json.localUid
    return obj
  }

  toJSON? () {
    return {
      channelId: this.channelId,
      localUid: this.localUid
    }
  }
}

export abstract class IRtcEngineEventHandlerEx extends IRtcEngineEventHandler {
  eventHandlerTypeEx?(): string;

  onJoinChannelSuccessEx?(connection: RtcConnection, elapsed: number): void;

  onRejoinChannelSuccessEx?(connection: RtcConnection, elapsed: number): void;

  onAudioQualityEx?(connection: RtcConnection, remoteUid: number, quality: number, delay: number, lost: number): void;

  onAudioVolumeIndicationEx?(connection: RtcConnection, speakers: AudioVolumeInfo[], speakerNumber: number, totalVolume: number): void;

  onLeaveChannelEx?(connection: RtcConnection, stats: RtcStats): void;

  onRtcStatsEx?(connection: RtcConnection, stats: RtcStats): void;

  onNetworkQualityEx?(connection: RtcConnection, remoteUid: number, txQuality: number, rxQuality: number): void;

  onIntraRequestReceivedEx?(connection: RtcConnection): void;

  onFirstLocalVideoFrameEx?(connection: RtcConnection, width: number, height: number, elapsed: number): void;

  onFirstLocalVideoFramePublishedEx?(connection: RtcConnection, elapsed: number): void;

  onVideoSourceFrameSizeChangedEx?(connection: RtcConnection, sourceType: VideoSourceType, width: number, height: number): void;

  onFirstRemoteVideoDecodedEx?(connection: RtcConnection, remoteUid: number, width: number, height: number, elapsed: number): void;

  onVideoSizeChangedEx?(connection: RtcConnection, uid: number, width: number, height: number, rotation: number): void;

  onContentInspectResultEx?(result: ContentInspectResult): void;

  onSnapshotTakenEx?(connection: RtcConnection, filePath: string, width: number, height: number, errCode: number): void;

  onLocalVideoStateChangedEx?(connection: RtcConnection, state: LocalVideoStreamState, errorCode: LocalVideoStreamError): void;

  onRemoteVideoStateChangedEx?(connection: RtcConnection, remoteUid: number, state: RemoteVideoState, reason: RemoteVideoStateReason, elapsed: number): void;

  onFirstRemoteVideoFrameEx?(connection: RtcConnection, remoteUid: number, width: number, height: number, elapsed: number): void;

  onUserJoinedEx?(connection: RtcConnection, remoteUid: number, elapsed: number): void;

  onUserOfflineEx?(connection: RtcConnection, remoteUid: number, reason: UserOfflineReasonType): void;

  onUserMuteAudioEx?(connection: RtcConnection, remoteUid: number, muted: boolean): void;

  onUserMuteVideoEx?(connection: RtcConnection, remoteUid: number, muted: boolean): void;

  onUserEnableVideoEx?(connection: RtcConnection, remoteUid: number, enabled: boolean): void;

  onUserEnableLocalVideoEx?(connection: RtcConnection, remoteUid: number, enabled: boolean): void;

  onUserStateChangedEx?(connection: RtcConnection, remoteUid: number, state: number): void;

  onLocalAudioStatsEx?(connection: RtcConnection, stats: LocalAudioStats): void;

  onRemoteAudioStatsEx?(connection: RtcConnection, stats: RemoteAudioStats): void;

  onLocalVideoStatsEx?(connection: RtcConnection, stats: LocalVideoStats): void;

  onRemoteVideoStatsEx?(connection: RtcConnection, stats: RemoteVideoStats): void;

  onConnectionLostEx?(connection: RtcConnection): void;

  onConnectionInterruptedEx?(connection: RtcConnection): void;

  onConnectionBannedEx?(connection: RtcConnection): void;

  onStreamMessageEx?(connection: RtcConnection, remoteUid: number, streamId: number, data: number[], length: number, sentTs: number): void;

  onStreamMessageErrorEx?(connection: RtcConnection, remoteUid: number, streamId: number, code: number, missed: number, cached: number): void;

  onRequestTokenEx?(connection: RtcConnection): void;

  onTokenPrivilegeWillExpireEx?(connection: RtcConnection, token: string): void;

  onFirstLocalAudioFramePublishedEx?(connection: RtcConnection, elapsed: number): void;

  onFirstRemoteAudioFrameEx?(connection: RtcConnection, userId: number, elapsed: number): void;

  onFirstRemoteAudioDecodedEx?(connection: RtcConnection, uid: number, elapsed: number): void;

  onLocalAudioStateChangedEx?(connection: RtcConnection, state: LocalAudioStreamState, error: LocalAudioStreamError): void;

  onRemoteAudioStateChangedEx?(connection: RtcConnection, remoteUid: number, state: RemoteAudioState, reason: RemoteAudioStateReason, elapsed: number): void;

  onActiveSpeakerEx?(connection: RtcConnection, uid: number): void;

  onClientRoleChangedEx?(connection: RtcConnection, oldRole: ClientRoleType, newRole: ClientRoleType): void;

  onClientRoleChangeFailedEx?(connection: RtcConnection, reason: ClientRoleChangeFailedReason, currentRole: ClientRoleType): void;

  onRemoteAudioTransportStatsEx?(connection: RtcConnection, remoteUid: number, delay: number, lost: number, rxKBitRate: number): void;

  onRemoteVideoTransportStatsEx?(connection: RtcConnection, remoteUid: number, delay: number, lost: number, rxKBitRate: number): void;

  onConnectionStateChangedEx?(connection: RtcConnection, state: ConnectionStateType, reason: ConnectionChangedReasonType): void;

  onNetworkTypeChangedEx?(connection: RtcConnection, type: NetworkType): void;

  onEncryptionErrorEx?(connection: RtcConnection, errorType: EncryptionErrorType): void;

  onUploadLogResultEx?(connection: RtcConnection, requestId: string, success: boolean, reason: UploadErrorReason): void;

  onUserAccountUpdatedEx?(connection: RtcConnection, remoteUid: number, userAccount: string): void;
}

export abstract class IRtcEngineEx extends IRtcEngine {
abstract joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions, eventHandler: IRtcEngineEventHandler): number;

abstract leaveChannelEx(connection: RtcConnection): number;

abstract updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): number;

abstract setVideoEncoderConfigurationEx(config: VideoEncoderConfiguration, connection: RtcConnection): number;

abstract setupRemoteVideoEx(canvas: VideoCanvas, connection: RtcConnection): number;

abstract muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): number;

abstract muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): number;

abstract setRemoteVideoStreamTypeEx(uid: number, streamType: VideoStreamType, connection: RtcConnection): number;

abstract setRemoteVoicePositionEx(uid: number, pan: number, gain: number, connection: RtcConnection): number;

abstract setRemoteUserSpatialAudioParamsEx(uid: number, params: SpatialAudioParams, connection: RtcConnection): number;

abstract setRemoteRenderModeEx(uid: number, renderMode: RenderModeType, mirrorMode: VideoMirrorModeType, connection: RtcConnection): number;

abstract enableLoopbackRecordingEx(connection: RtcConnection, enabled: boolean, deviceName?: string): number;

abstract getConnectionStateEx(connection: RtcConnection): ConnectionStateType;

abstract enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): number;

abstract createDataStreamEx(reliable: boolean, ordered: boolean, connection: RtcConnection): number;

abstract createDataStreamEx2(config: DataStreamConfig, connection: RtcConnection): number;

abstract sendStreamMessageEx(streamId: number, data: number[], length: number, connection: RtcConnection): number;

abstract addVideoWatermarkEx(watermarkUrl: string, options: WatermarkOptions, connection: RtcConnection): number;

abstract clearVideoWatermarkEx(connection: RtcConnection): number;

abstract sendCustomReportMessageEx(id: string, category: string, event: string, label: string, value: number, connection: RtcConnection): number;

abstract enableAudioVolumeIndicationEx(interval: number, smooth: number, reportVad: boolean, connection: RtcConnection): number;

abstract getUserInfoByUserAccountEx(userAccount: string, connection: RtcConnection): UserInfo;

abstract getUserInfoByUidEx(uid: number, connection: RtcConnection): UserInfo;

abstract setVideoProfileEx(width: number, height: number, frameRate: number, bitrate: number): number;

abstract enableDualStreamModeEx(sourceType: VideoSourceType, enabled: boolean, streamConfig: SimulcastStreamConfig, connection: RtcConnection): number;

abstract addPublishStreamUrlEx(url: string, transcodingEnabled: boolean, connection: RtcConnection): number;
}
