/**
 * Generate project file. (xcode for mac and vs for windows)
 */

const shell = require('shelljs');
const getPlatform = require('./utils/os')

const generate = () => {
  let platform = getPlatform();
  if (platform === 'mac') {
    shell.echo('Generating project file for mac, this will cost a little time...');
    if (shell.exec('node-gyp configure -- -f xcode', { silent: true }).code !== 0) {
      shell.echo('Finished. Find it under "/build".');
    }
  } else if (platform === 'win') {
    shell.echo(
      'Generating project file for win32, this will cost a little time...'
    );
    if (
      shell.exec('node-gyp configure --arch=ia32 --debug', { silent: true })
        .code !== 0
    ) {
      shell.echo('Finshed. Find it under "/build".');
    }
  } else {
    shell.echo('Sorry, this sdk only provide win32 and mac version.');
    shell.exit(1);
  }
};

generate()