import './extension/IAgoraLogExtension';

/**
 * Log output level.
 */
export enum LogLevel {
  /**
   * 0: Do not output any logs.
   */
  LogLevelNone = 0x0000,
  /**
   * 0x0001: (Default) Outputs logs of FATAL, ERROR, WARN, and INFO levels. It is recommended to set the log level to this level.
   */
  LogLevelInfo = 0x0001,
  /**
   * 0x0002: Outputs only logs of FATAL, ERROR, and WARN levels.
   */
  LogLevelWarn = 0x0002,
  /**
   * 0x0004: Outputs only logs of FATAL and ERROR levels.
   */
  LogLevelError = 0x0004,
  /**
   * 0x0008: Outputs only logs of FATAL level.
   */
  LogLevelFatal = 0x0008,
  /**
   * @ignore
   */
  LogLevelApiCall = 0x0010,
  /**
   * @ignore
   */
  LogLevelDebug = 0x0020,
}

/**
 * Log filter level.
 */
export enum LogFilterType {
  /**
   * 0: Do not output any log information.
   */
  LogFilterOff = 0,
  /**
   * 0x080f: Outputs all API log information. Set the log level to this value to get the most complete logs.
   */
  LogFilterDebug = 0x080f,
  /**
   * 0x000f: Outputs logs at LogFilterCritical, LogFilterError, LogFilterWarn, and LogFilterInfo levels. It is recommended to set the log level to this value.
   */
  LogFilterInfo = 0x000f,
  /**
   * 0x000e: Outputs logs at LogFilterCritical, LogFilterError, and LogFilterWarn levels.
   */
  LogFilterWarn = 0x000e,
  /**
   * 0x000c: Outputs logs at LogFilterCritical and LogFilterError levels.
   */
  LogFilterError = 0x000c,
  /**
   * 0x0008: Outputs logs at LogFilterCritical level.
   */
  LogFilterCritical = 0x0008,
  /**
   * @ignore
   */
  LogFilterMask = 0x80f,
}

/**
 * Configuration for SDK log files.
 */
export class LogConfig {
  /**
   * Full path of the log file. Agora recommends using the default log path. If you need to modify the default log path, make sure the specified path exists and is writable.
   * Default paths:
   *  macOS:
   *  Sandbox enabled: App Sandbox/Library/Logs/agorasdk.log, e.g., /Users/<username>/Library/Containers/<AppBundleIdentifier>/Data/Library/Logs/agorasdk.log.
   *  Sandbox disabled: ~/Library/Logs/agorasdk.log
   *  Windows: C:\Users\<user_name>\AppData\Local\Agora\<process_name>\agorasdk.log.
   */
  filePath?: string;
  /**
   * Size of a single agorasdk.log file in KB. Range: [128, 20480]. Default: 2,048 KB. If you set fileSizeInKByte to less than 128 KB, the SDK automatically adjusts it to 128 KB; if you set it to more than 20,480 KB, the SDK adjusts it to 20,480 KB.
   */
  fileSizeInKB?: number;
  /**
   * Log output level of the SDK. See LogLevel.
   * For example, if you choose WARN level, you will see all logs at FATAL, ERROR, and WARN levels.
   */
  level?: LogLevel;
}
