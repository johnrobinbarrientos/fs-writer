'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Item extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_items'
  }

  static relationMappings = {
    book: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_items.book_id',
        to: 'books.uuid'
      }
    },
    scene_item: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneItem'),
      join: {
        from: 'book_items.uuid',
        to: 'book_scene_items.book_item_id'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Item
}
