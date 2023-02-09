'use strict'
const path = require('path')

const { BookGenre } = require(path.join(__dirname, '..', 'models'))

class BookGenreController {
  static async save (data) {
    const saveGenre = await BookGenre.query().upsertGraph([data]).first()

    return saveGenre
  }

  static async sync (row) {
    var data = await BookGenre.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await BookGenre.query().insert(row)

      // update uuid to match web
      data = await BookGenre.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  BookGenreController
}
