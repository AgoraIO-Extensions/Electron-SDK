const { task, option, logger, argv, series, condition } = require('just-task');
const path = require('path')
const build = require('./scripts/build')
const download = require('./scripts/download')
const cleanup = require('./scripts/cleanup')
const {getArgvFromNpmEnv, getArgvFromPkgJson} = require('./scripts/npm_argv')

option('electron_version', {default: '5.0.8'});
option('runtime', {default: 'electron', choices: ['electron', 'node']});
option('platform', {default: process.platform, choices: ['darwin', 'win32']});
// option('packageVersion');
option('debug', {default: false, boolean: true});
option('silent', {default: false, boolean: true});
option('msvs_version', {default: '2015'});

const packageVersion = require('./package.json').version;

// npm run build:electron -- 
task('build:electron', () => {
  build({
    electronVersion: argv().electron_version, 
    runtime: argv().runtime, 
    platform: argv().platform, 
    packageVersion, 
    debug: argv().debug, 
    silent: argv().silent,
    msvsVersion: argv().msvs_version
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
  const addonVersion = '2.3.4.104'
  cleanup(path.join(__dirname, "./build")).then(_ => {
    download({
      electronVersion: argv().electron_version, 
      platform: argv().platform, 
      packageVersion: addonVersion
    })
  })
})
// trigger when run npm install
task('install', () => {
  const config = Object.assign({}, getArgvFromNpmEnv(), getArgvFromPkgJson())
  // work-around
  const addonVersion = '2.3.4.104'
  if (config.prebuilt) {
    download({
      electronVersion: config.electronVersion, 
      platform: config.platform, 
      packageVersion: addonVersion
    })
  } else {
    build(Object.assign({}, config, {
      packageVersion: packageVersion
    }))
  }
})

