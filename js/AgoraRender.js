const createProgramFromSources = require('./webgl-utils').createProgramFromSources;
const EventEmitter = require('events').EventEmitter;

const AgoraRender = () => {
  let gl;
  let program;
  let positionLocation;
  let texCoordLocation;
  let yTexture;
  let uTexture;
  let vTexture;
  let texCoordBuffer;
  let surfaceBuffer;
  const that = {
    view: undefined,
    mirrorView: false,
    container: undefined,
    canvas: undefined,
    renderImageCount: 0,
    initWidth: 0,
    initHeight: 0,
    initRotation: 0,
    canvasUpdated: false,
    clientWidth: 0,
    clientHeight: 0,
    // 0 - cover, 1 - fit
    contentMode: 0,
    event: new EventEmitter(),
    firstFrameRender: false
  };

  that.start = function(view, onFailure) {
    initCanvas(
      view,
      that.mirrorView,
      view.clientWidth,
      view.clientHeight,
      that.initRotation,
      onFailure
    );
  };

  that.stop = function() {
    gl = undefined;
    program = undefined;
    positionLocation = undefined;
    texCoordLocation = undefined;

    deleteTexture(yTexture);
    deleteTexture(uTexture);
    deleteTexture(vTexture);
    yTexture = undefined;
    uTexture = undefined;
    vTexture = undefined;

    deleteBuffer(texCoordBuffer);
    deleteBuffer(surfaceBuffer);
    texCoordBuffer = undefined;
    surfaceBuffer = undefined;

    if (that.container) {
      that.container.removeChild(that.canvas);
    }

    if (that.view) {
      that.view.removeChild(that.container);
    }

    that.canvas = undefined;
    that.container = undefined;
    that.view = undefined;
    that.mirrorView = false;
  };

  that.renderImage = function(image) {
    // Rotation, width, height, left, top, right, bottom, yplane, uplane, vplane
    if (!gl) {
      console.log('!gl');
      return;
    }

    if (
      image.width != that.initWidth ||
      image.height != that.initHeight ||
      image.rotation != that.initRotation ||
      image.mirror != that.mirrorView
    ) {
      const view = that.view;
      that.stop();
      // Console.log('init canvas ' + image.width + "*" + image.height + " rotation " + image.rotation);
      initCanvas(view, image.mirror, image.width, image.height, image.rotation, e => {
        console.error(
          `init canvas ${image.width}*${image.height} rotation ${
            image.rotation
          } failed. ${e}`
        );
      });
    }

    // Console.log(image.width, "*", image.height, "planes "
    //    , " y ", image.yplane[0], image.yplane[image.yplane.length - 1]
    //    , " u ", image.uplane[0], image.uplane[image.uplane.length - 1]
    //    , " v ", image.vplane[0], image.vplane[image.vplane.length - 1]
    // );
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    const xWidth = image.width + image.left + image.right;
    const xHeight = image.height + image.top + image.bottom;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        image.left / xWidth,
        image.bottom / xHeight,
        1 - image.right / xWidth,
        image.bottom / xHeight,
        image.left / xWidth,
        1 - image.top / xHeight,
        image.left / xWidth,
        1 - image.top / xHeight,
        1 - image.right / xWidth,
        image.bottom / xHeight,
        1 - image.right / xWidth,
        1 - image.top / xHeight
      ]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    uploadYuv(xWidth, xHeight, image.yplane, image.uplane, image.vplane);

    updateCanvas(image.rotation, image.width, image.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    that.renderImageCount += 1;

    if (!that.firstFrameRender) {
      that.firstFrameRender = true;
      that.event.emit('ready');
    }
  };

  function uploadYuv(width, height, yplane, uplane, vplane) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, yTexture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      width,
      height,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      yplane
    );
    var e = gl.getError();
    if (e != gl.NO_ERROR) {
      console.log('upload y plane ', width, height, yplane.byteLength, ' error', e);
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, uTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      width / 2,
      height / 2,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      uplane
    );
    var e = gl.getError();
    if (e != gl.NO_ERROR) {
      console.log('upload u plane ', width, height, uplane.byteLength, '  error', e);
    }

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, vTexture);
    ('');
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      width / 2,
      height / 2,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      vplane
    );
    var e = gl.getError();
    if (e != gl.NO_ERROR) {
      console.log('upload v plane ', width, height, vplane.byteLength, '  error', e);
    }
  }

  function deleteBuffer(buffer) {
    if (buffer && that.gl) {
      that.gl.deleteBuffer(buffer);
    }
  }

  function deleteTexture(texture) {
    if (texture && that.gl) {
      that.gl.deleteTexture(texture);
    }
  }

  const vertexShaderSource =
    'attribute vec2 a_position;' +
    'attribute vec2 a_texCoord;' +
    'uniform vec2 u_resolution;' +
    'varying vec2 v_texCoord;' +
    'void main() {' +
    'vec2 zeroToOne = a_position / u_resolution;' +
    '   vec2 zeroToTwo = zeroToOne * 2.0;' +
    '   vec2 clipSpace = zeroToTwo - 1.0;' +
    '   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
    'v_texCoord = a_texCoord;' +
    '}';
  const yuvShaderSource =
    'precision mediump float;' +
    'uniform sampler2D Ytex;' +
    'uniform sampler2D Utex,Vtex;' +
    'varying vec2 v_texCoord;' +
    'void main(void) {' +
    '  float nx,ny,r,g,b,y,u,v;' +
    '  mediump vec4 txl,ux,vx;' +
    '  nx=v_texCoord[0];' +
    '  ny=v_texCoord[1];' +
    '  y=texture2D(Ytex,vec2(nx,ny)).r;' +
    '  u=texture2D(Utex,vec2(nx,ny)).r;' +
    '  v=texture2D(Vtex,vec2(nx,ny)).r;' +
    '  y=1.1643*(y-0.0625);' +
    '  u=u-0.5;' +
    '  v=v-0.5;' +
    '  r=y+1.5958*v;' +
    '  g=y-0.39173*u-0.81290*v;' +
    '  b=y+2.017*u;' +
    '  gl_FragColor=vec4(r,g,b,1.0);' +
    '}';

  function initCanvas(view, mirror, width, height, rotation, onFailure) {
    that.clientWidth = view.clientWidth;
    that.clientHeight = view.clientHeight;

    that.view = view;
    that.mirrorView = mirror;
    that.canvasUpdated = false;

    that.container = document.createElement('div');
    that.container.style.width = '100%';
    that.container.style.height = '100%';
    that.container.style.display = 'flex';
    that.container.style.justifyContent = 'center';
    that.container.style.alignItems = 'center';
    that.view.appendChild(that.container);

    that.canvas = document.createElement('canvas');
    if (rotation == 0 || rotation == 180) {
      that.canvas.width = width;
      that.canvas.height = height;
    } else {
      that.canvas.width = height;
      that.canvas.height = width;
    }
    that.initWidth = width;
    that.initHeight = height;
    that.initRotation = rotation;
    if (that.mirrorView) {
      that.canvas.style.transform = 'rotateY(180deg)';
    }
    that.container.appendChild(that.canvas);
    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      gl =
        that.canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
        that.canvas.getContext('experimental-webgl');
    } catch (e) {
      console.log(e);
    }

    if (!gl) {
      gl = undefined;
      onFailure({ error: 'Browser not support! No WebGL detected.' });
      return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Setup GLSL program
    program = createProgramFromSources(gl, [vertexShaderSource, yuvShaderSource]);
    gl.useProgram(program);

    initTextures();
  }

  function initTextures() {
    positionLocation = gl.getAttribLocation(program, 'a_position');
    texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    surfaceBuffer = gl.createBuffer();
    texCoordBuffer = gl.createBuffer();

    // Create a texture.
    gl.activeTexture(gl.TEXTURE0);
    yTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, yTexture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.activeTexture(gl.TEXTURE1);
    uTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, uTexture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.activeTexture(gl.TEXTURE2);
    vTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, vTexture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const y = gl.getUniformLocation(program, 'Ytex');
    gl.uniform1i(y, 0); /* Bind Ytex to texture unit 0 */

    const u = gl.getUniformLocation(program, 'Utex');
    gl.uniform1i(u, 1); /* Bind Utex to texture unit 1 */

    const v = gl.getUniformLocation(program, 'Vtex');
    gl.uniform1i(v, 2); /* Bind Vtex to texture unit 2 */
  }

  function updateCanvas(rotation, width, height) {
    if (that.canvasUpdated) {
      return;
    }
    that.clientWidth = that.view.clientWidth;
    that.clientHeight = that.view.clientHeight;

    try {
      if (that.contentMode === 0) {
        // Cover
        if (rotation === 0 || rotation === 180) {
          if (that.clientWidth / that.clientHeight > width / height) {
            that.canvas.style.zoom = that.clientWidth / width;
          } else if (that.clientWidth / that.clientHeight < width / height) {
            that.canvas.style.zoom = that.clientHeight / height;
          }
        } else {
          // 90, 270
          if (that.clientHeight / that.clientWidth > width / height) {
            that.canvas.style.zoom = that.clientHeight / height;
          } else if (that.clientHeight / that.clientWidth < width / height) {
            that.canvas.style.zoom = that.clientWidth / width;
          }
        }
      } else if (rotation === 0 || rotation === 180) {
        if (that.clientWidth / that.clientHeight > width / height) {
          that.canvas.style.zoom = that.clientHeight / height;
        } else if (that.clientWidth / that.clientHeight < width / height) {
          that.canvas.style.zoom = that.clientWidth / width;
        }
      } else {
        // 90, 270
        if (that.clientHeight / that.clientWidth > width / height) {
          that.canvas.style.zoom = that.clientWidth / width;
        } else if (that.clientHeight / that.clientWidth < width / height) {
          that.canvas.style.zoom = that.clientHeight / height;
        }
      }
    } catch (e) {
      console.log(`updateCanvas 00001 gone ${that.canvas}`);
      console.log(that);
      console.error(e);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, surfaceBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Console.log('image rotation from ', that.imageRotation, ' to ', rotation);
    // 4 vertex, 1(x1,y1), 2(x2,y1), 3(x2,y2), 4(x1,y2)
    //  0: 1,2,4/4,2,3
    // 90: 2,3,1/1,3,4
    // 180: 3,4,2/2,4,1
    // 270: 4,1,3/3,1,2
    const p1 = { x: 0, y: 0 };
    const p2 = { x: width, y: 0 };
    const p3 = { x: width, y: height };
    const p4 = { x: 0, y: height };
    let pp1 = p1,
      pp2 = p2,
      pp3 = p3,
      pp4 = p4;

    switch (rotation) {
      case 0:
        break;
      case 90:
        pp1 = p2;
        pp2 = p3;
        pp3 = p4;
        pp4 = p1;
        break;
      case 180:
        pp1 = p3;
        pp2 = p4;
        pp3 = p1;
        pp4 = p2;
        break;
      case 270:
        pp1 = p4;
        pp2 = p1;
        pp3 = p2;
        pp4 = p3;
        break;
      default:
    }
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        pp1.x,
        pp1.y,
        pp2.x,
        pp2.y,
        pp4.x,
        pp4.y,
        pp4.x,
        pp4.y,
        pp2.x,
        pp2.y,
        pp3.x,
        pp3.y
      ]),
      gl.STATIC_DRAW
    );

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolutionLocation, width, height);
    // That.canvasUpdated = true;
  }

  return that;
};

module.exports = AgoraRender
