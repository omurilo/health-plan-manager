import ProvidersDatabase from "../../database/providers/index.js";

export default class BeneficiariesService {
  constructor({ planProviders, companies, repository }) {
    this.repository = repository;
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
      this.planProviders.repository.validateProviderSchema(provider, data);

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

    return this.repository.createOrUpdate(beneficiary);
  }

  get(id) {
    return this.repository.get(id);
  }

  find(query) {
    return this.repository.find(query);
  }
}