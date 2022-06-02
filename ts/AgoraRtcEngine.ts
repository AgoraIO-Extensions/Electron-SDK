import { VideoCanvas, VideoSourceType } from "./Private/AgoraBase";
import { IMediaPlayer } from "./Private/IAgoraMediaPlayer";
import {
  ChannelMediaOptions,
  RtcEngineContext,
} from "./Private/IAgoraRtcEngine";
import {
  IRtcEngineEventHandlerEx,
  RtcConnection,
} from "./Private/IAgoraRtcEngineEx";
import { IRtcEngineExImpl } from "./Private/impl/IAgoraRtcEngineExImpl";
import { IVideoDeviceManagerImpl } from "./Private/impl/IAgoraRtcEngineImpl";
import { IAudioDeviceManagerImpl } from "./Private/impl/IAudioDeviceManagerImpl";
import { getBridge, handlerRTCEvent } from "./Private/internal/IrisApiEngine";
import {
  handlerMPKEvent,
  MediaPlayerInternal,
} from "./Private/internal/MediaPlayerInternal";
import AgoraRendererManager from "./Renderer/RendererManager";
import {
  CallBackModule,
  Channel,
  RendererVideoConfig,
  RENDER_MODE,
} from "./Types";
import { AgoraEnv, deprecate, logDebug, logError, logWarn } from "./Utils";
import { RenderModeType } from "./Private/AgoraMediaBase";

/**
 * The AgoraRtcEngine class.
 */
export class AgoraRtcEngine extends IRtcEngineExImpl {
  // constructor() {
  //   super();

  //   logDebug("AgoraRtcEngine constructor()");
  // }

  // override initialize(context: RtcEngineContext): number {
  //   if (AgoraEnv.isInitializeEngine) {
  //     logWarn("initialize: already initialize rtcEngine");
  //     return -1;
  //   }
  //   AgoraEnv.isInitializeEngine = true;
  //   const bridge = getBridge();
  //   bridge.InitializeEnv();
  //   bridge.OnEvent(
  //     CallBackModule.RTC,
  //     "call_back_with_buffer",
  //     handlerRTCEvent
  //   );
  //   bridge.OnEvent(
  //     CallBackModule.MPK,
  //     "call_back_with_buffer",
  //     handlerMPKEvent
  //   );
  //   AgoraEnv.AgoraRendererManager?.enableRender();
  //   const ret = super.initialize(context);
  //   return ret;
  // }
  // override release(sync = false): void {
  //   if (!AgoraEnv.isInitializeEngine) {
  //     logWarn("release: rtcEngine have not initialize");
  //     return;
  //   }
  //   AgoraEnv.AgoraRendererManager?.enableRender(false);
  //   AgoraEnv.isInitializeEngine = false;
  //   super.release(sync);
  //   getBridge().ReleaseEnv();
  // }

  // createMediaPlayer(): IMediaPlayer {
  //   if (!AgoraEnv.isInitializeEngine) {
  //     logError("createMediaPlayer: rtcEngine have not initialize");
  //   }
  //   // @ts-ignore
  //   const mediaPlayerId = super.createMediaPlayer() as number;
  //   return new MediaPlayerInternal(mediaPlayerId);
  // }
  // override registerEventHandler(
  //   eventHandler: IRtcEngineEventHandlerEx
  // ): boolean {
  //   return super.registerEventHandler(eventHandler);
  // }
  // override unregisterEventHandler(
  //   eventHandler: IRtcEngineEventHandlerEx
  // ): boolean {
  //   return super.unregisterEventHandler(eventHandler);
  // }

  override joinChannelEx(
    token: string,
    connection: RtcConnection,
    options: ChannelMediaOptions,
    eventHandler?: IRtcEngineEventHandlerEx
  ): number {
    if (eventHandler) {
      this.registerEventHandler(eventHandler);
    }

    return super.joinChannelEx(token, connection, options, eventHandler!);
  }
  // override setupLocalVideo(canvas: VideoCanvas): number {
  //   return super.setupLocalVideo(canvas);
  // }
  // override setupLocalVideo(rendererConfig: RendererVideoConfig): number {
  //   return AgoraRendererManager.setupLocalVideo(rendererConfig);
  // }
  // override setupRemoteVideo(rendererConfig: RendererVideoConfig): number {
  //   return AgoraRendererManager.setupRemoteVideo(rendererConfig);
  // }
  // setupVideo(rendererConfig: RendererVideoConfig): void {
  //   AgoraRendererManager.setupVideo(rendererConfig);
  // }

  // destroyRendererByView(view: Element): void {
  //   AgoraRendererManager.destroyRendererByView(view);
  // }

  // destroyRendererByConfig(
  //   videoSourceType: VideoSourceType,
  //   channelId?: Channel,
  //   uid?: number
  // ) {
  //   AgoraRendererManager.destroyRenderersByConfig(
  //     videoSourceType,
  //     channelId,
  //     uid
  //   );
  // }

  // setRenderOption(
  //   view: HTMLElement,
  //   contentMode = RenderModeType.RenderModeFit,
  //   mirror: boolean = false
  // ): void {
  //   AgoraRendererManager.setRenderOption(view, contentMode, mirror);
  // }

