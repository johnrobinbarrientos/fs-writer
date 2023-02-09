'use strict'

const { BaseModel } = require('./BaseModel')

class Notification extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'notifications'
  }
}

module.exports = {
  Notification
}
