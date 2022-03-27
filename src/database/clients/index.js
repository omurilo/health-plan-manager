import ClientsData from './clients.json'

export default class ClientsDatabase {
  constructor() {
    return new Map(ClientsData);
  }
}