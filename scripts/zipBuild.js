const path = require('path');

const { exec } = require('shelljs');

const logger = require('./logger');
const { getOS } = require('./util');
const fs = require('fs');


const keepList = [
  'AgoraRtcWrapper',
  'agora_node_ext'
];

const filesMove = (src, dest, keepList) => {
  fs.readdirSync(src).forEach(file => {
    const filePath = path.join(src, file);
    const shouldKeep = keepList.some(pattern => file.includes(pattern));
    if (!shouldKeep) {
      const destPath = path.join(dest, file);
      fs.renameSync(filePath, destPath);
    }
  });
};

const zipBuild = async () => {
  const temp_native = path.join(__dirname, '..', 'build', 'temp_native');
  const build_release = path.join(__dirname, '..', 'build', 'Release');
  fs.mkdirSync(temp_native);
  filesMove(build_release, temp_native, keepList);

  const isMac = getOS() === 'mac';
  const fileListStr = ` build${path.sep}Release js types package.json`;
  const shellStr =
    (isMac ? 'zip -ry electron.zip' : '7z a electron.zip') + fileListStr;
  const { code, stderr } = await exec(shellStr);
  if (code !== 0) {
    logger.error(stderr);
  }
  filesMove(temp_native, build_release, []);
  fs.rmdirSync(temp_native, { recursive: true });
};

module.exports = zipBuild;
