'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Author extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'authors'
  }

  static get idColumn () { return ['uuid'] }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'User'),
      join: {
        from: 'authors.user_id',
        to: 'users.uuid'
      }
    }
  }
}

module.exports = {
  Author
}
