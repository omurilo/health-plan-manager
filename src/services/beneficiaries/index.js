import ProvidersDatabase from "../../database/providers/index.js";

import BeneficiariesEntity from '../../repositories/entities/beneficiaries/index.js';

export default class BeneficiariesService {
  constructor({ planProviders, companies }) {
    this.beneficiaries = new BeneficiariesEntity();
    this.planProviders = planProviders;
    this.companies = companies;
  }

  create(data) {
    const { plans, ...beneficiaryData } = data;
    let providers;

    if (plans) {
      providers = this.planProviders.find({ id: { $in: plans } });
    } else {
      providers = this.planProviders.find({ id: { $in: this.clients.get(data.company).providers } });
    }

    return providers.map(provider => {
      ProvidersDatabase.validateProviderSchema(provider, data);

      const item = Reflect.ownKeys(provider.schema).reduce((schema, key) => {
        schema[key] = data[key];

        return schema;
      }, {});

      item.provider = provider.id;
      item.company = data.company;

      return this.beneficiaries.create(item)
    });
  }

  get(id) {
    return this.beneficiaries.get(id);
  }

  find(query) {
    return this.beneficiaries.find(query);
  }
}