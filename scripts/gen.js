/**
 * Generate project file. (xcode for mac and vs for windows)
 */

const shell = require('shelljs');
const getPlatform = require('./utils/os')

const generate = () => {
  let platform = getPlatform();
  if (platform === 'mac') {
    shell.echo('Generating project file for mac, this will cost a little time...');
    if (shell.exec('node-gyp configure --target=1.8.3 --dist-url=https://atom.io/download/electron -- -f xcode', { silent: true }).code !== 0) {
      shell.echo('Finished. Find it under "/build".');
    }
  } else if (platform === 'win') {
    shell.echo(
      'Generating project file for win32, this will cost a little time...'
    );
    if (
      shell.exec('node-gyp configure --target=1.8.3 --arch=ia32 --debug --msvs_version=2015 --dist-url=https://atom.io/download/electron', { silent: true })
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