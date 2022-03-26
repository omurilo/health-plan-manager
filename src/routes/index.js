import { once } from 'events'

export default class Routes {
  constructor({ controllers }) {
    this.controllers = controllers
  }

  async routes(request, response) {
    const { url, method } = request;

    if (method === 'GET' && url === '/') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({
        statusCode: 200,
        body: 'Hello World!',
      }));
      response.end();
    }
  }

  handleError(error, response) {
    if (error.message.includes('ENOENT')) {
      console.warn(`asset not found ${error.stack}`)
      response.writeHead(404)
      return response.end()
    }

    if (error.message.includes('Validation Error')) {
      console.error(`caught error on API ${error.stack}`)
      response.writeHead(400)
      response.write(JSON.stringify({ message: error.message }))
      return response.end()
    }

    console.error(`caught error on API ${error.stack}`)
    response.writeHead(500)
    return response.end()
  }

  handler(request, response) {
    return this.routes(request, response)
      .catch(error => this.handleError(error, response))
  }
}