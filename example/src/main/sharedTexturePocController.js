const {
  createTelemetry,
  parseWorkerDiagnostic,
} = require('./sharedTexturePocTelemetry');

const PAINT_TIMEOUT_MS = 500;
const DRAIN_TIMEOUT_MS = 2000;
const STATUS_INTERVAL_MS = 5000;

class SharedTexturePocController {
  constructor({
    BrowserWindow,
    createRtcEngine,
    scenePath,
    logger = console,
    onStatus = () => {},
    subscribeGpuProcessGone = () => () => {},
    monotonicMs = () => Number(process.hrtime.bigint()) / 1e6,
    nowMs = Date.now,
    hrtimeNs = process.hrtime.bigint,
    setIntervalFn = setInterval,
    clearIntervalFn = clearInterval,
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
  }) {
    this.BrowserWindow = BrowserWindow;
    this.createRtcEngine = createRtcEngine;
    this.scenePath = scenePath;
    this.logger = logger;
    this.onStatus = onStatus;
    this.subscribeGpuProcessGone = subscribeGpuProcessGone;
    this.monotonicMs = monotonicMs;
    this.nowMs = nowMs;
    this.hrtimeNs = hrtimeNs;
    this.setIntervalFn = setIntervalFn;
    this.clearIntervalFn = clearIntervalFn;
    this.setTimeoutFn = setTimeoutFn;
    this.clearTimeoutFn = clearTimeoutFn;
    this.state = 'idle';
    this.generation = 0;
    this.nextFrameId = 1;
    this.releasedTextures = new WeakSet();
    this.inFlight = null;
    this.pendingTexture = null;
    this.cancelPendingJoin = null;
    this.cleanupPromise = null;
    this.window = null;
    this.engine = null;
    this.mediaEngine = null;
    this.telemetry = createTelemetry({ nowMs, hrtimeNs });
    this.lastValidPaintMs = null;
    this.webglRestored = false;
    this.listenerDisposers = [];
    this.gpuDisposer = null;
    this.watchdogTimer = null;
    this.statusTimer = null;
  }

  async start({
    appId,
    channelId,
    token,
    uid,
    frameRate = 30,
    captureWindowState = 'hidden',
  }) {
    if (this.state !== 'idle' && this.state !== 'failed') {
      throw new Error('Shared Texture PoC is busy');
    }
    if (![30, 60].includes(frameRate)) throw new Error('Invalid frame rate');
    if (!['hidden', 'visible', 'minimized'].includes(captureWindowState)) {
      throw new Error('Invalid capture window state');
    }

    const generation = ++this.generation;
    this.state = 'starting';
    this.cleanupPromise = null;
    this.nextFrameId = 1;
    this.pendingTexture = null;
    this.inFlight = null;
    this.telemetry = createTelemetry({
      nowMs: this.nowMs,
      hrtimeNs: this.hrtimeNs,
    });
    this.lastValidPaintMs = this.monotonicMs();
    this.webglRestored = false;
    this.emitStatus();

    try {
      this.engine = this.createRtcEngine();
      let rejectJoin;
      const joined = new Promise((resolve, reject) => {
        rejectJoin = reject;
        this.engine.registerEventHandler({
          onJoinChannelSuccess: resolve,
          onError: (errorCode, message) =>
            reject(new Error(`RTC error ${errorCode}: ${message || ''}`)),
          onRtcStats: (_connection, stats) => {
            if (this.generation !== generation) return;
            this.telemetry.recordRtcStats(stats);
          },
          onLocalVideoStats: (_connection, stats) => {
            if (this.generation !== generation) return;
            this.telemetry.recordLocalVideoStats(stats);
          },
        });
      });
      const cancelJoin = () =>
        rejectJoin(new Error('Shared Texture PoC start cancelled'));
      this.cancelPendingJoin = cancelJoin;

      this.requireSuccess(this.engine.initialize({ appId }), 'initialize');
      this.requireSuccess(this.engine.enableVideo(), 'enableVideo');
      this.mediaEngine = this.engine.getMediaEngine();
      this.requireSuccess(
        this.mediaEngine.setExternalVideoSource(true, true, 0),
        'setExternalVideoSource'
      );

      this.window = new this.BrowserWindow({
        show: captureWindowState !== 'hidden',
        webPreferences: {
          offscreen: { useSharedTexture: true },
          backgroundThrottling: false,
        },
      });
      this.attachRunListeners(generation);
      this.window.webContents.setFrameRate(frameRate);
      if (this.window.webContents.getFrameRate() !== frameRate) {
        throw new Error(
          `Failed to configure compositor frame rate ${frameRate}`
        );
      }
      if (captureWindowState === 'minimized') this.window.minimize();
      const sceneLoaded = this.window.loadFile(this.scenePath, {
        query: { frameRate: String(frameRate) },
      });
      this.startTimers(generation);

      this.requireSuccess(
        this.engine.joinChannel(token, channelId, uid, {
          publishCameraTrack: false,
          publishMicrophoneTrack: false,
          publishCustomVideoTrack: true,
          customVideoTrackId: 1,
          clientRoleType: 1,
        }),
        'joinChannel'
      );
      try {
        await Promise.all([joined, sceneLoaded]);
      } finally {
        if (this.cancelPendingJoin === cancelJoin) {
          this.cancelPendingJoin = null;
        }
      }
      if (this.generation === generation && this.state === 'starting') {
        this.state = 'running';
        this.emitStatus();
      }
    } catch (error) {
      if (this.cancelPendingJoin) this.cancelPendingJoin();
      await this.cleanup(generation);
      if (this.generation === generation && this.state !== 'failed') {
        this.state = 'idle';
      }
      throw error;
    }
  }

