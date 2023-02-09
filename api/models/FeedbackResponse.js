'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class FeedbackResponse extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'feedback_responses'
  }

  static relationMappings = {
    author: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'AuthorName'),
      join: {
        from: 'feedback_responses.author_id',
        to: 'author_names.uuid'
      },
      softDelete: false
    }
  };
}

module.exports = {
  FeedbackResponse
}
