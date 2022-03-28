/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:52:22
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-27 12:33:55
 */
import { AgoraRtcEngine } from "./Api/AgoraRtcEngine";
import "./Api/AgoraRtcEngineEvent";
import "./Renderer/AgoraView";
export * from "./Api/types";
export * from "./Api/plugin";
export * from "./Renderer/type";
export * from "./Common/JSEvents";
export { ApiTypeEngine } from "./Api/internal/native_type";

export default AgoraRtcEngine;
