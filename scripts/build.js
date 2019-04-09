const fs = require("fs");
const signale = require("signale");
const shell = require("shelljs");

const {
  buildCommand,
  detectElectronVersion,
  detectOS,
  detectOwnVersion
} = require("./utils");
const { Platform } = require("./constant");

const detectEnv = () => {
  // get argv from command line
  const {
    electron_version,
    runtime,
    debug,
    msvs_version,
    silent
  } = require("optimist").argv;
  // get os
  const platform = detectOS();
  // get pkg version
  const { major, minor, patch } = detectOwnVersion();

  // calculate dependent electron version
  const dependentElectronVersion = detectElectronVersion(electron_version);

  // generate build info
  return {
    packageVersion: `${major}.${minor}.${patch}`,
    platform,
    dependentElectronVersion: dependentElectronVersion,
    runtime: runtime || "electron",
    debug,
    msvs_version,
    silent
  };
};

const main = () => {
  const {
    packageVersion,
    platform,
    dependentElectronVersion,
    runtime,
    debug,
    msvs_version,
    silent
  } = detectEnv();

  // build script
  const script = buildCommand({
    platform,
    msvs_version,
    debug,
    runtime,
    electronVersion: dependentElectronVersion
  });

  console.log(script);

  // print build info
  signale.info("Package Version =", packageVersion);
  signale.info("Platform =", platform);
  signale.info("Dependent Electron Version =", dependentElectronVersion);
  signale.info("Build Runtime =", runtime, "\n");

  // create two stream and start
  signale.pending("Build C++ addon for Agora Electron SDK...\n");
  const errLogWriteStream = fs.createWriteStream("error-log.txt", {
    flags: "a"
  });
  const buildStream = shell.exec(
    script,
    {
      silent: silent
    },
    (code, stdout, stderr) => {
      if (code !== 0) {
        // failed
        errLogWriteStream.write(stderr, "utf8");
        signale.fatal(
          "Failed to build, check complete error log in",
          shell.pwd() + "/error-log.txt\n"
        );
        process.exit(1);
      } else {
        signale.success("Build Complete");

        // if macos in debug env
        if (platform === Platform.MACOS && debug) {
          // Generate xcode project file
          shell.exec(
            "node-gyp configure -- -f xcode",
            { silent: silent },
            (code, stdout, stderr) => {
              if (code !== 0) {
                signale.fatal("Failed to generate xcode project file");
                process.exit(1);
              } else {
                signale.success("Succeed to generate xcode project file");
                process.exit(0);
              }
            }
          );
        }
        
      }
    }
  );
};

main();
