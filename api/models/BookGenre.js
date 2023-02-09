'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookGenre extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_genres'
  }

  static relationMappings = {
    book_genre_collection: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'BookGenreCollection'),
      join: {
        from: 'book_genres.uuid',
        to: 'book_genre_collections.genre_id'
      }
    }
  };
}

module.exports = {
  BookGenre
}
