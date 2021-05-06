const { logger } = require("just-task");
const download = require("download");
const path = require("path");
const fs = require('fs-extra');


module.exports = ({
  electronVersion = "5.0.8",
  platform = process.platform,
  packageVersion,
  arch,
  no_symbol = true,
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

  if (['11.0.0', '10.2.0', '9.0.0', '7.1.2', '6.1.7', '5.0.8', '4.2.8', '3.0.6', '1.8.3'].indexOf(electronVersion) === -1) {
    throw new Error('Prebuilt addon only supported electron version 11.0.0 10.2.0 9.0.0, 7.1.2, 6.1.7, 5.0.8, 4.2.8, 3.0.6, 1.8.3')
  }

  let downloadUrl = `http://download.agora.io/sdk/release/Electron-${genOS()}-${packageVersion}-${electronVersion}.zip`;
  if(platform === "win32" && arch === "x64") {
    downloadUrl = `http://download.agora.io/sdk/release/Electron-win64-${packageVersion}-${electronVersion}.zip`;
  }

  /** start download */
  const outputDir = "./build/";

  logger.info("Package Version:", packageVersion);
  logger.info("Platform:", platform);
  if(arch)
    logger.info("Arch:", arch)
  logger.info("Electron Version:", electronVersion);
  logger.info("  Download URL  : ", downloadUrl, "\n");

  logger.info("Downloading prebuilt C++ addon for Agora Electron SDK...\n");

  download(downloadUrl, outputDir, {
    strip: 1,
    extract: true
  })
    .then(() => {
      if (no_symbol) {
        if (platform === "darwin") {
          try {
            fs.removeSync("./build/Release/obj.target");
            fs.removeSync("./build/Api");
            fs.removeSync("./build/Renderer");
            fs.removeSync("./build/Utils");

            fs.removeSync("./build/agora_node_ext.target.mk");
            fs.removeSync("./build/AgoraSdk.js");
            fs.removeSync("./build/binding.Makefile");
            fs.removeSync("./build/config.gypi");
            fs.removeSync("./build/gyp-mac-tool");
            fs.removeSync("./build/Makefile");
            fs.removeSync("./build/VideoSource.target.mk");
            fs.removeSync("./build/Release/agora_node_ext.node.dSYM");
            fs.removeSync("./build/Release/VideoSource.dSYM");
          } catch (err) {
            console.log(err);
            logger.info("Warning", "Some files doesn't removed.");
          }
          logger.info("Success", "Download and cleanup finished");
        } else if (platform === "win32") {
          try {
            fs.removeSync("./build/Release/obj");
            fs.removeSync("./build/Api");
            fs.removeSync("./build/Renderer");
            fs.removeSync("./build/Utils");

            fs.removeSync("./build/agora_node_ext.vcxproj");
            fs.removeSync("./build/agora_node_ext.vcxproj.filters");
            fs.removeSync("./build/binding.sln");
            fs.removeSync("./build/config.gypi");
            fs.removeSync("./build/VideoSource.vcxproj");
            fs.removeSync("./build/VideoSource.vcxproj.filters");
            fs.removeSync("./build/AgoraSdk.js");
            fs.removeSync("./build/Release/agora_node_ext.exp");
            fs.removeSync("./build/Release/agora_node_ext.iobj");
            fs.removeSync("./build/Release/agora_node_ext.ipdb");
            fs.removeSync("./build/Release/agora_node_ext.pdb");
            fs.removeSync("./build/Release/VideoSource.iobj");
            fs.removeSync("./build/Release/VideoSource.ipdb");
            fs.removeSync("./build/Release/VideoSource.pdb");
            fs.removeSync("./build/Release/agora_node_ext.ilk");
            fs.removeSync("./build/Release/VideoSource.ilk");
          } catch (err) {
            console.log(err);
            logger.info("Warning", "Some files doesn't removed.");
          }
          logger.info("Success", "Download and cleanup finished");
        }
      } else {
        logger.info("Success", "Download finished");
      }
    })
    .catch(err => {
      logger.error("Failed: ", err);
      throw new Error(err);
    });
};
