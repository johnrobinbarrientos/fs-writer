'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')
const moment = require('moment')

class Webinar extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'webinars'
  }

  static get virtualAttributes () {
    return ['start_date_hour_diff', 'user_webinar_registrant']
  }

  // eslint-disable-next-line camelcase
  get start_date_hour_diff () {
    let startDate = moment(this.start_date)
    return startDate.diff(moment(), 'hours')
  }

  static relationMappings = {
    webinar_presenters: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'WebinarPresenter'),
      join: {
        from: 'webinars.uuid',
        to: 'webinar_presenters.webinar_id'
      },
      softDelete: true
    },
    webinar_registrant: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'WebinarRegistrant'),
      join: {
        from: 'webinars.uuid',
        to: 'webinar_registrants.webinar_id'
      },
      softDelete: true
    },
    course: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'webinars.course_id',
        to: 'courses.uuid'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Webinar
}
