const { logger } = require("just-task");
const download = require("download");
const path = require("path");

module.exports = ({
  electronVersion = "5.0.8",
  platform = process.platform,
  packageVersion
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
  const supportedVersions = ['7.1.2', '6.1.5', '5.0.8', '4.2.8', '3.0.6', '1.8.3']
  if (supportedVersions.indexOf(electronVersion) === -1) {
    throw new Error(`Prebuilt addon only supported electron version ${supportedVersions.join(' ')}`)
  }

  const downloadUrl = `http://download.agora.io/sdk/release/Electron-${genOS()}-${packageVersion}-${electronVersion}.zip`;

  /** start download */
  const outputDir = "./build/";

  logger.info("Package Version:", packageVersion);
  logger.info("Platform:", platform);
  logger.info("Electron Version:", electronVersion);
  logger.info("  Download URL  : ", downloadUrl, "\n");

  logger.info("Downloading prebuilt C++ addon for Agora Electron SDK...\n");

  download(downloadUrl, outputDir, {
    strip: 1,
    extract: true
  })
    .then(() => {
      logger.info("Success", "Download finished");
    })
    .catch(err => {
      logger.error("Failed: ", err);
      throw new Error(err);
    });
};
