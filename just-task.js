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
option('platform', {default: process.platform, choices: ['darwin', 'win32']});
// option('packageVersion');
option('debug', {default: false, boolean: true});
option('silent', {default: false, boolean: true});
option('msvs_version', {default: '2015'});
option('liburl_win', {default: ''});
option('liburl_mac', {default: ''});

const packageVersion = require('./package.json').version;

task('switch:arch', () => {
  return switcharch({
    arch: argv().arch,
    // platform: 'win32',
  })
})

task('sync:lib', () => {
  const config = Object.assign({}, getArgvFromPkgJson(), getArgvFromNpmEnv() )
  return synclib({
    platform: argv().platform,
    // platform: 'win32',
    arch: argv().arch,
    libUrl: {
      win: argv().liburl_win || config.libUrl.win,
      mac: argv().liburl_mac || config.libUrl.mac,
      win64: argv().liburl_win64 || config.libUrl.win64
    }
  })
})

// npm run build:electron -- 
task('build:electron', () => {
  build({
    electronVersion: argv().electron_version, 
    runtime: argv().runtime, 
    platform: argv().platform, 
    packageVersion, 
    debug: argv().debug, 
    silent: argv().silent,
    msvsVersion: argv().msvs_version,
    arch: argv().arch,
    distUrl: argv().distUrl
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
  const config = Object.assign({}, getArgvFromNpmEnv(), getArgvFromPkgJson())
  // work-around
  const addonVersion = '2.8.2-hotfix.8'
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
  const addonVersion = '2.8.2-hotfix.8'
  if (config.prebuilt) {
    download({
      electronVersion: config.electronVersion, 
      platform: config.platform, 
      packageVersion: addonVersion,
      arch: config.arch
    })
  } else {
    build(Object.assign({}, config, {
      packageVersion: addonVersion
    }))
  }
})

