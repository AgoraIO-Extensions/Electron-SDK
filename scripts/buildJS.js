const { exec } = require('shelljs');
const logger = require('./logger');
const { cleanJSDir, cleanTypesDir } = require('./clean');

const buildJS = async (cb) => {
  logger.info('Build js from typescript');
  await cleanJSDir();
  await cleanTypesDir();
  await exec('tsc', { silent: false });
  await exec('tsc -p dtsconfig.json', { silent: false });
  cb();
};

module.exports = buildJS;
