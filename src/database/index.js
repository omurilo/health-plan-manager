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

    if (!query) {
      return Object.fromEntries(this.instance.entries());
    }

    Reflect.ownKeys(query).forEach(key => {
      if (query[key].$in) {
        const newQuery = query[key].$in.map(value => String(value).toLowerCase());
        this.instance.forEach(item => {
          if (newQuery.includes(String(item[key]).toLowerCase())) {
            result.push(item);
          }
        });
      } else {
        this.instance.forEach(item => {
          if (String(item[key]).toLowerCase() === String(query[key]).toLowerCase()) {
            result.push(item)
          }
        });
      }
    });

    return result;
  }
}