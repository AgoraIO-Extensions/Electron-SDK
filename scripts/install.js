const shell = require('shelljs')

const getPlatform = () => {
  if (process.platform === 'darwin') {
    return 'mac'
  } else if (process.platform === 'win32') {
    return 'win'
  } else {
    return 'unsupported'
  }
}

const install = () => {
  let platform = getPlatform()
  if(platform === 'mac') {
    shell.echo('Building AgoraRTC SDK for mac, this will cost a little time...')
    if(shell.exec('node-gyp rebuild --target=1.8.3', {silent:true}).code !== 0) {
      shell.echo('Building AgoraRTC SDK for mac failed.')
    }
  } else if (platform === 'win') {
    shell.echo('Building AgoraRTC SDK for windows 32bit, this will cost a little time...')
    if (shell.exec('node-gyp rebuild --target=1.8.3 --arch=ia32 --msvs_version=2015').code !== 0) {
      shell.echo('Building AgoraRTC SDK for window 32bit failed.')
    }
  } else {
    shell.echo('Sorry, this sdk only provide win32 and mac version.')
    shell.exit(1)
  }
}

install()