  attachRunListeners(generation) {
    const listen = (emitter, event, listener) => {
      emitter.on(event, listener);
      this.listenerDisposers.push(() =>
        emitter.removeListener(event, listener)
      );
    };
    listen(this.window.webContents, 'paint', (details) => {
      if (this.generation === generation && details.texture) {
        this.handlePaint(details.texture);
      }
    });
    listen(
      this.window.webContents,
      'console-message',
      (_event, levelOrDetails, message) =>
        this.handleConsoleMessage(
          typeof message === 'string' ? message : levelOrDetails?.message,
          generation
        )
    );
    listen(this.window.webContents, 'render-process-gone', () => {
      void this.failRun('renderer-gone', generation);
    });
    listen(this.window, 'unresponsive', () => {
      if (this.generation !== generation) return;
      if (this.telemetry.addDegradation('renderer-unresponsive')) {
        this.emitStatus();
      }
    });
    listen(this.window, 'responsive', () => {
      if (this.generation !== generation) return;
      if (this.telemetry.clearDegradation('renderer-unresponsive')) {
        this.emitStatus();
      }
    });
    this.gpuDisposer = this.subscribeGpuProcessGone(() => {
      if (this.generation !== generation) return;
      if (this.telemetry.addDegradation('gpu-process-gone')) {
        this.emitStatus();
      }
    });
  }

  startTimers(generation) {
    this.watchdogTimer = this.setIntervalFn(() => {
      if (!this.canSubmitFrames() || this.generation !== generation) return;
      if (this.monotonicMs() - this.lastValidPaintMs > PAINT_TIMEOUT_MS) {
        if (this.telemetry.addDegradation('paint-timeout')) this.emitStatus();
      }
    }, PAINT_TIMEOUT_MS);
    this.watchdogTimer.unref?.();
    this.statusTimer = this.setIntervalFn(() => {
      if (this.generation === generation) this.emitStatus();
    }, STATUS_INTERVAL_MS);
    this.statusTimer.unref?.();
  }

