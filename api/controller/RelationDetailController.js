'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Character, RelationDetail, User } = require(path.join(__dirname, '..', 'models'))

class RelationDetailController {
  static getRelationDetailByCharacterId (characterId) {
    var relationDetail = RelationDetail.query()
      .withGraphFetched('character_relation')
      .withGraphFetched('relation')
      .where('book_relation_details.character_id', characterId)
      .whereNull('book_relation_details.deleted_at')
      .orderBy('created_at')

    return relationDetail
  }

  static async save (data) {
    const save = await RelationDetail.query().upsertGraph([data])
      .withGraphFetched('character_relation')
      .withGraphFetched('relation')
      .first()

    let oppositeData = {
      relation_id: data.relation_id,
      character_id: data.character_relation_id,
      character_relation_id: data.character_id,
      is_opposite: 1
    }
    await RelationDetail.query().upsertGraph([oppositeData])
      .withGraphFetched('character_relation')
      .withGraphFetched('relation')
      .first()

    return save
  }

  static async delete (relationDetailId) {
    // const relationDetail = await RelationDetail.query().softDeleteById(relationDetailId)
    let relationDetail = await RelationDetail.query().findById(relationDetailId)

    await RelationDetail.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('relation_id', relationDetail.relation_id)
      .where('character_id', relationDetail.character_relation_id)
      .where('character_relation_id', relationDetail.character_id)
      .where('is_opposite', 1)
      .whereNull('deleted_at')

    let data = await RelationDetail.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('uuid', '=', relationDetailId)

    return data
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

    const characters = await Character.query()
      .whereIn('book_id', bookUUIDs)
      .whereNull('deleted_at')

    var characterUUIDs = []

    for (let i = 0; i < characters.length; i++) {
      characterUUIDs.push(characters[i].uuid)
    }

    const rows = await RelationDetail.query()
      .where(builder => {
        builder
          .whereIn('character_id', characterUUIDs)
          .orWhereIn('character_relation_id', characterUUIDs)
      })
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      relation_id: row.relation_id,
      character_id: row.character_id,
      character_relation_id: row.character_relation_id,
      is_opposite: row.is_opposite,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await RelationDetail.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await RelationDetail.query().insert(columns)

      // update uuid to match web
      data = await RelationDetail.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }
    return data
  }
}

module.exports = {
  RelationDetailController
}
