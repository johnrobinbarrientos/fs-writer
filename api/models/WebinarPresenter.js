'use strict'

const { BaseModel } = require('./BaseModel')

class WebinarPresenter extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'webinar_presenters'
  }
}

module.exports = {
  WebinarPresenter
}
