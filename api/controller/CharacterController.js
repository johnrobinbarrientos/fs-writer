'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Character, RelationDetail, User } = require(path.join(__dirname, '..', 'models'))

class CharacterController {
  static getAllByBookId (param) {
    var characters = Character.query()
      .where('book_id', param.bookId)
      .where('fullname', 'like', '%' + param.search + '%')
      .withGraphJoined('book')
      .whereNull('book_characters.deleted_at')

    return characters
  }

  static getByCharacterId (characterId) {
    var character = Character.query()
      .withGraphJoined('book')
      .findById(characterId)

    return character
  }

  static async save (data) {
    const saveCharacters = await Character.query().upsertGraph([data]).first()

    const character = Character.query()
      .withGraphJoined('book')
      .findById(saveCharacters.uuid)

    return character
  }

  static async delete (characterId) {
    const character = await Character.query().softDeleteById(characterId)

    await RelationDetail.query()
      .where('character_id', characterId)
      .orWhere('character_relation_id', characterId)
      .patch({
        deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString()
      })

    return character
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

    const rows = await Character.query()
      .whereIn('book_id', bookUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      book_id: row.book_id,
      shortname: row.shortname,
      fullname: row.fullname,
      nickname: row.nickname,
      birthdate: row.birthdate,
      occupation: row.occupation,
      description: row.description,
      bio: row.bio,
      goals: row.goals,
      picture: row.picture,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }
    var data = await Character.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Character.query().insert(columns)

      // update uuid to match web
      data = await Character.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  CharacterController
}
