import { callIrisApi } from '../internal/IrisApiEngine'
import { IRtcEngineEventHandlerEx, IRtcEngineEx, RtcConnection } from '../IAgoraRtcEngineEx'
import { IRtcEngineImpl } from './IAgoraRtcEngineImpl'
import { ChannelMediaOptions, IRtcEngineEventHandler } from '../IAgoraRtcEngine'
import { VideoEncoderConfiguration, VideoCanvas, VideoStreamType, SpatialAudioParams, VideoMirrorModeType, ConnectionStateType, EncryptionConfig, DataStreamConfig, WatermarkOptions, UserInfo, VideoSourceType, SimulcastStreamConfig } from '../AgoraBase'
import { RenderModeType } from '../AgoraMediaBase'

export function processIRtcEngineEventHandlerEx (handler: IRtcEngineEventHandlerEx, event: string, jsonParams: any) {
  switch (event) {
    case 'eventHandlerTypeEx':
      if (handler.eventHandlerTypeEx !== undefined) {
        handler.eventHandlerTypeEx()
      }
      break

    case 'onJoinChannelSuccessEx':
      if (handler.onJoinChannelSuccessEx !== undefined) {
        handler.onJoinChannelSuccessEx(jsonParams.connection, jsonParams.elapsed)
      }
      break

    case 'onRejoinChannelSuccessEx':
      if (handler.onRejoinChannelSuccessEx !== undefined) {
        handler.onRejoinChannelSuccessEx(jsonParams.connection, jsonParams.elapsed)
      }
      break

    case 'onAudioQualityEx':
      if (handler.onAudioQualityEx !== undefined) {
        handler.onAudioQualityEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.quality, jsonParams.delay, jsonParams.lost)
      }
      break

    case 'onAudioVolumeIndicationEx':
      if (handler.onAudioVolumeIndicationEx !== undefined) {
        handler.onAudioVolumeIndicationEx(jsonParams.connection, jsonParams.speakers, jsonParams.speakerNumber, jsonParams.totalVolume)
      }
      break

    case 'onLeaveChannelEx':
      if (handler.onLeaveChannelEx !== undefined) {
        handler.onLeaveChannelEx(jsonParams.connection, jsonParams.stats)
      }
      break

    case 'onRtcStatsEx':
      if (handler.onRtcStatsEx !== undefined) {
        handler.onRtcStatsEx(jsonParams.connection, jsonParams.stats)
      }
      break

    case 'onNetworkQualityEx':
      if (handler.onNetworkQualityEx !== undefined) {
        handler.onNetworkQualityEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.txQuality, jsonParams.rxQuality)
      }
      break

    case 'onIntraRequestReceivedEx':
      if (handler.onIntraRequestReceivedEx !== undefined) {
        handler.onIntraRequestReceivedEx(jsonParams.connection)
      }
      break

    case 'onFirstLocalVideoFrameEx':
      if (handler.onFirstLocalVideoFrameEx !== undefined) {
        handler.onFirstLocalVideoFrameEx(jsonParams.connection, jsonParams.width, jsonParams.height, jsonParams.elapsed)
      }
      break

    case 'onFirstLocalVideoFramePublishedEx':
      if (handler.onFirstLocalVideoFramePublishedEx !== undefined) {
        handler.onFirstLocalVideoFramePublishedEx(jsonParams.connection, jsonParams.elapsed)
      }
      break

    case 'onVideoSourceFrameSizeChangedEx':
      if (handler.onVideoSourceFrameSizeChangedEx !== undefined) {
        handler.onVideoSourceFrameSizeChangedEx(jsonParams.connection, jsonParams.sourceType, jsonParams.width, jsonParams.height)
      }
      break

    case 'onFirstRemoteVideoDecodedEx':
      if (handler.onFirstRemoteVideoDecodedEx !== undefined) {
        handler.onFirstRemoteVideoDecodedEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.width, jsonParams.height, jsonParams.elapsed)
      }
      break

    case 'onVideoSizeChangedEx':
      if (handler.onVideoSizeChangedEx !== undefined) {
        handler.onVideoSizeChangedEx(jsonParams.connection, jsonParams.uid, jsonParams.width, jsonParams.height, jsonParams.rotation)
      }
      break

    case 'onContentInspectResultEx':
      if (handler.onContentInspectResultEx !== undefined) {
        handler.onContentInspectResultEx(jsonParams.result)
      }
      break

    case 'onSnapshotTakenEx':
      if (handler.onSnapshotTakenEx !== undefined) {
        handler.onSnapshotTakenEx(jsonParams.connection, jsonParams.filePath, jsonParams.width, jsonParams.height, jsonParams.errCode)
      }
      break

    case 'onLocalVideoStateChangedEx':
      if (handler.onLocalVideoStateChangedEx !== undefined) {
        handler.onLocalVideoStateChangedEx(jsonParams.connection, jsonParams.state, jsonParams.errorCode)
      }
      break

    case 'onRemoteVideoStateChangedEx':
      if (handler.onRemoteVideoStateChangedEx !== undefined) {
        handler.onRemoteVideoStateChangedEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.state, jsonParams.reason, jsonParams.elapsed)
      }
      break

    case 'onFirstRemoteVideoFrameEx':
      if (handler.onFirstRemoteVideoFrameEx !== undefined) {
        handler.onFirstRemoteVideoFrameEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.width, jsonParams.height, jsonParams.elapsed)
      }
      break

    case 'onUserJoinedEx':
      if (handler.onUserJoinedEx !== undefined) {
        handler.onUserJoinedEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.elapsed)
      }
      break

    case 'onUserOfflineEx':
      if (handler.onUserOfflineEx !== undefined) {
        handler.onUserOfflineEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.reason)
      }
      break

    case 'onUserMuteAudioEx':
      if (handler.onUserMuteAudioEx !== undefined) {
        handler.onUserMuteAudioEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.muted)
      }
      break

    case 'onUserMuteVideoEx':
      if (handler.onUserMuteVideoEx !== undefined) {
        handler.onUserMuteVideoEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.muted)
      }
      break

    case 'onUserEnableVideoEx':
      if (handler.onUserEnableVideoEx !== undefined) {
        handler.onUserEnableVideoEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.enabled)
      }
      break

    case 'onUserEnableLocalVideoEx':
      if (handler.onUserEnableLocalVideoEx !== undefined) {
        handler.onUserEnableLocalVideoEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.enabled)
      }
      break

    case 'onUserStateChangedEx':
      if (handler.onUserStateChangedEx !== undefined) {
        handler.onUserStateChangedEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.state)
      }
      break

    case 'onLocalAudioStatsEx':
      if (handler.onLocalAudioStatsEx !== undefined) {
        handler.onLocalAudioStatsEx(jsonParams.connection, jsonParams.stats)
      }
      break

    case 'onRemoteAudioStatsEx':
      if (handler.onRemoteAudioStatsEx !== undefined) {
        handler.onRemoteAudioStatsEx(jsonParams.connection, jsonParams.stats)
      }
      break

    case 'onLocalVideoStatsEx':
      if (handler.onLocalVideoStatsEx !== undefined) {
        handler.onLocalVideoStatsEx(jsonParams.connection, jsonParams.stats)
      }
      break

    case 'onRemoteVideoStatsEx':
      if (handler.onRemoteVideoStatsEx !== undefined) {
        handler.onRemoteVideoStatsEx(jsonParams.connection, jsonParams.stats)
      }
      break

    case 'onConnectionLostEx':
      if (handler.onConnectionLostEx !== undefined) {
        handler.onConnectionLostEx(jsonParams.connection)
      }
      break

    case 'onConnectionInterruptedEx':
      if (handler.onConnectionInterruptedEx !== undefined) {
        handler.onConnectionInterruptedEx(jsonParams.connection)
      }
      break

    case 'onConnectionBannedEx':
      if (handler.onConnectionBannedEx !== undefined) {
        handler.onConnectionBannedEx(jsonParams.connection)
      }
      break

    case 'onStreamMessageEx':
      if (handler.onStreamMessageEx !== undefined) {
        handler.onStreamMessageEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.streamId, jsonParams.data, jsonParams.length, jsonParams.sentTs)
      }
      break

    case 'onStreamMessageErrorEx':
      if (handler.onStreamMessageErrorEx !== undefined) {
        handler.onStreamMessageErrorEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.streamId, jsonParams.code, jsonParams.missed, jsonParams.cached)
      }
      break

    case 'onRequestTokenEx':
      if (handler.onRequestTokenEx !== undefined) {
        handler.onRequestTokenEx(jsonParams.connection)
      }
      break

    case 'onTokenPrivilegeWillExpireEx':
      if (handler.onTokenPrivilegeWillExpireEx !== undefined) {
        handler.onTokenPrivilegeWillExpireEx(jsonParams.connection, jsonParams.token)
      }
      break

    case 'onFirstLocalAudioFramePublishedEx':
      if (handler.onFirstLocalAudioFramePublishedEx !== undefined) {
        handler.onFirstLocalAudioFramePublishedEx(jsonParams.connection, jsonParams.elapsed)
      }
      break

    case 'onFirstRemoteAudioFrameEx':
      if (handler.onFirstRemoteAudioFrameEx !== undefined) {
        handler.onFirstRemoteAudioFrameEx(jsonParams.connection, jsonParams.userId, jsonParams.elapsed)
      }
      break

    case 'onFirstRemoteAudioDecodedEx':
      if (handler.onFirstRemoteAudioDecodedEx !== undefined) {
        handler.onFirstRemoteAudioDecodedEx(jsonParams.connection, jsonParams.uid, jsonParams.elapsed)
      }
      break

    case 'onLocalAudioStateChangedEx':
      if (handler.onLocalAudioStateChangedEx !== undefined) {
        handler.onLocalAudioStateChangedEx(jsonParams.connection, jsonParams.state, jsonParams.error)
      }
      break

    case 'onRemoteAudioStateChangedEx':
      if (handler.onRemoteAudioStateChangedEx !== undefined) {
        handler.onRemoteAudioStateChangedEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.state, jsonParams.reason, jsonParams.elapsed)
      }
      break

    case 'onActiveSpeakerEx':
      if (handler.onActiveSpeakerEx !== undefined) {
        handler.onActiveSpeakerEx(jsonParams.connection, jsonParams.uid)
      }
      break

    case 'onClientRoleChangedEx':
      if (handler.onClientRoleChangedEx !== undefined) {
        handler.onClientRoleChangedEx(jsonParams.connection, jsonParams.oldRole, jsonParams.newRole)
      }
      break

    case 'onClientRoleChangeFailedEx':
      if (handler.onClientRoleChangeFailedEx !== undefined) {
        handler.onClientRoleChangeFailedEx(jsonParams.connection, jsonParams.reason, jsonParams.currentRole)
      }
      break

    case 'onRemoteAudioTransportStatsEx':
      if (handler.onRemoteAudioTransportStatsEx !== undefined) {
        handler.onRemoteAudioTransportStatsEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.delay, jsonParams.lost, jsonParams.rxKBitRate)
      }
      break

    case 'onRemoteVideoTransportStatsEx':
      if (handler.onRemoteVideoTransportStatsEx !== undefined) {
        handler.onRemoteVideoTransportStatsEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.delay, jsonParams.lost, jsonParams.rxKBitRate)
      }
      break

    case 'onConnectionStateChangedEx':
      if (handler.onConnectionStateChangedEx !== undefined) {
        handler.onConnectionStateChangedEx(jsonParams.connection, jsonParams.state, jsonParams.reason)
      }
      break

    case 'onNetworkTypeChangedEx':
      if (handler.onNetworkTypeChangedEx !== undefined) {
        handler.onNetworkTypeChangedEx(jsonParams.connection, jsonParams.type)
      }
      break

    case 'onEncryptionErrorEx':
      if (handler.onEncryptionErrorEx !== undefined) {
        handler.onEncryptionErrorEx(jsonParams.connection, jsonParams.errorType)
      }
      break

    case 'onUploadLogResultEx':
      if (handler.onUploadLogResultEx !== undefined) {
        handler.onUploadLogResultEx(jsonParams.connection, jsonParams.requestId, jsonParams.success, jsonParams.reason)
      }
      break

    case 'onUserAccountUpdatedEx':
      if (handler.onUserAccountUpdatedEx !== undefined) {
        handler.onUserAccountUpdatedEx(jsonParams.connection, jsonParams.remoteUid, jsonParams.userAccount)
      }
      break
  }
}

