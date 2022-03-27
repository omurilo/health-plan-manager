import ClientsController from "./clients/index.js";
import PlanProvidersController from "./providers/index.js";
import BeneficiariesController from "./beneficiaries/index.js";

import Services from "../services/index.js"

export default class Controllers {
  constructor() {
    const services = new Services();
    this.clients = new ClientsController({ service: services.clients })
    this.planProviders = new PlanProvidersController({ service: services.planProviders })
    this.beneficiaries = new BeneficiariesController({ service: services.beneficiaries })
  }
}