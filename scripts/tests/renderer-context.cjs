// Run with node scripts/tests/renderer-context.cjs (requires devDependencies).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Load the real manager without loading Electron, native binaries or a DOM.
const root = path.resolve(__dirname, '../..');
const relative = fs.existsSync(path.join(root, 'ts/Renderer/IRendererManager.ts'))
  ? 'ts/Renderer/IRendererManager.ts'
  : 'ts/Renderer/RendererManager.ts';
const filename = path.join(root, relative);
const source = process.env.RENDERER_CONTEXT_SOURCE || fs.readFileSync(filename, 'utf8');
const exportsObject = {};
const media = {
  VideoSourceType: { VideoSourceCamera: 0, VideoSourceMediaPlayer: 7, VideoSourceRemote: 9 },
  VideoModulePosition: { PositionPreEncoder: 4, PositionPreRenderer: 8, PositionPostCapturer: 1 },
};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, {
  exports: exportsObject,
  require: (name) => {
    if (name === '../Private/AgoraMediaBase') return media;
    if (name === '../Utils') return { AgoraEnv: {} };
    return {};
  },
}, { filename });
const Manager = exportsObject.IRendererManager || exportsObject.RendererManager;
const manager = Object.create(Manager.prototype);
manager._context = { channelId: 'main', renderMode: 1, mirrorMode: 0 };
const normalize = manager.precheckRendererContext || manager.presetRendererContext;
const cases = [
  ['implicit Remote', { uid: 1591 }, 'main', 9, 1591],
  ['explicit Remote', { uid: 1591, sourceType: 9 }, 'main', 9, 1591],
  ['explicit channel', { uid: 1591, channelId: 'other' }, 'other', 9, 1591],
  ['Ex connection', { uid: 1591, channelId: 'other', localUid: 42 }, 'other', 9, 1591],
  ['local camera', { sourceType: 0, channelId: 'other', uid: 1591 }, '', 0, 0],
  ['media player', { sourceType: 7, mediaPlayerId: 5 }, '', 7, 5],
];
for (const [name, input, channelId, sourceType, uid] of cases) {
  const result = normalize.call(manager, { ...input });
  assert.equal(result.channelId, channelId, name);
  assert.equal(result.sourceType, sourceType, name);
  assert.equal(result.uid, uid, name);
  if (input.localUid !== undefined) assert.equal(result.localUid, input.localUid, name);
}
assert.throws(() => normalize.call(manager, { sourceType: 9 }), /uid is required/);
assert.throws(() => normalize.call(manager, { sourceType: 7 }), /mediaPlayerId is required/);
console.log(`${relative}: 8 regression cases passed`);
