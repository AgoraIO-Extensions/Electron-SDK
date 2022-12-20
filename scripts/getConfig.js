const minimist = require('minimist');
const path = require('path');
const logger = require('./logger');

//@ts-ignore
const { INIT_CWD } = minimist(process.argv.slice(2), {
  string: ['INIT_CWD'],
  default: {},
});
logger.info(`pass INIT_CWD ${INIT_CWD}`);
logger.info(`process.env.INIT_CWD  ${process.env.INIT_CWD}`);

const getArgvFromPkgJson = () => {
  const projectDir = path.join(INIT_CWD, 'package.json');
  const { agora_electron = {} } = require(projectDir);
  const { version } = require(path.join(process.env.INIT_CWD, 'package.json'));
  const {
    prebuilt = true,
    platform = process.platform,
    debug = false,
    silent = false,
    arch = process.arch,
    no_symbol = true,
  } = agora_electron;

  return {
    ...agora_electron,
    packageVersion: version,
    platform,
    prebuilt: !!prebuilt,
    debug: !!debug,
    silent: !!silent,
    arch,
    no_symbol,
  };
};

const getConfig = () => {
  const {
    argv,
    env: {
      npm_config_agora_electron_sdk_pre_built,
      npm_config_agora_electron_sdk_platform,
      npm_config_agora_electron_sdk_arch,
    },
  } = process;

  let config = minimist(argv.slice(2), {
    boolean: ['prebuilt', 'debug', 'silent', 'no_symbol'],
    string: ['arch', 'platform'],
    default: { ...getArgvFromPkgJson() },
  });

  //argv from ci/npm_config
  if (npm_config_agora_electron_sdk_pre_built) {
    config.prebuilt = !!JSON.parse(npm_config_agora_electron_sdk_pre_built);
  }

  if (npm_config_agora_electron_sdk_platform !== undefined) {
    config.platform = npm_config_agora_electron_sdk_platform;
  }

  if (npm_config_agora_electron_sdk_arch !== undefined) {
    config.arch = npm_config_agora_electron_sdk_arch;
  }
  return config;
};
module.exports = getConfig;
