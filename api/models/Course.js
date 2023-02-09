'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Course extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'courses'
  }

  static relationMappings = {
    lessons: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'Lesson'),
      join: {
        from: 'courses.uuid',
        to: 'lessons.course_id'
      },
      softDelete: true
    },
    webinars: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'Webinar'),
      join: {
        from: 'courses.uuid',
        to: 'webinars.course_id'
      },
      softDelete: true
    },
    package: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'Package'),
      join: {
        from: 'courses.uuid',
        to: 'packages.course_id'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Course
}
