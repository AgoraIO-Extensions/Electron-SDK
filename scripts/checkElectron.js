const path = require('path');

const { cleanDir } = require('./clean');
const download = require('./download');

const getConfig = require('./getConfig');
const logger = require('./logger');

const config = getConfig();
const { electron_version, arch, platform } = config;
let { electron_path } = config;
const checkElectron = async (cb) => {
  logger.info(`start sync electron`);
  if (!electron_version || platform !== 'darwin') {
    cb();
    logger.info('electron_version is not set or os is not mac, skip sync');
    return;
  }

  if (!electron_path) {
    try {
      electron_path = require.resolve('electron');
    } catch (error) {
      logger.info('Electron is not installed, skip sync');
      cb();
      return;
    }
  }
  let tp = path.join(electron_path, `../dist`);
  let downloadUrl = `https://download.agora.io/sdk/release/electron-v${electron_version}-${platform}-${arch}.zip`;
  logger.info(`Downloading:${downloadUrl}`);
  await cleanDir(tp);

  await download(downloadUrl, tp, {
    extract: true,
  });

  logger.info(`Finish download:${downloadUrl}`);
  logger.info(`sync electron success`);
  cb();
};

module.exports = checkElectron;
