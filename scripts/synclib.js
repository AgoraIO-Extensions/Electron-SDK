const { logger } = require("just-task");
const download = require("download");
const extract = require('extract-zip')
const path = require("path");
const glob = require("glob")
const promisify = require("bluebird").promisify
const fs = require("fs-extra")

const extractPromise = promisify(extract)
const globPromise = promisify(glob)


const macPrepare = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      // fs.remove(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk/lib/mac'))
    }).then(() => {
      return fs.move(
        path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcEngineKit.framework'),
        path.join(__dirname, '../sdk/lib/mac/AgoraRtcEngineKit.framework')
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
      // fs.remove(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk/lib'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './sdk/include'), path.join(__dirname, '../sdk/include')),
        fs.move(path.join(folder, './sdk/dll'), path.join(__dirname, '../sdk/dll')),
        fs.move(path.join(folder, './sdk/lib'), path.join(__dirname, '../sdk/lib/win')),
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
      // fs.remove(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './sdk'), path.join(__dirname, '../sdk/win64')),
      ])
    }).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}


const macPrepare_mediaPlayer = (folder) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      //fs.remove(path.join(__dirname, '../sdk/lib/media_player'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk/lib/media_player'))
    }).then(() => {
      console.log(`macPrepare_mediaPlayer ${folder}`)
      return fs.move(path.join(folder, './libs/AgoraMediaPlayer.framework'), path.join(__dirname, '../sdk/lib/media_player/AgoraMediaPlayer.framework'))
    }).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}

const winPrepare_mediaPlayer = (folder) => {
  console.log("winPrepare_mediaPlayer")
  return new Promise((resolve, reject) => {
    Promise.all([
      fs.remove(path.join(__dirname, '../sdk/media_player'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk/media_player'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './sdk'), path.join(__dirname, '../sdk/media_player/win')),
      ])
    }).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}

const win64Prepare_mediaPlayer = (folder) => {
  console.log("win64Prepare_mediaPlayer")
  return new Promise((resolve, reject) => {
    Promise.all([
      fs.remove(path.join(__dirname, '../sdk/media_player'))
    ]).then(() => {
      return fs.mkdirp(path.join(__dirname, '../sdk/media_player'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './sdk'), path.join(__dirname, '../sdk/media_player/win64')),
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
  arch = "ia32"
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
    let downloadMediaPlayerUrl;
    if (os === "mac") {
      if (!libUrl.mac) {
        logger.error(`no macos lib specified`)
        return reject(new Error(`no macos lib specified`))
      } else {
        downloadUrl = libUrl.mac
        downloadMediaPlayerUrl = libUrl.mediaPlayer_mac
      }
    } else {
      downloadUrl = (arch === 'ia32') ? libUrl.win : libUrl.win64
      downloadMediaPlayerUrl = (arch === 'ia32') ? libUrl.mediaPlayer_win : libUrl.mediaPlayer_win64
      if (!downloadUrl) {
        logger.error(`no windows lib specified`)
        return reject(new Error(`no windows lib specified`))
      }
    }

    /** start download */
    const outputDir = "./tmp/";
    logger.info(`Downloading ${os} Libs...\n${downloadUrl}\n`);

    fs.remove(path.join(__dirname, '../tmp')).then(() => {
      fs.remove(path.join(__dirname, '../sdk'))
    }).then(() => {
      return download(downloadUrl, outputDir, { filename: "sdk.zip" })
    }).then(() => {
      logger.info("Success", "Download finished");
      return extractPromise('./tmp/sdk.zip', { dir: path.join(__dirname, '../tmp/') })
    }).then(() => {
      logger.info("Success", "Unzip finished");
      if (os === "mac") {
        return globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcEngineKit.framework/'))
      } else {
        return globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Windows*/'))
      }
    }).then(folder => {
      if (os === "mac") {
        return macPrepare()
      } else {
        if (arch === 'ia32') {
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


    logger.info(`Downloading ${os} Libs...\n${downloadMediaPlayerUrl}\n`);
    fs.remove(path.join(__dirname, '../tmp')).then(() => {
      return download(downloadMediaPlayerUrl, outputDir, { filename: "sdk_mediaPlayer.zip" })
    }).then(() => {
      logger.info("Success", "Download finished");
      return extractPromise('./tmp/sdk_mediaPlayer.zip', { dir: path.join(__dirname, '../tmp/') })
    }).then(() => {
      logger.info("Success", "Unzip finished");
      if (os === "mac") {
        return globPromise(path.join(__dirname, '../tmp/Agora_Media_Player*/'))
      } else {
        return globPromise(path.join(__dirname, '../tmp/Agora_Media_Player_for_Window*/'))
      }
    }).then(folder => {
      if (os === "mac") {
        return macPrepare_mediaPlayer(folder[0])
      } else {
        if (arch === 'ia32') {
          return winPrepare_mediaPlayer(folder[0])
        } else {
          return win64Prepare_mediaPlayer(folder[0])
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
