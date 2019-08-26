import { createLogger, format, transports } from 'winston';
import { resolve } from 'path';

class Log {
  constructor() {
    this.logger();
  }

  logger() {
    return createLogger({
      format: format.combine(
        format.simple(),
        format.prettyPrint(info => {
          return `${info.timestamp} ${info.level} ${info.message}`;
        })
      ),

      transports: [
        new transports.File({
          maxsize: 512000,
          maxFiles: '7d',
          filename: resolve(__dirname, '..', '..', 'tmp', 'log-api.log'),
        }),
      ],
    });
  }
}

export default new Log();
