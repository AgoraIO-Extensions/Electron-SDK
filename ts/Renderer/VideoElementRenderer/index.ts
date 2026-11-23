import { RenderModeType, VideoFrame } from '../../Private/AgoraMediaBase';
import { RendererContext, RendererType } from '../../Types';
import { logDebug, logInfo } from '../../Utils';
import { IRenderer } from '../IRenderer';

import { toVideoColorSpaceInit } from './colorSpace';

/**
 * Frames that have been handed to the writer but not yet accepted. More than this and the new
 * frame is dropped, so a stalled page cannot grow an unbounded queue (and latency).
 */
const MAX_IN_FLIGHT = 2;

/**
 * Renders into a <video> element through MediaStreamTrackGenerator.
 *
 * Unlike the canvas renderers, Chromium treats the <video> as video content: YUV->RGB, scaling
 * and color management run in its video pipeline and, when the conditions allow, in a
 * DirectComposition video overlay (GPU scaler). This is the same display path as the Web SDK.
 *
 * Input: SDK-decoded I420 frames (VideoFrame from the frame cache), copied once into a WebCodecs
 * VideoFrame. Its colorSpace is the frame's ColorSpace as reported by the native SDK; how it is
 * shown is up to Chromium.
 * @ignore
 */
export class VideoElementRenderer extends IRenderer {
  video?: HTMLVideoElement;
  private generator?: any;
  private writer?: any;
  private inFlight = 0;
  private timestampUs = 0;
  private scratch?: Uint8Array;
  private lastRotation = 0;
  private lastSize = '';
  private resizeObserver?: ResizeObserver;
  private stats = { written: 0, dropped: 0, errors: 0 };

  constructor() {
    super();
    this.rendererType = RendererType.VIDEOELEMENT;
  }

  static isSupported(): boolean {
    return (
      typeof (globalThis as any).MediaStreamTrackGenerator === 'function' &&
      typeof (globalThis as any).VideoFrame === 'function'
    );
  }

  public override bind(context: RendererContext) {
    this.parentElement = context.view;
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    });
    this.parentElement?.appendChild(this.container);

    const MSTG = (globalThis as any).MediaStreamTrackGenerator;
    this.generator = new MSTG({ kind: 'video' });
    this.writer = this.generator.writable.getWriter();
    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    (video as any).disablePictureInPicture = true;
    video.srcObject = new MediaStream([this.generator]);
    Object.assign(video.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      display: 'none',
      background: 'transparent',
    });
    this.container.appendChild(video);
    this.video = video;
    video.play().catch(() => {});
    this.resizeObserver = new ResizeObserver(() => this.applyLayout());
    this.resizeObserver.observe(this.container);
    this.applyLayout();
  }

  public override unbind() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    try {
      this.writer?.close();
    } catch (e) {}
    try {
      this.generator?.stop();
    } catch (e) {}
    if (this.video) {
      this.video.srcObject = null;
      this.video.parentNode?.removeChild(this.video);
    }
    if (this.container && this.parentElement === this.container.parentNode) {
      this.parentElement?.removeChild(this.container);
    }
    logInfo('VideoElementRenderer unbind', this.stats);
    this.video = undefined;
    this.writer = undefined;
    this.generator = undefined;
    this.scratch = undefined;
    this.container = undefined;
    this.parentElement = undefined;
  }

  public override setContext(context: RendererContext) {
    super.setContext(context);
    this.applyLayout();
  }

  public override drawFrame(_uid: number, frame?: VideoFrame): void {
    if (!frame) return;
    if (!this.writer || this.inFlight >= MAX_IN_FLIGHT) {
      this.stats.dropped++;
      return;
    }
    let out: any;
    const rotation = frame.rotation ?? 0;
    try {
      out = this.wrapI420(frame);
    } catch (e) {
      this.stats.errors++;
      logDebug('VideoElementRenderer drawFrame failed', e);
      return;
    }
    if (!out) return;
    this.inFlight++;
    this.writer.write(out).then(
      () => {
        this.inFlight--;
        this.stats.written++;
      },
      (e: any) => {
        this.inFlight--;
        this.stats.errors++;
        logDebug('VideoElementRenderer write failed', e);
      }
    );
    const size = `${out.displayWidth}x${out.displayHeight}`;
    if (rotation !== this.lastRotation || size !== this.lastSize) {
      this.lastRotation = rotation;
      this.lastSize = size;
      this.applyLayout();
    }
    if (this.video && this.video.style.display !== '') {
      this.video.style.display = '';
    }
    this.getFps();
  }

  /** Pack the three planes into one buffer and wrap them; VideoFrame copies the data. */
  private wrapI420(f: VideoFrame): any {
    const {
      width,
      height,
      yStride,
      uStride,
      vStride,
      yBuffer,
      uBuffer,
      vBuffer,
    } = f;
    if (!width || !height || !yStride || !uStride || !vStride) return undefined;
    if (!yBuffer || !uBuffer || !vBuffer) return undefined;
    const chromaHeight = (height + 1) >> 1;
    const ySize = yStride * height;
    const uSize = uStride * chromaHeight;
    const vSize = vStride * chromaHeight;
    const total = ySize + uSize + vSize;
    if (!this.scratch || this.scratch.byteLength !== total) {
      this.scratch = new Uint8Array(total);
    }
    this.scratch.set((yBuffer as Uint8Array).subarray(0, ySize), 0);
    this.scratch.set((uBuffer as Uint8Array).subarray(0, uSize), ySize);
    this.scratch.set((vBuffer as Uint8Array).subarray(0, vSize), ySize + uSize);
    this.timestampUs += 16667;
    const WebCodecsVideoFrame = (globalThis as any).VideoFrame;
    return new WebCodecsVideoFrame(this.scratch, {
      format: 'I420',
      codedWidth: width,
      codedHeight: height,
      timestamp: this.timestampUs,
      layout: [
        { offset: 0, stride: yStride },
        { offset: ySize, stride: uStride },
        { offset: ySize + uSize, stride: vStride },
      ],
      colorSpace: toVideoColorSpaceInit(f.colorSpace),
    });
  }

  /** Render mode -> object-fit; 90/270 rotation swaps the box and rotates it. */
  private applyLayout() {
    if (!this.video || !this.container) return;
    const fit =
      this.context.renderMode === RenderModeType.RenderModeHidden
        ? 'cover'
        : 'contain';
    const s = this.video.style;
    if (s.objectFit !== fit) s.objectFit = fit;
    const rotation = this.lastRotation;
    if (rotation === 90 || rotation === 270) {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      Object.assign(s, {
        width: `${h}px`,
        height: `${w}px`,
        left: `${(w - h) / 2}px`,
        top: `${(h - w) / 2}px`,
        transform: `rotate(${rotation}deg)`,
      });
    } else {
      Object.assign(s, {
        width: '100%',
        height: '100%',
        left: '0',
        top: '0',
        transform: rotation === 180 ? 'rotate(180deg)' : '',
      });
    }
  }
}
