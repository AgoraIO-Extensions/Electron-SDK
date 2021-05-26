import logger from './logger'
import fs from 'fs-extra'
import path from 'path'
import { exec } from 'shelljs'

let gyp_path = `${path.resolve(__dirname, '../../node-gyp/bin/node-gyp.js')}`

if (!fs.existsSync(gyp_path)) {
  logger.info(`gyp_exec not found at ${gyp_path}, switch`)
  gyp_path = `${path.resolve(
    __dirname,
    '../node_modules/node-gyp/bin/node-gyp.js'
  )}`
}
const gyp_exec = `node ${gyp_path}`
const agora_node_ext_path = `${path.resolve(
  __dirname,
  '../build/Release/agora_node_ext.node'
)}`
const video_source_path = `${path.resolve(
  __dirname,
  '../build/Release/VideoSource'
)}`

const configWin = (command, { arch, msvsVersion }) => {
  logger.info(`Agora VS:${msvsVersion}`)
  command.push(`--arch=${arch} --msvs_version=${msvsVersion}`)
}
const configMac = (command, { arch, debug }) => {
  if (arch === 'arm64') {
    command.push('--arch=arm64')
  }
  if (debug) {
    command.push('--debug')
    // MUST AT THE END OF THE COMMAND ARR
    command.push('-- -f xcode')
  }
}

const build = async (
  cb,
  {
    electronVersion,
    runtime,
    platform,
    packageVersion,
    debug,
    silent,
    msvsVersion,
    arch,
    distUrl,
  }
) => {
  const commandArray = []
  /** get command string */
  const command = [`${gyp_exec} configure`]
  // check platform
  platform === 'darwin'
    ? configMac(command, { arch, debug })
    : configWin(command, { arch, msvsVersion })
  // check runtime
  if (runtime === 'electron') {
    command.push(`--target=${electronVersion} --dist-url=${distUrl}`)
  }
  const commandStr = command.join(' ')
  /** start build */
  logger.info('Package Version: %s', packageVersion)
  logger.info('Platform: %s', platform)
  logger.info('Electron Version: %s', electronVersion)
  logger.info('Runtime: %s', runtime)
  logger.info('Build C++ addon for Agora Electron SDK...')

  commandArray.push(`${gyp_exec} clean`)
  commandArray.push(commandStr)
  commandArray.push(`${gyp_exec} build`)
  if (platform === 'darwin') {
    commandArray.push(
      `install_name_tool -add_rpath "@loader_path" ${agora_node_ext_path}`
    )
    commandArray.push(
      `install_name_tool -add_rpath "@loader_path" ${video_source_path}`
    )
  }
  for (let index = 0; index < commandArray.length; index++) {
    const shellStr = commandArray[index]
    logger.info('Will to call %s', shellStr)
    const { code, stderr } = await exec(shellStr, { silent })
    if (code !== 0) {
      logger.error(stderr)
      cb()
      return
    }
  }
  logger.info('Build complete')
  cb()
}

export default build
