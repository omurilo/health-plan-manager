import BaseEntity from "../base-entity.js";

import Database from "../../../database/index.js";

export default class Clients extends BaseEntity {
  constructor() {
    super();
    this.database = Database.getEntityDatabaseInstance('clients');
  }
}