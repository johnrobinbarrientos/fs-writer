'use strict'

const { BaseModel } = require('./BaseModel')

class BookFeedback extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_feedbacks'
  }
}

module.exports = {
  BookFeedback
}
