/**
 * Utils for command line tools
 */
const semver = require('semver')

const { Platform, DependentElectronVersion } = require('./constant')

module.exports.detectOS = () => {
  const platform = process.platform;
  switch (platform) {
    case 'darwin':
      return Platform.MACOS;
    case 'win32':
      return Platform.WINDOWS;
    default:
      return Platform.UNSUPPORTED;
  }
};

module.exports.detectElectronVersion = (specifiedElectronVersion) => {
  const electronVersion = specifiedElectronVersion || process.env.npm_config_agora_electron_dependent;

  if (!electronVersion) {
    return DependentElectronVersion.ORIGIN;
  }

  if (semver.gte(electronVersion, DependentElectronVersion.LATEST)) {
    return DependentElectronVersion.LATEST;
  } else if (semver.gte(electronVersion, DependentElectronVersion.STABLE)) {
    return DependentElectronVersion.STABLE;
  } else {
    return DependentElectronVersion.ORIGIN;
  }
};

module.exports.buildCommand = ({
  platform,
  msvs_version,
  debug,
  runtime,
  electronVersion,
}) => {
  const args = ['node-gyp rebuild'];

  // platform
  if (platform === Platform.WINDOWS) {
    args.push(`--arch=ia32 --msvs_version=${msvs_version || '2015'}`);
  }

  if (debug) {
    args.push('--debug');
  }

  if (runtime === 'electron') {
    args.push(`--target=${electronVersion} --dist-url=https://atom.io/download/electron`);
  }

  return args.join(' ');
};

module.exports.detectOwnVersion = () => {
  const pkg = require('../package.json');
  const { major, minor, patch } = semver.coerce(pkg.version);
  return {
    major, minor, patch
  };
};

