import BaseEntity from "../base-entity.js";

export default class Providers extends BaseEntity {
  constructor({ database }) {
    super();
    this.database = database.getEntityDatabaseInstance('providers');
  }

  validateProviderSchema(provider, data) {
    const schema = Reflect.ownKeys(provider.schema);
    schema.forEach(key => {
      if (provider.schema[key].type !== 'object' && typeof data[key] === 'object') {
        throw new Error(`Validation Error: ${key} is not a ${provider.schema[key].type}`);
      }

      if (!data[key] && provider.schema[key].required) {
        throw new Error(`Validation Error: ${key} is required`);
      }

      if (provider.schema[key].type === 'date' && isNaN(new Date(data[key]))) {
        throw new Error(`Validation Error: ${key} is not a valid date`);
      }

      if (provider.schema[key].type !== 'date' && provider.schema[key].type !== typeof data[key]) {
        throw new Error(`Validation Error: ${key} is not a ${provider.schema[key].type}`);
      }

      if (provider.schema[key].type === 'object') {
        this.validateProviderSchema(provider, data[key]);
      }
    })
  }
}