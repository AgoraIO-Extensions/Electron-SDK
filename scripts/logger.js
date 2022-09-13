const { createLogger, format, transports } = require('winston');

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const formatList = [
  format.label({ label: 'agora-script' }),
  format.timestamp({
    format: 'HH:mm:ss',
  }),
  format.errors({ stack: true }),
  format.splat(),
  myFormat,
];

const logger = createLogger({
  level: 'silly',
  format: format.combine(...formatList),
  defaultMeta: { service: 'agora-electron-sdk-log' },
  transports: [
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    new transports.File({ filename: 'agora-electron-sdk-script.log' }),
  ],
  silent: false,
});

logger.add(
  new transports.Console({
    format: format.combine(...[format.colorize(), ...formatList]),
  })
);
module.exports = logger;
