const path = require('path');

const download = require('download');
const fs = require('fs-extra');

const { cleanDir, buildDir } = require('./clean');
const getConfig = require('./getConfig');
const logger = require('./logger');
const { getOS } = require('./util');

const {
  platform,
  packageVersion,
  arch,
  no_symbol,
  native_sdk_mac,
  native_sdk_win,
} = getConfig();

const workspaceDir = `${path.join(__dirname, '..')}`;

const getDownloadURL = () => {
  let downloadUrl = `https://download.agora.io/sdk/release/Electron-${getOS()}-${packageVersion}-napi.zip`;
  if (platform === 'win32' && arch === 'x64') {
    downloadUrl = `https://download.agora.io/sdk/release/Electron-win64-${packageVersion}-napi.zip`;
  }
  return downloadUrl;
};

const getNativeDownloadURL = () => {
  let downloadUrl = '';
  if (platform === 'win32' && arch === 'x64') {
    downloadUrl = native_sdk_win;
  } else if (platform === 'darwin') {
    downloadUrl = native_sdk_mac;
  }
  return downloadUrl;
};

const matchNativeFile = (path) => {
  if (platform === 'win32' && arch === 'ia32') {
    return /^sdk\/x86\/.*\.dll$/.test(path);
  } else if (platform === 'win32' && arch === 'x64') {
    return /^sdk\/x86_64\/.*\.dll$/.test(path);
  } else if (platform === 'darwin') {
    return /^libs\/.*\.xcframework\/macos-arm64_x86_64\/.*\.framework$/.test(
      path
    );
  }
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

module.exports = async () => {
  await cleanDir(buildDir);

  const downloadUrl = getDownloadURL();
  const nativeDownloadURL = getNativeDownloadURL();

  /** start download */
  logger.info('Package Version: %s', packageVersion);
  logger.info('Platform: %s', platform);
  if (arch) logger.info('Arch: %s', arch);
  logger.info('Download URL  %s ', downloadUrl);

  logger.info('Downloading prebuilt C++ addon for Agora Electron SDK...');
  await download(downloadUrl, buildDir, {
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

  if (nativeDownloadURL) {
    logger.info('Native SDK URL  %s ', nativeDownloadURL);
    logger.info('Downloading native SDK for Agora Electron SDK...');
    await download(nativeDownloadURL, `${buildDir}/Release`, {
      strip: 1,
      extract: true,
      filter: (file) => {
        return (
          file.type !== 'directory' &&
          matchNativeFile(file.path) &&
          !file.path.endsWith(path.sep) &&
          file.data.length !== 0
        );
      },
    });
  }

  if (no_symbol) {
    await removeFileByFilter();
  }
};
