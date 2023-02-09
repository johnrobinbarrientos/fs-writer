'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Scene, SceneItem, User } = require(path.join(__dirname, '..', 'models'))

class SceneItemController {
  static getAllSceneItemsBySceneId (sceneId) {
    const sceneItem = SceneItem.query()
      .withGraphFetched('item')
      .where('book_scene_id', sceneId)
      .whereNull('book_scene_items.deleted_at')

    return sceneItem
  }

  static async delete (sceneItemId) {
    const sceneItem = await SceneItem.query().softDeleteById(sceneItemId)
    return sceneItem
  }

  static async save (data) {
    const save = await SceneItem.query().upsertGraph([data])
      .withGraphFetched('scene')
      .withGraphFetched('item')
      .first()

    return save
  }

  static async saveBatch (data) {
    // eslint-disable-next-line no-unused-vars
    var items = await SceneItem.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('book_scene_id', '=', data.book_scene_id)
      .whereNotIn('book_item_id', data.rows)

    var count = 0
    for (let i = 0; i < data.rows.length; i++) {
      var row = data.rows[i]

      // eslint-disable-next-line no-redeclare
      var saved = await SceneItem.query()
        .patch({ deleted_at: null, book_scene_id: data.book_scene_id, book_item_id: row })
        .where('book_scene_id', '=', data.book_scene_id)
        .where('book_item_id', '=', row)

      if (!saved || saved === 0) {
        saved = await SceneItem.query().insert({ book_scene_id: data.book_scene_id, book_item_id: row })
      }

      count++
    }

    return count
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const scenes = await Scene.query()
      .whereIn('book_id', bookUUIDs)
      .whereNull('deleted_at')

    var sceneUUIDs = []

    for (let i = 0; i < scenes.length; i++) {
      sceneUUIDs.push(scenes[i].uuid)
    }

    const rows = await SceneItem.query()
      .whereIn('book_scene_id', sceneUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      book_scene_id: row.book_scene_id,
      book_item_id: row.book_item_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await SceneItem.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await SceneItem.query().insert(columns)

      // update uuid to match web
      data = await SceneItem.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneItemController
}
