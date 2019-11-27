const {logger} = require('just-task');
const shell = require("shelljs");

module.exports = ({
  electronVersion='5.0.8',
  runtime='electron',
  platform=process.platform,
  packageVersion,
  debug = false,
  silent = false,
  msvsVersion = '2015',
  arch = 'ia32',
  distUrl = 'https://atom.io/download/electron'
}) => {
  /** get command string */
  const command = ['node-gyp configure'];
  
  // check platform
  if (platform === 'win32') {
      command.push(`--arch=${arch} --msvs_version=${msvsVersion}`)
  }

  // check runtime
  if (runtime === 'electron') {
    command.push(`--target=${electronVersion} --dist-url=${distUrl}`)
  }

  // check debug
  if (debug) {
    command.push('--debug');
    if (platform === 'darwin') {
      // MUST AT THE END OF THE COMMAND ARR
      command.push('-- -f xcode')
    }
  }

  const commandStr = command.join(' ')

  /** start build */
  logger.info(commandStr, '\n');

  logger.info("Package Version:", packageVersion);
  logger.info("Platform:", platform);
  logger.info("Arch:", arch);
  logger.info("Electron Version:", electronVersion);
  logger.info("Runtime:", runtime, "\n");

  logger.info("Build C++ addon for Agora Electron SDK...\n")
  
  shell.exec('node-gyp clean', {silent}, (code, stdout, stderr) => {
    // handle error
    if (code !== 0) {
      logger.error(stderr);
      process.exit(1)
    }

    shell.exec(commandStr, {silent}, (code, stdout, stderr) => {
      // handle error
      if (code !== 0) {
        logger.error(stderr);
        process.exit(1)
      }
  
      if (debug) {
        // handle success
        logger.info('Complete, please go to `/build` and build manually')
        process.exit(0)  
      } else {
        shell.exec('node-gyp build', {silent}, (code, stdout, stderr) => {
          // handle error
          if (code !== 0) {
            logger.error(stderr);
            process.exit(1)
          }
          
          // handle success
          logger.info('Build complete')
          process.exit(0)  
        })
      }
    })
  })
}