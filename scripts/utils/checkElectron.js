const semver = require('semver');

const electronDepVersion = process.env.npm_config_agora_electron_dependent;

const getElectronVersion = function() {
  if (!electronDepVersion) {
    // default to use 1.8.3
    return '1.8.3'
  }
  if (semver.gte(electronDepVersion, '4.0.0')) {
    return '4.0.0'
  } else if (semver.gte(electronDepVersion, '3.0.0')) {
    return '3.0.6'
  } else {
    return '1.8.3'
  }
}

module.exports = getElectronVersion;