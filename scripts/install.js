const shell = require('shelljs');
const getPlatform = require('./utils/os');
const argv = require('optimist').argv;
const chalk = require('chalk');

const install = () => {
  let platform = getPlatform();
  let electronArgs =
    argv.runtime === 'electron'
      ? ' --target=1.8.3 --dist-url=https://atom.io/download/electron'
      : '';
  if (platform === 'mac') {
    shell.echo(
      chalk.blue('Building AgoraRTC SDK for mac, this will cost a little time...')
    );
    if (shell.exec('node-gyp rebuild' + electronArgs, { silent: true }).code !== 0) {
      shell.echo(chalk.red('Building AgoraRTC SDK for mac failed.'));
    } else {
      shell.echo(chalk.green('Building finished successfully'));
    }
  } else if (platform === 'win') {
    shell.echo(
      chalk.blue(
        'Building AgoraRTC SDK for windows 32bit, this will cost a little time...'
      )
    );
    if (
      shell.exec('node-gyp rebuild --arch=ia32' + electronArgs, { silent: true }).code !==
      0
    ) {
      shell.echo(chalk.red('Building AgoraRTC SDK for window 32bit failed.'));
    } else {
      shell.echo(chalk.green('Building finished successfully'));
    }
  } else {
    shell(chalk.yellowBright('Sorry, this sdk only provide win32 and mac version.'));
    shell.exit(1);
  }
};

install();
