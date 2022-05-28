import {
  CanvasOptions,
  CONTENT_MODE,
  VideoFrame,
  AgoraElectronBridge,
  Result,
} from "../../AgoraSdk";

import { VideoSourceType } from "../AgoraBase";
import { IRtcEngineEventHandler } from "../IAgoraRtcEngine";
import { processIRtcEngineEventHandlerEx } from "../impl/IAgoraRtcEngineExImpl";
import { processIRtcEngineEventHandler } from "../impl/IAgoraRtcEngineImpl";

const agora = require("../../../build/Release/agora_node_ext");
//名字可以全平台对齐 electron rn
let agoraElectronBridge: AgoraElectronBridge;

export const getBridge = (): AgoraElectronBridge => {
  if (!agoraElectronBridge) {
    agoraElectronBridge = new agora.NodeIrisRtcEngine();
    agoraElectronBridge.sendMsg = sendMsg;
    // @ts-ignore
    (window || global).AgoraElectronBridge = agoraElectronBridge;
  }
  return agoraElectronBridge;
};

export const sendMsg = (
  funcName: string,
  params: any,
  buffer?: ArrayBufferLike,
  bufferCount = 0
): Result => {
  const ret = getBridge().CallApi(
    funcName,
    JSON.stringify(params),
    buffer,
    bufferCount
  );
  console.log("callApi", funcName, JSON.stringify(params), ret);
  try {
    return JSON.parse(ret.result);
  } catch (error) {
    console.error("returnValue parse happen error: ", error);
    return ret;
  }
};
const handlerEvent = function (
  event: string,
  data: string,
  buffer: ArrayBufferLike,
  bufferLength: number,
  bufferCount: number
) {
  return;
  // console.log(
  //   "event",
  //   event,
  //   "data",
  //   data,
  //   "buffer",
  //   buffer,
  //   "bufferLength",
  //   bufferLength,
  //   "bufferCount",
  //   bufferCount
  // );
  try {
    const obj = JSON.parse(data);
    // // const buffer = args.buffer;
    // // if (methodName === 'onStreamMessage') {
    // //   data.splice(3, 0, buffer);
    // // }
    // IrisApiEngine._handlers.forEach((value) => {
    //   processIRtcEngineEventHandlerEx(value, event, obj);
    //   processIRtcEngineEventHandler(value, event, obj);
    // });
  } catch (error) {
    console.log(error);
  }
};

export default class IrisApiEngine {
  static _handlers: IRtcEngineEventHandler[] = [];

  static callApi<T>(
    funcName: string,
    params: any,
    buffer?: ArrayBufferLike
  ): any {
    const bridge = getBridge();
    switch (funcName) {
      case "RtcEngine_initialize":
        bridge.InitializeEnv();
        bridge.OnEvent("call_back_with_buffer", handlerEvent);
        return sendMsg(funcName, params, buffer);
      case "RtcEngine_release":
        sendMsg(funcName, params, buffer);
        bridge.ReleaseEnv();
        return true;
      case "RtcEngine_registerEventHandler":
        this._handlers.push(params.eventHandler);
        // @ts-ignore
        return true;
      case "RtcEngine_unregisterEventHandler":
        this._handlers = this._handlers.filter(
          (value) => value !== params.eventHandler
        );
        // @ts-ignore
        return true;
    }
    return sendMsg(funcName, params, buffer);
  }
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  // @ts-ignore
  return (key, value) => {
    console.log(key, value);
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
