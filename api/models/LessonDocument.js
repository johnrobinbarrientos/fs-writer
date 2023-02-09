'use strict'

// const path = require('path')

const { BaseModel } = require('./BaseModel')

class LessonDocument extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'lesson_documents'
  }

  static relationMappings = {}
}

module.exports = {
  LessonDocument: LessonDocument
}
