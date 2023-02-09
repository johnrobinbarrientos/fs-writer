'use strict'
const path = require('path')

const { WebinarPresenter, User } = require(path.join(__dirname, '..', 'models'))

class WebinarPresenterController {
  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = await WebinarPresenter.query()
      .select('webinar_presenters.*')
      .join('webinars', 'webinars.id', 'webinar_presenters.webinar_id')
      .join('courses', 'courses.uuid', 'webinars.course_id')
      .join('packages', 'packages.course_id', 'courses.uuid')
      .join('courses_taken', 'courses_taken.package_id', 'packages.uuid')
      .where('courses_taken.user_id', user.uuid)
      .where('webinar_presenters.updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      webinar_id: row.webinar_id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      image: row.image,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at
    }

    var data = await WebinarPresenter.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await WebinarPresenter.query().insert(columns)

      // update uuid to match web
      data = await WebinarPresenter.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  WebinarPresenterController
}
