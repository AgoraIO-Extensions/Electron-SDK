import { callIrisApi } from '../internal/IrisApiEngine'
import { ILogWriter, LogLevel } from '../IAgoraLog'

export class ILogWriterImpl implements ILogWriter {
  writeLog (level: LogLevel, message: string, length: number): number {
    const apiType = 'LogWriter_writeLog'
    const jsonParams = {
      level,
      message,
      length,
      toJSON: () => {
        return {
          level,
          message,
          length
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }
}
