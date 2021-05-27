import path from "path";
import minimist from "minimist";
import logger from "./logger";

const getArgvFromPkgJson = () => {
  //@ts-ignore
  const projectDir = path.join(process.env.INIT_CWD, "package.json");
  const { agora_electron = {}, version } = require(projectDir);
  const {
    electron_version = "5.0.8",
    prebuilt = true,
    platform = process.platform,
    msvs_version = "2019",
    debug = false,
    silent = false,
    arch = process.arch,
    lib_sdk_win,
    lib_sdk_mac,
    no_symbol = true,
    runtime = "electron",
  } = agora_electron;

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
    downloadKey: agora_electron["JFrog-Art-Api"],
    no_symbol,
    runtime,
  };
};

const getConfig = () => {
  const {
    argv,
    env: {
      npm_config_agora_electron_sdk_pre_built,
      npm_config_agora_electron_version,
      npm_config_agora_electron_sdk_arch,
    },
  } = process;

  const config = minimist(argv.slice(2), {
    boolean: ["prebuilt"],
    default: { ...getArgvFromPkgJson() },
  });

  //argv from ci/npm_config
  if (npm_config_agora_electron_sdk_pre_built !== undefined) {
    config.prebuilt = !!npm_config_agora_electron_sdk_pre_built;
  }
  if (npm_config_agora_electron_version !== undefined) {
    config.electronVersion = npm_config_agora_electron_version;
  }
  if (npm_config_agora_electron_sdk_arch !== undefined) {
    config.arch = npm_config_agora_electron_sdk_arch;
  }
  return config;
};
export default getConfig;
