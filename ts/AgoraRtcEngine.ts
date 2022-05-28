import { VideoSourceType } from "./AgoraSdk";
import { RtcEngineContext } from "./Private/IAgoraRtcEngine";
import { IRtcEngineExImpl } from "./Private/impl/IAgoraRtcEngineExImpl";
import { IRtcEngineImpl } from "./Private/impl/IAgoraRtcEngineImpl";
import { getBridge, sendMsg } from "./Private/internal/IrisApiEngine";
import { RendererManager } from "./Renderer/RendererManager";
import {
  Channel,
  CONTENT_MODE,
  RendererConfig,
  RendererConfigInternal,
  RENDER_MODE,
} from "./types";
import {
  formatVideoFrameBufferConfig,
  getRendererConfigInternal,
  logInfo,
  logWarn,
} from "./Utils";

/**
 * The AgoraRtcEngine class.
 */
export class AgoraRtcEngine extends IRtcEngineExImpl {
  // _rtcDeviceManager: NodeIrisRtcDeviceManager;

  engineId = `${parseInt(`${Math.random() * 100000}`)}`;
  _rendererManager?: RendererManager;
  constructor() {
    super();

    logInfo("AgoraRtcEngine constructor()");
    this._rendererManager = new RendererManager();

    // forwardEvent({
    //   event: {
    //     eventName,
    //     params: eventData,
    //     changeNameHandler: changeEventNameForOnXX,
    //   },
    //   fire: this.fire,
    //   filter: this.engineFilterEvent,
    // })

    // forwardEvent({
    //   event: {
    //     eventName,
    //     params: eventData,
    //     buffer: eventBuffer,
    //     changeNameHandler: changeEventNameForOnXX,
    //   },
    //   fire: this.fire,
    //   filter: this.engineFilterEventWithBuffer,
    // })
    // this._rendererManager = new RendererManager(this._rtcEngine);
  }
  setView(rendererConfig: RendererConfig): void {
    const config: RendererConfigInternal =
      getRendererConfigInternal(rendererConfig);

    if (rendererConfig.view) {
      this._rendererManager?.setRenderer(config);
    } else {
      logWarn("Note: setView view is null!");
      this._rendererManager?.removeRendererByConfig(config);
    }
  }
  destroyRendererByView(view: Element): void {
    this._rendererManager?.removeRendererByView(view);
  }

  destroyRendererByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ) {
    const config = formatVideoFrameBufferConfig(
      videoSourceType,
      channelId,
      uid
    );
    this._rendererManager?.removeRendererByConfig(config);
  }

  setRenderOption(
    view: HTMLElement,
    contentMode = CONTENT_MODE.FIT,
    mirror: boolean = false
  ): void {
    this._rendererManager?.setRenderOption(view, contentMode, mirror);
  }

  setRenderMode(mode: RENDER_MODE): void {
    this._rendererManager?.setRenderMode(mode);
  }

  /**
   * @private
   * @ignore
   * check if WebGL will be available with appropriate features
   * @return {boolean}
   */

  // /**
  //  * @private
  //  * @ignore
  //  */
  // resizeBuffer(
  //   uid: number,
  //   channelId: string,
  //   yStride: number,
  //   height: number,
  //   videoSourceType: VideoSourceType
  // ): VideoFrame {
  //   yStride = ((yStride + 15) >> 4) << 4;
  //   return {
  //     uid,
  //     channelId,
  //     yBuffer: Buffer.alloc(yStride * height),
  //     uBuffer: Buffer.alloc((yStride * height) / 4),
  //     vBuffer: Buffer.alloc((yStride * height) / 4),
  //     yStride,
  //     width: 0,
  //     height,
  //     videoSourceType,
  //   };
  // }

  // engineFilterEvent = (_eventName: string, params: Array<any>): Boolean => {
  //   switch (_eventName) {
  //     case NativeEngineEvents.onJoinChannelSuccess:
  //       {
  //         this.fire(EngineEvents.JOINED_CHANNEL, ...params);
  //         this.fire(EngineEvents.JOINEDCHANNEL, ...params);
  //         this.fire(EngineEvents.JOIN_CHANNEL_SUCCESS, ...params);
  //       }
  //       return true;
  //     case NativeEngineEvents.onLeaveChannel:
  //       {
  //         this.fire(EngineEvents.LEAVE_CHANNEL, ...params);
  //         this.fire(EngineEvents.LEAVECHANNEL, ...params);
  //       }
  //       return true;

  //     case NativeEngineEvents.onUserOffline:
  //       {
  //         this.fire(EngineEvents.USER_OFFLINE, ...params);
  //         const [connection, remoteUid] = params as [RtcConnection, number];
  //         const config = formatVideoFrameBufferConfig(
  //           VideoSourceType.kVideoSourceTypeRemote,
  //           connection.channelId,
  //           remoteUid
  //         );
  //         this._rendererManager?.removeRendererByConfig(config);
  //         this.fire(EngineEvents.REMOVE_STREAM, ...params);
  //       }
  //       return true;
  //     case NativeEngineEvents.onVideoSourceFrameSizeChangedIris:
  //       {
  //         const [uid, channelId, videoSourceType, width, height] = params as [
  //           number,
  //           string,
  //           VideoSourceType,
  //           number,
  //           number
  //         ];

  //         const videoFrameItem = this.resizeBuffer(
  //           uid,
  //           channelId,
  //           width,
  //           height,
  //           videoSourceType
  //         );
  //         const config = formatVideoFrameBufferConfig(
  //           videoSourceType,
  //           channelId,
  //           uid
  //         );
  //         this._rendererManager?.updateVideoFrameCacheInMap(
  //           config,
  //           videoFrameItem
  //         );
  //       }
  //       return true;
  //     default:
  //       return false;
  //   }
  // };

  // engineFilterEventWithBuffer = (
  //   _eventName: string,
  //   _eventData: Array<any>,
  //   _eventBuffer?: string
  // ): Boolean => {
  //   switch (_eventName) {
  //     case "onStreamMessage":
  //       {
  //         const [uid, streamId, length] = _eventData;
  //         this.fire(EngineEvents.STREAM_MESSAGE, uid, streamId, _eventBuffer);
  //       }
  //       return true;

  //     case "onReadyToSendMetadata":
  //       {
  //         const eventData: Array<Metadata> = _eventData;
  //         const [metadata] = eventData;
  //         metadata.buffer = _eventBuffer!;
  //         this.fire(EngineEvents.READY_TO_SEND_METADATA, metadata);
  //       }
  //       return true;
  //     case "onMetadataReceived":
  //       {
  //         const eventData: Array<Metadata> = _eventData;
  //         const [metadata] = eventData;
  //         metadata.buffer = _eventBuffer!;
  //         this.fire(EngineEvents.METADATA_RECEIVED, metadata);
  //       }
  //       return true;
  //     default:
  //       return false;
  //   }
  // };

  // override initialize(context: RtcEngineContext): number {
  //   const apiType = 'RtcEngine_initialize'
  //   const jsonParams = {
  //     context,
  //     toJSON: () => {
  //       return { context }
  //     }
  //   }
  //   const bridge = getBridge();
  //   bridge.InitializeEnv();
  //   return bridge.sendMsg(apiType, jsonParams);
  // }
  // override release(sync?: boolean): void {
  //   const apiType = 'RtcEngine_release'
  //   const jsonParams = {
  //     sync,
  //     toJSON: () => {
  //       return { sync }
  //     }
  //   }
  //   const bridge = getBridge();
  //   bridge.sendMsg(apiType, jsonParams);
  //   bridge.ReleaseEnv();
  // }
}
