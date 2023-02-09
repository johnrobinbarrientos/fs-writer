'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class SceneCharacter extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scene_characters'
  }

  static relationMappings = {
    scene: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Scene'),
      join: {
        from: 'book_scene_characters.book_scene_id',
        to: 'book_scenes.uuid'
      }
    },
    character: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Character'),
      join: {
        from: 'book_scene_characters.book_character_id',
        to: 'book_characters.uuid'
      }
    }
  }
}

module.exports = {
  SceneCharacter
}
