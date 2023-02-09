'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Scene extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scenes'
  }

  static relationMappings = {
    scene_version: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneVersion'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_versions.book_scene_id'
      },
      softDelete: true
    },
    scene_character: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneCharacter'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_characters.book_scene_id'
      },
      softDelete: true
    },
    scene_location: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneLocation'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_locations.book_scene_id'
      },
      softDelete: true
    },
    scene_item: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneItem'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_items.book_scene_id'
      },
      softDelete: true
    },
    book: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_scenes.book_id',
        to: 'books.uuid'
      },
      softDelete: false
    },
    chapter: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Chapter'),
      join: {
        from: 'book_scenes.chapter_id',
        to: 'book_chapters.uuid'
      },
      softDelete: false
    }
  }
}

module.exports = {
  Scene
}
