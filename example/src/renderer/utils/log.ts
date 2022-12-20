export const _logSink = (
  level: 'debug' | 'log' | 'info' | 'warn' | 'error',
  message?: any,
  ...optionalParams: any[]
): string => {
  console[level](message, optionalParams);
  return `${optionalParams.map((v) => JSON.stringify(v))}`;
};

export const debug = (message?: any, ...optionalParams: any[]): void => {
  alert(`${message}: ${_logSink('debug', message, ...optionalParams)}`);
};

export const log = (message?: any, ...optionalParams: any[]): void => {
  _logSink('log', message, optionalParams);
};

export const info = (message?: any, ...optionalParams: any[]): void => {
  _logSink('info', message, optionalParams);
};

export const warn = (message?: any, ...optionalParams: any[]): void => {
  _logSink('warn', message, optionalParams);
};

export const error = (message?: any, ...optionalParams: any[]): void => {
  _logSink('error', message, optionalParams);
};
