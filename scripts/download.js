const download = require('download')
const path = require('path')
const rimraf = require('rimraf')
const signale = require('signale')

const {
  detectElectronVersion,
  detectOS,
  detectOwnVersion,
} = require('./utils');
const { DependentElectronVersion } = require('./constant')

const buildDownloadInfo = () => {
  // build os label
  const osLabel = detectOS();
  // build version label
  // const { version } = detectOwnVersion();
  const version = '2.3.3-hotfix'
  // build electron dependent label
  const {
    electron_version
  } = require("optimist").argv;
  const dependentElectronVersion = detectElectronVersion(electron_version);

  // generate download url
  return {
    packageVersion: version,
    platform: osLabel,
    dependentElectronVersion: dependentElectronVersion,
    downloadUrl: `http://download.agora.io/sdk/release/Electron-${osLabel}-${version}-${dependentElectronVersion}.zip`
  };
};

const main = () => {
  const {
    packageVersion,
    platform,
    dependentElectronVersion,
    downloadUrl
  } = buildDownloadInfo();
  const outputDir = './build/';
  const removeDir = path.join(__dirname, '../build');
  // rm dir `build`
  rimraf(removeDir, err => {
    if (err) {
      signale.fatal(err);
      process.exit(1);
    }

    // print download info
    signale.info('Package Version =', packageVersion);
    signale.info('Platform =', platform);
    signale.info('Dependent Electron Version =', dependentElectronVersion);
    signale.info('Download Url =', downloadUrl, '\n');

    // start
    signale.pending('Downloading prebuilt C++ addon for Agora Electron SDK...\n');
    download(downloadUrl, outputDir, {
      strip: 1,
      extract: true
    }).then(() => {
      signale.success('Success', 'Download finished');
    }).catch(err => {
      signale.fatal('Failed', err);
    });
  });
};

main();


