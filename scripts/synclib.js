import logger from "./logger";
import fs from "fs-extra";
import path from "path";
import download from "download";
import extract from "extract-zip";
import { promisify } from "util";
import glob from "glob";
import getConfig from "./getConfig";
import { getOS, createTmpDir } from "./util";
import { destSDKDir, cleanLibsDir } from "./clean";

const globPromise = promisify(glob);
const { lib_sdk_win, lib_sdk_mac, downloadKey } = getConfig();

const renameForWin = async () => {
  if (getOS() === "mac") {
    return;
  }
  const oldPath = path.join(
    destSDKDir,
    config.arch === "ia32" ? "x86" : "x86_64"
  );
  const newPath = path.join(destSDKDir, "library");
  await fs.rename(oldPath, newPath);
  logger.info("Rename libs finish!");
};
const config = getConfig();
const syncLib = async (cb) => {
  try {
    const os = getOS();
    await cleanLibsDir();
    const downloadUrl = os === "mac" ? lib_sdk_mac : lib_sdk_win;
    const downloadTmp = await createTmpDir();
    logger.info(`Create temp dir ${downloadTmp}`);
    logger.info(`Downloading ${os} Libs...\n${downloadUrl}`);
    await download(downloadUrl, downloadTmp, {
      filename: "sdk.zip",
      headers: { "X-JFrog-Art-Api": downloadKey },
    });

    logger.info("Download Success");
    const zipPath = path.join(downloadTmp, "sdk.zip");
    await extract(zipPath, {
      dir: downloadTmp,
    });
    logger.info("Unzip Success");
    const filterUnzipsFiles = await globPromise(
      path.join(downloadTmp, "**/libs"),
      {
        ignore: [],
      }
    );
    if (filterUnzipsFiles.length === 0) {
      logger.error("Can't find libs");
      throw new Error("Can't find libs");
    }

    await fs.copy(filterUnzipsFiles[0], destSDKDir);
    await fs.remove(downloadTmp);
    logger.info("Move libs finish!");
    await renameForWin();
  } catch (error) {
    logger.error(error);
  }
  cb();
};

export default syncLib;
