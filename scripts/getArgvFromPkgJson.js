import path from 'path'
const getArgvFromPkgJson = () => {
  //@ts-ignore
  const projectDir = path.join(process.env.INIT_CWD, 'package.json')
  const { agora_electron = {}, version } = require(projectDir)
  const {
    electron_version = '5.0.8',
    prebuilt = true,
    platform = process.platform,
    msvs_version = '2019',
    debug = false,
    silent = false,
    arch = process.arch,
    lib_sdk_win,
    lib_sdk_mac,
    no_symbol = true,
    runtime = 'electron',
  } = agora_electron

  return {
    packageVersion: version,
    electronVersion: electron_version,
    platform,
    msvsVersion: msvs_version,
    prebuilt: !!prebuilt,
    debug: !!debug,
    silent: !!silent,
    arch,
    lib_sdk_win,
    lib_sdk_mac,
    downloadKey: agora_electron['JFrog-Art-Api'],
    no_symbol,
    runtime,
  }
}

export default getArgvFromPkgJson
