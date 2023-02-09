'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Lesson extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'lessons'
  }

  static relationMappings = {
    lesson_documents: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'LessonDocument'),
      join: {
        from: 'lessons.uuid',
        to: 'lesson_documents.lesson_id'
      },
      softDelete: true
    },
    course: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'lessons.course_id',
        to: 'cources.uuid'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Lesson
}
