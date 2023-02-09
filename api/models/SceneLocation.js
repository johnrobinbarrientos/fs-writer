'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class SceneLocation extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scene_locations'
  }

  static relationMappings = {
    scene: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Scene'),
      join: {
        from: 'book_scene_locations.book_scene_id',
        to: 'book_scenes.uuid'
      }
    },
    location: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Location'),
      join: {
        from: 'book_scene_locations.book_location_id',
        to: 'book_locations.uuid'
      }
    }
  }
}

module.exports = {
  SceneLocation
}
