const { exec } = require('shelljs');

const { cleanDir, typesDir, jsDir } = require('./clean');
const logger = require('./logger');

const buildJS = async (cb) => {
  logger.info('Build js from typescript');
  await cleanDir(jsDir);
  await cleanDir(typesDir);
  await exec('tsc -p tsconfig.build.json', { silent: false });
  cb();
};

module.exports = buildJS;
