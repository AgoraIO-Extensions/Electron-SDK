const { exec } = require('shelljs');

const logger = require('./logger');
const { getOS } = require('./util');

const zipBuild = async () => {
  const isMac = getOS() === 'mac';
  const fileListStr = ' build js types package.json';
  const shellStr =
    (isMac ? 'zip -ry electron.zip' : '7z a electron.zip') + fileListStr;
  const { code, stderr } = await exec(shellStr);
  if (code !== 0) {
    logger.error(stderr);
  }
};

module.exports = zipBuild;
