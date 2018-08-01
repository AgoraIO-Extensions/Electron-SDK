const chalk = require('chalk');
const download = require('download');
const ora = require('ora');
const path = require('path')
const rimraf = require('rimraf');
const shell = require('shelljs');

// const checkVersion = require('./utils/checkVersion');
const getPlatform = require('./utils/os');
const pkg = require('../package.json');

const getUrl = (platform, version) => {
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
  return `http://download.agora.io/sdk/release/Agora_RTC_Electron_SDK_for_${platformLabel}_${version}.zip`;
};

const platform = getPlatform();
const url = getUrl(platform, 'v2_0_7');
const outputDir = './build/Release/';

rimraf(path.join(__dirname, '../build'), (err) => {
  if(err) {
    throw new Error(err)
  } else {
    let spinner = ora(`Downloading built C++ addon for Agora Electron SDK...`);
    shell.echo('\n');
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

// checkVersion(url, function(rst) {
//   if (!rst) {
//     let spinner = ora(`Downloading built C++ addon for Agora Electron SDK...`);
//     shell.echo('\n');
//     spinner.start();
//     download(url, outputDir, {
//       strip: 1,
//       extract: true
//     })
//       .then(_ => {
//         spinner.succeed(chalk.green('Download finished.\n'));
//       })
//       .catch(err => {
//         spinner.fail(chalk.red('Download failed.\n'));
//         shell.echo(chalk.red(err));
//       });
//   } else {
//     shell.echo(chalk.green('Already download.\n'));
//   }
// });
