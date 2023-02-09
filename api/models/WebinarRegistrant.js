'use strict'

const { BaseModel } = require('./BaseModel')

class WebinarRegistrant extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'webinar_registrants'
  }
}

module.exports = {
  WebinarRegistrant
}
