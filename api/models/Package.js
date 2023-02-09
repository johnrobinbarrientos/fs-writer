'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Package extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'packages'
  }

  static relationMappings = {
    course: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'packages.course_id',
        to: 'courses.uuid'
      }
    },
    course_taken: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'CoursesTaken'),
      join: {
        from: 'packages.uuid',
        to: 'courses_taken.package_id'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Package
}
