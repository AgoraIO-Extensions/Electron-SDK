/**
 * Generate project file and release in debug mode. (xcode for mac and vs for windows)
 */

const shell = require('shelljs');
const getPlatform = require('./utils/os');
const chalk = require('chalk');
const ora = require('ora');

const generate = () => {
  let platform = getPlatform();
  let spinner = ora('Building for debug');
  let sh = '';

  if (platform === 'mac') {
    sh =
      'node-gyp rebuild --target=1.8.3 --dist-url=https://atom.io/download/electron --debug';
  } else if (platform === 'win') {
    sh =
      'node-gyp rebuild --target=1.8.3 --dist-url=https://atom.io/download/electron --arch=ia32 --debug';
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
      spinner.succeed(chalk.green('Build complete'));
      if (platform === 'mac') {
        // Generate xcode project file
        let anotherSpinner = ora('Generating project file...').start();
        if (shell.exec('node-gyp configure -- -f xcode', { silent: true }).code !== 0) {
          anotherSpinner.fail(chalk.red('Generate failed'));
        } else {
          anotherSpinner.succeed(chalk.green('Generate complete'));
          shell.echo(
            chalk.green(
              'Now you can find binding.xcodeproj and sdk for debug env under ./build\n'
            )
          );
        }
      } else {
        shell.echo(
          chalk.green(
            'Now you can find vs project file and sdk for debug env under ./build\n'
          )
        );
      }
    }
  });
};

generate();
