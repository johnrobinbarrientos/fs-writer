'use strict'
const path = require('path')

const { WebinarRegistrant, User } = require(path.join(__dirname, '..', 'models'))

class WebinarRegistrantController {
  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = await WebinarRegistrant.query()
      .select('webinar_registrants.*')
      .where('webinar_registrants.user_id', user.uuid)
      .where('webinar_registrants.updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      webinar_id: row.webinar_id,
      user_id: row.user_id,
      join_url: row.join_url,
      created_at: row.created_at,
      updated_at: row.updated_at
    }

    var data = await WebinarRegistrant.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await WebinarRegistrant.query().insert(columns)

      // update uuid to match web
      data = await WebinarRegistrant.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  WebinarRegistrantController
}
