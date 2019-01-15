const chalk = require('chalk');
const download = require('download');
const ora = require('ora');
const path = require('path')
const rimraf = require('rimraf');
const shell = require('shelljs');
const semver = require('semver');

const pkg = require('../package.json');
const getPlatform = require('./utils/os');
const getElectronVersion = require('./utils/checkElectron');

const getUrl = () => {
  // get platform label
  let platform = getPlatform()
  let platformLabel = '';
  if (platform === 'mac') {
    platformLabel = 'Mac';
  } else if (platform === 'win') {
    platformLabel = 'Windows';
  } else {
    shell.echo(chalk.red('Sorry, this sdk only provide win32 and mac version.'));
    shell.exit(1);
    return false;
  }

  // get version label
  let version = semver.coerce(pkg.version);
  let versionLabel = `v${version.major}_${version.minor}_${version.patch}`

  // get electron dep
  let electronDep = getElectronVersion()
  let electronDepLabel = (function() {
    switch(electronDep) {
      default:
      case '1.8.3':
        return 'e2';
      case '3.0.6':
        return 'e3';
      case '4.0.0':
        return 'e4';  
    }
  })();

  let url = `http://download.agora.io/sdk/release/Agora_RTC_Electron_SDK_for_${platformLabel}_${versionLabel}_${'e3'}.zip`
  
  // log download info
  shell.echo(chalk.blue(`Package Version: ${version.version}`));
  shell.echo(chalk.blue(`Platform: ${platformLabel}`));
  shell.echo(chalk.blue(`Dependent Electron Version: ${electronDep}`));
  shell.echo(chalk.blue(`Download Url: ${url}`))
  shell.echo('\n');

  return url;
};

const url = getUrl();
const outputDir = './build/Release/';

rimraf(path.join(__dirname, '../build'), (err) => {
  if(err) {
    throw new Error(err)
  } else {
    let spinner = ora(`Downloading built C++ addon for Agora Electron SDK...`);
    spinner.start();
    download(url, outputDir, {
      strip: 1,
      extract: true
    })
      .then(_ => {
        spinner.succeed(chalk.green('Download finished.\n'));
      })
      .catch(err => {
        spinner.fail(chalk.red('Download failed.\n'));
        shell.echo(chalk.red(err));
      });
  }
});
