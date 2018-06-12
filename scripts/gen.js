/**
 * Generate project file. (xcode for mac and vs for windows)
 */

const shell = require('shelljs');
const getPlatform = require('./utils/os');
const chalk = require('chalk');

const generate = () => {
  let platform = getPlatform();
  if (platform === 'mac') {
    shell.echo(
      chalk.blue('Generating project file for mac, this will cost a little time...')
    );
    if (
      shell.exec(
        'node-gyp configure --target=1.8.3 --dist-url=https://atom.io/download/electron -- -f xcode ',
        { silent: true }
      ).code !== 0
    ) {
      shell.echo(chalk.red('Failed to generate project file.'));
    } else {
      shell.echo(chalk.green('Generating finished successfully'));
    }
  } else if (platform === 'win') {
    shell.echo(
      chalk.blue('Generating project file for win32, this will cost a little time...')
    );
    if (
      shell.exec(
        'node-gyp configure --target=1.8.3 --dist-url=https://atom.io/download/electron --arch=ia32 --debug',
        { silent: true }
      ).code !== 0
    ) {
      shell.echo(chalk.red('Failed to generate project file".'));
    } else {
      shell.echo(chalk.green('Generating finished successfully'));
    }
  } else {
    shell.echo(chalk.yellowBright('Sorry, this sdk only provide win32 and mac version.'));
    shell.exit(1);
  }
};

generate();
