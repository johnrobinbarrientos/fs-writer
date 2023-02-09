'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')
const moment = require('moment')

class CoursesTaken extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'courses_taken'
  }

  static get virtualAttributes () {
    return ['has_started', 'has_ended']
  }

  // eslint-disable-next-line camelcase
  get has_started () {
    return (this.started_at || this.started_at !== 0)
  }

  // eslint-disable-next-line camelcase
  get has_ended () {
    if (!this.end_date) {
      let date = moment(this.end_date)
      return date.diff(moment(), 'years') >= 1
    } else {
      let date = moment(this.end_date)
      if (moment().isSameOrAfter(date)) {
        return true
      }
    }

    return false
  }

  static relationMappings = {
    package: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Package'),
      join: {
        from: 'courses_taken.package_id',
        to: 'packages.uuid'
      }
    },
    course: {
      relation: BaseModel.HasOneThroughRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'courses_taken.package_id',
        through: {
          from: 'packages.uuid',
          to: 'packages.course_id'
        },
        to: 'courses.uuid'
      },
      softDelete: true
    }
  }
}

module.exports = {
  CoursesTaken
}
