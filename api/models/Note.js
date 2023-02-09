'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class Note extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'notes'
  }

  static relationMappings = {
    author: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Author'),
      join: {
        from: 'notes.author_id',
        to: 'authors.uuid'
      },
      softDelete: false
    },
    chapter: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Chapter'),
      join: {
        from: 'notes.parent_id',
        to: 'book_chapters.uuid'
      },
      softDelete: false
    },
    scene: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Scene'),
      join: {
        from: 'notes.parent_id',
        to: 'book_scenes.uuid'
      },
      softDelete: false
    },
    book: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'notes.parent_id',
        to: 'books.uuid'
      },
      softDelete: false
    }
  };
}

module.exports = {
  Note
}
