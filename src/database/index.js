import { randomUUID } from 'crypto'

import ClientsDatabase from "./clients/index.js";
import ProvidersDatabase from "./providers/index.js";
import BeneficiariesDatabase from './beneficiaries/index.js';

export default class Database {
  constructor({ entity }) {
    this.db = new Map([['providers', new ProvidersDatabase()], ['clients', new ClientsDatabase()], ['beneficiaries', new BeneficiariesDatabase()]]);
    this.instance = this.db.get(entity);
  }

  static getEntityDatabaseInstance(entity) {
    return new Database({ entity });
  }

  create(data) {
    data.id = randomUUID();
    this.instance.set(data.id, data);
    return this.instance.get(data.id);
  }

  get(key) {
    return this.instance.get(key);
  }

  find(query) {
    const result = [];
    Reflect.ownKeys(query).forEach(key => {
      if (query[key].$in) {
        this.instance.forEach(item => {
          if (query[key].$in.includes(item[key])) {
            result.push(item);
          }
        });
      } else {
        this.instance.forEach(item => {
          if (item[key] === query[key]) {
            result.push(item)
          }
        });
      }
    });

    return result;
  }
}