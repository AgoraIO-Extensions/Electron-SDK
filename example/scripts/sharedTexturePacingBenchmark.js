const fs = require('fs');
const path = require('path');

const { BrowserWindow, app } = require('electron');

const DIAGNOSTIC_PREFIX = 'AGORA_SHARED_TEXTURE_POC_V1 ';

function readIntegerArgument(name, fallback) {
  const prefix = `--${name}=`;
  const argument = process.argv.find((value) => value.startsWith(prefix));
  if (!argument) return fallback;
  const value = Number(argument.slice(prefix.length));
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

function readStringArgument(name) {
  const prefix = `--${name}=`;
  const argument = process.argv.find((value) => value.startsWith(prefix));
  return argument ? argument.slice(prefix.length) : '';
}

function summarize(intervals) {
  if (intervals.length === 0) {
    return { samples: 0, fps: 0, averageMs: 0, p50Ms: 0, p95Ms: 0, maxMs: 0 };
  }
  const sorted = [...intervals].sort((left, right) => left - right);
  const percentile = (ratio) => sorted[Math.floor((sorted.length - 1) * ratio)];
  const averageMs =
    intervals.reduce((total, value) => total + value, 0) / intervals.length;
  return {
    samples: intervals.length,
    fps: 1000 / averageMs,
    averageMs,
    p50Ms: percentile(0.5),
    p95Ms: percentile(0.95),
    maxMs: sorted[sorted.length - 1],
  };
}

function roundSummary(summary) {
  return Object.fromEntries(
    Object.entries(summary).map(([key, value]) => [
      key,
      typeof value === 'number' ? Math.round(value * 100) / 100 : value,
    ])
  );
}

async function run() {
  const frameRate = readIntegerArgument('frame-rate', 30);
  const durationMs = readIntegerArgument('duration-ms', 15000);
  const outputPath = readStringArgument('output');
  if (![30, 48, 60].includes(frameRate)) {
    throw new Error('frame-rate must be 30, 48, or 60');
  }

  await app.whenReady();
  const window = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      offscreen: {
        useSharedTexture: true,
        sharedTexturePixelFormat: 'argb',
      },
      backgroundThrottling: false,
    },
  });
  const paintIntervals = [];
  let lastPaintNs = null;
  let paintCount = 0;
  let latestWorkerDiagnostic = null;

  window.webContents.setFrameRate(frameRate);
  window.webContents.on('paint', (details) => {
    if (!details.texture) return;
    const nowNs = process.hrtime.bigint();
    if (lastPaintNs !== null) {
      paintIntervals.push(Number(nowNs - lastPaintNs) / 1e6);
    }
    lastPaintNs = nowNs;
    paintCount += 1;
    details.texture.release();
  });
  window.webContents.on(
    'console-message',
    (_event, levelOrDetails, legacyMessage) => {
      const message =
        levelOrDetails && typeof levelOrDetails === 'object'
          ? levelOrDetails.message
          : legacyMessage;
      if (
        typeof message !== 'string' ||
        !message.startsWith(DIAGNOSTIC_PREFIX)
      ) {
        return;
      }
      try {
        latestWorkerDiagnostic = JSON.parse(
          message.slice(DIAGNOSTIC_PREFIX.length)
        );
      } catch (_error) {
        latestWorkerDiagnostic = null;
      }
    }
  );

  await window.loadFile(
    path.resolve(__dirname, '../extraResources/sharedTextureScene.html'),
    { query: { frameRate: String(frameRate) } }
  );
  await new Promise((resolve) => setTimeout(resolve, durationMs));

  const workerIntervals =
    latestWorkerDiagnostic &&
    Array.isArray(latestWorkerDiagnostic.drawIntervalsMs)
      ? latestWorkerDiagnostic.drawIntervalsMs
      : [];
  const result = {
    targetCaptureFps: frameRate,
    configuredRenderFps:
      latestWorkerDiagnostic && latestWorkerDiagnostic.renderFrameRate,
    durationMs,
    paintCount,
    worker: roundSummary(summarize(workerIntervals)),
    paint: roundSummary(summarize(paintIntervals)),
  };
  if (outputPath) {
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  }
  console.log(`SHARED_TEXTURE_PACING_RESULT ${JSON.stringify(result)}`);
  window.destroy();
  app.quit();
}

run().catch((error) => {
  console.error(`SHARED_TEXTURE_PACING_ERROR ${error.stack || error}`);
  app.exit(1);
});
