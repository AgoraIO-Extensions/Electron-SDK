const path = require('path');

const fs = require('fs-extra');

const logger = require('./logger');

const destIrisSDKDir = path.join(__dirname, `../iris`);
const buildDir = path.resolve(__dirname, '../build');

exports.destIrisSDKDir = destIrisSDKDir;
exports.buildDir = buildDir;

exports.cleanIrisDir = async () => {
  await fs.remove(destIrisSDKDir);
  logger.info(`clean :${destIrisSDKDir}`);
};

exports.cleanBuildDir = async () => {
  await fs.remove(buildDir);
  logger.info(`clean :${buildDir}`);
};

exports.cleanJSDir = async () => {
  const dir = path.resolve(__dirname, '../js');
  await fs.remove(dir);
  logger.info(`clean :${dir}`);
};

exports.cleanTypesDir = async () => {
  const dir = path.resolve(__dirname, '../types');
  await fs.remove(dir);
  logger.info(`clean :${dir}`);
};
