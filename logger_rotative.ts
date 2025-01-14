import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d' // Mantener logs por 14 días
    }),
    new DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d'
    })
  ]
});

export default logger;