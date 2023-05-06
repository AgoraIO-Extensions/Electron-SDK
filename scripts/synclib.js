const download = require('download');

const { destIrisSDKDir, cleanIrisDir } = require('./clean');
const getConfig = require('./getConfig');
const logger = require('./logger');
const { getOS } = require('./util');

const config = getConfig();

const { iris_sdk_mac, iris_sdk_win } = config;

const downloadSDK = async ({ preHook, postHook, sdkURL, destDir }) => {
  logger.info(`Downloading:${sdkURL}`);
  await preHook();
  await download(sdkURL, destDir, {
    strip: 1,
    extract: true,
  });
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
      destDir: destIrisSDKDir,
    });
  } catch (error) {
    logger.error(error);
  }
  cb();
};

module.exports = syncLib;
