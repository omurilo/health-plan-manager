import BaseEntity from "../base-entity.js";

export default class Companies extends BaseEntity {
  constructor({ database }) {
    super();
    this.database = database.getEntityDatabaseInstance('companies');
  }
}