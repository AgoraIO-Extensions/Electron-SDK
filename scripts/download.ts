import download from 'download';
import path from 'path';
import rimraf from 'rimraf';
import signale from 'signale';

import {
  detectElectronVersion,
  detectOS,
  detectOwnVersion,
} from './utils';
import { DependentElectronVersion } from './constant';

const buildDownloadInfo = () => {
  // build os label
  const osLabel = detectOS();
  // build version label
  const { major, minor, patch } = detectOwnVersion();
  const versionLabel = `v${major}_${minor}_${patch}`;
  // build electron dependent label
  const dependentElectronVersion = detectElectronVersion();
  const electronLabel = ((version) => {
    if (version === DependentElectronVersion.ORIGIN) {
      return 'e2';
    } else if (version === DependentElectronVersion.STABLE) {
      return 'e3';
    } else if (version === DependentElectronVersion.LATEST) {
      return 'e4';
    }
  })(dependentElectronVersion);

  // generate download url
  return {
    packageVersion: `${major}.${minor}.${patch}`,
    platform: osLabel,
    dependentElectronVersion: dependentElectronVersion,
    downloadUrl: `http://download.agora.io/sdk/release/Agora_RTC_Electron_SDK_for_${osLabel}_${versionLabel}_${electronLabel}.zip`
  };
};

const main = () => {
  const {
    packageVersion,
    platform,
    dependentElectronVersion,
    downloadUrl
  } = buildDownloadInfo();
  const outputDir = './build/Release/';
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


