const { logger } = require("just-task");
const download = require("download");
const extract = require('extract-zip')
const path = require("path");
const glob = require("glob")
const promisify = require("bluebird").promisify
const fs = require("fs-extra")

const extractPromise = promisify(extract)
const macExtractPromise = () => {
  return new Promise((resolve, reject) => {
    extractPromise('./tmp/sdk.zip', {dir: path.join(__dirname, '../tmp/')}).then(() => {
      resolve()
    }).catch((e) => {
      reject(e)
    })
  })
}
const globPromise = promisify(glob)


const macPrepare = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      fs.remove(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk/lib/mac'))
    }).then(async () => {
      const file1 = await globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_*/libs/AgoraRtcKit.framework'))
      await fs.move(
        file1[0],
        path.join(__dirname, '../sdk/lib/mac/AgoraRtcKit.framework')
      );

      const file2 = await globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_*/libs/Agoraffmpeg.framework'))
      await fs.move(
        file2[0],
        path.join(__dirname, '../sdk/lib/mac/Agoraffmpeg.framework')
      )
      return Promise.resolve();
    }).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}

const winPrepare = (folder) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      fs.remove(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './sdk/dll'), path.join(__dirname, '../sdk/dll')),
        fs.move(path.join(folder, './sdk/high_level_api'), path.join(__dirname, '../sdk/high_level_api')),
        fs.move(path.join(folder, './sdk/lib'), path.join(__dirname, '../sdk/lib')),
        fs.move(path.join(folder, './sdk/low_level_api'), path.join(__dirname, '../sdk/low_level_api')),
      ])
    }).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}

const win64Prepare = (folder) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      fs.remove(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './sdk/dll'), path.join(__dirname, '../sdk/dll')),
        fs.move(path.join(folder, './sdk/high_level_api'), path.join(__dirname, '../sdk/high_level_api')),
        fs.move(path.join(folder, './sdk/lib'), path.join(__dirname, '../sdk/lib')),
        fs.move(path.join(folder, './sdk/low_level_api'), path.join(__dirname, '../sdk/low_level_api')),
      ])
    }).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}

module.exports = ({
  platform,
  libUrl,
  arch = "ia32",
  downloadKey
}) => {
  const genOS = () => {
    if (platform === "darwin") {
      return "mac";
    } else if (platform === "win32") {
      return "win32";
    } else {
      // not supported in temp
      logger.error("Unsupported platform!");
      throw new Error("Unsupported platform!");
    }
  };

  return new Promise((resolve, reject) => {
    const os = genOS()
    let downloadUrl;
    if(os === "mac") {
      if(!libUrl.mac){
        logger.error(`no macos lib specified`)
        return reject(new Error(`no macos lib specified`))
      } else {
        downloadUrl = libUrl.mac
      }
    } else {
      if (arch === 'ia32') {
        downloadUrl = libUrl.win
      } else {
        downloadUrl = libUrl.win64
      }
      if(!downloadUrl){
        logger.error(`no windows lib specified`)
        return reject(new Error(`no windows lib specified`))
      }
    }

    /** start download */
    const outputDir = "./tmp/";
    logger.info(`Downloading ${os} Libs...\n${downloadUrl}\n`);

    fs.remove(path.join(__dirname, '../tmp')).then(() => {
      return download(downloadUrl, outputDir, {
        filename: "sdk.zip",
        headers: { "X-JFrog-Art-Api": downloadKey }
      });
    }).then(() => {
      logger.info("Success", "Download finished");
      if(os === "mac") {
        return macExtractPromise()
      } else {
        return extractPromise('./tmp/sdk.zip', {dir: path.join(__dirname, '../tmp/')})
      }
    }).then(() => {
      logger.info("Success", "Unzip finished");
      if(os === "mac") {
        return globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_*/libs/AgoraRtcKit.framework/'))
      } else {
        return globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Windows*/'))
      }
    }).then(folder => {
      if(os === "mac") {
        return macPrepare()
      } else {
        if(arch === 'ia32') {
          return winPrepare(folder[0])
        } else {
          return win64Prepare(folder[0])
        }
      }
    }).then(() => {
      logger.info("Success", "Prepare finished");
      resolve()
    }).catch(err => {
      logger.error("Failed: ", err);
      reject(new Error(err));
    });
  })
};