  handleConsoleMessage(message, generation) {
    if (this.generation !== generation) return;
    let diagnostic;
    try {
      diagnostic = parseWorkerDiagnostic(message);
    } catch (error) {
      this.logger.error('Shared texture Worker diagnostic rejected', error);
      return;
    }
    if (!diagnostic) return;
    this.telemetry.recordWorkerDiagnostic(diagnostic);
    if (diagnostic.type === 'context-lost') {
      this.webglRestored = false;
      if (this.telemetry.addDegradation('webgl-context-lost')) {
        this.emitStatus();
      }
    } else if (diagnostic.type === 'context-restored') {
      this.webglRestored = true;
      this.emitStatus();
    } else if (diagnostic.type === 'ready') {
      this.emitStatus();
    } else if (
      diagnostic.type === 'error' ||
      diagnostic.type === 'messageerror' ||
      diagnostic.type === 'init-error'
    ) {
      void this.failRun(`worker-${diagnostic.type}`, generation);
    }
  }

  requireSuccess(result, operation) {
    if (typeof result === 'number' && result < 0) {
      throw new Error(`${operation} failed with result ${result}`);
    }
  }

  handlePaint(texture) {
    if (!this.canSubmitFrames()) {
      this.releaseOnce(texture);
      return;
    }
    const frame = this.toFrame(texture, this.nextFrameId);
    if (!frame) {
      this.telemetry.recordInvalidFrame();
      this.releaseOnce(texture);
      return;
    }
    const monotonicMs = this.monotonicMs();
    this.lastValidPaintMs = monotonicMs;
    this.telemetry.recordPaint({
      timestampUs: frame.timestampUs,
      monotonicMs,
    });
    let healthChanged = this.telemetry.clearDegradation('paint-timeout');
    healthChanged =
      this.telemetry.clearDegradation('gpu-process-gone') || healthChanged;
    if (this.webglRestored) {
      healthChanged =
        this.telemetry.clearDegradation('webgl-context-lost') || healthChanged;
      this.webglRestored = false;
    }
    if (healthChanged) this.emitStatus();
    if (this.inFlight) {
      if (this.pendingTexture) {
        this.telemetry.recordPendingReplacement();
        this.releaseOnce(this.pendingTexture);
      }
      this.pendingTexture = texture;
      return;
    }
    this.submit(texture);
  }

