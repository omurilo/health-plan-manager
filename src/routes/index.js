import { once } from 'events'
import QueryString from 'querystring'

export default class Routes {
  constructor({ controllers }) {
    this.controllers = controllers
  }

  async routes(request, response) {
    const { url: unparsedUrl, method } = request;
    let query = null
    let params = null
    let result = null

    if (unparsedUrl.includes('?')) {
      query = QueryString.parse(unparsedUrl.split('?')[1])
    }

    if (unparsedUrl.includes('/')) {
      const [, url, ...rest] = unparsedUrl.split('/')
      params = rest
    }

    if (method === 'GET') {
      if (unparsedUrl === '/') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({
          statusCode: 200,
          body: 'Hello World!',
        }));
        response.end();
      }

      if (unparsedUrl.includes('/beneficiaries')) {
        response.writeHead(200, { 'Content-Type': 'application/json' });

        if (!params) {
          result = await this.controllers.beneficiaries.find(query);
        } else {
          result = await this.controllers.beneficiaries.get(params[0]);
        }

        return response.end(JSON.stringify(result));
      }

      if (unparsedUrl.includes('/clients')) {
        response.writeHead(200, { 'Content-Type': 'application/json' });

        if (!params) {
          result = await this.controllers.clients.find(query);
        } else {
          result = await this.controllers.clients.get(params[0]);
        }

        return response.end(JSON.stringify(result));
      }

      if (unparsedUrl.includes('/providers')) {
        response.writeHead(200, { 'Content-Type': 'application/json' });

        if (!params) {
          result = await this.controllers.planProviders.find(query);
        } else {
          result = await this.controllers.planProviders.get(params[0]);
        }

        return response.end(JSON.stringify(result));
      }
    }

    if (method === 'POST') {
      if (unparsedUrl === '/beneficiaries') {
        const body = await once(request, 'data')
        const data = JSON.parse(body);

        const result = this.controllers.beneficiaries.create(data);

        return response.end(JSON.stringify(result))
      }

      if (unparsedUrl === '/clients') {
        const body = await once(request, 'data')
        const data = JSON.parse(body);

        const result = this.controllers.clients.create(data);

        return response.end(JSON.stringify(result))
      }

      if (unparsedUrl === '/providers') {
        const body = await once(request, 'data')
        const data = JSON.parse(body);

        const result = this.controllers.planProviders.create(data);

        return response.end(JSON.stringify(result))
      }
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