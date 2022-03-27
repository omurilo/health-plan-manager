import PlanProviders from '../../repositories/entities/providers/index.js'

export default class PlanProvidersService {
  constructor() {
    this.providers = new PlanProviders();
  }

  create(data) {
    return this.providers.create(data);
  }

  get(id) {
    return this.providers.get(id);
  }

  find(query) {
    return this.providers.find(query);
  }
}