  toFrame(texture, frameId) {
    const info = texture && texture.textureInfo;
    const handle = info && info.handle;
    const size = info && (info.codedSize || info.size);
    const format = info && this.normalizePixelFormat(info.pixelFormat);
    if (
      !info ||
      !handle ||
      !Buffer.isBuffer(handle.ntHandle) ||
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
      ntHandle: handle.ntHandle,
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
    const generation = this.generation;
    const telemetry = this.telemetry;
    const frame = this.toFrame(texture, this.nextFrameId++);
    if (!frame) {
      telemetry.recordInvalidFrame();
      this.releaseOnce(texture);
      return;
    }
    const startedAt = this.monotonicMs();
    const submission = { generation, texture, promise: null };
    let nativeResult;
    try {
      nativeResult = this.mediaEngine.pushSharedD3D11Texture(frame);
    } catch (error) {
      telemetry.recordSubmissionFailure();
      this.releaseOnce(texture);
      this.logger.error('Shared texture submission failed', error);
      return;
    }
    const operation = Promise.resolve(nativeResult)
      .catch((error) => {
        if (this.generation === generation) telemetry.recordSubmissionFailure();
        this.logger.error('Shared texture submission failed', error);
      })
      .finally(() => {
        this.releaseOnce(texture);
        if (this.generation === generation) {
          telemetry.recordSubmission(this.monotonicMs() - startedAt);
        }
      });
    submission.promise = operation.finally(() => {
      if (this.generation !== generation || this.inFlight !== submission)
        return;
      this.inFlight = null;
      if (this.canSubmitFrames() && this.pendingTexture) {
        const pending = this.pendingTexture;
        this.pendingTexture = null;
        this.submit(pending);
      }
    });
    this.inFlight = submission;
  }

  canSubmitFrames() {
    return (
      (this.state === 'starting' || this.state === 'running') &&
      this.mediaEngine !== null
    );
  }

  releaseOnce(texture) {
    if (!texture || this.releasedTextures.has(texture)) return;
    this.releasedTextures.add(texture);
    texture.release();
  }

  emitStatus() {
    const snapshot = { state: this.state, ...this.telemetry.snapshot() };
    this.onStatus(snapshot);
    if (typeof this.logger.info === 'function') {
      this.logger.info('Shared texture telemetry', snapshot);
    }
  }

  setStatusListener(listener) {
    this.onStatus = typeof listener === 'function' ? listener : () => {};
    const ownedListener = this.onStatus;
    return () => {
      if (this.onStatus === ownedListener) this.onStatus = () => {};
    };
  }

  getTelemetrySnapshot() {
    return { state: this.state, ...this.telemetry.snapshot() };
  }

  async failRun(reason, generation = this.generation) {
    if (
      this.generation !== generation ||
      this.state === 'idle' ||
      this.state === 'stopping' ||
      this.state === 'failed'
    ) {
      return;
    }
    this.state = 'failing';
    this.telemetry.markFailed(reason);
    this.emitStatus();
    if (this.cancelPendingJoin) this.cancelPendingJoin();
    await this.cleanup(generation);
    if (this.generation === generation) {
      this.state = 'failed';
      this.emitStatus();
    }
  }

  async stop() {
    if (this.state === 'idle') return;
    if (this.state === 'stopping') return this.stopping;
    const generation = this.generation;
    const cancelPendingJoin = this.cancelPendingJoin;
    this.state = 'stopping';
    this.emitStatus();
    if (cancelPendingJoin) cancelPendingJoin();
    this.stopping = (async () => {
      await this.cleanup(generation);
      if (this.generation === generation) {
        this.state = 'idle';
        this.emitStatus();
      }
    })();
    return this.stopping;
  }

  stopRunObservers() {
    if (this.watchdogTimer !== null) {
      this.clearIntervalFn(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    if (this.statusTimer !== null) {
      this.clearIntervalFn(this.statusTimer);
      this.statusTimer = null;
    }
    for (const dispose of this.listenerDisposers.splice(0)) dispose();
    if (this.gpuDisposer) {
      this.gpuDisposer();
      this.gpuDisposer = null;
    }
  }

  async drainSubmission(generation) {
    if (this.pendingTexture) {
      this.releaseOnce(this.pendingTexture);
      this.pendingTexture = null;
    }
    const submission = this.inFlight;
    if (!submission || submission.generation !== generation) return;
    let timeoutId;
    const timedOut = await Promise.race([
      submission.promise.then(() => false),
      new Promise((resolve) => {
        timeoutId = this.setTimeoutFn(() => resolve(true), DRAIN_TIMEOUT_MS);
      }),
    ]);
    if (timeoutId !== undefined) this.clearTimeoutFn(timeoutId);
    if (timedOut) {
      this.telemetry.recordDrainTimeout();
      this.releaseOnce(submission.texture);
      if (this.inFlight === submission) this.inFlight = null;
    }
  }

  async cleanup(generation) {
    if (this.cleanupPromise) return this.cleanupPromise;
    this.stopRunObservers();
    const engine = this.engine;
    const mediaEngine = this.mediaEngine;
    const window = this.window;
    this.engine = null;
    this.mediaEngine = null;
    this.window = null;
    this.cancelPendingJoin = null;

    this.cleanupPromise = (async () => {
      await this.drainSubmission(generation);
      try {
        if (engine) {
          try {
            engine.leaveChannel();
            if (mediaEngine) {
              mediaEngine.setExternalVideoSource(false, true, 0);
            }
          } finally {
            engine.release();
          }
        }
      } finally {
        if (window) window.destroy();
      }
    })();
    try {
      await this.cleanupPromise;
    } finally {
      this.cleanupPromise = null;
    }
  }
}

module.exports = { SharedTexturePocController };
