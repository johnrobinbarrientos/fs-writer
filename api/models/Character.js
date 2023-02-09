'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Character extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_characters'
  }

  static relationMappings = {
    book: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_characters.book_id',
        to: 'books.uuid'
      }
    },
    scene_item: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneCharacter'),
      join: {
        from: 'book_characters.uuid',
        to: 'book_scene_characters.book_character_id'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Character
}
