/**
 * Building script for node and electron runtime
 */

const shell = require('shelljs');
const getPlatform = require('./utils/os');
const argv = require('optimist').argv;
const chalk = require('chalk');
const ora = require('ora');

const install = () => {
  let platform = getPlatform();
  let electronArgs =
    argv.runtime === 'electron'
      ? ' --target=1.8.3 --dist-url=https://atom.io/download/electron'
      : '';
  let spinner = ora(`Building for production in ${argv.runtime} runtime`);
  let sh = '';

  if (platform === 'mac') {
    sh = 'node-gyp rebuild' + electronArgs;
  } else if (platform === 'win') {
    sh = 'node-gyp rebuild --arch=ia32' + electronArgs;
  } else {
    shell.echo(chalk.red('Sorry, this sdk only provide win32 and mac version.\n'));
    shell.exit(1);
    return false;
  }

  shell.echo('\n');
  spinner.start();

  let builder = shell.exec(sh, { silent: true, async: true });
  builder.stdout.on('data', data => {
    spinner.text = data;
  });
  builder.stderr.on('data', data => {
    shell.ShellString(data).to('error-log.txt');
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
