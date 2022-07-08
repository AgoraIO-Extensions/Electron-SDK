import { VideoSourceType } from "../Private/AgoraBase";
import { RenderModeType } from "../Private/AgoraMediaBase";
import AgoraRendererManager from "./RendererManager";

const VIDEO_SOURCE_TYPE_STRING = "video-source-type";
const UID_STRING = "uid";
const CHANNEL_ID_STRING = "channel-id";
const RENDERER_CONTENT_MODE_STRING = "renderer-content-mode";
const RENDERER_MIRROR_STRING = "renderer-mirror";

const observedAttributes = [
  VIDEO_SOURCE_TYPE_STRING,
  UID_STRING,
  CHANNEL_ID_STRING,
  RENDERER_CONTENT_MODE_STRING,
  RENDERER_MIRROR_STRING,
];

declare global {
  /*
   * Attributes of the Agora custom element.
   */
  interface AgoraView {
    /*
     * @ignore
     */
    "video-source-type": VideoSourceType;
    /*
     * The ID of the remote user.
     */
    uid: number;
    /*
     * @ignore
     */
    "channel-id": string;
    /*
     * @ignore
     */
    "renderer-content-mode": RenderModeType;
    /*
     * @ignore
     */
    "renderer-mirror": boolean;
    /*
     * The inline style of elements. See style 属性 .
     */
    style: any;
  }
  namespace JSX {
    /*
     * The custom HTML elements defined by Agora.
     */
    interface IntrinsicElements {
      "agora-view": AgoraView | HTMLElement;
    }
  }
}

export default class AgoraView extends HTMLElement {
  isConnectedCallback = false;
  static get observedAttributes() {
    return observedAttributes;
  }

  get videoSourceType(): VideoSourceType {
    const number = Number(this.getAttribute(VIDEO_SOURCE_TYPE_STRING));
    return isNaN(number) ? 0 : number;
  }

  set videoSourceType(val) {
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
    return this.getAttribute(CHANNEL_ID_STRING) || "";
  }

  set channelId(val) {
    if (val) {
      this.setAttribute(CHANNEL_ID_STRING, val);
    } else {
      this.removeAttribute(CHANNEL_ID_STRING);
    }
  }

  get renderContentMode(): RenderModeType {
    const number = Number(
      this.getAttribute(RENDERER_CONTENT_MODE_STRING) ||
        RenderModeType.RenderModeFit
    );
    return isNaN(number) ? RenderModeType.RenderModeFit : number;
  }

  set renderContentMode(val) {
    if (val) {
      this.setAttribute(RENDERER_CONTENT_MODE_STRING, String(val));
    } else {
      this.removeAttribute(RENDERER_CONTENT_MODE_STRING);
    }
  }
  get renderMirror(): boolean {
    return this.getAttribute(RENDERER_MIRROR_STRING) === "true";
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
    AgoraRendererManager.destroyRendererByView(this);
    AgoraRendererManager.setupVideo({
      videoSourceType: this.videoSourceType,
      view: this,
      uid: this.uid,
      channelId: this.channelId,
      rendererOptions: {
        mirror: this.renderMirror,
        contentMode: this.renderContentMode,
      },
    });
  };
  destroyRender = () => {
    AgoraRendererManager.destroyRendererByView(this);
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
      AgoraRendererManager.setRenderOption(
        this,
        this.renderContentMode,
        this.renderMirror
      );
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

window.customElements.define("agora-view", AgoraView);
