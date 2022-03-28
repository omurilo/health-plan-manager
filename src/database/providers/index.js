import PlanProviders from './plan-providers.json'

export default class ProvidersDatabase {
  constructor() {
    return new Map(PlanProviders)
  }
}