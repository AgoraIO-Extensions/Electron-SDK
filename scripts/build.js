/**
 * Building script for node and electron runtime
 */

const shell = require('shelljs');
const argv = require('optimist').argv;
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');

const getPlatform = require('./utils/os');
const getElectronVersion = require('./utils/checkElectron');

const install = () => {
  let platform = getPlatform();
  let electronVersion = argv.electronDep || getElectronVersion();
  // if built for electron runtime
  let electronArgs =
    argv.runtime === 'electron'
      ? ` --target=${electronVersion} --dist-url=https://atom.io/download/electron`
      : '';

  // check platform and generate command to execute
  let sh = '';
  if (platform === 'mac') {
    sh = 'node-gyp rebuild' + electronArgs;
  } else if (platform === 'win') {
    sh = 'node-gyp rebuild --arch=ia32 --msvs_version=2015' + electronArgs;
  } else {
    shell.echo(chalk.red('Sorry, this sdk only provide win32 and mac version.\n'));
    shell.exit(1);
    return false;
  }

  // log built info
  argv.runtime === 'electron' && shell.echo(chalk.blue(`Dependent Electron Version: ${electronVersion}`))
  shell.echo(chalk.blue(`Platform: ${platform}`))
  shell.echo('\n');

  let spinner = ora(`Building for production in ${argv.runtime} runtime`);
  spinner.start();

  // exec shell and write log
  let builder = shell.exec(sh, { silent: true, async: true });
  let logWriter = fs.createWriteStream('error-log.txt', {
    flags: 'a',

  })
  builder.stdout.on('data', data => {
    spinner.text = data;
  });
  builder.stderr.on('data', data => {
    logWriter.write(data, 'utf8')
  });
  builder.on('close', code => {
    if (code !== 0) {
      // Failed to build
      spinner.fail(chalk.red('Build failed'));
      shell.echo('A complete log of this run can be found in:');
      shell.echo('    ' + shell.pwd() + '/error-log.txt\n');
    } else {
      spinner.succeed(chalk.green('Build complete\n'));
    }
  });
};

install();
