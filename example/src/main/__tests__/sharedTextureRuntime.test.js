const fs = require('fs');
const path = require('path');

const exampleRoot = path.resolve(__dirname, '../../..');
const sdkRoot = path.resolve(exampleRoot, '..');

test('pins the shared texture PoC to Electron 43.2.0', () => {
  const examplePackage = require(path.join(exampleRoot, 'package.json'));

  expect(examplePackage.devDependencies.electron).toBe('43.2.0');
});

test('packages only the linked SDK runtime artifacts', () => {
  const examplePackage = require(path.join(exampleRoot, 'package.json'));

  expect(examplePackage.build.asarUnpack).toEqual([
    'node_modules/agora-electron-sdk/build/**/*',
  ]);
  expect(examplePackage.build.files).toContain(
    '!node_modules/agora-electron-sdk{,/**/*}'
  );
  expect(examplePackage.build.files).toContainEqual({
    from: 'node_modules/agora-electron-sdk',
    to: 'node_modules/agora-electron-sdk',
    filter: ['package.json', 'js/**/*', 'build/**/*'],
  });
});

test('resolves agora-electron-sdk from this worktree', () => {
  const resolvedSdkPackage = fs.realpathSync(
    require.resolve('agora-electron-sdk/package.json', {
      paths: [exampleRoot],
    })
  );
  const worktreeSdkPackage = fs.realpathSync(
    path.join(sdkRoot, 'package.json')
  );

  expect(resolvedSdkPackage).toBe(worktreeSdkPackage);
});

test('loads the main-process bridge from the external SDK singleton', () => {
  const extendMainWebpack = require(path.join(
    exampleRoot,
    'webpack.main.additions.js'
  ));
  const config = extendMainWebpack({ externals: ['agora-electron-sdk'] });

  expect(config.externals).toEqual(
    expect.arrayContaining([
      'agora-electron-sdk',
      'agora-electron-sdk/js/Private/internal/IrisApiEngine.js',
      'agora-electron-sdk/js/Private/ipc/main.js',
    ])
  );
});
