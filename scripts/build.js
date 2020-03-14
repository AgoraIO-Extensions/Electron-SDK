const {logger} = require('just-task');
const shell = require("shelljs");
const path = require('path')

const gyp_exec = path.resolve(__dirname, '../node_modules/node-gyp/bin/node-gyp.js')

module.exports = ({
  electronVersion='5.0.8',
  runtime='electron',
  platform=process.platform,
  packageVersion,
  debug = false,
  silent = false,
  msvsVersion = '2015',
  arch = 'ia32',
  distUrl = 'https://electronjs.org/headers'
}) => {
  /** get command string */
  const command = [`${gyp_exec} configure`];
  
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
  logger.info("Electron Version:", electronVersion);
  logger.info("Runtime:", runtime, "\n");

  logger.info("Build C++ addon for Agora Electron SDK...\n")
  
  shell.exec(`${gyp_exec} clean`, {silent}, (code, stdout, stderr) => {
    // handle error
    if (code !== 0) {
      logger.error(stderr);
      process.exit(1)
    }
    logger.info(`clean done`)

    shell.exec(commandStr, {silent}, (code, stdout, stderr) => {
      // handle error
      if (code !== 0) {
        logger.error(stderr);
        process.exit(1)
      }
      logger.info(`configure done`)
  
      if (debug) {
        // handle success
        logger.info('Complete, please go to `/build` and build manually')
        process.exit(0)  
      } else {
        shell.exec(`${gyp_exec} build`, {silent}, (code, stdout, stderr) => {
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