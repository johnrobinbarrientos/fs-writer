'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookGenreCollection extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_genre_collections'
  }

  static relationMappings = {
    book_genre: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'BookGenre'),
      join: {
        from: 'book_genre_collections.genre_id',
        to: 'book_genres.uuid'
      }
    },
    book: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_genre_collections.book_id',
        to: 'books.uuid'
      }
    }
  };
}

module.exports = {
  BookGenreCollection
}
