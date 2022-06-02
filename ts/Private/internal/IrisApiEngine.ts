import { AgoraElectronBridge, CallBackModule, Result } from "../../Types";
import { AgoraEnv, logDebug, logError, logWarn, parseJSON } from "../../Utils";
import {
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
} from "../AgoraBase";
import { IMediaPlayer } from "../IAgoraMediaPlayer";
import { IDirectCdnStreamingEventHandler } from "../IAgoraRtcEngine";
import { RtcConnection } from "../IAgoraRtcEngineEx";
import { processIRtcEngineEventHandlerEx } from "../impl/IAgoraRtcEngineExImpl";
import {
  processIDirectCdnStreamingEventHandler,
  processIRtcEngineEventHandler,
} from "../impl/IAgoraRtcEngineImpl";
import { handlerMPKEvent, MediaPlayerInternal } from "./MediaPlayerInternal";
const agora = require("../../../build/Release/agora_node_ext");

export const getBridge = (): AgoraElectronBridge => {
  let bridge = AgoraEnv.AgoraElectronBridge;
  if (!bridge) {
    bridge = new agora.AgoraElectronBridge();
    bridge!.sendMsg = sendMsg;
    AgoraEnv.AgoraElectronBridge = bridge;
  }
  return bridge!;
};

export const handlerRTCEvent = function (
  event: string,
  data: string,
  buffer: Uint8Array[],
  bufferLength: number,
  bufferCount: number
) {
  const obj = parseJSON(data);
  logDebug(
    "event",
    event,
    "data",
    obj,
    "buffer",
    buffer,
    "bufferLength",
    bufferLength,
    "bufferCount",
    bufferCount
  );

  const isEx = event.endsWith("Ex");
  AgoraEnv.engineEventHandlers.forEach((value) => {
    if (!value) {
      return;
    }
    if (isEx) {
      try {
        processIRtcEngineEventHandlerEx(value, event, obj);
      } catch (error) {
        logError("engineEventHandlers::processIRtcEngineEventHandlerEx", error);
      }
      return;
    }
    try {
      processIDirectCdnStreamingEventHandler(
        value as IDirectCdnStreamingEventHandler,
        event,
        obj
      );
    } catch (error) {
      logError(
        "engineEventHandlers::processIDirectCdnStreamingEventHandler",
        error
      );
    }
    try {
      processIRtcEngineEventHandler(value, event, obj);
    } catch (error) {
      logError("engineEventHandlers::processIRtcEngineEventHandler", error);
    }
  });
};

export const sendMsg = (
  funcName: string,
  params: any,
  buffer?: ArrayBufferLike,
  bufferCount = 0
): Result => {
  const irisReturnValue = getBridge().CallApi(
    funcName,
    JSON.stringify(params),
    buffer,
    bufferCount
  );
  logDebug(
    "sendMsg",
    "funcName",
    funcName,
    "params",
    params,
    "irisReturnValue",
    irisReturnValue
  );
  const result = parseJSON(irisReturnValue.callApiResult);
  return result;
};

const ResultOk = {
  result: 0,
};
const ResultFail = {
  result: 0,
};
export function callIrisApi(
  funcName: string,
  params: any,
  buffer?: ArrayBufferLike
): any {
  if (funcName.startsWith("MediaPlayer_")) {
    //@ts-ignore
    params.mediaPlayerId = (this as IMediaPlayer).getMediaPlayerId();
    const json = params.toJSON?.call();
    params.toJSON = function () {
      return { ...json, playerId: params.mediaPlayerId };
    };
  } else {
    switch (funcName) {
      case "RtcEngine_initialize":
        {
          if (AgoraEnv.isInitializeEngine) {
            logWarn("initialize: already initialize rtcEngine");
            return ResultFail;
          }
          AgoraEnv.isInitializeEngine = true;
          const bridge = getBridge();
          bridge.InitializeEnv();
          bridge.OnEvent(
            CallBackModule.RTC,
            "call_back_with_buffer",
            handlerRTCEvent
          );
          bridge.OnEvent(
            CallBackModule.MPK,
            "call_back_with_buffer",
            handlerMPKEvent
          );
          AgoraEnv.AgoraRendererManager?.enableRender();
        }
        break;
      case "RtcEngineParameter_release":
        {
          if (!AgoraEnv.isInitializeEngine) {
            logWarn("release: rtcEngine have not initialize");
            return;
          }
          AgoraEnv.AgoraRendererManager?.enableRender(false);
          AgoraEnv.isInitializeEngine = false;
          sendMsg(funcName, params, buffer);
          getBridge().ReleaseEnv();
        }
        break;
      case "RtcEngine_createMediaPlayer":
        {
          if (!AgoraEnv.isInitializeEngine) {
            logError("createMediaPlayer: rtcEngine have not initialize");
          }
          // @ts-ignore
          const msgResult = sendMsg(funcName, params, buffer);
          const mediaPlayerId =
            msgResult &&
            msgResult.callApiResult &&
            msgResult.callApiResult.result;
          return { result: new MediaPlayerInternal(mediaPlayerId) };
        }
        break;
      case "RtcEngine_registerEventHandler":
        AgoraEnv.engineEventHandlers.push(params.eventHandler);
        return ResultOk;
      case "RtcEngine_unregisterEventHandler":
        AgoraEnv.engineEventHandlers = AgoraEnv.engineEventHandlers.filter(
          (value) => value !== params.eventHandler
        );
        return ResultOk;
      case "RtcEngine_sendStreamMessage":
      case "RtcEngine_sendStreamMessageEx":
        // data
        break;
      case "MediaEngine_pullAudioFrame":
      case "MediaEngine_pushAudioFrame":
        // frame.buffer
        break;
      case "MediaEngine_pushEncodedVideoImage":
      case "MediaEngine_pushEncodedVideoImage2":
        // imageBuffer
        break;
      case "MediaEngine_pushVideoFrame":
      case "MediaEngine_pushVideoFrame2":
      // frame.buffer
      // frame.eglContext
      // frame.metadata_buffer
      case "RtcEngine_setupLocalVideo":
        {
          const { sourceType, uid, view, renderMode, mirrorMode } =
            params.canvas as VideoCanvas;
          AgoraEnv.AgoraRendererManager?.setupLocalVideo({
            videoSourceType: sourceType,
            channelId: "",
            uid,
            view,
            rendererOptions: {
              contentMode: renderMode,
              mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
            },
          });
        }
        break;
      case "RtcEngine_setupRemoteVideo":
        {
          const { sourceType, uid, view, renderMode, mirrorMode } =
            params.canvas as VideoCanvas;
          AgoraEnv.AgoraRendererManager?.setupRemoteVideo({
            videoSourceType: sourceType,
            channelId: "",
            uid,
            view,
            rendererOptions: {
              contentMode: renderMode,
              mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
            },
          });
        }
        break;
      case "RtcEngineEx_setupRemoteVideoEx":
        {
          const { sourceType, uid, view, renderMode, mirrorMode } =
            params.canvas as VideoCanvas;
          const { channelId } = params.connection as RtcConnection;
          AgoraEnv.AgoraRendererManager?.setupRemoteVideo({
            videoSourceType: sourceType,
            channelId,
            uid,
            view,
            rendererOptions: {
              contentMode: renderMode,
              mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
            },
          });
        }
        break;
    }
  }

  return sendMsg(funcName, params, buffer);
}
