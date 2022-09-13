const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const download = require('download');
const extract = require('extract-zip');
const { promisify } = require('util');
const logger = require('./logger');
const getConfig = require('./getConfig');
const { getOS, createTmpDir } = require('./util');
const { destIrisSDKDir, cleanIrisDir } = require('./clean');

const globPromise = promisify(glob);
const config = getConfig();

const { iris_sdk_mac, iris_sdk_win } = config;

const downloadSDK = async ({
  preHook,
  postHook,
  sdkURL,
  globPattern,
  destDir,
}) => {
  logger.info(`Downloading:${sdkURL}`);
  await preHook();
  const downloadTmp = await createTmpDir();
  await download(sdkURL, downloadTmp, {
    filename: 'sdk.zip',
  });

  const zipPath = path.join(downloadTmp, 'sdk.zip');
  await extract(zipPath, {
    dir: downloadTmp,
  });
  const filterUnzipsFiles = await globPromise(
    path.join(downloadTmp, globPattern),
    {
      ignore: [],
    }
  );
  if (filterUnzipsFiles.length === 0) {
    const message = `${sdkURL}: Can't find libs`;
    logger.error(message);
    throw new Error(message);
  }

  await fs.copy(filterUnzipsFiles[0], destDir);
  await fs.remove(downloadTmp);
  logger.info(`Finish download:${sdkURL}`);
  await postHook();
};

const syncLib = async (cb) => {
  try {
    const os = getOS();
    await downloadSDK({
      preHook: cleanIrisDir,
      postHook: () => {},
      sdkURL: os === 'mac' ? iris_sdk_mac : iris_sdk_win,
      globPattern: '*/**',
      destDir: destIrisSDKDir,
    });
  } catch (error) {
    logger.error(error);
  }
  cb();
};

module.exports = syncLib;
