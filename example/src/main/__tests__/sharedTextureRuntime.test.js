const fs = require('fs');
const path = require('path');

const exampleRoot = path.resolve(__dirname, '../../..');
const sdkRoot = path.resolve(exampleRoot, '..');

test('pins the shared texture PoC to Electron 43.2.0', () => {
  const examplePackage = require(path.join(exampleRoot, 'package.json'));

  expect(examplePackage.devDependencies.electron).toBe('43.2.0');
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
