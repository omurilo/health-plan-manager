import CompaniesService from "./companies/index.js";
import PlanProvidersService from "./providers/index.js";
import BeneficiariesService from "./beneficiaries/index.js";

import Database from "../database/index.js";
import CompaniesEntity from '../repositories/entities/companies/index.js';
import PlanProvidersEntity from '../repositories/entities/providers/index.js';
import BeneficiariesEntity from '../repositories/entities/beneficiaries/index.js';

export default class Services {
  constructor() {
    this.companies = new CompaniesService({ repository: new CompaniesEntity({ database: Database }) })
    this.planProviders = new PlanProvidersService({ repository: new PlanProvidersEntity({ database: Database }) })
    this.beneficiaries = new BeneficiariesService({
      repository: new BeneficiariesEntity({ database: Database }),
      companies: this.companies,
      planProviders: this.planProviders
    });
  }
}