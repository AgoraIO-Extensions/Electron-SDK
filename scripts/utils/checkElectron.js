const semver = require('semver');

const electronDepVersion = process.env.npm_package_dependencies_electron || process.env.npm_package_devDependencies_electron;

const getElectronVersion = function() {
  if (!electronDepVersion) {
    // default to use 1.8.3
    return '1.8.3'
  }
  if (semver.gt(electronDepVersion, '3.0.0')) {
    return '3.0.6'
  } else {
    return '1.8.3'
  }
}

module.exports = getElectronVersion;