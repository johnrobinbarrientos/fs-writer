'use strict'

const { BaseModel } = require('./BaseModel')

class Relation extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_relations'
  }
}

module.exports = {
  Relation
}
