const { logger } = require("just-task");
const download = require("download");
const extract = require('extract-zip')
const path = require("path");
const glob = require("glob")
const promisify = require("util").promisify
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
      // fs.remove(path.join(__dirname, '../sdk'))
    ]).then(() => {
      return fs.mkdirpSync(path.join(__dirname, '../sdk/lib/mac'))
    }).then(() => {
      return Promise.all([
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcKit.framework'),
          path.join(__dirname, '../sdk/lib/mac/AgoraRtcKit.framework')
        ),
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/Agorafdkaac.framework'),
          path.join(__dirname, '../sdk/lib/mac/Agorafdkaac.framework')
        ),
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/Agoraffmpeg.framework'),
          path.join(__dirname, '../sdk/lib/mac/Agoraffmpeg.framework')
        ),
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraSoundTouch.framework'),
          path.join(__dirname, '../sdk/lib/mac/AgoraSoundTouch.framework')
        ),
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraAIDenoiseExtension.framework'),
          path.join(__dirname, '../sdk/lib/mac/AgoraAIDenoiseExtension.framework')
        ),
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraDav1dExtension.framework'),
          path.join(__dirname, '../sdk/lib/mac/AgoraDav1dExtension.framework')
        ),
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraCore.framework'),
          path.join(__dirname, '../sdk/lib/mac/AgoraCore.framework')
        ),
        fs.move(
          path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/av1.framework'),
          path.join(__dirname, '../sdk/lib/mac/av1.framework')
        )

      ])
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
      return fs.mkdirpSync(path.join(__dirname, '../sdk/lib'))
    }).then(() => {
      return fs.mkdirpSync(path.join(__dirname, '../sdk/dll'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './libs/include'), path.join(__dirname, '../sdk/include')),
        fs.move(path.join(folder, './libs/x86/agora_rtc_sdk.dll'), path.join(__dirname, '../sdk/dll/agora_rtc_sdk.dll')),
        fs.move(path.join(folder, './libs/x86/libagora-wgc.dll'), path.join(__dirname, '../sdk/dll/libagora-wgc.dll')),
        fs.move(path.join(folder, './libs/x86/libagora-fdkaac.dll'), path.join(__dirname, '../sdk/dll/libagora-fdkaac.dll')),
        fs.move(path.join(folder, './libs/x86/libagora-ffmpeg.dll'), path.join(__dirname, '../sdk/dll/libagora-ffmpeg.dll')),
        fs.move(path.join(folder, './libs/x86/libagora-mpg123.dll'), path.join(__dirname, '../sdk/dll/libagora-mpg123.dll')),
        fs.move(path.join(folder, './libs/x86/libagora-soundtouch.dll'), path.join(__dirname, '../sdk/dll/libagora-soundtouch.dll')),
        fs.move(path.join(folder, './libs/x86/libhwcodec.dll'), path.join(__dirname, '../sdk/dll/libhwcodec.dll')),
        fs.move(path.join(folder, './libs/x86/agora_rtc_sdk.lib'), path.join(__dirname, '../sdk/lib/agora_rtc_sdk.lib')),
        fs.move(path.join(folder, './libs/x86/av1.dll'), path.join(__dirname, '../sdk/dll/av1.dll')),
        fs.move(path.join(folder, './libs/x86/libagora_ai_denoise_extension.dll'), path.join(__dirname, '../sdk/dll/libagora_ai_denoise_extension.dll')),
        fs.move(path.join(folder, './libs/x86/libagora_dav1d_extension.dll'), path.join(__dirname, '../sdk/dll/libagora_dav1d_extension.dll')),
        fs.move(path.join(folder, './libs/x86/libagora-core.dll'), path.join(__dirname, '../sdk/dll/libagora-core.dll')),
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
      return fs.mkdirpSync(path.join(__dirname, '../sdk/lib'))
    }).then(() => {
      return fs.mkdirpSync(path.join(__dirname, '../sdk/dll'))
    }).then(() => {
      return Promise.all([
        fs.move(path.join(folder, './libs/include'), path.join(__dirname, '../sdk/include')),
        fs.move(path.join(folder, './libs/x86_64/agora_rtc_sdk.dll'), path.join(__dirname, '../sdk/dll/agora_rtc_sdk.dll')),
        fs.move(path.join(folder, './libs/x86/libagora-wgc.dll'), path.join(__dirname, '../sdk/dll/libagora-wgc.dll')),
        fs.move(path.join(folder, './libs/x86_64/libagora-fdkaac.dll'), path.join(__dirname, '../sdk/dll/libagora-fdkaac.dll')),
        fs.move(path.join(folder, './libs/x86_64/libagora-ffmpeg.dll'), path.join(__dirname, '../sdk/dll/libagora-ffmpeg.dll')),
        fs.move(path.join(folder, './libs/x86_64/libagora-mpg123.dll'), path.join(__dirname, '../sdk/dll/libagora-mpg123.dll')),
        fs.move(path.join(folder, './libs/x86_64/libagora-soundtouch.dll'), path.join(__dirname, '../sdk/dll/libagora-soundtouch.dll')),
        fs.move(path.join(folder, './libs/x86_64/libhwcodec.dll'), path.join(__dirname, '../sdk/dll/libhwcodec.dll')),
        fs.move(path.join(folder, './libs/x86_64/agora_rtc_sdk.lib'), path.join(__dirname, '../sdk/lib/agora_rtc_sdk.lib')),
        fs.move(path.join(folder, './libs/x86_64/av1.dll'), path.join(__dirname, '../sdk/dll/av1.dll')),
        fs.move(path.join(folder, './libs/x86_64/libagora_ai_denoise_extension.dll'), path.join(__dirname, '../sdk/dll/libagora_ai_denoise_extension.dll')),
        fs.move(path.join(folder, './libs/x86_64/libagora_dav1d_extension.dll'), path.join(__dirname, '../sdk/dll/libagora_dav1d_extension.dll')),
        fs.move(path.join(folder, './libs/x86_64/libagora-core.dll'), path.join(__dirname, '../sdk/dll/libagora-core.dll')),
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
      console.log("Agora mkdir mediaPlayer")
      return fs.mkdirpSync(path.join(__dirname, '../sdk/lib/media_player'))
    }).then(() => {
      let sourceFilePath = path.join(folder, './libs/AgoraMediaPlayer.framework')
      let destFilePath = path.join(__dirname, '../sdk/lib/media_player/AgoraMediaPlayer.framework')
      
      console.log(`move AgoraMediaPlayer`);
      return Promise.all([fs.move(sourceFilePath, destFilePath)])
    }).then(() => {
      let sourceFilePath = path.join(folder, './libs/AgoraPlayerFFmpeg.framework')
      let destFilePath = path.join(__dirname, '../sdk/lib/media_player/AgoraPlayerFFmpeg.framework')
      console.log(`move AgoraPlayerFFmpeg`);
      return Promise.all([fs.move(sourceFilePath, destFilePath)]);
    }).catch(e => {
      console.log("macPrepare_mediaPlayer reject exception")
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
      return fs.mkdirpSync(path.join(__dirname, '../sdk/media_player'))
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
      return fs.mkdirpSync(path.join(__dirname, '../sdk/media_player'))
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
  arch = "ia32",
  downloadKey
}) => {
  const headers = { "X-JFrog-Art-Api": downloadKey };
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
    if(os === "mac") {
      if(!libUrl.mac){
        logger.error(`no macos lib specified`)
        return reject(new Error(`no macos lib specified`))
      } else {
        downloadUrl = libUrl.mac
        downloadMediaPlayerUrl = libUrl.mediaPlayer_mac
      }
    } else {
      downloadUrl = libUrl.win
      downloadMediaPlayerUrl = (arch === 'ia32') ? libUrl.mediaPlayer_win : libUrl.mediaPlayer_win64
      if(!downloadUrl){
        logger.error(`no windows lib specified`)
        return reject(new Error(`no windows lib specified`))
      }
    }

    /** start download */
    const outputDir = "./tmp/";
    logger.info(`Downloading ${os} Libs...\n${downloadUrl}\n`);

    fs.remove(path.join(__dirname, '../tmp')).then(() => {
      logger.info(`Downloading ${os} mediaPlayer Libs...\n${downloadMediaPlayerUrl}\n`);
      return download(downloadMediaPlayerUrl, outputDir, {
        filename: "sdk_mediaPlayer.zip",
        headers
      });
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

    download(downloadUrl, outputDir, {filename: "sdk.zip", headers}).then(() => {
      logger.info("Success", "Download finished");
      if(os === "mac") {
        return macExtractPromise()
      } else {
        return extractPromise('./tmp/sdk.zip', {dir: path.join(__dirname, '../tmp/')})
      }
    }).then(() => {
      logger.info("Success", "Unzip finished");
      if(os === "mac") {
        return globPromise(path.join(__dirname, '../tmp/Agora_Native_SDK_for_Mac_FULL/libs/AgoraRtcKit.framework/'))
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