  // setRenderOptionByConfig(rendererConfig: RendererVideoConfig): void {
  //   AgoraRendererManager.setRenderOptionByConfig(rendererConfig);
  // }

  // setRenderMode(mode = RENDER_MODE.WEBGL): void {
  //   AgoraRendererManager.setRenderMode(mode);
  // }

  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // getVideoDevices(): Array<{
  //   deviceId: string;
  //   deviceName: string;
  // }> {
  //   const videoDeviceManager = new IVideoDeviceManagerImpl();
  //   const res = videoDeviceManager.enumerateVideoDevices() as any;
  //   return res;
  // }
  // setVideoDevice(deviceId: string): number {
  //   const videoDeviceManager = new IVideoDeviceManagerImpl();
  //   const res = videoDeviceManager.setDevice(deviceId);
  //   return res;
  // }
  // getAudioPlaybackDevices(): {
  //   deviceName: string;
  //   deviceId: string;
  // }[] {
  //   const audioDeviceManager = new IAudioDeviceManagerImpl();
  //   const res = audioDeviceManager.enumeratePlaybackDevices() as any;
  //   return res;
  // }
  // setAudioPlaybackDevice(deviceId: string): number {
  //   const audioDeviceManager = new IAudioDeviceManagerImpl();
  //   const res = audioDeviceManager.setPlaybackDevice(deviceId);
  //   return res;
  // }
  // getAudioRecordingDevices(): {
  //   deviceName: string;
  //   deviceId: string;
  // }[] {
  //   const audioDeviceManager = new IAudioDeviceManagerImpl();
  //   const res = audioDeviceManager.enumerateRecordingDevices() as any;
  //   return res;
  // }

  // setAudioRecordingDevice(deviceId: string): number {
  //   const audioDeviceManager = new IAudioDeviceManagerImpl();
  //   const res = audioDeviceManager.setRecordingDevice(deviceId);
  //   return res;
  // }

  // _setupLocalVideo(view: Element): number {
  //   deprecate("_setupLocalVideo", "setupVideo or setupLocalVideo");
  //   this.setupLocalVideo({
  //     videoSourceType: VideoSourceType.VideoSourceCamera,
  //   });
  //   return 0;
  // }

  // _setupViewContentMode(
  //   uid: number | "local" | "videosource",
  //   mode: 0 | 1,
  //   channelId: string
  // ): number {
  //   deprecate(
  //     "_setupViewContentMode",
  //     "setRenderOptionByConfig or setRenderOption"
  //   );

  //   const contentMode =
  //     mode === 1
  //       ? RenderModeType.RenderModeFit
  //       : RenderModeType.RenderModeHidden;
  //   const mirror = false;
  //   switch (uid) {
  //     case "local":
  //       this.setRenderOptionByConfig({
  //         videoSourceType: VideoSourceType.VideoSourceCamera,
  //         rendererOptions: {
  //           contentMode,
  //           mirror,
  //         },
  //       });
  //       break;
  //     case "videosource":
  //       this.setRenderOptionByConfig({
  //         videoSourceType: VideoSourceType.VideoSourceScreen,
  //         rendererOptions: {
  //           contentMode,
  //           mirror,
  //         },
  //       });
  //       break;
  //     default:
  //       this.setRenderOptionByConfig({
  //         videoSourceType: VideoSourceType.VideoSourceRemote,
  //         channelId,
  //         rendererOptions: {
  //           contentMode,
  //           mirror,
  //         },
  //       });
  //       break;
  //   }
  //   return 0;
  // }
  // _destroyRenderView(
  //   key: "local" | "videosource" | number,
  //   channelId: string | undefined,
  //   view: Element,
  //   onFailure?: (err: Error) => void
  // ) {
  //   deprecate(
  //     "_destroyRenderView",
  //     "destroyRendererByView or destroyRendererByConfig"
  //   );
  //   switch (key) {
  //     case "local":
  //       break;
  //     case "videosource":
  //       break;

  //     default:
  //       break;
  //   }
  // }
  // _subscribe(
  //   uid: number,
  //   view: Element,
  //   options?: {
  //     append: boolean;
  //   }
  // ) {
  //   deprecate("_subscribe", "setupVideo or setupRemoteVideo");
  // }
  // _setupLocalVideoSource(view: HTMLElement) {
  //   deprecate("_setupLocalVideoSource", "setupVideo or setupLocalVideo");
  //   this.setupVideo({
  //     videoSourceType: VideoSourceType.VideoSourceScreen,
  //     view,
  //   });
  // }
  // _setupRemoteVideo(
  //   uid: number,
  //   view?: HTMLElement,
  //   channelId?: string,
  //   options?: {
  //     append: boolean;
  //   }
  // ) {
  //   deprecate("_setupRemoteVideo", "setupVideo or setupRemoteVideo");
  //   this.setupVideo({
  //     videoSourceType: VideoSourceType.VideoSourceRemote,
  //     view,
  //     channelId,
  //   });
  // }
}
