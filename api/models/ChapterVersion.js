'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class ChapterVersion extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapter_versions'
  }
  
  
  static relationMappings = {
    chapter: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Chapter'),
      join: {
        to: 'book_chapter_versions.chapter_id',
        from: 'book_chapters.uuid'
      },
      softDelete: false
    }
  };
}

module.exports = {
  ChapterVersion
}
