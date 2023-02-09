'use strict'

const { BaseModel } = require('./BaseModel')

class ChapterFeedbackResponse extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapter_feedback_responses'
  }
}

module.exports = {
  ChapterFeedbackResponse
}
