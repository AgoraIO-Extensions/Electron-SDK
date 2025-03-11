const path = require('path');

const { destIrisSDKDir, cleanDir, destNativeSDKDir } = require('./clean');
const download = require('./download');

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
    //https://github.com/kevva/decompress/issues/68
    map: (file) => {
      if (file.type === 'file' && file.path.endsWith('/')) {
        file.type = 'directory';
      }
      return file;
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
