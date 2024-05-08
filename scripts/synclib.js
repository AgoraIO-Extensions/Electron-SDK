const path = require('path');

const download = require('download');

const { destIrisSDKDir, cleanDir, destNativeSDKDir } = require('./clean');
const getConfig = require('./getConfig');
const logger = require('./logger');
const { getOS, moveFile, getIrisStandAlone } = require('./util');

const config = getConfig();

const { iris_sdk_mac, iris_sdk_win, native_sdk_mac, native_sdk_win } = config;

const downloadSDK = async ({
  preHook,
  postHook,
  sdkURL,
  destDir,
  strip = 1,
}) => {
  logger.info(`Downloading:${sdkURL}`);
  await preHook();
  await download(sdkURL, destDir, {
    strip: strip,
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
  let irisStandAlone = getIrisStandAlone();
  await downloadSDK({
    preHook: () => {
      cleanDir(destIrisSDKDir);
    },
    postHook: () => {
      if (irisStandAlone) {
        cleanDir(destNativeSDKDir);
      }
    },
    sdkURL: os === 'mac' ? iris_sdk_mac : iris_sdk_win,
    destDir: destIrisSDKDir,
  });
  if (irisStandAlone) {
    await downloadSDK({
      preHook: () => {
        cleanDir(destNativeSDKDir);
      },
      strip: 0,
      sdkURL: os === 'mac' ? native_sdk_mac : native_sdk_win,
      destDir: destNativeSDKDir,
    });
  } else {
    moveFile(path.join(destIrisSDKDir, `../iris/DCG`), destNativeSDKDir);
  }

  cb();
};

module.exports = syncLib;
