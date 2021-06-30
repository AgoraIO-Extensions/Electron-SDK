const { series } = require("gulp");
const syncLib = require("./scripts/syncLib");
const buildScript = require("./scripts/build");
const getConfig = require("./scripts/getConfig");
const dowmloadPrebuild = require("./scripts/dowmloadPrebuild");
const { cleanLibsDir, cleanBuildDir, cleanJSDir } = require("./scripts/clean");
const buildJS = require("./scripts/buildJS");
const logger = require("./scripts/logger");
const zipBuild = require("./scripts/zipBuild");
const { lipoCreate, createTmpProduct } = require("./scripts/util");

const config = getConfig();
logger.info(`Get Config: \n${JSON.stringify(config, undefined, 4)}`);

const clean = async (cb) => {
  await cleanLibsDir();
  await cleanBuildDir();
  await cleanJSDir();
  cb();
};

const buildForMac = async (cb) => {
  await buildScript(cb, config);
  // const tempX86 = await createTmpProduct()
  // await clean()
  // await buildScript(cb, { ...config, arch: 'arm64' })
  // const tempARM64 = await createTmpProduct()
  // lipoCreate(tempX86, tempARM64)
};
const buildForWin = async (cb) => {
  await buildScript(cb, config);
};
const build = config.platform === "darwin" ? buildForMac : buildForWin;

const totalBuild = series(clean, syncLib, build, buildJS);

const wrapDownloadPreBuild = async (cb) => {
  try {
    await dowmloadPrebuild(cb);
  } catch (error) {
    totalBuild(cb);
  }
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
