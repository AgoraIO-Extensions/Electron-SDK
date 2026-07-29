class SharedTexturePocController {
  constructor({ BrowserWindow, createRtcEngine, scenePath, logger = console }) {
    this.BrowserWindow = BrowserWindow;
    this.createRtcEngine = createRtcEngine;
    this.scenePath = scenePath;
    this.logger = logger;
    this.state = 'idle';
    this.nextFrameId = 1;
    this.releasedTextures = new WeakSet();
    this.inFlight = null;
    this.pendingTexture = null;
    this.window = null;
    this.engine = null;
    this.mediaEngine = null;
  }

  async start({ appId, channelId, token, uid }) {
    if (this.state !== 'idle') throw new Error('Shared Texture PoC is busy');
    this.state = 'starting';

    try {
      this.engine = this.createRtcEngine();
      const joined = new Promise((resolve, reject) => {
        this.engine.registerEventHandler({
          onJoinChannelSuccess: resolve,
          onError: (errorCode, message) =>
            reject(new Error(`RTC error ${errorCode}: ${message || ''}`)),
        });
      });

      this.requireSuccess(this.engine.initialize({ appId }), 'initialize');
      this.requireSuccess(this.engine.enableVideo(), 'enableVideo');
      this.mediaEngine = this.engine.getMediaEngine();
      this.requireSuccess(
        this.mediaEngine.setExternalVideoSource(true, true, 0),
        'setExternalVideoSource'
      );

      this.window = new this.BrowserWindow({
        show: false,
        webPreferences: {
          offscreen: { useSharedTexture: true },
          backgroundThrottling: false,
        },
      });
      this.window.webContents.on('paint', (_event, _dirty, _image, texture) => {
        if (texture) this.handlePaint(texture);
      });
      void this.window.loadFile(this.scenePath);

      this.requireSuccess(
        this.engine.joinChannel(token, channelId, uid, {
          publishCameraTrack: true,
          publishCustomVideoTrack: false,
        }),
        'joinChannel'
      );
      await joined;
      this.state = 'running';
    } catch (error) {
      await this.cleanup();
      this.state = 'idle';
      throw error;
    }
  }

  requireSuccess(result, operation) {
    if (typeof result === 'number' && result < 0) {
      throw new Error(`${operation} failed with result ${result}`);
    }
  }

  handlePaint(texture) {
    if (this.state !== 'running') {
      this.releaseOnce(texture);
      return;
    }
    if (!this.toFrame(texture, this.nextFrameId)) {
      this.releaseOnce(texture);
      return;
    }
    if (this.inFlight) {
      if (this.pendingTexture) this.releaseOnce(this.pendingTexture);
      this.pendingTexture = texture;
      return;
    }
    this.submit(texture);
  }

  toFrame(texture, frameId) {
    const info = texture && texture.textureInfo;
    const size = info && (info.codedSize || info.size);
    const format = info && this.normalizePixelFormat(info.pixelFormat);
    if (
      !info ||
      !Buffer.isBuffer(info.ntHandle) ||
      !size ||
      !Number.isInteger(size.width) ||
      !Number.isInteger(size.height) ||
      !Number.isInteger(info.timestamp) ||
      !format
    ) {
      return null;
    }
    return {
      frameId,
      ntHandle: info.ntHandle,
      width: size.width,
      height: size.height,
      timestampUs: info.timestamp,
      pixelFormat: format,
    };
  }

  normalizePixelFormat(format) {
    const value = typeof format === 'string' ? format.toLowerCase() : '';
    if (value === 'bgra' || value === 'argb') return 'bgra';
    if (value === 'rgba' || value === 'abgr') return 'rgba';
    return null;
  }

  submit(texture) {
    const frame = this.toFrame(texture, this.nextFrameId++);
    if (!frame) {
      this.releaseOnce(texture);
      return;
    }
    const operation = Promise.resolve(
      this.mediaEngine.pushSharedD3D11Texture(frame)
    )
      .catch((error) => this.logger.error('Shared texture submission failed', error))
      .finally(() => this.releaseOnce(texture));
    this.inFlight = operation.finally(() => {
      this.inFlight = null;
      if (this.state === 'running' && this.pendingTexture) {
        const pending = this.pendingTexture;
        this.pendingTexture = null;
        this.submit(pending);
      }
    });
  }

  releaseOnce(texture) {
    if (!texture || this.releasedTextures.has(texture)) return;
    this.releasedTextures.add(texture);
    texture.release();
  }

  async stop() {
    if (this.state === 'idle') return;
    if (this.state === 'stopping') return this.stopping;
    this.state = 'stopping';
    this.stopping = (async () => {
      if (this.pendingTexture) {
        this.releaseOnce(this.pendingTexture);
        this.pendingTexture = null;
      }
      if (this.inFlight) await this.inFlight;
      await this.cleanup();
      this.state = 'idle';
    })();
    return this.stopping;
  }

  async cleanup() {
    if (this.engine) {
      try {
        this.engine.leaveChannel();
        if (this.mediaEngine) {
          this.mediaEngine.setExternalVideoSource(false, true, 0);
        }
      } finally {
        this.engine.release();
      }
    }
    if (this.window) this.window.destroy();
    this.engine = null;
    this.mediaEngine = null;
    this.window = null;
  }
}

module.exports = { SharedTexturePocController };
