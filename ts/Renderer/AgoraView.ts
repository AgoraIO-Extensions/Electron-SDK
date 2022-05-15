import { AgoraRtcEngine } from "../Api/AgoraRtcEngine";
import {
  agoraEventEmitter,
  EVENT_ENGINE_INITIALIZE,
  EVENT_ENGINE_RELEASE,
  logWarn,
} from "../Utils";
import { CONTENT_MODE, VideoSourceType } from "./type";

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
  interface AgoraView {
    "video-source-type": VideoSourceType;
    uid: number;
    "channel-id": string;
    "renderer-content-mode": CONTENT_MODE;
    "renderer-mirror": boolean;
    style: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      "agora-view": AgoraView | HTMLElement;
    }
  }
}

export default class AgoraView extends HTMLElement {
  static rtcEngine?: AgoraRtcEngine;
  static errorForEngineInitialize = new Error(
    "must initialize a AgoraRtcEngine"
  );
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

  get renderContentMode(): CONTENT_MODE {
    const number = Number(
      this.getAttribute(RENDERER_CONTENT_MODE_STRING) || CONTENT_MODE.FIT
    );
    return isNaN(number) ? CONTENT_MODE.FIT : number;
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

    agoraEventEmitter.on(EVENT_ENGINE_INITIALIZE, this.initializeRender);
    agoraEventEmitter.on(EVENT_ENGINE_RELEASE, this.removeRender);
  }
  initializeRender = (rtcEngine?: AgoraRtcEngine) => {
    if (!!AgoraView.rtcEngine && !!rtcEngine) {
      AgoraView.rtcEngine = rtcEngine;
    } else if (!!AgoraView.rtcEngine && !rtcEngine) {
      rtcEngine = AgoraView.rtcEngine;
    } else if (!AgoraView.rtcEngine && !!rtcEngine) {
      AgoraView.rtcEngine = rtcEngine;
    } else if (!AgoraView.rtcEngine && !rtcEngine) {
    }

    if (!rtcEngine) {
      throw AgoraView.errorForEngineInitialize;
    }
    rtcEngine.destroyRendererByView(this);
    rtcEngine.setView({
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
  removeRender = () => {
    const rtcEngine = AgoraView.rtcEngine;
    if (!rtcEngine) {
      logWarn(
        "It is recommended to remove the dom node before the engine is released"
      );
      return;
    }
    rtcEngine.destroyRendererByView(this);
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
    const rtcEngine = AgoraView.rtcEngine;
    if (!rtcEngine) {
      throw AgoraView.errorForEngineInitialize;
    }
    if (isSetRenderOption) {
      rtcEngine.setRenderOption(
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
    agoraEventEmitter.removeListener(
      EVENT_ENGINE_INITIALIZE,
      this.initializeRender
    );
    agoraEventEmitter.removeListener(
      EVENT_ENGINE_RELEASE,
      this.disconnectedCallback
    );
    this.removeRender();
  }
}

window.customElements.define("agora-view", AgoraView);
