const path = require('path');
const download = require('download');
const fs = require('fs-extra');
const { getOS } = require('./util');
const logger = require('./logger');
const { cleanBuildDir, cleanJSDir, buildDir } = require('./clean');
const getConfig = require('./getConfig');

const { platform, packageVersion, arch, no_symbol } = getConfig();

const workspaceDir = `${path.join(__dirname, '..')}`;

const getDownloadURL = () => {
  let downloadUrl = `http://download.agora.io/sdk/release/Electron-${getOS()}-${packageVersion}-napi.zip`;
  if (platform === 'win32' && arch === 'x64') {
    downloadUrl = `http://download.agora.io/sdk/release/Electron-win64-${packageVersion}-napi.zip`;
  }
  return downloadUrl;
};

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
];

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
];

const removeFileByFilter = async () => {
  const filterList = platform === 'darwin' ? macNoSymbolList : winNoSymbolList;

  for (const iterator of filterList) {
    const filePath = `${path.join(workspaceDir, iterator)}`;
    await fs.remove(filePath);
  }
  logger.info('Success: Download and cleanup finished');
};

module.exports = async (cb) => {
  await cleanBuildDir();
  // cleanJSDir();

  const downloadUrl = getDownloadURL();

  /** start download */
  logger.info('Package Version: %s', packageVersion);
  logger.info('Platform: %s', platform);
  if (arch) logger.info('Arch: %s', arch);
  logger.info('Download URL  %s ', downloadUrl);

  logger.info('Downloading prebuilt C++ addon for Agora Electron SDK...');
  try {
    await download(downloadUrl, buildDir, {
      strip: 1,
      extract: true,
    });
  } catch (error) {
    logger.error('Agora sdk download base sdk error', error);
  }

  if (no_symbol) {
    await removeFileByFilter();
  }
};
