'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class AssignmentManuscript extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'assignment_manuscripts'
  }

  static get idColumn () { return ['uuid'] }

  static relationMappings = {
    assignments: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'assignments.assignment_id',
        to: 'assignment_manuscripts.uuid'
      }
    }
  }
}

module.exports = {
  AssignmentManuscript
}
