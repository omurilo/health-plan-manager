import CompaniesService from "./companies/index.js";
import PlanProvidersService from "./providers/index.js";
import BeneficiariesService from "./beneficiaries/index.js";

export default class Services {
  constructor() {
    this.companies = new CompaniesService()
    this.planProviders = new PlanProvidersService()
    this.beneficiaries = new BeneficiariesService({  companies: this.companies, planProviders: this.planProviders });
  }
}