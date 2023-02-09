'use strict'
const path = require('path')

const { Book, Location, User } = require(path.join(__dirname, '..', 'models'))

class LocationController {
  static getAllByBookId (param) {
    var locations = Location.query()
      .where('book_id', param.bookId)
      .where('location', 'like', '%' + param.search + '%')
      .withGraphJoined('book')
      .whereNull('book_locations.deleted_at')

    return locations
  }

  static getByLocationId (locationId) {
    var location = Location.query()
      .withGraphJoined('book')
      .findById(locationId)

    return location
  }

  static async save (data) {
    const saveLocation = await Location.query().upsertGraph([data]).first()

    const location = Location.query()
      .withGraphJoined('book')
      .findById(saveLocation.uuid)

    return location
  }

  static async delete (locationId) {
    const location = await Location.query().softDeleteById(locationId)

    return location
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

    const rows = await Location.query()
      .whereIn('book_id', bookUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      book_id: row.book_id,
      location: row.location,
      description: row.description,
      AKA: row.AKA,
      tags: row.tags,
      pictures: row.pictures,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await Location.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Location.query().insert(columns)

      // update uuid to match web
      data = await Location.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  LocationController
}
