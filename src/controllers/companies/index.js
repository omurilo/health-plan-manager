export default class CompaniesController {
  constructor({ service }) {
    this.service = service
  }

  create(data) {
    return this.service.create(data)
  }

  get(id) {
    return this.service.get(id)
  }

  find(query) {
    return this.service.find(query)
  }
}