const { Model } = require('objection')
const moment = require('moment')
const { v1: uuidv1 } = require('uuid')

class BaseModel extends Model {
  $beforeInsert (queryContext) {
    this.created_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    this.uuid = uuidv1()
  }

  $beforeUpdate (opt, queryContext) {
    this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  BaseModel
}
