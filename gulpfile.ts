//@ts-nocheck
import { series } from "gulp";
import syncLib from "./scripts/syncLib";
import buildScript from "./scripts/build";
import getConfig from "./scripts/getConfig";
import dowmloadPrebuild from "./scripts/dowmloadPrebuild";
import { cleanLibsDir, cleanBuildDir, cleanJSDir } from "./scripts/clean";
import buildJS from "./scripts/buildJS";
import logger from "./scripts/logger";
import { lipoCreate, createTmpProduct } from "./scripts/util";

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

const NPM_Install = config.prebuilt ? dowmloadPrebuild : totalBuild;

exports.syncLib = syncLib;
exports.clean = clean;
exports.build = build;
exports.buildJS = buildJS;
exports.totalBuild = totalBuild;
exports.NPM_Install = NPM_Install;

exports.dowmloadPrebuild = dowmloadPrebuild;
exports.default = totalBuild;
