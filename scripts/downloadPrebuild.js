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

const normalizePath = (filePath) => filePath.split(path.sep).join('/');

const getDownloadURL = () => {
  let downloadUrl = `https://download.agora.io/sdk/release/Electron-${getOS()}-${packageVersion}-napi.zip`;
  if (platform === 'win32' && arch === 'x64') {
    downloadUrl = `https://download.agora.io/sdk/release/Electron-win64-${packageVersion}-napi.zip`;
  }
  return downloadUrl;
};

const getNativeDownloadURL = () => {
  let downloadUrl = '';
  if (platform === 'win32') {
    downloadUrl = native_sdk_win;
  } else if (platform === 'darwin') {
    downloadUrl = native_sdk_mac;
  }
  return downloadUrl;
};

const matchNativeFile = (path) => {
  let result = false;
  switch (platform) {
    case 'win32':
      switch (arch) {
        case 'ia32':
          result = path.startsWith('sdk/x86/') && path.endsWith('.dll');
          break;
        case 'x64':
          result = path.startsWith('sdk/x86_64/') && path.endsWith('.dll');
          break;
      }
      break;
    case 'darwin':
      result =
        path.startsWith('libs') &&
        /^libs\/.*\.xcframework\/macos-arm64_x86_64\//.test(path);
      break;
  }
  return result;
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
    const nativeLibDir = path.resolve(__dirname, `${buildDir}/Release`);
    await download(nativeDownloadURL, nativeLibDir, {
      strip: 1,
      extract: true,
      filter: (file) => {
        file.path = normalizePath(file.path);
        if (matchNativeFile(file.path)) {
          if (file.type === 'file' && file.path.endsWith('/')) {
            file.type = 'directory';
          }
          switch (platform) {
            case 'win32':
              switch (arch) {
                case 'ia32':
                  file.path = file.path.replace(/^sdk\/x86\//, '');
                  break;
                case 'x64':
                  file.path = file.path.replace(/^sdk\/x86_64\//, '');
                  break;
              }
              break;
            case 'darwin':
              file.path = file.path.replace(
                /^libs\/.*\.xcframework\/macos-arm64_x86_64\//,
                ''
              );
              if (fs.exists(`${nativeLibDir}/${file.path}`)) {
                fs.remove(`${nativeLibDir}/${file.path}`);
              }
              break;
          }
          logger.info(`move native file: ${file.path} → ${nativeLibDir}`);
          return true;
        } else {
          return false;
        }
      },
    });
  }

  if (no_symbol) {
    await removeFileByFilter();
  }
};
