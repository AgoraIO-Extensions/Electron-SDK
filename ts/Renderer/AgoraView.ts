import { VideoMirrorModeType, VideoViewSetupMode } from '../Private/AgoraBase';
import {
  RenderModeType,
  VideoModulePosition,
  VideoSourceType,
} from '../Private/AgoraMediaBase';
import { AgoraEnv } from '../Utils';

const VIDEO_SOURCE_TYPE_STRING = 'video-source-type';
const UID_STRING = 'uid';
const CHANNEL_ID_STRING = 'channel-id';
const POSITION_STRING = 'position';
const RENDERER_CONTENT_MODE_STRING = 'renderer-content-mode';
const RENDERER_MIRROR_STRING = 'renderer-mirror';

const observedAttributes = [
  VIDEO_SOURCE_TYPE_STRING,
  UID_STRING,
  CHANNEL_ID_STRING,
  POSITION_STRING,
  RENDERER_CONTENT_MODE_STRING,
  RENDERER_MIRROR_STRING,
];

declare global {
  /**
   * Attributes of the Agora custom element.
   * You can use this custom element as follows:<agora-view video-source-type="{VideoSourceType.VideoSourceCamera}" channel-id="" uid="{0}" position="{VideoModulePosition.PositionPreRenderer}"></agora-view>
   */
  interface AgoraView {
    /**
     * The type of the video source. See VideoSourceType .
     */
    'video-source-type': VideoSourceType;
    /**
     * The ID of the remote user.
     */
    'uid': number;
    /**
     * The channel name. This parameter signifies the channel in which users engage in real-time audio and video interaction. Under the premise of the same App ID, users who fill in the same channel ID enter the same channel for audio and video interaction. The string length must be less than 64 bytes. Supported characters:
     * All lowercase English letters: a to z.
     * All uppercase English letters: A to Z.
     * All numeric characters: 0 to 9.
     * Space
     * "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "= ", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
     */
    'channel-id': string;
    /**
     * The frame position of the video observer.
     */
    'position': VideoModulePosition;
    /**
     * The video display mode.
     */
    'renderer-content-mode': RenderModeType;
    /**
     * Whether to enable mirror mode when rendering video: true: Enable mirror mode.false: Do not enable mirror mode.
     */
    'renderer-mirror': boolean;
    /**
     * The inline style of elements. See style .
     */
    'style': any;
  }
  namespace JSX {
    /**
     * The custom HTML elements defined by Agora.
     */
    interface IntrinsicElements {
      /**
       * The name of the custom element, which supports rendering an AgoraView or HTMLElement object.
       */
      'agora-view': AgoraView | HTMLElement;
    }
  }
}

export default class AgoraView extends HTMLElement {
  isConnectedCallback = false;
  static get observedAttributes() {
    return observedAttributes;
  }

  get sourceType(): VideoSourceType {
    const number = Number(this.getAttribute(VIDEO_SOURCE_TYPE_STRING));
    return isNaN(number) ? 0 : number;
  }

  set sourceType(val) {
    if (val) {
      this.setAttribute(VIDEO_SOURCE_TYPE_STRING, String(val));
    } else {
      this.removeAttribute(VIDEO_SOURCE_TYPE_STRING);
    }
  }

  get uid(): number {
    const number = Number(this.getAttribute(UID_STRING));
    return isNaN(number) ? 0 : number;
  }

  set uid(val) {
    if (val) {
      this.setAttribute(UID_STRING, String(val));
    } else {
      this.removeAttribute(UID_STRING);
    }
  }

  get channelId(): string {
    return this.getAttribute(CHANNEL_ID_STRING) || '';
  }

  set channelId(val) {
    if (val) {
      this.setAttribute(CHANNEL_ID_STRING, val);
    } else {
      this.removeAttribute(CHANNEL_ID_STRING);
    }
  }

  get position(): VideoModulePosition {
    const number = Number(this.getAttribute(POSITION_STRING));
    return isNaN(number)
      ? VideoModulePosition.PositionPreEncoder |
          VideoModulePosition.PositionPreRenderer
      : number;
  }

  set position(val) {
    if (val) {
      this.setAttribute(POSITION_STRING, String(val));
    } else {
      this.removeAttribute(POSITION_STRING);
    }
  }

  get renderMode(): RenderModeType {
    const number = Number(
      this.getAttribute(RENDERER_CONTENT_MODE_STRING) ||
        RenderModeType.RenderModeFit
    );
    return isNaN(number) ? RenderModeType.RenderModeFit : number;
  }

  set renderMode(val) {
    if (val) {
      this.setAttribute(RENDERER_CONTENT_MODE_STRING, String(val));
    } else {
      this.removeAttribute(RENDERER_CONTENT_MODE_STRING);
    }
  }

  get renderMirror(): boolean {
    return this.getAttribute(RENDERER_MIRROR_STRING) === 'true';
  }

  set renderMirror(val) {
    if (val) {
      this.setAttribute(RENDERER_MIRROR_STRING, String(val));
    } else {
      this.removeAttribute(RENDERER_MIRROR_STRING);
    }
  }

  constructor() {
    super();
  }

  initializeRender = () => {
    const { channelId, uid, sourceType, position, renderMode, renderMirror } =
      this;
    AgoraEnv.AgoraRendererManager?.addOrRemoveRenderer({
      sourceType,
      view: this,
      uid,
      channelId,
      position,
      renderMode,
      mirrorMode: renderMirror
        ? VideoMirrorModeType.VideoMirrorModeEnabled
        : VideoMirrorModeType.VideoMirrorModeDisabled,
      setupMode: VideoViewSetupMode.VideoViewSetupReplace,
    });
  };

  destroyRender = () => {
    const { channelId, uid, sourceType, position } = this;
    AgoraEnv.AgoraRendererManager?.removeRendererFromCache({
      channelId,
      position,
      uid,
      sourceType,
      view: this,
    });
  };

  connectedCallback() {
    this.isConnectedCallback = true;
    this.initializeRender();
  }

  attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
    if (!this.isConnectedCallback) {
      return;
    }
    const isSetRenderOption = [
      RENDERER_CONTENT_MODE_STRING,
      RENDERER_MIRROR_STRING,
    ].includes(attrName);

    if (isSetRenderOption) {
      AgoraEnv.AgoraRendererManager?.setRendererContext({
        view: this,
        renderMode: this.renderMode,
        mirrorMode: this.renderMirror
          ? VideoMirrorModeType.VideoMirrorModeEnabled
          : VideoMirrorModeType.VideoMirrorModeDisabled,
      });
      return;
    }
    const isNeedReInitialize = observedAttributes.includes(attrName);
    if (!isNeedReInitialize) {
      return;
    }
    this.initializeRender();
  }

  disconnectedCallback() {
    this.isConnectedCallback = false;
    this.destroyRender();
  }
}

window.customElements.define('agora-view', AgoraView);
