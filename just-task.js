const { task, option, logger, argv, series, condition } = require('just-task');
const path = require('path')
const build = require('./scripts/build')
const download = require('./scripts/download')
const switcharch = require('./scripts/switch_arch')
const synclib = require('./scripts/synclib')
const cleanup = require('./scripts/cleanup')
const {getArgvFromNpmEnv, getArgvFromPkgJson} = require('./scripts/npm_argv')

option('electron_version', {default: '5.0.8'});
option('runtime', {default: 'electron', choices: ['electron', 'node']});
option('platform', {default: process.platform, choices: ['darwin', 'win32', 'linux']});
// option('packageVersion');
option('debug', {default: false, boolean: true});
option('silent', {default: false, boolean: true});
option('msvs_version', {default: '2015'});
option('liburl_win', {default: ''});
option('liburl_mac', {default: ''});
option('liburl_mediaPlayer_mac', {default: ''});
option('liburl_mediaPlayer_win', {default: ''});

const packageVersion = require('./package.json').version;

task('switch:arch', () => {
  return switcharch({
    arch: argv().arch,
    // platform: 'win32',
  })
})

task('sync:lib', () => {
  let pkgConfigs = getArgvFromPkgJson()
  let argvConfigs = getArgvFromNpmEnv()
  return synclib({
    platform: argv().platform,
    // platform: 'win32',
    arch: argv().arch,
    libUrl: {
      win: argv().liburl_win || pkgConfigs.lib_sdk_win || argvConfigs.lib_sdk_win,
      mac: argv().liburl_mac || pkgConfigs.lib_sdk_mac || argvConfigs.lib_sdk_mac,
      win64: argv().liburl_win64 || pkgConfigs.lib_sdk_win64 || argvConfigs.lib_sdk_win64,
      mediaPlayer_mac: argv().liburl_mediaPlayer_mac || pkgConfigs.lib_sdk_mediaPlayer_mac,
      mediaPlayer_win: argv().liburl_mediaPlayer_win || pkgConfigs.lib_sdk_mediaPlayer_win,
      mediaPlayer_win64: argv().liburl_mediaPlayer_win64 || pkgConfigs.lib_sdk_mediaPlayer_win64
    },
    downloadKey: pkgConfigs.downloadKey
  })
})

// npm run build:electron -- 
task('build:electron', () => {

  cleanup(path.join(__dirname, "./build")).then(_ => {
    build({
      electronVersion: argv().electron_version, 
      runtime: argv().runtime, 
      platform: argv().platform, 
      packageVersion, 
      debug: argv().debug, 
      silent: argv().silent,
      arch: argv().arch,
      msvsVersion: argv().msvs_version,
      distUrl: argv().dist_url
    })
  })
})
// npm run build:node --
task('build:node', () => {
  build({
    electronVersion: argv().electron_version, 
    runtime: 'node',
    packageVersion,
    platform: argv().platform,
    debug: argv().debug, 
    silent: argv().silent,
    msvsVersion: argv().msvs_version
  })
})
// npm run download --
task('download', () => {
  // work-around
  const addonVersion = '3.2.1-rc.127-build.0601'
  cleanup(path.join(__dirname, "./build")).then(_ => {
    cleanup(path.join(__dirname, './js')).then(_ => {
      download({
        electronVersion: argv().electron_version, 
        platform: argv().platform, 
        packageVersion: addonVersion,
        arch: argv().arch
      })
    })
  })
})
// trigger when run npm install
task('install', () => {
  const config = Object.assign({}, getArgvFromNpmEnv(), getArgvFromPkgJson())
  // work-around
  const addonVersion = '3.2.1-rc.127-build.0601'
  console.log(`Agora:  prebuilt ${config.prebuilt}`)
  if (config.prebuilt) {
    download({
      electronVersion: config.electronVersion, 
      platform: config.platform, 
      packageVersion: addonVersion,
      arch: config.arch,
      no_symbol: config.no_symbol,
    })
  } else {
    return new Promise((resolve, reject) => {
      switcharch({
        arch: argv().arch,
        // platform: 'win32',
      }).then(() => {
        return synclib({
          platform: argv().platform,
          // platform: 'win32',
          arch: argv().arch,
          libUrl: {
            win: argv().liburl_win || config.lib_sdk_win,
            mac: argv().liburl_mac || config.lib_sdk_mac,
            win64: argv().liburl_win64 || config.lib_sdk_win64,
            mediaPlayer_mac: config.lib_sdk_mediaPlayer_mac,
            mediaPlayer_win: config.lib_sdk_mediaPlayer_win,
            mediaPlayer_win64: config.liburl_mediaPlayer_win64
          }
        })
      }).then(() => {
        return build(Object.assign({}, config, {
          packageVersion: addonVersion
        }))
      }).then(() => {
        resolve()
      }).catch(e => {
        reject(e)
      })
    })
  }
})