export class IRtcEngineExImpl extends IRtcEngineImpl implements IRtcEngineEx {
  joinChannelEx (token: string, connection: RtcConnection, options: ChannelMediaOptions, eventHandler: IRtcEngineEventHandler): number {
    const apiType = 'RtcEngineEx_joinChannelEx'
    const jsonParams = {
      token,
      connection,
      options,
      eventHandler,
      toJSON: () => {
        return {
          token,
          connection,
          options
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  leaveChannelEx (connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_leaveChannelEx'
    const jsonParams = {
      connection,
      toJSON: () => {
        return { connection }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  updateChannelMediaOptionsEx (options: ChannelMediaOptions, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_updateChannelMediaOptionsEx'
    const jsonParams = {
      options,
      connection,
      toJSON: () => {
        return {
          options,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setVideoEncoderConfigurationEx (config: VideoEncoderConfiguration, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_setVideoEncoderConfigurationEx'
    const jsonParams = {
      config,
      connection,
      toJSON: () => {
        return {
          config,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setupRemoteVideoEx (canvas: VideoCanvas, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_setupRemoteVideoEx'
    const jsonParams = {
      canvas,
      connection,
      toJSON: () => {
        return {
          canvas,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  muteRemoteAudioStreamEx (uid: number, mute: boolean, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_muteRemoteAudioStreamEx'
    const jsonParams = {
      uid,
      mute,
      connection,
      toJSON: () => {
        return {
          uid,
          mute,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  muteRemoteVideoStreamEx (uid: number, mute: boolean, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_muteRemoteVideoStreamEx'
    const jsonParams = {
      uid,
      mute,
      connection,
      toJSON: () => {
        return {
          uid,
          mute,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setRemoteVideoStreamTypeEx (uid: number, streamType: VideoStreamType, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_setRemoteVideoStreamTypeEx'
    const jsonParams = {
      uid,
      streamType,
      connection,
      toJSON: () => {
        return {
          uid,
          streamType,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setRemoteVoicePositionEx (uid: number, pan: number, gain: number, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_setRemoteVoicePositionEx'
    const jsonParams = {
      uid,
      pan,
      gain,
      connection,
      toJSON: () => {
        return {
          uid,
          pan,
          gain,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setRemoteUserSpatialAudioParamsEx (uid: number, params: SpatialAudioParams, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_setRemoteUserSpatialAudioParamsEx'
    const jsonParams = {
      uid,
      params,
      connection,
      toJSON: () => {
        return {
          uid,
          params,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setRemoteRenderModeEx (uid: number, renderMode: RenderModeType, mirrorMode: VideoMirrorModeType, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_setRemoteRenderModeEx'
    const jsonParams = {
      uid,
      renderMode,
      mirrorMode,
      connection,
      toJSON: () => {
        return {
          uid,
          renderMode,
          mirrorMode,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  enableLoopbackRecordingEx (connection: RtcConnection, enabled: boolean, deviceName?: string): number {
    const apiType = 'RtcEngineEx_enableLoopbackRecordingEx'
    const jsonParams = {
      connection,
      enabled,
      deviceName,
      toJSON: () => {
        return {
          connection,
          enabled,
          deviceName
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  getConnectionStateEx (connection: RtcConnection): ConnectionStateType {
    const apiType = 'RtcEngineEx_getConnectionStateEx'
    const jsonParams = {
      connection,
      toJSON: () => {
        return { connection }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  enableEncryptionEx (connection: RtcConnection, enabled: boolean, config: EncryptionConfig): number {
    const apiType = 'RtcEngineEx_enableEncryptionEx'
    const jsonParams = {
      connection,
      enabled,
      config,
      toJSON: () => {
        return {
          connection,
          enabled,
          config
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  createDataStreamEx (reliable: boolean, ordered: boolean, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_createDataStreamEx'
    const jsonParams = {
      reliable,
      ordered,
      connection,
      toJSON: () => {
        return {
          reliable,
          ordered,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const streamId = jsonResults.streamId
    return streamId
  }

  createDataStreamEx2 (config: DataStreamConfig, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_createDataStreamEx2'
    const jsonParams = {
      config,
      connection,
      toJSON: () => {
        return {
          config,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const streamId = jsonResults.streamId
    return streamId
  }

  sendStreamMessageEx (streamId: number, data: number[], length: number, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_sendStreamMessageEx'
    const jsonParams = {
      streamId,
      data,
      length,
      connection,
      toJSON: () => {
        return {
          streamId,
          length,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  addVideoWatermarkEx (watermarkUrl: string, options: WatermarkOptions, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_addVideoWatermarkEx'
    const jsonParams = {
      watermarkUrl,
      options,
      connection,
      toJSON: () => {
        return {
          watermarkUrl,
          options,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  clearVideoWatermarkEx (connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_clearVideoWatermarkEx'
    const jsonParams = {
      connection,
      toJSON: () => {
        return { connection }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  sendCustomReportMessageEx (id: string, category: string, event: string, label: string, value: number, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_sendCustomReportMessageEx'
    const jsonParams = {
      id,
      category,
      event,
      label,
      value,
      connection,
      toJSON: () => {
        return {
          id,
          category,
          event,
          label,
          value,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  enableAudioVolumeIndicationEx (interval: number, smooth: number, reportVad: boolean, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_enableAudioVolumeIndicationEx'
    const jsonParams = {
      interval,
      smooth,
      reportVad,
      connection,
      toJSON: () => {
        return {
          interval,
          smooth,
          reportVad,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  getUserInfoByUserAccountEx (userAccount: string, connection: RtcConnection): UserInfo {
    const apiType = 'RtcEngineEx_getUserInfoByUserAccountEx'
    const jsonParams = {
      userAccount,
      connection,
      toJSON: () => {
        return {
          userAccount,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const userInfo = jsonResults.userInfo
    return userInfo
  }

  getUserInfoByUidEx (uid: number, connection: RtcConnection): UserInfo {
    const apiType = 'RtcEngineEx_getUserInfoByUidEx'
    const jsonParams = {
      uid,
      connection,
      toJSON: () => {
        return {
          uid,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const userInfo = jsonResults.userInfo
    return userInfo
  }

  setVideoProfileEx (width: number, height: number, frameRate: number, bitrate: number): number {
    const apiType = 'RtcEngineEx_setVideoProfileEx'
    const jsonParams = {
      width,
      height,
      frameRate,
      bitrate,
      toJSON: () => {
        return {
          width,
          height,
          frameRate,
          bitrate
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  enableDualStreamModeEx (sourceType: VideoSourceType, enabled: boolean, streamConfig: SimulcastStreamConfig, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_enableDualStreamModeEx'
    const jsonParams = {
      sourceType,
      enabled,
      streamConfig,
      connection,
      toJSON: () => {
        return {
          sourceType,
          enabled,
          streamConfig,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  addPublishStreamUrlEx (url: string, transcodingEnabled: boolean, connection: RtcConnection): number {
    const apiType = 'RtcEngineEx_addPublishStreamUrlEx'
    const jsonParams = {
      url,
      transcodingEnabled,
      connection,
      toJSON: () => {
        return {
          url,
          transcodingEnabled,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }
}
