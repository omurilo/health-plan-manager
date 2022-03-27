import CompaniesData from './companies.json'

export default class CompaniesDatabase {
  constructor() {
    return new Map(CompaniesData);
  }
}