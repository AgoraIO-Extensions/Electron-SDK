const { exec } = require('shelljs');
const getConfig = require('./getConfig');
const logger = require('./logger');
const { getOS } = require('./util');

const { debug, arch } = getConfig();

const build = async (cb) => {
  let scriptStr;
  switch (getOS()) {
    case 'mac':
      scriptStr = debug ? 'build_mac_xcode' : 'build_mac';
      break;
    case 'win32':
      if (arch === 'x64') {
        scriptStr = debug
          ? 'build_windows_x64_debug'
          : 'build_windows_x64_release';
      } else {
        scriptStr = debug
          ? 'build_windows_win32_debug'
          : 'build_windows_win32_release';
      }
      break;
    default:
      break;
  }
  scriptStr = `npm run ${scriptStr}`;
  logger.info(`Will to run: ${scriptStr}`);
  await exec(scriptStr, { silent: false });
  cb();
};

module.exports = build;
