'use strict'
const path = require('path')

const { Relation, User } = require(path.join(__dirname, '..', 'models'))

class RelationController {
  static async getAll () {
    const relations = await Relation.query()
      .orderBy('created_at')
      .whereNull('deleted_at')

    return relations
  }

  static async save (data) {
    const save = await Relation.query().upsertGraph([data]).first()
    return save
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = Relation.query()
      .where('author_id', user.author.uuid)
      .where('updated_at', '>', user.synced_at)
      // .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      author_id: row.author_id,
      relation: row.relation,
      opposite: row.opposite,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await Relation.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Relation.query().insert(columns)

      // update uuid to match web
      data = await Relation.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  RelationController
}
