const os = require('os');

const fs = require('fs-extra');

const getConfig = require('./getConfig');
const logger = require('./logger');

exports.getOS = () => {
  const { platform } = getConfig();
  if (platform === 'darwin') {
    return 'mac';
  } else if (platform === 'win32') {
    return 'win32';
  } else {
    return 'linux';
  }
};

exports.createTmpDir = async () => await fs.mkdtemp(`${os.tmpdir()}_AgoraTmp`);

exports.moveFile = (sp, tp) => {
  logger.info(`move file from ${sp} to ${tp}`);
  fs.rename(sp, tp, function (err) {
    if (err) {
      throw err;
    }
  });
};

exports.getIrisStandAlone = () => {
  const { iris_sdk_mac, iris_sdk_win } = getConfig();
  const os = this.getOS();
  if (
    (os === 'mac' &&
      iris_sdk_mac &&
      iris_sdk_mac.toLowerCase().indexOf('standalone') !== -1) ||
    (os === 'win32' &&
      iris_sdk_win &&
      iris_sdk_win.toLowerCase().indexOf('standalone') !== -1)
  ) {
    logger.info('iris use standalone package');
    return true;
  } else {
    logger.info('iris use non-standalone package');
    return false;
  }
};
