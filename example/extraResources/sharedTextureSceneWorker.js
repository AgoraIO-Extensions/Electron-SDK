const MAX_DRAW_INTERVALS = 120;

let canvas;
let gl;
let program;
let positionBuffer;
let timeLocation;
let resolutionLocation;
let requestedFrameRate = 30;
let sequence = 0;
let lastDrawTime = null;
let nextDrawTime = 0;
let running = false;
let contextState = 'initializing';
const drawIntervals = [];

function diagnostic(type, reportedContextState = contextState, message) {
  postMessage({
    version: 1,
    type,
    sequence,
    requestedFrameRate,
    timeOriginMs: performance.timeOrigin,
    monotonicTimeMs: performance.now(),
    drawIntervalsMs: [...drawIntervals],
    contextState: reportedContextState,
    ...(message ? { message } : {}),
  });
}

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
  }
  return shader;
}

function createResources() {
  const vertexShader = compileShader(
    gl.VERTEX_SHADER,
    `#version 300 es
     in vec2 position;
     void main() { gl_Position = vec4(position, 0.0, 1.0); }`
  );
  const fragmentShader = compileShader(
    gl.FRAGMENT_SHADER,
    `#version 300 es
     precision highp float;
     uniform float timeMs;
     uniform vec2 resolution;
     out vec4 color;
     void main() {
       vec2 uv = gl_FragCoord.xy / resolution;
       float band = floor(uv.x * 3.0);
       vec3 base = band < 1.0
         ? vec3(0.94, 0.27, 0.27)
         : (band < 2.0 ? vec3(0.13, 0.77, 0.37) : vec3(0.23, 0.51, 0.96));
       float marker = step(abs(uv.x - mod(timeMs * 0.0002, 1.0)), 0.04)
         * step(abs(uv.y - 0.5), 0.04);
       color = vec4(mix(base, vec3(1.0), marker), 1.0);
     }`
  );
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
  }
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  timeLocation = gl.getUniformLocation(program, 'timeMs');
  resolutionLocation = gl.getUniformLocation(program, 'resolution');
}

function draw() {
  if (!running || !gl || gl.isContextLost()) return;
  const now = performance.now();
  if (lastDrawTime !== null) {
    drawIntervals.push(now - lastDrawTime);
    if (drawIntervals.length > MAX_DRAW_INTERVALS) drawIntervals.shift();
  }
  lastDrawTime = now;
  sequence += 1;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.useProgram(program);
  gl.uniform1f(timeLocation, now);
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const targetInterval = 1000 / requestedFrameRate;
  nextDrawTime = Math.max(nextDrawTime + targetInterval, now + 1);
  const delayMs = Math.max(0, nextDrawTime - performance.now());
  setTimeout(draw, delayMs);
}

function initialize(message) {
  canvas = message.canvas;
  canvas.width = message.width;
  canvas.height = message.height;
  requestedFrameRate = message.requestedFrameRate;
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    running = false;
    contextState = 'lost';
    diagnostic('context-lost', 'lost');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    try {
      createResources();
      lastDrawTime = null;
      nextDrawTime = performance.now();
      running = true;
      contextState = 'active';
      diagnostic('context-restored', 'active');
      draw();
    } catch (error) {
      diagnostic('init-error', 'failed', String(error));
    }
  });
  gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) throw new Error('WebGL2 is unavailable');
  createResources();
  nextDrawTime = performance.now();
  running = true;
  contextState = 'active';
  diagnostic('ready', 'active');
  draw();
  setInterval(() => diagnostic('stats'), 1000);
}

addEventListener('message', (event) => {
  const message = event.data;
  try {
    if (message.type === 'init') {
      initialize(message);
    } else if (message.type === 'resize' && canvas) {
      canvas.width = message.width;
      canvas.height = message.height;
    } else if (message.type === 'lose-context' && gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } else if (message.type === 'restore-context' && gl) {
      gl.getExtension('WEBGL_lose_context')?.restoreContext();
    }
  } catch (error) {
    running = false;
    contextState = 'failed';
    diagnostic('init-error', 'failed', String(error));
  }
});
