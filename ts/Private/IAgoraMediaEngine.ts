import { MediaSourceType, AudioFrame, ExternalVideoSourceType, ExternalVideoFrame } from './AgoraMediaBase'
import { RtcConnection } from './IAgoraRtcEngineEx'
import { EncodedVideoFrameInfo } from './AgoraBase'

export abstract class IMediaEngine {
abstract pushAudioFrame(type: MediaSourceType, frame: AudioFrame, wrap?: boolean, sourceId?: number): number;

abstract pushCaptureAudioFrame(frame: AudioFrame): number;

abstract pushReverseAudioFrame(frame: AudioFrame): number;

abstract pushDirectAudioFrame(frame: AudioFrame): number;

abstract pullAudioFrame(): AudioFrame;

abstract setExternalVideoSource(enabled: boolean, useTexture: boolean, sourceType?: ExternalVideoSourceType): number;

abstract setExternalAudioSource(enabled: boolean, sampleRate: number, channels: number, sourceNumber?: number, localPlayback?: boolean, publish?: boolean): number;

abstract setExternalAudioSink(sampleRate: number, channels: number): number;

abstract enableCustomAudioLocalPlayback(sourceId: number, enabled: boolean): number;

abstract setDirectExternalAudioSource(enable: boolean, localPlayback?: boolean): number;

abstract pushVideoFrame(frame: ExternalVideoFrame): number;

abstract pushVideoFrame2(frame: ExternalVideoFrame, connection: RtcConnection): number;

abstract pushEncodedVideoImage(imageBuffer: Uint8Array, length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo): number;

abstract pushEncodedVideoImage2(imageBuffer: Uint8Array, length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo, connection: RtcConnection): number;

abstract release(): void;
}
