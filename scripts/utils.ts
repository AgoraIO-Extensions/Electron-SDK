/**
 * Utils for command line tools
 */
import semver from 'semver';

import { Platform, DependentElectronVersion } from './constant';

export const detectOS = (): Platform => {
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

export const detectElectronVersion = (specifiedElectronVersion?: string): DependentElectronVersion => {
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

export const buildCommand = (config: {
  platform: Platform,
  msvs_version?: string,
  debug: boolean,
  runtime: 'node' | 'electron',
  electronVersion: DependentElectronVersion,
}): string => {
  const args = ['node-gyp rebuild'];

  // platform
  if (config.platform === Platform.WINDOWS) {
    args.push(`--arch=ia32 --msvs_version=${config.msvs_version || '2015'}`);
  }

  if (config.debug) {
    args.push('--debug');
  }

  if (config.runtime === 'electron') {
    args.push(`--target=${config.electronVersion} --dist-url=https://atom.io/download/electron`);
  }

  return args.join(' ');
};

export const detectOwnVersion = () => {
  const pkg = require('../package.json');
  const { major, minor, patch } = semver.coerce(pkg.version);
  return {
    major, minor, patch
  };
};

