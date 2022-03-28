export default class PlanProvidersService {
  constructor({ repository }) {
    this.repository = repository;
  }

  create(data) {
    return this.repository.create(data);
  }

  get(id) {
    return this.repository.get(id);
  }

  find(query) {
    return this.repository.find(query);
  }
}