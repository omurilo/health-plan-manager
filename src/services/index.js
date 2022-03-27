import ClientsService from "./clients/index.js";
import PlanProvidersService from "./providers/index.js";
import BeneficiariesService from "./beneficiaries/index.js";

export default class Services {
  constructor() {
    this.clients = new ClientsService()
    this.planProviders = new PlanProvidersService()
    this.beneficiaries = new BeneficiariesService({  client: this.clients, planProviders: this.planProviders });
  }
}