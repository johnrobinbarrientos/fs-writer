'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class AuthorPersonalProgress extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'author_personal_progress'
  }

  static get idColumn () { return ['uuid'] }

  static relationMappings = {
    authors: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'User'),
      join: {
        from: 'author_personal_progress.author_id',
        to: 'authors.uuid'
      }
    }
  }
}

module.exports = {
  AuthorPersonalProgress
}
