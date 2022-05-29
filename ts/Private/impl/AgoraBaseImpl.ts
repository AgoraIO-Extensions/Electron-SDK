import { callIrisApi } from '../internal/IrisApiEngine'
import { IPacketObserver, IVideoEncodedImageReceiver, IAudioEncodedFrameObserver, LicenseCallback } from '../AgoraBase'

export function processIPacketObserver (handler: IPacketObserver, event: string, jsonParams: any) {
  switch (event) {
    case 'onSendAudioPacket':
      if (handler.onSendAudioPacket !== undefined) {
        handler.onSendAudioPacket(jsonParams.packet)
      }
      break

    case 'onSendVideoPacket':
      if (handler.onSendVideoPacket !== undefined) {
        handler.onSendVideoPacket(jsonParams.packet)
      }
      break

    case 'onReceiveAudioPacket':
      if (handler.onReceiveAudioPacket !== undefined) {
        handler.onReceiveAudioPacket(jsonParams.packet)
      }
      break

    case 'onReceiveVideoPacket':
      if (handler.onReceiveVideoPacket !== undefined) {
        handler.onReceiveVideoPacket(jsonParams.packet)
      }
      break
  }
}

export function processIVideoEncodedImageReceiver (handler: IVideoEncodedImageReceiver, event: string, jsonParams: any) {
  switch (event) {
    case 'OnEncodedVideoImageReceived':
      if (handler.OnEncodedVideoImageReceived !== undefined) {
        handler.OnEncodedVideoImageReceived(jsonParams.imageBuffer, jsonParams.length, jsonParams.videoEncodedFrameInfo)
      }
      break
  }
}

export function processIAudioEncodedFrameObserver (handler: IAudioEncodedFrameObserver, event: string, jsonParams: any) {
  switch (event) {
    case 'OnRecordAudioEncodedFrame':
      if (handler.OnRecordAudioEncodedFrame !== undefined) {
        handler.OnRecordAudioEncodedFrame(jsonParams.frameBuffer, jsonParams.length, jsonParams.audioEncodedFrameInfo)
      }
      break

    case 'OnPlaybackAudioEncodedFrame':
      if (handler.OnPlaybackAudioEncodedFrame !== undefined) {
        handler.OnPlaybackAudioEncodedFrame(jsonParams.frameBuffer, jsonParams.length, jsonParams.audioEncodedFrameInfo)
      }
      break

    case 'OnMixedAudioEncodedFrame':
      if (handler.OnMixedAudioEncodedFrame !== undefined) {
        handler.OnMixedAudioEncodedFrame(jsonParams.frameBuffer, jsonParams.length, jsonParams.audioEncodedFrameInfo)
      }
      break
  }
}

export function processLicenseCallback (handler: LicenseCallback, event: string, jsonParams: any) {
  switch (event) {
    case 'onCertificateRequired':
      if (handler.onCertificateRequired !== undefined) {
        handler.onCertificateRequired()
      }
      break

    case 'onLicenseRequest':
      if (handler.onLicenseRequest !== undefined) {
        handler.onLicenseRequest()
      }
      break

    case 'onLicenseValidated':
      if (handler.onLicenseValidated !== undefined) {
        handler.onLicenseValidated()
      }
      break

    case 'onLicenseError':
      if (handler.onLicenseError !== undefined) {
        handler.onLicenseError(jsonParams.result)
      }
      break
  }
}
