'use strict'
const path = require('path')

const { User, Book, BookGenre } = require(path.join(__dirname, '..', 'models'))

class BookController {
  static async getAllBooksByUserId (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = Book.query()
      .withGraphJoined('book_genre_collection')
      .modifyGraph('book_genre_collection', builder => {
        builder.whereNull('deleted_at')
      })
      .withGraphJoined('genre')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .whereNull('book_genre_collection.deleted_at')

    return books
  }

  static getAllBookGenres () {
    const genres = BookGenre.query()

    return genres
  }

  static getBookById (bookId) {
    /*
    * User modifyGraph to add condition for the related table
    * using whereNull directly to query pointing to relatedColumn will return NULL if related table return is NULL
    * */
    const book = Book.query().findById(bookId)
      .withGraphJoined('book_genre_collection')
      // .whereNull('book_genre_collection.deleted_at')
      .modifyGraph('book_genre_collection', builder => {
        builder.whereNull('deleted_at')
      })

    return book
  }

  static async save (data) {
    const saveBook = await Book.query().upsertGraph([data]).first()

    /*
    * Using .withGraphJoined('genre') will show all the genre with deleted_at of book_genre_collection
    * */
    // TODO : enhance withGraphJoined using modifyGraph through book_genre_collection deleted_at null
    // const book = Book.query()
    //   .withGraphJoined('genre')
    //   .findById(saveBook.uuid)

    const bookModel = await this.getBookById(saveBook.uuid)
    const genre = []
    const genres = await BookController.getAllBookGenres()

    // TODO : duplicate implementation in api/routes/users.js:59
    bookModel.book_genre_collection.forEach(function (collection, indx) {
      if (genres.find(x => (x.uuid === collection.genre_id)) !== undefined) {
        var selectedGenre = genres.find(x => (x.uuid === collection.genre_id))
        genre.push({
          uuid: selectedGenre.uuid,
          name: selectedGenre.name
        })
      }
    })
    bookModel.genre = genre
    return bookModel
  }

  static async delete (bookId) {
    const book = await Book.query().softDeleteById(bookId)

    return book
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = Book.query()
      .where('author_id', user.author.uuid)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      author_id: row.author_id,
      title: row.title,
      about: row.about,
      numbered_chapter: row.numbered_chapter,
      is_default: row.is_default,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await Book.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Book.query().insert(columns)

      // update uuid to match web
      data = await Book.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  BookController
}
