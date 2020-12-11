const {logger} = require('just-task');
const shell = require("shelljs");
const path = require('path')
const fs = require('fs')

// workaround to find executable when install as dependency
let gyp_path = `${path.resolve(__dirname, '../../node-gyp/bin/node-gyp.js')}`

if(!fs.existsSync(gyp_path)) {
  logger.info(`gyp_exec not found at ${gyp_path}, switch`)
  gyp_path = `${path.resolve(__dirname, '../node_modules/node-gyp/bin/node-gyp.js')}`
}
const gyp_exec = `node ${gyp_path}`
const agora_node_ext_path = `${path.resolve(__dirname, '../build/Release/agora_node_ext.node')}`
const video_source_path = `${path.resolve(__dirname, '../build/Release/VideoSource')}`

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
    logger.info(`clean done ${stdout}`)
    if (code !== 0) {
      logger.error(stderr);
      process.exit(1)
    }

    shell.exec(commandStr, {silent}, (code, stdout, stderr) => {
      // handle error
      logger.info(`configure done ${stdout}`)
      if (code !== 0) {
        logger.error(stderr);
        process.exit(1)
      }
  
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
          
          if(platform === "darwin") {
            logger.info(`patch loader path for mac build..`)
            shell.exec(`install_name_tool -add_rpath "@loader_path" ${agora_node_ext_path}`, {silent}, (code, stdout, stderr) => {
              if (code !== 0) {
                logger.error(stderr);
                process.exit(1)
              }
  
              shell.exec(`install_name_tool -add_rpath "@loader_path" ${video_source_path}`, {silent}, (code, stdout, stderr) => {
                if (code !== 0) {
                  logger.error(stderr);
                  process.exit(1)
                }
  
                // handle success
                logger.info('Build complete')
                process.exit(0)
              })
            })
          }
        })
      }
    })
  })
}