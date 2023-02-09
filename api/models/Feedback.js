'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class Feedback extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'feedbacks'
  }

  static relationMappings = {
    feedback_responses: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'FeedbackResponse'),
      join: {
        from: 'feedbacks.uuid',
        to: 'feedback_responses.feedback_id'
      },
      softDelete: true
    },
    author: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'AuthorName'),
      join: {
        from: 'feedbacks.author_id',
        to: 'author_names.uuid'
      },
      softDelete: false
    },
    chapter: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Chapter'),
      join: {
        from: 'feedbacks.parent_id',
        to: 'book_chapters.uuid'
      },
      softDelete: false
    },
    scene: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Scene'),
      join: {
        from: 'feedbacks.parent_id',
        to: 'book_scenes.uuid'
      },
      softDelete: false
    },
    book: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'feedbacks.parent_id',
        to: 'books.uuid'
      },
      softDelete: false
    }
  };
}

module.exports = {
  Feedback
}
