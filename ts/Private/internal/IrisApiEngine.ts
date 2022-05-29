import { AgoraEnv, logInfo, parseJSON } from "../../Utils";
import { AgoraElectronBridge, CallBackModule, Result } from "../../Types";
import { IRtcEngineEventHandler } from "../IAgoraRtcEngine";
import { processIRtcEngineEventHandlerEx } from "../impl/IAgoraRtcEngineExImpl";
import { processIRtcEngineEventHandler } from "../impl/IAgoraRtcEngineImpl";

const agora = require("../../../build/Release/agora_node_ext");
//名字可以全平台对齐 electron rn
let _handlers: IRtcEngineEventHandler[] = [];

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
  logInfo(
    "event",
    event,
    "data",
    data,
    "buffer",
    buffer,
    "bufferLength",
    bufferLength,
    "bufferCount",
    bufferCount
  );
  try {
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
  logInfo("handlerMPKEvent", data);
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

  const result = parseJSON(ret.result);
  return result;
};

const ResultOk = {
  result: 0,
};
export const callIrisApi = (
  funcName: string,
  params: any,
  buffer?: ArrayBufferLike
): any => {
  switch (funcName) {
    case "RtcEngine_registerEventHandler":
      _handlers.push(params.eventHandler);
      return ResultOk;
    case "RtcEngine_unregisterEventHandler":
      _handlers = _handlers.filter((value) => value !== params.eventHandler);
      return ResultOk;
  }
  return sendMsg(funcName, params, buffer);
};
