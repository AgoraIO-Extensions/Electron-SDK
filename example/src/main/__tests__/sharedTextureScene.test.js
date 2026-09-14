const fs = require('fs');
const path = require('path');

const resources = path.resolve(__dirname, '../../../extraResources');
const hostPath = path.join(resources, 'sharedTextureScene.html');
const workerPath = path.join(resources, 'sharedTextureSceneWorker.js');
const benchmarkPath = path.resolve(
  __dirname,
  '../../../scripts/sharedTexturePacingBenchmark.js'
);

test('host transfers a DOM canvas and forwards versioned Worker diagnostics', () => {
  const host = fs.readFileSync(hostPath, 'utf8');

  expect(host).toMatch(/<canvas[^>]+id="shared-texture-canvas"/);
  expect(host).toContain('transferControlToOffscreen()');
  expect(host).toContain("new Worker('./sharedTextureSceneWorker.js')");
  expect(host).toMatch(/postMessage\([^;]+\[offscreenCanvas\]/s);
  expect(host).toContain('AGORA_SHARED_TEXTURE_POC_V1 ');
  expect(host).toContain("worker.addEventListener('error'");
  expect(host).toContain("worker.addEventListener('messageerror'");
  expect(host).not.toContain("getContext('webgl2')");
});

test('pacing benchmark isolates Worker drawing from Electron paint delivery', () => {
  const benchmark = fs.readFileSync(benchmarkPath, 'utf8');

  expect(benchmark).toContain('useSharedTexture: true');
  expect(benchmark).toContain('backgroundThrottling: false');
  expect(benchmark).toContain('webContents.setFrameRate(frameRate)');
  expect(benchmark).toContain("webContents.on('paint'");
  expect(benchmark).toContain('details.texture.release()');
  expect(benchmark).toContain('SHARED_TEXTURE_PACING_RESULT');
  expect(benchmark).not.toContain('PushSharedTexture');
});

test('Worker exclusively owns WebGL2 and bounded pacing diagnostics', () => {
  const worker = fs.readFileSync(workerPath, 'utf8');

  expect(worker).toContain("getContext('webgl2'");
  expect(worker).toContain('MAX_DRAW_INTERVALS = 120');
  expect(worker).toContain(
    'renderFrameRate = Math.min(120, requestedFrameRate * 2)'
  );
  expect(worker).toContain('1000 / renderFrameRate');
  expect(worker).toContain('drawIntervals.shift()');
  expect(worker).toContain("addEventListener('webglcontextlost'");
  expect(worker).toContain("addEventListener('webglcontextrestored'");
  expect(worker).toContain("getExtension('WEBGL_lose_context')");
  expect(worker).toContain("diagnostic('context-lost', 'lost')");
  expect(worker).toContain("diagnostic('context-restored', 'active')");
  expect(worker).toMatch(/setTimeout\([^,]+,\s*delayMs\)/s);
  expect(worker).not.toContain('requestAnimationFrame');
});
