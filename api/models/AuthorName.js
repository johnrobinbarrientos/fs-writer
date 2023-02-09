'use strict'

const { BaseModel } = require('./BaseModel')

class AuthorName extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'author_names'
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  AuthorName
}
