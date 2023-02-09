'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class RelationDetail extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_relation_details'
  }

  static relationMappings = {
    character: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Character'),
      join: {
        from: 'book_relation_details.character_id',
        to: 'book_characters.uuid'
      }
    },
    character_relation: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Character'),
      join: {
        from: 'book_relation_details.character_relation_id',
        to: 'book_characters.uuid'
      }
    },
    relation: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Relation'),
      join: {
        from: 'book_relation_details.relation_id',
        to: 'book_relations.uuid'
      }
    }
  }
}

module.exports = {
  RelationDetail
}
