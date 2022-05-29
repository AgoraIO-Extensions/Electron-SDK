import { AgoraElectronBridge, CallBackModule, Result } from "../../Types";
import { IRtcEngineEventHandler } from "../IAgoraRtcEngine";
import { processIRtcEngineEventHandlerEx } from "../impl/IAgoraRtcEngineExImpl";
import { processIRtcEngineEventHandler } from "../impl/IAgoraRtcEngineImpl";

const agora = require("../../../build/Release/agora_node_ext");
//名字可以全平台对齐 electron rn
let agoraElectronBridge: AgoraElectronBridge;

export const getBridge = (): AgoraElectronBridge => {
  if (!agoraElectronBridge) {
    agoraElectronBridge = new agora.AgoraElectronBridge();
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
export const handlerRTCEvent = function (
  event: string,
  data: string,
  buffer: Uint8Array[],
  bufferLength: number,
  bufferCount: number
) {
  console.log("handlerRTCEvent", data);
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

export const handlerMPKEvent = function (
  event: string,
  data: string,
  buffer: Uint8Array[],
  bufferLength: number,
  bufferCount: number
) {
  console.log("handlerMPKEvent", data);
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

let _handlers: IRtcEngineEventHandler[] = [];

export const callIrisApi = (
  funcName: string,
  params: any,
  buffer?: ArrayBufferLike
): any => {
  switch (funcName) {
    case "RtcEngine_initialize":
      return true;
    case "RtcEngine_release":
      return true;
    case "RtcEngine_registerEventHandler":
      _handlers.push(params.eventHandler);
      return true;
    case "RtcEngine_unregisterEventHandler":
      _handlers = _handlers.filter((value) => value !== params.eventHandler);
      return true;
  }
  return sendMsg(funcName, params, buffer);
};
// const getCircularReplacer = () => {
//   const seen = new WeakSet();
//   // @ts-ignore
//   return (key, value) => {
//     console.log(key, value);
//     if (typeof value === "object" && value !== null) {
//       if (seen.has(value)) {
//         return;
//       }
//       seen.add(value);
//     }
//     return value;
//   };
// };
