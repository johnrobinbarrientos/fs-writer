'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class ChapterFeedback extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapter_feedbacks'
  }

  static relationMappings = {
    chapter_feedback_responses: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'ChapterFeedbackResponse'),
      join: {
        from: 'book_chapter_feedbacks.uuid',
        to: 'book_chapter_feedback_responses.chapter_feedback_id'
      },
      softDelete: true
    }
  };
}

module.exports = {
  ChapterFeedback
}
