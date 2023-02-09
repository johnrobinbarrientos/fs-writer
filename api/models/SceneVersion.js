'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class SceneVersion extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scene_versions'
  }

  static relationMappings = {
    scene: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Scene'),
      join: {
        from: 'book_scene_versions.book_scene_id',
        to: 'book_scenes.uuid'
      }
    }
  }
}

module.exports = {
  SceneVersion
}
