'use strict'
const path = require('path')

const { User, Book, Item } = require(path.join(__dirname, '..', 'models'))

class ItemController {
  static getAllByBookId (param) {
    var items = Item.query()
      .where('book_id', param.bookId)
      .where('itemname', 'like', '%' + param.search + '%')
      .withGraphJoined('book')
      .whereNull('book_items.deleted_at')

    return items
  }

  static getByItemId (itemId) {
    var item = Item.query()
      .withGraphJoined('book')
      .findById(itemId)

    return item
  }

  static async save (data) {
    const saveItem = await Item.query().upsertGraph([data]).first()

    const item = Item.query()
      .withGraphJoined('book')
      .findById(saveItem.uuid)

    return item
  }

  static async delete (itemId) {
    const item = await Item.query().softDeleteById(itemId)

    return item
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

    const rows = await Item.query()
      .whereIn('book_id', bookUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      book_id: row.book_id,
      itemname: row.itemname,
      description: row.description,
      AKA: row.AKA,
      tags: row.tags,
      pictures: row.pictures,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await Item.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Item.query().insert(columns)

      // update uuid to match web
      data = await Item.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ItemController
}
