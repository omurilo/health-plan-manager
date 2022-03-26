import { createServer } from 'http'

import Router from './routes/index.js';
import Controllers from './controllers/index.js';

export default class Server {
  constructor({ handler }) {
    this.handler = handler
    return createServer(this.handler)
  }

  static createInstanceServer() {
    const controllers = new Controllers();
    const router = new Router({ controllers });

    return new Server({ handler: router.handler.bind(router) });
  }
}