import logger from './logger'
import download from 'download'
import path from 'path'
import getArgvFromPkgJson from './getArgvFromPkgJson'
import { getOS } from './util'
import { cleanBuildDir, cleanJSDir } from './clean'
import fs from 'fs-extra'

const {
  electronVersion,
  platform,
  packageVersion,
  arch,
  no_symbol,
} = getArgvFromPkgJson()

const workspaceDir = `${path.join(__dirname, '..')}`

const getDownloadURL = () => {
  let downloadUrl = `http://download.agora.io/sdk/release/Electron-${getOS()}-${packageVersion}-${electronVersion}.zip`
  if (platform === 'win32' && arch === 'x64') {
    downloadUrl = `http://download.agora.io/sdk/release/Electron-win64-${packageVersion}-${electronVersion}.zip`
  }
  return downloadUrl
}

const verList = [
  '11.0.0',
  '10.2.0',
  '9.0.0',
  '7.1.2',
  '6.1.7',
  '5.0.8',
  '4.2.8',
  '3.0.6',
  '1.8.3',
]

const macNoSymbolList = [
  './build/Release/obj.target',
  './build/Api',
  './build/Renderer',
  './build/Utils',
  './build/agora_node_ext.target.mk',
  './build/AgoraSdk.js',
  './build/binding.Makefile',
  './build/config.gypi',
  './build/gyp-mac-tool',
  './build/Makefile',
  './build/VideoSource.target.mk',
  './build/Release/agora_node_ext.node.dSYM',
  './build/Release/VideoSource.dSYM',
]

const winNoSymbolList = [
  './build/Release/obj',
  './build/Api',
  './build/Renderer',
  './build/Utils',
  './build/agora_node_ext.vcxproj',
  './build/agora_node_ext.vcxproj.filters',
  './build/binding.sln',
  './build/config.gypi',
  './build/VideoSource.vcxproj',
  './build/VideoSource.vcxproj.filters',
  './build/AgoraSdk.js',
  './build/Release/agora_node_ext.exp',
  './build/Release/agora_node_ext.iobj',
  './build/Release/agora_node_ext.ipdb',
  './build/Release/agora_node_ext.pdb',
  './build/Release/VideoSource.iobj',
  './build/Release/VideoSource.ipdb',
  './build/Release/VideoSource.pdb',
  './build/Release/agora_node_ext.ilk',
  './build/Release/VideoSource.ilk',
]

const removeFileByFilter = async () => {
  const filterList = platform === 'darwin' ? macNoSymbolList : winNoSymbolList

  for (const iterator of filterList) {
    const filePath = `${path.join(workspaceDir, iterator)}`
    await fs.remove(filePath)
  }
  logger.info('Success: Download and cleanup finished')
}
module.exports = async (cb) => {
  cleanBuildDir()
  cleanJSDir()

  if (verList.indexOf(electronVersion) === -1) {
    const errStr = `Prebuilt addon only supported electron version ${verList.reduce(
      (str1, str2) => `${str1}, ${str2}`
    )}`
    logger.error(errStr)
    throw new Error(errStr)
  }

  const downloadUrl = getDownloadURL()

  /** start download */
  logger.info('Package Version: %s', packageVersion)
  logger.info('Platform: %s', platform)
  if (arch) logger.info('Arch: %s', arch)
  logger.info('Electron Version: %s', electronVersion)
  logger.info('Download URL  %s ', downloadUrl)

  logger.info('Downloading prebuilt C++ addon for Agora Electron SDK...')

  await download(downloadUrl, workspaceDir, {
    extract: true,
  })
  if (no_symbol) {
    await removeFileByFilter()
  }
}
