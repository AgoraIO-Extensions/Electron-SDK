import logger from './logger'
import fs from 'fs-extra'
import path from 'path'
import download from 'download'
import extract from 'extract-zip'
import { promisify } from 'util'
import glob from 'glob'
import getArgvFromPkgJson from './getArgvFromPkgJson'
import { getOS, createTmpDir } from './util'
import { destSDKDir, cleanLibsDir } from './clean'

const globPromise = promisify(glob)
const { lib_sdk_win, lib_sdk_mac, downloadKey } = getArgvFromPkgJson()

const syncLib = async (cb) => {
  try {
    const os = getOS()
    await cleanLibsDir()
    const downloadUrl = os === 'mac' ? lib_sdk_mac : lib_sdk_win
    const downloadTmp = await createTmpDir()
    logger.info(`Create temp dir ${downloadTmp}`)
    logger.info(`Downloading ${os} Libs...\n${downloadUrl}`)
    await download(downloadUrl, downloadTmp, {
      filename: 'sdk.zip',
      headers: { 'X-JFrog-Art-Api': downloadKey },
    })

    logger.info('Download Success')
    const zipPath = path.join(downloadTmp, 'sdk.zip')
    await extract(zipPath, {
      dir: downloadTmp,
    })
    logger.info('Unzip Success')
    const filterUnzipsFiles = await globPromise(
      path.join(downloadTmp, '**/libs'),
      {
        ignore: [],
      }
    )
    if (filterUnzipsFiles.length === 0) {
      logger.error("Can't find libs")
      throw new Error("Can't find libs")
    }

    await fs.copy(filterUnzipsFiles[0], destSDKDir)
    logger.info('Move libs finish!')
  } catch (error) {
    logger.error(error)
  }
  cb()
}

export default syncLib
