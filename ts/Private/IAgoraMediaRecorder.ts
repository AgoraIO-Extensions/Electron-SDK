import './extension/IAgoraMediaRecorderExtension';
import {
  IMediaRecorderObserver,
  MediaRecorderConfiguration,
} from './AgoraMediaBase';
import { RtcConnection } from './IAgoraRtcEngineEx';

/**
 * @ignore
 */
export abstract class IMediaRecorder {
  /**
   * @ignore
   */
  abstract setMediaRecorderObserver(
    connection: RtcConnection,
    callback: IMediaRecorderObserver
  ): number;

  /**
   * @ignore
   */
  abstract startRecording(
    connection: RtcConnection,
    config: MediaRecorderConfiguration
  ): number;

  /**
   * @ignore
   */
  abstract stopRecording(connection: RtcConnection): number;

  /**
   * @ignore
   */
  abstract release(): void;
}
