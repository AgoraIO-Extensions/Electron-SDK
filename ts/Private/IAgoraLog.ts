
export enum LogLevel {
LogLevelNone = 0x0000,
LogLevelInfo = 0x0001,
LogLevelWarn = 0x0002,
LogLevelError = 0x0004,
LogLevelFatal = 0x0008,
}

export abstract class ILogWriter {
abstract writeLog(level: LogLevel, message: string, length: number): number;
}

export enum LogFilterType {
LogFilterOff = 0,
LogFilterDebug = 0x080f,
LogFilterInfo = 0x000f,
LogFilterWarn = 0x000e,
LogFilterError = 0x000c,
LogFilterCritical = 0x0008,
LogFilterMask = 0x80f,
}

export class LogConfig {
  filePath?: string
  fileSizeInKB?: number
  level?: LogLevel
  static fromJSON (json: any): LogConfig {
    const obj = new LogConfig()
    obj.filePath = json.filePath
    obj.fileSizeInKB = json.fileSizeInKB
    obj.level = json.level
    return obj
  }

  toJSON? () {
    return {
      filePath: this.filePath,
      fileSizeInKB: this.fileSizeInKB,
      level: this.level
    }
  }
}
