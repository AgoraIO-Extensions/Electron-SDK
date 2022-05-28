import {
  CanvasOptions,
  CONTENT_MODE,
  VideoFrame,
  AgoraElectronBridge,
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
) => {
  const ret = getBridge().CallApi(
    funcName,
    JSON.stringify(params),
    buffer,
    bufferCount
  );
  console.log("callApi", funcName, JSON.stringify(params), ret);
  const { retCode, result } = ret;

  if (retCode !== 0) {
    return retCode;
  }
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error("returnValue parse", error);
    return -1;
  }
};
// AgoraElectronNative.addListener('onEvent', function (args: any) {
//   console.log('onEvent', args);
//   const methodName = args.methodName;
//   const data = JSON.parse(args.data);
//   // const buffer = args.buffer;
//   // if (methodName === 'onStreamMessage') {
//   //   data.splice(3, 0, buffer);
//   // }
//   IrisApiEngine._handlers.forEach((value) => {
//     processIRtcEngineEventHandlerEx(value, methodName, data);
//     processIRtcEngineEventHandler(value, methodName, data);
//   });
// });

export default class IrisApiEngine {
  static _handlers: IRtcEngineEventHandler[] = [];

  static callApi<T>(
    funcName: string,
    params: any,
    buffer?: ArrayBufferLike
  ): any {
    switch (funcName) {
      case "RtcEngine_initialize":
        getBridge().InitializeEnv();
        return sendMsg(funcName, params, buffer);
      case "RtcEngine_release":
        sendMsg(funcName, params, buffer);
        getBridge().ReleaseEnv();
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
