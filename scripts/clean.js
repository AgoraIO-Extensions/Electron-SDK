const path = require('path');

const fs = require('fs-extra');

const logger = require('./logger');

exports.destIrisSDKDir = path.join(__dirname, `../iris`);
exports.destNativeSDKDir = path.join(__dirname, `../native`);
exports.buildDir = path.resolve(__dirname, '../build');
exports.jsDir = path.resolve(__dirname, '../js');
exports.typesDir = path.resolve(__dirname, '../types');

exports.cleanDir = async (dir) => {
  await fs.remove(dir);
  logger.info(`clean:${dir}`);
};
