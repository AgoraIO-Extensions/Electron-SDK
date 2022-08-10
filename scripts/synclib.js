const { logger } = require('just-task');
const download = require('download');
const extract = require('extract-zip');
const path = require('path');
// const glob = require('glob');
const promisify = require('util').promisify;
const fs = require('fs-extra');
const genOS = require('./genOS');

// const globPromise = promisify(glob);

const extractPromise = async () => {
  return promisify(extract)('./tmp/sdk.zip', {
    dir: path.join(__dirname, '../tmp/'),
  });
};

const macPrepare = async () => {
  fs.removeSync(path.join(__dirname, '../sdk'));
  fs.mkdirsSync(path.join(__dirname, '../sdk/lib/mac'));
  const fileNames = fs
    .readdirSync(
      path.join(__dirname, `../tmp/Agora_Native_SDK_for_Mac_FULL/libs/`)
    )
    .map(fileName => fileName.replace('.xcframework', ''));
  console.log('all framework', fileNames);

  const allTasks = fileNames.map(fileName =>
    fs.move(
      path.join(
        __dirname,
        `../tmp/Agora_Native_SDK_for_Mac_FULL/libs/${fileName}.xcframework/macos-arm64_x86_64/${fileName}.framework`
      ),
      path.join(__dirname, `../sdk/lib/mac/${fileName}.framework`)
    )
  );
  return await Promise.all(allTasks);
};

const winPrepare = arch => {
  fs.removeSync(path.join(__dirname, '../sdk'));
  fs.mkdirsSync(path.join(__dirname, '../sdk/dll'));
  fs.mkdirsSync(path.join(__dirname, '../sdk/lib'));
  fs.moveSync(
    path.join(
      __dirname,
      '../tmp/Agora_Native_SDK_for_Windows_FULL/libs/include'
    ),
    path.join(__dirname, '../sdk/include')
  );

  const dllArchDir = path.join(
    __dirname,
    `../tmp/Agora_Native_SDK_for_Windows_FULL/libs/${arch}/`
  );
  const dllFileNames = fs.readdirSync(dllArchDir);
  console.log('dllFileNames', dllFileNames);

  const allTasks = dllFileNames.map(fileName => {
    const dllOrLib = fileName.includes('.dll') ? 'dll' : 'lib';
    fs.move(
      path.join(
        __dirname,
        `../tmp/Agora_Native_SDK_for_Windows_FULL/libs/${arch}/${fileName}`
      ),
      path.join(__dirname, `../sdk/${dllOrLib}/${fileName}`)
    );
  });

  return Promise.all(allTasks);
};

module.exports = async ({ platform, libUrl, arch = 'ia32', downloadKey }) => {
  const os = genOS();
  let downloadUrl = '';
  if (os === 'mac') {
    if (!libUrl.mac) {
      logger.error(`no macos lib specified`);
      throw new Error('no macos lib specified');
    }
    downloadUrl = libUrl.mac;
  } else {
    if (!libUrl.win) {
      logger.error(`no windows lib specified`);
      throw new Error(`no windows lib specified`);
    }
    downloadUrl = libUrl.win;
  }

  /** start download */
  const outputDir = './tmp/';
  logger.info(`Downloading ${os} Libs...\n${downloadUrl}\n`);
  fs.removeSync(path.join(__dirname, '../tmp'));
  await download(downloadUrl, outputDir, {
    filename: 'sdk.zip',
    headers: { 'X-JFrog-Art-Api': downloadKey },
  });
  logger.info('Success', 'Download finished');

  await extractPromise();
  logger.info('Success', 'Unzip finished');

  if (os === 'mac') {
    await macPrepare();
  } else {
    await winPrepare(arch === 'ia32' ? 'x86' : 'x86_64');
  }
  logger.info('Success', 'Prepare finished');
};
