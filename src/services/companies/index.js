import CompaniesEntity from '../../repositories/entities/companies/index.js'

export default class CompaniesService {
  constructor({ database }) {
    this.companies = new CompaniesEntity({ database });
  }

  create(data) {
    return this.companies.create(data);
  }

  get(id) {
    return this.companies.get(id);
  }

  find(query) {
    return this.companies.find(query);
  }
}