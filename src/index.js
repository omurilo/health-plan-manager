import Server from './server.js';
import config from './config/index.js'

const server = Server.createInstanceServer();

server.listen(config.port)
  .on('listening', () => {
    console.log(`Server running on port ${config.port}`);
  });

process.on('uncaughtException', (error) => console.error(`unhandledRejection happened: ${error.stack || error}`))
process.on('unhandledRejection', (error) => console.error(`unhandledRejection happened: ${error.stack || error}`))