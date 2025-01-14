import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Nivel de log por defecto
  format: format.combine(
    format.timestamp(), // Agregar timestamp a los logs
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Mostrar logs en la consola
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs de errores
    new transports.File({ filename: 'logs/combined.log' }) // Todos los logs
  ]
});

export default logger;