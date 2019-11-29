const { logger } = require("just-task");
const download = require("download");
const extract = require('extract-zip')
const promisify = require("bluebird").promisify
const extractPromise = promisify(extract)
const path = require('path')
const fs = require("fs-extra")

module.exports = ({
  electronVersion = "5.0.8",
  platform = process.platform,
  packageVersion,
  arch
}) => {
  /** get download url */
  const genOS = () => {
    if (platform === "darwin") {
      return "mac";
    } else if (platform === "win32") {
      return "win32";
    } else {
      // not supported in temp
      logger.error("Unsupported platform!");
      throw new Error("Unsupported platform!");
    }
  };
  // check electron version

  if (['5.0.8', '4.2.8', '3.0.6', '1.8.3'].indexOf(electronVersion) === -1) {
    throw new Error('Prebuilt addon only supported electron version 5.0.8, 4.2.8, 3.0.6, 1.8.3')
  }

  let downloadUrl = `http://download.agora.io/sdk/release/Electron-${genOS()}-${packageVersion}-${electronVersion}.zip`;
  if(platform === "win32" && arch === "x64") {
    downloadUrl = `http://download.agora.io/sdk/release/Electron-win64-${packageVersion}-${electronVersion}.zip`;
  }

  /** start download */
  const outputDir = "./";

  logger.info("Package Version:", packageVersion);
  logger.info("Platform:", platform);
  if(arch)
    logger.info("Arch:", arch)
  logger.info("Electron Version:", electronVersion);
  logger.info("Download URL  : ", downloadUrl, "\n");

  logger.info("Downloading prebuilt C++ addon for Agora Electron SDK...\n");

  return new Promise((resolve, reject) => {
    download(downloadUrl, outputDir, {filename: "sdk.zip"})
    .then(() => {
      logger.info("Success", "Download finished");
      logger.info("Extracting binaries...\n");
      return extractPromise(path.join(__dirname, '../sdk.zip'), {dir: path.join(__dirname, '../')})
    }).then(() => {
      logger.info("Success", "Extract finished")
      return fs.remove(path.join(__dirname, '../sdk.zip'))
    }).then(() => {
      logger.info("Success", "Downloaded files cleanup")
      resolve()
    })
    .catch(err => {
      logger.error("Failed: ", err);
      reject(new Error(err));
    });
  })
};
