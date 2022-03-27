export default class BaseEntity {
  create(data) {
    return this.database.create(data);
  }

  find(query) {
    return this.database.find(query);
  }

  get(code) {
    return this.database.get(code);
  }
}