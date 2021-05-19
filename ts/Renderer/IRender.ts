/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-28 13:34:44
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-10 20:27:02
 */
import { EventEmitter } from "events";
import { VideoFrame } from "./type";

export interface IRenderer {
  _event?: EventEmitter;
  bind(element: Element): void;
  unbind(): void;
  equalsElement(element: Element): boolean;
  drawFrame(imageData: VideoFrame): void;
  setContentMode(mode: number, mirror: boolean): void;
  refreshCanvas(): void;
}
