import winston from 'winston';

const loggerFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${level}] ${message} ${timestamp}`;
});

const defaultLogger = () =>
  winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp(), loggerFormat),
    transports: [new winston.transports.Console()],
  });

const logger = defaultLogger();
export default logger;
