import { AgoraRtcEngine } from "./AgoraRtcEngine";
import "./Renderer/AgoraView";
import { IRtcEngineExImpl } from "./Private/impl/IAgoraRtcEngineExImpl";
import { IRtcEngineEx } from "./Private/IAgoraRtcEngineEx";

export * from "./Private/AgoraBase";
export * from "./Private/AgoraMediaBase";
export * from "./Private/IAgoraRtcEngine";
export * from "./Private/IAgoraRtcEngineEx";
export * from "./Private/impl/IAgoraRtcEngineImpl";
export * from "./Private/impl/IAudioDeviceManagerImpl";
export * from "./Renderer/RendererManager";
export * from "./Types";
export { AgoraEnv } from "./Utils";

declare module "./AgoraRtcEngine" {
  export interface AgoraRtcEngine extends IRtcEngineExImpl {}
  export interface AgoraRtcEngine extends IRtcEngineEx {}
}
export default AgoraRtcEngine;
