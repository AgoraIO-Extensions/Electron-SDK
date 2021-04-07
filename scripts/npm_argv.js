const path = require('path')

module.exports.getArgvFromNpmEnv = () => {
  return {
    electronVersion: process.env.npm_config_agora_electron_dependent,
    prebuilt: process.env.npm_config_agora_electron_prebuilt === 'false' ? false : true ,
    platform: process.env.npm_config_agora_electron_platform,
    msvsVersion: process.env.npm_config_agora_electron_msvs_version,
    debug: process.env.npm_config_agora_electron_debug === 'true',
    silent: process.env.npm_config_agora_electron_silent === 'true',
    arch: process.env.npm_config_agora_electron_arch,
    lib_sdk_win: process.env.npm_package_config_lib_sdk_win,
    lib_sdk_win64: process.env.npm_package_config_lib_sdk_win64,
    lib_sdk_mac: process.env.npm_package_config_lib_sdk_mac
  }
}

module.exports.getArgvFromPkgJson = () => {
  const projectDir = path.join(process.env.INIT_CWD, 'package.json')
  const pkgMeta = require(projectDir);
  if (pkgMeta.agora_electron) {
    let config = {
      electronVersion: pkgMeta.agora_electron.electron_version,
      prebuilt: pkgMeta.agora_electron.prebuilt === false ? false : true,
      platform: pkgMeta.agora_electron.platform,
      msvsVersion: pkgMeta.agora_electron.msvs_version,
      debug: pkgMeta.agora_electron.debug === true,
      silent: pkgMeta.agora_electron.silent === true,
      arch: pkgMeta.agora_electron.arch,
      lib_sdk_win: pkgMeta.agora_electron.lib_sdk_win,
      lib_sdk_win64: pkgMeta.agora_electron.lib_sdk_win64,
      lib_sdk_mac: pkgMeta.agora_electron.lib_sdk_mac,
      no_symbol: pkgMeta.agora_electron.no_symbol === false ? false : true,
      downloadKey: pkgMeta.agora_electron["JFrog-Art-Api"]
    }
    return config
  } else {
    return {
      prebuilt: true
    }
  }
}