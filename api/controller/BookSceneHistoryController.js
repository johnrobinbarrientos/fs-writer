'use strict'
const path = require('path')

// eslint-disable-next-line no-unused-vars
const { BookSceneHistory } = require(path.join(__dirname, '..', 'models'))

class BookSceneHistoryController {
  static async getAllSceneHistoryBySceneId (sceneId) {
    const sceneHistory = BookSceneHistory.query()
      .where('scene_id', sceneId)
      .orderBy('created_at', 'DESC')

    return sceneHistory
  }
  static async save (data) {
    const saveBookSceneHistory = await BookSceneHistory.query().upsertGraph([data]).first()

    return saveBookSceneHistory
  }
}

module.exports = {
  BookSceneHistoryController
}
