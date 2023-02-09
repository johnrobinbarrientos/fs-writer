'use strict'
const path = require('path')
const moment = require('moment')

// eslint-disable-next-line no-unused-vars
const { AuthorPersonalProgress, User } = require(path.join(__dirname, '..', 'models'))

class AuthorPersonalProgressController {
  static async getAuthorPersonalProgress (data) {
    const queryBuilder = AuthorPersonalProgress.query()
      .where('author_id', data.authorId)
      .where('relation_id', data.relationId)
      .where('is_for', data.isFor)
      .whereNull('deleted_at')

    if (data.date === 'today') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-MM-DD').toString() + '%')
    }

    let authorPersonalProgress = await queryBuilder.orderBy('created_at', 'DESC').first()

    return authorPersonalProgress
  }

  static async getAuthorPersonalProgressWordsCount (authorId, date) {
    const queryBuilder = AuthorPersonalProgress.query()
      .sum('total_words as words_count')
      .where('author_id', authorId)
      .whereNull('deleted_at')

    if (date === 'today') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-MM-DD').toString() + '%')
    } else if (date === 'monthly') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-MM-').toString() + '%')
    } else if (date === 'yearly') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-').toString() + '%')
    }

    let authorPersonalProgress = await queryBuilder.orderBy('created_at', 'DESC').first()

    return authorPersonalProgress
  }

  static async save (data) {
    if (data.updated_at !== 'undefined' && data.updated_at !== null) {
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    }

    const saveAuthorPersonalProgress = await AuthorPersonalProgress.query().upsertGraph([data]).first()

    return saveAuthorPersonalProgress
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = await AuthorPersonalProgress.query()
      .where('author_id', user.author.uuid)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      author_id: row.author_id,
      relation_id: row.relation_id,
      total_words: row.total_words,
      is_for: row.is_for,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at
    }

    var data = await AuthorPersonalProgress.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await AuthorPersonalProgress.query().insert(columns)

      // update uuid to match web
      data = await AuthorPersonalProgress.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  AuthorPersonalProgressController
}
