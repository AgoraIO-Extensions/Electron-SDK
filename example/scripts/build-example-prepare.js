const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');

const packageJsonPath = path.join(__dirname, '../package.json');
const electron_version = pkg.agora_electron?.electron_version;
const arch = process.env.npm_config_agora_electron_sdk_arch;

//When you set agora_electron.electron_version,
//the script will automatically download the specially compiled version of Electron by Agora when installing agora-electron-sdk.
//It will be moved to node_modules/electron/dist.
//If you want to use the Agora compiled Electron version during Electron packaging as well,
//please configure this script in your project.
//It can help you compile based on the content configured in (electronDist)[https://www.electron.build/configuration/configuration] during packaging.
if (process.platform !== 'darwin') {
  return;
}
(async () => {
  if (electron_version) {
    console.log('electron_version is set in agora_electron:', electron_version);
    const version = electron_version.match(/^([^-]+)/)[1];
    const version_suffix = electron_version.match(/-(.+)/)[1];
    console.log('version_suffix is:', version_suffix);
    pkg.devDependencies.electron = version;
    console.log('change example electron version to:', version);
    let electron_dist_path = path.join(require.resolve('electron'), `../dist`);
    pkg.build.electronDist = electron_dist_path;
    console.log('change electronDist to:', pkg.build.electronDist);

    console.log('change arch to:', arch);
    pkg.build.mac.target = [
      {
        target: 'zip',
        arch: [arch],
      },
    ];
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
})();
