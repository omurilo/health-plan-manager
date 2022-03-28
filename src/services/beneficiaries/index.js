import ProvidersDatabase from "../../database/providers/index.js";
import BeneficiariesEntity from '../../repositories/entities/beneficiaries/index.js';

export default class BeneficiariesService {
  constructor({ planProviders, companies, database }) {
    this.beneficiaries = new BeneficiariesEntity({ database });
    this.planProviders = planProviders;
    this.companies = companies;
  }

  create(data) {
    const { plans } = data;
    let providers;

    if (plans) {
      const companyProviders = this.companies.get(data.company).providers;
      const availableProviders = companyProviders.filter(provider => plans.includes(provider));
      providers = this.planProviders.find({ id: { $in: availableProviders } });
    } else {
      providers = this.planProviders.find({ id: { $in: this.companies.get(data.company).providers } });
    }

    const beneficiaryPlans = providers.map(provider => {
      ProvidersDatabase.validateProviderSchema(provider, data);

      const item = Reflect.ownKeys(provider.schema).reduce((schema, key) => {
        schema[key] = data[key];

        return schema;
      }, {});

      item.provider = provider.id

      return item;
    });

    const beneficiary = {
      name: data.name,
      company: data.company,
      document: data.document,
      plans: beneficiaryPlans,
    }

    return this.beneficiaries.createOrUpdate(beneficiary);
  }

  get(id) {
    return this.beneficiaries.get(id);
  }

  find(query) {
    return this.beneficiaries.find(query);
  }
}