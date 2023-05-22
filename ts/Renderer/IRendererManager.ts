import { RenderModeType, VideoSourceType } from '../Private/AgoraMediaBase';
import { Channel, RendererVideoConfig } from '../Types';

/**
 * @ignore
 */
export abstract class IRendererManager {
  abstract get defaultRenderConfig(): RendererVideoConfig;

  abstract enableRender(enabled?: boolean): void;

  abstract clear(): void;

  abstract setupVideo(rendererVideoConfig: RendererVideoConfig): number;

  abstract setupLocalVideo(rendererConfig: RendererVideoConfig): number;

  abstract setupRemoteVideo(rendererConfig: RendererVideoConfig): number;

  abstract setRenderOptionByConfig(rendererConfig: RendererVideoConfig): number;

  abstract destroyRendererByView(view: Element): void;

  abstract destroyRenderersByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ): void;

  abstract setRenderOption(
    view: HTMLElement,
    contentMode?: RenderModeType,
    mirror?: boolean
  ): void;
}
