const fs = require('fs')
const path = require('path')
const defaultConfig = require('./default.config.json')
import {usrFolder} from './utils'

const configPath = path.resolve(usrFolder, './production.config.json')

class Config {
  constructor() {
    let config = {}

    if(!fs.existsSync(usrFolder)) {
      fs.mkdirSync(usrFolder)
    }

    if(fs.existsSync(configPath)) {
      let data = fs.readFileSync(configPath, {encoding: 'utf8'})
      try {
        config = JSON.parse(data)
      } catch(e) {
        console.error(`config corrupted, restore`)
        config = {}
      }
    }
    config = Object.assign(defaultConfig, config)
    this.config = config
  }

  get() {
    return Object.assign({}, this.config)
  }

  set(key, val) {
    this.config[key] = val
    this.sync()
  }

  setMulti(configs) {
    Object.keys(configs).forEach(key => {
      if(defaultConfig[key] !== undefined) {
        this.config[key] = configs[key]
      }
    })
    this.sync()
  }

  sync() {
    fs.writeFileSync(configPath, JSON.stringify(this.config), {encoding: "utf8"})
  }
}

export default new Config()