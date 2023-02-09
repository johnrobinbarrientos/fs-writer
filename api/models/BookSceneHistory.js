'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookSceneHistory extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scene_history'
  }

  static get idColumn () { return ['uuid'] }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Scene'),
      join: {
        from: 'book_scene_history.scene_id',
        to: 'book_scenes.uuid'
      }
    }
  }
}

module.exports = {
  BookSceneHistory
}
