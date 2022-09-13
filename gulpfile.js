const { series } = require('gulp');
const syncLib = require('./scripts/synclib');
const build = require('./scripts/build');
const getConfig = require('./scripts/getConfig');
const dowmloadPrebuild = require('./scripts/dowmloadPrebuild');
const { cleanBuildDir, cleanJSDir, cleanIrisDir } = require('./scripts/clean');
const buildJS = require('./scripts/buildJS');
const logger = require('./scripts/logger');
const zipBuild = require('./scripts/zipBuild');

const config = getConfig();
logger.info(`Get Config: \n${JSON.stringify(config, undefined, 4)}`);

const clean = async (cb) => {
  await cleanIrisDir();
  await cleanBuildDir();
  await cleanJSDir();
  cb();
};

const totalBuild = series(clean, syncLib, build, buildJS);

const wrapDownloadPreBuild = async (cb) => {
  dowmloadPrebuild(cb);
};

const NPM_Install = config.prebuilt ? wrapDownloadPreBuild : totalBuild;

exports.syncLib = syncLib;
exports.clean = clean;
exports.build = build;
exports.buildJS = buildJS;
exports.zipBuild = zipBuild;
exports.totalBuild = totalBuild;
exports.NPM_Install = NPM_Install;

exports.dowmloadPrebuild = dowmloadPrebuild;
exports.default = totalBuild;
