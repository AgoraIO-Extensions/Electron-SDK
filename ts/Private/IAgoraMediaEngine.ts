import { IAudioFrameObserver, IVideoFrameObserver, MediaSourceType, AudioFrame, ExternalVideoSourceType, ExternalVideoFrame } from './AgoraMediaBase'
import { IVideoEncodedImageReceiver, EncodedVideoFrameInfo } from './AgoraBase'
import { RtcConnection } from './IAgoraRtcEngineEx'

export abstract class IMediaEngine {
abstract registerAudioFrameObserver(observer: IAudioFrameObserver): number;

abstract registerVideoFrameObserver(observer: IVideoFrameObserver): number;

abstract registerVideoEncodedImageReceiver(receiver: IVideoEncodedImageReceiver): number;

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

abstract pushEncodedVideoImage(imageBuffer: number[], length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo): number;

abstract pushEncodedVideoImage2(imageBuffer: number[], length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo, connection: RtcConnection): number;

abstract release(): void;
}
