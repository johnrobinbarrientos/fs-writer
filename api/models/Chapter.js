'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Chapter extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapters'
  }

  static relationMappings = {
    chapter_version: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'ChapterVersion'),
      join: {
        from: 'book_chapters.uuid',
        to: 'book_chapter_versions.chapter_id'
      },
      softDelete: true
    },
    book: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_chapters.book_id',
        to: 'books.uuid'
      },
      softDelete: false
    }
  };
}

module.exports = {
  Chapter
}
