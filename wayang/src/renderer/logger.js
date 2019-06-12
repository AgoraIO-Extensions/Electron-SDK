import { EventEmitter } from "events";

class Logger extends EventEmitter {
  log = (m, type, level) => {
    this.emit('log', {
      ts: (new Date()).toString(),
      m,level, type: type || "general"
    })
  }

  info = (m, type) => {
    this.log(m, type, 'info')
  }

  error = (m, type) => {
    this.log(m, type, 'error')
  }
}

export default new Logger()