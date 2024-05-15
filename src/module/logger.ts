import pino from "pino";
import path from 'path';

const appPath = path.join(__dirname, '..', 'logs', 'app.log');
const appLog = Bun.file(appPath);

const logger = pino({
  // write: (message) => Bun.write(appLog, message),
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  }
});

export default logger;