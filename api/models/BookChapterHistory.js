'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookChapterHistory extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapter_history'
  }

  static get idColumn () { return ['uuid'] }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Chapter'),
      join: {
        from: 'book_chapter_history.chapter_id',
        to: 'book_chapters.uuid'
      }
    }
  }
}

module.exports = {
  BookChapterHistory
}
