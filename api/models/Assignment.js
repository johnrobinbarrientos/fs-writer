'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Assignment extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'assignments'
  }

  static get idColumn () { return ['uuid'] }

  static relationMappings = {
    courses: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'assignments.course_id',
        to: 'courses.uuid'
      }
    }
  }
}

module.exports = {
  Assignment
}
