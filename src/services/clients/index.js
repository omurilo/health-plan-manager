import ClientsEntity from '../../repositories/entities/clients/index.js'

export default class ClientsService {
  constructor() {
    this.clients = new ClientsEntity();
  }

  create(data) {
    return this.clients.create(data);
  }

  get(id) {
    return this.clients.get(id);
  }

  find(query) {
    return this.clients.find(query);
  }
}