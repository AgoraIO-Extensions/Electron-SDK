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
