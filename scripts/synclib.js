const { logger } = require("just-task");
const download = require("download");
const extract = require('extract-zip')
const path = require("path");
const glob = require("glob")
const promisify = require("bluebird").promisify
const fs = require("fs")
const rimraf = require("rimraf");
const mkdirp = require('mkdirp');

const extractPromise = promisify(extract)
const globPromise = promisify(glob)
const rmdirPromise = (filePath) => {
  return new Promise((resolve) => {
    rimraf(filePath, (err) => {
      err && logger.warn(err.message)
      resolve()
    })
  })
}

const mvPromise = promisify(fs.rename)
const mkdirPromise = promisify(mkdirp)

const macPrepare = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      rmdirPromise(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return mkdirPromise(path.join(__dirname, '../sdk/lib/mac'))
    }).then(() => {
      return mvPromise(
        path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcEngineKit.framework/'),
        path.join(__dirname, '../sdk/lib/mac/AgoraRtcEngineKit.framework/')
      )
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
      rmdirPromise(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return mkdirPromise(path.join(__dirname, '../sdk/lib'))
    }).then(() => {
      return Promise.all([
        mvPromise(path.join(folder, './sdk/include'), path.join(__dirname, '../sdk/include')),
        mvPromise(path.join(folder, './sdk/dll'), path.join(__dirname, '../sdk/dll')),
        mvPromise(path.join(folder, './sdk/lib'), path.join(__dirname, '../sdk/lib/win')),
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
  libUrl
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
      if(!libUrl.win){
        logger.error(`no windows lib specified`)
        return reject(new Error(`no windows lib specified`))
      } else {
        downloadUrl = libUrl.win
      }
    }

    /** start download */
    const outputDir = "./tmp/";
    logger.info(`Downloading ${os} Libs...\n${downloadUrl}\n`);

    rmdirPromise(path.join(__dirname, '../tmp')).then(() => {
      return download(downloadUrl, outputDir, {filename: "sdk.zip"})
    }).then(() => {
      logger.info("Success", "Download finished");
      return extractPromise('./tmp/sdk.zip', {dir: path.join(__dirname, '../tmp/')})
    }).then(() => {
      logger.info("Success", "Unzip finished");
      if(os === "mac") {
        return globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcEngineKit.framework/'))
      } else {
        return globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Windows*/'))
      }
    }).then(folder => {
      if(os === "mac") {
        return macPrepare()
      } else {
        console.log(folder)
        return winPrepare(folder[0])
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