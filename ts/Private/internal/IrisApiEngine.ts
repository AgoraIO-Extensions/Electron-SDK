import { AgoraEnv, logDebug, logError, logInfo, parseJSON } from "../../Utils";
import { AgoraElectronBridge, CallBackModule, Result } from "../../Types";
import { IRtcEngineEventHandler } from "../IAgoraRtcEngine";
import { processIRtcEngineEventHandlerEx } from "../impl/IAgoraRtcEngineExImpl";
import { processIRtcEngineEventHandler } from "../impl/IAgoraRtcEngineImpl";

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
  AgoraEnv.engineEventHandlers.forEach((value) => {
    try {
      processIRtcEngineEventHandlerEx(value, event, obj);
    } catch (error) {
      logError("engineEventHandlers::processIRtcEngineEventHandlerEx", error);
    }
    try {
      processIRtcEngineEventHandler(value, event, obj);
    } catch (error) {
      logError("engineEventHandlers::processIRtcEngineEventHandler", error);
    }
  });
};

export const handlerMPKEvent = function (
  event: string,
  data: string,
  buffer: Uint8Array[],
  bufferLength: number,
  bufferCount: number
) {
  logDebug("handlerMPKEvent", data);
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
export const callIrisApi = (
  funcName: string,
  params: any,
  buffer?: ArrayBufferLike
): any => {
  switch (funcName) {
    case "RtcEngine_registerEventHandler":
      AgoraEnv.engineEventHandlers.push(params.eventHandler);
      return ResultOk;
    case "RtcEngine_unregisterEventHandler":
      AgoraEnv.engineEventHandlers = AgoraEnv.engineEventHandlers.filter(
        (value) => value !== params.eventHandler
      );
      return ResultOk;
  }
  return sendMsg(funcName, params, buffer);
};
