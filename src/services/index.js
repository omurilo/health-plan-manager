import CompaniesService from "./companies/index.js";
import PlanProvidersService from "./providers/index.js";
import BeneficiariesService from "./beneficiaries/index.js";

import Database from "../database/index.js";

export default class Services {
  constructor() {
    this.companies = new CompaniesService({ database: Database })
    this.planProviders = new PlanProvidersService({ database: Database })
    this.beneficiaries = new BeneficiariesService({ companies: this.companies, planProviders: this.planProviders, database: Database });
  }
}