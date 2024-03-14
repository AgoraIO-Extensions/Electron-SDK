const path = require('path');

const download = require('download');

const { destIrisSDKDir, cleanDir, destNativeSDKDir } = require('./clean');
const getConfig = require('./getConfig');
const logger = require('./logger');
const { getOS } = require('./util');

const config = getConfig();

const { iris_sdk_mac, iris_sdk_win, native_sdk_mac, native_sdk_win } = config;

const downloadSDK = async ({ preHook, postHook, sdkURL, destDir }) => {
  logger.info(`Downloading:${sdkURL}`);
  await preHook();
  await download(sdkURL, destDir, {
    strip: 1,
    extract: true,
    filter: (file) => {
      return (
        file.type !== 'directory' &&
        !file.path.endsWith(path.sep) &&
        file.data.length !== 0
      );
    },
  });
  logger.info(`Finish download:${sdkURL}`);
  typeof postHook === 'function' && (await postHook());
};

const syncLib = async (cb) => {
  const os = getOS();
  await downloadSDK({
    preHook: () => {
      cleanDir(destIrisSDKDir);
    },
    sdkURL: os === 'mac' ? iris_sdk_mac : iris_sdk_win,
    destDir: destIrisSDKDir,
  });
  await downloadSDK({
    preHook: () => {
      cleanDir(destNativeSDKDir);
    },
    sdkURL: os === 'mac' ? native_sdk_mac : native_sdk_win,
    destDir: destNativeSDKDir,
  });
  cb();
};

module.exports = syncLib;
