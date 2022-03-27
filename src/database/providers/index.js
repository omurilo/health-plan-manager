import PlanProviders from './plan-providers.json'

export default class ProvidersDatabase {
  constructor() {
    return new Map(PlanProviders)
  }

  static validateProviderSchema(provider, data) {
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

      // TODO: remove if this is not needed
      if (provider.schema[key].type === 'object') {
        ProvidersDatabase.validateProviderSchema(provider, data[key]);
      }
    })
  }
}