import BaseEntity from "../base-entity.js";

import Database from "../../../database/index.js";

export default class Beneficiaries extends BaseEntity {
  constructor() {
    super();
    this.database = Database.getEntityDatabaseInstance('beneficiaries');
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