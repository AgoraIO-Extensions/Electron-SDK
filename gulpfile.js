const gulp = require('gulp');

const build = require('./scripts/build');
const buildJS = require('./scripts/buildJS');
const { cleanBuildDir, cleanJSDir, cleanIrisDir } = require('./scripts/clean');
const downloadPrebuild = require('./scripts/downloadPrebuild');
const getConfig = require('./scripts/getConfig');
const logger = require('./scripts/logger');
const syncLib = require('./scripts/synclib');
const zipBuild = require('./scripts/zipBuild');

const config = getConfig();
logger.info(`Get Config: \n${JSON.stringify(config, undefined, 4)}`);

const clean = async (cb) => {
  await cleanIrisDir();
  await cleanBuildDir();
  await cleanJSDir();
  cb();
};

const totalBuild = gulp.series(clean, syncLib, build, buildJS);

const wrapDownloadPreBuild = async (cb) => {
  await downloadPrebuild(cb);
};

const NPM_Install = config.prebuilt
  ? wrapDownloadPreBuild
  : async () => {
      logger.warn('config prebuilt is false, skip `NPM_Install`');
    };

exports.syncLib = syncLib;
exports.clean = clean;
exports.build = build;
exports.buildJS = buildJS;
exports.zipBuild = zipBuild;
exports.totalBuild = totalBuild;
exports.NPM_Install = NPM_Install;

exports.downloadPrebuild = downloadPrebuild;
exports.default = totalBuild;
