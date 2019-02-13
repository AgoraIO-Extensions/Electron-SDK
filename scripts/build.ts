import download from 'download';
import fs from 'fs';
import rimraf from 'rimraf';
import signale from 'signale';
import shell from 'shelljs';

import {
  buildCommand,
  detectElectronVersion,
  detectOS,
  detectOwnVersion,
} from './utils';

const detectEnv = () => {
  // get argv from command line
  const {electron_version, runtime, debug, msvs_version, silent} = require('optimist').argv;
  // get os
  const platform = detectOS();
  // get pkg version
  const { major, minor, patch } = detectOwnVersion();

  // calculate dependent electron version
  const dependentElectronVersion = detectElectronVersion(electron_version);

  // generate build info
  return {
    packageVersion: `${major}.${minor}.${patch}`,
    platform,
    dependentElectronVersion: dependentElectronVersion,
    runtime: runtime || 'electron',
    debug,
    msvs_version,
    silent
  };
};

const main = () => {
  const {
    packageVersion,
    platform,
    dependentElectronVersion,
    runtime,
    debug,
    msvs_version,
    silent
  } = detectEnv();

  // build script
  const script = buildCommand({
    platform, msvs_version, debug, runtime,
    electronVersion: dependentElectronVersion
  });

  console.log(script);

  // print build info
  signale.info('Package Version =', packageVersion);
  signale.info('Platform =', platform);
  signale.info('Dependent Electron Version =', dependentElectronVersion);
  signale.info('Build Runtime =', runtime, '\n');

  // create two stream and start
  const buildStream = shell.exec(script, {
    silent: silent,
    async: true,
  });
  const errLogWriteStream = fs.createWriteStream('error-log.txt', {
    flags: 'a'
  });
  signale.pending('Build C++ addon for Agora Electron SDK...\n');
  buildStream.stderr.on('data', err => {
    errLogWriteStream.write(err, 'utf8');
  });
  buildStream.on('close', code => {
    if (code !== 0) {
      // if failed
      signale.fatal(
        'Failed to build, check complete error log in',
        shell.pwd() + '/error-log.txt\n'
      );
      process.exit(1);
    } else {
      signale.success('Build Complete');
      process.exit(0);
    }
  });
};

main();


