'use strict'
const path = require('path')

const { Notification } = require(path.join(__dirname, '..', 'models'))

class NotificationController {
  static async getAll (authorUuid) {
    var notification = Notification.query()
      .where('user_id', authorUuid)
      .whereNull('deleted_at').orderBy('created_at', 'desc')

    for (var i = 0; i < notification.length; i++) {
      try {
        notification[i]['data'] = JSON.parse(notification[i]['data'])
      } catch (e) {
        notification[i]['data'] = {}
      }
    }

    return notification
  }

  static async save (data) {
    const notification = await Notification.query().upsertGraphAndFetch([data]).first()

    return notification
  }

  static async read (notificationId) {
    const notification = await Notification.query().upsertGraphAndFetch([{uuid: notificationId, is_seen: true}]).first()

    return notification
  }
}
module.exports = {
  NotificationController
}
