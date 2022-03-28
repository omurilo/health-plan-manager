import BaseEntity from "../base-entity.js";

export default class Beneficiaries extends BaseEntity {
  constructor({ database }) {
    super();
    this.database = database.getEntityDatabaseInstance('beneficiaries');
  }

  createOrUpdate(data) {
    const [beneficiary] = this.database.find({ document: data.document });

    if (beneficiary) {
      this.database.instance.set(beneficiary.id, Object.assign(beneficiary, data));

      return this.database.instance.get(beneficiary.id);
    }

    return this.database.create(data);
  }
}