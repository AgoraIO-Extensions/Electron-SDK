const fs = require('fs-extra');
const path = require('path');

const destIrisSDKDir = path.join(__dirname, `../iris`);
const buildDir = path.resolve(__dirname, '../build');

exports.destIrisSDKDir = destIrisSDKDir;
exports.buildDir = buildDir;

exports.cleanIrisDir = async () => await fs.remove(destIrisSDKDir);

exports.cleanBuildDir = async () =>
  await fs.remove(`${path.resolve(__dirname, '../build')}`);

exports.cleanJSDir = async () =>
  await fs.remove(`${path.resolve(__dirname, '../js')}`);

exports.cleanTypesDir = async () =>
  await fs.remove(`${path.resolve(__dirname, '../types')}`);
