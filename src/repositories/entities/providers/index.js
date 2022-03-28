import BaseEntity from "../base-entity.js";

export default class Providers extends BaseEntity {
  constructor({ database }) {
    super();
    this.database = database.getEntityDatabaseInstance('providers');
  }
}