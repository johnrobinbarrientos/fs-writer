'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Location extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_locations'
  }

  static relationMappings = {
    book: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_locations.book_id',
        to: 'books.uuid'
      }
    },
    scene_location: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneLocation'),
      join: {
        from: 'book_locations.uuid',
        to: 'book_scene_locations.book_location_id'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Location
}
